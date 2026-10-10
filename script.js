const revealEls = document.querySelectorAll(".reveal");
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });
revealEls.forEach((el) => observer.observe(el));

const startButton = document.getElementById("startJourney");
const journey = document.getElementById("journey");
const beam = document.querySelector(".beam");
startButton?.addEventListener("click", () => {
  beam?.animate(
    [{ opacity: 0, transform: "translateX(-20%) rotate(-19deg)" },
     { opacity: 1, transform: "translateX(15%) rotate(-19deg)", offset: .45 },
     { opacity: 0, transform: "translateX(45%) rotate(-19deg)" }],
    { duration: 1000, easing: "ease-in-out" }
  );
  setTimeout(() => journey?.scrollIntoView({ behavior: "smooth" }), 250);
});

const envelopeWrap = document.getElementById("envelopeWrap");
const openButton = document.getElementById("openEnvelope");
openButton?.addEventListener("click", () => {
  const opened = envelopeWrap.classList.toggle("open");
  openButton.innerHTML = opened ? "الدعوة اتفتحت ✦" : 'افتح الدعوة <span>✦</span>';
  if (opened) {
    setTimeout(() => document.getElementById("invitation")?.scrollIntoView({ behavior: "smooth", block: "start" }), 1300);
  }
});

// Keep a subtle light moving with scroll, without using flashing effects.
window.addEventListener("scroll", () => {
  const trail = document.querySelector(".light-trail");
  if (!trail) return;
  const rect = trail.getBoundingClientRect();
  const dot = document.querySelector(".trail-dot");
  if (dot) {
    const progress = Math.max(0, Math.min(1, (window.innerHeight * 0.7 - rect.top) / (window.innerHeight + rect.height)));
    dot.style.top = `${progress * 75}%`;
  }
}, { passive: true });


/* =========================================
   Wedding Music Player
   Ahmed Adel - Karawan El Saeed
   ========================================= */

(() => {
  const audio = document.getElementById("weddingAudio");
  const player = document.getElementById("weddingMusicPlayer");
  const toggleButton = document.getElementById("musicToggle");
  const toggleIcon = document.getElementById("musicToggleIcon");
  const progress = document.getElementById("musicProgress");
  const currentTimeLabel = document.getElementById("musicCurrentTime");
  const durationLabel = document.getElementById("musicDuration");
  const status = document.getElementById("musicStatus");

  const artistButton = document.getElementById("artistMusicButton");
  const artistIcon = document.getElementById("artistMusicIcon");

  const startJourney = document.getElementById("startJourney");
  const openEnvelope = document.getElementById("openEnvelope");

  if (!audio || !toggleButton || !progress || !status) {
    return;
  }

  let seeking = false;

  function formatTime(seconds) {
    if (!Number.isFinite(seconds) || seconds < 0) {
      return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    return (
      String(minutes).padStart(2, "0") +
      ":" +
      String(remainingSeconds).padStart(2, "0")
    );
  }

  function updatePlayButtons(isPlaying) {
    toggleIcon.textContent = isPlaying ? "Ⅱ" : "▶";

    toggleButton.setAttribute(
      "aria-label",
      isPlaying ? "إيقاف الأغنية مؤقتًا" : "تشغيل الأغنية"
    );

    toggleButton.setAttribute(
      "aria-pressed",
      String(isPlaying)
    );

    if (artistIcon) {
      artistIcon.textContent = isPlaying ? "Ⅱ" : "▶";
    }

    if (player) {
      player.classList.toggle("is-playing", isPlaying);
    }
  }

  async function playMusic() {
    try {
      status.textContent = "جاري تشغيل الأغنية...";

      await audio.play();

      updatePlayButtons(true);
      status.textContent = "الأغنية تعمل الآن 🎶";
    } catch (error) {
      updatePlayButtons(false);

      if (audio.error) {
        status.textContent =
          "تعذر تحميل الأغنية. تأكد من وجود ملف MP3.";
      } else {
        status.textContent =
          "اضغط مرة أخرى لتشغيل الأغنية.";
      }
    }
  }

  function pauseMusic() {
    audio.pause();
    updatePlayButtons(false);
    status.textContent = "الأغنية متوقفة مؤقتًا";
  }

  async function toggleMusic() {
    if (audio.paused) {
      await playMusic();
    } else {
      pauseMusic();
    }
  }

  toggleButton.addEventListener("click", toggleMusic);

  if (artistButton) {
    artistButton.addEventListener("click", toggleMusic);
  }

  audio.addEventListener("loadedmetadata", () => {
    durationLabel.textContent = formatTime(audio.duration);
  });

  audio.addEventListener("durationchange", () => {
    durationLabel.textContent = formatTime(audio.duration);
  });

  audio.addEventListener("timeupdate", () => {
    currentTimeLabel.textContent = formatTime(audio.currentTime);

    if (!seeking && Number.isFinite(audio.duration) && audio.duration > 0) {
      progress.value = String(
        (audio.currentTime / audio.duration) * 100
      );
    }
  });

  progress.addEventListener("input", () => {
    seeking = true;

    if (Number.isFinite(audio.duration) && audio.duration > 0) {
      const targetTime =
        (Number(progress.value) / 100) * audio.duration;

      currentTimeLabel.textContent = formatTime(targetTime);
    }
  });

  function seekAudio() {
    if (Number.isFinite(audio.duration) && audio.duration > 0) {
      audio.currentTime =
        (Number(progress.value) / 100) * audio.duration;
    }

    seeking = false;
  }

  progress.addEventListener("change", seekAudio);

  progress.addEventListener("pointerup", seekAudio);

  audio.addEventListener("play", () => {
    updatePlayButtons(true);
  });

  audio.addEventListener("pause", () => {
    updatePlayButtons(false);
  });

  audio.addEventListener("ended", () => {
    updatePlayButtons(false);
    progress.value = "0";
    currentTimeLabel.textContent = "00:00";
    status.textContent = "انتهت الأغنية ❤️";
  });

  audio.addEventListener("error", () => {
    updatePlayButtons(false);
    status.textContent =
      "ملف الأغنية غير موجود أو تعذر تحميله. راجع اسم الملف ومكانه.";
  });

  /*
   * لا نشغّل الصوت تلقائيًا عند فتح الصفحة.
   * يمكن للزائر بدء الأغنية بنفسه من زر التشغيل.
   */

  if (startJourney) {
    startJourney.addEventListener("click", () => {
      document.getElementById("journey")?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    });
  }

  if (openEnvelope) {
    openEnvelope.addEventListener("click", () => {
      document.getElementById("invitation")?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    });
  }
})();
