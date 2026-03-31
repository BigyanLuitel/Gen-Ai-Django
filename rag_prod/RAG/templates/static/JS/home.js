// ===== DOM Elements =====
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('main section[id]');
const menuToggle = document.querySelector('.menu-toggle');
const navContainer = document.getElementById('navLinks');
const chatbotLauncher = document.getElementById('chatbotLauncher');
const chatbotPanel = document.getElementById('chatbotPanel');
const chatbotClose = document.getElementById('chatbotClose');
const chatbotForm = document.getElementById('chatbotForm');
const chatbotInput = document.getElementById('chatbotInput');
const chatbotMessages = document.getElementById('chatbotMessages');
const chatStartBtn = document.getElementById('chatStartBtn');

// ===== Utilities =====
const getCSRFToken = () => {
    const match = document.cookie.match(/(?:^|;\s*)csrftoken=([^\s;]+)/);
    return match ? decodeURIComponent(match[1]) : '';
};

const setActiveLink = (id) => {
    navLinks.forEach((link) => {
        const isActive = link.getAttribute('href') === `#${id}`;
        link.classList.toggle('active', isActive);
    });
};

// ===== Navigation =====
if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveLink(entry.target.id);
                }
            });
        },
        { threshold: 0.45 }
    );

    sections.forEach((section) => observer.observe(section));
}

navLinks.forEach((link) => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
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

// Force dark mode
document.body.classList.add('dark');

// ===== Chatbot Core =====
const chatHistory = [];

const showTypingIndicator = () => {
    if (!chatbotMessages) return null;
    const el = document.createElement('div');
    el.className = 'chatbot-msg bot typing-indicator';
    el.setAttribute('aria-label', 'Assistant is typing');
    el.innerHTML = '<span></span><span></span><span></span>';
    chatbotMessages.appendChild(el);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    return el;
};

const appendChatMessage = (text, type) => {
    if (!chatbotMessages) return;

    const messageWrapper = document.createElement('div');
    messageWrapper.className = `chatbot-msg ${type}`;

    const message = document.createElement('p');
    message.textContent = text;
    messageWrapper.appendChild(message);

    chatbotMessages.appendChild(messageWrapper);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
};

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
            appendChatMessage(data.error || 'Something went wrong. Please try again.', 'bot');
            return;
        }

        chatHistory.push({ role: 'user', content: message });
        chatHistory.push({ role: 'assistant', content: data.reply });

        if (chatHistory.length > 20) {
            chatHistory.splice(0, chatHistory.length - 20);
        }

        appendChatMessage(data.reply, 'bot');
    } catch (err) {
        console.error('Network error:', err);
        appendChatMessage('Could not reach the server. Please try again.', 'bot');
    } finally {
        if (typingEl) typingEl.remove();
        chatbotInput.disabled = false;
        chatbotInput.focus();
    }
};

// ===== Chatbot UI =====
const openChatbot = () => {
    if (!chatbotPanel || !chatbotLauncher) return;
    chatbotPanel.hidden = false;
    chatbotPanel.classList.add('is-open');
    chatbotLauncher.setAttribute('aria-expanded', 'true');
    chatbotInput?.focus();
};

const closeChatbot = () => {
    if (!chatbotPanel || !chatbotLauncher) return;
    chatbotPanel.hidden = true;
    chatbotPanel.classList.remove('is-open');
    chatbotLauncher.setAttribute('aria-expanded', 'false');
};

chatbotLauncher?.addEventListener('click', openChatbot);
chatbotClose?.addEventListener('click', closeChatbot);
chatStartBtn?.addEventListener('click', openChatbot);

// Close chatbot on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && chatbotPanel && !chatbotPanel.hidden) {
        closeChatbot();
    }
});

// ===== Chatbot Form Submission =====
chatbotForm?.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!chatbotInput) return;

    const message = chatbotInput.value.trim();
    if (!message) return;

    appendChatMessage(message, 'user');
    chatbotInput.value = '';

    sendMessageToBackend(message);
});

// ===== Chatbot Trigger Buttons =====
document.querySelectorAll('[data-chat-trigger]').forEach((button) => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        const trigger = button.getAttribute('data-chat-trigger');
        
        // Map trigger to initial question
        const triggerMap = {
            'about': 'Tell me more about your background and education.',
            'ai-tutor': 'Tell me more about your AI Tutor Chatbot project.',
            'spacecon': 'Tell me more about the SpaceCon platform.',
            'school-mgmt': 'Tell me more about your School Management System.',
        };

        openChatbot();
        
        // Auto-send question after a brief delay
        setTimeout(() => {
            const question = triggerMap[trigger] || trigger;
            chatbotInput.value = question;
            chatbotInput.focus();
            chatbotForm.dispatchEvent(new Event('submit'));
        }, 300);
    });
});

// ===== Scroll Animations =====
if ('IntersectionObserver' in window) {
    const animationObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.animation = 'none';
                }
            });
        },
        { threshold: 0.1 }
    );

    document.querySelectorAll('.section').forEach((section) => {
        section.style.opacity = '0';
        animationObserver.observe(section);
    });
}
