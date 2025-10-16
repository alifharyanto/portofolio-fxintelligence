// ===== Config =====
const FX_API_URL = "http://localhost:8080/api.php"; // AI backend
const TTS_URL = "http://127.0.0.1:8080/tts";       // TTS backend Python

let isPaused = false;
let speaking = false;
let isListening = false;
let autoplayUnlocked = false;
let isRecognitionRunning = false;

// ===== Unlock autoplay untuk browser =====
document.addEventListener("click", () => {
    if (!autoplayUnlocked) {
        const dummy = new Audio();
        dummy.src = "data:audio/mp3;base64,//uQxAAAAAAAAAAAAAAAAAAAA";
        dummy.volume = 0.001;
        dummy.play().catch(() => {});
        autoplayUnlocked = true;
        console.log("🔓 Autoplay diizinkan oleh user");
    }
}, { once: true });

// ===== Speech Recognition =====
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition;

if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.lang = "id-ID";
    recognition.interimResults = false;
    recognition.continuous = true;

    recognition.onstart = () => {
        console.log("🎤 Speech recognition dimulai...");
        isRecognitionRunning = true;
    };

    recognition.onerror = (e) => {
        console.error("⚠️ Speech error:", e.error);
        isRecognitionRunning = false;
    };

    recognition.onend = () => {
        console.log("🛑 Speech recognition berhenti");
        isRecognitionRunning = false;
        if (isListening && !speaking) setTimeout(() => {
            if (!isRecognitionRunning) recognition.start();
        }, 500);
    };

    recognition.onresult = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript.trim();
        console.log("🗣️ Kamu:", transcript);
        aiRespond(transcript);
    };
} else alert("Browser tidak mendukung Speech Recognition.");

// ===== Tombol Mic =====
const micBtn = document.getElementById("micBtn");
if (micBtn) {
    micBtn.addEventListener("click", () => {
        if (!isListening) {
            isListening = true;
            micBtn.innerHTML = '<i class="fas fa-microphone"></i>';
            if (!isRecognitionRunning) recognition.start();
            console.log("🎙️ Mic diaktifkan");
        } else {
            isListening = false;
            micBtn.innerHTML = '<i class="fas fa-microphone-slash"></i>';
            if (isRecognitionRunning) recognition.stop();
            console.log("🔇 Mic dimatikan");
        }
    });
}

// ===== Fungsi utama respon AI =====
async function aiRespond(text) {
    if (speaking || isPaused) return;
    console.log("📡 Mengirim ke AI:", text);

    const reply = await getAIReply(text);
    console.log("🤖 AI Jawaban Diterima:", reply);

    await speakWithTTS(reply);
}

// ===== Ambil jawaban dari PHP (AI backend) =====
async function getAIReply(question) {
    try {
        const response = await fetch(FX_API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type: "ai", question })
        });
        const data = await response.json();
        return data.answer || "Terjadi kesalahan pada sistem AI.";
    } catch (e) {
        console.error("❌ Gagal ambil respons AI:", e);
        return "Gagal menghubungkan ke server AI.";
    }
}

// ===== TTS via backend Python =====
async function speakWithTTS(message) {
    if (!message || isPaused) return;
    speaking = true;

    try {
        const response = await fetch(TTS_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: message })
        });

        if (!response.ok) throw new Error("Gagal ambil audio TTS");

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);

        audio.onended = () => {
            console.log("🔊 Selesai bicara");
            speaking = false;
            if (isListening && !isRecognitionRunning) recognition.start();
        };

        await audio.play().catch(err => {
            console.warn("⚠️ Autoplay dicegah, klik halaman untuk mengizinkan:", err);
            speaking = false;
        });

    } catch (err) {
        console.error("❌ Error TTS:", err);
        speaking = false;
        if (isListening && !isRecognitionRunning) recognition.start();
    }
}
