// =======================
// Typewriter Animation
// =======================

const heroName = document.getElementById("hero-name");
const nameLetters = document.querySelectorAll(".name-letter");
let activePoles = [];


const typewriterPhrases = [
  "3rd year CE Student",
  "student at UC San Diego"
];

function typeWriter(text, i, fnCallback) {
  if (i < text.length) {
    document.getElementById("typewriter").innerHTML =
      text.substring(0, i + 1) + '<span aria-hidden="true"></span>';
    setTimeout(() => typeWriter(text, i + 1, fnCallback), 70);
  } else if (typeof fnCallback === "function") {
    setTimeout(fnCallback, 1000);
  }
}

function startTextAnimation(i) {
  if (i >= typewriterPhrases.length) i = 0;
  typeWriter(typewriterPhrases[i], 0, () => startTextAnimation(i + 1));
}

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

// =======================
// Hamburger Menu Toggle
// =======================
document.querySelector(".menu-button").addEventListener("click", () => {
  document.querySelector(".nav-bar-links").classList.toggle("open");
});

document.querySelectorAll(".nav-link").forEach(link => {
  link.addEventListener("click", () =>
    document.querySelector(".nav-bar-links").classList.remove("open")
  );
});

// =======================
// Auto Update Year
// =======================
document.getElementById("year").innerHTML = new Date().getFullYear();

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

// ****************** COURSES **********************
const quarters = [
  { term: "FA22", courses: [
    { code: "PHYS 2A", desc: "Mechanics" },
    { code: "MATH 18", desc: "Linear Algebra" },
    { code: "CSE 8A", desc: "Intro to Programming I (Python)" }
  ]},
  { term: "WI23", courses: [
    { code: "MATH 20B", desc: "Calculus II" },
    { code: "CSE 20", desc: "Discrete Mathematics" },
    { code: "CSE 11", desc: "Intro to Programming II (Java)" }
  ]}, 
  { term: "SP23", courses: [
    { code: "MATH 20C", desc: "Calculus III" },
    { code: "CSE 12", desc: "Data Structures" },
    { code: "CSE 21", desc: "Algorithm Analysis" },
    { code: "CSE 15L", desc: "UNIX & Shell Scripting" }
  ]},
  { term: "SU23", courses: [
    { code: "MATH 20D", desc: "Diff Eq" },
    { code: "PHYS 2C", desc: "Thermo, Waves, Optics" }
  ]},
  { term: "FA23", courses: [
    { code: "ECE 109", desc: "Probability" },
    { code: "CSE 30", desc: "Systems Programming" },
    { code: "ECE 35", desc: "Intro to Circuits" }
  ]},
  { term: "WI24", courses: [
    { code: "ECE 45", desc: "Signals & Systems" },
    { code: "ECE 101", desc: "Linear Systems" },
    { code: "ECE 250", desc: "Graduate Random Processes" },
    { code: "CSE 100", desc: "Advanced Data Structures" },
    { code: "CSE 101", desc: "Algorithm Design & Analysis" }
  ]},
  { term: "SP24", courses: [
    { code: "ECE 65", desc: "Components & Circuits Labarotaory" },
    { code: "CSE 140", desc: "Digital Logic" },
    { code: "CSE 140L", desc: "Digital Logic Laboratory" },
    { code: "MATH 20E", desc: "Vector Calculus" }
  ]},
  { term: "FA24", courses: [
    { code: "ECE 108", desc: "Digital Circuits" },
    { code: "ECE 161A", desc: "Intro to DSP" },
    { code: "CSE 141", desc: "Computer Architecture" },
    { code: "MATH 100A", desc: "Honors Abstract Algebra" },
    { code: "MATH 109", desc: "Proofs" }
  ]},
  { term: "WI25", courses: [
    { code: "ECE 158B", desc: "Data Networks" },
    { code: "ECE 176", desc: "Deep Learning" },
    { code: "ECE 251A", desc: "Graduate DSP" },
    { code: "ECE 269", desc: "Graduate Linear Algebra" },
    { code: "ECON 109", desc: "Game Theory" }
  ]},
  { term: "SP25", courses: [
    { code: "CSE 120", desc: "Data Networks" },
    { code: "ECE 273", desc: "Graduate Convex Optimization" },
    { code: "CSE 153", desc: "ML for Music" }
  ]}
];

let currentQuarter = -1;
const coursescanvas = document.getElementById('scene');
const tooltip = document.getElementById('tooltip');
// const renderer = new THREE.WebGLRenderer({ canvas: coursescanvas, antialias: true });
const renderer = new THREE.WebGLRenderer({ canvas: coursescanvas, antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(new THREE.Color(0x0a0a2a), 0.0);

renderer.setSize(window.innerWidth, window.innerHeight);
const scene = new THREE.Scene();
// scene.background = new THREE.Color(0x75b5f0, 0.2);


const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(0, 80, 130);
camera.lookAt(0, 30, 0);

const light = new THREE.PointLight(0xffffff, 1.5, 300);
light.position.set(50, 150, 50);
scene.add(light);
scene.add(new THREE.AmbientLight(0x555555));

const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(1000, 200),
  new THREE.MeshPhongMaterial({
    color: 0x0a0a2a,
    transparent: true,       // Enable transparency
    opacity: 0.0           // Set to 10% opacity
  })
);

ground.rotation.x = - Math.PI / 2.1;
scene.add(ground);

const buildings = [];
const mousecourses = new THREE.Vector2();
let hovered = null;

function makeMaterial(color, emissive = 0x000000) {
  return new THREE.MeshPhongMaterial({
    color,
    emissive,
    emissiveIntensity: 0.5,
    shininess: 120
  });
}

const defaultColor = 0x75b5f0;
const glowColor = 0xffffff;
const courseCubes = [];  // store only course blocks here

function createBuilding(index) {
  const quarter = quarters[index];
  const group = new THREE.Group();
  const baseX = (index+1) * 30 - (quarters.length - 1) * 15+25;

  quarter.courses.forEach((course, i) => {
    const height = 15;
    const geometry = new THREE.BoxGeometry(10, height, 10);
    const cube = new THREE.Mesh(geometry, makeMaterial(defaultColor));
    cube.position.set(baseX, height / 2 + 150 + i * height, 0); // aligned
    cube.userData = { code: course.code, desc: course.desc, originalMaterial: cube.material };
    cube.userData.isCourseBlock = true;
    cube.material = new THREE.MeshStandardMaterial({
      color: 0x2266ff,
      emissive: 0x2266ff,
      emissiveIntensity: 0.5
    });

    courseCubes.push(cube);
    group.add(cube);

    const coursescanvas = document.createElement('canvas');
    coursescanvas.width = 256;
    coursescanvas.height = 64;
    const ctx = coursescanvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 50px cambria-math';
    ctx.textAlign = 'center';
    ctx.fillText(course.code, 128, 45);

    const texture = new THREE.CanvasTexture(coursescanvas);
    const spriteMaterial = new THREE.SpriteMaterial({ map: texture, depthTest: false });
    const label = new THREE.Sprite(spriteMaterial);
    label.scale.set(11, 2.8, 1);
    label.position.set(baseX, height + 150 + i * height + 1, 6); // directly above cube
    group.add(label);
  });
  buildings.push(group);
  scene.add(group);
  
}

const scrollWrapper = document.getElementById("scroll-wrapper");

let scrollSpeed = 0;
const maxSpeed = 100;
const edgeThreshold = 100;

function updateScrollFromMouse(e) {
  const x = e.clientX;

  if (x > window.innerWidth - edgeThreshold) {
    // near right edge
    const ratio = 2*(x - (window.innerWidth - edgeThreshold)) / edgeThreshold;
    scrollSpeed = maxSpeed * ratio;
  } else if (x < edgeThreshold) {
    // near left edge
    const ratio = (edgeThreshold - x) / edgeThreshold;
    scrollSpeed = -maxSpeed * ratio;
  } else {
    scrollSpeed = 0;
  }
}

window.addEventListener("mousemove", updateScrollFromMouse);

function autoScrollLoop() {
  if (scrollSpeed !== 0) {
    scrollWrapper.scrollLeft += scrollSpeed;
  }
  requestAnimationFrame(autoScrollLoop);
}
autoScrollLoop();

scrollWrapper.addEventListener("scroll", () => {
  const scrollPos = scrollWrapper.scrollLeft;
  camera.position.x = scrollPos * 0.1;       // tweak as needed
  camera.lookAt(camera.position.x, 30, 0);
});

const snapTrack = document.getElementById('snap-track');
snapTrack.style.width = `${quarters.length * 20}vw`;

quarters.forEach(() => {
  const section = document.createElement('div');
  section.className = 'snap-section';
  snapTrack.appendChild(section);
});


function showBuilding(index) {
  if (index < 0 || index >= quarters.length) return;
  createBuilding(index);
  const group = buildings[index];
  const cubes = group.children.filter(obj => obj.type === "Mesh");
  const labels = group.children.filter(obj => obj.type === "Sprite");

  cubes.forEach((cube, i) => {
    gsap.to(cube.position, {
      y: 15 / 2 + i * 15,
      duration: 0.6,
      delay: i * 0.1,
      ease: 'bounce.out'
    });
  });

  labels.forEach((label, i) => {
    gsap.to(label.position, {
      y: 15 + i * 15 + 1,
      duration: 0.6,
      delay: i * 0.1 + 0.05,
      ease: 'bounce.out'
    });
  });
}

function hideBuilding(index) {
  if (index < 0 || index >= buildings.length) return;
  const group = buildings[index];
  const cubes = group.children.filter(obj => obj.type === "Mesh");
  const labels = group.children.filter(obj => obj.type === "Sprite");

  cubes.forEach((cube, i) => {
    gsap.to(cube.position, {
      y: 200,
      duration: 0.3,
      delay: i * 0.05,
      ease: 'power1.in'
    });
  });

  labels.forEach((label, i) => {
    gsap.to(label.position, {
      y: 200 + 10,
      duration: 0.3,
      delay: i * 0.05,
      ease: 'power1.in'
    });
  });
}

function onMouseMove(event) {
  mousecourses.x = (event.clientX / window.innerWidth) * 2 - 1;
  mousecourses.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

let INTERSECTED;
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

window.addEventListener('mousemove', (event) => {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

const HOLD_DELAY = 100;      // Delay before starting repeat
const STEP_INTERVAL = 400;  // How often to repeat once started

let nextInterval = null;
let nextHoldTimer = null;

let prevInterval = null;
let prevHoldTimer = null;

function triggerNext() {
  if (currentQuarter < quarters.length - 1) {
    currentQuarter++;
    showBuilding(currentQuarter);
  }
}

function triggerPrev() {
  if (currentQuarter >= 0) {
    hideBuilding(currentQuarter);
    currentQuarter--;
  }
}

// NEXT BUTTON
const nextBtn = document.getElementById("rightBtn");

nextBtn.addEventListener("mouseenter", () => {
  nextHoldTimer = setTimeout(() => {
    triggerNext(); // trigger first time
    nextInterval = setInterval(triggerNext, STEP_INTERVAL);
  }, HOLD_DELAY);
});

nextBtn.addEventListener("mouseleave", () => {
  clearTimeout(nextHoldTimer);
  clearInterval(nextInterval);
  nextHoldTimer = null;
  nextInterval = null;
});

// PREV BUTTON
const prevBtn = document.getElementById("leftBtn");

prevBtn.addEventListener("mouseenter", () => {
  prevHoldTimer = setTimeout(() => {
    triggerPrev(); // trigger first time
    prevInterval = setInterval(triggerPrev, STEP_INTERVAL);
  }, HOLD_DELAY);
});

prevBtn.addEventListener("mouseleave", () => {
  clearTimeout(prevHoldTimer);
  clearInterval(prevInterval);
  prevHoldTimer = null;
  prevInterval = null;
});

let edgeHoldTimer = null;
let edgeInterval = null;
let activeEdge = null;

function clearEdgeActions() {
  clearTimeout(edgeHoldTimer);
  clearInterval(edgeInterval);
  edgeHoldTimer = null;
  edgeInterval = null;
  activeEdge = null;
}

function handleEdgeHover(direction) {
  if (activeEdge === direction) return; // already doing it

  clearEdgeActions();

  edgeHoldTimer = setTimeout(() => {
    if (direction === 'right') triggerNext();
    if (direction === 'left') triggerPrev();

    edgeInterval = setInterval(() => {
      if (direction === 'right') triggerNext();
      if (direction === 'left') triggerPrev();
    }, STEP_INTERVAL);

    activeEdge = direction;
  }, HOLD_DELAY);
}

// Monitor mouse position
window.addEventListener('mousemove', (e) => {
  const edgeThreshold = 0.15 * window.innerWidth;

  if (e.clientX >= window.innerWidth - 3*edgeThreshold) {
    handleEdgeHover('right');
  } else if (e.clientX <= edgeThreshold) {
    handleEdgeHover('left');
  } else {
    clearEdgeActions();
  }
});

let targetScrollX = 0;

window.addEventListener("wheel", (e) => {
  if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
    targetScrollX += e.deltaX * 0.5;
  }
});

function animatescroll() {
  scrollX += (targetScrollX - scrollX) * 0.1;  // easing
  camera.position.x = scrollX;
  camera.lookAt(scrollX, 30, 0);

  requestAnimationFrame(animate);
  checkIntersection();
  renderer.render(scene, camera);
}
animatescroll();
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") targetScrollX += 30;
  if (e.key === "ArrowLeft") targetScrollX -= 30;
});

// let activePoles = [];
function showCoursePole(object) {
  const { code, desc } = object.userData;
  const message = `${desc}`;

  const poleGroup = new THREE.Group();
  poleGroup.name = "coursePole";

  const poleGeometry = new THREE.CylinderGeometry(0.3, 0.3, 10);
  const poleMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const pole = new THREE.Mesh(poleGeometry, poleMaterial);
  pole.position.set(0, 5, 0);
  pole.name = "pole";
  pole.scale.set(0, 0, 0);
  poleGroup.add(pole);

  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 48px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(message, 20, 80);
  const texture = new THREE.CanvasTexture(canvas);
  const labelMaterial = new THREE.SpriteMaterial({ map: texture });
  const label = new THREE.Sprite(labelMaterial);
  label.scale.set(30, 5, 1);
  label.position.set(13, 11, 0); // shift 8 units outward from the pole/cube

  label.name = "label";
  label.scale.set(0, 0, 1);
  poleGroup.add(label);

  poleGroup.position.copy(object.position);
  poleGroup.position.x += 10;

  scene.add(poleGroup);
  activePoles.push(poleGroup);

  // Animate
  gsap.to(pole.scale, { x: 1, y: 1, z: 1, duration: 0.3, ease: 'back.out(1.7)' });
  gsap.to(label.scale, { x: 30, y: 5, duration: 0.3, delay: 0.1, ease: 'back.out(1.7)' });
}

function removeAllCoursePoles() {
  activePoles.forEach(poleGroup => {
    const pole = poleGroup.getObjectByName("pole");
    const label = poleGroup.getObjectByName("label");

    gsap.to(pole.scale, { x: 0, y: 0, z: 0, duration: 0.2, ease: 'back.in(1.7)' });
    gsap.to(label.scale, {
      x: 0, y: 0, duration: 0.2, ease: 'back.in(1.7)',
      onComplete: () => {
        scene.remove(poleGroup);
      }
    });
  });

  activePoles = [];
}

function checkIntersection() {
  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObjects(courseCubes, true);
  // const intersects = raycaster.intersectObjects(scene.children, true);


  if (intersects.length > 0) {
    const object = intersects[0].object;
    if (INTERSECTED !== object && object.userData.isCourseBlock) {
      // Reset previous
      if (INTERSECTED) {
        INTERSECTED.material.emissiveIntensity = 0.5;
        removeAllCoursePoles();
      }

      // Set new
      INTERSECTED = object;
      INTERSECTED.material.emissiveIntensity = 2.0;
      showCoursePole(object);
    }
  } else {
    // Nothing hovered
    if (INTERSECTED) {
      INTERSECTED.material.emissiveIntensity = 0.5;
      INTERSECTED = null;
    }
    removeAllCoursePoles();
  }
}



document.getElementById("rightBtn").addEventListener("click", () => {
  if (currentQuarter < quarters.length - 1) {
    currentQuarter++;
    showBuilding(currentQuarter);
  }
});

document.getElementById("leftBtn").addEventListener("click", () => {
  if (currentQuarter >= 0) {
    hideBuilding(currentQuarter);
    currentQuarter--;
  }
});

window.addEventListener('mousemove', onMouseMove);

function animateCourses() {
  if (activePoles.length > 0) {
  activePoles.forEach(pole => {
    const label = pole.getObjectByName("label");
    if (label) label.lookAt(camera.position);
  });
}

  requestAnimationFrame(animateCourses);
  checkIntersection();
  renderer.render(scene, camera);
}
animateCourses();
