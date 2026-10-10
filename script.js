
/* =========================================
   Fares Wedding Invitation
   Journey + Envelope + Music Player
   + Cinematic Intro
   ========================================= */


/* =========================================
   0. Cinematic Intro
   ========================================= */

(() => {
  const intro = document.getElementById("cinematicIntro");
  const enterButton = document.getElementById("enterInvitation");
  const skipButton = document.getElementById("skipIntro");

  if (!intro) {
    document.body.classList.remove("intro-locked");
    return;
  }

  let introFinished = false;

  /*
   * قفل التمرير أثناء ظهور المقدمة.
   * لا يتم تشغيل أي صوت أو موسيقى تلقائيًا.
   */

  document.body.classList.add("intro-locked");

  /*
   * إضافة الكلاس بعد تحميل الصفحة لبدء الحركات
   * التي سنضيف تنسيقاتها داخل style.css.
   */

  requestAnimationFrame(() => {
    intro.classList.add("intro-ready");
  });

  function finishIntro() {
    if (introFinished) return;

    introFinished = true;

    intro.classList.add("intro-exit");

    document.body.classList.remove("intro-locked");
    document.body.classList.add("intro-finished");

    if (enterButton) {
      enterButton.disabled = true;
    }

    if (skipButton) {
      skipButton.disabled = true;
    }

    /*
     * بعد انتهاء انتقال الاختفاء، يتم إخفاء المقدمة
     * تمامًا حتى لا تمنع الضغط على عناصر الموقع.
     */

    window.setTimeout(() => {
      intro.hidden = true;
      intro.setAttribute("aria-hidden", "true");
    }, 900);
  }

  if (enterButton) {
    enterButton.addEventListener("click", finishIntro);
  }

  if (skipButton) {
    skipButton.addEventListener("click", finishIntro);
  }

  /*
   * السماح بتخطي المقدمة باستخدام زر Escape.
   */

  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      !introFinished
    ) {
      finishIntro();
    }
  });

  /*
   * دعم الأجهزة التي تفضل تقليل الحركة.
   * تظل أزرار الدخول والتخطي متاحة.
   */

  if (
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    intro.classList.add("intro-reduced-motion");
  }
})();


/* =========================================
   1. Reveal animations
   ========================================= */

const revealEls = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  revealEls.forEach((element) => revealObserver.observe(element));
} else {
  revealEls.forEach((element) => element.classList.add("visible"));
}


/* =========================================
   2. Navigation helper
   ========================================= */

function scrollToSection(section) {
  if (!section) return;

  section.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}

function addNextButton(section, nextSection, label, id) {
  if (!section || !nextSection) return null;

  /*
   * منع تكرار الزر إذا تم استدعاء الدالة مرة أخرى.
   */

  const existingButton = document.getElementById(id);

  if (existingButton) {
    return existingButton;
  }

  const button = document.createElement("button");

  button.type = "button";
  button.className = "gold-button journey-next-button";
  button.id = id;
  button.textContent = label;
  button.setAttribute("aria-label", label);

  button.addEventListener("click", () => {
    scrollToSection(nextSection);
  });

  section.appendChild(button);

  return button;
}


/* =========================================
   3. Start journey
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

    scrollToSection(journey);
  });
}


/* =========================================
   4. Envelope opening
   ========================================= */

const envelopeWrap = document.getElementById("envelopeWrap");
const openEnvelopeButton = document.getElementById("openEnvelope");
const invitationSection = document.getElementById("invitation");

let envelopeOpened = false;

if (envelopeWrap && openEnvelopeButton) {
  openEnvelopeButton.addEventListener("click", () => {
    if (envelopeOpened) return;

    envelopeOpened = true;

    envelopeWrap.classList.add("open");

    openEnvelopeButton.innerHTML = "تم فتح الدعوة ✦";
    openEnvelopeButton.disabled = true;

    openEnvelopeButton.setAttribute("aria-expanded", "true");

    const nextButton = addNextButton(
      document.getElementById("journey"),
      invitationSection,
      "انتقل إلى تفاصيل الحنة والفرح ↓",
      "toInvitation"
    );

    if (nextButton) {
      nextButton.classList.add("next-invitation-button");
    }
  });
}


/* =========================================
   5. Add a button below each stage
   ========================================= */

const friendsSection = document.querySelector(".friends");
const artistSection = document.querySelector(".artist");
const closingSection = document.querySelector(".closing");

addNextButton(
  invitationSection,
  friendsSection,
  "انتقل إلى صور فارس وأصحابه ↓",
  "toFriends"
);

addNextButton(
  friendsSection,
  artistSection,
  "انتقل إلى فقرة الفنان أحمد عادل ↓",
  "toArtist"
);

addNextButton(
  artistSection,
  closingSection,
  "انتقل إلى ختام الدعوة ↓",
  "toClosing"
);


/* =========================================
   6. Back to top
   ========================================= */

document.querySelectorAll(".back-top").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();

    scrollToSection(document.getElementById("top"));
  });
});


/* =========================================
   7. Moving light trail
   ========================================= */

const lightTrail = document.querySelector(".light-trail");
const trailDot = document.querySelector(".trail-dot");

function updateLightTrail() {
  if (!lightTrail || !trailDot) return;

  const rect = lightTrail.getBoundingClientRect();

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

window.addEventListener("scroll", updateLightTrail, {
  passive: true
});

updateLightTrail();


/* =========================================
   8. Wedding Music Player
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

  if (!audio || !toggleButton || !progress || !status) {
    console.error("Music player elements are missing.");
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
    if (toggleIcon) {
      toggleIcon.textContent = isPlaying ? "Ⅱ" : "▶";
    }

    toggleButton.setAttribute(
      "aria-label",
      isPlaying ? "إيقاف الأغنية مؤقتًا" : "تشغيل الأغنية"
    );

    toggleButton.setAttribute("aria-pressed", String(isPlaying));

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

      /*
       * الاحتفاظ بمصدر الصوت الموجود في index.html:
       * assets/ahmed-adel.mp3
       */

      await audio.play();

      updatePlayButtons(true);

      status.textContent = "الأغنية تعمل الآن 🎶";
    } catch (error) {
      updatePlayButtons(false);

      console.error("Audio playback failed:", error);

      if (audio.error) {
        status.textContent =
          "تعذر تحميل الأغنية. تأكد من وجود ملف assets/ahmed-adel.mp3.";
      } else {
        status.textContent =
          "تعذر التشغيل. اضغط مرة أخرى أو تحقق من إعدادات الصوت.";
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
    if (durationLabel) {
      durationLabel.textContent = formatTime(audio.duration);
    }
  });

  audio.addEventListener("durationchange", () => {
    if (durationLabel) {
      durationLabel.textContent = formatTime(audio.duration);
    }
  });

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
      "ملف الأغنية لم يُحمّل. راجع اسم الملف ومكانه داخل المستودع.";

    console.error(
      "Audio error:",
      audio.error ? audio.error.code : "Unknown audio error"
    );
  });

  /*
   * لا يتم تشغيل الموسيقى تلقائيًا.
   */
})();
