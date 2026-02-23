document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll(".fade-section");

  const counters = document.querySelectorAll(".percent-card strong");
if (sections.length > 0) {
    const sectionObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
            sectionObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15
      }

      }
    );

    sections.forEach(section => {
      sectionObserver.observe(section);
    });
  }

  if (counters.length > 0) {
    const counterObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting || entry.target.dataset.animated === "true") return;

          entry.target.dataset.animated = "true";
          const target = Number(entry.target.dataset.count || 0);
          let current = 0;

          const update = () => {
            if (current >= target) {
              entry.target.textContent = `${target}%`;
              counterObserver.unobserve(entry.target);
              return;
            }

            current += 1;
            entry.target.textContent = `${current}%`;
            requestAnimationFrame(update);
          };

          update();
        });
      },
      {
        threshold: 0.35
      }
    );

    counters.forEach(counter => {
      counterObserver.observe(counter);
    });
  }
});

