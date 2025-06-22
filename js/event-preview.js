document.addEventListener('DOMContentLoaded', function() {
    const eventCards = document.querySelector('.event-cards');
    
    // Function to fetch events from events.html
    async function fetchPreviewEvents() {
        try {
            const response = await fetch('/pages/events.html');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            // Get first 3 events from the carousel
            const carouselItems = Array.from(doc.querySelectorAll('.carousel-item')).slice(0, 3);
            
            return carouselItems.map(item => {
                // Extract event details
                const title = item.querySelector('h3')?.textContent || 'Upcoming Event';
                const time = item.querySelector('.event-time')?.textContent || 'TechFusion 2025';
                const description = item.querySelector('p')?.textContent || 'Join us for this exciting event!';
                const image = item.querySelector('.event-poster')?.getAttribute('src');
                
                // Ensure image path is correct
                const imagePath = image ? (image.startsWith('/') ? image : `/${image}`) : '/images/events/default.jpg';
                
                return {
                    title,
                    date: time,
                    description,
                    image: imagePath
                };
            });
        } catch (error) {
            console.error('Error fetching preview events:', error);
            return [];
        }
    }
    
    // Update existing event cards with fetched data
    async function updateEventCards() {
        try {
            const events = await fetchPreviewEvents();
            const eventCardElements = document.querySelectorAll('.event-card');
            
            events.forEach((event, index) => {
                if (eventCardElements[index]) {
                    const card = eventCardElements[index];
                    const imageDiv = card.querySelector('.event-image');
                    if (imageDiv) {
                        imageDiv.style.backgroundImage = `url('${event.image}')`;
                        imageDiv.style.backgroundSize = 'cover';
                        imageDiv.style.backgroundPosition = 'center';
                        imageDiv.style.height = '200px';
                    }
                    
                    const titleEl = card.querySelector('h3');
                    if (titleEl) titleEl.textContent = event.title;
                    
                    const dateEl = card.querySelector('.date');
                    if (dateEl) dateEl.innerHTML = `<i class="fas fa-calendar"></i> ${event.date}`;
                    
                    const descEl = card.querySelector('p');
                    if (descEl) descEl.textContent = event.description;
                }
            });
        } catch (error) {
            console.error('Error updating event cards:', error);
        }
    }
    
    // Initial update
    updateEventCards();
});
