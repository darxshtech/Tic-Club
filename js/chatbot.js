// Chatbot responses
const responses = {
    greetings: [
        "Hello! How can I help you today?",
        "Hi there! Welcome to TIC. What would you like to know?",
        "Welcome! I'm here to help you with any questions about TIC."
    ],
    membership: [
        "To become a member, simply fill out the form above. We'll review your application and get back to you within 24-48 hours.",
        "Membership is open to all students! Just complete the registration form and we'll process your application.",
        "Want to join TIC? Great choice! Fill out the membership form and we'll contact you soon."
    ],
    benefits: [
        "TIC members get access to exclusive workshops, events, project opportunities, and networking with industry professionals.",
        "As a member, you'll get to work on exciting projects, attend tech workshops, and build your professional network.",
        "Members enjoy benefits like mentorship, project collaboration, skill development workshops, and industry connections."
    ],
    projects: [
        "We work on various tech projects including web development, AI/ML, IoT, and mobile apps.",
        "Our projects range from web apps to AI solutions. Members can join existing projects or propose new ones.",
        "Current projects include web development, machine learning, and IoT. You can join any project that interests you!"
    ],
    events: [
        "We regularly organize workshops, hackathons, tech talks, and networking events.",
        "Our events include coding competitions, tech workshops, guest lectures, and industry visits.",
        "Stay tuned for upcoming events like workshops, hackathons, and tech talks!"
    ],
    contact: [
        "You can reach us at ticnoreply00@gmail.com or through our social media channels.",
        "Have questions? Email us at ticnoreply00@gmail.com or use the contact form on our website.",
        "Feel free to email us at ticnoreply00@gmail.com for any queries."
    ],
    default: [
        "I'm not sure about that. Could you please rephrase your question?",
        "I don't have information about that yet. Would you like to know about our membership, events, or projects instead?",
        "I'm still learning! For specific questions, please email us at ticnoreply00@gmail.com"
    ]
};

// Keywords for matching user input
const keywords = {
    greetings: ['hi', 'hello', 'hey', 'howdy', 'greetings'],
    membership: ['join', 'member', 'register', 'sign up', 'apply'],
    benefits: ['benefit', 'perks', 'advantage', 'offer', 'get'],
    projects: ['project', 'work', 'portfolio', 'develop', 'build'],
    events: ['event', 'workshop', 'hackathon', 'meetup', 'talk'],
    contact: ['contact', 'email', 'reach', 'connect', 'touch']
};

// Initialize chatbot
document.addEventListener('DOMContentLoaded', () => {
    // Create chatbot elements
    const chatWidget = document.createElement('div');
    chatWidget.className = 'chat-widget';
    chatWidget.innerHTML = `
        <div class="chat-header">
            <h3>TIC Assistant</h3>
            <button class="chat-close">×</button>
        </div>
        <div class="chat-messages"></div>
        <div class="chat-input">
            <input type="text" placeholder="Type your message...">
            <button class="chat-send">Send</button>
        </div>
    `;

    const chatToggle = document.createElement('button');
    chatToggle.className = 'chat-toggle';
    chatToggle.innerHTML = '<i class="fas fa-comment"></i>';

    // Add to page
    document.body.appendChild(chatWidget);
    document.body.appendChild(chatToggle);

    // Get elements
    const messagesContainer = chatWidget.querySelector('.chat-messages');
    const input = chatWidget.querySelector('input');
    const sendButton = chatWidget.querySelector('.chat-send');
    const closeButton = chatWidget.querySelector('.chat-close');

    // Toggle chat widget
    chatToggle.addEventListener('click', () => {
        chatWidget.style.display = chatWidget.style.display === 'none' ? 'block' : 'none';
        chatToggle.style.display = 'none';
        if (chatWidget.style.display === 'block' && messagesContainer.children.length === 0) {
            addBotMessage(getRandomResponse('greetings'));
        }
    });

    // Close chat widget
    closeButton.addEventListener('click', () => {
        chatWidget.style.display = 'none';
        chatToggle.style.display = 'flex';
    });

    // Send message
    const sendMessage = () => {
        const message = input.value.trim();
        if (message) {
            addUserMessage(message);
            input.value = '';
            setTimeout(() => respondToMessage(message), 500);
        }
    };

    sendButton.addEventListener('click', sendMessage);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
});

// Get random response from category
function getRandomResponse(category) {
    const categoryResponses = responses[category] || responses.default;
    return categoryResponses[Math.floor(Math.random() * categoryResponses.length)];
}

// Add bot message
function addBotMessage(message) {
    const messagesContainer = document.querySelector('.chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'chat-message bot';
    messageDiv.innerHTML = `
        <div class="chat-avatar">
            <i class="fas fa-robot"></i>
        </div>
        <div class="chat-content">${message}</div>
    `;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Add user message
function addUserMessage(message) {
    const messagesContainer = document.querySelector('.chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'chat-message user';
    messageDiv.innerHTML = `
        <div class="chat-avatar">
            <i class="fas fa-user"></i>
        </div>
        <div class="chat-content">${message}</div>
    `;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Find matching category based on keywords
function findMatchingCategory(message) {
    message = message.toLowerCase();
    for (const [category, categoryKeywords] of Object.entries(keywords)) {
        if (categoryKeywords.some(keyword => message.includes(keyword))) {
            return category;
        }
    }
    return 'default';
}

// Respond to user message
function respondToMessage(message) {
    const category = findMatchingCategory(message);
    const response = getRandomResponse(category);
    addBotMessage(response);
}
