/**
 * MagicParticleBehaviorSystem - Natural movement behavior for magic particles
 * Very slow, gentle drifting with magical effects
 */

class MagicParticleBehaviorSystem {
    constructor(scene, particleSprite, particleData) {
        this.scene = scene;
        this.particle = particleSprite;
        this.particleData = particleData;
        
        // Movement state
        this.currentTarget = null;
        this.movementSpeed = Phaser.Math.Between(10, 25); // Very slow, drifting
        this.isPaused = false;
        this.spiralAngle = 0;
        this.spiralRadius = 0;
        this.spiralCenter = { x: 0, y: 0 };
        
        // Boundaries (garden area)
        this.bounds = {
            minX: 20,
            maxX: scene.cameras.main.width - 20,
            minY: 20,
            maxY: scene.cameras.main.height * 0.7
        };
        
        this.setupParticle();
        this.startNaturalMovement();
    }

    setupParticle() {
        // Set initial position
        this.particle.x = Phaser.Math.Between(this.bounds.minX, this.bounds.maxX);
        this.particle.y = Phaser.Math.Between(this.bounds.minY, this.bounds.maxY);
        
        // Set scale (small decorative elements)
        this.particle.setScale(Phaser.Math.FloatBetween(0.6, 1.0));
        
        // Set depth
        this.particle.setDepth(40);
        
        // Play animation
        if (this.particleData.animKey && this.scene.anims.exists(this.particleData.animKey)) {
            this.particle.play(this.particleData.animKey);
        } else {
            if (this.scene.textures.exists(this.particleData.spriteKey)) {
                this.particle.setTexture(this.particleData.spriteKey, 0);
            }
        }
        
        // Random initial rotation
        this.particle.setAngle(Phaser.Math.Between(0, 360));
        
        // Continuous gentle rotation
        this.scene.tweens.add({
            targets: this.particle,
            angle: this.particle.angle + 360,
            duration: Phaser.Math.Between(5000, 10000),
            repeat: -1,
            ease: 'Linear'
        });
    }

    startNaturalMovement() {
        const pattern = Phaser.Math.Between(0, 4);
        
        switch(pattern) {
            case 0:
                this.startDrifting();
                break;
            case 1:
                this.startSpiraling();
                break;
            case 2:
                this.startFloating();
                break;
            case 3:
                this.startPause();
                break;
            case 4:
                this.startCurvedPath();
                break;
        }
    }

    startDrifting() {
        const targetX = Phaser.Math.Between(this.bounds.minX, this.bounds.maxX);
        const targetY = Phaser.Math.Between(this.bounds.minY, this.bounds.maxY);
        
        const distance = Phaser.Math.Distance.Between(
            this.particle.x, this.particle.y,
            targetX, targetY
        );
        
        const duration = (distance / this.movementSpeed) * 1000;
        
        this.scene.tweens.add({
            targets: this.particle,
            x: targetX,
            y: targetY,
            duration: duration,
            ease: 'Sine.easeInOut',
            onComplete: () => {
                this.scene.time.delayedCall(Phaser.Math.Between(1000, 2000), () => {
                    this.startNaturalMovement();
                });
            }
        });
        
        // Very gentle vertical floating
        this.scene.tweens.add({
            targets: this.particle,
            y: this.particle.y + Phaser.Math.Between(-5, 5),
            duration: 3000,
            yoyo: true,
            repeat: Math.floor(duration / 3000),
            ease: 'Sine.easeInOut'
        });
        
        // Gentle scale pulsing
        this.scene.tweens.add({
            targets: this.particle,
            scaleX: this.particle.scaleX * 1.1,
            scaleY: this.particle.scaleY * 1.1,
            duration: 2000,
            yoyo: true,
            repeat: Math.floor(duration / 2000),
            ease: 'Sine.easeInOut'
        });
    }

    startSpiraling() {
        this.spiralCenter = { x: this.particle.x, y: this.particle.y };
        this.spiralRadius = Phaser.Math.Between(15, 40);
        this.spiralAngle = 0;
        
        const spiralDuration = Phaser.Math.Between(4000, 8000);
        
        const updateSpiral = () => {
            this.spiralAngle += 0.03; // Slower spiral for particles
            const x = this.spiralCenter.x + Math.cos(this.spiralAngle) * this.spiralRadius;
            const y = this.spiralCenter.y + Math.sin(this.spiralAngle) * this.spiralRadius * 0.5;
            
            this.particle.x = Phaser.Math.Clamp(x, this.bounds.minX, this.bounds.maxX);
            this.particle.y = Phaser.Math.Clamp(y, this.bounds.minY, this.bounds.maxY);
        };
        
        const spiralTimer = this.scene.time.addEvent({
            delay: 16,
            callback: updateSpiral,
            repeat: Math.floor(spiralDuration / 16)
        });
        
        this.scene.time.delayedCall(spiralDuration, () => {
            spiralTimer.remove();
            this.startNaturalMovement();
        });
    }

    startFloating() {
        const floatDistance = Phaser.Math.Between(10, 30);
        const floatDuration = Phaser.Math.Between(3000, 6000);
        
        this.scene.tweens.add({
            targets: this.particle,
            y: this.particle.y - floatDistance,
            duration: floatDuration,
            yoyo: true,
            repeat: 1,
            ease: 'Sine.easeInOut',
            onComplete: () => {
                this.scene.tweens.add({
                    targets: this.particle,
                    x: this.particle.x + Phaser.Math.Between(-15, 15),
                    duration: floatDuration,
                    ease: 'Sine.easeInOut',
                    onComplete: () => {
                        this.startNaturalMovement();
                    }
                });
            }
        });
    }

    startPause() {
        this.isPaused = true;
        
        const pauseDuration = Phaser.Math.Between(2000, 4000);
        
        // Very gentle pulsing while paused
        this.scene.tweens.add({
            targets: this.particle,
            alpha: 0.7,
            scaleX: this.particle.scaleX * 1.15,
            scaleY: this.particle.scaleY * 1.15,
            duration: 1500,
            yoyo: true,
            repeat: Math.floor(pauseDuration / 1500),
            ease: 'Sine.easeInOut',
            onComplete: () => {
                this.isPaused = false;
                this.startNaturalMovement();
            }
        });
    }

    startCurvedPath() {
        const controlX = Phaser.Math.Between(this.bounds.minX, this.bounds.maxX);
        const controlY = Phaser.Math.Between(this.bounds.minY, this.bounds.maxY);
        const targetX = Phaser.Math.Between(this.bounds.minX, this.bounds.maxX);
        const targetY = Phaser.Math.Between(this.bounds.minY, this.bounds.maxY);
        
        const startX = this.particle.x;
        const startY = this.particle.y;
        const distance = Phaser.Math.Distance.Between(startX, startY, targetX, targetY);
        const duration = (distance / this.movementSpeed) * 1000;
        
        this.scene.tweens.add({
            targets: this.particle,
            x: targetX,
            y: targetY,
            duration: duration,
            ease: 'Sine.easeInOut',
            onUpdate: (tween) => {
                const progress = tween.progress;
                const t = progress;
                const oneMinusT = 1 - t;
                
                // Quadratic bezier curve
                const x = oneMinusT * oneMinusT * startX + 2 * oneMinusT * t * controlX + t * t * targetX;
                const y = oneMinusT * oneMinusT * startY + 2 * oneMinusT * t * controlY + t * t * targetY;
                
                this.particle.x = x;
                this.particle.y = y;
            },
            onComplete: () => {
                this.startNaturalMovement();
            }
        });
    }

    update(otherParticles) {
        // Collision avoidance
        if (otherParticles && otherParticles.length > 0) {
            const minDistance = 20;
            
            otherParticles.forEach(other => {
                if (other !== this.particle && other.active) {
                    const distance = Phaser.Math.Distance.Between(
                        this.particle.x, this.particle.y,
                        other.x, other.y
                    );
                    
                    if (distance < minDistance) {
                        const angle = Phaser.Math.Angle.Between(
                            other.x, other.y,
                            this.particle.x, this.particle.y
                        );
                        
                        const avoidDistance = (minDistance - distance) * 0.5;
                        this.particle.x += Math.cos(angle) * avoidDistance;
                        this.particle.y += Math.sin(angle) * avoidDistance;
                        
                        this.particle.x = Phaser.Math.Clamp(this.particle.x, this.bounds.minX, this.bounds.maxX);
                        this.particle.y = Phaser.Math.Clamp(this.particle.y, this.bounds.minY, this.bounds.maxY);
                    }
                }
            });
        }
    }

    destroy() {
        this.scene.tweens.killTweensOf(this.particle);
    }
}

/**
 * Create magic particle for menu screen
 */
function createMenuMagicParticle(scene, particleData) {
    const spriteKey = particleData.spriteKey;
    
    let particle;
    try {
        if (scene.textures && scene.textures.exists(spriteKey)) {
            particle = scene.add.sprite(0, 0, spriteKey, 0);
        } else {
            console.warn(`Particle texture ${spriteKey} does not exist`);
            return null;
        }
    } catch (error) {
        console.warn(`Error creating particle sprite:`, error);
        return null;
    }
    
    particle.setOrigin(0.5);
    
    try {
        const behaviorSystem = new MagicParticleBehaviorSystem(scene, particle, particleData);
        particle.setData('behaviorSystem', behaviorSystem);
    } catch (error) {
        console.warn(`Error creating particle behavior system:`, error);
    }
    
    return particle;
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MagicParticleBehaviorSystem, createMenuMagicParticle };
}

