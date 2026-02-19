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
            clickSound.play().catch(() => {});
            audioUnlocked = true;
        } else {
            clickSound.currentTime = 0;
            clickSound.play().catch(() => {});
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
window.addEventListener("scroll", () => {
    const header = document.querySelector(".main-header");
    if (!header) return;

    if (window.scrollY > 50) {
        header.classList.add("shrink");
    } else {
        header.classList.remove("shrink");
    }
});
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (!target) return;

        target.scrollIntoView({ behavior: 'smooth' });
    });
});

window.addEventListener("scroll", () => {
    let current = "";

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 150;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute("id");
        }
    });

    navLinks.forEach(link => {
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${current}`) {
            link.classList.add("active");
        }
    });
});




document.addEventListener("DOMContentLoaded", () => {
    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".nav-links");
    const navItems = document.querySelectorAll(".nav-links a");

    if (!hamburger || !navLinks) return;

    // Toggle drawer
    hamburger.addEventListener("click", (e) => {
        e.stopPropagation();
        navLinks.classList.toggle("active");
        hamburger.classList.toggle("active");
        document.body.classList.toggle("no-scroll");
    });

    // ✅ Close when clicking a link
    navItems.forEach(link => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("active");
            hamburger.classList.remove("active");
            document.body.classList.remove("no-scroll");
        });
    });

    // ✅ Close when clicking outside
    document.addEventListener("click", (e) => {
        const isInsideNav = navLinks.contains(e.target);
        const isHamburger = hamburger.contains(e.target);

        if (!isInsideNav && !isHamburger) {
            navLinks.classList.remove("active");
            hamburger.classList.remove("active");
            document.body.classList.remove("no-scroll");
        }
    });
});

