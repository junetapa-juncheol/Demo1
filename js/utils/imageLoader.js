// js/utils/imageLoader.js
// Lazy Loading and Image Optimization

class ImageLoader {
    constructor() {
        this.lazyImages = [];
        this.observer = null;
        this.init();
    }

    init() {
        this.setupLazyLoading();
        this.setupImageErrorHandling();
        console.log('Image Loader initialized');
    }

    setupLazyLoading() {
        // Check if Intersection Observer is supported
        if ('IntersectionObserver' in window) {
            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.loadImage(entry.target);
                        this.observer.unobserve(entry.target);
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.1
            });

            this.lazyImages = document.querySelectorAll('img[loading="lazy"]');
            this.lazyImages.forEach(img => {
                this.observer.observe(img);
            });
        } else {
            // Fallback for older browsers
            this.loadAllImages();
        }
    }

    loadImage(img) {
        const src = img.getAttribute('src');
        if (src) {
            const tempImg = new Image();
            
            tempImg.onload = () => {
                img.src = src;
                img.classList.add('loaded');
                this.addImageEffects(img);
            };

            tempImg.onerror = () => {
                this.handleImageError(img);
            };

            tempImg.src = src;
        }
    }

    loadAllImages() {
        this.lazyImages.forEach(img => {
            this.loadImage(img);
        });
    }

    addImageEffects(img) {
        // Add hover effects and animations
        img.addEventListener('mouseenter', () => {
            img.style.transform = 'scale(1.05)';
        });

        img.addEventListener('mouseleave', () => {
            img.style.transform = 'scale(1)';
        });
    }

    handleImageError(img) {
        // Create fallback gradient background
        const fallbackGradient = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        
        img.style.background = fallbackGradient;
        img.style.display = 'flex';
        img.style.alignItems = 'center';
        img.style.justifyContent = 'center';
        img.style.color = 'white';
        img.style.fontSize = '2rem';
        img.innerHTML = '🤖';
        img.classList.add('loaded');
        
        console.warn('Image failed to load:', img.src);
    }

    setupImageErrorHandling() {
        // Global error handler for all images
        document.addEventListener('error', (e) => {
            if (e.target.tagName === 'IMG') {
                this.handleImageError(e.target);
            }
        }, true);
    }

    // Preload critical images
    preloadCriticalImages() {
        const criticalImages = [
            'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1920&h=1080',
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&h=300',
            'https://images.unsplash.com/photo-1518709268805-4e9042af2176?auto=format&fit=crop&w=400&h=300'
        ];

        criticalImages.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = src;
            document.head.appendChild(link);
        });
    }

    // Optimize image delivery based on connection speed
    optimizeImageQuality() {
        if ('connection' in navigator) {
            const connection = navigator.connection;
            const isSlow = connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g';
            
            if (isSlow) {
                // Replace high-quality images with lower quality versions
                const images = document.querySelectorAll('img[src*="unsplash.com"]');
                images.forEach(img => {
                    const src = img.src;
                    if (src.includes('w=800')) {
                        img.src = src.replace('w=800', 'w=400');
                    }
                    if (src.includes('w=1920')) {
                        img.src = src.replace('w=1920', 'w=1200');
                    }
                });
            }
        }
    }

    // Progressive image enhancement
    enhanceImages() {
        const images = document.querySelectorAll('img.loaded');
        images.forEach(img => {
            // Add subtle animation on scroll
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.animation = 'fadeInUp 0.8s ease-out';
                    }
                });
            }, { threshold: 0.2 });

            observer.observe(img);
        });
    }

    // Create image gallery functionality
    createGallery() {
        const portfolioImages = document.querySelectorAll('.portfolio-image img');
        portfolioImages.forEach(img => {
            img.addEventListener('click', () => {
                this.openLightbox(img);
            });
        });
    }

    openLightbox(img) {
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox-overlay';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <img src="${img.src}" alt="${img.alt}">
                <button class="lightbox-close">&times;</button>
            </div>
        `;

        document.body.appendChild(lightbox);
        document.body.style.overflow = 'hidden';

        // Close lightbox
        const closeBtn = lightbox.querySelector('.lightbox-close');
        closeBtn.addEventListener('click', () => {
            this.closeLightbox(lightbox);
        });

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                this.closeLightbox(lightbox);
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeLightbox(lightbox);
            }
        });
    }

    closeLightbox(lightbox) {
        lightbox.remove();
        document.body.style.overflow = '';
    }

    // Initialize all features
    initializeAll() {
        this.preloadCriticalImages();
        this.optimizeImageQuality();
        
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.enhanceImages();
                this.createGallery();
            });
        } else {
            this.enhanceImages();
            this.createGallery();
        }
    }
}

// Add required CSS for lightbox
const lightboxStyles = `
    .lightbox-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    }

    .lightbox-content {
        position: relative;
        max-width: 90%;
        max-height: 90%;
    }

    .lightbox-content img {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
        border-radius: 8px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    }

    .lightbox-close {
        position: absolute;
        top: -40px;
        right: -40px;
        background: rgba(255, 255, 255, 0.1);
        border: none;
        color: white;
        font-size: 30px;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
    }

    .lightbox-close:hover {
        background: rgba(255, 255, 255, 0.2);
        transform: scale(1.1);
    }

    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.textContent = lightboxStyles;
document.head.appendChild(styleSheet);

// Export for global use
window.ImageLoader = ImageLoader;