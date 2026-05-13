// ===============================
// CHATBOT CORE
// ===============================

const chatbotLauncher  = document.getElementById('chatbotLauncher');
const chatbotPanel     = document.getElementById('chatbotPanel');
const chatbotClose     = document.getElementById('chatbotClose');
const chatbotForm      = document.getElementById('chatbotForm');
const chatbotInput     = document.getElementById('chatbotInput');
const chatbotMessages  = document.getElementById('chatbotMessages');
const chatStartBtn     = document.getElementById('chatStartBtn');
const menuToggle       = document.querySelector('.menu-toggle');
const navLinks         = document.getElementById('navLinks');

const chatHistory  = [];
const MAX_MESSAGES = 40;

if (chatbotPanel)    chatbotPanel.hidden = true;
if (chatbotLauncher) chatbotLauncher.setAttribute('aria-expanded', 'false');

// ─── Utilities ─────────────────────────────────────────
const getCSRFToken = () => {
    const match = document.cookie.match(/csrftoken=([^;]+)/);
    return match ? match[1] : '';
};

const scrollToBottom = () => {
    requestAnimationFrame(() => {
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    });
};

// ─── UI helpers ────────────────────────────────────────
function appendMessage(text, type) {
    const wrapper = document.createElement('div');
    wrapper.className = `chatbot-msg ${type}`;

    const p = document.createElement('p');
    p.textContent = text;
    wrapper.appendChild(p);
    chatbotMessages.appendChild(wrapper);

    if (chatbotMessages.children.length > MAX_MESSAGES) {
        chatbotMessages.removeChild(chatbotMessages.firstChild);
    }
    scrollToBottom();
}

function showTyping() {
    const el = document.createElement('div');
    el.className = 'chatbot-msg bot';
    el.innerHTML = '<div class="typing-indicator"><span></span><span></span><span></span></div>';
    chatbotMessages.appendChild(el);
    scrollToBottom();
    return el;
}

// ─── API call ──────────────────────────────────────────
async function sendMessage(message) {
    const typingEl = showTyping();
    chatbotInput.disabled = true;

    try {
        const response = await fetch('/api/chat/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCSRFToken(),
            },
            body: JSON.stringify({ message, history: chatHistory }),
        });

        const data = await response.json();
        typingEl.remove();
        appendMessage(data.reply || 'No reply', 'bot');

        chatHistory.push({ role: 'user',      content: message   });
        chatHistory.push({ role: 'assistant', content: data.reply });

    } catch {
        typingEl.remove();
        appendMessage('Server connection failed.', 'bot');
    }

    chatbotInput.disabled = false;
    chatbotInput.focus();
}

// ─── Panel open/close ──────────────────────────────────
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
    chatbotPanel?.hidden ? openChatbot() : closeChatbot();
};

// ─── Events ────────────────────────────────────────────
chatbotLauncher?.addEventListener('click', toggleChatbot);
chatbotClose?.addEventListener('click', closeChatbot);
chatStartBtn?.addEventListener('click', openChatbot);

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && chatbotPanel && !chatbotPanel.hidden) closeChatbot();
});

menuToggle?.addEventListener('click', () => {
    navLinks?.classList.toggle('open');
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!expanded));
});

navLinks?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        menuToggle?.setAttribute('aria-expanded', 'false');
    });
});

chatbotForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const msg = chatbotInput.value.trim();
    if (!msg) return;
    appendMessage(msg, 'user');
    chatbotInput.value = '';
    sendMessage(msg);
});

// ─── Chat trigger buttons ──────────────────────────────
const triggerMap = {
    'about':             'Tell me more about your background and education.',
    'astroquery':        'Tell me more about the AstroQuery satellite knowledge assistant.',
    'portfolio-ai':      'Tell me more about the AI-Assistant Portfolio Website.',
    'college-assistant': 'Tell me more about the AI College Assistant project.',
    'school-mgmt':       'Tell me more about your School Management System.',
};

document.querySelectorAll('[data-chat-trigger]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const trigger  = btn.getAttribute('data-chat-trigger');
        const question = triggerMap[trigger] || trigger;

        openChatbot();
        setTimeout(() => {
            if (chatbotInput) chatbotInput.value = question;
            chatbotForm?.dispatchEvent(new Event('submit'));
        }, 250);
    });
});

// ─── Active nav on scroll ──────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-link');

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            navAnchors.forEach((a) => {
                a.classList.toggle('active', a.getAttribute('href') === `#${entry.target.id}`);
            });
        }
    });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach((s) => observer.observe(s));
