const revealElements =
    document.querySelectorAll(".reveal");

const revealObserver =
    new IntersectionObserver(
        entries => {

            entries.forEach(entry => {

                if (!entry.isIntersecting) {
                    return;
                }

                entry.target.classList.add("visible");

                revealObserver.unobserve(
                    entry.target
                );

            });

        },
        {
            threshold: 0.12
        }
    );

revealElements.forEach(element => {
    revealObserver.observe(element);
});


const progressBar =
    document.getElementById("scrollProgress");

function updateScrollProgress() {

    const scrollTop =
        window.scrollY;

    const documentHeight =
        document.documentElement.scrollHeight -
        window.innerHeight;

    const progress =
        documentHeight > 0
            ? scrollTop / documentHeight
            : 0;

    progressBar.style.width =
        `${progress * 100}%`;
}

window.addEventListener(
    "scroll",
    updateScrollProgress,
    { passive: true }
);


const orbitSystem =
    document.querySelector(".hero-orbit-system");

function updateHeroParallax() {

    if (!orbitSystem) {
        return;
    }

    const movement =
        Math.min(window.scrollY * 0.12, 120);

    orbitSystem.style.transform =
        `translateY(${movement}px)`;
}

window.addEventListener(
    "scroll",
    updateHeroParallax,
    { passive: true }
);