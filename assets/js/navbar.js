const fallbackNavbarMarkup = `
  <nav class="navbar">
    <div class="nav-container">
      <a href="index.html" class="nav-logo">Dermoree</a>
      <ul class="nav-menu">
        <li><a href="product.html">PRODUCT</a></li>
        <li><a href="ourstory.html">OUR STORY</a></li>
        <li><a href="ingredients.html">INGREDIENTS</a></li>
        <li><a href="clinical.html">TESTIMONY & SCIENTIFIC REVIEW</a></li>
      </ul>
    </div>
  </nav>
`;

fetch("partials/navbar.html")
  .then(res => res.text())
  .then(html => {
    const mountPoint = document.getElementById("navbar");
    if (!mountPoint) return;

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    // Basic hardening for static partial injection
    doc.querySelectorAll("script, iframe, object, embed").forEach(node => node.remove());
    doc.querySelectorAll("*").forEach(node => {
      [...node.attributes].forEach(attr => {
        if (/^on/i.test(attr.name)) {
          node.removeAttribute(attr.name);
        }
      });
    });

    mountPoint.replaceChildren(...doc.body.childNodes);

    const toggle = document.querySelector(".nav-toggle");
    const menu = document.querySelector(".mobile-menu");
    const close = document.querySelector(".close-menu");

    if (toggle && menu && close) {
      toggle.addEventListener("click", () => {
        menu.classList.add("active");
      });

      close.addEventListener("click", () => {
        menu.classList.remove("active");
      });
    }
  })
  .catch(() => {
    const mountPoint = document.getElementById("navbar");
    if (!mountPoint) return;
    const parser = new DOMParser();
    const doc = parser.parseFromString(fallbackNavbarMarkup, "text/html");
    mountPoint.replaceChildren(...doc.body.childNodes);
  });