/* =============================================
   PORTFOLIO — Three.js + GSAP Scroll Explosion
   ============================================= */

gsap.registerPlugin(ScrollTrigger);

// ── Cursor ──────────────────────────────────
const cursor   = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');
let mx = 0, my = 0, fx = 0, fy = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
(function tickCursor() {
  fx += (mx - fx) * 0.12; fy += (my - fy) * 0.12;
  cursor.style.left   = mx + 'px'; cursor.style.top    = my + 'px';
  follower.style.left = fx + 'px'; follower.style.top  = fy + 'px';
  requestAnimationFrame(tickCursor);
})();
document.querySelectorAll('a,button,.project-card,.skill-block').forEach(el => {
  el.addEventListener('mouseenter', () => { follower.style.transform = 'translate(-50%,-50%) scale(2)'; follower.style.borderColor = 'rgba(0,229,255,0.6)'; });
  el.addEventListener('mouseleave', () => { follower.style.transform = 'translate(-50%,-50%) scale(1)'; follower.style.borderColor = 'rgba(124,77,255,0.5)'; });
});

// ── Scroll Progress ──────────────────────────
const progressBar = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
  const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
  progressBar.style.width = pct + '%';
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 60);
});

// ═══════════════════════════════════════════
//  THREE.JS SETUP
// ═══════════════════════════════════════════
const canvas   = document.getElementById('three-canvas');
const scene    = new THREE.Scene();
const camera   = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 100);
camera.position.set(0, 1.0, 5.2);

const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

window.addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

// ── Lights ───────────────────────────────────
scene.add(new THREE.AmbientLight(0xffffff, 0.4));
const pLight = new THREE.PointLight(0x7c4dff, 3, 20);
pLight.position.set(3, 4, 5);
scene.add(pLight);
const pLight2 = new THREE.PointLight(0x00e5ff, 2, 20);
pLight2.position.set(-3, 2, 3);
scene.add(pLight2);
const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
dirLight.position.set(0, 5, 5);
dirLight.castShadow = true;
scene.add(dirLight);

// ── Particles ────────────────────────────────
const partGeo  = new THREE.BufferGeometry();
const partCount = 2500;
const partPos   = new Float32Array(partCount * 3);
for (let i = 0; i < partCount * 3; i++) partPos[i] = (Math.random() - 0.5) * 20;
partGeo.setAttribute('position', new THREE.BufferAttribute(partPos, 3));
const partMat = new THREE.PointsMaterial({ size: 0.015, color: 0x7c4dff, transparent: true, opacity: 0.5 });
const particles = new THREE.Points(partGeo, partMat);
scene.add(particles);

// ── Screen Canvas Texture ─────────────────────
function makeScreenTexture() {
  const c = document.createElement('canvas');
  c.width = 1600; c.height = 1000;
  const g = c.getContext('2d');

  // BG
  g.fillStyle = '#0d1117'; g.fillRect(0, 0, c.width, c.height);

  // Top bar
  g.fillStyle = '#161b22'; g.fillRect(0, 0, c.width, 42);
  ['#ff5f57','#febc2e','#28c840'].forEach((col, i) => {
    g.beginPath(); g.arc(18 + i * 22, 21, 7, 0, Math.PI * 2);
    g.fillStyle = col; g.fill();
  });
  g.fillStyle = '#58a6ff'; g.font = '14px monospace';
  g.fillText('ahmed-raza — portfolio/src/main.py', 80, 27);

  // Code lines
  const lines = [
    { c: '#ff7b72', t: 'import ' }, { c: '#79c0ff', t: 'torch, numpy as np' },
    { c: '#ff7b72', t: 'from '   }, { c: '#79c0ff', t: 'transformers import GPT2Model' },
    { c: '#8b949e', t: '' },
    { c: '#d2a8ff', t: 'class ' }, { c: '#ffa657', t: 'NeuralPortfolio' }, { c: '#f0f6fc', t: ':' },
    { c: '#8b949e', t: '  # Ahmed Raza — ML Engineer' },
    { c: '#d2a8ff', t: '  def ' }, { c: '#79c0ff', t: 'build' }, { c: '#f0f6fc', t: '(self):' },
    { c: '#f0f6fc', t: '    self.skills = [' },
    { c: '#a5d6ff', t: "      'Python', 'React', 'PyTorch'," },
    { c: '#a5d6ff', t: "      'Next.js', 'Node', 'MLOps'" },
    { c: '#f0f6fc', t: '    ]' },
    { c: '#8b949e', t: '' },
    { c: '#d2a8ff', t: '  def ' }, { c: '#79c0ff', t: 'train' }, { c: '#f0f6fc', t: '(self, data):' },
    { c: '#f0f6fc', t: '    model = GPT2Model.from_pretrained(' },
    { c: '#a5d6ff', t: "      'gpt2-large'" },
    { c: '#f0f6fc', t: '    )' },
    { c: '#d2a8ff', t: '    return ' }, { c: '#79c0ff', t: 'model.fit' }, { c: '#f0f6fc', t: '(data)' },
  ];

  let y = 80, lineH = 26;
  let cx = 30;
  let row = 0;
  lines.forEach(({ c: col, t }) => {
    if (row % 1 === 0) { cx = 30; }
    g.fillStyle = col;
    g.font = '15px "Courier New", monospace';
    g.fillText(t, cx, y);
    cx += g.measureText(t).width;
    if (t.endsWith('\n') || t === '' || t.endsWith(';') || t.endsWith(':') || t.endsWith(')') || t.endsWith(']')) {
      y += lineH; cx = 30; row++;
    }
  });

  // Mini chart at bottom right
  g.fillStyle = '#161b22';
  g.fillRect(c.width - 380, c.height - 220, 360, 200);
  g.strokeStyle = '#30363d'; g.lineWidth = 1; g.strokeRect(c.width - 380, c.height - 220, 360, 200);
  g.fillStyle = '#58a6ff'; g.font = '12px monospace';
  g.fillText('Model Accuracy (%)', c.width - 360, c.height - 200);

  const bars = [72, 85, 91, 88, 96];
  bars.forEach((val, i) => {
    const bx = c.width - 350 + i * 66;
    const bh = (val / 100) * 140;
    const by = c.height - 40 - bh;
    const grad = g.createLinearGradient(bx, by, bx, c.height - 40);
    grad.addColorStop(0, '#7c4dff'); grad.addColorStop(1, '#00e5ff');
    g.fillStyle = grad;
    g.fillRect(bx, by, 40, bh);
    g.fillStyle = '#8b949e'; g.font = '11px monospace';
    g.fillText(val + '%', bx + 5, by - 6);
  });

  // Cursor blink
  g.fillStyle = '#58a6ff';
  g.fillRect(30, y + 4, 9, 18);

  return new THREE.CanvasTexture(c);
}

// ═══════════════════════════════════════════
//  LAPTOP MATERIALS
// ═══════════════════════════════════════════
const matAlum = new THREE.MeshStandardMaterial({ color: 0x242426, metalness: 0.9, roughness: 0.15 });
const matDark = new THREE.MeshStandardMaterial({ color: 0x0e0e0e, metalness: 0.2, roughness: 0.9 });
const matKey  = new THREE.MeshStandardMaterial({ color: 0x1a1a1c, metalness: 0.1, roughness: 0.95 });
const matTrack= new THREE.MeshStandardMaterial({ color: 0x1e1e22, metalness: 0.7, roughness: 0.25 });
const matBezel= new THREE.MeshStandardMaterial({ color: 0x080808, metalness: 0.1, roughness: 0.9 });
const matScreen = new THREE.MeshBasicMaterial({ map: makeScreenTexture() });
const matGlow = new THREE.MeshBasicMaterial({ color: 0x7c4dff, transparent: true, opacity: 0.07, side: THREE.BackSide });
const matRubber = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0, roughness: 1 });

// ═══════════════════════════════════════════
//  LAPTOP GEOMETRY GROUPS
// ═══════════════════════════════════════════
const master = new THREE.Group();
scene.add(master);

// ── BASE BODY ───────────────────────────────
const baseGroup = new THREE.Group();
const baseBody  = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.1, 1.7), matAlum);
baseBody.castShadow = true; baseBody.receiveShadow = true;
baseGroup.add(baseBody);

// Chamfer strip
const chamfer = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.012, 1.7), matDark);
chamfer.position.y = -0.055; baseGroup.add(chamfer);

// Rubber feet
[[-1.1,-0.06,-0.7],[1.1,-0.06,-0.7],[-1.1,-0.06,0.7],[1.1,-0.06,0.7]].forEach(([x,y,z]) => {
  const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.01, 12), matRubber);
  foot.position.set(x,y,z); baseGroup.add(foot);
});
master.add(baseGroup);

// ── KEYBOARD GROUP ───────────────────────────
const keyGroup = new THREE.Group();

// Keyboard panel (inset)
const kbPanel = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.008, 1.1), matDark);
kbPanel.position.set(0, 0.054, 0.1);
keyGroup.add(kbPanel);

// Keys — 4 rows × 13 cols
const kGeo = new THREE.BoxGeometry(0.12, 0.016, 0.1);
for (let r = 0; r < 4; r++) {
  for (let c = 0; c < 13; c++) {
    const k = new THREE.Mesh(kGeo, matKey);
    k.position.set(-0.84 + c * 0.14, 0.063, -0.16 + r * 0.135);
    keyGroup.add(k);
  }
}
// Spacebar
const spaceGeo = new THREE.BoxGeometry(0.7, 0.016, 0.1);
const space = new THREE.Mesh(spaceGeo, matKey);
space.position.set(0, 0.063, 0.385); keyGroup.add(space);

// Fn row
const fnGeo = new THREE.BoxGeometry(0.1, 0.01, 0.068);
for (let c = 0; c < 14; c++) {
  const fn = new THREE.Mesh(fnGeo, matKey);
  fn.position.set(-0.91 + c * 0.14, 0.058, -0.43); keyGroup.add(fn);
}
master.add(keyGroup);

// ── TRACKPAD ─────────────────────────────────
const trackGroup = new THREE.Group();
const trackMesh  = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.006, 0.5), matTrack);
trackMesh.position.set(0, 0.053, 0.57);
trackGroup.add(trackMesh);
// Trackpad border glow line
const tpBorder = new THREE.Mesh(new THREE.BoxGeometry(0.77, 0.003, 0.52), new THREE.MeshBasicMaterial({ color: 0x2a2a3a, wireframe: false }));
tpBorder.position.set(0, 0.051, 0.57);
trackGroup.add(tpBorder);
master.add(trackGroup);

// ── SCREEN LID ───────────────────────────────
const screenGroup = new THREE.Group();
// Pivot at hinge (back of base top)
const lidPivot = new THREE.Group();
lidPivot.position.set(0, 0.05, -0.85);
screenGroup.add(lidPivot);

// Lid aluminum body
const lidBody = new THREE.Mesh(new THREE.BoxGeometry(2.6, 1.65, 0.07), matAlum);
lidBody.position.set(0, 0.825, 0);
lidBody.castShadow = true;
lidPivot.add(lidBody);

// Back logo circle
const logoGeo = new THREE.CircleGeometry(0.14, 32);
const logoMat = new THREE.MeshStandardMaterial({ color: 0x333336, metalness: 0.95, roughness: 0.05 });
const logo    = new THREE.Mesh(logoGeo, logoMat);
logo.position.set(0, 0.825, -0.037); logo.rotation.y = Math.PI;
lidPivot.add(logo);

// Inner bezel
const bezel = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.5, 0.012), matBezel);
bezel.position.set(0, 0.825, 0.037);
lidPivot.add(bezel);

// Screen surface
const screenMesh = new THREE.Mesh(new THREE.PlaneGeometry(2.25, 1.38), matScreen);
screenMesh.position.set(0, 0.825, 0.045);
lidPivot.add(screenMesh);

// Screen edge glow
const glowMesh = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 1.55), matGlow);
glowMesh.position.set(0, 0.825, 0.044);
lidPivot.add(glowMesh);

// Camera dot
const camDot = new THREE.Mesh(new THREE.CircleGeometry(0.016, 16),
  new THREE.MeshBasicMaterial({ color: 0x1a1a1a }));
camDot.position.set(0, 1.62, 0.046);
lidPivot.add(camDot);

// Hinge bars
[-1.1, 1.1].forEach(x => {
  const hinge = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.12, 16),
    new THREE.MeshStandardMaterial({ color: 0x3a3a3a, metalness: 0.9, roughness: 0.1 }));
  hinge.rotation.z = Math.PI / 2;
  hinge.position.set(x, 0, 0);
  lidPivot.add(hinge);
});

// Open angle (~105°)
lidPivot.rotation.x = -Math.PI * 0.58;
master.add(screenGroup);

// Master positioning
master.position.set(0.6, -0.45, 0);
master.rotation.y = -0.25;

// ── Store references for GSAP ─────────────
window._three = { master, baseGroup, keyGroup, trackGroup, screenGroup, lidPivot, particles, camera };

// ═══════════════════════════════════════════
//  MOUSE PARALLAX
// ═══════════════════════════════════════════
let targetRY = 0, targetRX = 0;
document.addEventListener('mousemove', e => {
  targetRY = ((e.clientX / innerWidth) - 0.5) * 0.35;
  targetRX = ((e.clientY / innerHeight) - 0.5) * 0.18;
});

// ═══════════════════════════════════════════
//  RENDER LOOP
// ═══════════════════════════════════════════
let mouseInfluence = 1; // Reduced when GSAP takes over
const clock = new THREE.Clock();
(function animate() {
  requestAnimationFrame(animate);
  const t = clock.getElapsedTime();

  // Gentle float
  master.position.y = -0.45 + Math.sin(t * 0.7) * 0.04;

  // Mouse follow (only when near top)
  if (mouseInfluence > 0) {
    master.rotation.y += (targetRY - master.rotation.y + (-0.25)) * 0.06 * mouseInfluence;
    master.rotation.x += (targetRX - master.rotation.x) * 0.06 * mouseInfluence;
  }

  particles.rotation.y += 0.0008;
  particles.rotation.x += 0.0003;

  // Screen glow pulse
  if (matGlow) matGlow.opacity = 0.05 + Math.sin(t * 1.5) * 0.025;

  renderer.render(scene, camera);
})();

// ═══════════════════════════════════════════
//  GSAP SCROLL EXPLOSION TIMELINE
// ═══════════════════════════════════════════
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: '#pin-container',
    pin: true,
    start: 'top top',
    end: '+=350%',
    scrub: 1.8,
    onUpdate: self => {
      mouseInfluence = 1 - self.progress * 1.8;
      mouseInfluence = Math.max(0, mouseInfluence);
    }
  }
});

// ── Phase 0 → 0.15: Laptop rises, hero text fades out ──
tl.from(master.position, { y: -3, duration: 0.15 }, 0)
  .from(master.rotation, { y: -1.2, duration: 0.15 }, 0)
  .to('#hero-text',        { opacity: 0, y: -40, duration: 0.12 }, 0.1);

// ── Phase 0.15 → 0.4: Screen lid separates upward ──
tl.to(screenGroup.position, { y: 2.8, z: -1.2, duration: 0.3 }, 0.18)
  .to(screenGroup.rotation, { x: -0.5, duration: 0.3 }, 0.18)
  .to(lidPivot.rotation,    { x: -Math.PI * 0.3, duration: 0.3 }, 0.18)
  .to('#label-screen',      { display: 'block', opacity: 1, duration: 0.15 }, 0.28);

// ── Phase 0.4 → 0.6: Keyboard lifts and rotates right ──
tl.to(keyGroup.position, { x: 1.6, y: 1.2, z: -0.8, duration: 0.25 }, 0.4)
  .to(keyGroup.rotation, { z: 0.4, y: 0.3, duration: 0.25 }, 0.4)
  .to('#label-screen',   { opacity: 0, display: 'none', duration: 0.08 }, 0.4)
  .to('#label-keyboard', { display: 'block', opacity: 1, duration: 0.15 }, 0.46);

// ── Phase 0.6 → 0.75: Trackpad slides left-forward ──
tl.to(trackGroup.position, { x: -2.0, y: -0.4, z: 1.2, duration: 0.2 }, 0.6)
  .to(trackGroup.rotation, { z: -0.3, x: 0.4, duration: 0.2 }, 0.6)
  .to('#label-keyboard',   { opacity: 0, display: 'none', duration: 0.08 }, 0.6)
  .to('#label-trackpad',   { display: 'block', opacity: 1, duration: 0.15 }, 0.64);

// ── Phase 0.75 → 0.9: Base sinks + tilts ──
tl.to(baseGroup.position, { y: -1.8, z: 0.5, duration: 0.2 }, 0.75)
  .to(baseGroup.rotation, { x: 0.5, duration: 0.2 }, 0.75)
  .to(master.rotation,    { y: 0.5, duration: 0.2 }, 0.75)
  .to('#label-trackpad',  { opacity: 0, display: 'none', duration: 0.08 }, 0.75)
  .to('#label-base',      { display: 'block', opacity: 1, duration: 0.15 }, 0.80);

// ── Phase 0.9 → 1.0: All fade out, reassemble hint ──
tl.to([screenGroup, keyGroup, trackGroup, baseGroup],
  { opacity: 0, duration: 0.12 }, 0.90)
  .to(master.rotation, { y: -2.5, duration: 0.1 }, 0.9)
  .to('#label-base',   { opacity: 0, display: 'none', duration: 0.08 }, 0.9);

// ═══════════════════════════════════════════
//  SECTION REVEAL — Intersection Observer
// ═══════════════════════════════════════════
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.reveal-item').forEach(el => el.classList.add('revealed'));
      // Animate skill bars
      entry.target.querySelectorAll('.bar-fill').forEach(b => b.classList.add('animate'));
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal-section').forEach(s => revealObs.observe(s));

// ── Nav active state ─────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-link');
const navObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(l => l.classList.remove('active'));
      const link = document.querySelector(`.nav-link[href="#${e.target.id}"]`);
      if (link) link.classList.add('active');
    }
  });
}, { threshold: 0.4 });
sections.forEach(s => navObs.observe(s));

// ── Contact form ─────────────────────────────
document.getElementById('contact-form').addEventListener('submit', e => {
  e.preventDefault();
  const btn = document.getElementById('submit-btn');
  btn.innerHTML = '<span>✓ Message Sent!</span>';
  btn.style.background = 'linear-gradient(135deg,#00e5ff,#28c840)';
  setTimeout(() => {
    btn.innerHTML = '<span>Send Message</span><span class="btn-arrow">→</span>';
    btn.style.background = '';
    e.target.reset();
  }, 3000);
});

// ── Hero entrance ────────────────────────────
gsap.from('#hero-text > *', {
  opacity: 0,
  y: 40,
  stagger: 0.15,
  duration: 1,
  ease: 'power4.out',
  delay: 0.3
});
gsap.from(master.position, {
  y: -3,
  duration: 1.4,
  ease: 'power4.out',
  delay: 0.1
});
