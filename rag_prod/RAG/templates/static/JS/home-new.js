// ===============================
// CHATBOT CORE
// ===============================

const chatbotLauncher = document.getElementById('chatbotLauncher');
const chatbotPanel = document.getElementById('chatbotPanel');
const chatbotClose = document.getElementById('chatbotClose');
const chatbotForm = document.getElementById('chatbotForm');
const chatbotInput = document.getElementById('chatbotInput');
const chatbotMessages = document.getElementById('chatbotMessages');

const chatHistory = [];
const MAX_MESSAGES = 40;

// -------------------------------
// Utilities
// -------------------------------

const getCSRFToken = () => {
    const match = document.cookie.match(/csrftoken=([^;]+)/);
    return match ? match[1] : "";
};

const scrollToBottom = () => {
    requestAnimationFrame(() => {
        chatbotMessages.scrollTop =
            chatbotMessages.scrollHeight;
    });
};

// -------------------------------
// UI helpers
// -------------------------------

function appendMessage(text, type) {

    const wrapper = document.createElement("div");
    wrapper.className = `chatbot-msg ${type}`;

    const p = document.createElement("p");
    p.textContent = text;

    wrapper.appendChild(p);
    chatbotMessages.appendChild(wrapper);

    // prevent infinite DOM growth
    if (chatbotMessages.children.length > MAX_MESSAGES) {
        chatbotMessages.removeChild(
            chatbotMessages.firstChild
        );
    }

    scrollToBottom();
}

function showTyping() {
    const el = document.createElement("div");
    el.className = "chatbot-msg bot";
    el.innerHTML =
        '<div class="typing-indicator"><span></span><span></span><span></span></div>';

    chatbotMessages.appendChild(el);
    scrollToBottom();
    return el;
}

// -------------------------------
// API Call
// -------------------------------

async function sendMessage(message) {

    const typingEl = showTyping();
    chatbotInput.disabled = true;

    try {
        const response = await fetch("/api/chat/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": getCSRFToken(),
            },
            body: JSON.stringify({
                message,
                history: chatHistory,
            }),
        });

        const data = await response.json();

        typingEl.remove();

        appendMessage(data.reply || "No reply", "bot");

        chatHistory.push({ role: "user", content: message });
        chatHistory.push({ role: "assistant", content: data.reply });

    } catch (e) {
        typingEl.remove();
        appendMessage("Server connection failed.", "bot");
    }

    chatbotInput.disabled = false;
    chatbotInput.focus();
}

// -------------------------------
// Events
// -------------------------------

chatbotLauncher.onclick = () => {
    chatbotPanel.hidden = !chatbotPanel.hidden;
};

chatbotClose.onclick = () => {
    chatbotPanel.hidden = true;
};

chatbotForm.addEventListener("submit", e => {
    e.preventDefault();

    const msg = chatbotInput.value.trim();
    if (!msg) return;

    appendMessage(msg, "user");
    chatbotInput.value = "";

    sendMessage(msg);
});