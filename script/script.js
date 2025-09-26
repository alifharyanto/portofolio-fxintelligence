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
async function sendMessage(message) {
    // Tampilkan pesan user
    const userDiv = document.createElement("div");
    userDiv.textContent = "You: " + message;
    userDiv.className = "text-right text-[#F39C12]";
    chatArea.appendChild(userDiv);
    chatArea.scrollTop = chatArea.scrollHeight;

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generate?key=${GEMINI_API_KEY}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    prompt: { text: message },  // format terbaru Gemini API
                    temperature: 0.7,
                    maxOutputTokens: 200,
                    candidateCount: 1
                })
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        const aiText = data?.candidates?.[0]?.content || "No response";

        const aiDiv = document.createElement("div");
        aiDiv.textContent = "FX AI: " + aiText;
        aiDiv.className = "text-left text-white";
        chatArea.appendChild(aiDiv);
        chatArea.scrollTop = chatArea.scrollHeight;

    } catch (err) {
        // Tampilkan error di chat area dengan font merah
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
  