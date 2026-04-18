/**
 * Sen Institut de Beauté — main.js
 * Navigation, animations, galerie, témoignages
 */

/* ============================================================
   CONFIGURATION DES IMAGES
   Modifiez ce tableau si vous renommez vos fichiers
   ============================================================ */
const IMAGES = {};
for (let i = 1; i <= 24; i++) {
  IMAGES[`img${i}`] = `images/${i}.jpeg`;
}

/* ============================================================
   UTILITIES
   ============================================================ */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ============================================================
   NAV — Scroll & Burger
   ============================================================ */
(function initNav() {
  const header = $('#header');
  const burger = $('#navBurger');
  const menu   = $('#navMenu');

  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  burger.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  $$('.nav__link, .nav__cta').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
      burger.classList.remove('open');
      burger.setAttribute('aria-expanded', false);
      document.body.style.overflow = '';
    });
  });

  document.addEventListener('click', (e) => {
    if (menu.classList.contains('open') &&
        !menu.contains(e.target) &&
        !burger.contains(e.target)) {
      menu.classList.remove('open');
      burger.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
})();

/* ============================================================
   REVEAL ON SCROLL
   ============================================================ */
(function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const siblings = $$('.reveal', entry.target.parentElement);
        const idx = siblings.indexOf(entry.target);
        entry.target.style.transitionDelay = `${idx * 0.08}s`;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  $$('.reveal').forEach(el => observer.observe(el));
})();

/* ============================================================
   INJECTION DES IMAGES
   ============================================================ */
(function injectImages() {
  // Hero background — image 1
  const heroBg = $('#heroBg');
  if (heroBg) heroBg.style.backgroundImage = `url(${IMAGES.img1})`;

  // À propos — images 2 et 3
  const aboutMain = $('#aboutImgMain');
  const aboutSec  = $('#aboutImgSec');
  if (aboutMain) aboutMain.style.backgroundImage = `url(${IMAGES.img2})`;
  if (aboutSec)  aboutSec.style.backgroundImage  = `url(${IMAGES.img3})`;

  // Galerie — images 4 à 15
  const grid = $('#galleryGrid');
  if (!grid) return;

  const labels = [
    "Pose d'ongles", 'Manucure', 'Nail Art', 'Pédicure',
    'Pose de cils', 'Ongles gel', 'Baby Boomer', 'Manucure française',
    'Design exclusif', 'Nail art floral', 'Capsules gel', 'Résine acrylique'
  ];

  for (let i = 4; i <= 15; i++) {
    const item = document.createElement('div');
    item.className = 'gallery-item reveal';

    const img = document.createElement('img');
    img.src = IMAGES[`img${i}`];
    img.alt = labels[i - 4] || 'Réalisation Sen Institut';
    img.loading = 'lazy';

    const overlay = document.createElement('div');
    overlay.className = 'gallery-item__overlay';
    const label = document.createElement('span');
    label.className = 'gallery-item__label';
    label.textContent = labels[i - 4] || 'Réalisation';
    overlay.appendChild(label);

    item.appendChild(img);
    item.appendChild(overlay);
    grid.appendChild(item);
  }

  // Observer pour les items de la galerie
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  $$('.gallery-item').forEach(el => observer.observe(el));
})();

/* ============================================================
   TESTIMONIALS SLIDER
   ============================================================ */
let currentSlide = 0;
const SLIDE_INTERVAL = 5000;

function goToSlide(index) {
  const cards = $$('.temoignage-card');
  const dots  = $$('.dot');

  cards[currentSlide]?.classList.remove('active');
  dots[currentSlide]?.classList.remove('active');

  currentSlide = (index + cards.length) % cards.length;

  cards[currentSlide]?.classList.add('active');
  dots[currentSlide]?.classList.add('active');
}

let slideTimer = setInterval(() => goToSlide(currentSlide + 1), SLIDE_INTERVAL);

document.querySelectorAll('.dot').forEach((dot, i) => {
  dot.addEventListener('click', () => {
    clearInterval(slideTimer);
    goToSlide(i);
    slideTimer = setInterval(() => goToSlide(currentSlide + 1), SLIDE_INTERVAL);
  });
});

/* ============================================================
   ACTIVE NAV LINK on scroll
   ============================================================ */
(function initActiveNav() {
  const sections = $$('section[id]');
  const navLinks = $$('.nav__link');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.toggle(
            'active-link',
            link.getAttribute('href') === `#${entry.target.id}`
          );
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => observer.observe(s));
})();

/* ============================================================
   SMOOTH SCROLL
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ============================================================
   COUNTER ANIMATION (Stats section)
   ============================================================ */
(function initCounters() {
  const stats = $$('.stat-num');

  const animateCount = (el) => {
    const raw = el.textContent.trim();
    const num = parseInt(raw.replace(/\D/g, ''));
    const suffix = raw.replace(/[\d]/g, '');
    if (isNaN(num)) return;

    let start = 0;
    const duration = 1600;
    const step = 16;
    const increment = num / (duration / step);

    const timer = setInterval(() => {
      start = Math.min(start + increment, num);
      el.textContent = Math.floor(start) + suffix;
      if (start >= num) {
        el.textContent = num + suffix;
        clearInterval(timer);
      }
    }, step);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  stats.forEach(el => observer.observe(el));
})();
