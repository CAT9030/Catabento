/* ============================================================
   main.js — Comportamiento mínimo, sin dependencias
   ============================================================ */

/* ── 0. Favicon circular generado via Canvas ── */
(function initCircularFavicon() {
  const size = 64;
  const img = new Image();
  img.onload = function () {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(img, 0, 0, size, size);
    const link = document.querySelector("link[rel='icon']") || document.createElement('link');
    link.rel = 'icon';
    link.href = canvas.toDataURL('image/png');
    document.head.appendChild(link);
  };
  img.src = 'assets/profile/avatar.jpg';
})();

/* ── 0. Dark / Light mode toggle ── */
(function initThemeToggle() {
  const STORAGE_KEY = 'cata-theme';
  const btn = document.getElementById('themeToggle');
  if (!btn) return;

  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const saved = localStorage.getItem(STORAGE_KEY);
  const isDark = saved ? saved === 'dark' : prefersDark;

  function applyTheme(dark) {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    btn.setAttribute('aria-label', dark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
  }

  applyTheme(isDark);

  btn.addEventListener('click', () => {
    const currentlyDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const next = !currentlyDark;
    applyTheme(next);
    localStorage.setItem(STORAGE_KEY, next ? 'dark' : 'light');
  });
})();

/* ── 1. Lazy-load robusto con IntersectionObserver ── */
(function initLazyLoad() {
  if (!("IntersectionObserver" in window)) {
    return;
  }

  const imgs = document.querySelectorAll('img[loading="lazy"]');
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const img = entry.target;
        const ds = img.dataset.src;
        if (ds) {
          img.src = ds;
        }
        img.removeAttribute("data-src");
        obs.unobserve(img);
      });
    },
    { rootMargin: "200px" }
  );

  imgs.forEach((img) => observer.observe(img));

  document.querySelectorAll(".btn-follow").forEach((btn) => {
    const url = btn.getAttribute("data-follow-url");
    if (!url) return;

    const openFollow = (e) => {
      e.preventDefault();
      e.stopPropagation();
      window.open(url, "_blank", "noopener,noreferrer");
    };

    btn.addEventListener("click", openFollow);
    btn.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openFollow(e);
      }
    });
  });
})();

/* ── 2. Video autoplay fallback (por si el browser lo bloquea) ── */
(function initVideoAutoplay() {
  document.querySelectorAll("video[autoplay]").forEach((video) => {
    const promise = video.play();
    if (promise !== undefined) {
      promise.catch(() => {
        video.controls = true;
      });
    }
  });
})();

/* ── 3. Video: botón play/pause, siguiente, fullscreen ── */
(function initVideoControls() {
  document.querySelectorAll("[data-video-toggle]").forEach((btn) => {
    const card = btn.closest(".card-video");
    const video = card?.querySelector("video");
    if (!video) return;

    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (video.paused) {
        video.play();
      } else {
        video.pause();
      }
    });
  });

  document.querySelectorAll("[data-video-next]").forEach((btn) => {
    const card = btn.closest(".card-video");
    const video = card?.querySelector("video");
    if (!video) return;

    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const dur = video.duration;
      if (!Number.isFinite(dur) || dur <= 0) {
        video.currentTime = 0;
        return;
      }
      const next = Math.min(dur, video.currentTime + 5);
      video.currentTime = next;
    });
  });

  document.querySelectorAll("[data-video-fullscreen]").forEach((btn) => {
    const card = btn.closest(".card-video");
    const video = card?.querySelector("video");
    if (!video) return;

    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (video.requestFullscreen) {
        video.requestFullscreen();
      } else if (video.webkitRequestFullscreen) {
        video.webkitRequestFullscreen();
      }
    });
  });
})();

/* ── 4. Doc preview modal (CV / Resume) ── */
(function initDocModal() {
  const modal    = document.getElementById('docModal');
  const overlay  = document.getElementById('docModalOverlay');
  const frame    = document.getElementById('docModalFrame');
  const dlBtn    = document.getElementById('docDownloadBtn');
  const closeBtn = document.getElementById('docModalClose');
  const title    = document.getElementById('docModalTitle');
  const loader   = document.getElementById('docModalLoader');

  if (!modal) return;

  let loaderTimeout;

  frame.addEventListener('load', () => {
    loader.classList.add('is-hidden');
    frame.classList.add('is-ready');
    clearTimeout(loaderTimeout);
  });

  function openModal(src, label) {
    dlBtn.href            = src;
    dlBtn.download        = label.replace(/\s*—\s*/, ' ').trim() + '.pdf';
    title.textContent     = label;
    frame.classList.remove('is-ready');
    loader.classList.remove('is-hidden');
    modal.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => {
      frame.setAttribute('src', src);
      loaderTimeout = setTimeout(() => {
        loader.classList.add('is-hidden');
        frame.classList.add('is-ready');
      }, 8000);
    });
    closeBtn.focus();
  }

  function closeModal() {
    modal.setAttribute('hidden', '');
    frame.removeAttribute('src');
    frame.classList.remove('is-ready');
    loader.classList.remove('is-hidden');
    clearTimeout(loaderTimeout);
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.btn-doc').forEach((btn) => {
    btn.addEventListener('click', () => {
      openModal(btn.dataset.doc, btn.dataset.label);
    });
  });

  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.hasAttribute('hidden')) {
      closeModal();
    }
  });
})();

/* ── 5. Behance feed en tiempo real (RSS → rss2json) ── */
(function initBehanceFeed() {
  const grid = document.querySelector("[data-behance-grid]");
  if (!grid) return;

  const RSS_URL = encodeURIComponent(
    "https://www.behance.net/feeds/user?username=catagiraldoaguirre"
  );
  const API = `https://api.rss2json.com/v1/api.json?rss_url=${RSS_URL}&count=6`;

  fetch(API)
    .then((r) => r.json())
    .then(({ status, items }) => {
      if (status !== "ok" || !items?.length) return;
      grid.innerHTML = items
        .slice(0, 6)
        .map(
          ({ link, title, thumbnail }) => `
          <a class="thumb-item"
             href="${link}"
             target="_blank"
             rel="noopener noreferrer"
             role="listitem"
             aria-label="${title}">
            <img src="${thumbnail}" alt="${title}" loading="lazy" />
          </a>`
        )
        .join("");
    })
    .catch(() => { /* mantiene fallback estático */ });
})();
