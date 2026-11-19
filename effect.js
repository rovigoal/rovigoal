(function () {
  'use strict';

  // --- Canvas a schermo intero ---
  const canvas = document.createElement('canvas');
  canvas.style.cssText =
    'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999;';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  const DPR = window.devicePixelRatio || 1;

  function resize() {
    canvas.width = window.innerWidth * DPR;
    canvas.height = window.innerHeight * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize);

  // --- Palette del sito ---
  const colors = ['#c7f73e', '#ffffff', '#f0b800', '#a8d62e', '#ff4757'];

  let particles = [];
  let animationId = null;

  // --- Esplosione circolare ---
  function burst(x, y) {
    particles.push({
      ring: true,
      x: x,
      y: y,
      radius: 0,
      maxRadius: 60 + Math.random() * 30,
      life: 1,
      decay: 0.03,
      color: colors[Math.floor(Math.random() * colors.length)]
    });

    const count = 22 + Math.floor(Math.random() * 10);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + Math.random() * 0.15;
      const speed = 2 + Math.random() * 4;
      particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 1.8 + Math.random() * 3,
        life: 1,
        decay: 0.014 + Math.random() * 0.02,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
    start();
  }

  // --- Animazione ---
  function animate() {
    ctx.clearRect(0, 0, canvas.width / DPR, canvas.height / DPR);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.life -= p.decay;

      if (p.life <= 0) {
        particles.splice(i, 1);
        continue;
      }

      if (p.ring) {
        p.radius += 4.5;
        if (p.radius >= p.maxRadius) {
          particles.splice(i, 1);
          continue;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 2;
        ctx.globalAlpha = p.life;
        ctx.stroke();
      } else {
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.95;
        p.vy *= 0.95;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life;
        ctx.fill();
      }
    }

    ctx.globalAlpha = 1;

    if (particles.length > 0) {
      animationId = requestAnimationFrame(animate);
    } else {
      animationId = null;
      ctx.clearRect(0, 0, canvas.width / DPR, canvas.height / DPR);
    }
  }

  function start() {
    if (!animationId) animationId = requestAnimationFrame(animate);
  }

  // --- Click handler ---
  let navigating = false;

  document.addEventListener('click', function (e) {
    const x = e.clientX;
    const y = e.clientY;

    burst(x, y);

    const link = e.target.closest('a');
    if (!link) return;

    const href = link.getAttribute('href') || '';
    const isInternal =
      href &&
      !href.startsWith('http') &&
      !href.startsWith('mailto:') &&
      !href.startsWith('#') &&
      !link.target;

    if (isInternal) {
      e.preventDefault();
      if (navigating) return;
      navigating = true;
      setTimeout(function () {
        window.location.href = href;
      }, 300);
    }
  });

  // --- Fix: reset quando si torna indietro col tasto del browser ---
  window.addEventListener('pageshow', function (event) {
    // event.persisted = true se la pagina viene dal bfcache (tasto back di Chrome)
    navigating = false;
    particles = [];
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
    ctx.clearRect(0, 0, canvas.width / DPR, canvas.height / DPR);
  });

  // --- Fix: ferma l'animazione quando si lascia la pagina ---
  window.addEventListener('pagehide', function () {
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
  });
})();
