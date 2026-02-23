# Frontend Audit Report — Dermoree Static Website

Tanggal audit: 2026-02-23  
Ruang lingkup: `index.html`, `product.html`, `ingredients.html`, `ourstory.html`, `clinical.html`, CSS modular di `assets/css`, serta JavaScript di `assets/js`.

## 1) Struktur HTML & Semantik

### Temuan
- Struktur global sudah cukup baik: setiap halaman memakai `<main id="main-content">`, ada footer, dan root HTML memakai `lang="en"`.
- Hierarki heading utama cukup konsisten karena tiap halaman memiliki satu `<h1>`.
- Ada gap semantik karena area navigasi di-inject dari partial (`<div id="navbar"></div>`), sehingga fallback tanpa JavaScript tidak punya navigasi.
- Beberapa konten di halaman klinis masih berbahasa Indonesia padahal metadata halaman menyiratkan situs berbahasa Inggris.
- Belum ditemukan skip-link (`Skip to content`) untuk aksesibilitas keyboard.
- Tombol close mobile menu belum memiliki `aria-label`.

### Dampak
- Navigasi bergantung penuh pada JS dapat menurunkan robustness akses dan crawlability pada kondisi JS gagal.
- Inkonsistensi bahasa dapat mengganggu UX dan relevansi SEO.

## 2) Arsitektur & Kerapihan CSS

### Temuan
- Struktur CSS sudah dipisah modular via `@import` (variables, reset, layout, komponen, navbar, responsive).
- Namun, penggunaan banyak `@import` CSS berantai dapat menambah request/parse overhead pada browser tertentu.
- Strategi responsive cenderung campuran desktop-first (`max-width`) dengan beberapa blok `min-width`; belum mobile-first murni.
- Ada indikasi aturan berulang untuk selector yang sama di beberapa berkas responsive (mis. `.image-text`, `.ingredient-inner`) yang menyulitkan scaling untuk 30+ halaman.

### Dampak
- Potensi konflik style antar-breakpoint meningkat saat jumlah halaman/section bertambah.

## 3) Efisiensi JavaScript

### Temuan
- `main.js` memiliki dua listener `DOMContentLoaded` terpisah; bisa digabung untuk mengurangi overhead inisialisasi.
- Counter animasi berjalan langsung saat load, tidak dipicu viewport; ini menghabiskan render cycle meskipun elemen belum terlihat.
- `IntersectionObserver` untuk fade-in tidak melakukan `unobserve` setelah elemen tampil, sehingga observer tetap memantau elemen yang sudah selesai animasi.
- `navbar.js` sudah cukup baik karena sanitasi sederhana sebelum inject partial dan ada guard null-check elemen.

### Dampak
- Efisiensi runtime bisa turun di perangkat low-end bila jumlah section/animasi bertambah.

## 4) Performa Website

### Temuan
- Total aset gambar sangat besar (sekitar 47 MB dalam repo `assets/images`).
- Banyak file PNG/JPEG >1.7MB, bahkan >2MB, yang berisiko memperlambat LCP/TTFB effective delivery pada jaringan mobile.
- Banyak gambar sudah memakai `loading="lazy"`, ini poin positif.
- CSS utama kecil, tetapi model `@import` berlapis tetap kurang optimal dibanding satu bundle hasil build.
- Script tidak memakai atribut `defer`; saat ini aman karena diletakkan menjelang penutup `</body>`, tetapi `defer` tetap rekomendasi standar agar konsisten.

### Dampak
- Performa nyata paling terdampak oleh bobot gambar, bukan JS/CSS.

## 5) SEO

### Temuan
- Seluruh halaman memiliki `<title>` dan `meta description`.
- Belum ada Open Graph (`og:title`, `og:description`, `og:image`) dan Twitter Card.
- Belum ada canonical URL.
- Internal linking utama via navbar sudah ada dan konsisten.
- Struktur URL flat sederhana (baik untuk situs statis skala kecil).

### Dampak
- Shareability sosial dan kontrol canonical SEO masih lemah.

## 6) Keamanan Dasar

### Temuan
- Tidak ditemukan penggunaan `innerHTML` langsung pada kode JS utama.
- Inject partial navbar menggunakan DOMParser dan sanitasi element berisiko (`script`, `iframe`, event handler inline) — ini langkah hardening yang baik.
- Tidak ada form kompleks, sehingga risiko validasi input rendah pada state saat ini.
- Tidak ada paparan token/API key yang terlihat di sisi klien.

### Dampak
- Baseline keamanan untuk situs statis sudah cukup baik.

## 7) Skalabilitas & Maintainability

### Temuan
- Struktur folder cukup terorganisasi (HTML root, assets, partials, docs).
- Footer di-hardcode di setiap halaman; ini berisiko drift konten saat update brand/legal.
- Ketergantungan partial hanya pada navbar; belum ada templating untuk footer/SEO head, sehingga duplikasi tetap tinggi untuk 50+ halaman.
- Belum ada standar naming dan checklist lint/format otomatis untuk menjaga konsistensi lintas halaman.

### Rekomendasi Arsitektur
1. Terapkan static site generation ringan (mis. Eleventy/Astro static mode) atau preprocessor HTML include agar navbar/footer/head reusable penuh.
2. Konsolidasikan responsive rules per komponen, bukan per halaman, lalu dokumentasikan design tokens.
3. Tambahkan pipeline optimasi aset (image compression + modern format WebP/AVIF + responsive srcset).
4. Tambahkan quality gate: HTML validator, stylelint, dan Lighthouse CI.

## Prioritas Perbaikan

### 🔴 Kritis (Wajib)
1. Optimasi aset gambar besar (kompresi + varian resolusi + format modern).
2. Lengkapi fallback navigasi/no-JS atau server-side include agar menu tetap tersedia saat JS gagal.
3. Samakan bahasa konten sesuai target situs (halaman klinis masih campuran Indonesia/Inggris).

### 🟡 Disarankan
1. Tambahkan Open Graph, Twitter Card, canonical.
2. Gabungkan listener `DOMContentLoaded` dan optimasi observer/counter lifecycle.
3. Tambahkan `aria-label` untuk tombol close menu mobile.
4. Kurangi duplikasi responsive selector lintas file.

### 🟢 Sudah Baik
1. Pemakaian semantic blocks utama (`main`, `section`, `article`, `footer`) sudah hadir.
2. Struktur heading dasar per halaman sudah rapi.
3. Sudah ada lazy loading pada banyak gambar.
4. Ada upaya hardening saat memuat partial navbar.

## Skor Kualitas (1–10)
**7.2 / 10**

- Struktur & semantik: 7.5
- CSS architecture: 7.0
- JavaScript efficiency: 7.0
- Performance: 6.0
- SEO: 6.8
- Security basic: 8.2
- Maintainability/scalability: 7.5

## Contoh Perbaikan Kode

### A. Gabungkan inisialisasi JS + stop observing setelah tampil
```js
document.addEventListener("DOMContentLoaded", () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll(".fade-section").forEach((section) => {
    observer.observe(section);
  });

  document.querySelectorAll(".percent-card strong").forEach((counter) => {
    const target = Number(counter.dataset.count || 0);
    let current = 0;
    const tick = () => {
      if (current >= target) return;
      current += 1;
      counter.textContent = `${current}%`;
      requestAnimationFrame(tick);
    };
    tick();
  });
});
```

### B. Aksesibilitas tombol close menu
```html
<button class="close-menu" aria-label="Close menu">×</button>
```

### C. SEO head minimum (tambahan)
```html
<link rel="canonical" href="https://example.com/clinical.html">
<meta property="og:title" content="Clinical Study | Dermoree">
<meta property="og:description" content="Real user testimony and scientific review.">
<meta property="og:image" content="https://example.com/assets/images/og/clinical-cover.jpg">
<meta name="twitter:card" content="summary_large_image">
```
