// ── Mobile menu ─────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

if (hamburger) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
}

// Close menu on link click
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => navLinks && navLinks.classList.remove('open'));
});

// ── FAQ accordion ───────────────────────────
document.querySelectorAll('.faq-item').forEach(item => {
  const q = item.querySelector('.faq-q');
  if (q) {
    q.addEventListener('click', () => {
      // Close others
      document.querySelectorAll('.faq-item.open').forEach(open => {
        if (open !== item) open.classList.remove('open');
      });
      item.classList.toggle('open');
    });
  }
});

// ── Scroll fade-in ──────────────────────────
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll(
  '.card, .why-item, .t-card, .team-card, .service-card, .process-step, .info-card, .blog-card, .accred-badge, .mv-card'
).forEach(el => {
  el.classList.add('fade-in');
  observer.observe(el);
});

// ── Newsletter button ───────────────────────
function subscribeNewsletter(e) {
  e.preventDefault();
  const msg = document.getElementById('nl-msg');
  if (msg) { msg.style.display = 'block'; }
  e.target.reset();
}
