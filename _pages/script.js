// =======================
// Typewriter Animation
// =======================

const heroName = document.getElementById("hero-name");
const nameLetters = document.querySelectorAll(".name-letter");
let activePoles = [];


// const typewriterPhrases = [
//   "3rd year CE Student",
//   "student at UC San Diego"
// ];

// function typeWriter(text, i, fnCallback) {
//   if (i < text.length) {
//     document.getElementById("typewriter").innerHTML =
//       text.substring(0, i + 1) + '<span aria-hidden="true"></span>';
//     setTimeout(() => typeWriter(text, i + 1, fnCallback), 70);
//   } else if (typeof fnCallback === "function") {
//     setTimeout(fnCallback, 1000);
//   }
// }

// function startTextAnimation(i) {
//   if (i >= typewriterPhrases.length) i = 0;
//   typeWriter(typewriterPhrases[i], 0, () => startTextAnimation(i + 1));
// }

document.addEventListener("DOMContentLoaded", () => {
  startTextAnimation(0);
  animate();
});

// =======================
// Intersection Reveal
// =======================
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    }
  });
});

document.querySelectorAll(".hidden, .hidden-left, .hidden-right").forEach(el =>
  observer.observe(el)
);

// // =======================
// // Hamburger Menu Toggle
// // =======================
// document.querySelector(".menu-button").addEventListener("click", () => {
//   document.querySelector(".nav-bar-links").classList.toggle("open");
// });

// document.querySelectorAll(".nav-link").forEach(link => {
//   link.addEventListener("click", () =>
//     document.querySelector(".nav-bar-links").classList.remove("open")
//   );
// });

// // =======================
// // Auto Update Year
// // =======================
// document.getElementById("year").innerHTML = new Date().getFullYear();

// =======================
// DSP Canvas Animation
// =======================
const dspcanvas = document.getElementById("canvas");
const ctx = dspcanvas.getContext("2d");
dspcanvas.style.position = "absolute";
dspcanvas.style.left = "0";
dspcanvas.style.top = "0";
dspcanvas.style.zIndex = "-1";
dspcanvas.style.pointerEvents = "none";

document.body.style.margin = "0";
document.body.style.overflowX = "hidden";

function resizeCanvas() {
  dspcanvas.width = window.innerWidth;
  dspcanvas.height = Math.max(300, window.innerHeight * 0.4);
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

const N = 512 / 2 + 100;
const rect = Array(N).fill(0).map((_, i) => Math.sin((12 * Math.PI * i) / N));
let mouseX = dspcanvas.width / 2;
let lastMove = Date.now();

let autoX = mouseX;
let autoV = 2; // speed
let isIdle = false;

document.addEventListener("mousemove", e => {
  mouseX = e.clientX;
  lastMove = Date.now();
});

// WINDOW FUNCTIONS

function hann(n, N) {
  return 0.5 * (1 - Math.cos((2 * Math.PI * n) / (N - 1)));
}

function triangle(n, N) {
  const base = 1 - Math.abs((n - N / 2) / (N / 2));
  return base * (0.9 + 0.2 * Math.random());
}

function sinc(n, N) {
  const x = n - N / 2;
  return x === 0 ? 1 : Math.sin(Math.PI * x / 10) / (Math.PI * x / 10);
}
function sawtooth(n, N) {
  return (n % N) / N;
}

function absSine(n, N) {
  return Math.abs(Math.sin((2 * Math.PI * n) / N));
}

function inverseTri(n, N) {
  return 1 - (1 - Math.abs((n - N / 2) / (N / 2))) ** 2;
}

function exponentialEdge(n, N) {
  const x = (n - N / 2) / (N / 2);
  return 1 - Math.exp(-10 * Math.abs(x));
}

function noisyWindow(n, N) {
  const base = 0.5 * (1 - Math.cos((2 * Math.PI * n) / (N - 1))); // Hann
  return base * (0.9 + 0.2 * Math.random());
}

const windowFunctions = {
  hann,
  triangle,
  sinc,
  sawtooth,
  absSine,
  inverseTri,
  exponentialEdge,
  noisyWindow
};

// Markov chain
const windowKeys = Object.keys(windowFunctions);
let currentWindow = windowKeys[0];
let nextWindow = windowKeys[0];
let windowMix = 1.0;

const transitions = {};
windowKeys.forEach(k => {
  transitions[k] = windowKeys.filter(w => w !== k); // still avoids repeat
});

let lastSwitch = Date.now();
const SWITCH_INTERVAL = 4000;
const TRANSITION_DURATION = 1000;

// Generate any window
function genWindow(centerIdx, type, width = 100) {
  const win = Array(N).fill(0);
  const fn = windowFunctions[type];
  const half = width / 2;
  const start = Math.max(0, centerIdx - half);
  const end = Math.min(N, centerIdx + half);
  const L = end - start;

  for (let i = 0; i < L; i++) {
    win[start + i] = fn(i, L);
  }
  return win;
}

function interpolateWindow(w1, w2, alpha) {
  return w1.map((v, i) => (1 - alpha) * v + alpha * w2[i]);
}

const sections = document.querySelectorAll(".section");

let isMouseOverCanvas = false;
let allowCursorControl = false;
let currentWindowPlot = [];

dspcanvas.addEventListener("mouseenter", () => {
  isMouseOverCanvas = true;
});

dspcanvas.addEventListener("mouseleave", () => {
  isMouseOverCanvas = false;

  // Clamp mouseX into canvas bounds before handing over to autoX
  mouseX = Math.max(0, Math.min(mouseX, dspcanvas.width));
  autoX = mouseX;
});

dspcanvas.addEventListener("mousemove", (e) => {
  if (!isMouseOverCanvas) return; // safety
  const rect = dspcanvas.getBoundingClientRect();
  mouseX = e.clientX - rect.left;
  lastMove = Date.now();
});



document.addEventListener("mousemove", (e) => {
  const canvasRect = dspcanvas.getBoundingClientRect();
  const insideCanvas =
    e.clientX >= canvasRect.left &&
    e.clientX <= canvasRect.right &&
    e.clientY >= canvasRect.top &&
    e.clientY <= canvasRect.bottom;

  isMouseOverCanvas = insideCanvas;

  if (!insideCanvas) {
    allowCursorControl = false;
    return;
  }

  const x = e.clientX - canvasRect.left;
  const y = e.clientY - canvasRect.top;
  mouseX = x;
  lastMove = Date.now();

  // Check if cursor is near window plot
  const idx = Math.floor((x / dspcanvas.width) * N);
  const expectedY = dspcanvas.height * 0.6 - (currentWindowPlot[idx] || 0) * 80;
  const threshold = 40; // increased for usability

  allowCursorControl = Math.abs(y - expectedY) < threshold;
});


function animate() {
  const now = Date.now();

if (!isMouseOverCanvas) {
  autoX += autoV;
  if (autoX < 50 || autoX > dspcanvas.width - 50) autoV *= -1;
  mouseX = autoX;
}




  if (now - lastSwitch > SWITCH_INTERVAL) {
    currentWindow = nextWindow;
    const options = transitions[currentWindow];
    nextWindow = options[Math.floor(Math.random() * options.length)];
    windowMix = 0;
    lastSwitch = now;
  }

  windowMix = Math.min((now - lastSwitch) / TRANSITION_DURATION, 1);

  ctx.clearRect(0, 0, dspcanvas.width, dspcanvas.height);
  const baseY = dspcanvas.height * 0.6;
  if (!animate.smoothedX) animate.smoothedX = mouseX;

  const targetX = isIdle ? autoX : mouseX;
  animate.smoothedX += (targetX - animate.smoothedX) * 0.1;

  const centerIdx = Math.floor((animate.smoothedX / dspcanvas.width) * N);


  const w1 = genWindow(centerIdx, currentWindow);
  const w2 = genWindow(centerIdx, nextWindow);
  const window = interpolateWindow(w1, w2, windowMix);
  const windowed = rect.map((v, i) => v * window[i]);


  nameLetters.forEach((letter, i) => {
    const idx = Math.floor((i / nameLetters.length) * N);
    const amp = windowed[idx] || 0;
    const scale = 0.7 + amp;
    letter.style.transform = `scale(${scale})`;
    letter.style.opacity = 0.6 + amp * 0.4;
  });


  function drawLine(data, color) {
    ctx.beginPath();
    for (let i = 0; i < N; i++) {
      const x = (i / N) * dspcanvas.width;
      const y = baseY - data[i] * 80;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  drawLine(rect, "rgba(128, 128, 128, 0.2)");   // gray, transparent
  drawLine(window, "rgba(0, 255, 255, 0.2)");   // cyan, transparent
  drawLine(windowed, "rgba(0, 255, 0, 1)");     // lime, fully opaque


  const count = sections.length;
  sections.forEach((el, i) => {
    const idx = Math.floor((i + 0.5) * N / count);
    const amp = window[idx] || 0;
    const scale = 0.6 + amp * 1.5;
    const opacity = 0.2 + amp * 0.8;

    el.style.transform = scale({scale});
    el.style.opacity = opacity;
  });

  function isCursorNearWindow(centerIdx, threshold = 20) {
    const i = Math.floor((mouseX / dspcanvas.width) * N);
    const yCanvas = baseY - window[i] * 80;
    const dy = Math.abs(mouseY - yCanvas);
    return dy < threshold;
  }

  // drawMarkov(nextWindow);
  currentWindowPlot = window; // for hover detection in mousemove

  requestAnimationFrame(animate);
}

animate();

let wasInsideObject = false;

const pCanvas = document.getElementById("particle-bg");
const pCtx = pCanvas.getContext("2d");
let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
let mouseInsideObject = false;

function resizeParticleCanvas() {
  pCanvas.width = window.innerWidth;
  pCanvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeParticleCanvas);
resizeParticleCanvas();

const PARTICLE_COUNT = 720;
const PARTICLES = [];

for (let i = 0; i < PARTICLE_COUNT; i++) {
  PARTICLES.push({
    x: Math.random() * pCanvas.width,
    y: Math.random() * pCanvas.height,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    opacity: 0.1
  });
}

document.addEventListener("mousemove", e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});
  // Track last position *inside* the object
let exitPoint = { x: 0, y: 0 };
document.querySelectorAll('.project-card-wrapper').forEach(el => {
  el.addEventListener('mouseenter', () => {
    wasInsideObject = mouseInsideObject;
    mouseInsideObject = true;
  });


el.addEventListener("mouseenter", () => {
  mouseInsideObject = true;
});

el.addEventListener("mousemove", (e) => {
  // Update exit point while inside
  if (mouseInsideObject) {
    const rect = el.getBoundingClientRect();
    exitPoint.x = e.clientX;
    exitPoint.y = e.clientY;
  }
});

el.addEventListener("mouseleave", () => {
  mouseInsideObject = false;

const rect = el.getBoundingClientRect();
const cx = rect.left + rect.width / 2;
const cy = rect.top + rect.height / 2;
const dx = exitPoint.x - cx;
const dy = exitPoint.y - cy;
const mag = Math.sqrt(dx * dx + dy * dy);
const dirX = dx / mag;
const dirY = dy / mag;

for (let i = 0; i < 25; i++) {
  const speed = 3 + Math.random() * 3;
  const angleOffset = (Math.random() - 0.5) * 1.5; // slight scatter
  const theta = Math.atan2(dirY, dirX) + angleOffset;
  PARTICLES.push({
    x: exitPoint.x,
    y: exitPoint.y,
    vx: speed * Math.cos(theta)*0.8,
    vy: speed * Math.sin(theta)*0.8,
    opacity: 1.0,
    decay: 0.0005,           // Very slow fade
    life: 600 + Math.random() * 200  // ~10+ seconds (60 FPS * 10s = 600)
  });
}



});


});


function drawParticleBackground() {
  pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height);

  // Inside drawParticleBackground()
for (let i = PARTICLES.length - 1; i >= 0; i--) {
  const p = PARTICLES[i];

  const dx = mouse.x - p.x;
  const dy = mouse.y - p.y;
  const dist = Math.sqrt(dx * dx + dy * dy) + 1e-4;
  const attraction = Math.exp(-dist / 40);

  if (!p.decay) {
    // regular passive particles
    p.vx *= 0.92;
    p.vy *= 0.92;
    p.vx += (dx / dist) * 0.2 * attraction;
    p.vy += (dy / dist) * 0.2 * attraction;
    p.opacity = 0.08 + 0.8 * attraction;
  } else {
    // burst particle logic
    p.opacity -= p.decay;
    p.life--;
  }

  p.x += p.vx;
  p.y += p.vy;

  // draw
  if (p.opacity > 0) {
    pCtx.beginPath();
    pCtx.arc(p.x, p.y, 2, 0, 2 * Math.PI);
    pCtx.fillStyle = `rgba(255,255,255,${Math.max(0, p.opacity)})`;
    pCtx.shadowColor = `rgba(0,255,255,${Math.max(0, p.opacity)})`;
    pCtx.shadowBlur = p.decay ? 20 : 6;
    pCtx.fill();
    pCtx.shadowBlur = 0;
  }

  // remove if expired
  if (p.opacity <= 0 || p.life <= 0) {
    PARTICLES.splice(i, 1);
  }
}

for (let p of PARTICLES) {
  p.life--;
  p.opacity -= p.decay;
  if (p.opacity <= 0 || p.life <= 0) continue;

  ctx.beginPath();
  ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI);
  ctx.fillStyle = `rgba(255,255,255,${p.opacity})`;
  ctx.fill();
}

  // glowing proton
if (!mouseInsideObject) {
  pCtx.beginPath();
  pCtx.arc(mouse.x, mouse.y, 10, 0, 2 * Math.PI);
  pCtx.fillStyle = "rgba(0,255,255,0.2)";
  pCtx.shadowColor = "#0ff";
  pCtx.shadowBlur = 30;
  pCtx.fill();
  pCtx.shadowBlur = 0;
} else {
  // subtle absorbed glow when inside
  pCtx.beginPath();
  pCtx.arc(mouse.x, mouse.y, 5, 0, 2 * Math.PI);
  pCtx.fillStyle = "rgba(0,255,255,0.05)";
  pCtx.fill();
}


  requestAnimationFrame(drawParticleBackground);
}
drawParticleBackground();
