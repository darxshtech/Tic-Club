// Function to check if this is initial load or refresh
function isInitialLoadOrRefresh() {
    // Check if page is being loaded for the first time in this session
    if (!sessionStorage.getItem('pageLoaded')) {
        sessionStorage.setItem('pageLoaded', 'true');
        return true;
    }
    
    // Check if page is being refreshed
    if (performance.navigation.type === 1) {
        return true;
    }

    return false;
}

// Function to redirect to loading page
function handleLoading() {
    if (isInitialLoadOrRefresh() && window.location.pathname !== '/loading.html') {
        // Save the intended destination
        sessionStorage.setItem('destination', window.location.pathname);
        // Redirect to loading page
        window.location.href = '/loading.html';
    }
}

// Pages to preload
const pagesToPreload = [
    '/pages/gallery.html',
    '/pages/events.html',
    '/pages/about.html',
];

// Cache for preloaded content
const pageCache = new Map();

// Preload pages in background
async function preloadPages() {
    const promises = pagesToPreload.map(async (page) => {
        try {
            const response = await fetch(page);
            const text = await response.text();
            pageCache.set(page, text);
        } catch (error) {
            console.warn(`Failed to preload ${page}:`, error);
        }
    });

    await Promise.all(promises);
}

document.addEventListener('DOMContentLoaded', () => {
    const loadingScreen = document.querySelector('.loading-screen');
    
    if (loadingScreen) {
        // Show loading screen
        loadingScreen.style.display = 'flex';
        loadingScreen.style.opacity = '1';

        // Hide loading screen when all content is loaded
        window.addEventListener('load', () => {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        });
    }
});

// Run on page load
if (document.readyState === 'loading') {
    handleLoading();
}

// Start preloading when the page loads
window.addEventListener('load', () => {
    preloadPages();
});
