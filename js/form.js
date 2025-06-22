// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get the form elements
    const joinForm = document.querySelector('.join-form');
    
    if (!joinForm) return; // Exit if no form found

    // Create chatbot container
    const chatbot = document.createElement('div');
    chatbot.className = 'chatbot';
    document.body.appendChild(chatbot);
    
    // Handle form submission
    joinForm.addEventListener('submit', async function(event) {
        // Prevent the default form submission
        event.preventDefault();
        
        // Clear any previous error states
        clearErrors();
        
        // Validate required fields
        const requiredFields = joinForm.querySelectorAll('[required]');
        let isValid = true;
        let firstInvalidField = null;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                markFieldAsInvalid(field, 'This field is required');
                if (!firstInvalidField) firstInvalidField = field;
            }
        });
        
        if (!isValid) {
            showChatbotMessage('Please fill all required fields marked with *', 'error');
            firstInvalidField.focus();
            return false;
        }

        // Additional validations
        const email = joinForm.querySelector('#email').value;
        const phone = joinForm.querySelector('#phone').value;

        // Email validation
        if (!isValidEmail(email)) {
            markFieldAsInvalid(joinForm.querySelector('#email'), 'Please enter a valid email address');
            showChatbotMessage('Please enter a valid email address', 'error');
            return false;
        }

        // Phone validation
        if (!isValidPhone(phone)) {
            markFieldAsInvalid(joinForm.querySelector('#phone'), 'Please enter a valid phone number');
            showChatbotMessage('Please enter a valid phone number', 'error');
            return false;
        }

        // Validate reCAPTCHA
        const recaptchaResponse = grecaptcha.getResponse();
        if (!recaptchaResponse) {
            showChatbotMessage('Please complete the reCAPTCHA verification', 'error');
            return false;
        }

        // Show submitting message
        showChatbotMessage('Processing your application...', 'info');

        // Disable form while submitting
        const submitButton = joinForm.querySelector('button[type="submit"]');
        if (submitButton) submitButton.disabled = true;

        try {
            // Get form data
            const formData = new FormData(joinForm);
            const formDataObj = {};
            formData.forEach((value, key) => {
                formDataObj[key] = value;
            });

            // Get reCAPTCHA response
            const recaptchaResponse = await grecaptcha.execute();
            formDataObj['g-recaptcha-response'] = recaptchaResponse;
            
            // Send form data to backend
            const response = await fetch('https://ticlub-backend.onrender.com/api/join', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Origin': window.location.origin
                },
                credentials: 'include',
                body: JSON.stringify(formDataObj)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Submission failed');
            }

            // Store form data in session storage for thank you page
            sessionStorage.setItem('formData', JSON.stringify({
                name: formDataObj.name,
                email: formDataObj.email,
                department: formDataObj.department
            }));

            // Redirect to thank you page
            window.location.href = '/pages/thank-you.html';

        } catch (error) {
            console.error('Error:', error);
            showChatbotMessage(error.message || 'There was an error submitting your application. Please try again later.', 'error');
            
            // Reset reCAPTCHA
            grecaptcha.reset();
            
            // Re-enable form
            if (submitButton) submitButton.disabled = false;

            // Scroll to top of form
            joinForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Function to validate email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Function to validate phone number
function isValidPhone(phone) {
    const phoneRegex = /^[\d\s\-+()]{10,15}$/;
    return phoneRegex.test(phone.replace(/\s+/g, ''));
}

// Function to clear all error states
function clearErrors() {
    const errorFields = document.querySelectorAll('.error');
    errorFields.forEach(field => {
        field.classList.remove('error');
        const errorMessage = field.nextElementSibling;
        if (errorMessage && errorMessage.classList.contains('error-message')) {
            errorMessage.remove();
        }
    });
}

// Function to mark a field as invalid
function markFieldAsInvalid(field, message) {
    field.classList.add('error');
    const errorMessage = document.createElement('div');
    errorMessage.className = 'error-message';
    errorMessage.textContent = message;
    if (!field.nextElementSibling?.classList.contains('error-message')) {
        field.parentNode.insertBefore(errorMessage, field.nextElementSibling);
    }
}

// Function to show chatbot messages
function showChatbotMessage(message, type = 'info', duration = 5000) {
    const chatbot = document.querySelector('.chatbot');
    if (!chatbot) return;

    // Clear previous success messages if this is a success message
    if (type === 'success') {
        const previousMessages = chatbot.querySelectorAll('.chatbot-message.success');
        previousMessages.forEach(msg => msg.remove());
    }

    const messageElement = document.createElement('div');
    messageElement.className = `chatbot-message ${type}`;
    messageElement.textContent = message;

    // Add icon based on message type
    const icon = document.createElement('i');
    switch (type) {
        case 'success':
            icon.className = 'fas fa-check-circle';
            break;
        case 'error':
            icon.className = 'fas fa-exclamation-circle';
            break;
        default:
            icon.className = 'fas fa-info-circle';
    }
    messageElement.insertBefore(icon, messageElement.firstChild);

    chatbot.appendChild(messageElement);

    // Only auto-remove non-success messages
    if (duration > 0) {
        setTimeout(() => {
            messageElement.classList.add('fade-out');
            setTimeout(() => messageElement.remove(), 500);
        }, duration);
    }
}