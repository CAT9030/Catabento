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

    function syncPlayPauseButton() {
      const playing = !video.paused;
      btn.classList.toggle("is-playing", playing);
      btn.setAttribute("aria-label", playing ? "Pausar" : "Reproducir");
      btn.setAttribute("aria-pressed", playing ? "true" : "false");
    }

    ["play", "pause", "ended"].forEach((ev) => {
      video.addEventListener(ev, syncPlayPauseButton);
    });
    syncPlayPauseButton();

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

/* ── 4. Doc preview modal (CV / Resume / CV.md) ── */
(function initDocModal() {
  const modal    = document.getElementById('docModal');
  const panel    = document.getElementById('docModalPanel');
  const overlay  = document.getElementById('docModalOverlay');
  const frame    = document.getElementById('docModalFrame');
  const mdBody   = document.getElementById('docModalMarkdown');
  const dlBtn    = document.getElementById('docDownloadBtn');
  const closeBtn = document.getElementById('docModalClose');
  const title    = document.getElementById('docModalTitle');
  const loader   = document.getElementById('docModalLoader');

  if (!modal || !panel || !frame || !mdBody) return;

  let loaderTimeout;
  let markdownMode = false;

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  frame.addEventListener('load', () => {
    if (markdownMode) return;
    loader.classList.add('is-hidden');
    frame.classList.add('is-ready');
    clearTimeout(loaderTimeout);
  });

  function openModalPdf(src, label) {
    clearTimeout(loaderTimeout);
    markdownMode = false;
    panel.classList.remove('is-markdown');
    mdBody.innerHTML = '';
    mdBody.setAttribute('hidden', '');
    dlBtn.href            = src;
    dlBtn.download        = src.split('/').pop() || 'document.pdf';
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

  async function openModalMarkdown(src, label) {
    clearTimeout(loaderTimeout);
    markdownMode = true;
    panel.classList.add('is-markdown');
    frame.removeAttribute('src');
    frame.classList.remove('is-ready');
    mdBody.innerHTML = '';
    mdBody.removeAttribute('hidden');
    title.textContent = label;
    dlBtn.href = src;
    const fileName = src.split('/').pop() || 'CV.md';
    dlBtn.download = fileName;
    loader.classList.remove('is-hidden');
    modal.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';

    try {
      const res = await fetch(src);
      if (!res.ok) throw new Error('fetch failed');
      const text = await res.text();
      if (typeof marked !== 'undefined' && typeof marked.parse === 'function') {
        marked.setOptions({ breaks: true, gfm: true });
        mdBody.innerHTML = marked.parse(text);
      } else {
        mdBody.innerHTML = `<pre class="doc-modal__md-fallback">${escapeHtml(text)}</pre>`;
      }
    } catch {
      mdBody.innerHTML =
        '<p class="doc-modal__md-error">No se pudo cargar el CV en Markdown.</p>';
    }
    loader.classList.add('is-hidden');
    closeBtn.focus();
  }

  function closeModal() {
    clearTimeout(loaderTimeout);
    markdownMode = false;
    panel.classList.remove('is-markdown');
    mdBody.innerHTML = '';
    mdBody.setAttribute('hidden', '');
    modal.setAttribute('hidden', '');
    frame.removeAttribute('src');
    frame.classList.remove('is-ready');
    loader.classList.remove('is-hidden');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.btn-doc[data-doc]').forEach((btn) => {
    btn.addEventListener('click', () => {
      openModalPdf(btn.dataset.doc, btn.dataset.label);
    });
  });

  document.querySelectorAll('.btn-doc[data-doc-md]').forEach((btn) => {
    btn.addEventListener('click', () => {
      openModalMarkdown(btn.dataset.docMd, btn.dataset.label);
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

/* ── 5. Project info popover (cursor en desktop, toque en coarse / sin hover) ── */
(function initProjectInfoPopover() {
  const popover = document.getElementById('projectInfoPopover');
  const bodyEl = document.getElementById('projectPopoverBody');
  const closeBtn = document.getElementById('projectPopoverClose');
  const triggers = document.querySelectorAll('[data-project-template]');

  if (!popover || !bodyEl || triggers.length === 0) return;

  const MARGIN = 12;
  const GAP = 14;

  let activeTrigger = null;
  let rafId = 0;
  let lastX = 0;
  let lastY = 0;
  let hideAfterLeaveTimer = null;

  function useTouchMode() {
    return (
      window.matchMedia('(hover: none)').matches ||
      window.matchMedia('(pointer: coarse)').matches
    );
  }

  function cancelHideDelay() {
    if (hideAfterLeaveTimer) {
      clearTimeout(hideAfterLeaveTimer);
      hideAfterLeaveTimer = null;
    }
  }

  function fillContent(trigger) {
    const tid = trigger.getAttribute('data-project-template');
    const tpl = tid ? document.getElementById(tid) : null;
    if (!tpl) return false;
    bodyEl.innerHTML = '';
    bodyEl.appendChild(tpl.content.cloneNode(true));
    const h3 = bodyEl.querySelector('h3');
    if (h3) h3.id = 'projectPopoverHeading';
    return true;
  }

  function positionFromMouse(clientX, clientY) {
    if (!activeTrigger) return;
    popover.removeAttribute('hidden');
    const w = popover.offsetWidth;
    const h = popover.offsetHeight;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    let left = clientX + GAP;
    let top = clientY - h / 2;

    if (left + w + MARGIN > vw) {
      left = clientX - GAP - w;
    }

    left = Math.min(Math.max(MARGIN, left), vw - w - MARGIN);
    top = Math.min(Math.max(MARGIN, top), vh - h - MARGIN);

    popover.style.left = `${Math.round(left)}px`;
    popover.style.top = `${Math.round(top)}px`;
  }

  function scheduleMousePos(x, y) {
    lastX = x;
    lastY = y;
    if (rafId) return;
    rafId = requestAnimationFrame(() => {
      rafId = 0;
      positionFromMouse(lastX, lastY);
    });
  }

  function positionFromTrigger(trigger) {
    const r = trigger.getBoundingClientRect();
    popover.removeAttribute('hidden');
    const w = popover.offsetWidth;
    const h = popover.offsetHeight;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const spaceRight = vw - r.right - MARGIN;
    const spaceLeft = r.left - MARGIN;
    let left =
      spaceRight >= w + GAP || spaceRight >= spaceLeft
        ? r.right + GAP
        : r.left - GAP - w;

    let top = r.top + (r.height - h) / 2;
    left = Math.min(Math.max(MARGIN, left), vw - w - MARGIN);
    top = Math.min(Math.max(MARGIN, top), vh - h - MARGIN);

    popover.style.left = `${Math.round(left)}px`;
    popover.style.top = `${Math.round(top)}px`;
  }

  function hide() {
    cancelHideDelay();
    popover.setAttribute('hidden', '');
    popover.classList.remove('is-interactive');
    popover.style.left = '';
    popover.style.top = '';
    if (activeTrigger) {
      activeTrigger.setAttribute('aria-expanded', 'false');
      activeTrigger = null;
    }
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = 0;
    }
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      hide();
    });
  }

  function showPointer(trigger, clientX, clientY) {
    if (!fillContent(trigger)) return;
    activeTrigger = trigger;
    trigger.setAttribute('aria-expanded', 'true');
    popover.classList.remove('is-interactive');
    lastX = clientX;
    lastY = clientY;
    scheduleMousePos(clientX, clientY);
  }

  triggers.forEach((trigger) => {
    trigger.addEventListener('mouseenter', (e) => {
      if (useTouchMode()) return;
      cancelHideDelay();
      showPointer(trigger, e.clientX, e.clientY);
    });

    trigger.addEventListener('mousemove', (e) => {
      if (useTouchMode()) return;
      if (activeTrigger !== trigger) return;
      scheduleMousePos(e.clientX, e.clientY);
    });

    trigger.addEventListener('mouseleave', () => {
      if (useTouchMode()) return;
      if (activeTrigger !== trigger) return;
      if (document.activeElement === trigger) return;
      hideAfterLeaveTimer = window.setTimeout(() => {
        hideAfterLeaveTimer = null;
        if (useTouchMode()) return;
        if (activeTrigger !== trigger) return;
        if (document.activeElement === trigger) return;
        hide();
      }, 180);
    });

    trigger.addEventListener('focus', () => {
      if (useTouchMode()) return;
      cancelHideDelay();
      if (!fillContent(trigger)) return;
      activeTrigger = trigger;
      trigger.setAttribute('aria-expanded', 'true');
      popover.classList.remove('is-interactive');
      popover.removeAttribute('hidden');
      requestAnimationFrame(() => positionFromTrigger(trigger));
    });

    trigger.addEventListener('blur', () => {
      if (useTouchMode()) return;
      window.setTimeout(() => {
        if (activeTrigger !== trigger) return;
        hide();
      }, 0);
    });

    trigger.addEventListener('click', (e) => {
      if (!useTouchMode()) return;
      e.preventDefault();
      if (activeTrigger === trigger) {
        hide();
        return;
      }
      cancelHideDelay();
      if (!fillContent(trigger)) return;
      activeTrigger = trigger;
      trigger.setAttribute('aria-expanded', 'true');
      popover.classList.add('is-interactive');
      popover.removeAttribute('hidden');
      requestAnimationFrame(() => positionFromTrigger(trigger));
    });

    trigger.addEventListener('keydown', (e) => {
      if (!useTouchMode()) return;
      if (e.key !== 'Enter' && e.key !== ' ') return;
      e.preventDefault();
      trigger.click();
    });
  });

  document.addEventListener(
    'click',
    (e) => {
      if (!useTouchMode()) return;
      if (popover.hasAttribute('hidden')) return;
      if (popover.contains(e.target)) return;
      if ([...triggers].some((t) => t.contains(e.target))) return;
      hide();
    },
    true
  );

  document.addEventListener(
    'keydown',
    (e) => {
      if (e.key !== 'Escape') return;
      if (popover.hasAttribute('hidden')) return;
      hide();
      e.preventDefault();
      e.stopImmediatePropagation();
    },
    true
  );

  window.addEventListener('resize', () => {
    if (popover.hasAttribute('hidden') || !activeTrigger) return;
    if (useTouchMode()) {
      requestAnimationFrame(() => positionFromTrigger(activeTrigger));
    } else {
      scheduleMousePos(lastX, lastY);
    }
  });

  window.addEventListener(
    'scroll',
    () => {
      if (popover.hasAttribute('hidden') || !activeTrigger) return;
      if (useTouchMode()) {
        positionFromTrigger(activeTrigger);
      } else {
        scheduleMousePos(lastX, lastY);
      }
    },
    true
  );
})();

/* ── 6. Behance feed en tiempo real (RSS → rss2json) ── */
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
