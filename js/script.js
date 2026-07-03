/* ── モーダル ─────────────────────────────── */
function initModal() {
  const modal      = document.getElementById('js-about-modal');
  const openBtns   = document.querySelectorAll('.js-modal-open');
  const closeBtns  = document.querySelectorAll('.js-modal-close');
  if (!modal) return;

  openBtns.forEach(btn => {
    btn.addEventListener('click', () => modal.showModal());
  });

  closeBtns.forEach(btn => {
    btn.addEventListener('click', () => modal.close());
  });

  // backdrop クリックで閉じる
  modal.addEventListener('click', e => {
    if (e.target === modal) modal.close();
  });
}

/* ── アコーディオン（FAQ） ───────────────────── */
function initAccordion() {
  document.querySelectorAll('.js-accordion').forEach(btn => {
    btn.addEventListener('click', () => {
      const box  = btn.closest('.qa-box');
      const body = box.querySelector('.qa-box__body');
      const isOpen = box.classList.contains('is-open');

      // 他をすべて閉じる
      document.querySelectorAll('.qa-box.is-open').forEach(el => {
        el.classList.remove('is-open');
        el.querySelector('.qa-box__body').style.display = 'none';
      });

      if (!isOpen) {
        box.classList.add('is-open');
        body.style.display = 'block';
      }
    });
  });
}

/* ── スクロールアニメーション ─────────────────── */
function initScrollReveal() {
  const targets = document.querySelectorAll('.js-in-view');
  if (!targets.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  targets.forEach(el => observer.observe(el));
}

/* ── スティッキーナビ ────────────────────────── */
function initNav() {
  const nav = document.querySelector('.header');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('is-scrolled', window.scrollY > 40);
  }, { passive: true });
}

/* ── スムーズスクロール ──────────────────────── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = document.querySelector('.header')?.offsetHeight ?? 0;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ── 数値カウントアップ ──────────────────────── */
function initCountUp() {
  const cells = document.querySelectorAll('.num-val');
  if (!cells.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el      = entry.target;
      const rawText = el.textContent.trim();
      const numMatch = rawText.match(/[\d.]+/);
      if (!numMatch) return;

      const target  = parseFloat(numMatch[0]);
      const isFloat = rawText.includes('.');
      const suffix  = rawText.replace(/[\d.]+/, '');
      let current   = 0;
      const duration = 1200;
      const step     = 16;
      const inc      = target / (duration / step);

      const timer = setInterval(() => {
        current = Math.min(current + inc, target);
        el.textContent = (isFloat ? current.toFixed(1) : Math.floor(current)) + suffix;
        if (current >= target) clearInterval(timer);
      }, step);

      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  cells.forEach(el => observer.observe(el));
}

/* ── ページトップボタン ──────────────────────── */
function initPagetop() {
  const btn = document.getElementById('js-pagetop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('is-show', window.scrollY > 300);
  }, { passive: true });
}

/* ── Swiper（ギャラリー） ───────────────────── */
function initSwiper() {
  if (typeof Swiper === 'undefined') return;
  new Swiper('#js-gallery-swiper', {
    loop: true,
    slidesPerView: 1,
    spaceBetween: 24,
    pagination: {
      el: '#js-gallery-pagination',
      clickable: true,
    },
    navigation: {
      prevEl: '#js-gallery-prev',
      nextEl: '#js-gallery-next',
    },
    breakpoints: {
      768: { slidesPerView: 2 },
      1024: { slidesPerView: 3 },
    },
  });
}
