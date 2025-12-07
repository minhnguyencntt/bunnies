/**
 * BirdBehaviorSystem - Natural movement behavior for birds
 * Medium-fast movement with wing flapping
 */

class BirdBehaviorSystem {
    constructor(scene, birdSprite, birdData) {
        this.scene = scene;
        this.bird = birdSprite;
        this.birdData = birdData;
        
        // Movement state
        this.currentTarget = null;
        this.movementSpeed = Phaser.Math.Between(40, 80); // Medium-fast
        this.isPaused = false;
        this.spiralAngle = 0;
        this.spiralRadius = 0;
        this.spiralCenter = { x: 0, y: 0 };
        
        // Boundaries (garden area)
        this.bounds = {
            minX: 40,
            maxX: scene.cameras.main.width - 40,
            minY: 40,
            maxY: scene.cameras.main.height * 0.6 // Birds fly higher
        };
        
        this.setupBird();
        this.startNaturalMovement();
    }

    setupBird() {
        // Set initial position
        this.bird.x = Phaser.Math.Between(this.bounds.minX, this.bounds.maxX);
        this.bird.y = Phaser.Math.Between(this.bounds.minY, this.bounds.maxY);
        
        // Set scale
        this.bird.setScale(Phaser.Math.FloatBetween(0.7, 1.0));
        
        // Set depth
        this.bird.setDepth(45);
        
        // Play flying animation
        if (this.birdData.animKey && this.scene.anims.exists(this.birdData.animKey)) {
            this.bird.play(this.birdData.animKey);
        } else {
            if (this.scene.textures.exists(this.birdData.spriteKey)) {
                this.bird.setTexture(this.birdData.spriteKey, 0);
            }
        }
        
        // Random initial rotation
        this.bird.setAngle(Phaser.Math.Between(-10, 10));
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
            this.bird.x, this.bird.y,
            targetX, targetY
        );
        
        const duration = (distance / this.movementSpeed) * 1000;
        
        // Calculate angle for bird to face direction
        const angle = Phaser.Math.Angle.Between(this.bird.x, this.bird.y, targetX, targetY);
        this.bird.setAngle(angle * 57.3 + 90); // Convert to degrees, adjust for sprite orientation
        
        this.scene.tweens.add({
            targets: this.bird,
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
        
        // Subtle vertical bobbing
        this.scene.tweens.add({
            targets: this.bird,
            y: this.bird.y + Phaser.Math.Between(-5, 5),
            duration: 1500,
            yoyo: true,
            repeat: Math.floor(duration / 1500),
            ease: 'Sine.easeInOut'
        });
    }

    startSpiraling() {
        this.spiralCenter = { x: this.bird.x, y: this.bird.y };
        this.spiralRadius = Phaser.Math.Between(40, 80);
        this.spiralAngle = 0;
        
        const spiralDuration = Phaser.Math.Between(3000, 6000);
        
        const updateSpiral = () => {
            this.spiralAngle += 0.06;
            const x = this.spiralCenter.x + Math.cos(this.spiralAngle) * this.spiralRadius;
            const y = this.spiralCenter.y + Math.sin(this.spiralAngle) * this.spiralRadius * 0.6;
            
            this.bird.x = Phaser.Math.Clamp(x, this.bounds.minX, this.bounds.maxX);
            this.bird.y = Phaser.Math.Clamp(y, this.bounds.minY, this.bounds.maxY);
            
            // Rotate bird to face direction
            this.bird.setAngle(this.spiralAngle * 57.3 + 90);
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
        const floatDistance = Phaser.Math.Between(20, 50);
        const floatDuration = Phaser.Math.Between(2000, 4000);
        
        this.scene.tweens.add({
            targets: this.bird,
            y: this.bird.y - floatDistance,
            duration: floatDuration,
            yoyo: true,
            repeat: 1,
            ease: 'Sine.easeInOut',
            onComplete: () => {
                this.scene.tweens.add({
                    targets: this.bird,
                    x: this.bird.x + Phaser.Math.Between(-40, 40),
                    duration: floatDuration,
                    ease: 'Sine.easeInOut',
                    onUpdate: (tween) => {
                        // Rotate bird to face movement direction
                        const angle = Phaser.Math.Angle.Between(
                            this.bird.x, this.bird.y,
                            tween.targets[0].x, tween.targets[0].y
                        );
                        this.bird.setAngle(angle * 57.3 + 90);
                    },
                    onComplete: () => {
                        this.startNaturalMovement();
                    }
                });
            }
        });
    }

    startPause() {
        this.isPaused = true;
        
        const pauseDuration = Phaser.Math.Between(1000, 2500);
        
        // Gentle hovering while paused
        this.scene.tweens.add({
            targets: this.bird,
            y: this.bird.y - 3,
            duration: 1000,
            yoyo: true,
            repeat: Math.floor(pauseDuration / 1000),
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
        
        const startX = this.bird.x;
        const startY = this.bird.y;
        const distance = Phaser.Math.Distance.Between(startX, startY, targetX, targetY);
        const duration = (distance / this.movementSpeed) * 1000;
        
        let lastX = startX;
        let lastY = startY;
        
        this.scene.tweens.add({
            targets: this.bird,
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
                
                this.bird.x = x;
                this.bird.y = y;
                
                // Rotate bird to face movement direction
                const angle = Phaser.Math.Angle.Between(lastX, lastY, x, y);
                this.bird.setAngle(angle * 57.3 + 90);
                
                lastX = x;
                lastY = y;
            },
            onComplete: () => {
                this.startNaturalMovement();
            }
        });
    }

    update(otherBirds) {
        // Collision avoidance
        if (otherBirds && otherBirds.length > 0) {
            const minDistance = 50;
            
            otherBirds.forEach(other => {
                if (other !== this.bird && other.active) {
                    const distance = Phaser.Math.Distance.Between(
                        this.bird.x, this.bird.y,
                        other.x, other.y
                    );
                    
                    if (distance < minDistance) {
                        const angle = Phaser.Math.Angle.Between(
                            other.x, other.y,
                            this.bird.x, this.bird.y
                        );
                        
                        const avoidDistance = (minDistance - distance) * 0.5;
                        this.bird.x += Math.cos(angle) * avoidDistance;
                        this.bird.y += Math.sin(angle) * avoidDistance;
                        
                        this.bird.x = Phaser.Math.Clamp(this.bird.x, this.bounds.minX, this.bounds.maxX);
                        this.bird.y = Phaser.Math.Clamp(this.bird.y, this.bounds.minY, this.bounds.maxY);
                    }
                }
            });
        }
    }

    destroy() {
        this.scene.tweens.killTweensOf(this.bird);
    }
}

/**
 * Create bird for menu screen
 */
function createMenuBird(scene, birdData) {
    const spriteKey = birdData.spriteKey;
    
    let bird;
    try {
        if (scene.textures && scene.textures.exists(spriteKey)) {
            bird = scene.add.sprite(0, 0, spriteKey, 0);
        } else {
            console.warn(`Bird texture ${spriteKey} does not exist`);
            return null;
        }
    } catch (error) {
        console.warn(`Error creating bird sprite:`, error);
        return null;
    }
    
    bird.setOrigin(0.5);
    
    try {
        const behaviorSystem = new BirdBehaviorSystem(scene, bird, birdData);
        bird.setData('behaviorSystem', behaviorSystem);
    } catch (error) {
        console.warn(`Error creating bird behavior system:`, error);
    }
    
    return bird;
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { BirdBehaviorSystem, createMenuBird };
}

