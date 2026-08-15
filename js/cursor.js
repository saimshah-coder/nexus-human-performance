const cursor = document.getElementById("customCursor");
const cursorDot = document.getElementById("cursorDot");

const cursorState = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    targetX: window.innerWidth / 2,
    targetY: window.innerHeight / 2
};

function updateCursorPosition(event) {
    cursorState.targetX = event.clientX;
    cursorState.targetY = event.clientY;

    cursorDot.style.left = `${event.clientX}px`;
    cursorDot.style.top = `${event.clientY}px`;
}

function animateCursor() {
    cursorState.x +=
        (cursorState.targetX - cursorState.x) * 0.18;

    cursorState.y +=
        (cursorState.targetY - cursorState.y) * 0.18;

    cursor.style.left = `${cursorState.x}px`;
    cursor.style.top = `${cursorState.y}px`;

    requestAnimationFrame(animateCursor);
}

function enableCursorHover() {

    const interactiveElements = document.querySelectorAll(
        "a, button, input, select, .experience-card, .class-row"
    );

    interactiveElements.forEach(element => {

        element.addEventListener("mouseenter", () => {
            cursor.classList.add("hover");
        });

        element.addEventListener("mouseleave", () => {
            cursor.classList.remove("hover");
        });

    });
}

window.addEventListener("mousemove", updateCursorPosition);

enableCursorHover();
animateCursor();