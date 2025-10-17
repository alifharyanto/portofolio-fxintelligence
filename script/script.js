const tryAiBtn = document.getElementById('try-ai-btn');
const starIcon = document.getElementById('btn-star-icon');
const logoText = document.getElementById('logo-text');
const logoIcon = document.getElementById('logo-icon');

tryAiBtn.addEventListener('click', () => {
  // Disable button during animation
  tryAiBtn.disabled = true;

  // Start star spin animation on button icon
  starIcon.classList.add('star-anim');

  // Hide logo text and icon initially for reveal later
  logoText.style.opacity = '0';
  logoIcon.style.opacity = '0';

  // After star spin animation (1.2s), reveal FX Intelligence text with glass-like glow and logo icon
  setTimeout(() => {
    starIcon.classList.remove('star-anim');
    // Show logo text and icon with fx-reveal animation
    logoText.classList.add('fx-reveal-text');
    logoText.style.opacity = '1';
    logoIcon.classList.add('fx-reveal-text');
    logoIcon.style.opacity = '1';

    // Re-enable button after animation
    setTimeout(() => {
      tryAiBtn.disabled = false;
      logoText.classList.remove('fx-reveal-text');
      logoIcon.classList.remove('fx-reveal-text');
    }, 1500);
  }, 1200);
});

document.querySelector('#home').scrollIntoView({
  behavior: 'smooth'
});

document.addEventListener("DOMContentLoaded", function () {
  // Intersection Observer untuk fade-in
  const sections = document.querySelectorAll('.fade-in-up');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');

        // Animasi skill bars ketika #technology muncul
        if (entry.target.id === 'technology') {
          const skillBars = entry.target.querySelectorAll('[data-percent]');
          setTimeout(() => {
            skillBars.forEach(bar => {
              const percent = bar.getAttribute('data-percent');
              bar.style.width = percent + '%';
            });
          }, 50); // delay kecil supaya animasi smooth
        }

        observer.unobserve(entry.target); // animasi hanya sekali
      }
    });
  }, { threshold: 0.2 });

  sections.forEach(section => observer.observe(section));
});

const mainTitle = document.getElementById('main-title');

const observerTitle = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show'); // munculkan
      observerTitle.unobserve(entry.target); // sekali saja
    }
  });
}, { threshold: 0.2 });

observerTitle.observe(mainTitle);

// FX INTELLIGENCE PREVIEW
// ================= FX INTELLIGENCE =================
const GEMINI_API_KEY = "AIzaSyCY-Kyt_kM25vQvA59CNySd1wsAufrb9jQ"; // Ganti dengan API key Google Cloud yang aktif

const chatInput = document.getElementById("chat-input");
const chatArea = document.getElementById("chat-area");
const sendBtn = document.getElementById("send-btn");

// Fungsi kirim pesan ke Gemini 2.5 Flash
// Fungsi kirim pesan ke backend (api.php)
async function sendMessage(message) {
  // tampilkan pesan user di UI
  const userDiv = document.createElement("div");
  userDiv.textContent = "You: " + message;
  userDiv.className = "text-right text-[#F39C12]";
  chatArea.appendChild(userDiv);
  chatArea.scrollTop = chatArea.scrollHeight;

  try {
    const response = await fetch("api.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "ai",           // 🧠 wajib dikirim ke PHP
        question: message     // isi pertanyaannya
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    const aiText = data?.answer || data?.error || "No response";

    const aiDiv = document.createElement("div");
    aiDiv.textContent = "FX AI: " + aiText;
    aiDiv.className = "text-left text-white";
    chatArea.appendChild(aiDiv);
    chatArea.scrollTop = chatArea.scrollHeight;

  } catch (err) {
    const errorDiv = document.createElement("div");
    errorDiv.textContent = "Error: " + err.message;
    errorDiv.className = "text-left text-red-500 font-mono";
    chatArea.appendChild(errorDiv);
    chatArea.scrollTop = chatArea.scrollHeight;
    console.error(err);
  }
}



// Event tombol kirim
sendBtn.addEventListener("click", () => {
  const msg = chatInput.value.trim();
  if (msg) {
    sendMessage(msg);
    chatInput.value = "";
  }
});

// Enter key untuk kirim
chatInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendBtn.click();
});



const overlay = document.getElementById("dark-overlay");

window.addEventListener("scroll", () => {
  const scrollPos = window.scrollY;

  if (scrollPos > 200) {
    overlay.style.opacity = "1"; // jadi gelap
  } else {
    overlay.style.opacity = "0"; // hilang lagi
  }
});

window.addEventListener("scroll", () => {
  const scrollPos = window.scrollY;

  if (scrollPos > 200) {
    overlay.style.opacity = "0.6";
    overlay.style.pointerEvents = "none"; // biar spline tetap bisa digerakkin
  } else {
    overlay.style.opacity = "0";
    overlay.style.pointerEvents = "none";
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll("section");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const overlay = entry.target.querySelector(".section-overlay");
      if (overlay) {
        if (entry.isIntersecting) {
          overlay.style.opacity = "0.5"; // saat muncul (gelap)
        } else {
          overlay.style.opacity = "0";   // saat keluar (transparan)
        }
      }
    });
  }, { threshold: 0.3 });

  sections.forEach(section => observer.observe(section));
});
// Bagian Generate Gambar (kiri)
const imgBtn = document.getElementById("img-btn");
const imgInput = document.getElementById("img-input");
const imgResult = document.getElementById("img-result");
imgBtn.addEventListener("click", async () => {
  const prompt = imgInput.value.trim();
  if (!prompt) return alert("Tulis permintaan gambar dulu!");

  imgResult.innerHTML = `<p class="dot-loading">AI Sedang membuat gambar</p>`;

  try {


    const seed = Math.floor(Math.random() * 10000000);
    const model = "turbo"; 
    const enhance = true;    
    const width = 576;        

    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=${width}&seed=${seed}&enhance=${enhance}&nologo=true&model=${model}`;

    setTimeout(() => {
      const fileName = prompt.replace(/[^a-z0-9]/gi, "_").toLowerCase() + ".png";

      imgResult.innerHTML = `
        <img src="${url}" alt="${prompt}" class="rounded-lg shadow-lg max-h-80 object-contain blur-load mb-2">
        <button id="download-btn"
          class="bg-[#F39C12] hover:bg-[#e08c0b] text-black px-4 py-2 rounded font-semibold">Download</button>
      `;

      // Hilangkan blur setelah load
      const imgEl = imgResult.querySelector("img");
      imgEl.onload = () => setTimeout(() => imgEl.classList.add("loaded"), 300);

      // Tombol download → paksa simpan file
      const downloadBtn = document.getElementById("download-btn");
      downloadBtn.addEventListener("click", async () => {
        const response = await fetch(url);
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        window.URL.revokeObjectURL(blobUrl);
      });
    }, 2000);
  } catch (err) {
    imgResult.innerHTML = `<p class="text-red-400">❌ Gagal membuat gambar.</p>`;
    console.error(err);
  }
});

// Bagian Chat AI (kanan)

function appendMessage(text, isUser = false) {
  const msg = document.createElement("div");
  msg.className = `flex ${isUser ? "justify-end" : "justify-start"}`;
  msg.innerHTML = `
    <div class="px-3 py-2 rounded-lg max-w-xs ${isUser ? "bg-[#F39C12] text-black" : "bg-black/40 text-white"}">
      ${text}
    </div>
  `;
  chatArea.appendChild(msg);
  chatArea.scrollTop = chatArea.scrollHeight;
}

sendBtn.addEventListener("click", () => {
  const userMsg = chatInput.value.trim();
  if (!userMsg) return;
  appendMessage(userMsg, true);
  chatInput.value = "";

  // Simulasi balasan AI
  setTimeout(() => {
    appendMessage("Ini jawaban AI untuk: " + userMsg);
  }, 600);
});

document.addEventListener("click", () => {
  const dummy = new Audio();
  dummy.src = "data:audio/mp3;base64,//uQxAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAACcQCA...";
  dummy.volume = 0.001; // tidak terdengar
  dummy.play().then(() => {
    console.log("✅ Autoplay diizinkan!");
  }).catch(() => {
    console.warn("⚠️ Masih belum diizinkan, user harus klik langsung halaman utama.");
  });
}, { once: true });

  function animateProgressBars() {
    document.querySelectorAll('.progress-bar').forEach((bar, i) => {
      const percent = parseInt(bar.getAttribute('data-percent'));
      const counter = bar.parentElement.nextElementSibling; // ambil elemen angka di kanan
      let current = 0;

      // animasi lebar
      bar.style.transition = "width 2s ease-out";
      bar.style.width = percent + "%";

      // animasi angka naik
      const interval = setInterval(() => {
        current++;
        counter.textContent = current + "%";
        if (current >= percent) clearInterval(interval);
      }, 2000 / percent);
    });
  }

  window.addEventListener("load", animateProgressBars);