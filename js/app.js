
import "./cursor.js";
import "./animations.js";
import "./modal.js";
import "./interactions.js";
import "./home-ai.js";

const loader = document.getElementById("siteLoader");

function initializeApplication() {
    if (!loader) {
        return;
    }

    window.setTimeout(() => {
        loader.classList.add("loaded");
    }, 900);
}

if (document.readyState === "loading") {
    document.addEventListener(
        "DOMContentLoaded",
        initializeApplication,
        { once: true }
    );
} else {
    initializeApplication();
}
