const themeToggle = document.getElementById("themeToggle");
const themeIcon = themeToggle?.querySelector(".theme-icon");
const themeLabel = themeToggle?.querySelector(".theme-label");

function applyTheme(theme) {
    document.body.classList.toggle("light-theme", theme === "light");
    if (themeIcon && themeLabel) {
        themeIcon.textContent = theme === "light" ? "☀" : "☾";
        themeLabel.textContent = theme === "light" ? "Светлая" : "Темная";
    }
    localStorage.setItem("theme", theme);
}

if (themeToggle) {
    const storedTheme = localStorage.getItem("theme");
    const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
    applyTheme(storedTheme || (prefersLight ? "light" : "dark"));

    themeToggle.addEventListener("click", () => {
        const isLight = document.body.classList.contains("light-theme");
        applyTheme(isLight ? "dark" : "light");
    });
}

const revealItems = document.querySelectorAll("[data-reveal]");
const revealObserver = new IntersectionObserver(
    (entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.15 }
);

revealItems.forEach((item, index) => {
    item.style.transitionDelay = `${index * 70}ms`;
    revealObserver.observe(item);
});

document.getElementById("contactForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    alert("Спасибо! Я свяжусь с вами в ближайшее время.");
    event.target.reset();
});
