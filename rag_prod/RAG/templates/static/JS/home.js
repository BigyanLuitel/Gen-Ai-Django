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

const applyTheme = (theme) => {
    const isDark = theme === 'dark';
    document.body.classList.toggle('dark', isDark);

    if (themeToggle) {
        themeToggle.textContent = isDark ? 'Light mode' : 'Dark mode';
        themeToggle.setAttribute('aria-pressed', String(isDark));
    }
};

const savedTheme = safeStorageGet(localStorage, 'resumeTheme');
const preferredDark = typeof window.matchMedia === 'function'
    ? window.matchMedia('(prefers-color-scheme: dark)').matches
    : false;
applyTheme(savedTheme || (preferredDark ? 'dark' : 'light'));

themeToggle?.addEventListener('click', () => {
    const nextTheme = document.body.classList.contains('dark') ? 'light' : 'dark';
    applyTheme(nextTheme);
    safeStorageSet(localStorage, 'resumeTheme', nextTheme);
});

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

const getBotReply = (message) => {
    const normalized = message.toLowerCase();

    if (normalized.includes('skill')) {
        return 'Key strengths include Python, Django, REST APIs, and practical ML integration.';
    }

    if (normalized.includes('project') || normalized.includes('experience')) {
        return 'Recent work includes a Django AI chatbot platform and production web application development.';
    }

    if (normalized.includes('contact') || normalized.includes('email') || normalized.includes('phone')) {
        return 'You can reach Bigyan at luitelbigyan344@gmail.com or +977 9840977554.';
    }

    if (normalized.includes('education')) {
        return 'Bigyan completed a Bachelor of Computer Engineering at Tribhuvan University.';
    }

    return 'I can help with skills, projects, education, or contact details. Ask me one of those.';
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

    window.setTimeout(() => {
        appendChatMessage(getBotReply(message), 'bot');
    }, 220);
});
