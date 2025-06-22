document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (!mobileMenuToggle || !navMenu) {
        console.error('Mobile menu elements not found');
        return;
    }

    function toggleMenu() {
        mobileMenuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Add animation class after a small delay to ensure smooth transition
        if (navMenu.classList.contains('active')) {
            setTimeout(() => {
                navMenu.querySelector('ul').style.opacity = '1';
                navMenu.querySelector('ul').style.transform = 'translateY(0)';
            }, 50);
        } else {
            navMenu.querySelector('ul').style.opacity = '0';
            navMenu.querySelector('ul').style.transform = 'translateY(-20px)';
        }
    }

    // Toggle menu on hamburger click
    mobileMenuToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleMenu();
    });

    // Close menu when clicking a link
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                toggleMenu();
            }
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (navMenu.classList.contains('active') && 
            !navMenu.contains(e.target) && 
            !mobileMenuToggle.contains(e.target)) {
            toggleMenu();
        }
    });

    // Prevent clicks inside menu from closing it
    navMenu.addEventListener('click', function(e) {
        e.stopPropagation();
    });

    // Close menu on window resize if open
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
            toggleMenu();
        }
    });
});