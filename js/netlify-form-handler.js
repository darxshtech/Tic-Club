// Netlify Form Handler
document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form[netlify]');
    if (!form) return;

    // Show success message on page load if redirected from form submission
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('form') === 'success') {
        showFormMessage('Form submitted successfully!', 'success');
    }

    form.addEventListener('submit', function(e) {
        const submitButton = form.querySelector('button[type="submit"]');
        const formMessage = form.querySelector('.form-message');
        
        // Disable submit button
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
        }

        // Show loading state
        if (formMessage) {
            formMessage.textContent = 'Submitting your application...';
            formMessage.style.display = 'block';
            formMessage.className = 'form-message info';
        }

        // Let Netlify handle the form submission
    });
});

function showFormMessage(message, type = 'success') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message ${type}`;
    messageDiv.textContent = message;
    messageDiv.style.margin = '20px 0';
    messageDiv.style.padding = '15px';
    messageDiv.style.borderRadius = '4px';
    messageDiv.style.textAlign = 'center';
    
    if (type === 'success') {
        messageDiv.style.backgroundColor = '#d4edda';
        messageDiv.style.color = '#155724';
        messageDiv.style.border = '1px solid #c3e6cb';
    } else {
        messageDiv.style.backgroundColor = '#f8d7da';
        messageDiv.style.color = '#721c24';
        messageDiv.style.border = '1px solid #f5c6cb';
    }
    
    // Insert after the form
    const form = document.querySelector('form[netlify]');
    if (form) {
        form.parentNode.insertBefore(messageDiv, form.nextSibling);
        
        // Scroll to the message
        messageDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        // Remove message after 10 seconds
        setTimeout(() => {
            messageDiv.style.transition = 'opacity 0.5s';
            messageDiv.style.opacity = '0';
            setTimeout(() => messageDiv.remove(), 500);
        }, 10000);
    }
}
