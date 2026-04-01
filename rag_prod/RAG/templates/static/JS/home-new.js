// ===============================
// CHATBOT CORE
// ===============================

const chatbotLauncher = document.getElementById('chatbotLauncher');
const chatbotPanel = document.getElementById('chatbotPanel');
const chatbotClose = document.getElementById('chatbotClose');
const chatbotForm = document.getElementById('chatbotForm');
const chatbotInput = document.getElementById('chatbotInput');
const chatbotMessages = document.getElementById('chatbotMessages');
const chatStartBtn = document.getElementById('chatStartBtn');

const chatHistory = [];
const MAX_MESSAGES = 40;

if (chatbotPanel) {
    chatbotPanel.hidden = true;
}

if (chatbotLauncher) {
    chatbotLauncher.setAttribute('aria-expanded', 'false');
}

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

const openChatbot = () => {
    if (!chatbotPanel || !chatbotLauncher) return;
    chatbotPanel.hidden = false;
    chatbotLauncher.setAttribute('aria-expanded', 'true');
    chatbotInput?.focus();
};

const closeChatbot = () => {
    if (!chatbotPanel || !chatbotLauncher) return;
    chatbotPanel.hidden = true;
    chatbotLauncher.setAttribute('aria-expanded', 'false');
};

const toggleChatbot = () => {
    if (!chatbotPanel || !chatbotLauncher) return;
    if (chatbotPanel.hidden) {
        openChatbot();
    } else {
        closeChatbot();
    }
};

chatbotLauncher?.addEventListener('click', toggleChatbot);
chatbotClose?.addEventListener('click', closeChatbot);
chatStartBtn?.addEventListener('click', openChatbot);

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && chatbotPanel && !chatbotPanel.hidden) {
        closeChatbot();
    }
});

chatbotForm?.addEventListener("submit", e => {
    e.preventDefault();

    const msg = chatbotInput.value.trim();
    if (!msg) return;

    appendMessage(msg, "user");
    chatbotInput.value = "";

    sendMessage(msg);
});

document.querySelectorAll('[data-chat-trigger]').forEach((button) => {
    button.addEventListener('click', (event) => {
        event.preventDefault();
        const trigger = button.getAttribute('data-chat-trigger');

        const triggerMap = {
            'about': 'Tell me more about your background and education.',
            'ai-tutor': 'Tell me more about your AI Tutor Chatbot project.',
            'spacecon': 'Tell me more about the SpaceCon platform.',
            'school-mgmt': 'Tell me more about your School Management System.',
        };

        openChatbot();

        setTimeout(() => {
            const question = triggerMap[trigger] || trigger;
            if (chatbotInput) {
                chatbotInput.value = question;
            }
            chatbotForm?.dispatchEvent(new Event('submit'));
        }, 250);
    });
});