/* ================================
   ELEMENT REFERENCES
================================ */
const enterBtn = document.getElementById('enter-btn');
const entranceScreen = document.getElementById('entrance-screen');
const videoContainer = document.getElementById('video-container');
const introVideo = document.getElementById('intro-video');
const muteBtn = document.getElementById('mute-btn');
const skipBtn = document.getElementById('skip-btn');

const cursor = document.querySelector('.cursor');
const clickSound = document.getElementById('click-sound');

/* ================================
   COUNTDOWN TIMER (home.html)
================================ */
// Countdown to 7th April 2026, 10:00 AM
const eventDate = new Date("April 7, 2026 10:00:00").getTime();

function updateCountdown() {
    const daysEl = document.getElementById("days");
    const hoursEl = document.getElementById("hours");
    const minutesEl = document.getElementById("minutes");
    const secondsEl = document.getElementById("seconds");
    const countdownBoxed = document.getElementById("countdown-boxed");

    if (!daysEl || !hoursEl || !minutesEl || !secondsEl || !countdownBoxed) return;

    const now = new Date().getTime();
    const distance = eventDate - now;

    if (distance < 0) {
        countdownBoxed.innerHTML = "<p>Event Started!</p>";
        clearInterval(countdownInterval);
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl.textContent = String(days).padStart(2, "0");
    hoursEl.textContent = String(hours).padStart(2, "0");
    minutesEl.textContent = String(minutes).padStart(2, "0");
    secondsEl.textContent = String(seconds).padStart(2, "0");
}

const countdownInterval = setInterval(updateCountdown, 1000);
updateCountdown(); // initial call

/* ================================
   CUSTOM CURSOR
================================ */

/* ================================
   CLICK SOUND
================================ */
if (clickSound) {
    clickSound.volume = 0.6;
    let audioUnlocked = false;
    document.addEventListener('mousedown', () => {
        if (!audioUnlocked) {
            clickSound.play().catch(() => { });
            audioUnlocked = true;
        } else {
            clickSound.currentTime = 0;
            clickSound.play().catch(() => { });
        }
    });
}

/* ================================
   INDEX.HTML VIDEO LOGIC
================================ */
if (enterBtn && entranceScreen && videoContainer && introVideo && muteBtn) {
    // ENTER BUTTON → START VIDEO
    enterBtn.addEventListener('click', () => {
        entranceScreen.classList.add('hidden');
        videoContainer.classList.remove('hidden');

        introVideo.muted = false;
        introVideo.volume = 1;
        muteBtn.classList.remove('muted');

        introVideo.play().catch(err => console.warn('Autoplay blocked:', err));
    });

    // MUTE / UNMUTE TOGGLE
    muteBtn.addEventListener('click', () => {
        introVideo.muted = !introVideo.muted;
        muteBtn.classList.toggle('muted', introVideo.muted);
    });

    // SKIP INTRO
    if (skipBtn) {
        skipBtn.addEventListener('click', () => {
            introVideo.pause();
            transitionToSite();
        });
    }

    // VIDEO ENDED → TRANSITION
    introVideo.addEventListener('ended', transitionToSite);
}

// TRANSITION FUNCTION FOR INDEX.HTML → HOME.HTML
function transitionToSite() {
    if (!videoContainer) {
        window.location.href = "home.html"; // fallback
        return;
    }

    videoContainer.style.transition = "opacity 1s ease";
    videoContainer.style.opacity = "0";

    setTimeout(() => {
        window.location.href = "home.html";
    }, 1000);
}

/* ================================
   HOME.HTML FADE-IN
================================ */
window.addEventListener('DOMContentLoaded', () => {
    const homeContainer = document.getElementById('home-container');

    if (homeContainer) {
        // Start fully transparent
        homeContainer.style.opacity = "0";
        homeContainer.style.transition = "opacity 1.5s ease";

        setTimeout(() => {
            homeContainer.style.opacity = "1";
        }, 100); // slight delay to ensure DOM renders
    }
});
// ================================
// ASH PARTICLES (home.html only)
// ================================
window.addEventListener('DOMContentLoaded', () => {
    const ashContainer = document.getElementById('ash-container');
    if (!ashContainer) return; // Only run on home.html

    const particleCount = 100; // Increase to make more ashes

    for (let i = 0; i < particleCount; i++) {
        const ash = document.createElement('div');
        ash.classList.add('ash');

        // Random size (smaller particles for denser effect)
        const size = Math.random() * 3 + 1; // 1px to 4px
        ash.style.width = `${size}px`;
        ash.style.height = `${size}px`;

        // Random horizontal start position
        ash.style.left = `${Math.random() * 100}vw`;

        // Random animation duration & delay
        const duration = Math.random() * 15 + 5; // 5s to 20s
        ash.style.animationDuration = `${duration}s`;
        ash.style.animationDelay = `${Math.random() * 10}s`;

        // Random opacity
        ash.style.opacity = Math.random() * 0.6 + 0.2; // 0.2 to 0.8

        ashContainer.appendChild(ash);
    }
});
// Only for home.html
const joinBtns = document.querySelectorAll('.join-btn');
joinBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const eventName = encodeURIComponent(btn.getAttribute('data-event'));
        // Redirect to join.html with event name as query param
        window.location.href = `join.html?event=${eventName}`;
    });
});
/* ===== LOGO CLUSTER DYNAMIC LOAD (SAFE + VISIBLE) ===== */
window.addEventListener("DOMContentLoaded", () => {
    const logoCluster = document.getElementById("logo-cluster");
    console.log("Logo cluster found:", logoCluster);

    if (!logoCluster) return;

    const logoFiles = [
        "logo1.png",
        "logo2.png",
        "logo3.png",
        "logo4.png"
    ];

    logoFiles.forEach(file => {
        const logoDiv = document.createElement("div");
        logoDiv.className = "logo-item"; // force class

        const img = document.createElement("img");
        img.src = `logo/${file}`;
        img.alt = file;

        // 🔥 FORCE VISIBILITY (important)
        img.style.display = "block";

        logoDiv.appendChild(img);
        logoCluster.appendChild(logoDiv);

        logoDiv.addEventListener("mouseenter", () => {
            document.querySelectorAll(".logo-item").forEach(item => {
                item.classList.add("shrink");
                item.classList.remove("active");
            });
            logoDiv.classList.add("active");
            logoDiv.classList.remove("shrink");
        });

        logoDiv.addEventListener("mouseleave", () => {
            document.querySelectorAll(".logo-item").forEach(item => {
                item.classList.remove("shrink", "active");
            });
        });
    });
});

// ================================
// ORGANIZERS MODAL LOGIC
// ================================
window.addEventListener('DOMContentLoaded', () => {
    const openBtn = document.getElementById('open-organizers');
    const closeBtn = document.querySelector('.close-modal');
    const modal = document.getElementById('organizers-modal');

    if (openBtn && modal && closeBtn) {
        openBtn.addEventListener('click', (e) => {
            e.preventDefault();
            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Disable scroll
        });

        const closeModal = () => {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto'; // Enable scroll
        };

        closeBtn.addEventListener('click', closeModal);

        // Close on clicking outside the content
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });

        // Close on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });
    }
});

