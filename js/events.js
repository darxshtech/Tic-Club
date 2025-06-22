document.addEventListener('DOMContentLoaded', function() {
    const eventsGrid = document.querySelector('.events-grid');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const template = document.getElementById('event-card-template');
    const registrationModal = document.querySelector('.registration-modal');
    const registrationForm = document.getElementById('registration-form');
    let currentEvents = [];

    // Function to fetch events from events data
    async function fetchEvents() {
        try {
            const response = await fetch('/pages/events.html');
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const carouselCards = doc.querySelectorAll('.carousel .card');
            
            return Array.from(carouselCards).map(card => ({
                title: card.querySelector('.card-title').textContent,
                date: card.querySelector('.card-date').textContent,
                description: card.querySelector('.card-body p').textContent,
                coordinator: card.querySelector('.coordinator-name')?.textContent || '',
                faculty: card.querySelector('.faculty-name')?.textContent || '',
                time: card.querySelector('.event-time')?.textContent || '',
                status: determineEventStatus(card.querySelector('.card-date').textContent),
                image: card.querySelector('.event-image')?.getAttribute('src') || '/images/events/default.jpg'
            }));
        } catch (error) {
            console.error('Error fetching events:', error);
            return [];
        }
    }

    // Determine event status based on date
    function determineEventStatus(dateStr) {
        const eventDate = new Date(dateStr);
        const now = new Date();
        const oneDay = 24 * 60 * 60 * 1000;
        
        if (eventDate < now - oneDay) {
            return 'past';
        } else if (eventDate > now + oneDay) {
            return 'upcoming';
        } else {
            return 'ongoing';
        }
    }

    // Create event card from template
    function createEventCard(event) {
        const card = template.content.cloneNode(true);
        
        // Set event status
        const statusEl = card.querySelector('.event-status');
        statusEl.textContent = event.status.charAt(0).toUpperCase() + event.status.slice(1);
        statusEl.classList.add(`status-${event.status}`);
        
        // Set image
        const imageEl = card.querySelector('.event-image');
        imageEl.src = event.image;
        imageEl.alt = event.title;
        
        // Set content
        card.querySelector('.event-date').textContent = event.date;
        card.querySelector('.event-title').textContent = event.title;
        card.querySelector('.event-time').textContent = event.time;
        card.querySelector('.event-coordinator').textContent = event.coordinator;
        card.querySelector('.event-details').textContent = event.description;
        
        if (event.faculty) {
            card.querySelector('.event-faculty').textContent = `Faculty: ${event.faculty}`;
        }
        
        // Handle register button
        const registerBtn = card.querySelector('.register-btn');
        if (event.status === 'past') {
            registerBtn.disabled = true;
            registerBtn.textContent = 'Event Ended';
        } else if (event.status === 'ongoing') {
            registerBtn.textContent = 'Join Now';
        }
        
        // Add event listener for registration
        registerBtn.addEventListener('click', () => showRegistrationModal(event));
        
        return card;
    }

    // Render events with filter
    function renderEvents(filter = 'all') {
        const filteredEvents = filter === 'all' 
            ? currentEvents 
            : currentEvents.filter(event => event.status === filter);
        
        eventsGrid.innerHTML = '';
        
        if (filteredEvents.length === 0) {
            eventsGrid.innerHTML = `
                <div class="no-events">
                    <i class="fas fa-calendar-times"></i>
                    <p>No ${filter} events found</p>
                </div>
            `;
            return;
        }
        
        filteredEvents.forEach(event => {
            eventsGrid.appendChild(createEventCard(event));
        });
    }

    // Show registration modal
    function showRegistrationModal(event) {
        registrationModal.style.display = 'flex';
        registrationModal.querySelector('h2').textContent = `Register for ${event.title}`;
        
        // Store event data for form submission
        registrationForm.dataset.eventId = event.id;
    }

    // Handle registration form submission
    registrationForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(registrationForm);
        const eventId = registrationForm.dataset.eventId;
        
        try {
            // Here you would typically send the registration data to your backend
            console.log('Registration submitted:', {
                eventId,
                name: formData.get('name'),
                email: formData.get('email'),
                phone: formData.get('phone')
            });
            
            // Show success message
            registrationModal.querySelector('.modal-content').innerHTML = `
                <h2>Registration Successful!</h2>
                <p>Thank you for registering. We'll send you an email with further details.</p>
                <button class="close-btn">Close</button>
            `;
        } catch (error) {
            console.error('Registration failed:', error);
        }
    });

    // Close modal handlers
    document.querySelector('.cancel-btn')?.addEventListener('click', () => {
        registrationModal.style.display = 'none';
    });

    registrationModal.addEventListener('click', (e) => {
        if (e.target === registrationModal) {
            registrationModal.style.display = 'none';
        }
    });

    // Filter button handlers
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderEvents(btn.dataset.filter);
        });
    });
    
    // Initial load
    (async () => {
        // Show loading state
        eventsGrid.innerHTML = `
            <div class="loading-spinner">
                <div class="spinner"></div>
                <p>Loading events...</p>
            </div>
        `;
        
        // Fetch and render events
        currentEvents = await fetchEvents();
        renderEvents();
    })();
});
