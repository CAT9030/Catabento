/* ============================================================
   main.js — Comportamiento mínimo, sin dependencias
   ============================================================ */

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

/* ── 4. Behance feed en tiempo real (RSS → rss2json) ── */
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
