
/* =========================================
   Wedding Invitation - Fares
   Envelope Animation + Reveal Effects
   + Wedding Music Player
   ========================================= */


/* =========================================
   1. Reveal Animation
   ========================================= */

const revealEls = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.14
    }
  );

  revealEls.forEach((el) => observer.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add("visible"));
}


/* =========================================
   2. Start Wedding Journey
   ========================================= */

const startButton = document.getElementById("startJourney");
const journey = document.getElementById("journey");
const beam = document.querySelector(".beam");

if (startButton) {
  startButton.addEventListener("click", () => {
    if (beam && typeof beam.animate === "function") {
      beam.animate(
        [
          {
            opacity: 0,
            transform: "translateX(-20%) rotate(-19deg)"
          },
          {
            opacity: 1,
            transform: "translateX(15%) rotate(-19deg)",
            offset: 0.45
          },
          {
            opacity: 0,
            transform: "translateX(45%) rotate(-19deg)"
          }
        ],
        {
          duration: 1000,
          easing: "ease-in-out"
        }
      );
    }

    journey?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  });
}


/* =========================================
   3. Cinematic Envelope Opening
   ========================================= */

const envelopeWrap = document.getElementById("envelopeWrap");
const openButton = document.getElementById("openEnvelope");
const invitationSection = document.getElementById("invitation");

if (envelopeWrap && openButton) {
  openButton.addEventListener("click", () => {
    const isOpen = envelopeWrap.classList.contains("open");

    /*
     * First click:
     * Open the envelope and reveal the letter.
     * Do not scroll automatically.
     */
    if (!isOpen) {
      envelopeWrap.classList.add("open");

      openButton.innerHTML =
        'انتقل لتفاصيل الفرح <span>↓</span>';

      openButton.setAttribute(
        "aria-label",
        "انتقل إلى تفاصيل الحنة والفرح"
      );

      openButton.setAttribute("aria-expanded", "true");

      return;
    }

    /*
     * Second click:
     * The visitor has had time to read the letter.
     * Move to the invitation details only when requested.
     */
    if (invitationSection) {
      invitationSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  });
}


/* =========================================
   4. Moving Light Trail
   ========================================= */

const trail = document.querySelector(".light-trail");
const trailDot = document.querySelector(".trail-dot");

function updateLightTrail() {
  if (!trail || !trailDot) {
    return;
  }

  const rect = trail.getBoundingClientRect();

  const progress = Math.max(
    0,
    Math.min(
      1,
      (window.innerHeight * 0.7 - rect.top) /
        (window.innerHeight + rect.height)
    )
  );

  trailDot.style.top = `${progress * 75}%`;
}

window.addEventListener(
  "scroll",
  updateLightTrail,
  { passive: true }
);

updateLightTrail();


/* =========================================
   5. Wedding Music Player
   Ahmed Adel - Karawan El Saeed
   ========================================= */

(() => {
  const audio = document.getElementById("weddingAudio");
  const player = document.getElementById("weddingMusicPlayer");

  const toggleButton = document.getElementById("musicToggle");
  const toggleIcon = document.getElementById("musicToggleIcon");

  const progress = document.getElementById("musicProgress");
  const currentTimeLabel =
    document.getElementById("musicCurrentTime");
  const durationLabel =
    document.getElementById("musicDuration");
  const status = document.getElementById("musicStatus");

  const artistButton =
    document.getElementById("artistMusicButton");
  const artistIcon =
    document.getElementById("artistMusicIcon");

  if (!audio || !toggleButton || !progress || !status) {
    return;
  }

  let seeking = false;

  /* Format seconds as MM:SS. */
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

  /* Keep all music buttons synchronized. */
  function updatePlayButtons(isPlaying) {
    if (toggleIcon) {
      toggleIcon.textContent = isPlaying ? "Ⅱ" : "▶";
    }

    toggleButton.setAttribute(
      "aria-label",
      isPlaying
        ? "إيقاف الأغنية مؤقتًا"
        : "تشغيل الأغنية"
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

  /* Start playback after a visitor action. */
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

  /* Pause playback. */
  function pauseMusic() {
    audio.pause();

    updatePlayButtons(false);
    status.textContent = "الأغنية متوقفة مؤقتًا";
  }

  /* Toggle playback. */
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

  /* Load the total duration. */
  audio.addEventListener("loadedmetadata", () => {
    if (durationLabel) {
      durationLabel.textContent = formatTime(audio.duration);
    }
  });

  audio.addEventListener("durationchange", () => {
    if (durationLabel) {
      durationLabel.textContent = formatTime(audio.duration);
    }
  });

  /* Update the current playback time and progress bar. */
  audio.addEventListener("timeupdate", () => {
    if (currentTimeLabel) {
      currentTimeLabel.textContent = formatTime(audio.currentTime);
    }

    if (
      !seeking &&
      Number.isFinite(audio.duration) &&
      audio.duration > 0
    ) {
      progress.value = String(
        (audio.currentTime / audio.duration) * 100
      );
    }
  });

  /* Preview the time while dragging the progress bar. */
  progress.addEventListener("input", () => {
    seeking = true;

    if (
      Number.isFinite(audio.duration) &&
      audio.duration > 0 &&
      currentTimeLabel
    ) {
      const targetTime =
        (Number(progress.value) / 100) * audio.duration;

      currentTimeLabel.textContent = formatTime(targetTime);
    }
  });

  /* Seek to the selected playback position. */
  function seekAudio() {
    if (
      Number.isFinite(audio.duration) &&
      audio.duration > 0
    ) {
      audio.currentTime =
        (Number(progress.value) / 100) * audio.duration;
    }

    seeking = false;
  }

  progress.addEventListener("change", seekAudio);
  progress.addEventListener("pointerup", seekAudio);

  /* Synchronize controls with the actual audio state. */
  audio.addEventListener("play", () => {
    updatePlayButtons(true);
    status.textContent = "الأغنية تعمل الآن 🎶";
  });

  audio.addEventListener("pause", () => {
    updatePlayButtons(false);
  });

  audio.addEventListener("ended", () => {
    updatePlayButtons(false);

    progress.value = "0";

    if (currentTimeLabel) {
      currentTimeLabel.textContent = "00:00";
    }

    status.textContent = "انتهت الأغنية ❤️";
  });

  audio.addEventListener("error", () => {
    updatePlayButtons(false);

    status.textContent =
      "ملف الأغنية غير موجود أو تعذر تحميله. راجع اسم الملف ومكانه.";
  });

  /*
   * Important:
   * Music does not start automatically.
   * The visitor chooses when to play it.
   *
   * The envelope button is handled only once above.
   * It no longer automatically scrolls away after opening.
   */
})();
