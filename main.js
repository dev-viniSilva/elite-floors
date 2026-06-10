/* =============================================
   ELITE FLOORS — main.js
   ============================================= */

(function () {
  'use strict';

  // ── NAV SCROLL STATE ──
  const nav = document.getElementById('nav');
  function updateNav() {
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  // ── HAMBURGER MENU ──
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', navLinks.classList.contains('open'));
  });
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });
  document.addEventListener('click', e => {
    if (!nav.contains(e.target)) navLinks.classList.remove('open');
  });

  // ── REVEAL ON SCROLL ──
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const siblings = entry.target.parentElement.querySelectorAll('.reveal');
          let delay = 0;
          siblings.forEach((sib, idx) => {
            if (sib === entry.target) delay = idx * 80;
          });
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, Math.min(delay, 300));
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );
  revealEls.forEach(el => revealObserver.observe(el));

  // ── COUNTER ANIMATION ──
  function animateCounter(el) {
    const target   = parseInt(el.dataset.target, 10);
    const duration = 1800;
    const start    = performance.now();
    function tick(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = target;
    }
    requestAnimationFrame(tick);
  }

  const statsSection  = document.querySelector('.stats');
  let countersStarted = false;
  const statsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !countersStarted) {
          countersStarted = true;
          document.querySelectorAll('.stats__num').forEach(animateCounter);
          statsObserver.disconnect();
        }
      });
    },
    { threshold: 0.3 }
  );
  if (statsSection) statsObserver.observe(statsSection);

  // ── SMOOTH SCROLL ──
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const navH = nav.offsetHeight;
        const top  = target.getBoundingClientRect().top + window.scrollY - navH - 16;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ── BEFORE / AFTER SLIDERS ──
  document.querySelectorAll('[data-slider]').forEach(slider => {
    const handle = slider.querySelector('[data-handle]');
    const after  = slider.querySelector('.ba__img--after');
    if (!after || !handle) return;

    let dragging = false;

    function setPosition(x) {
      const rect = slider.getBoundingClientRect();
      let ratio  = (x - rect.left) / rect.width;
      ratio      = Math.max(0.04, Math.min(0.96, ratio));
      const pct  = ratio * 100;
      after.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
      handle.style.left    = `${pct}%`;
    }

    after.style.clipPath   = 'inset(0 50% 0 0)';
    handle.style.left      = '50%';
    handle.style.transform = 'translateX(-50%)';

    slider.addEventListener('mousedown', e => { dragging = true; setPosition(e.clientX); e.preventDefault(); });
    window.addEventListener('mousemove', e => { if (dragging) setPosition(e.clientX); });
    window.addEventListener('mouseup',   () => { dragging = false; });

    slider.addEventListener('touchstart', e => { dragging = true; setPosition(e.touches[0].clientX); }, { passive: true });
    slider.addEventListener('touchmove',  e => { if (dragging) setPosition(e.touches[0].clientX); }, { passive: true });
    slider.addEventListener('touchend',   () => { dragging = false; });
  });

  // ── FORM: submitted natively to Formspree (redirect handled by Formspree) ──
  // No JS interception — the form POSTs directly and Formspree shows its thank-you page.
  // To use a custom redirect, set it in your Formspree dashboard under Settings → Redirect URL.

  // ── SERVICE CARD HOVER DEPTH ──
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mousemove', function (e) {
      const rect = card.getBoundingClientRect();
      const x    = ((e.clientX - rect.left) / rect.width  - 0.5) * 8;
      const y    = ((e.clientY - rect.top)  / rect.height - 0.5) * 6;
      card.style.transform = `perspective(800px) rotateX(${-y}deg) rotateY(${x}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', function () {
      card.style.transform  = '';
      card.style.transition = 'transform 0.4s ease, background 0.35s ease';
    });
  });

  // ── ACTIVE NAV LINK ──
  const sections   = document.querySelectorAll('section[id]');
  const navLinkEls = document.querySelectorAll('.nav__link');
  function updateActiveLink() {
    const scrollY = window.scrollY + nav.offsetHeight + 40;
    let current   = '';
    sections.forEach(sec => { if (sec.offsetTop <= scrollY) current = sec.id; });
    navLinkEls.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) link.classList.add('active');
    });
  }
  window.addEventListener('scroll', updateActiveLink, { passive: true });

})();