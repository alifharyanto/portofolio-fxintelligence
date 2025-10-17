
const FX_API_URL = "http://localhost:8080/api.php";

let isPaused = false;
let speaking = false;
let isListening = false;
let autoplayUnlocked = false;
let isRecognitionRunning = false;

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


const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition;

if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.lang = "id-ID";
    recognition.interimResults = false;
    recognition.continuous = true;

    recognition.onstart = () => { console.log("🎤 Speech recognition dimulai..."); isRecognitionRunning = true; };
    recognition.onerror = (e) => { console.error("⚠️ Speech error:", e.error); isRecognitionRunning = false; };
    recognition.onend = () => {
        console.log("🛑 Speech recognition berhenti"); isRecognitionRunning = false;
        if (isListening && !speaking) setTimeout(() => { if (!isRecognitionRunning) recognition.start(); }, 500);
    };
    recognition.onresult = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript.trim();
        console.log("🗣️ Kamu:", transcript);
        aiRespond(transcript);
    };
} else alert("Browser tidak mendukung Speech Recognition.");

// === Tombol Mic ===
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

// === Fungsi utama respon AI ===
async function aiRespond(text) {
    if (speaking || isPaused) return;
    console.log("📡 Mengirim ke AI:", text);
    const reply = await getAIReply(text);
    console.log("🤖 AI Jawaban Diterima:", reply);
    speakWithWebTTS(reply, "id"); // default ID female
}

// === Ambil jawaban dari PHP (→ Python backend) ===
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

function speakWithWebTTS(message, lang = "id", gender = "female") {
    if (!window.speechSynthesis) {
        console.warn("Browser tidak mendukung Speech Synthesis");
        return;
    }
    speaking = true;

    const utter = new SpeechSynthesisUtterance(message);
    utter.lang = lang === "en" ? "en-US" : "id-ID";

    const voices = speechSynthesis.getVoices();

    const selectedVoice = voices.find(v => 
        v.lang.startsWith(utter.lang) &&
        ((gender === "female" && v.name.toLowerCase().includes("female")) ||
         (gender === "male" && v.name.toLowerCase().includes("male")))
    ) || voices.find(v => v.lang.startsWith(utter.lang)) 
      || voices[0];

    utter.voice = selectedVoice;

    utter.onend = () => {
        speaking = false;
        if (isListening && !isRecognitionRunning) recognition.start();
        console.log(`🔊 Selesai bicara dengan voice: ${utter.voice.name}`);
    };

    speechSynthesis.speak(utter);
}

const langBtn = document.getElementById("langBtn");
if (langBtn) {
    langBtn.addEventListener("click", () => {
        const newLang = langBtn.dataset.lang === "id" ? "en" : "id";
        langBtn.dataset.lang = newLang;
        console.log(`🌐 Bahasa TTS diganti menjadi: ${newLang}`);
    });
}

const genderBtn = document.getElementById("genderBtn");
if (genderBtn) {
    genderBtn.addEventListener("click", () => {
        const newGender = genderBtn.dataset.gender === "female" ? "male" : "female";
        genderBtn.dataset.gender = newGender;
        console.log(`🌐 Gender TTS diganti menjadi: ${newGender}`);
    });
}
