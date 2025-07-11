// js/main.js
// Main application entry point

class JunetapaApp {
    constructor() {
        this.isLoaded = false;
        this.currentTheme = 'light-theme';
        this.animations = new Map();
        this.observers = new Map();
        
        this.init();
    }

    async init() {
        try {
            // Show preloader
            this.showPreloader();
            
            // Initialize core systems
            await this.initializeCore();
            
            // Initialize components
            await this.initializeComponents();
            
            // Initialize sections
            await this.initializeSections();
            
            // Initialize interactions
            await this.initializeInteractions();
            
            // Complete loading
            await this.completeLoading();
            
        } catch (error) {
            console.error('App initialization failed:', error);
            this.handleInitError(error);
        }
    }

    showPreloader() {
        const preloader = document.getElementById('preloader');
        const progressBar = preloader.querySelector('.progress-bar');
        const progressPercent = preloader.querySelector('.progress-percent');
        
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress > 95) progress = 95;
            
            progressBar.style.width = `${progress}%`;
            progressPercent.textContent = `${Math.floor(progress)}%`;
            
            if (progress >= 95) {
                clearInterval(interval);
            }
        }, 200);
    }

    async initializeCore() {
        // Initialize theme system
        this.initializeTheme();
        
        // Initialize cursor follower
        this.initializeCursor();
        
        // Initialize background canvas
        if (window.QuantumEngine) {
            this.quantumEngine = new QuantumEngine();
            await this.quantumEngine.init();
        }
        
        // Initialize GSAP with ScrollTrigger
        if (window.gsap && window.ScrollTrigger) {
            gsap.registerPlugin(ScrollTrigger);
            this.initializeGSAP();
        }
    }

    async initializeComponents() {
        // Initialize navigation
        if (window.Navigation) {
            this.navigation = new Navigation();
            this.navigation.init();
        }
        
        // Initialize image loader
        if (window.ImageLoader) {
            this.imageLoader = new ImageLoader();
            this.imageLoader.initializeAll();
        }
        
        // Initialize animations
        if (window.AnimationController) {
            this.animationController = new AnimationController();
            this.animationController.init();
        }
        
        // Initialize 3D effects
        if (window.ThreeDEffects) {
            this.threeDEffects = new ThreeDEffects();
            await this.threeDEffects.init();
        }
    }

    async initializeSections() {
        // Initialize hero section
        if (window.HeroSection) {
            this.heroSection = new HeroSection();
            this.heroSection.init();
        }
        
        // Initialize portfolio section
        if (window.PortfolioSection) {
            this.portfolioSection = new PortfolioSection();
            this.portfolioSection.init();
        }
        
        // Initialize contact section
        if (window.ContactSection) {
            this.contactSection = new ContactSection();
            this.contactSection.init();
        }
    }

    async initializeInteractions() {
        // Initialize particle effects
        if (window.ParticleSystem) {
            this.particleSystem = new ParticleSystem();
            this.particleSystem.init();
        }
        
        // Initialize interactions
        if (window.InteractionController) {
            this.interactionController = new InteractionController();
            this.interactionController.init();
        }
        
        // Initialize scroll effects
        this.initializeScrollEffects();
        
        // Initialize intersection observers
        this.initializeObservers();
    }

    async completeLoading() {
        // Final progress update
        const progressBar = document.querySelector('.progress-bar');
        const progressPercent = document.querySelector('.progress-percent');
        
        progressBar.style.width = '100%';
        progressPercent.textContent = '100%';
        
        // Wait for animations to complete
        await this.delay(500);
        
        // Hide preloader
        const preloader = document.getElementById('preloader');
        preloader.style.opacity = '0';
        
        await this.delay(500);
        preloader.style.display = 'none';
        
        // Remove loading class
        document.body.classList.remove('loading');
        
        // Start main animations
        this.startMainAnimations();
        
        // Mark as loaded
        this.isLoaded = true;
        
        // Dispatch loaded event
        window.dispatchEvent(new CustomEvent('appLoaded'));
    }

    initializeTheme() {
        const savedTheme = localStorage.getItem('junetapa-theme') || 'light-theme';
        this.setTheme(savedTheme);
        
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }
    }

    setTheme(theme) {
        document.body.classList.remove('dark-theme', 'light-theme', 'auto-theme');
        document.body.classList.add(theme);
        this.currentTheme = theme;
        localStorage.setItem('junetapa-theme', theme);
        
        // Update theme toggle state
        const toggleInner = document.querySelector('.toggle-inner');
        if (toggleInner) {
            if (theme === 'light-theme') {
                toggleInner.style.transform = 'translateX(30px)';
            } else {
                toggleInner.style.transform = 'translateX(0)';
            }
        }
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light-theme' ? 'dark-theme' : 'light-theme';
        
        // Add transition class
        document.body.classList.add('theme-transitioning');
        
        this.setTheme(newTheme);
        
        // Remove transition class after animation
        setTimeout(() => {
            document.body.classList.remove('theme-transitioning');
        }, 300);
    }

    initializeCursor() {
        // 커서 팔로워가 제거되었으므로 함수 비활성화
        return;
    }

    initializeGSAP() {
        // GSAP가 로드되어 있는 경우에만 초기화
        if (typeof gsap !== 'undefined') {
            // Set up global GSAP defaults
            gsap.defaults({
                duration: 0.8,
                ease: "power2.out"
            });
            
            // Create main timeline
            this.mainTimeline = gsap.timeline({ paused: true });
        }
    }

    initializeScrollEffects() {
        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    const offsetTop = target.offsetTop - 70;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
        
        // Parallax effects
        window.addEventListener('scroll', this.throttle(() => {
            this.updateParallax();
        }, 16));
    }

    initializeObservers() {
        // Intersection observer for animations
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.triggerAnimation(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        // Observe animated elements
        document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right, .scale-in').forEach(el => {
            animationObserver.observe(el);
        });
        
        this.observers.set('animation', animationObserver);
        
        // Performance observer for monitoring
        if ('PerformanceObserver' in window) {
            const perfObserver = new PerformanceObserver((list) => {
                list.getEntries().forEach(entry => {
                    if (entry.entryType === 'measure') {
                        console.log(`Performance: ${entry.name} took ${entry.duration}ms`);
                    }
                });
            });
            
            perfObserver.observe({ entryTypes: ['measure'] });
        }
    }

    triggerAnimation(element) {
        element.classList.add('animate');
        
        // Specific animations for different elements
        if (element.classList.contains('stat-card')) {
            this.animateCounter(element);
        }
        
        if (element.classList.contains('skill-hexagon')) {
            this.animateSkillProgress(element);
        }
        
        if (element.classList.contains('timeline-item')) {
            this.animateTimelineItem(element);
        }
    }

    animateCounter(element) {
        const counter = element.querySelector('.counter');
        if (!counter || counter.dataset.animated) return;
        
        const finalValue = parseInt(counter.textContent);
        const duration = 2000;
        const increment = finalValue / (duration / 16);
        let current = 0;
        
        counter.dataset.animated = 'true';
        
        const updateCounter = () => {
            current += increment;
            if (current >= finalValue) {
                counter.textContent = finalValue;
            } else {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            }
        };
        
        updateCounter();
    }

    animateSkillProgress(element) {
        const circles = element.querySelectorAll('.progress-ring-circle');
        const skillLevel = element.dataset.skill;
        
        if (!skillLevel || element.dataset.animated) return;
        
        element.dataset.animated = 'true';
        
        circles.forEach(circle => {
            const radius = circle.r.baseVal.value;
            const circumference = radius * 2 * Math.PI;
            const offset = circumference - (skillLevel / 100) * circumference;
            
            circle.style.strokeDasharray = circumference;
            circle.style.strokeDashoffset = circumference;
            
            setTimeout(() => {
                circle.style.strokeDashoffset = offset;
            }, 500);
        });
    }

    animateTimelineItem(element) {
        if (element.dataset.animated) return;
        
        element.dataset.animated = 'true';
        
        // GSAP가 있는 경우 사용, 없으면 CSS 애니메이션 사용
        if (typeof gsap !== 'undefined') {
            gsap.fromTo(element, 
                { opacity: 0, x: element.classList.contains('fade-in-left') ? -100 : 100 },
                { opacity: 1, x: 0, duration: 1, ease: "power2.out" }
            );
        } else {
            // CSS 애니메이션으로 대체
            element.style.transition = 'opacity 1s ease, transform 1s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateX(0)';
        }
    }

    updateParallax() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        
        parallaxElements.forEach(element => {
            const speed = element.dataset.parallax || 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }

    startMainAnimations() {
        // Start quantum clock
        this.startQuantumClock();
        
        // Start particle systems
        if (this.particleSystem) {
            this.particleSystem.start();
        }
        
        // Start 3D animations
        if (this.threeDEffects) {
            this.threeDEffects.start();
        }
        
        // Start hero animations
        if (this.heroSection) {
            this.heroSection.startAnimations();
        }
    }

    startQuantumClock() {
        const clockElement = document.getElementById('quantum-clock');
        if (!clockElement) return;
        
        const updateClock = () => {
            const now = new Date();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            
            clockElement.textContent = `${hours}:${minutes}:${seconds}`;
        };
        
        updateClock();
        setInterval(updateClock, 1000);
    }

    handleInitError(error) {
        console.error('App initialization error:', error);
        
        // Hide preloader
        const preloader = document.getElementById('preloader');
        if (preloader) {
            preloader.style.display = 'none';
        }
        
        // Remove loading class
        document.body.classList.remove('loading');
        
        // Show error message
        this.showErrorMessage('앱 초기화 중 오류가 발생했습니다. 페이지를 새로고침해주세요.');
    }

    showErrorMessage(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `
            <div class="error-content">
                <h3>오류 발생</h3>
                <p>${message}</p>
                <button onclick="location.reload()">새로고침</button>
            </div>
        `;
        
        errorDiv.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            color: white;
            font-family: var(--font-primary);
        `;
        
        document.body.appendChild(errorDiv);
    }

    // Utility methods
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

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

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Performance monitoring
    measurePerformance(name, fn) {
        performance.mark(`${name}-start`);
        const result = fn();
        performance.mark(`${name}-end`);
        performance.measure(name, `${name}-start`, `${name}-end`);
        return result;
    }

    // Cleanup methods
    destroy() {
        // Clean up observers
        this.observers.forEach(observer => observer.disconnect());
        this.observers.clear();
        
        // Clean up animations
        this.animations.forEach(animation => animation.kill());
        this.animations.clear();
        
        // Clean up event listeners
        window.removeEventListener('scroll', this.updateParallax);
        
        // Clean up components
        if (this.quantumEngine) this.quantumEngine.destroy();
        if (this.threeDEffects) this.threeDEffects.destroy();
        if (this.particleSystem) this.particleSystem.destroy();
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.junetapaApp = new JunetapaApp();
});

// Handle page visibility changes for performance
document.addEventListener('visibilitychange', () => {
    if (window.junetapaApp) {
        if (document.hidden) {
            // Pause animations when page is hidden
            window.junetapaApp.pauseAnimations?.();
        } else {
            // Resume animations when page is visible
            window.junetapaApp.resumeAnimations?.();
        }
    }
});

// Handle window resize
window.addEventListener('resize', () => {
    if (window.junetapaApp) {
        window.junetapaApp.handleResize?.();
    }
});

// Global error handling
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
});

// Expose app for debugging
window.app = () => window.junetapaApp;
