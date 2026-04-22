const siteHeader = document.querySelector(".site-header");
const revealItems = document.querySelectorAll(".reveal");
const metricValues = document.querySelectorAll(".hero-metrics strong");
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

const updateHeaderState = () => {
    if (!siteHeader) return;
    siteHeader.classList.toggle("is-scrolled", window.scrollY > 24);
};

const animateValue = (element) => {
    const rawValue = element.dataset.target || element.textContent.trim();
    const numericTarget = parseInt(rawValue.replace(/\D/g, ""), 10);

    if (Number.isNaN(numericTarget)) return;

    const suffix = rawValue.replace(/[0-9]/g, "");
    const duration = 1400;
    const startTime = performance.now();

    element.classList.add("is-counting");

    const tick = (currentTime) => {
        const progress = Math.min((currentTime - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.round(numericTarget * eased);

        element.textContent = `${currentValue}${suffix}`;

        if (progress < 1) {
            window.requestAnimationFrame(tick);
        } else {
            element.textContent = rawValue;
            element.classList.remove("is-counting");
        }
    };

    window.requestAnimationFrame(tick);
};

const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");

        if (entry.target.classList.contains("hero-metrics")) {
            metricValues.forEach((metric) => {
                if (metric.dataset.animated === "true") return;
                metric.dataset.animated = "true";
                animateValue(metric);
            });
        }

        observer.unobserve(entry.target);
    });
}, {
    threshold: 0.18
});

revealItems.forEach((item) => revealObserver.observe(item));

const heroMetrics = document.querySelector(".hero-metrics");
if (heroMetrics) {
    revealObserver.observe(heroMetrics);
}

updateHeaderState();
window.addEventListener("scroll", updateHeaderState, { passive: true });

if (contactForm && formStatus) {
    contactForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const name = contactForm.elements["full-name"]?.value.trim() || "there";

        contactForm.classList.add("is-submitting");
        formStatus.textContent = "Sending your inquiry...";

        window.setTimeout(() => {
            contactForm.reset();
            contactForm.classList.remove("is-submitting");
            formStatus.textContent = `Thanks, ${name}. Your inquiry has been prepared successfully.`;
        }, 900);
    });
}
