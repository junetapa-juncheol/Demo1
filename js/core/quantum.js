// js/core/quantum.js
// Quantum physics-inspired animation engine

class QuantumEngine {
    constructor() {
        this.particles = [];
        this.fields = [];
        this.canvas = null;
        this.ctx = null;
        this.animationId = null;
        this.isRunning = false;
        this.settings = {
            particleCount: 50,
            fieldStrength: 0.05,
            quantumTunneling: false,
            waveFunction: false,
            entanglement: false
        };
    }

    async init() {
        this.canvas = document.getElementById('bg-canvas');
        if (!this.canvas) {
            console.warn('Background canvas not found');
            return;
        }

        this.ctx = this.canvas.getContext('2d');
        
        this.setupCanvas();
        this.createParticles();
        this.createQuantumFields();
        this.bindEvents();
        
        console.log('Quantum Engine initialized');
    }

    setupCanvas() {
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // Set canvas styles
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '-1';
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        this.particles = [];
        
        for (let i = 0; i < this.settings.particleCount; i++) {
            this.particles.push(new QuantumParticle({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                mass: 0.5 + Math.random() * 1.5,
                charge: Math.random() > 0.5 ? 1 : -1,
                spin: Math.random() * Math.PI * 2,
                energy: Math.random() * 100,
                waveLength: 20 + Math.random() * 40
            }));
        }
    }

    createQuantumFields() {
        this.fields = [];
        
        // Create electromagnetic fields
        for (let i = 0; i < 5; i++) {
            this.fields.push(new QuantumField({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                strength: this.settings.fieldStrength * (0.5 + Math.random()),
                frequency: 0.01 + Math.random() * 0.02,
                type: 'electromagnetic'
            }));
        }
        
        // Create gravity wells
        this.fields.push(new QuantumField({
            x: this.canvas.width * 0.3,
            y: this.canvas.height * 0.4,
            strength: this.settings.fieldStrength * 2,
            frequency: 0.005,
            type: 'gravity'
        }));
        
        this.fields.push(new QuantumField({
            x: this.canvas.width * 0.7,
            y: this.canvas.height * 0.6,
            strength: this.settings.fieldStrength * 2,
            frequency: 0.005,
            type: 'gravity'
        }));
    }

    bindEvents() {
        // Mouse interaction creates quantum disturbance
        let mouseX = 0, mouseY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            this.createQuantumDisturbance(mouseX, mouseY);
        });
        
        // Touch events for mobile
        document.addEventListener('touchmove', (e) => {
            if (e.touches.length > 0) {
                const touch = e.touches[0];
                this.createQuantumDisturbance(touch.clientX, touch.clientY);
            }
        });
    }

    createQuantumDisturbance(x, y) {
        // Create temporary field at mouse/touch position
        const disturbance = new QuantumField({
            x: x,
            y: y,
            strength: this.settings.fieldStrength * 3,
            frequency: 0.05,
            type: 'disturbance',
            lifetime: 60 // frames
        });
        
        this.fields.push(disturbance);
        
        // Remove after lifetime
        setTimeout(() => {
            const index = this.fields.indexOf(disturbance);
            if (index > -1) {
                this.fields.splice(index, 1);
            }
        }, disturbance.lifetime * 16); // 60fps
    }

    start() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.animate();
    }

    stop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        this.isRunning = false;
    }

    animate() {
        if (!this.isRunning) return;
        
        this.update();
        this.render();
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    update() {
        // Update quantum fields
        this.fields.forEach(field => field.update());
        
        // Update particles with quantum mechanics
        this.particles.forEach(particle => {
            this.updateParticleQuantumState(particle);
            particle.update();
            
            // Apply boundary conditions with quantum tunneling
            this.applyBoundaryConditions(particle);
        });
        
        // Handle quantum entanglement
        if (this.settings.entanglement) {
            this.updateQuantumEntanglement();
        }
    }

    updateParticleQuantumState(particle) {
        // Reset forces
        particle.fx = 0;
        particle.fy = 0;
        
        // Apply field forces
        this.fields.forEach(field => {
            const force = field.getForceAt(particle.x, particle.y);
            particle.fx += force.x * particle.charge;
            particle.fy += force.y * particle.charge;
        });
        
        // Quantum wave function behavior
        if (this.settings.waveFunction) {
            const waveInfluence = this.calculateWaveFunction(particle);
            particle.fx += waveInfluence.x;
            particle.fy += waveInfluence.y;
        }
        
        // Quantum uncertainty principle
        const uncertainty = this.calculateUncertainty(particle);
        particle.fx += uncertainty.x;
        particle.fy += uncertainty.y;
    }

    calculateWaveFunction(particle) {
        const time = Date.now() * 0.001;
        const waveX = Math.sin(time * particle.frequency + particle.phase) * particle.amplitude;
        const waveY = Math.cos(time * particle.frequency + particle.phase) * particle.amplitude;
        
        return {
            x: waveX * 0.1,
            y: waveY * 0.1
        };
    }

    calculateUncertainty(particle) {
        // Heisenberg uncertainty principle simulation
        const uncertaintyX = (Math.random() - 0.5) * 0.5;
        const uncertaintyY = (Math.random() - 0.5) * 0.5;
        
        return {
            x: uncertaintyX,
            y: uncertaintyY
        };
    }

    applyBoundaryConditions(particle) {
        const margin = 50;
        
        // Quantum tunneling probability
        if (this.settings.quantumTunneling) {
            const tunnelingProbability = 0.01; // 1% chance
            
            if (particle.x < -margin && Math.random() < tunnelingProbability) {
                particle.x = this.canvas.width + margin;
            } else if (particle.x > this.canvas.width + margin && Math.random() < tunnelingProbability) {
                particle.x = -margin;
            }
            
            if (particle.y < -margin && Math.random() < tunnelingProbability) {
                particle.y = this.canvas.height + margin;
            } else if (particle.y > this.canvas.height + margin && Math.random() < tunnelingProbability) {
                particle.y = -margin;
            }
        }
        
        // Regular boundary wrapping
        if (particle.x < -margin) particle.x = this.canvas.width + margin;
        if (particle.x > this.canvas.width + margin) particle.x = -margin;
        if (particle.y < -margin) particle.y = this.canvas.height + margin;
        if (particle.y > this.canvas.height + margin) particle.y = -margin;
    }

    updateQuantumEntanglement() {
        // Create entangled pairs
        for (let i = 0; i < this.particles.length; i += 2) {
            const particle1 = this.particles[i];
            const particle2 = this.particles[i + 1];
            
            if (particle2) {
                // Entangled particles affect each other's spin
                const spinCorrelation = Math.sin(particle1.spin) * Math.cos(particle2.spin);
                particle1.spin += spinCorrelation * 0.01;
                particle2.spin -= spinCorrelation * 0.01;
                
                // Entangled energy states
                const energyDifference = particle1.energy - particle2.energy;
                particle1.energy -= energyDifference * 0.001;
                particle2.energy += energyDifference * 0.001;
            }
        }
    }

    render() {
        // Clear canvas with light fade effect
        this.ctx.fillStyle = 'rgba(248, 249, 250, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Render quantum fields
        this.renderQuantumFields();
        
        // Render particles
        this.renderParticles();
        
        // Render quantum connections
        this.renderQuantumConnections();
    }

    renderQuantumFields() {
        this.fields.forEach(field => {
            if (field.type === 'electromagnetic') {
                this.renderElectromagneticField(field);
            } else if (field.type === 'gravity') {
                this.renderGravityField(field);
            }
        });
    }

    renderElectromagneticField(field) {
        const gradient = this.ctx.createRadialGradient(
            field.x, field.y, 0,
            field.x, field.y, field.radius
        );
        
        gradient.addColorStop(0, `rgba(0, 123, 255, ${field.strength * 0.2})`);
        gradient.addColorStop(1, 'rgba(0, 123, 255, 0)');
        
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(field.x, field.y, field.radius, 0, Math.PI * 2);
        this.ctx.fill();
    }

    renderGravityField(field) {
        const gradient = this.ctx.createRadialGradient(
            field.x, field.y, 0,
            field.x, field.y, field.radius
        );
        
        gradient.addColorStop(0, `rgba(255, 107, 53, ${field.strength * 0.2})`);
        gradient.addColorStop(1, 'rgba(255, 107, 53, 0)');
        
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(field.x, field.y, field.radius, 0, Math.PI * 2);
        this.ctx.fill();
    }

    renderParticles() {
        this.particles.forEach(particle => {
            this.ctx.save();
            
            // Particle wave function visualization
            if (this.settings.waveFunction) {
                this.renderWaveFunction(particle);
            }
            
            // Particle core
            this.ctx.translate(particle.x, particle.y);
            this.ctx.rotate(particle.spin);
            
            const alpha = Math.min(0.8, particle.energy / 100);
            const color = particle.charge > 0 ? '0, 123, 255' : '108, 117, 125';
            
            this.ctx.fillStyle = `rgba(${color}, ${alpha})`;
            this.ctx.beginPath();
            this.ctx.arc(0, 0, particle.radius, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Particle glow
            const glowGradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, particle.radius * 3);
            glowGradient.addColorStop(0, `rgba(${color}, ${alpha * 0.5})`);
            glowGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            
            this.ctx.fillStyle = glowGradient;
            this.ctx.beginPath();
            this.ctx.arc(0, 0, particle.radius * 3, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.restore();
        });
    }

    renderWaveFunction(particle) {
        const time = Date.now() * 0.001;
        const waves = 3;
        
        for (let i = 0; i < waves; i++) {
            const waveRadius = particle.waveLength * (i + 1);
            const alpha = 0.3 / (i + 1);
            const phase = time * particle.frequency + particle.phase + (i * Math.PI / 2);
            const intensity = Math.sin(phase) * alpha;
            
            if (intensity > 0) {
                this.ctx.strokeStyle = `rgba(0, 123, 255, ${intensity})`;
                this.ctx.lineWidth = 1;
                this.ctx.beginPath();
                this.ctx.arc(particle.x, particle.y, waveRadius, 0, Math.PI * 2);
                this.ctx.stroke();
            }
        }
    }

    renderQuantumConnections() {
        if (!this.settings.entanglement) return;
        
        // Render entangled particle connections
        for (let i = 0; i < this.particles.length; i += 2) {
            const particle1 = this.particles[i];
            const particle2 = this.particles[i + 1];
            
            if (particle2) {
                const distance = Math.hypot(particle2.x - particle1.x, particle2.y - particle1.y);
                const maxDistance = 200;
                
                if (distance < maxDistance) {
                    const alpha = (1 - distance / maxDistance) * 0.3;
                    
                    this.ctx.strokeStyle = `rgba(0, 123, 255, ${alpha})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.beginPath();
                    this.ctx.moveTo(particle1.x, particle1.y);
                    this.ctx.lineTo(particle2.x, particle2.y);
                    this.ctx.stroke();
                }
            }
        }
    }

    destroy() {
        this.stop();
        this.particles = [];
        this.fields = [];
        
        if (this.canvas) {
            this.canvas.remove();
        }
    }
}

// Quantum Particle Class
class QuantumParticle {
    constructor(options = {}) {
        this.x = options.x || 0;
        this.y = options.y || 0;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
        this.fx = 0;
        this.fy = 0;
        
        this.mass = options.mass || 1;
        this.charge = options.charge || 1;
        this.spin = options.spin || 0;
        this.energy = options.energy || 50;
        this.radius = Math.sqrt(this.mass) * 2;
        
        // Wave properties
        this.waveLength = options.waveLength || 30;
        this.frequency = 0.01 + Math.random() * 0.02;
        this.phase = Math.random() * Math.PI * 2;
        this.amplitude = this.energy * 0.01;
        
        // Quantum properties
        this.quantumState = Math.random();
        this.uncertainty = 0.1;
    }

    update() {
        // Apply forces
        this.vx += this.fx / this.mass;
        this.vy += this.fy / this.mass;
        
        // Apply quantum uncertainty
        this.vx += (Math.random() - 0.5) * this.uncertainty;
        this.vy += (Math.random() - 0.5) * this.uncertainty;
        
        // Damping
        this.vx *= 0.999;
        this.vy *= 0.999;
        
        // Update position
        this.x += this.vx;
        this.y += this.vy;
        
        // Update quantum properties
        this.spin += this.vx * 0.01;
        this.energy = Math.max(1, this.energy - 0.01);
        this.quantumState = (this.quantumState + 0.01) % 1;
    }
}

// Quantum Field Class
class QuantumField {
    constructor(options = {}) {
        this.x = options.x || 0;
        this.y = options.y || 0;
        this.strength = options.strength || 1;
        this.frequency = options.frequency || 0.01;
        this.type = options.type || 'electromagnetic';
        this.radius = 100 + Math.random() * 100;
        this.phase = Math.random() * Math.PI * 2;
        this.lifetime = options.lifetime || Infinity;
        this.age = 0;
    }

    update() {
        this.phase += this.frequency;
        this.age++;
        
        // Pulsating field strength
        const pulse = Math.sin(this.phase) * 0.5 + 0.5;
        this.currentStrength = this.strength * pulse;
        
        // Field decay for temporary fields
        if (this.lifetime !== Infinity) {
            this.currentStrength *= (1 - this.age / this.lifetime);
        }
    }

    getForceAt(x, y) {
        const dx = x - this.x;
        const dy = y - this.y;
        const distance = Math.hypot(dx, dy);
        
        if (distance === 0 || distance > this.radius) {
            return { x: 0, y: 0 };
        }
        
        const normalizedDistance = distance / this.radius;
        let forceMagnitude;
        
        if (this.type === 'gravity') {
            // Inverse square law for gravity
            forceMagnitude = this.currentStrength / (normalizedDistance * normalizedDistance + 0.1);
            // Attractive force (toward center)
            return {
                x: -dx * forceMagnitude / distance,
                y: -dy * forceMagnitude / distance
            };
        } else {
            // Electromagnetic field
            forceMagnitude = this.currentStrength * (1 - normalizedDistance);
            // Can be attractive or repulsive
            const direction = Math.sin(this.phase) > 0 ? 1 : -1;
            return {
                x: dx * forceMagnitude * direction / distance,
                y: dy * forceMagnitude * direction / distance
            };
        }
    }
}

// Export for use in other modules
window.QuantumEngine = QuantumEngine;