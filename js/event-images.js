// Function to handle image loading and adjustment
function adjustEventImages() {
    const imageContainers = document.querySelectorAll('.event-poster-container');

    imageContainers.forEach(container => {
        const img = container.querySelector('.event-poster');
        
        if (img) {
            const adjustImage = () => {
                // Reset any previous styles
                img.style.maxWidth = '100%';
                img.style.maxHeight = '100%';
                img.style.width = 'auto';
                img.style.height = 'auto';
                img.style.objectFit = 'contain';
                img.style.objectPosition = 'center';
                
                // Calculate optimal dimensions
                const containerWidth = container.clientWidth - 20; // Account for padding
                const containerHeight = container.clientHeight - 20;
                const imgRatio = img.naturalWidth / img.naturalHeight;
                const containerRatio = containerWidth / containerHeight;

                if (imgRatio > containerRatio) {
                    // Image is wider than container
                    img.style.width = '100%';
                    img.style.height = 'auto';
                } else {
                    // Image is taller than container
                    img.style.width = 'auto';
                    img.style.height = '100%';
                }

                // Center the image
                img.style.display = 'block';
                img.style.margin = 'auto';
                
                // Add loading animation
                container.classList.remove('loading');
            };

            // Add loading state
            container.classList.add('loading');

            if (img.complete) {
                adjustImage();
            } else {
                img.onload = adjustImage;
            }

            img.onerror = () => {
                img.src = '/images/events/default-event.jpg';
                container.style.backgroundColor = 'rgba(0, 0, 0, 0.2)';
                adjustImage();
            };
        }
    });
}

// Quick View Modal
function createQuickViewModal() {
    const modal = document.createElement('div');
    modal.className = 'quick-view-modal';
    modal.innerHTML = `
        <div class="quick-view-content">
            <span class="close-modal">&times;</span>
            <div class="modal-image-container"></div>
            <div class="modal-details"></div>
        </div>
    `;
    document.body.appendChild(modal);

    // Close modal on click outside or close button
    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.classList.contains('close-modal')) {
            modal.style.opacity = '0';
            setTimeout(() => modal.style.display = 'none', 300);
        }
    });

    return modal;
}

// Show Quick View
function showQuickView(slide) {
    let modal = document.querySelector('.quick-view-modal');
    if (!modal) {
        modal = createQuickViewModal();
    }

    const modalImage = modal.querySelector('.modal-image-container');
    const modalDetails = modal.querySelector('.modal-details');
    
    // Get content from the slide
    const image = slide.querySelector('.event-poster').cloneNode(true);
    const title = slide.querySelector('.card-title').cloneNode(true);
    const date = slide.querySelector('.card-date').cloneNode(true);
    const details = slide.querySelector('.card-body').cloneNode(true);

    // Clear and add new content
    modalImage.innerHTML = '';
    modalDetails.innerHTML = '';

    // Setup image container
    image.style.maxWidth = '100%';
    image.style.maxHeight = '60vh';
    image.style.width = 'auto';
    image.style.height = 'auto';
    image.style.objectFit = 'contain';
    modalImage.appendChild(image);

    // Add details
    modalDetails.appendChild(title);
    modalDetails.appendChild(date);
    modalDetails.appendChild(details);

    // Show modal with animation
    modal.style.display = 'flex';
    requestAnimationFrame(() => {
        modal.style.opacity = '1';
    });
}

// Function to create and adjust new event card
function createEventCard(eventData) {
    const slide = document.createElement('div');
    slide.className = 'swiper-slide';
    
    slide.innerHTML = `
        <div class="event-card">
            <div class="event-poster-container">
                <img src="${eventData.imageUrl}" alt="${eventData.title}" class="event-poster">
            </div>
            <div class="card-header">
                <h2 class="card-title">${eventData.title}</h2>
                <p class="card-date">${eventData.date}</p>
            </div>
            <div class="card-body">
                <div class="event-time">${eventData.time}</div>
                <div class="event-details">
                    ${eventData.faculty ? `
                    <div class="detail-row">
                        <span class="detail-label">Faculty:</span>
                        <span class="faculty-name">${eventData.faculty}</span>
                    </div>` : ''}
                    ${eventData.coordinator ? `
                    <div class="detail-row">
                        <span class="detail-label">TIC Coordinator:</span>
                        <span class="coordinator-name">${eventData.coordinator}</span>
                    </div>` : ''}
                </div>
                <p>${eventData.description}</p>
            </div>
            <div class="card-footer">
                <button class="register-btn" ${eventData.registrationClosed ? 'disabled style="background-color: #ccc; cursor: not-allowed;"' : ''}>
                    ${eventData.registrationClosed ? 'Registration Closed' : 'Register Now'}
                </button>
            </div>
        </div>
    `;

    // Get the swiper wrapper and append the new slide
    const swiperWrapper = document.querySelector('.swiper-wrapper');
    if (swiperWrapper) {
        swiperWrapper.appendChild(slide);
        
        // Update Swiper
        if (window.eventSwiper) {
            window.eventSwiper.update();
        }
        
        // Adjust the new image
        adjustEventImages();
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Add styles
    const styles = document.createElement('style');
    styles.textContent = `
        .quick-view-modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            z-index: 1000;
            opacity: 0;
            transition: all 0.3s ease;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }
        .quick-view-content {
            background: white;
            max-width: 1000px;
            width: 95%;
            margin: auto;
            padding: 20px;
            border-radius: 15px;
            position: relative;
            display: grid;
            grid-template-columns: 1fr;
            gap: 20px;
            max-height: 90vh;
            overflow-y: auto;
        }
        .close-modal {
            position: absolute;
            right: 15px;
            top: 15px;
            font-size: 24px;
            cursor: pointer;
            color: #fff;
            background: rgba(0, 0, 0, 0.5);
            width: 30px;
            height: 30px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2;
        }
        .modal-image-container {
            width: 100%;
            height: auto;
            max-height: 70vh;
            position: relative;
            background: #f8f9fa;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .modal-image-container img {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
            border-radius: 5px;
        }
        .modal-details {
            padding: 0 10px;
        }
        .modal-details h2 {
            margin: 0;
            font-size: 1.8rem;
            color: #333;
        }
        .modal-details .event-time {
            font-size: 1.1rem;
            color: #2196F3;
            margin: 10px 0;
        }
        .modal-details .detail-row {
            margin: 8px 0;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .modal-details p {
            margin: 15px 0;
            line-height: 1.6;
        }
        @media (max-width: 768px) {
            .quick-view-content {
                width: 100%;
                padding: 15px;
            }
            .modal-image-container {
                max-height: 50vh;
            }
            .modal-details h2 {
                font-size: 1.4rem;
            }
        }
        .event-poster-container {
            position: relative;
            overflow: hidden;
        }

        .event-poster-container.loading::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 50%;
            height: 100%;
            background: linear-gradient(
                to right,
                transparent,
                rgba(255, 255, 255, 0.2),
                transparent
            );
            animation: loading 1.5s infinite;
        }

        @keyframes loading {
            0% {
                left: -100%;
            }
            100% {
                left: 200%;
            }
        }

        .event-poster {
            transition: transform 0.4s ease, opacity 0.4s ease;
            opacity: 0;
        }

        .event-poster.loaded {
            opacity: 1;
        }
    `;
    document.head.appendChild(styles);

    // Initial adjustment
    adjustEventImages();

    // Add resize observer for dynamic size adjustments
    const resizeObserver = new ResizeObserver(entries => {
        entries.forEach(entry => {
            if (entry.target.classList.contains('event-poster-container')) {
                const img = entry.target.querySelector('.event-poster');
                if (img && img.complete) {
                    adjustEventImages();
                }
            }
        });
    });

    // Observe all image containers
    document.querySelectorAll('.event-poster-container').forEach(container => {
        resizeObserver.observe(container);
    });

    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(adjustEventImages, 100);
    });

    // Add keyboard navigation for modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const modal = document.querySelector('.quick-view-modal');
            if (modal && modal.style.display === 'flex') {
                modal.style.opacity = '0';
                setTimeout(() => modal.style.display = 'none', 300);
            }
        }
    });

    // Add loading animation to images
    document.querySelectorAll('.event-poster').forEach(img => {
        if (img.complete) {
            img.classList.add('loaded');
        } else {
            img.onload = () => img.classList.add('loaded');
        }
    });
});

// Export for use in other scripts
window.adjustEventImages = adjustEventImages;

// Example usage of adding a new event:
/*
createEventCard({
    imageUrl: '/images/events/new-event.jpg',
    title: 'New Event Title',
    date: 'Day X',
    time: '10:00 AM - 11:30 AM',
    faculty: 'Faculty Name',
    coordinator: 'Coordinator Name',
    description: 'Event description goes here.',
    registrationClosed: false
});
*/
