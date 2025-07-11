// js/sections/hero.js
// Hero Section with Advanced Animations and Effects

class HeroSection {
    constructor() {
        this.heroElement = document.getElementById('hero');
        this.heroCanvas = document.getElementById('hero-canvas');
        this.typewriterElement = document.getElementById('typewriter-text');
        this.statCards = document.querySelectorAll('.stat-card');
        
        this.typewriterTexts = [
            'AI 로봇으로 미래를 설계합니다',
            'Intelligent Robots for Tomorrow',
            '스마트 로봇으로 문제를 해결합니다',
            'Creating AI Robot Future',
            'AI 로봇 혁신을 이끕니다'
        ];
        
        this.currentTextIndex = 0;
        this.isTyping = false;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.geometries = [];
    }

    init() {
        this.initializeTypewriter();
        this.initialize3DBackground();
        this.initializeStatCounters();
        this.initializeScrollIndicator();
        this.initializeParallax();
        this.initializeQuantumEffects();
        
        console.log('Hero Section initialized');
    }

    initializeTypewriter() {
        if (!this.typewriterElement) return;
        
        this.startTypewriterEffect();
    }

    async startTypewriterEffect() {
        while (true) {
            const text = this.typewriterTexts[this.currentTextIndex];
            
            // Type out text
            await this.typeText(text);
            await this.delay(2000); // Pause at end
            
            // Delete text
            await this.deleteText();
            await this.delay(500); // Pause before next text
            
            this.currentTextIndex = (this.currentTextIndex + 1) % this.typewriterTexts.length;
        }
    }

    async typeText(text) {
        this.isTyping = true;
        
        for (let i = 0; i <= text.length; i++) {
            this.typewriterElement.textContent = text.slice(0, i);
            await this.delay(50 + Math.random() * 50); // Variable typing speed
        }
        
        this.isTyping = false;
    }

    async deleteText() {
        const text = this.typewriterElement.textContent;
        
        for (let i = text.length; i >= 0; i--) {
            this.typewriterElement.textContent = text.slice(0, i);
            await this.delay(30); // Faster deletion
        }
    }

    initialize3DBackground() {
        if (!this.heroCanvas || !window.THREE) return;
        
        // Set up Three.js scene
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: this.heroCanvas,
            alpha: true,
            antialias: true
        });
        
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x000000, 0);
        
        this.create3DGeometries();
        this.setupLighting();
        this.startAnimation();
        
        // Handle resize
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    create3DGeometries() {
        // Create floating geometric shapes
        const geometryTypes = [
            () => new THREE.IcosahedronGeometry(1, 1),
            () => new THREE.OctahedronGeometry(1.2),
            () => new THREE.TetrahedronGeometry(1.5),
            () => new THREE.DodecahedronGeometry(0.8)
        ];
        
        for (let i = 0; i < 15; i++) {
            const geometryType = geometryTypes[Math.floor(Math.random() * geometryTypes.length)];
            const geometry = geometryType();
            
            const material = new THREE.MeshPhongMaterial({
                color: new THREE.Color().setHSL(0.3 + Math.random() * 0.3, 0.8, 0.6),
                transparent: true,
                opacity: 0.6,
                wireframe: Math.random() > 0.5
            });
            
            const mesh = new THREE.Mesh(geometry, material);
            
            // Random position
            mesh.position.x = (Math.random() - 0.5) * 50;
            mesh.position.y = (Math.random() - 0.5) * 30;
            mesh.position.z = (Math.random() - 0.5) * 30;
            
            // Random rotation speed
            mesh.rotationSpeed = {
                x: (Math.random() - 0.5) * 0.02,
                y: (Math.random() - 0.5) * 0.02,
                z: (Math.random() - 0.5) * 0.02
            };
            
            // Random floating speed
            mesh.floatSpeed = Math.random() * 0.01 + 0.005;
            mesh.floatAmplitude = Math.random() * 2 + 1;
            mesh.floatOffset = Math.random() * Math.PI * 2;
            
            this.scene.add(mesh);
            this.geometries.push(mesh);
        }
        
        this.camera.position.z = 15;
    }

    setupLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
        this.scene.add(ambientLight);
        
        // Directional light
        const directionalLight = new THREE.DirectionalLight(0x007bff, 1);
        directionalLight.position.set(1, 1, 1);
        this.scene.add(directionalLight);
        
        // Point lights for dynamic effects
        const pointLight1 = new THREE.PointLight(0x6c757d, 0.6, 50);
        pointLight1.position.set(10, 10, 10);
        this.scene.add(pointLight1);
        
        const pointLight2 = new THREE.PointLight(0x28a745, 0.6, 50);
        pointLight2.position.set(-10, -10, 10);
        this.scene.add(pointLight2);
    }

    startAnimation() {
        const animate = () => {
            requestAnimationFrame(animate);
            
            const time = Date.now() * 0.001;
            
            // Animate geometries
            this.geometries.forEach((mesh, index) => {
                // Rotation
                mesh.rotation.x += mesh.rotationSpeed.x;
                mesh.rotation.y += mesh.rotationSpeed.y;
                mesh.rotation.z += mesh.rotationSpeed.z;
                
                // Floating motion
                mesh.position.y += Math.sin(time * mesh.floatSpeed + mesh.floatOffset) * 0.01;
                
                // Quantum tunneling effect (occasional position jumps)
                if (Math.random() < 0.001) {
                    mesh.position.x += (Math.random() - 0.5) * 5;
                    mesh.position.z += (Math.random() - 0.5) * 5;
                }
            });
            
            // Camera movement
            this.camera.position.x = Math.sin(time * 0.2) * 2;
            this.camera.position.y = Math.cos(time * 0.15) * 1;
            this.camera.lookAt(0, 0, 0);
            
            this.renderer.render(this.scene, this.camera);
        };
        
        animate();
    }

    initializeStatCounters() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateStatCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        this.statCards.forEach(card => {
            observer.observe(card);
        });
    }

    animateStatCounter(card) {
        const counter = card.querySelector('.counter');
        if (!counter || counter.dataset.animated) return;
        
        const finalValue = counter.textContent;
        const isInfinity = finalValue === '∞';
        
        if (isInfinity) {
            this.animateInfinityCounter(counter);
            return;
        }
        
        const numericValue = parseInt(finalValue.replace(/\D/g, ''));
        const duration = 2000;
        const startTime = Date.now();
        
        counter.dataset.animated = 'true';
        
        const updateCounter = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentValue = Math.floor(numericValue * easeOutQuart);
            
            counter.textContent = currentValue;
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = finalValue;
                this.addQuantumGlow(counter);
            }
        };
        
        updateCounter();
    }

    animateInfinityCounter(counter) {
        counter.dataset.animated = 'true';
        
        const symbols = ['∞', '∝', '∞', '∝'];
        let symbolIndex = 0;
        
        const updateSymbol = () => {
            counter.textContent = symbols[symbolIndex];
            symbolIndex = (symbolIndex + 1) % symbols.length;
        };
        
        setInterval(updateSymbol, 1000);
        this.addQuantumGlow(counter);
    }

    addQuantumGlow(element) {
        element.style.textShadow = '0 0 20px rgba(0, 255, 136, 0.8)';
        element.style.animation = 'quantum-pulse 2s infinite';
    }

    initializeScrollIndicator() {
        const scrollIndicator = document.querySelector('.scroll-indicator');
        if (!scrollIndicator) return;
        
        // Hide indicator when scrolled
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            const opacity = Math.max(0, 1 - scrolled / 200);
            scrollIndicator.style.opacity = opacity;
        });
        
        // Click to scroll
        scrollIndicator.addEventListener('click', () => {
            const nextSection = document.getElementById('vision');
            if (nextSection) {
                nextSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    initializeParallax() {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            const heroContent = document.querySelector('.hero-content');
            
            if (heroContent) {
                const parallaxSpeed = 0.5;
                heroContent.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
            }
        });
    }

    initializeQuantumEffects() {
        // Quantum badge floating effect
        const badge = document.querySelector('.hero-badge');
        if (badge) {
            let floatDirection = 1;
            let floatAmount = 0;
            
            const floatBadge = () => {
                floatAmount += floatDirection * 0.2;
                if (Math.abs(floatAmount) > 10) {
                    floatDirection *= -1;
                }
                
                badge.style.transform = `translateY(${floatAmount}px)`;
                requestAnimationFrame(floatBadge);
            };
            
            floatBadge();
        }
        
        // Quantum ripples on CTA buttons
        const ctaButtons = document.querySelectorAll('.cta-primary, .cta-secondary');
        ctaButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.createQuantumRipple(e, button);
            });
        });
    }

    createQuantumRipple(event, element) {
        const ripple = document.createElement('span');
        ripple.className = 'quantum-ripple';
        
        const rect = element.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        
        element.appendChild(ripple);
        
        // Animate ripple
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
    }

    startAnimations() {
        // Start main hero animations when app is loaded
        if (window.gsap) {
            const tl = gsap.timeline();
            
            tl.from('.hero-badge', { opacity: 0, y: 50, duration: 1, ease: 'power2.out' })
              .from('.hero-title .title-line', { opacity: 0, y: 100, duration: 1, stagger: 0.2, ease: 'power2.out' }, '-=0.5')
              .from('.typewriter-container', { opacity: 0, duration: 1, ease: 'power2.out' }, '-=0.5')
              .from('.stat-card', { opacity: 0, y: 50, duration: 1, stagger: 0.1, ease: 'power2.out' }, '-=0.5')
              .from('.hero-cta .quantum-btn, .hero-cta .hologram-btn', { opacity: 0, scale: 0.8, duration: 1, stagger: 0.1, ease: 'back.out(1.7)' }, '-=0.3')
              .from('.scroll-indicator', { opacity: 0, y: 30, duration: 1, ease: 'power2.out' }, '-=0.5');
        }
    }

    // Utility methods
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Public methods
    triggerTypewriter() {
        if (!this.isTyping) {
            this.startTypewriterEffect();
        }
    }

    pauseAnimations() {
        if (this.renderer) {
            this.renderer.setAnimationLoop(null);
        }
    }

    resumeAnimations() {
        if (this.renderer) {
            this.startAnimation();
        }
    }
}

// Export for global use
window.HeroSection = HeroSection;