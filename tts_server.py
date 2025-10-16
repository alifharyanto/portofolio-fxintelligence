from flask import Flask, request, send_file, jsonify
import requests
from io import BytesIO
from flask_cors import CORS
import time

app = Flask(__name__)
CORS(app)

# ===== Masukkan API Key ElevenLabs di sini =====
ELEVEN_API_KEY = "94bd4d22148f7b081f6a4d47586ced8bb753f5ce9fda7dc5a39a96f8f54fe8d7"
VOICE_ID = "jsCqWAovK2LkecY7zXl4"  # female voice

# Maksimal retry sebelum menyerah (opsional, bisa None untuk infinite retry)
MAX_RETRIES = None
# Delay antar retry dalam detik
RETRY_DELAY = 0.5

def request_tts_with_retry(payload, headers):
    attempt = 0
    while True:
        attempt += 1
        try:
            resp = requests.post(
                f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}",
                json=payload,
                headers=headers,
                timeout=15
            )
            print(f"⚡ Attempt {attempt} - ElevenLabs status code:", resp.status_code)
            if resp.status_code == 200:
                return resp
            else:
                print("⚠️ Response error:", resp.text[:500])
        except Exception as e:
            print(f"⚠️ Exception saat request TTS: {e}")

        if MAX_RETRIES and attempt >= MAX_RETRIES:
            return None

        print(f"⏳ Retry in {RETRY_DELAY} sec...")
        time.sleep(RETRY_DELAY)


@app.route("/tts", methods=["POST"])
def tts():
    data = request.json
    text = data.get("text", "")
    if not text:
        return jsonify({"error": "Text is required"}), 400

    headers = {
        "xi-api-key": ELEVEN_API_KEY,
        "Content-Type": "application/json"
    }
    payload = {
        "text": text,
        "model_id": "eleven_multilingual_v2",
        "voice_settings": {
            "stability": 0.4,
            "similarity_boost": 0.8
        }
    }

    resp = request_tts_with_retry(payload, headers)
    if resp is None:
        return jsonify({"error": "Gagal generate TTS setelah beberapa retry"}), 500

    audio_bytes = BytesIO(resp.content)
    audio_bytes.seek(0)
    return send_file(
        audio_bytes,
        mimetype="audio/mpeg",
        as_attachment=False,
        download_name="tts.mp3"
    )


if __name__ == "__main__":
    print("🚀 Flask TTS server running on http://127.0.0.1:8080")
    app.run(host="0.0.0.0", port=8080, debug=True)
