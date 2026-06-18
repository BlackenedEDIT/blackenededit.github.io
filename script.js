/* ─── NAVBAR ─────────────────────────────────────────────────────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* ─── MOBILE NAV ─────────────────────────────────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const navMenu   = document.getElementById('navMenu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navMenu.classList.toggle('open');
});
navMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navMenu.classList.remove('open');
  });
});

/* ─── SMOOTH SCROLL ──────────────────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ─── SCROLL REVEAL ──────────────────────────────────────────────────────── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -56px 0px' });

document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right')
  .forEach(el => revealObserver.observe(el));

/* ─── COUNTER ANIMATION ──────────────────────────────────────────────────── */
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el     = entry.target;
    const target = parseInt(el.dataset.to, 10);
    const start  = performance.now();
    const dur    = 1800;

    const tick = (now) => {
      const p = Math.min((now - start) / dur, 1);
      el.textContent = Math.round((1 - Math.pow(1 - p, 3)) * target);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.5 });

document.querySelectorAll('.counter').forEach(el => counterObserver.observe(el));

/* ─── HERO PARALLAX ──────────────────────────────────────────────────────── */
const heroBg = document.getElementById('heroBg');
if (heroBg) {
  window.addEventListener('scroll', () => {
    if (window.scrollY < window.innerHeight) {
      heroBg.style.transform = `translateY(${window.scrollY * 0.22}px)`;
    }
  }, { passive: true });
}

/* ─── PARTICLE CANVAS ────────────────────────────────────────────────────── */
const canvas = document.getElementById('particleCanvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let animId;
  let active = true;

  const resize = () => {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  resize();
  window.addEventListener('resize', resize, { passive: true });

  class Particle {
    constructor() { this.reset(true); }

    reset(init = false) {
      this.x      = Math.random() * canvas.width;
      this.y      = init ? Math.random() * canvas.height : canvas.height + 10;
      this.vx     = (Math.random() - 0.5) * 0.45;
      this.vy     = -(Math.random() * 1.4 + 0.4);
      this.size   = Math.random() * 1.8 + 0.6;
      this.alpha  = Math.random() * 0.55 + 0.2;
      this.life   = 0;
      this.maxLife = Math.random() * 220 + 80;
      this.rgb    = Math.random() > 0.55 ? '102,252,241' : '212,175,55';
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.life++;
      const fade = this.life / this.maxLife;
      this.curAlpha = this.alpha * Math.sin(fade * Math.PI);
      if (this.life >= this.maxLife || this.y < -10) this.reset();
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.rgb},${this.curAlpha.toFixed(3)})`;
      ctx.fill();
    }
  }

  const particles = Array.from({ length: 70 }, () => new Particle());

  const heroSection = document.getElementById('hero');
  const visibilityObserver = new IntersectionObserver(([entry]) => {
    active = entry.isIntersecting;
    if (active) animate();
  }, { threshold: 0 });
  visibilityObserver.observe(heroSection);

  function animate() {
    if (!active) { cancelAnimationFrame(animId); return; }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    animId = requestAnimationFrame(animate);
  }
  animate();
}
