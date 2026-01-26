fetch("partials/navbar.html")
    .then(res => res.text())
    .then(data => {
        document.getElementById("navbar").innerHTML = data;

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

    });
