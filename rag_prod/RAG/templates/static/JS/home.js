const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('main section[id]');
const menuToggle = document.querySelector('.menu-toggle');
const navContainer = document.getElementById('navLinks');
const themeToggle = document.getElementById('themeToggle');
const downloadResume = document.getElementById('downloadResume');
const chatbotLauncher = document.getElementById('chatbotLauncher');
const chatbotPanel = document.getElementById('chatbotPanel');
const chatbotClose = document.getElementById('chatbotClose');
const chatbotForm = document.getElementById('chatbotForm');
const chatbotInput = document.getElementById('chatbotInput');
const chatbotMessages = document.getElementById('chatbotMessages');

const safeStorageGet = (storage, key) => {
    try {
        return storage.getItem(key);
    } catch {
        return null;
    }
};

const safeStorageSet = (storage, key, value) => {
    try {
        storage.setItem(key, value);
    } catch {
    }
};

const setActiveLink = (id) => {
    navLinks.forEach((link) => {
        const isActive = link.getAttribute('href') === `#${id}`;
        link.classList.toggle('active', isActive);
    });
};

if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveLink(entry.target.id);
                }
            });
        },
        {
            threshold: 0.45,
        }
    );

    sections.forEach((section) => observer.observe(section));
}

navLinks.forEach((link) => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 760) {
            navContainer.classList.remove('open');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    });
});

menuToggle?.addEventListener('click', () => {
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!expanded));
    navContainer.classList.toggle('open');
});

// Force dark mode — no toggle
document.body.classList.add('dark');

document.querySelectorAll('.detail-toggle').forEach((button) => {
    button.addEventListener('click', () => {
        const detailList = button.closest('.experience-item')?.querySelector('.detail-list');
        if (!detailList) {
            return;
        }

        const expanded = button.getAttribute('aria-expanded') === 'true';
        button.setAttribute('aria-expanded', String(!expanded));
        button.textContent = expanded ? 'Show details' : 'Hide details';
        detailList.hidden = expanded;
    });
});

document.querySelectorAll('.section-toggle').forEach((button) => {
    const sectionBodyId = button.getAttribute('aria-controls');
    const sectionBody = sectionBodyId ? document.getElementById(sectionBodyId) : null;

    button.addEventListener('click', () => {
        if (!sectionBody) {
            return;
        }

        const expanded = button.getAttribute('aria-expanded') === 'true';
        button.setAttribute('aria-expanded', String(!expanded));
        button.textContent = expanded ? 'Expand' : 'Collapse';
        sectionBody.style.display = expanded ? 'none' : 'block';
    });
});

downloadResume?.addEventListener('click', () => {
    window.print();
});

const openChatbot = () => {
    if (!chatbotPanel || !chatbotLauncher) {
        return;
    }

    chatbotPanel.hidden = false;
    chatbotPanel.classList.add('is-open');
    chatbotLauncher.setAttribute('aria-expanded', 'true');
    chatbotInput?.focus();
};

const closeChatbotPanel = () => {
    if (!chatbotPanel || !chatbotLauncher) {
        return;
    }

    chatbotPanel.classList.remove('is-open');
    chatbotPanel.hidden = true;
    chatbotLauncher.setAttribute('aria-expanded', 'false');
};

chatbotLauncher?.addEventListener('click', () => {
    openChatbot();
});

chatbotClose?.addEventListener('click', closeChatbotPanel);

const appendChatMessage = (text, type) => {
    if (!chatbotMessages) {
        return;
    }

    const message = document.createElement('p');
    message.className = `chatbot-msg ${type}`;
    message.textContent = text;
    chatbotMessages.appendChild(message);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
};

// ---------- Chatbot: RAG-powered async chat ----------

/** Read the CSRF token from the cookie set by Django */
const getCSRFToken = () => {
    const match = document.cookie.match(/(?:^|;\s*)csrftoken=([^\s;]+)/);
    return match ? decodeURIComponent(match[1]) : '';
};

/** Conversation history sent with every request so the LLM has context */
const chatHistory = [];

/** Show a pulsing "typing…" bubble and return a handle to remove it */
const showTypingIndicator = () => {
    if (!chatbotMessages) return null;
    const el = document.createElement('p');
    el.className = 'chatbot-msg bot typing-indicator';
    el.setAttribute('aria-label', 'Assistant is typing');
    el.innerHTML = '<span></span><span></span><span></span>';
    chatbotMessages.appendChild(el);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    return el;
};

/**
 * Send user message to /api/chat/, show typing state, and display result.
 * Falls back to a generic error message on failure.
 */
const sendMessageToBackend = async (message) => {
    const typingEl = showTypingIndicator();
    chatbotInput.disabled = true;

    try {
        const response = await fetch('/api/chat/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCSRFToken(),
            },
            body: JSON.stringify({
                message,
                history: chatHistory,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('Chat API error:', data);
            appendChatMessage(data.error || 'Something went wrong.', 'bot');
            return;
        }

        // Keep a rolling window of conversation history for context
        chatHistory.push({ role: 'user', content: message });
        chatHistory.push({ role: 'assistant', content: data.reply });

        // Trim history to the last 10 exchanges (20 messages)
        if (chatHistory.length > 20) {
            chatHistory.splice(0, chatHistory.length - 20);
        }

        appendChatMessage(data.reply, 'bot');
    } catch (err) {
        console.error('Network / fetch error:', err);
        appendChatMessage('Could not reach the server. Please try again.', 'bot');
    } finally {
        if (typingEl) typingEl.remove();
        chatbotInput.disabled = false;
        chatbotInput.focus();
    }
};

chatbotForm?.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!chatbotInput) {
        return;
    }

    const message = chatbotInput.value.trim();
    if (!message) {
        return;
    }

    appendChatMessage(message, 'user');
    chatbotInput.value = '';

    sendMessageToBackend(message);
});
