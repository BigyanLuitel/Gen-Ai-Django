/* ============================================
   CHATBOT FUNCTIONALITY
   ============================================ */

const chatWindow = document.getElementById('chatWindow');
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const chatSendBtn = document.getElementById('chatSendBtn');
const openChatBtn = document.getElementById('openChatBtn');
const closeChatBtn = document.getElementById('closeChatBtn');
const chatToggle = document.getElementById('chatToggle');

// Chatbot responses based on keywords
const chatbotResponses = {
    'projects': 'I have four main projects I\'m currently working on: Space Research AI (a RAG system for research), AI Portfolio Chatbot, School Management System, and Gen-AI Django Portfolio. Each one teaches me something different about building intelligent systems. Would you like to know more about any of them?',
    
    'space research': 'Space Research AI is my take on making research more accessible. Using Retrieval-Augmented Generation, it answers questions about space using verified knowledge sources. I presented it at SpaceCon 2026! It combines Python, Django, LangChain, and ChromaDB. The cool part? It feels like talking to someone who actually knows the subject.',
    
    'rag': 'RAG (Retrieval-Augmented Generation) is my favorite technique right now. Instead of just relying on what the model knows, RAG lets the system search through a knowledge base and generate answers based on real information. That\'s what powers my portfolio chatbot and the Space Research AI project. It makes AI responses more accurate and trustworthy.',
    
    'django': 'Django is my go-to framework for building robust backends. I\'ve used it in all my major projects—from the School Management System to the RAG-powered chatbot. There\'s something elegant about how Django encourages clean, maintainable code. Plus, it integrates beautifully with AI tools like LangChain.',
    
    'school management': 'That was one of my earlier projects—a complete backend system for academic management. It handles student records, library management, and workflows from Pre-primary to Class 10. Built with Django and MySQL, it taught me a lot about designing systems that need to be both powerful and intuitive.',
    
    'portfolio chatbot': 'This AI Portfolio Chatbot is actually what you\'re talking to right now! It\'s a conversational portfolio where visitors ask questions instead of scrolling through static pages. The whole idea is that conversation is a more natural way to learn about someone\'s work.',
    
    'ai developer': 'I\'m a Computer Science student deeply passionate about making AI more human-centered. Rather than just studying algorithms, I focus on building applications that people actually want to use. My goal is to bridge the gap between powerful AI systems and intuitive interfaces.',
    
    'learning': 'I\'m constantly learning about new AI architectures, exploring different datasets, and thinking about how to make technology more human-centered. Right now I\'m diving deeper into embeddings, vector search, and advanced RAG techniques.',
    
    'hello': 'Hey there! 👋 It\'s nice to meet you. Feel free to ask me anything about my work, projects, or learning journey. What interests you?',
    
    'hi': 'Hey! 👋 What would you like to know about?',
    
    'how are you': 'Doing well, thanks for asking! Just excited to talk about AI, buildings stuff, and interesting problems. What\'s on your mind?',
    
    'name': 'I\'m Bigyan Luitel. I\'m a Computer Science student and AI developer focused on building intelligent systems that feel natural to use. Nice to meet you!',
    
    'contact': 'I\'d love to hear from you! You can reach me through the contact form on this page, or feel free to ask me more questions here. What would you like to discuss?',
    
    'hire': 'I\'m always interested in learning opportunities and collaborations! The best way to reach out is through the contact form below, or you can ask me more about specific projects and what I\'ve learned from them.',
    
    'thankyou': 'You\'re welcome! Happy to help. Feel free to ask if there\'s anything else you\'d like to know.',
    
    'thanks': 'Glad I could help! Anything else you\'d like to know?',
    
    'default': 'That\'s a great question! I might not have a specific answer for that, but I\'m happy to tell you more about my projects, learning journey, or how I approach building AI systems. What area interests you most?'
};

// Function to generate chatbot response
function generateResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    
    // Check for keyword matches (longest match first for better accuracy)
    const keywords = Object.keys(chatbotResponses).sort((a, b) => b.length - a.length);
    
    for (let keyword of keywords) {
        if (lowerMessage.includes(keyword)) {
            return chatbotResponses[keyword];
        }
    }
    
    return chatbotResponses['default'];
}

// Function to add message to chat
function addMessage(text, isUser) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${isUser ? 'user-message' : 'bot-message'}`;
    
    const bubble = document.createElement('div');
    bubble.className = 'message-bubble';
    
    const p = document.createElement('p');
    p.textContent = text;
    
    bubble.appendChild(p);
    messageDiv.appendChild(bubble);
    chatMessages.appendChild(messageDiv);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Function to add typing indicator
function addTypingIndicator() {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'chat-message bot-message';
    messageDiv.id = 'typing-indicator';
    
    const bubble = document.createElement('div');
    bubble.className = 'typing-indicator';
    
    for (let i = 0; i < 3; i++) {
        const dot = document.createElement('div');
        dot.className = 'typing-dot';
        bubble.appendChild(dot);
    }
    
    messageDiv.appendChild(bubble);
    chatMessages.appendChild(messageDiv);
    
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Function to remove typing indicator
function removeTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) {
        indicator.remove();
    }
}

// Function to send message
function sendMessage() {
    const message = chatInput.value.trim();
    
    if (!message) return;
    
    // Add user message
    addMessage(message, true);
    chatInput.value = '';
    
    // Disable send button temporarily
    chatSendBtn.disabled = true;
    
    // Show typing indicator
    addTypingIndicator();
    
    // Simulate bot thinking (300-800ms delay)
    setTimeout(() => {
        removeTypingIndicator();
        const response = generateResponse(message);
        addMessage(response, false);
        chatSendBtn.disabled = false;
        chatInput.focus();
    }, 300 + Math.random() * 500);
}

// Event listeners for chat
chatSendBtn.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Open/close chat window
openChatBtn.addEventListener('click', () => {
    if (window.innerWidth <= 768) {
        chatWindow.classList.add('active');
        chatInput.focus();
    }
});

closeChatBtn.addEventListener('click', () => {
    if (window.innerWidth <= 768) {
        chatWindow.classList.remove('active');
    }
});

// Chat toggle for mobile
chatToggle.addEventListener('click', () => {
    chatWindow.classList.toggle('active');
    if (chatWindow.classList.contains('active')) {
        chatInput.focus();
    }
});

// Handle project card clicks
document.querySelectorAll('.project-ask-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const projectName = e.target.getAttribute('data-project');
        chatInput.value = `Tell me about ${projectName}`;
        
        // Scroll to chat
        if (window.innerWidth <= 768) {
            chatWindow.classList.add('active');
        } else {
            chatWindow.scrollIntoView({ behavior: 'smooth' });
        }
        
        chatInput.focus();
        
        // Auto-send after a short delay
        setTimeout(() => {
            sendMessage();
        }, 300);
    });
});

/* ============================================
   SMOOTH SCROLLING
   ============================================ */

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

/* ============================================
   SCROLL FADE-IN EFFECT
   ============================================ */

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe project cards for fade effect
document.querySelectorAll('.project-card').forEach(card => {
    observer.observe(card);
});

/* ============================================
   CONTACT FORM
   ============================================ */

const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form values
    const name = contactForm.querySelector('input[type="text"]').value;
    const email = contactForm.querySelector('input[type="email"]').value;
    const message = contactForm.querySelector('textarea').value;
    
    // Add to chat
    const userQuery = `Hi, my name is ${name}. I sent this message: "${message}" (email: ${email})`;
    addMessage(userQuery, true);
    
    // Clear form
    contactForm.reset();
    
    // Show typing indicator
    addTypingIndicator();
    
    // Simulate response
    setTimeout(() => {
        removeTypingIndicator();
        const response = `Thanks ${name}! I received your message and will get back to you at ${email} soon. I appreciate you reaching out! 📧`;
        addMessage(response, false);
        
        // Scroll to chat
        if (window.innerWidth <= 768) {
            chatWindow.classList.add('active');
        } else {
            chatWindow.scrollIntoView({ behavior: 'smooth' });
        }
    }, 800);
});

/* ============================================
   RESPONSIVE CHAT BEHAVIOR
   ============================================ */

function handleResponsive() {
    if (window.innerWidth > 768) {
        // Desktop: close mobile chat if open
        chatWindow.classList.remove('active');
        chatToggle.classList.remove('hidden');
    }
}

window.addEventListener('resize', handleResponsive);

// Initial check
handleResponsive();

/* ============================================
   PAGE TITLE EFFECT
   ============================================ */

let originalTitle = document.title;
let isPageFocused = true;

window.addEventListener('blur', () => {
    isPageFocused = false;
    document.title = '👋 Come back...';
});

window.addEventListener('focus', () => {
    isPageFocused = true;
    document.title = originalTitle;
});

/* ============================================
   INITIALIZATION
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // Focus chat input on load for desktop
    if (window.innerWidth > 768) {
        chatInput.focus();
    }
});
