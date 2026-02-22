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
    // no-op: navbar partial unavailable
  });
