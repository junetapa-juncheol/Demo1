// js/components/navigation.js
// Advanced Navigation System with Quantum Effects

class Navigation {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.navMenu = document.querySelector('.nav-menu');
        this.hamburger = document.querySelector('.hamburger');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.logoCanvas = document.getElementById('logo-canvas');
        
        this.isMenuOpen = false;
        this.currentSection = '';
        this.scrollDirection = 'down';
        this.lastScrollY = 0;
        
        this.init3DLogo();
    }

    init() {
        this.setupScrollEffects();
        this.setupMobileMenu();
        this.setupActiveLinks();
        this.setupLogo3D();
        this.setupKeyboardNavigation();
        
        console.log('Navigation initialized');
    }

    setupScrollEffects() {
        let ticking = false;
        
        const updateNavbar = () => {
            const scrollY = window.scrollY;
            this.scrollDirection = scrollY > this.lastScrollY ? 'down' : 'up';
            this.lastScrollY = scrollY;
            
            // Glass morphism effect on scroll
            if (scrollY > 50) {
                this.navbar.classList.add('scrolled');
                this.navbar.style.background = 'rgba(255, 255, 255, 0.98)';
                this.navbar.style.backdropFilter = 'blur(20px)';
                this.navbar.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
            } else {
                this.navbar.classList.remove('scrolled');
                this.navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                this.navbar.style.backdropFilter = 'blur(10px)';
                this.navbar.style.boxShadow = 'none';
            }
            
            // Auto-hide navbar on scroll down (except when menu is open)
            if (!this.isMenuOpen) {
                if (this.scrollDirection === 'down' && scrollY > 100) {
                    this.navbar.style.transform = 'translateY(-100%)';
                } else {
                    this.navbar.style.transform = 'translateY(0)';
                }
            }
            
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateNavbar);
                ticking = true;
            }
        });
    }

    setupMobileMenu() {
        if (!this.hamburger || !this.navMenu) return;
        
        this.hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleMobileMenu();
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isMenuOpen && 
                !this.navMenu.contains(e.target) && 
                !this.hamburger.contains(e.target)) {
                this.closeMobileMenu();
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMenuOpen) {
                this.closeMobileMenu();
            }
        });

        // Smooth scrolling for nav links
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                this.scrollToSection(targetId);
                this.closeMobileMenu();
            });
        });
    }

    toggleMobileMenu() {
        this.isMenuOpen = !this.isMenuOpen;
        
        // Animate hamburger
        this.hamburger.classList.toggle('active');
        
        // Animate menu
        this.navMenu.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = this.isMenuOpen ? 'hidden' : '';
        
        // Keep navbar visible when menu is open
        if (this.isMenuOpen) {
            this.navbar.style.transform = 'translateY(0)';
        }
        
        // Animate menu items
        if (this.isMenuOpen) {
            this.animateMenuItems('in');
        } else {
            this.animateMenuItems('out');
        }
    }

    closeMobileMenu() {
        if (!this.isMenuOpen) return;
        
        this.isMenuOpen = false;
        this.hamburger.classList.remove('active');
        this.navMenu.classList.remove('active');
        document.body.style.overflow = '';
        
        this.animateMenuItems('out');
    }

    animateMenuItems(direction) {
        this.navLinks.forEach((link, index) => {
            const delay = index * 100;
            
            if (direction === 'in') {
                setTimeout(() => {
                    link.style.opacity = '1';
                    link.style.transform = 'translateY(0)';
                }, delay);
            } else {
                setTimeout(() => {
                    link.style.opacity = '0';
                    link.style.transform = 'translateY(-20px)';
                }, delay);
            }
        });
    }

    setupActiveLinks() {
        const sections = document.querySelectorAll('section[id]');
        
        const updateActiveLink = () => {
            const scrollPos = window.scrollY + 100;
            let activeSection = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');
                
                if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                    activeSection = sectionId;
                }
            });
            
            if (activeSection !== this.currentSection) {
                this.currentSection = activeSection;
                this.updateActiveNavLink(activeSection);
            }
        };

        window.addEventListener('scroll', this.throttle(updateActiveLink, 100));
    }

    updateActiveNavLink(activeSection) {
        this.navLinks.forEach(link => {
            link.classList.remove('active');
            
            if (link.getAttribute('href') === `#${activeSection}`) {
                link.classList.add('active');
                this.createQuantumRipple(link);
            }
        });
    }

    createQuantumRipple(element) {
        const ripple = document.createElement('span');
        ripple.className = 'quantum-ripple';
        
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = '50%';
        ripple.style.top = '50%';
        ripple.style.transform = 'translate(-50%, -50%) scale(0)';
        
        element.appendChild(ripple);
        
        // Animate ripple
        requestAnimationFrame(() => {
            ripple.style.transform = 'translate(-50%, -50%) scale(1)';
            ripple.style.opacity = '0';
        });
        
        // Remove ripple after animation
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
    }

    scrollToSection(targetId) {
        const targetElement = document.querySelector(targetId);
        if (!targetElement) return;
        
        const offsetTop = targetElement.offsetTop - 70;
        const startPosition = window.scrollY;
        const distance = offsetTop - startPosition;
        const duration = 1000;
        let start = null;
        
        const easeInOutCubic = (t) => {
            return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
        };
        
        const animateScroll = (timestamp) => {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            const percentage = Math.min(progress / duration, 1);
            const easedPercentage = easeInOutCubic(percentage);
            
            window.scrollTo(0, startPosition + distance * easedPercentage);
            
            if (percentage < 1) {
                requestAnimationFrame(animateScroll);
            }
        };
        
        requestAnimationFrame(animateScroll);
    }

    init3DLogo() {
        if (!this.logoCanvas) return;
        
        // Set canvas size
        this.logoCanvas.width = 40;
        this.logoCanvas.height = 40;
        
        // Initialize Three.js scene for logo
        if (window.THREE) {
            this.setup3DLogo();
        }
    }

    setup3DLogo() {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ 
            canvas: this.logoCanvas,
            alpha: true,
            antialias: true
        });
        
        renderer.setSize(40, 40);
        
        // Create logo geometry
        const geometry = new THREE.IcosahedronGeometry(0.8, 1);
        const material = new THREE.MeshBasicMaterial({ 
            color: 0x007bff,
            wireframe: true,
            transparent: true,
            opacity: 0.8
        });
        
        const logo = new THREE.Mesh(geometry, material);
        scene.add(logo);
        
        camera.position.z = 2;
        
        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate);
            
            logo.rotation.x += 0.01;
            logo.rotation.y += 0.02;
            
            renderer.render(scene, camera);
        };
        
        animate();
    }

    setupLogo3D() {
        const logoText = document.querySelector('.logo-main');
        if (!logoText) return;
        
        // Add hover effect with CSS transforms
        logoText.addEventListener('mouseenter', () => {
            logoText.style.transform = 'perspective(1000px) rotateX(10deg) rotateY(10deg)';
            logoText.style.textShadow = '0 0 20px rgba(0, 123, 255, 0.8)';
        });
        
        logoText.addEventListener('mouseleave', () => {
            logoText.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
            logoText.style.textShadow = 'none';
        });
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // Alt + number keys for quick navigation
            if (e.altKey && e.key >= '1' && e.key <= '7') {
                e.preventDefault();
                const sectionIndex = parseInt(e.key) - 1;
                const sections = ['#hero', '#vision', '#innovation', '#expertise', '#portfolio', '#future', '#contact'];
                if (sections[sectionIndex]) {
                    this.scrollToSection(sections[sectionIndex]);
                }
            }
            
            // Tab navigation through menu items
            if (e.key === 'Tab' && this.isMenuOpen) {
                const focusableElements = this.navMenu.querySelectorAll('a, button');
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];
                
                if (e.shiftKey && document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                } else if (!e.shiftKey && document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        });
    }

    // Utility methods
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Public methods for external use
    goToSection(sectionId) {
        this.scrollToSection(sectionId);
    }

    hideNavbar() {
        this.navbar.style.transform = 'translateY(-100%)';
    }

    showNavbar() {
        this.navbar.style.transform = 'translateY(0)';
    }

    setActiveSection(sectionId) {
        this.updateActiveNavLink(sectionId);
    }
}

// Export for global use
window.Navigation = Navigation;