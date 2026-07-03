(function () {
  function initModal() {
    const dialog = document.querySelector('[data-modal]');
    const openButton = document.querySelector('[data-open-modal]');
    const closeButton = dialog ? dialog.querySelector('[data-close-modal]') : null;

    if (!dialog || !openButton || typeof dialog.showModal !== 'function') {
      return;
    }

    openButton.addEventListener('click', function () {
      dialog.showModal();
    });

    if (closeButton) {
      closeButton.addEventListener('click', function () {
        dialog.close();
      });
    }

    dialog.addEventListener('click', function (event) {
      const rect = dialog.getBoundingClientRect();
      const clickedInDialog =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;

      if (!clickedInDialog) {
        dialog.close();
      }
    });
  }

  function initAccordion() {
    const questions = Array.from(document.querySelectorAll('.faq-question'));
    if (!questions.length) {
      return;
    }

    questions.forEach(function (question) {
      question.addEventListener('click', function () {
        const currentAnswer = question.nextElementSibling;
        const willOpen = question.getAttribute('aria-expanded') !== 'true';

        questions.forEach(function (otherQuestion) {
          const otherAnswer = otherQuestion.nextElementSibling;
          otherQuestion.setAttribute('aria-expanded', 'false');
          if (otherAnswer) {
            otherAnswer.hidden = true;
          }
        });

        if (currentAnswer && willOpen) {
          question.setAttribute('aria-expanded', 'true');
          currentAnswer.hidden = false;
        }
      });
    });
  }

  function initScrollReveal() {
    const items = document.querySelectorAll('.js-in-view');
    if (!items.length || typeof IntersectionObserver === 'undefined') {
      return;
    }

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in-view');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    items.forEach(function (item) {
      observer.observe(item);
    });
  }

  function initNav() {
    const header = document.querySelector('.site-header');
    if (!header) {
      return;
    }

    function onScroll() {
      header.classList.toggle('is-scrolled', window.scrollY > 40);
    }

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    if (!links.length) {
      return;
    }

    links.forEach(function (link) {
      link.addEventListener('click', function (event) {
        const href = link.getAttribute('href');
        if (!href || href === '#') {
          return;
        }

        const target = document.querySelector(href);
        if (!target) {
          return;
        }

        event.preventDefault();
        const header = document.querySelector('.site-header');
        const offset = header ? header.offsetHeight : 0;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;

        window.scrollTo({
          top: Math.max(0, top),
          behavior: 'smooth',
        });
      });
    });
  }

  function initCountUp() {
    const NUMERIC_PATTERN = /-?\d+(?:\.\d+)?/;
    const DEFAULT_COUNTUP_DURATION_MS = 1400;
    const elements = document.querySelectorAll('.num-val');
    if (!elements.length || typeof IntersectionObserver === 'undefined') {
      return;
    }

    function animate(element) {
      const original = element.textContent ? element.textContent.trim() : '';
      const match = original.match(NUMERIC_PATTERN);
      if (!match) {
        return;
      }

      const numericText = match[0];
      const startIndex = match.index || 0;
      const prefix = original.slice(0, startIndex);
      const suffix = original.slice(startIndex + numericText.length);
      const endValue = Number(numericText);
      const decimals = (numericText.split('.')[1] || '').length;
      const duration = Number(element.dataset.duration || DEFAULT_COUNTUP_DURATION_MS);

      function formatValue(value) {
        if (decimals > 0) {
          return value.toFixed(decimals);
        }
        return String(Math.round(value));
      }

      const startTime = performance.now();

      function frame(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const current = endValue * progress;

        element.textContent = prefix + formatValue(current) + suffix;

        if (progress < 1) {
          requestAnimationFrame(frame);
        }
      }

      requestAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animate(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    elements.forEach(function (element) {
      observer.observe(element);
    });
  }

  function initPagetop() {
    const pagetop = document.querySelector('.js-pagetop');
    if (!pagetop) {
      return;
    }

    function onScroll() {
      pagetop.classList.toggle('is-show', window.scrollY > 300);
    }

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    pagetop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  function initSwiper() {
    const container = document.querySelector('.swiper');
    if (!container || typeof window.Swiper !== 'function') {
      return;
    }

    new window.Swiper(container, {
      loop: true,
      slidesPerView: 1,
      spaceBetween: 16,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      breakpoints: {
        768: {
          slidesPerView: 2,
        },
        1024: {
          slidesPerView: 3,
        },
      },
    });
  }

  function initAll() {
    initModal();
    initAccordion();
    initScrollReveal();
    initNav();
    initSmoothScroll();
    initCountUp();
    initPagetop();
    initSwiper();
  }

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initAll);
    } else {
      initAll();
    }
  }

  if (typeof window !== 'undefined') {
    window.initModal = initModal;
    window.initAccordion = initAccordion;
    window.initScrollReveal = initScrollReveal;
    window.initNav = initNav;
    window.initSmoothScroll = initSmoothScroll;
    window.initCountUp = initCountUp;
    window.initPagetop = initPagetop;
    window.initSwiper = initSwiper;
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      initModal: initModal,
      initAccordion: initAccordion,
      initScrollReveal: initScrollReveal,
      initNav: initNav,
      initSmoothScroll: initSmoothScroll,
      initCountUp: initCountUp,
      initPagetop: initPagetop,
      initSwiper: initSwiper,
    };
  }
})();
