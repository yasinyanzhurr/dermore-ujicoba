document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll(".fade-section");

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
        }
      });
    },
    {
      threshold: 0.15
    }
  );

  sections.forEach(section => {
    observer.observe(section);
  });
});



document.addEventListener("DOMContentLoaded", () => {
  const counters = document.querySelectorAll(".percent-card strong");

  counters.forEach(counter => {
    const target = +counter.dataset.count;
    let current = 0;

    const update = () => {
      if (current < target) {
        current++;
        counter.textContent = current + "%";
        requestAnimationFrame(update);
      }
    };

    update();
  });
});

