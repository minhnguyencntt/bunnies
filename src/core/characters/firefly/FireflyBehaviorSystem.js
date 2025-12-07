/**
 * FireflyBehaviorSystem - Natural movement behavior for fireflies
 * Slow, gentle movement with twinkling glow effects
 */

class FireflyBehaviorSystem {
    constructor(scene, fireflySprite, fireflyData) {
        this.scene = scene;
        this.firefly = fireflySprite;
        this.fireflyData = fireflyData;
        
        // Movement state
        this.currentTarget = null;
        this.movementSpeed = Phaser.Math.Between(15, 35); // Slow, gentle
        this.isPaused = false;
        this.spiralAngle = 0;
        this.spiralRadius = 0;
        this.spiralCenter = { x: 0, y: 0 };
        this.glowTimer = null;
        
        // Boundaries (garden area)
        this.bounds = {
            minX: 30,
            maxX: scene.cameras.main.width - 30,
            minY: 30,
            maxY: scene.cameras.main.height * 0.7
        };
        
        this.setupFirefly();
        this.startNaturalMovement();
    }

    setupFirefly() {
        // Set initial position
        this.firefly.x = Phaser.Math.Between(this.bounds.minX, this.bounds.maxX);
        this.firefly.y = Phaser.Math.Between(this.bounds.minY, this.bounds.maxY);
        
        // Set scale (small decorative elements)
        this.firefly.setScale(Phaser.Math.FloatBetween(0.8, 1.2));
        
        // Set depth (behind bunnies but above background)
        this.firefly.setDepth(45);
        
        // Play flying animation
        if (this.fireflyData.animKey && this.scene.anims.exists(this.fireflyData.animKey)) {
            this.firefly.play(this.fireflyData.animKey);
        } else {
            if (this.scene.textures.exists(this.fireflyData.spriteKey)) {
                this.firefly.setTexture(this.fireflyData.spriteKey, 0);
            }
        }
        
        // Start glow flickering
        this.startGlowFlicker();
    }

    startGlowFlicker() {
        // Random twinkling glow for fireflies
        const flicker = () => {
            const intensity = Phaser.Math.FloatBetween(0.6, 1.0);
            this.scene.tweens.add({
                targets: this.firefly,
                alpha: intensity,
                duration: Phaser.Math.Between(200, 800),
                ease: 'Sine.easeInOut',
                onComplete: () => {
                    this.glowTimer = this.scene.time.delayedCall(
                        Phaser.Math.Between(500, 2000),
                        flicker
                    );
                }
            });
        };
        
        this.glowTimer = this.scene.time.delayedCall(
            Phaser.Math.Between(500, 2000),
            flicker
        );
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
            this.firefly.x, this.firefly.y,
            targetX, targetY
        );
        
        const duration = (distance / this.movementSpeed) * 1000;
        
        this.scene.tweens.add({
            targets: this.firefly,
            x: targetX,
            y: targetY,
            duration: duration,
            ease: 'Sine.easeInOut',
            onComplete: () => {
                this.scene.time.delayedCall(Phaser.Math.Between(500, 1500), () => {
                    this.startNaturalMovement();
                });
            }
        });
        
        // Gentle vertical bobbing while drifting
        this.scene.tweens.add({
            targets: this.firefly,
            y: this.firefly.y + Phaser.Math.Between(-6, 6),
            duration: 2000,
            yoyo: true,
            repeat: Math.floor(duration / 2000),
            ease: 'Sine.easeInOut'
        });
    }

    startSpiraling() {
        this.spiralCenter = { x: this.firefly.x, y: this.firefly.y };
        this.spiralRadius = Phaser.Math.Between(20, 50);
        this.spiralAngle = 0;
        
        const spiralDuration = Phaser.Math.Between(2000, 4000);
        
        const updateSpiral = () => {
            this.spiralAngle += 0.05;
            const x = this.spiralCenter.x + Math.cos(this.spiralAngle) * this.spiralRadius;
            const y = this.spiralCenter.y + Math.sin(this.spiralAngle) * this.spiralRadius * 0.5;
            
            this.firefly.x = Phaser.Math.Clamp(x, this.bounds.minX, this.bounds.maxX);
            this.firefly.y = Phaser.Math.Clamp(y, this.bounds.minY, this.bounds.maxY);
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
        const floatDistance = Phaser.Math.Between(15, 35);
        const floatDuration = Phaser.Math.Between(2000, 4000);
        
        this.scene.tweens.add({
            targets: this.firefly,
            y: this.firefly.y - floatDistance,
            duration: floatDuration,
            yoyo: true,
            repeat: 1,
            ease: 'Sine.easeInOut',
            onComplete: () => {
                this.scene.tweens.add({
                    targets: this.firefly,
                    x: this.firefly.x + Phaser.Math.Between(-20, 20),
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
        
        const pauseDuration = Phaser.Math.Between(1500, 3000);
        
        // Very gentle movement while paused
        this.scene.tweens.add({
            targets: this.firefly,
            y: this.firefly.y - 2,
            duration: 1200,
            yoyo: true,
            repeat: Math.floor(pauseDuration / 1200),
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
        
        const startX = this.firefly.x;
        const startY = this.firefly.y;
        const distance = Phaser.Math.Distance.Between(startX, startY, targetX, targetY);
        const duration = (distance / this.movementSpeed) * 1000;
        
        this.scene.tweens.add({
            targets: this.firefly,
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
                
                this.firefly.x = x;
                this.firefly.y = y;
            },
            onComplete: () => {
                this.startNaturalMovement();
            }
        });
    }

    update(otherFireflies) {
        // Collision avoidance
        if (otherFireflies && otherFireflies.length > 0) {
            const minDistance = 30;
            
            otherFireflies.forEach(other => {
                if (other !== this.firefly && other.active) {
                    const distance = Phaser.Math.Distance.Between(
                        this.firefly.x, this.firefly.y,
                        other.x, other.y
                    );
                    
                    if (distance < minDistance) {
                        const angle = Phaser.Math.Angle.Between(
                            other.x, other.y,
                            this.firefly.x, this.firefly.y
                        );
                        
                        const avoidDistance = (minDistance - distance) * 0.5;
                        this.firefly.x += Math.cos(angle) * avoidDistance;
                        this.firefly.y += Math.sin(angle) * avoidDistance;
                        
                        this.firefly.x = Phaser.Math.Clamp(this.firefly.x, this.bounds.minX, this.bounds.maxX);
                        this.firefly.y = Phaser.Math.Clamp(this.firefly.y, this.bounds.minY, this.bounds.maxY);
                    }
                }
            });
        }
    }

    destroy() {
        if (this.glowTimer) {
            this.glowTimer.remove();
        }
        this.scene.tweens.killTweensOf(this.firefly);
    }
}

/**
 * Create firefly for menu screen
 */
function createMenuFirefly(scene, fireflyData) {
    const spriteKey = fireflyData.spriteKey;
    
    let firefly;
    try {
        if (scene.textures && scene.textures.exists(spriteKey)) {
            firefly = scene.add.sprite(0, 0, spriteKey, 0);
        } else {
            console.warn(`Firefly texture ${spriteKey} does not exist`);
            return null;
        }
    } catch (error) {
        console.warn(`Error creating firefly sprite:`, error);
        return null;
    }
    
    firefly.setOrigin(0.5);
    
    try {
        const behaviorSystem = new FireflyBehaviorSystem(scene, firefly, fireflyData);
        firefly.setData('behaviorSystem', behaviorSystem);
    } catch (error) {
        console.warn(`Error creating firefly behavior system:`, error);
    }
    
    return firefly;
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { FireflyBehaviorSystem, createMenuFirefly };
}

