// js/utils/fontLoader.js
// Font Loading and Optimization Utility

class FontLoader {
    constructor() {
        this.loadedFonts = new Set();
        this.fontPromises = new Map();
        this.criticalFonts = [
            'Orbitron',
            'Noto Sans KR',
            'Space Grotesk'
        ];
        this.init();
    }

    init() {
        this.preloadCriticalFonts();
        this.setupFontDisplay();
        this.monitorFontLoading();
        console.log('Font Loader initialized');
    }

    async preloadCriticalFonts() {
        const fontPromises = this.criticalFonts.map(font => this.loadFont(font));
        
        try {
            await Promise.all(fontPromises);
            this.onFontsLoaded();
        } catch (error) {
            console.warn('Some fonts failed to load:', error);
            this.onFontsLoadError();
        }
    }

    async loadFont(fontFamily, weight = '400', style = 'normal') {
        const fontKey = `${fontFamily}-${weight}-${style}`;
        
        if (this.loadedFonts.has(fontKey)) {
            return Promise.resolve();
        }

        if (this.fontPromises.has(fontKey)) {
            return this.fontPromises.get(fontKey);
        }

        const fontPromise = this.loadFontFile(fontFamily, weight, style);
        this.fontPromises.set(fontKey, fontPromise);

        try {
            await fontPromise;
            this.loadedFonts.add(fontKey);
            this.onFontLoaded(fontFamily, weight, style);
            return true;
        } catch (error) {
            console.warn(`Failed to load font: ${fontKey}`, error);
            this.onFontLoadError(fontFamily, weight, style);
            return false;
        }
    }

    async loadFontFile(fontFamily, weight, style) {
        if (!('FontFace' in window)) {
            // Fallback for older browsers
            return this.loadFontLegacy(fontFamily, weight, style);
        }

        const fontUrl = this.getFontUrl(fontFamily, weight, style);
        const fontFace = new FontFace(fontFamily, `url(${fontUrl})`, {
            weight: weight,
            style: style,
            display: 'swap'
        });

        await fontFace.load();
        document.fonts.add(fontFace);
        return fontFace;
    }

    loadFontLegacy(fontFamily, weight, style) {
        return new Promise((resolve, reject) => {
            const testText = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789가나다라마바사아자차카타파하';
            const timeout = 3000;
            
            const testElement = document.createElement('div');
            testElement.style.cssText = `
                position: absolute;
                left: -9999px;
                top: -9999px;
                visibility: hidden;
                font-family: ${fontFamily};
                font-weight: ${weight};
                font-style: ${style};
                font-size: 100px;
                width: auto;
                height: auto;
                line-height: normal;
                margin: 0;
                padding: 0;
                font-variant: normal;
                white-space: nowrap;
            `;
            testElement.textContent = testText;
            document.body.appendChild(testElement);

            const fallbackWidth = testElement.offsetWidth;
            const fallbackHeight = testElement.offsetHeight;

            const checkFont = () => {
                const currentWidth = testElement.offsetWidth;
                const currentHeight = testElement.offsetHeight;
                
                if (currentWidth !== fallbackWidth || currentHeight !== fallbackHeight) {
                    document.body.removeChild(testElement);
                    resolve();
                    return true;
                }
                return false;
            };

            let attempts = 0;
            const maxAttempts = timeout / 50;
            
            const interval = setInterval(() => {
                attempts++;
                if (checkFont() || attempts >= maxAttempts) {
                    clearInterval(interval);
                    if (attempts >= maxAttempts) {
                        document.body.removeChild(testElement);
                        reject(new Error('Font load timeout'));
                    }
                }
            }, 50);
        });
    }

    getFontUrl(fontFamily, weight, style) {
        const fontMap = {
            'Orbitron': {
                '400': 'fonts/orbitron-regular.woff2',
                '700': 'fonts/orbitron-bold.woff2',
                '900': 'fonts/orbitron-black.woff2'
            },
            'Noto Sans KR': {
                '100': 'fonts/noto-sans-kr-light.woff2',
                '300': 'fonts/noto-sans-kr-light.woff2',
                '400': 'fonts/noto-sans-kr-regular.woff2',
                '500': 'fonts/noto-sans-kr-regular.woff2',
                '700': 'fonts/noto-sans-kr-bold.woff2',
                '900': 'fonts/noto-sans-kr-bold.woff2'
            },
            'Space Grotesk': {
                '300': 'fonts/space-grotesk-light.woff2',
                '400': 'fonts/space-grotesk-regular.woff2',
                '500': 'fonts/space-grotesk-regular.woff2',
                '600': 'fonts/space-grotesk-bold.woff2',
                '700': 'fonts/space-grotesk-bold.woff2'
            }
        };

        const fontFiles = fontMap[fontFamily];
        if (!fontFiles) {
            throw new Error(`Font family ${fontFamily} not found`);
        }

        const fontUrl = fontFiles[weight] || fontFiles['400'];
        if (!fontUrl) {
            throw new Error(`Font weight ${weight} not found for ${fontFamily}`);
        }

        return fontUrl;
    }

    setupFontDisplay() {
        // Add font loading class to body
        document.body.classList.add('font-loading');
        
        // Create font preload element
        const preloadElement = document.createElement('div');
        preloadElement.className = 'font-preload';
        preloadElement.textContent = 'Loading fonts...';
        document.body.appendChild(preloadElement);
    }

    monitorFontLoading() {
        if (!('fonts' in document)) {
            return;
        }

        document.fonts.addEventListener('loadingdone', () => {
            this.onAllFontsLoaded();
        });

        document.fonts.addEventListener('loadingerror', (event) => {
            console.warn('Font loading error:', event);
        });

        // Monitor font loading status
        const checkFonts = () => {
            const loadedCount = this.loadedFonts.size;
            const totalCount = this.criticalFonts.length;
            
            if (loadedCount === totalCount) {
                this.onAllFontsLoaded();
            } else if (loadedCount > 0) {
                this.onPartialFontsLoaded(loadedCount, totalCount);
            }
        };

        // Check font status periodically
        const fontCheckInterval = setInterval(() => {
            checkFonts();
            if (this.loadedFonts.size === this.criticalFonts.length) {
                clearInterval(fontCheckInterval);
            }
        }, 100);

        // Timeout fallback
        setTimeout(() => {
            clearInterval(fontCheckInterval);
            if (this.loadedFonts.size === 0) {
                this.onFontsLoadError();
            } else {
                this.onPartialFontsLoaded(this.loadedFonts.size, this.criticalFonts.length);
            }
        }, 5000);
    }

    onFontLoaded(fontFamily, weight, style) {
        console.log(`Font loaded: ${fontFamily} ${weight} ${style}`);
        
        // Apply font to relevant elements
        this.applyFontToElements(fontFamily, weight, style);
        
        // Dispatch custom event
        window.dispatchEvent(new CustomEvent('fontLoaded', {
            detail: { fontFamily, weight, style }
        }));
    }

    onFontsLoaded() {
        console.log('All critical fonts loaded');
        this.onAllFontsLoaded();
    }

    onAllFontsLoaded() {
        // Remove loading class
        document.body.classList.remove('font-loading');
        document.body.classList.add('font-loaded');
        
        // Remove preload element
        const preloadElement = document.querySelector('.font-preload');
        if (preloadElement) {
            preloadElement.remove();
        }

        // Apply fonts to elements
        this.applyFontsToElements();
        
        // Dispatch event
        window.dispatchEvent(new CustomEvent('allFontsLoaded'));
        
        console.log('All fonts loaded successfully');
    }

    onPartialFontsLoaded(loaded, total) {
        console.log(`Partial fonts loaded: ${loaded}/${total}`);
        
        // Apply available fonts
        this.applyFontsToElements();
        
        // Dispatch event
        window.dispatchEvent(new CustomEvent('partialFontsLoaded', {
            detail: { loaded, total }
        }));
    }

    onFontLoadError(fontFamily, weight, style) {
        console.warn(`Font load error: ${fontFamily} ${weight} ${style}`);
        
        // Use fallback font
        this.applyFallbackFont(fontFamily);
    }

    onFontsLoadError() {
        console.warn('Font loading failed, using fallback fonts');
        
        // Remove loading class and apply fallbacks
        document.body.classList.remove('font-loading');
        document.body.classList.add('font-fallback');
        
        // Remove preload element
        const preloadElement = document.querySelector('.font-preload');
        if (preloadElement) {
            preloadElement.remove();
        }
        
        // Apply fallback fonts
        this.applyFallbackFonts();
        
        // Dispatch event
        window.dispatchEvent(new CustomEvent('fontLoadError'));
    }

    applyFontToElements(fontFamily, weight, style) {
        const elements = document.querySelectorAll(`[data-font-family="${fontFamily}"]`);
        elements.forEach(element => {
            element.style.fontFamily = fontFamily;
            element.style.fontWeight = weight;
            element.style.fontStyle = style;
        });
    }

    applyFontsToElements() {
        // Apply Orbitron to display elements
        const orbitronElements = document.querySelectorAll('.title-main, .logo-main, .section-title .title-main, .glitch-text');
        orbitronElements.forEach(element => {
            element.style.fontFamily = 'Orbitron, monospace';
            element.classList.add('orbitron-text');
        });

        // Apply Noto Sans KR to Korean text
        const koreanElements = document.querySelectorAll('body, p, .nav-link, .section-subtitle, .vision-card p, .timeline-content p');
        koreanElements.forEach(element => {
            element.style.fontFamily = 'Noto Sans KR, sans-serif';
            element.classList.add('noto-sans-kr-text');
        });

        // Apply Space Grotesk to English headings
        const spaceGroteskElements = document.querySelectorAll('.hologram-text, .neon-text, .vision-card h3, .timeline-content h3');
        spaceGroteskElements.forEach(element => {
            element.style.fontFamily = 'Space Grotesk, sans-serif';
            element.classList.add('space-grotesk-text');
        });
    }

    applyFallbackFont(fontFamily) {
        const fallbackMap = {
            'Orbitron': 'Courier New, monospace',
            'Noto Sans KR': 'Malgun Gothic, 맑은 고딕, sans-serif',
            'Space Grotesk': 'Helvetica Neue, Arial, sans-serif'
        };

        const fallback = fallbackMap[fontFamily];
        if (fallback) {
            const elements = document.querySelectorAll(`[data-font-family="${fontFamily}"]`);
            elements.forEach(element => {
                element.style.fontFamily = fallback;
            });
        }
    }

    applyFallbackFonts() {
        // Apply system fonts as fallbacks
        document.body.style.fontFamily = 'system-ui, -apple-system, sans-serif';
        
        const titleElements = document.querySelectorAll('.title-main, .logo-main');
        titleElements.forEach(element => {
            element.style.fontFamily = 'system-ui, -apple-system, monospace';
        });
    }

    // Public API methods
    async loadCustomFont(fontFamily, weight = '400', style = 'normal') {
        return await this.loadFont(fontFamily, weight, style);
    }

    isFontLoaded(fontFamily, weight = '400', style = 'normal') {
        const fontKey = `${fontFamily}-${weight}-${style}`;
        return this.loadedFonts.has(fontKey);
    }

    getFontLoadingStatus() {
        return {
            loaded: this.loadedFonts.size,
            total: this.criticalFonts.length,
            percentage: (this.loadedFonts.size / this.criticalFonts.length) * 100
        };
    }

    // Performance monitoring
    measureFontLoadTime(fontFamily) {
        const startTime = performance.now();
        
        return this.loadFont(fontFamily).then(() => {
            const endTime = performance.now();
            const loadTime = endTime - startTime;
            
            console.log(`Font ${fontFamily} loaded in ${loadTime.toFixed(2)}ms`);
            return loadTime;
        });
    }

    // Cleanup
    destroy() {
        this.loadedFonts.clear();
        this.fontPromises.clear();
        
        // Remove event listeners
        if ('fonts' in document) {
            document.fonts.removeEventListener('loadingdone', this.onAllFontsLoaded);
            document.fonts.removeEventListener('loadingerror', this.onFontsLoadError);
        }
        
        // Remove font preload element
        const preloadElement = document.querySelector('.font-preload');
        if (preloadElement) {
            preloadElement.remove();
        }
    }
}

// Auto-initialize if DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.fontLoader = new FontLoader();
    });
} else {
    window.fontLoader = new FontLoader();
}

// Export for use in other modules
window.FontLoader = FontLoader;