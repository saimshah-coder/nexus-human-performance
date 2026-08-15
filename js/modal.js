const modal =
    document.getElementById("joinModal");

const joinForm =
    document.getElementById("joinForm");

const goalSelect =
    document.getElementById("goal");


const planGoals = {
    CORE: "Build strength",
    EVOLVE: "Build muscle",
    APEX: "Improve athletic performance"
};


function openModal(plan = "") {

    modal.classList.add("active");

    modal.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.classList.add(
        "modal-open"
    );

    if (plan && planGoals[plan]) {
        goalSelect.value =
            planGoals[plan];
    }
}


function closeModal() {

    modal.classList.remove("active");

    modal.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.classList.remove(
        "modal-open"
    );
}


document.querySelectorAll(
    "[data-open-modal]"
).forEach(button => {

    button.addEventListener(
        "click",
        () => openModal()
    );

});


document.querySelectorAll(
    "[data-close-modal]"
).forEach(element => {

    element.addEventListener(
        "click",
        closeModal
    );

});


document.querySelectorAll(
    ".plan-button"
).forEach(button => {

    button.addEventListener(
        "click",
        () => {
            openModal(
                button.dataset.plan
            );
        }
    );

});


document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape" &&
            modal.classList.contains("active")
        ) {
            closeModal();
        }

    }
);


joinForm.addEventListener(
    "submit",
    event => {

        event.preventDefault();

        const name =
            document
                .getElementById("name")
                .value
                .trim();

        if (!name) {
            return;
        }

        joinForm.innerHTML = `
            <div style="
                padding:25px 0;
                text-align:center;
            ">
                <div style="
                    color:var(--lime);
                    font:10px var(--font-mono);
                    letter-spacing:.12em;
                ">
                    NEXUS // PROFILE INITIALIZED
                </div>

                <h3 style="
                    margin-top:15px;
                    font-size:32px;
                    letter-spacing:-.06em;
                ">
                    Welcome,
                    <span style="color:var(--lime)">
                        ${escapeHTML(name)}.
                    </span>
                </h3>

                <p style="
                    margin-top:12px;
                    color:var(--muted);
                    font-size:12px;
                    line-height:1.7;
                ">
                    Your performance journey has officially begun.
                </p>

                <button
                    type="button"
                    class="button button-primary"
                    style="width:100%;margin-top:20px"
                    id="finishModal"
                >
                    CONTINUE →
                </button>
            </div>
        `;

        document
            .getElementById("finishModal")
            .addEventListener(
                "click",
                closeModal
            );

    }
);


function escapeHTML(value) {

    const element =
        document.createElement("div");

    element.textContent =
        value;

    return element.innerHTML;
}