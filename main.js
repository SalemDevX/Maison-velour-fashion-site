/* ============================================================
   MAISON VÉLOUR — Shared JavaScript
   ============================================================ */

// ── NAV SCROLL EFFECT ──────────────────────────────────────
(function () {
  const nav = document.querySelector('.site-nav');
  if (!nav) return;
  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

// ── ACTIVE NAV LINK ────────────────────────────────────────
(function () {
  const links = document.querySelectorAll('.nav-links a');
  const current = window.location.pathname.split('/').pop() || 'index.html';
  links.forEach(a => {
    const href = a.getAttribute('href').split('/').pop();
    if (href === current) a.classList.add('active');
  });
})();

// ── SCROLL REVEAL ──────────────────────────────────────────
(function () {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  els.forEach(el => io.observe(el));
})();

// ── TOAST NOTIFICATION ─────────────────────────────────────
function showToast(msg, duration = 3500) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toast._tid);
  toast._tid = setTimeout(() => toast.classList.remove('show'), duration);
}

// ── FILTER BUTTONS ─────────────────────────────────────────
function initFilters() {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const parent = btn.closest('.filter-bar');
      parent.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      document.querySelectorAll('.product-card').forEach(card => {
        const match = filter === 'all' || card.dataset.category === filter;
        card.style.display = match ? '' : 'none';
      });
    });
  });
}

// ── TABS ───────────────────────────────────────────────────
function initTabs() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const container = btn.closest('[data-tabs]');
      container.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      container.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const target = container.querySelector('#' + btn.dataset.tab);
      if (target) target.classList.add('active');
    });
  });
}

// ── COUNTER ANIMATION ─────────────────────────────────────
function animateCounters() {
  document.querySelectorAll('.stat-number[data-target]').forEach(el => {
    const target = parseInt(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const duration = 1800;
    const start = performance.now();
    const update = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(ease * target) + suffix;
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  });
}

// Trigger counters when stats section enters view
(function () {
  const statsBar = document.querySelector('.stats-bar');
  if (!statsBar) return;
  const io = new IntersectionObserver(([e]) => {
    if (e.isIntersecting) { animateCounters(); io.disconnect(); }
  }, { threshold: 0.3 });
  io.observe(statsBar);
})();

// ── FORM VALIDATION ────────────────────────────────────────
function initForm() {
  const form = document.querySelector('#inquiryForm');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const required = form.querySelectorAll('[required]');
    let valid = true;
    required.forEach(input => {
      if (!input.value.trim()) {
        input.style.borderColor = '#8b1a1a';
        valid = false;
      } else {
        input.style.borderColor = '';
      }
    });
    if (valid) {
      showToast('✓  Your inquiry has been received. We will be in touch shortly.');
      form.reset();
    } else {
      showToast('Please fill in all required fields.');
    }
  });
}

// ── SMOOTH HOVER ON BOARD CARDS ───────────────────────────
function initBoardCards() {
  document.querySelectorAll('.board-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.querySelector('.board-avatar').style.borderWidth = '4px';
    });
    card.addEventListener('mouseleave', () => {
      card.querySelector('.board-avatar').style.borderWidth = '3px';
    });
  });
}

// ── EVENT RSVP BUTTON ─────────────────────────────────────
function initEventCards() {
  document.querySelectorAll('.event-card').forEach(card => {
    card.addEventListener('click', () => {
      const title = card.querySelector('h3')?.textContent || 'event';
      showToast(`RSVP request sent for: ${title}`);
    });
  });
}

// ── WISHLIST BUTTONS ──────────────────────────────────────
function initWishlist() {
  document.querySelectorAll('.btn-sm.gold').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      btn.classList.toggle('active');
      const added = btn.classList.contains('active');
      showToast(added ? '♥  Added to your wishlist' : '♡  Removed from wishlist');
    });
  });
}

// ── INIT ALL ──────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initFilters();
  initTabs();
  initForm();
  initBoardCards();
  initEventCards();
  initWishlist();
});
