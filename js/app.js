/* ============================================
   MAKAN@RP - MAIN APPLICATION LOGIC
   AI Chatbot Integration (n8n) & Tab Management
   ============================================ */

// ============================================
// CONFIGURATION
// ============================================

const CONFIG = {
    // ⬇️ THIS IS YOUR N8N CONNECTION ⬇️
    WEBHOOK_URL: 'https://n8ngc.codeblazar.org/webhook/bc0df85b-ea80-4a3e-bf1a-e255b7723ccf', 
    STORAGE_KEY: 'snackii_chat_history',
    COLORS: {
        primary: '#4CAF50',
        green: '#4CAF50',
        navy: '#2C3E50',
    }
};

// ============================================
// TAB MANAGEMENT
// ============================================

function initTabs() {
    const navLinks = document.querySelectorAll('.nav-link');
    const tabContents = document.querySelectorAll('.tab-content');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const tabName = link.getAttribute('data-tab');
            window.switchTab(tabName);
            closeMobileMenu(); 
        });
    });

    window.switchTab = function(tabName) {
        tabContents.forEach(tab => tab.classList.remove('active'));
        navLinks.forEach(link => link.classList.remove('active'));

        const activeContent = document.getElementById(tabName);
        if (activeContent) {
            activeContent.classList.add('active');
        } else {
            console.error(`Tab content with ID "${tabName}" not found.`);
        }

        const activeLink = document.querySelector(`.nav-link[data-tab="${tabName}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
}

// ============================================
// MOBILE MENU TOGGLE
// ============================================

function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            const isActive = hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            hamburger.setAttribute('aria-expanded', isActive);
        });
    }
}

function closeMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    
    if (hamburger && navMenu) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
    }
}

// ============================================
// CHAT FUNCTIONALITY (REAL N8N INTEGRATION)
// ============================================

function initChat() {
    const chatForm = document.getElementById('chatForm');
    const startChatBtn = document.getElementById('startChatBtn');

    if (chatForm) {
        chatForm.addEventListener('submit', handleChatSubmit);
    }

    if (startChatBtn) {
        startChatBtn.addEventListener('click', () => {
            window.switchTab('chat');
        });
    }

    loadChatHistory();
}

/**
 * Handle chat form submission
 */
async function handleChatSubmit(e) {
    e.preventDefault();
    const chatInput = document.getElementById('chatInput');
    const message = chatInput.value.trim();

    if (!message) return;

    // 1. Show User Message
    addMessageToChat(message, 'user');
    chatInput.value = '';

    // 2. Show Typing Indicator
    showTypingIndicator();

    // 3. Send to n8n Webhook
    try {
        console.log("Sending to n8n:", message);

        const response = await fetch(CONFIG.WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            // IMPORTANT: This key 'chatInput' must match your n8n workflow input
            body: JSON.stringify({ chatInput: message }) 
        });

        if (!response.ok) {
            throw new Error(`Server Error: ${response.status}`);
        }

        const data = await response.json();
        console.log("n8n Response:", data);

        removeTypingIndicator();

        // 4. Extract Response Text
        // We check multiple properties in case n8n structure changes
        let botResponse = '';
        
        if (typeof data === 'string') {
            botResponse = data;
        } else if (data.output) {
            botResponse = data.output;
        } else if (data.text) {
            botResponse = data.text;
        } else if (data.message) {
            botResponse = data.message;
        } else {
            botResponse = JSON.stringify(data); // Fallback
        }

        addMessageToChat(botResponse, 'bot');
        saveChatHistory();

    } catch (error) {
        console.error('Chat Error:', error);
        removeTypingIndicator();
        addMessageToChat("⚠️ Sorry, I'm having trouble connecting to the server. Please check the console (F12).", 'bot');
    }
}

/**
 * Add message to chat box
 */
function addMessageToChat(message, sender) {
    const chatBox = document.getElementById('chatBox');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;

    // Convert newlines to breaks and links to anchors
    const formattedMessage = escapeHtml(message)
        .replace(/\n/g, '<br>')
        .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" style="text-decoration: underline;">$1</a>');

    if (sender === 'bot') {
        messageDiv.innerHTML = `
            <span class="bot-avatar">🤖</span>
            <div class="message-content">
                <p>${formattedMessage}</p>
            </div>
        `;
    } else {
        messageDiv.innerHTML = `
            <div class="message-content">
                <p>${formattedMessage}</p>
            </div>
        `;
    }

    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

/**
 * Show typing indicator
 */
function showTypingIndicator() {
    const chatBox = document.getElementById('chatBox');
    // Remove existing indicator if any
    removeTypingIndicator();
    
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot-message typing-indicator';
    typingDiv.id = 'typingIndicator';
    typingDiv.innerHTML = `
        <span class="bot-avatar">🤖</span>
        <div class="message-content">
            <p>typing...</p> 
        </div>
    `;
    chatBox.appendChild(typingDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

/**
 * Remove typing indicator
 */
function removeTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

/**
 * Save chat history to localStorage
 */
function saveChatHistory() {
    const chatBox = document.getElementById('chatBox');
    const messages = [];

    chatBox.querySelectorAll('.message').forEach(msg => {
        if(msg.classList.contains('typing-indicator')) return;

        const isUserMessage = msg.classList.contains('user-message');
        // We use innerText to capture the text content
        const text = msg.querySelector('.message-content p')?.innerText || '';
        if(text) {
            messages.push({ sender: isUserMessage ? 'user' : 'bot', text });
        }
    });

    localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(messages));
}

/**
 * Load chat history
 */
function loadChatHistory() {
    const stored = localStorage.getItem(CONFIG.STORAGE_KEY);
    if (stored) {
        try {
            const messages = JSON.parse(stored);
            messages.forEach(msg => {
                addMessageToChat(msg.text, msg.sender);
            });
        } catch (e) {
            console.error('Error loading chat history:', e);
        }
    }
}

// ============================================
// FAQ & CONTACT FORM (Standard)
// ============================================

function initFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            const isExpanded = question.getAttribute('aria-expanded') === 'true';
            
            faqQuestions.forEach(q => {
                if (q !== question) {
                    q.setAttribute('aria-expanded', 'false');
                    q.nextElementSibling.hidden = true;
                }
            });

            question.setAttribute('aria-expanded', !isExpanded);
            answer.hidden = isExpanded; 
        });
    });
}

function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => validateField(input));
            input.addEventListener('input', () => {
                if(input.closest('.form-group').classList.contains('error')) {
                    validateField(input);
                }
            });
        });
    }
}

function handleContactSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const fields = ['name', 'email', 'subject', 'message'];
    let isValid = true;

    fields.forEach(fieldId => {
        const input = document.getElementById(fieldId);
        if (!validateField(input)) isValid = false;
    });

    if (isValid) {
        const submitBtn = form.querySelector('.submit-button');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = '✅ Message Sent!';
        submitBtn.disabled = true;
        submitBtn.style.backgroundColor = CONFIG.COLORS.green;

        setTimeout(() => {
            form.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            submitBtn.style.backgroundColor = '';
            clearAllErrors();
        }, 3000);
    }
}

function validateField(field) {
    const fieldName = field.id;
    const errorElement = document.getElementById(`${fieldName}Error`);
    const formGroup = field.closest('.form-group');
    let isValid = true;
    let errorMessage = '';
    const value = field.value.trim();

    if (!value) {
        isValid = false;
        errorMessage = 'This field is required';
    } else if (fieldName === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Invalid email';
        }
    }
    
    if (isValid) {
        formGroup.classList.remove('error');
        if(errorElement) errorElement.textContent = '';
    } else {
        formGroup.classList.add('error');
        if(errorElement) errorElement.textContent = errorMessage;
    }
    return isValid;
}

function clearAllErrors() {
    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
    document.querySelectorAll('.form-group').forEach(el => el.classList.remove('error'));
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🍕 Makan@RP App Initialized (n8n Connected)');

    initTabs();
    initMobileMenu();
    initChat();
    initFAQ();
    initContactForm();

    const hash = window.location.hash.replace('#', '');
    if (hash && document.getElementById(hash)) {
        window.switchTab(hash);
    } else {
        window.switchTab('home');
    }
});
