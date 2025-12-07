/**
 * ButterflyBehaviorSystem - Natural movement behavior for decorative butterflies
 * Creates magical, organic flight patterns for menu screen
 */

class ButterflyBehaviorSystem {
    constructor(scene, butterflySprite, butterflyData) {
        this.scene = scene;
        this.butterfly = butterflySprite;
        this.butterflyData = butterflyData;
        
        // Movement state
        this.currentTarget = null;
        this.movementSpeed = Phaser.Math.Between(20, 50); // Pixels per second
        this.isPaused = false;
        this.spiralAngle = 0;
        this.spiralRadius = 0;
        this.spiralCenter = { x: 0, y: 0 };
        
        // Boundaries (garden area)
        this.bounds = {
            minX: 50,
            maxX: scene.cameras.main.width - 50,
            minY: 50,
            maxY: scene.cameras.main.height * 0.7 // Upper 70% of screen
        };
        
        // Initialize
        this.setupButterfly();
        this.startNaturalMovement();
    }

    setupButterfly() {
        // Set initial position within bounds
        this.butterfly.x = Phaser.Math.Between(this.bounds.minX, this.bounds.maxX);
        this.butterfly.y = Phaser.Math.Between(this.bounds.minY, this.bounds.maxY);
        
        // Set scale (butterflies are small decorative elements)
        this.butterfly.setScale(Phaser.Math.FloatBetween(0.6, 1.0));
        
        // Set depth (behind bunnies but above background)
        this.butterfly.setDepth(50);
        
        // Play flying animation
        if (this.butterflyData.animKey && this.scene.anims.exists(this.butterflyData.animKey)) {
            this.butterfly.play(this.butterflyData.animKey);
        } else {
            // Fallback: set texture
            if (this.scene.textures.exists(this.butterflyData.spriteKey)) {
                this.butterfly.setTexture(this.butterflyData.spriteKey, 0);
            }
        }
        
        // Random initial rotation
        this.butterfly.setAngle(Phaser.Math.Between(-15, 15));
    }

    startNaturalMovement() {
        // Choose random movement pattern
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

    /**
     * Drifting: Random left-right movement with vertical floating
     */
    startDrifting() {
        const targetX = Phaser.Math.Between(this.bounds.minX, this.bounds.maxX);
        const targetY = Phaser.Math.Between(this.bounds.minY, this.bounds.maxY);
        
        const distance = Phaser.Math.Distance.Between(
            this.butterfly.x, this.butterfly.y,
            targetX, targetY
        );
        
        const duration = (distance / this.movementSpeed) * 1000;
        
        this.scene.tweens.add({
            targets: this.butterfly,
            x: targetX,
            y: targetY,
            duration: duration,
            ease: 'Sine.easeInOut',
            onComplete: () => {
                // Slight rotation during movement
                this.butterfly.setAngle(Phaser.Math.Between(-10, 10));
                // Continue with new movement
                this.scene.time.delayedCall(Phaser.Math.Between(500, 1500), () => {
                    this.startNaturalMovement();
                });
            }
        });
        
        // Gentle vertical bobbing while drifting
        this.scene.tweens.add({
            targets: this.butterfly,
            y: this.butterfly.y + Phaser.Math.Between(-10, 10),
            duration: 2000,
            yoyo: true,
            repeat: Math.floor(duration / 2000),
            ease: 'Sine.easeInOut'
        });
    }

    /**
     * Spiraling: Circular motion
     */
    startSpiraling() {
        this.spiralCenter = { x: this.butterfly.x, y: this.butterfly.y };
        this.spiralRadius = Phaser.Math.Between(30, 80);
        this.spiralAngle = 0;
        
        const spiralDuration = Phaser.Math.Between(3000, 6000);
        const spiralTurns = Phaser.Math.Between(1, 3);
        
        const updateSpiral = () => {
            this.spiralAngle += 0.05;
            const x = this.spiralCenter.x + Math.cos(this.spiralAngle) * this.spiralRadius;
            const y = this.spiralCenter.y + Math.sin(this.spiralAngle) * this.spiralRadius * 0.5; // Flattened spiral
            
            // Keep within bounds
            const clampedX = Phaser.Math.Clamp(x, this.bounds.minX, this.bounds.maxX);
            const clampedY = Phaser.Math.Clamp(y, this.bounds.minY, this.bounds.maxY);
            
            this.butterfly.x = clampedX;
            this.butterfly.y = clampedY;
            
            // Rotate butterfly to face direction
            this.butterfly.setAngle(this.spiralAngle * 57.3 + 90); // Convert to degrees
        };
        
        const spiralTimer = this.scene.time.addEvent({
            delay: 16, // ~60fps
            callback: updateSpiral,
            repeat: Math.floor(spiralDuration / 16)
        });
        
        this.scene.time.delayedCall(spiralDuration, () => {
            spiralTimer.remove();
            this.startNaturalMovement();
        });
    }

    /**
     * Floating: Gentle up and down movement
     */
    startFloating() {
        const floatDistance = Phaser.Math.Between(20, 50);
        const floatDuration = Phaser.Math.Between(2000, 4000);
        
        this.scene.tweens.add({
            targets: this.butterfly,
            y: this.butterfly.y - floatDistance,
            duration: floatDuration,
            yoyo: true,
            repeat: 1,
            ease: 'Sine.easeInOut',
            onComplete: () => {
                // Slight horizontal drift while floating
                this.scene.tweens.add({
                    targets: this.butterfly,
                    x: this.butterfly.x + Phaser.Math.Between(-30, 30),
                    duration: floatDuration,
                    ease: 'Sine.easeInOut',
                    onComplete: () => {
                        this.startNaturalMovement();
                    }
                });
            }
        });
    }

    /**
     * Pause: Hover in place with gentle flapping
     */
    startPause() {
        this.isPaused = true;
        
        // Very gentle movement while paused
        this.scene.tweens.add({
            targets: this.butterfly,
            y: this.butterfly.y - 5,
            duration: 1500,
            yoyo: true,
            repeat: 2,
            ease: 'Sine.easeInOut',
            onComplete: () => {
                this.isPaused = false;
                this.startNaturalMovement();
            }
        });
    }

    /**
     * Curved path: Smooth curved movement
     */
    startCurvedPath() {
        const controlX = Phaser.Math.Between(this.bounds.minX, this.bounds.maxX);
        const controlY = Phaser.Math.Between(this.bounds.minY, this.bounds.maxY);
        const targetX = Phaser.Math.Between(this.bounds.minX, this.bounds.maxX);
        const targetY = Phaser.Math.Between(this.bounds.minY, this.bounds.maxY);
        
        // Create curved path using bezier-like movement
        const startX = this.butterfly.x;
        const startY = this.butterfly.y;
        const distance = Phaser.Math.Distance.Between(startX, startY, targetX, targetY);
        const duration = (distance / this.movementSpeed) * 1000;
        
        // Use quadratic bezier curve for smooth movement
        this.scene.tweens.add({
            targets: this.butterfly,
            x: targetX,
            y: targetY,
            duration: duration,
            ease: 'Sine.easeInOut',
            onUpdate: (tween) => {
                // Calculate position along quadratic bezier curve
                const progress = tween.progress;
                const t = progress;
                const oneMinusT = 1 - t;
                
                // Quadratic bezier: (1-t)²P₀ + 2(1-t)tP₁ + t²P₂
                const x = oneMinusT * oneMinusT * startX + 2 * oneMinusT * t * controlX + t * t * targetX;
                const y = oneMinusT * oneMinusT * startY + 2 * oneMinusT * t * controlY + t * t * targetY;
                
                this.butterfly.x = x;
                this.butterfly.y = y;
            },
            onComplete: () => {
                this.startNaturalMovement();
            }
        });
    }

    /**
     * Update method (called each frame for collision avoidance)
     */
    update(otherButterflies) {
        // Simple collision avoidance - move away if too close
        if (otherButterflies && otherButterflies.length > 0) {
            const minDistance = 40;
            
            otherButterflies.forEach(other => {
                if (other !== this.butterfly && other.active) {
                    const distance = Phaser.Math.Distance.Between(
                        this.butterfly.x, this.butterfly.y,
                        other.x, other.y
                    );
                    
                    if (distance < minDistance) {
                        // Move away slightly
                        const angle = Phaser.Math.Angle.Between(
                            other.x, other.y,
                            this.butterfly.x, this.butterfly.y
                        );
                        
                        const avoidDistance = (minDistance - distance) * 0.5;
                        this.butterfly.x += Math.cos(angle) * avoidDistance;
                        this.butterfly.y += Math.sin(angle) * avoidDistance;
                        
                        // Clamp to bounds
                        this.butterfly.x = Phaser.Math.Clamp(this.butterfly.x, this.bounds.minX, this.bounds.maxX);
                        this.butterfly.y = Phaser.Math.Clamp(this.butterfly.y, this.bounds.minY, this.bounds.maxY);
                    }
                }
            });
        }
    }

    /**
     * Cleanup
     */
    destroy() {
        this.scene.tweens.killTweensOf(this.butterfly);
    }
}

/**
 * Create animated butterfly for menu screen
 */
function createMenuButterfly(scene, butterflyData) {
    const spriteKey = butterflyData.spriteKey;
    
    // Create sprite
    let butterfly;
    try {
        if (scene.textures && scene.textures.exists(spriteKey)) {
            butterfly = scene.add.sprite(0, 0, spriteKey, 0);
        } else {
            console.warn(`Butterfly texture ${spriteKey} does not exist`);
            return null;
        }
    } catch (error) {
        console.warn(`Error creating butterfly sprite:`, error);
        return null;
    }
    
    // Set properties
    butterfly.setOrigin(0.5);
    
    // Create behavior system
    try {
        const behaviorSystem = new ButterflyBehaviorSystem(scene, butterfly, butterflyData);
        butterfly.setData('behaviorSystem', behaviorSystem);
    } catch (error) {
        console.warn(`Error creating butterfly behavior system:`, error);
    }
    
    return butterfly;
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ButterflyBehaviorSystem, createMenuButterfly };
}

