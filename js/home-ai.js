const aiInput = document.getElementById("aiInput");
const aiButton = document.getElementById("aiButton");
const aiResponse = document.getElementById("aiResponse");

function getAIResponse(question) {
    const text = question.toLowerCase();

    if (
        text.includes("muscle") ||
        text.includes("bulk") ||
        text.includes("gain")
    ) {
        return "For muscle growth, focus on progressive overload, enough protein, quality sleep, and consistent training.";
    }

    if (
        text.includes("fat") ||
        text.includes("lose weight") ||
        text.includes("weight loss")
    ) {
        return "For fat loss, combine strength training, regular activity, and a sustainable calorie deficit.";
    }

    if (
        text.includes("strength") ||
        text.includes("strong")
    ) {
        return "For strength, prioritize compound movements, progressive overload, good technique, and adequate recovery.";
    }

    if (
        text.includes("beginner") ||
        text.includes("start") ||
        text.includes("new")
    ) {
        return "Start with 3 full-body sessions per week, learn proper technique, and increase your training gradually.";
    }

    if (
        text.includes("recovery") ||
        text.includes("sleep")
    ) {
        return "Recovery is part of training. Aim for consistent sleep, hydration, rest days, and gradual progression.";
    }

    return "Tell me more about your goal—muscle gain, fat loss, strength, recovery, or beginner training—and I'll guide you.";
}

function askNexus() {
    if (!aiInput || !aiButton || !aiResponse) {
        return;
    }

    const question = aiInput.value.trim();

    if (!question) {
        aiResponse.innerHTML = `
    <span class="ai-label">NEXUS:</span>
    <span class="ai-text">Tell me what you want to accomplish today.</span>
`;
        return;
    }

    aiButton.disabled = true;
    aiResponse.innerHTML = `
        <strong>NEXUS:</strong>
        Analyzing your request...
    `;

    window.setTimeout(() => {
        const response = getAIResponse(question);

        aiResponse.innerHTML = `
    <span class="ai-label">NEXUS:</span>
    <span class="ai-text">${response}</span>
`;

        aiButton.disabled = false;
    }, 500);
}

if (aiInput && aiButton && aiResponse) {
    aiButton.addEventListener("click", askNexus);

    aiInput.addEventListener("keydown", event => {
        if (event.key === "Enter") {
            askNexus();
        }
    });
}