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
