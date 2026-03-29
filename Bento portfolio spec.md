# 📋 SPEC FINAL v3 — Bento Portfolio Catalina Giraldo Aguirre
> Basada en análisis directo del archivo Figma (node 298-357) + datos reales de Behance
> Para implementar con Claude Code — HTML / CSS / JS vanilla, sin frameworks

---

## 📸 Layout Fiel al Diseño Figma

El layout REAL (corregido del Figma) es:

```
┌─────────────────────────────────────────────────────────────────────┐
│ SIDEBAR (31%)              │ MAIN CONTENT (69%)                     │
│ sticky, left               │ 2 columnas iguales                     │
│                            │ COL-A (50%)       │ COL-B (50%)        │
│ • Avatar circular          │ Hero foto (cuadr.) │ Quote card         │
│ • Nombre grande            │                   │                    │
│ • Bio                      │                   │ Behance card       │
│ • Dots disponibilidad      │ Instagram card    │ (header + 3×2 grid)│
│ • 📍 Cali, Colombia        │ (header + 3×2 grid)│                    │
│ • ✉️ email                 │                   │ LinkedIn card      │
│                            │ Nobel | Fruto      │                    │
│                            │ (2 imgs tall side) │ Video card         │
│                            │                   │ Dynamite Eyebrows  │
│                            ├───────────────────┴────────────────────│
│                            │   @icesidmi link (centrado, full-width) │
└─────────────────────────────────────────────────────────────────────┘
```

**Fondo de página:** `#FFFFFF` (blanco, NO gris)
**Gap entre columnas y cards:** `16px`
**Padding página:** `64px` en desktop, `24px` en mobile

---

## 🏗️ Estructura de Archivos

```
bento-portfolio/
├── index.html
├── css/
│   ├── reset.css          ← normalize + box-sizing global
│   ├── tokens.css         ← variables CSS (único fuente de verdad)
│   ├── layout.css         ← sidebar + grid + breakpoints
│   └── components.css     ← cada card component
├── js/
│   └── main.js            ← lazy-load + video autoplay fallback
└── assets/
    ├── profile/
    │   └── avatar.jpg
    ├── hero/
    │   └── portrait.jpg
    ├── instagram/
    │   ├── ig-1.jpg … ig-6.jpg
    ├── projects/
    │   ├── nobel.jpg
    │   ├── fruto-dorado.jpg
    │   └── dynamite-eyebrows.jpg
    └── video/
        └── showreel.mp4
```

> ⚠️ Los thumbnails de Behance NO van en assets — se cargan directo de CDN público.

---

## 🎨 tokens.css — Variables (única fuente de verdad)

```css
/* ============================================================
   DESIGN TOKENS — editar SOLO aquí para cambiar estilos globales
   ============================================================ */
:root {
  /* ── Colores ── */
  --color-bg:           #FFFFFF;
  --color-page:         #FFFFFF;
  --color-card:         #FFFFFF;
  --color-text-primary: #111111;
  --color-text-secondary:#555555;
  --color-text-muted:   #999999;
  --color-border:       #EBEBEB;
  --color-linkedin:     #0A66C2;
  --color-behance:      #1769FF;
  --color-dot-active:   #22C55E;
  --color-dot-idle:     #D1D5DB;

  /* ── Espaciado ── */
  --gap:                16px;
  --page-padding:       64px;
  --card-padding:       24px;
  --card-gap:           16px;      /* entre thumbnails */

  /* ── Radios ── */
  --radius-card:        20px;
  --radius-img:         14px;
  --radius-thumb:       10px;
  --radius-avatar:      50%;
  --radius-btn:         100px;     /* pill */

  /* ── Sombras ── */
  --shadow-card:        0 1px 4px rgba(0,0,0,0.07);
  --shadow-hover:       0 6px 24px rgba(0,0,0,0.12);

  /* ── Tipografía ── */
  --font-display:       'Syne', sans-serif;
  --font-body:          'DM Sans', sans-serif;

  /* ── Transiciones ── */
  --ease:               cubic-bezier(0.25, 0.46, 0.45, 0.94);
  --duration:           0.22s;
}
```

---

## 📐 layout.css — Grid y Sidebar

```css
/* ── Reset base ── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: var(--font-body); background: var(--color-bg); color: var(--color-text-primary); }
a { text-decoration: none; color: inherit; }
img { display: block; max-width: 100%; }

/* ── Page wrapper ── */
.page {
  display: flex;
  min-height: 100vh;
  padding: var(--page-padding);
  gap: var(--gap);
}

/* ── Sidebar ── */
.sidebar {
  width: 320px;           /* ~31% a 1920px pero tamaño fijo */
  flex-shrink: 0;
  position: sticky;
  top: var(--page-padding);
  align-self: flex-start;
  height: fit-content;
}

/* ── Área de contenido ── */
.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--gap);
}

/* ── Grid de 2 columnas ── */
.bento-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto;
  gap: var(--gap);
  align-items: start;
}

/* ── Asignación de áreas ── */
.card-hero       { grid-column: 1; grid-row: 1; }
.card-quote      { grid-column: 2; grid-row: 1; }
.card-instagram  { grid-column: 1; grid-row: 2; }
.card-behance    { grid-column: 2; grid-row: 2; }
.card-projects   { grid-column: 1; grid-row: 3; }   /* Nobel + Fruto side-by-side */
.card-right-col  { grid-column: 2; grid-row: 3; }   /* LinkedIn + Video + Dynamite */

/* ── Footer link ── */
.footer-link {
  display: flex;
  justify-content: center;
  padding: 24px 0 8px;
}

/* ─────────────────────────────
   BREAKPOINTS
   ───────────────────────────── */

/* Tablet (≤1199px): sidebar arriba + 2 columnas */
@media (max-width: 1199px) {
  .page         { flex-direction: column; padding: 32px 24px; }
  .sidebar      { width: 100%; position: static; display: flex; flex-direction: row;
                  align-items: center; gap: 20px; flex-wrap: wrap; }
  .sidebar .bio, .sidebar .meta { flex-basis: 100%; }
}

/* Tablet pequeño (≤900px): 1 columna */
@media (max-width: 900px) {
  .bento-grid   { grid-template-columns: 1fr; }
  .card-hero, .card-quote, .card-instagram, .card-behance,
  .card-projects, .card-right-col { grid-column: 1; grid-row: auto; }
}

/* Mobile (≤480px) */
@media (max-width: 480px) {
  .page         { padding: 16px; }
  :root         { --card-padding: 16px; }
}
```

---

## 🃏 components.css — Cada Card

### Card base
```css
.card {
  background: var(--color-card);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
  overflow: hidden;
  transition: box-shadow var(--duration) var(--ease),
              transform var(--duration) var(--ease);
}
.card:hover {
  box-shadow: var(--shadow-hover);
  transform: translateY(-2px);
}
```

### Sidebar — No es card, es panel
```css
.sidebar__avatar {
  width: 120px; height: 120px;
  border-radius: var(--radius-avatar);
  object-fit: cover;
  margin-bottom: 20px;
}
.sidebar__name {
  font: 700 clamp(22px, 2vw, 32px)/1.15 var(--font-display);
  margin-bottom: 12px;
}
.sidebar__bio {
  font: 400 14px/1.65 var(--font-body);
  color: var(--color-text-secondary);
  max-width: 420px;
  margin-bottom: 16px;
}
.sidebar__dots { display: flex; gap: 6px; margin-bottom: 16px; }
.sidebar__dot  { width: 12px; height: 12px; border-radius: 50%; }
.sidebar__dot--on  { background: var(--color-dot-active); }
.sidebar__dot--off { background: var(--color-dot-idle); }
.sidebar__meta { display: flex; flex-direction: column; gap: 8px; }
.sidebar__meta-item {
  display: flex; align-items: center; gap: 8px;
  font: 400 14px var(--font-body); color: var(--color-text-secondary);
}
```

### Hero foto
```css
.card-hero { padding: 0; }    /* sin padding — la imagen llena toda la card */
.card-hero img {
  width: 100%;
  aspect-ratio: 1;            /* cuadrada, como en el Figma */
  object-fit: cover;
  display: block;
}
```

### Quote card
```css
.card-quote { padding: var(--card-padding); }
.card-quote__icon {
  font-size: 40px; line-height: 1;
  color: var(--color-text-primary);
  display: block;
  margin-bottom: 16px;
  font-family: Georgia, serif;  /* ❝ natural */
}
.card-quote__text {
  font: 400 italic clamp(15px, 1.2vw, 18px)/1.55 var(--font-display);
  color: var(--color-text-primary);
}
```

### Social cards — Header compartido (Behance e Instagram)
```css
/* Estructura interna igual para Behance e Instagram */
.social-card { padding: var(--card-padding); }
.social-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}
.social-card__brand {
  display: flex;
  align-items: center;
  gap: 12px;
}
.social-card__logo {
  width: 48px; height: 48px;
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.social-card__logo--behance  { background: var(--color-behance); }
.social-card__logo--instagram {
  background: radial-gradient(circle at 30% 107%,
    #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%);
}
.social-card__logo svg { width: 28px; height: 28px; fill: white; }

.btn-follow {
  display: flex; align-items: center; gap: 6px;
  padding: 6px 14px;
  border-radius: var(--radius-btn);
  border: none; cursor: pointer;
  font: 600 13px var(--font-body);
  transition: opacity var(--duration);
}
.btn-follow:hover { opacity: 0.85; }
.btn-follow--behance  { background: var(--color-behance); color: white; }
.btn-follow--instagram { background: #E1306C; color: white; }

.social-card__subtitle {
  font: 400 13px var(--font-body);
  color: var(--color-text-secondary);
  margin-bottom: 16px;
  display: block;
}

/* Grid de thumbnails 3×2 */
.thumbs-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}
.thumb-item {
  overflow: hidden;
  border-radius: var(--radius-thumb);
  aspect-ratio: 1;            /* cuadrados, fiel al Figma */
  display: block;
  position: relative;
}
.thumb-item img {
  width: 100%; height: 100%;
  object-fit: cover;
  transition: transform 0.3s var(--ease);
  display: block;
}
.thumb-item:hover img { transform: scale(1.08); }
```

### LinkedIn card — imagen clickeable
```css
/* LinkedIn: la card ES la imagen, sin padding ni construcción CSS */
.card-linkedin {
  padding: 0;
  overflow: hidden;
  display: block;      /* es un <a> */
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
  transition: box-shadow var(--duration) var(--ease),
              transform var(--duration) var(--ease);
}
.card-linkedin:hover {
  box-shadow: var(--shadow-hover);
  transform: translateY(-2px);
}
.card-linkedin img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  border-radius: var(--radius-card);  /* 20px, coincide con Figma ~24px */
}
```

> 📁 **Archivo a colocar:** `assets/linkedin/linkedin-card.jpg`
> ⬇️ **Cómo obtenerlo:** descarga la imagen del Figma (node 298:1202) o usa
>    tu propia imagen de LinkedIn. La URL temporal de Figma es:
>    `https://www.figma.com/api/mcp/asset/e9a75d62-4bdf-4c8b-bb98-65cf04f9dbef`
>    (expira en 7 días — descárgala ahora y guárdala como `linkedin-card.jpg`)

### Proyectos — Nobel + Fruto Dorado (lado a lado, imágenes tall)
```css
.card-projects {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--gap);
}
.project-img-card {
  border-radius: var(--radius-card);
  overflow: hidden;
  display: block;    /* es un <a> */
  box-shadow: var(--shadow-card);
  transition: box-shadow var(--duration) var(--ease),
              transform var(--duration) var(--ease);
}
.project-img-card:hover {
  box-shadow: var(--shadow-hover);
  transform: translateY(-2px);
}
.project-img-card img {
  width: 100%;
  aspect-ratio: 2/4;  /* tall portrait, ~0.5 ratio como en el Figma */
  object-fit: cover;
  display: block;
}
```

### Columna derecha baja — LinkedIn + Video + Dynamite stacked
```css
.card-right-col {
  display: flex;
  flex-direction: column;
  gap: var(--gap);
}
```

### Video card
```css
.card-video {
  padding: 0;
  position: relative;
  overflow: hidden;
  border-radius: var(--radius-card);
}
.card-video video {
  width: 100%;
  aspect-ratio: 16/9;
  object-fit: cover;
  display: block;
}
/* Overlay de controles inferior */
.card-video__controls {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 56px;
  background: rgba(0,0,0,0.55);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  padding: 0 12px;
  gap: 8px;
}
.card-video__btn {
  width: 32px; height: 32px;
  background: transparent; border: none; cursor: pointer;
  color: white; display: flex; align-items: center; justify-content: center;
  border-radius: 6px;
  transition: background var(--duration);
}
.card-video__btn:hover { background: rgba(255,255,255,0.15); }
.card-video__btn svg { width: 16px; height: 16px; fill: white; }
/* Spacer entre controles izquierdos y derecho */
.card-video__controls-spacer { flex: 1; }
/* Badge RGX top-right */
.card-video__badge {
  position: absolute;
  top: 12px; right: 12px;
  background: rgba(0,0,0,0.45);
  backdrop-filter: blur(4px);
  color: white;
  font: 600 11px var(--font-body);
  padding: 4px 10px;
  border-radius: var(--radius-btn);
  letter-spacing: 0.05em;
}
```

### Dynamite Eyebrows — imagen directa (sin padding)
```css
.card-dynamite { padding: 0; }
.card-dynamite img {
  width: 100%;
  aspect-ratio: 16/9;
  object-fit: cover;
  display: block;
}
```

### Footer link @icesidmi
```css
.footer-ig-link {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  background: var(--color-card);
  border-radius: var(--radius-btn);
  padding: 16px 24px;
  box-shadow: var(--shadow-card);
  font: 500 14px var(--font-body);
  color: var(--color-text-primary);
  transition: box-shadow var(--duration) var(--ease), transform var(--duration) var(--ease);
}
.footer-ig-link:hover { box-shadow: var(--shadow-hover); transform: translateY(-1px); }
.footer-ig-link__icon { width: 32px; height: 32px; border-radius: 8px; }
```

---

## 📄 index.html — Estructura Completa

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Catalina Giraldo Aguirre — Portfolio</title>
  <meta name="description" content="Interactive Media Designer · Cali, Colombia">

  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;700&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&display=swap" rel="stylesheet">

  <!-- Estilos (orden importa) -->
  <link rel="stylesheet" href="css/tokens.css">
  <link rel="stylesheet" href="css/reset.css">
  <link rel="stylesheet" href="css/layout.css">
  <link rel="stylesheet" href="css/components.css">
</head>
<body>

<div class="page">

  <!-- ════════════════════════════════
       SIDEBAR
       ════════════════════════════════ -->
  <aside class="sidebar" aria-label="Perfil">
    <img
      class="sidebar__avatar"
      src="assets/profile/avatar.jpg"
      alt="Catalina Giraldo Aguirre"
      width="120" height="120"
    >
    <h1 class="sidebar__name">Catalina Giraldo Aguirre</h1>
    <p class="sidebar__bio">
      With four years of experience, I specialize in visual and interaction design,
      along with user experience research and testing. My focus lies in brand
      identity creation, UI, and UX.
    </p>
    <div class="sidebar__dots" aria-label="Disponible para trabajo">
      <span class="sidebar__dot sidebar__dot--on"  title="Disponible"></span>
      <span class="sidebar__dot sidebar__dot--off" title=""></span>
    </div>
    <ul class="sidebar__meta">
      <li class="sidebar__meta-item">
        <span aria-hidden="true">📍</span>
        <span>Cali, Colombia</span>
      </li>
      <li class="sidebar__meta-item">
        <span aria-hidden="true">✉️</span>
        <a href="mailto:catagiraldoaguirre@gmail.com">catagiraldoaguirre@gmail.com</a>
      </li>
    </ul>
  </aside>

  <!-- ════════════════════════════════
       CONTENIDO PRINCIPAL
       ════════════════════════════════ -->
  <main class="content" aria-label="Portfolio">

    <!-- Bento Grid: 2 columnas -->
    <div class="bento-grid">

      <!-- COL 1, ROW 1: Hero foto -->
      <div class="card card-hero">
        <img
          src="assets/hero/portrait.jpg"
          alt="Catalina — retrato artístico con luz verde y roja"
          loading="eager"
        >
      </div>

      <!-- COL 2, ROW 1: Quote -->
      <div class="card card-quote" role="complementary">
        <span class="card-quote__icon" aria-hidden="true">❝</span>
        <p class="card-quote__text">
          Together, we can achieve boundless creative possibilities. 💗
        </p>
      </div>

      <!-- COL 1, ROW 2: Instagram -->
      <a
        href="https://www.instagram.com/data_arte/"
        target="_blank" rel="noopener noreferrer"
        class="card social-card card-instagram"
        aria-label="Ver Instagram @data_arte"
      >
        <div class="social-card__header">
          <div class="social-card__brand">
            <div class="social-card__logo social-card__logo--instagram" aria-hidden="true">
              <!-- Instagram SVG icon -->
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </div>
            <span class="social-card__subtitle">My instagram: @data_arte</span>
          </div>
          <button class="btn-follow btn-follow--instagram" onclick="event.preventDefault(); window.open('https://www.instagram.com/data_arte/','_blank')">
            Follow <strong>355</strong>
          </button>
        </div>
        <!-- Grid 3×2 Instagram: imágenes locales -->
        <div class="thumbs-grid" role="list">
          <a class="thumb-item" href="https://www.instagram.com/data_arte/" target="_blank" rel="noopener" role="listitem">
            <img src="assets/instagram/ig-1.jpg" alt="Post Instagram 1" loading="lazy">
          </a>
          <a class="thumb-item" href="https://www.instagram.com/data_arte/" target="_blank" rel="noopener" role="listitem">
            <img src="assets/instagram/ig-2.jpg" alt="Post Instagram 2" loading="lazy">
          </a>
          <a class="thumb-item" href="https://www.instagram.com/data_arte/" target="_blank" rel="noopener" role="listitem">
            <img src="assets/instagram/ig-3.jpg" alt="Post Instagram 3" loading="lazy">
          </a>
          <a class="thumb-item" href="https://www.instagram.com/data_arte/" target="_blank" rel="noopener" role="listitem">
            <img src="assets/instagram/ig-4.jpg" alt="Post Instagram 4" loading="lazy">
          </a>
          <a class="thumb-item" href="https://www.instagram.com/data_arte/" target="_blank" rel="noopener" role="listitem">
            <img src="assets/instagram/ig-5.jpg" alt="Post Instagram 5" loading="lazy">
          </a>
          <a class="thumb-item" href="https://www.instagram.com/data_arte/" target="_blank" rel="noopener" role="listitem">
            <img src="assets/instagram/ig-6.jpg" alt="Post Instagram 6" loading="lazy">
          </a>
        </div>
      </a>

      <!-- COL 2, ROW 2: Behance -->
      <a
        href="https://www.behance.net/catagiraldoaguirre"
        target="_blank" rel="noopener noreferrer"
        class="card social-card card-behance"
        aria-label="Ver portfolio en Behance"
      >
        <div class="social-card__header">
          <div class="social-card__brand">
            <div class="social-card__logo social-card__logo--behance" aria-hidden="true">
              <!-- Behance SVG icon -->
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 7h-7V5h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14H15.97c.13 3.211 3.483 3.312 4.588 2.029H23.726zm-7.726-3h3.457C19.183 12 18.635 11 17.169 11c-1.404 0-1.928.93-2.169 3zm-5.066-3h-3.51c.019-.555.085-.985.198-1.29.258-.671.808-1.032 1.651-1.082C10.235 8.582 11 9.066 11 10zm-3.51 2H11c-.028.583-.148 1.043-.36 1.383-.32.509-.912.764-1.776.764-.864 0-1.443-.306-1.737-.919-.15-.31-.237-.762-.264-1.228zm3.51 2h-3.51a9.97 9.97 0 0 0 .114 1.059c.18.77.683 1.272 1.505 1.504 1.101.306 2.404-.101 2.874-.95.146-.264.027-.613.017-1.613zm0-7h-3.51c.02-.543.073-.965.158-1.264.138-.489.44-.791.906-.907 1.141-.287 2.446.34 2.446 2.171z"/>
              </svg>
            </div>
            <span class="social-card__subtitle">My portfolio on Behance</span>
          </div>
          <button class="btn-follow btn-follow--behance" onclick="event.preventDefault(); window.open('https://www.behance.net/catagiraldoaguirre','_blank')">
            Follow <strong>198</strong>
          </button>
        </div>
        <!-- Grid 3×2 Behance: URLs CDN públicas -->
        <div class="thumbs-grid" role="list">
          <a class="thumb-item" href="https://www.behance.net/gallery/210152435/Ascend-ESPN-UI-Design-System" target="_blank" rel="noopener" role="listitem">
            <img src="https://mir-s3-cdn-cf.behance.net/projects/404/a97d89210152435.Y3JvcCwxMDc2LDg0MSwwLDA.png" alt="Ascend ESPN UI Design System" loading="lazy">
          </a>
          <a class="thumb-item" href="https://www.behance.net/gallery/185585443/enerBit-UI-UX-Web-development" target="_blank" rel="noopener" role="listitem">
            <img src="https://mir-s3-cdn-cf.behance.net/projects/404/f00ac3185585443.Y3JvcCwxNDAwLDEwOTUsMCww.jpg" alt="enerBit UI UX Web development" loading="lazy">
          </a>
          <a class="thumb-item" href="https://www.behance.net/gallery/158364057/Telle-Live-Skill-Learning-UXUI-Design" target="_blank" rel="noopener" role="listitem">
            <img src="https://mir-s3-cdn-cf.behance.net/projects/404/705a4a158364057.Y3JvcCwyODAwLDIxOTAsMCww.png" alt="Telle Live Skill Learning" loading="lazy">
          </a>
          <a class="thumb-item" href="https://www.behance.net/gallery/155841649/Gist-Group-workspace-app" target="_blank" rel="noopener" role="listitem">
            <img src="https://mir-s3-cdn-cf.behance.net/projects/404/404a7b155841649.Y3JvcCwyMzU3LDE4NDQsMjA0LDA.jpg" alt="Gist Group workspace app" loading="lazy">
          </a>
          <a class="thumb-item" href="https://www.behance.net/gallery/150729223/LEGO-OOH-EXPERIENCE" target="_blank" rel="noopener" role="listitem">
            <img src="https://mir-s3-cdn-cf.behance.net/projects/404/f79b87150729223.Y3JvcCwyODAwLDIxOTAsMCww.jpg" alt="LEGO OOH Experience" loading="lazy">
          </a>
          <a class="thumb-item" href="https://www.behance.net/gallery/173478949/DataHub-UI-UX-" target="_blank" rel="noopener" role="listitem">
            <img src="https://mir-s3-cdn-cf.behance.net/projects/404/c199b9173478949.Y3JvcCwxMTE0LDg3MSwwLDA.png" alt="DataHub UI UX" loading="lazy">
          </a>
        </div>
      </a>

      <!-- COL 1, ROW 3: Proyectos tall (Nobel + Fruto Dorado) -->
      <div class="card-projects">
        <a class="project-img-card" href="https://www.behance.net/gallery/..." target="_blank" rel="noopener" aria-label="Premios Nobel de Economía en Realidad Aumentada">
          <img src="assets/projects/nobel.jpg" alt="Premios Nobel de Economía en Realidad Aumentada" loading="lazy">
        </a>
        <a class="project-img-card" href="https://www.behance.net/gallery/..." target="_blank" rel="noopener" aria-label="Fruto Dorado - Aceite bronceador">
          <img src="assets/projects/fruto-dorado.jpg" alt="Fruto Dorado - Aceite bronceador a base de chontaduro" loading="lazy">
        </a>
      </div>

      <!-- COL 2, ROW 3: LinkedIn + Video + Dynamite stacked -->
      <div class="card-right-col">

        <!-- LinkedIn — imagen clickeable -->
        <a
          href="https://www.linkedin.com/in/catalina-giraldo-aguirre/"
          target="_blank" rel="noopener noreferrer"
          class="card-linkedin"
          aria-label="Ver perfil de LinkedIn de Catalina Giraldo Aguirre"
        >
          <img
            src="assets/linkedin/linkedin-card.jpg"
            alt="LinkedIn — Catalina Giraldo Aguirre"
            loading="lazy"
          >
        </a>

        <!-- Video -->
        <div class="card card-video">
          <video
            src="assets/video/showreel.mp4"
            autoplay
            loop
            muted
            playsinline
            preload="metadata"
            aria-label="Showreel de Catalina Giraldo Aguirre"
          ></video>
          <div class="card-video__badge" aria-hidden="true">RGX</div>
          <div class="card-video__controls" aria-label="Controles de video">
            <button class="card-video__btn" aria-label="Play/Pause" data-video-toggle>
              <!-- SVG play icon -->
              <svg viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="M6.271 5.055a.5.5 0 0 1 .52.038l3.5 2.5a.5.5 0 0 1 0 .814l-3.5 2.5A.5.5 0 0 1 6 10.5v-5a.5.5 0 0 1 .271-.445z"/></svg>
            </button>
            <button class="card-video__btn" aria-label="Siguiente" data-video-next>
              <svg viewBox="0 0 16 16"><path d="M15.5 3.5a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V8.75l-7.45 5.17A.5.5 0 0 1 6.5 13.5v-3.17l-7.45 5.17A.5.5 0 0 1-1.5 15V1A.5.5 0 0 1-.95.33L6.5 5.5V2.5a.5.5 0 0 1 .55-.5L15 6.83V4a.5.5 0 0 1 .5-.5z"/></svg>
            </button>
            <div class="card-video__controls-spacer"></div>
            <button class="card-video__btn" aria-label="Pantalla completa" data-video-fullscreen>
              <svg viewBox="0 0 16 16"><path d="M1.5 1h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0v-4A1.5 1.5 0 0 1 1.5 1zm9 0h4A1.5 1.5 0 0 1 16 2.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1 0-1zM.5 10a.5.5 0 0 1 .5.5v4c0 .276.224.5.5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 0 14.5v-4a.5.5 0 0 1 .5-.5zm15 0a.5.5 0 0 1 .5.5v4a1.5 1.5 0 0 1-1.5 1.5h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5z"/></svg>
            </button>
          </div>
        </div>

        <!-- Dynamite Eyebrows -->
        <a
          href="https://www.behance.net/gallery/..."
          target="_blank" rel="noopener noreferrer"
          class="card card-dynamite"
          aria-label="Dynamite Eyebrows - Cejas de otro mundo"
        >
          <img src="assets/projects/dynamite-eyebrows.jpg" alt="Dynamite Eyebrows - Cejas de otro mundo" loading="lazy">
        </a>

      </div><!-- /card-right-col -->
    </div><!-- /bento-grid -->

    <!-- Footer: @icesidmi link -->
    <footer class="footer-link" role="contentinfo">
      <a
        href="https://www.instagram.com/icesidmi"
        target="_blank" rel="noopener noreferrer"
        class="footer-ig-link"
        aria-label="Ver Design work en Instagram @icesidmi"
      >
        <!-- Mini instagram icon -->
        <svg class="footer-ig-link__icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
          style="background: radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%); padding: 6px; border-radius: 8px;">
          <path fill="white" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
        Design work on <strong>@icesidmi</strong>'s Instagram
      </a>
    </footer>

  </main>
</div><!-- /page -->

<script src="js/main.js"></script>
</body>
</html>
```

---

## ⚙️ js/main.js — JavaScript Mínimo

```js
/* ============================================================
   main.js — Comportamiento mínimo, sin dependencias
   ============================================================ */

/* ── 1. Lazy-load robusto con IntersectionObserver ── */
(function initLazyLoad() {
  if (!('IntersectionObserver' in window)) return; // fallback: browser carga todo

  const imgs = document.querySelectorAll('img[loading="lazy"]');
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const img = entry.target;
        img.src = img.dataset.src || img.src; // soporte data-src alternativo
        img.removeAttribute('data-src');
        obs.unobserve(img);
      });
    },
    { rootMargin: '200px' } // cargar 200px antes de entrar al viewport
  );

  imgs.forEach(img => observer.observe(img));
})();

/* ── 2. Video autoplay fallback (por si el browser lo bloquea) ── */
(function initVideoAutoplay() {
  document.querySelectorAll('video[autoplay]').forEach(video => {
    const promise = video.play();
    if (promise !== undefined) {
      promise.catch(() => {
        // Autoplay bloqueado: mostrar botón de play visible
        video.controls = true;
      });
    }
  });
})();

/* ── 3. Video: botón play/pause toggle ── */
(function initVideoControls() {
  document.querySelectorAll('[data-video-toggle]').forEach(btn => {
    const card = btn.closest('.card-video');
    const video = card?.querySelector('video');
    if (!video) return;

    btn.addEventListener('click', () => {
      video.paused ? video.play() : video.pause();
    });
  });

  /* Fullscreen */
  document.querySelectorAll('[data-video-fullscreen]').forEach(btn => {
    const card = btn.closest('.card-video');
    const video = card?.querySelector('video');
    if (!video) return;

    btn.addEventListener('click', () => {
      if (video.requestFullscreen) video.requestFullscreen();
      else if (video.webkitRequestFullscreen) video.webkitRequestFullscreen();
    });
  });
})();
```

---

## ✅ PROMPT DEFINITIVO PARA CLAUDE CODE

```
Eres un desarrollador frontend senior. Tienes en frente el plan de spec completo 
de este proyecto (bento-spec-v3-final.md). Tu tarea es EJECUTARLO íntegramente, 
archivo por archivo, sin omitir ninguna sección.

PLAN A EJECUTAR — sigue este orden estricto:

  PASO 1 — Crea la estructura de carpetas:
    bento-portfolio/index.html
    bento-portfolio/css/tokens.css
    bento-portfolio/css/reset.css
    bento-portfolio/css/layout.css
    bento-portfolio/css/components.css
    bento-portfolio/js/main.js
    (las carpetas assets/ se crean vacías con un README.md adentro explicando qué va en cada una)

  PASO 2 — Escribe css/tokens.css con TODAS las variables CSS del spec.
  
  PASO 3 — Escribe css/reset.css (normalize + box-sizing global + base styles).
  
  PASO 4 — Escribe css/layout.css con el sistema de grid:
    - .page = flex, sidebar sticky 320px + .content flex:1
    - .bento-grid = CSS Grid 2 columnas (1fr 1fr), gap 16px
    - grid-column y grid-row explícitos para cada card
    - Los 4 breakpoints del spec (1200, 1199, 900, 480)

  PASO 5 — Escribe css/components.css con TODOS los componentes del spec:
    .card base, sidebar, hero, quote, social-card, btn-follow, thumbs-grid,
    card-linkedin, card-projects, card-right-col, card-video, card-dynamite, footer-ig-link

  PASO 6 — Escribe js/main.js con las 3 funciones IIFE del spec:
    initLazyLoad(), initVideoAutoplay(), initVideoControls()

  PASO 7 — Escribe index.html completo con TODA la estructura HTML del spec,
    incluyendo los SVG inline de Instagram, Behance y el footer de icesidmi.

  PASO 8 — Verifica que:
    [ ] Los 4 archivos CSS se importan en orden correcto en index.html
    [ ] Todas las imágenes tienen loading="lazy" (excepto avatar y hero)
    [ ] El video tiene autoplay loop muted playsinline
    [ ] Todos los <a> externos tienen target="_blank" rel="noopener noreferrer"
    [ ] Todos los <a> de cards tienen aria-label
    [ ] Los botones Follow usan event.preventDefault() + window.open
    [ ] Cero uso de !important en ningún CSS

  PASO 9 — Abre index.html en el browser y confirma que:
    [ ] La sidebar aparece sticky a la izquierda en desktop
    [ ] El grid muestra 2 columnas con el orden correcto de cards
    [ ] Los thumbnails de Behance cargan desde las URLs CDN (sin descargar)
    [ ] El video hace autoplay en loop sin controles nativos del browser
    [ ] El layout se adapta correctamente en tablet y mobile

Al terminar cada paso, escribe un comentario "✅ PASO N completado" antes de 
continuar con el siguiente. Si algo del spec es ambiguo, elige la opción que 
sea más fiel al screenshot del Figma (node 298-192 del archivo AcyEQCTNIrpAf95dVLqokH).

---

A continuación, los detalles técnicos del spec para ejecutar:

Implementa el portfolio Bento de Catalina Giraldo Aguirre en HTML/CSS/JS 
vanilla (sin frameworks). Usa exactamente esta estructura de archivos y código:

ARCHIVOS:
- index.html
- css/tokens.css   ← SOLO variables CSS
- css/reset.css    ← normalize + box-sizing
- css/layout.css   ← sidebar + grid + breakpoints
- css/components.css ← cards y componentes
- js/main.js       ← lazy-load + video controls

LAYOUT (fiel al Figma):
- Sidebar izquierdo sticky (320px fixed) con avatar, nombre Syne 700, bio DM Sans, 
  2 dots disponibilidad (verde + gris), 📍 email
- Área de contenido: CSS Grid de 2 columnas iguales (1fr 1fr), gap 16px

ORDEN DE CARDS EN EL GRID (grid-column y grid-row explícitos):
  Col 1 Row 1: Hero foto (cuadrada, aspect-ratio 1, sin padding en card, object-fit cover)
  Col 2 Row 1: Quote card (❝ icon 40px, texto italic Syne)
  Col 1 Row 2: Instagram card (header con logo gradient + Follow 355 + subtítulo + grid 3×2 imgs locales assets/instagram/ig-1..6.jpg)
  Col 2 Row 2: Behance card (header logo azul + Follow 198 + subtítulo + grid 3×2 con estas URLs CDN exactas):
    1. https://mir-s3-cdn-cf.behance.net/projects/404/a97d89210152435.Y3JvcCwxMDc2LDg0MSwwLDA.png → https://www.behance.net/gallery/210152435/
    2. https://mir-s3-cdn-cf.behance.net/projects/404/f00ac3185585443.Y3JvcCwxNDAwLDEwOTUsMCww.jpg → https://www.behance.net/gallery/185585443/
    3. https://mir-s3-cdn-cf.behance.net/projects/404/705a4a158364057.Y3JvcCwyODAwLDIxOTAsMCww.png → https://www.behance.net/gallery/158364057/
    4. https://mir-s3-cdn-cf.behance.net/projects/404/404a7b155841649.Y3JvcCwyMzU3LDE4NDQsMjA0LDA.jpg → https://www.behance.net/gallery/155841649/
    5. https://mir-s3-cdn-cf.behance.net/projects/404/f79b87150729223.Y3JvcCwyODAwLDIxOTAsMCww.jpg → https://www.behance.net/gallery/150729223/
    6. https://mir-s3-cdn-cf.behance.net/projects/404/c199b9173478949.Y3JvcCwxMTE0LDg3MSwwLDA.png → https://www.behance.net/gallery/173478949/
  Col 1 Row 3: Dos imágenes tall side-by-side (display grid 1fr 1fr, NO card wrapper):
    assets/projects/nobel.jpg (aspect-ratio 2/4) + assets/projects/fruto-dorado.jpg (aspect-ratio 2/4)
  Col 2 Row 3: Columna flex vertical con gap 16px conteniendo:
    a) LinkedIn card — NO construir con CSS. Es una imagen clickeable:
       <a href="https://www.linkedin.com/in/catalina-giraldo-aguirre/" target="_blank" rel="noopener noreferrer" class="card-linkedin" aria-label="Ver LinkedIn">
         <img src="assets/linkedin/linkedin-card.jpg" alt="LinkedIn Catalina" loading="lazy">
       </a>
       CSS: .card-linkedin { padding:0; display:block; border-radius:var(--radius-card); overflow:hidden; box-shadow:var(--shadow-card); }
       .card-linkedin:hover { transform:translateY(-2px); box-shadow:var(--shadow-hover); }
       .card-linkedin img { width:100%; display:block; object-fit:cover; }
    b) Video card (video src=assets/video/showreel.mp4 autoplay loop muted playsinline,
       badge "RGX" top-right blur, overlay controles bottom con play/next/fullscreen)
    c) Dynamite Eyebrows image card (assets/projects/dynamite-eyebrows.jpg, aspect-ratio 16/9)

FOOTER: centrado, link pill a instagram.com/icesidmi con icono IG gradient

DESIGN TOKENS (en :root de tokens.css):
  --color-bg: #FFFFFF | --gap: 16px | --page-padding: 64px | --card-padding: 24px
  --radius-card: 20px | --radius-thumb: 10px | --radius-btn: 100px
  --shadow-card: 0 1px 4px rgba(0,0,0,0.07) | --shadow-hover: 0 6px 24px rgba(0,0,0,0.12)
  --font-display: 'Syne' | --font-body: 'DM Sans' | --duration: 0.22s

RESPONSIVE:
  ≥1200px: sidebar 320px left + grid 2col
  ≤1199px: sidebar row top + grid 2col
  ≤900px: todo 1 columna
  ≤480px: padding 16px

BUENAS PRÁCTICAS:
  - Todos los estilos en tokens.css PRIMERO, luego importados en orden
  - Cero !important
  - aria-label en todas las cards que son <a>
  - loading="lazy" en todas las imgs excepto el avatar y hero
  - Video: muted+autoplay+playsinline obligatorios, JS fallback si browser bloquea autoplay
  - Social card Behance e Instagram: la card COMPLETA es un <a> pero los botones Follow 
    usan event.preventDefault() + window.open para no interferir con el click de la card
  - Hover en cards: transform translateY(-2px) + shadow más pronunciada, CSS únicamente
  - Thumbnails: overflow hidden en contenedor + img scale(1.08) en hover
```