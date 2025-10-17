<?php
// Ambil data dari POST JSON
$data = json_decode(file_get_contents('php://input'), true);
$text = $data['text'] ?? '';

$ELEVEN_API_KEY = "889f965a180ba029f660b21a9d2608d68a3ed85b868b2b79bbb46ee6ee3b74fb";
$VOICE_ID = "jsCqWAovK2LkecY7zXl4";

// Inisialisasi CURL
$ch = curl_init("https://api.elevenlabs.io/v1/text-to-speech/$VOICE_ID/stream");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "xi-api-key: $ELEVEN_API_KEY",
    "Content-Type: application/json",
    "Accept: audio/mpeg"
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "text" => $text,
    "model_id" => "eleven_multilingual_v2",
    "voice_settings" => ["stability"=>0.4,"similarity_boost"=>0.8]
]));

$result = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($http_code === 200 && $result) {
    header("Content-Type: audio/mpeg");
    echo $result;
} else {
    http_response_code(500);
    echo "Gagal ambil audio dari ElevenLabs";
}
?>
