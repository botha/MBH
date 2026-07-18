const slides = Array.from(document.querySelectorAll(".slide"));
const dots = Array.from(document.querySelectorAll(".progress__dot"));
const indexEl = document.getElementById("slide-index");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const deck = document.getElementById("deck");

let current = 0;
let locked = false;

function pad(n) {
  return String(n).padStart(2, "0");
}

function goTo(next) {
  if (locked) return;
  const target = Math.max(0, Math.min(slides.length - 1, next));
  if (target === current) return;

  locked = true;
  const prev = current;
  current = target;

  slides[prev].classList.remove("is-active");
  slides[prev].classList.add("is-exit");
  slides[current].classList.add("is-active");
  slides[current].classList.remove("is-exit");

  dots.forEach((dot, i) => {
    dot.classList.toggle("is-active", i === current);
  });

  indexEl.textContent = pad(current + 1);
  prevBtn.disabled = current === 0;
  nextBtn.disabled = current === slides.length - 1;

  window.setTimeout(() => {
    slides[prev].classList.remove("is-exit");
    locked = false;
  }, 700);
}

function next() {
  goTo(current + 1);
}

function prev() {
  goTo(current - 1);
}

prevBtn.addEventListener("click", prev);
nextBtn.addEventListener("click", next);

document.querySelectorAll("[data-goto]").forEach((el) => {
  el.addEventListener("click", () => {
    goTo(Number(el.dataset.goto));
  });
});

window.addEventListener(
  "keydown",
  (event) => {
    if (event.key === "ArrowDown" || event.key === "ArrowRight" || event.key === "PageDown" || event.key === " ") {
      event.preventDefault();
      next();
    }
    if (event.key === "ArrowUp" || event.key === "ArrowLeft" || event.key === "PageUp") {
      event.preventDefault();
      prev();
    }
    if (event.key === "Home") {
      event.preventDefault();
      goTo(0);
    }
    if (event.key === "End") {
      event.preventDefault();
      goTo(slides.length - 1);
    }
  },
  { passive: false },
);

let wheelLock = false;
window.addEventListener(
  "wheel",
  (event) => {
    if (Math.abs(event.deltaY) < 18) return;
    event.preventDefault();
    if (wheelLock || locked) return;
    wheelLock = true;
    if (event.deltaY > 0) next();
    else prev();
    window.setTimeout(() => {
      wheelLock = false;
    }, 850);
  },
  { passive: false },
);

let touchY = null;
window.addEventListener(
  "touchstart",
  (event) => {
    touchY = event.changedTouches[0].clientY;
  },
  { passive: true },
);

window.addEventListener(
  "touchend",
  (event) => {
    if (touchY == null) return;
    const dy = touchY - event.changedTouches[0].clientY;
    touchY = null;
    if (Math.abs(dy) < 48) return;
    if (dy > 0) next();
    else prev();
  },
  { passive: true },
);

prevBtn.disabled = true;
deck.focus({ preventScroll: true });
