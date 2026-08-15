const toast =
    document.getElementById("toast");


let toastTimer = null;


function showToast(message) {

    toast.textContent =
        message;

    toast.classList.add(
        "visible"
    );

    window.clearTimeout(
        toastTimer
    );

    toastTimer =
        window.setTimeout(
            () => {
                toast.classList.remove(
                    "visible"
                );
            },
            2500
        );
}

document.querySelectorAll(
    ".reserve-button"
).forEach(button => {

    button.addEventListener(
        "click",
        () => {

            const className =
                button.dataset.class;

            showToast(
                `${className.toUpperCase()} RESERVED ✓`
            );

        }
    );

});


/* ENERGY SIMULATION */

const energyValue =
    document.getElementById("energyValue");

const energyProgress =
    document.querySelector(".energy-progress");


let energy = 82;


function updateEnergy() {

    const variation =
        Math.floor(
            Math.random() * 3
        ) - 1;

    energy = Math.max(
        75,
        Math.min(
            90,
            energy + variation
        )
    );

    energyValue.textContent =
        energy;

    energyProgress.style.background =
        `conic-gradient(
            var(--lime) 0 ${energy}% ,
            #20251e ${energy}% 100%
        )`;
}


window.setInterval(
    updateEnergy,
    4000
);


/* MOBILE NAV */

const mobileMenu =
    document.getElementById("mobileMenu");

const mobileMenuButton =
    document.getElementById(
        "mobileMenuButton"
    );


function toggleMobileMenu() {

    mobileMenu.classList.toggle(
        "active"
    );

}


mobileMenuButton.addEventListener(
    "click",
    toggleMobileMenu
);


document.querySelectorAll(
    ".mobile-menu a"
).forEach(link => {

    link.addEventListener(
        "click",
        () => {
            mobileMenu.classList.remove(
                "active"
            );
        }
    );

});


/* MAGNETIC BUTTONS */

const magneticElements =
    document.querySelectorAll(
        ".magnetic"
    );


magneticElements.forEach(element => {

    element.addEventListener(
        "mousemove",
        event => {

            const rect =
                element.getBoundingClientRect();

            const x =
                event.clientX -
                rect.left -
                rect.width / 2;

            const y =
                event.clientY -
                rect.top -
                rect.height / 2;

            element.style.transform =
                `translate(
                    ${x * 0.12}px,
                    ${y * 0.12}px
                )`;

        }
    );


    element.addEventListener(
        "mouseleave",
        () => {

            element.style.transform =
                "";

        }
    );

});


/* SMOOTH ANCHOR */

document.querySelectorAll(
    'a[href^="#"]'
).forEach(link => {

    link.addEventListener(
        "click",
        event => {

            const targetId =
                link.getAttribute("href");

            if (
                !targetId ||
                targetId === "#"
            ) {
                return;
            }

            const target =
                document.querySelector(
                    targetId
                );

            if (!target) {
                return;
            }

            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }
    );

});