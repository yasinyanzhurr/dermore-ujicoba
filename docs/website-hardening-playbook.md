# Website Hardening Playbook (Static HTML/CSS/JS)

## Target
Raise quality from ~6.8 to >=8.5 for international client readiness.

## 1) Priority Order (Technical)
1. Fix invalid HTML markup and semantic landmarks (`</head>`, `<main>`).
2. Improve performance bottlenecks (image weight, lazy loading, font strategy).
3. Replace fragile navigation partial injection (`innerHTML`) with safer parsing/build step.
4. Eliminate dead links and enforce production SEO metadata.
5. Standardize CSS architecture to reduce long-term maintenance cost.

## 2) Step-by-step Action Plan
1. Validate all HTML pages (W3C or html-validate).
2. Add `<main id="main-content">` after navbar on each page.
3. Add `loading="lazy" decoding="async"` to below-the-fold images.
4. Compress/convert large images to WebP/AVIF with responsive variants.
5. Replace CSS import waterfall with direct `<link rel="stylesheet">` or bundled `style.min.css`.
6. Use `preconnect` and `display=swap` for web fonts; reduce family/weight variants.
7. Add Open Graph + canonical metadata on each page.
8. Replace placeholder links (`#`) with real URLs or disabled semantic controls.
9. Harden navbar partial loader (DOMParser + sanitization) or move to build-time include.
10. Run Lighthouse Mobile/Desktop and iterate until targets are met.

## 3) Critical Fix Code Snippets

### A. HTML validity + semantic landmark
```html
<head>
  ...
</head>
<body>
  <div id="navbar"></div>
  <main id="main-content">
    ...
  </main>
</body>
```

### B. Lazy-load image
```html
<img src="assets/images/ingredients/centella.webp"
     alt="Centella bioactive ingredient"
     loading="lazy"
     decoding="async">
```

### C. Safer partial injection (no direct `innerHTML`)
```js
const parser = new DOMParser();
const doc = parser.parseFromString(html, "text/html");
doc.querySelectorAll("script, iframe, object, embed").forEach(n => n.remove());
mountPoint.replaceChildren(...doc.body.childNodes);
```

## 4) Suggested Folder Structure (Static, scalable)
```text
/
  pages/
    index.html
    product.html
    ingredients.html
    clinical.html
    ourstory.html
  partials/
    navbar.html
    footer.html
  assets/
    css/
      base/
      layout/
      components/
      pages/
      responsive/
    js/
      core/
      pages/
    images/
      optimized/
      originals/
  docs/
    website-hardening-playbook.md
```

## 5) Performance Implementation Strategy

### Image compression for static site
- Keep originals in `assets/images/originals`.
- Publish optimized variants in `assets/images/optimized`:
  - AVIF (primary) quality 35-50
  - WebP (fallback) quality 60-75
  - JPEG fallback for compatibility
- Serve with `<picture>` and explicit `width`/`height`.

```html
<picture>
  <source srcset="assets/images/optimized/hero.avif" type="image/avif">
  <source srcset="assets/images/optimized/hero.webp" type="image/webp">
  <img src="assets/images/optimized/hero.jpg"
       width="1280" height="720"
       alt="Dermoree serum bottle"
       fetchpriority="high">
</picture>
```

### Reduce CSS @import waterfall
- Replace nested `@import` with direct links in `<head>`, or prebuild one minified file.

```html
<link rel="stylesheet" href="assets/css/01-variables.css">
<link rel="stylesheet" href="assets/css/02-reset-base.css">
<link rel="stylesheet" href="assets/css/03-layout-global.css">
<link rel="stylesheet" href="assets/css/04-hero.css">
<link rel="stylesheet" href="assets/css/05-components.css">
<link rel="stylesheet" href="assets/css/06-navbar-footer.css">
<link rel="stylesheet" href="assets/css/07-responsive.css">
```

### Font loading strategy
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500&display=swap" rel="stylesheet">
```
- Limit families/weights to what is truly used.
- Prefer one heading family + one body family.

### Lighthouse uplift (LCP/CLS/FCP)
- LCP: optimize hero image + `fetchpriority="high"`.
- CLS: set fixed `width`/`height` or `aspect-ratio` on media containers.
- FCP: reduce CSS blocking + font preconnect/preload.
- JS: defer non-critical scripts and keep payload small.

## 6) innerHTML Risk in Static Hosting

### Risk level
- **Low to medium** on trusted static hosting.
- Becomes **high** if partial files can be modified by untrusted actors (repo compromise, CDN tampering).

### Safest no-backend alternatives
1. Build-time include (Eleventy or similar static site generator) → no runtime HTML injection.
2. Duplicate navbar in each page (simple but harder maintenance).
3. Runtime fetch + strict sanitize via DOMParser (current hardened fallback).

### Should you use Eleventy?
- If pages grow to 20+ and team collaboration increases: **yes, recommended**.
- If pages stay <10 and low change frequency: vanilla static is still fine.

## 7) Production Checklist (Go-live)
- HTML valid on all pages.
- All important links are real, no `#` placeholders.
- OG/Twitter/canonical metadata complete.
- Lighthouse mobile >= 85 on key pages.
- No console errors.
- No oversized images without optimized variants.
- Accessibility baseline: landmarks, alt text, focus states, color contrast.
- Security headers set at hosting layer (CSP, X-Content-Type-Options, Referrer-Policy).
