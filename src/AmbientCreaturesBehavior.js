/**
 * AmbientCreaturesBehavior - Natural movement for fireflies, birds, and magic particles
 */

class AmbientCreaturesBehavior {
    constructor(scene, creatureSprite, creatureData) {
        this.scene = scene;
        this.creature = creatureSprite;
        this.creatureData = creatureData;
        this.type = creatureData.type;
        
        // Movement state
        this.movementSpeed = this.getSpeedForType();
        this.currentTarget = null;
        this.isPaused = false;
        this.spiralAngle = 0;
        this.spiralRadius = 0;
        this.spiralCenter = { x: 0, y: 0 };
        
        // Boundaries
        this.bounds = {
            minX: 30,
            maxX: scene.cameras.main.width - 30,
            minY: 30,
            maxY: scene.cameras.main.height * 0.7
        };
        
        // Type-specific properties
        if (this.type === 'firefly') {
            this.glowTimer = null;
        }
        
        this.setupCreature();
        this.startNaturalMovement();
    }

    getSpeedForType() {
        switch(this.type) {
            case 'firefly':
                return Phaser.Math.Between(15, 35); // Slow, gentle
            case 'bird':
                return Phaser.Math.Between(40, 80); // Medium-fast
            case 'particle':
                return Phaser.Math.Between(10, 25); // Very slow, drifting
            default:
                return 30;
        }
    }

    setupCreature() {
        // Set initial position
        this.creature.x = Phaser.Math.Between(this.bounds.minX, this.bounds.maxX);
        this.creature.y = Phaser.Math.Between(this.bounds.minY, this.bounds.maxY);
        
        // Set scale based on type
        if (this.type === 'firefly') {
            this.creature.setScale(Phaser.Math.FloatBetween(0.8, 1.2));
        } else if (this.type === 'bird') {
            this.creature.setScale(Phaser.Math.FloatBetween(0.7, 1.0));
        } else if (this.type === 'particle') {
            this.creature.setScale(Phaser.Math.FloatBetween(0.6, 1.0));
        }
        
        // Set depth (behind bunnies, above background)
        this.creature.setDepth(40);
        
        // Play animation
        if (this.creatureData.animKey && this.scene.anims.exists(this.creatureData.animKey)) {
            this.creature.play(this.creatureData.animKey);
        } else {
            if (this.scene.textures.exists(this.creatureData.spriteKey)) {
                this.creature.setTexture(this.creatureData.spriteKey, 0);
            }
        }
        
        // Type-specific setup
        if (this.type === 'firefly') {
            this.startGlowFlicker();
        }
    }

    startGlowFlicker() {
        // Random twinkling glow for fireflies
        const flicker = () => {
            const intensity = Phaser.Math.FloatBetween(0.7, 1.0);
            this.scene.tweens.add({
                targets: this.creature,
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
            this.creature.x, this.creature.y,
            targetX, targetY
        );
        
        const duration = (distance / this.movementSpeed) * 1000;
        
        this.scene.tweens.add({
            targets: this.creature,
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
        
        // Vertical bobbing
        this.scene.tweens.add({
            targets: this.creature,
            y: this.creature.y + Phaser.Math.Between(-8, 8),
            duration: 2000,
            yoyo: true,
            repeat: Math.floor(duration / 2000),
            ease: 'Sine.easeInOut'
        });
    }

    startSpiraling() {
        this.spiralCenter = { x: this.creature.x, y: this.creature.y };
        this.spiralRadius = Phaser.Math.Between(20, 60);
        this.spiralAngle = 0;
        
        const spiralDuration = Phaser.Math.Between(2000, 5000);
        const updateSpiral = () => {
            this.spiralAngle += 0.06;
            const x = this.spiralCenter.x + Math.cos(this.spiralAngle) * this.spiralRadius;
            const y = this.spiralCenter.y + Math.sin(this.spiralAngle) * this.spiralRadius * 0.6;
            
            this.creature.x = Phaser.Math.Clamp(x, this.bounds.minX, this.bounds.maxX);
            this.creature.y = Phaser.Math.Clamp(y, this.bounds.minY, this.bounds.maxY);
            
            if (this.type === 'bird') {
                this.creature.setAngle(this.spiralAngle * 57.3 + 90);
            }
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
        const floatDistance = Phaser.Math.Between(15, 40);
        const floatDuration = Phaser.Math.Between(2000, 4000);
        
        this.scene.tweens.add({
            targets: this.creature,
            y: this.creature.y - floatDistance,
            duration: floatDuration,
            yoyo: true,
            repeat: 1,
            ease: 'Sine.easeInOut',
            onComplete: () => {
                this.scene.tweens.add({
                    targets: this.creature,
                    x: this.creature.x + Phaser.Math.Between(-25, 25),
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
        
        const pauseDuration = Phaser.Math.Between(1000, 3000);
        
        // Very gentle movement while paused
        this.scene.tweens.add({
            targets: this.creature,
            y: this.creature.y - 3,
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
        
        const startX = this.creature.x;
        const startY = this.creature.y;
        const distance = Phaser.Math.Distance.Between(startX, startY, targetX, targetY);
        const duration = (distance / this.movementSpeed) * 1000;
        
        this.scene.tweens.add({
            targets: this.creature,
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
                
                this.creature.x = x;
                this.creature.y = y;
            },
            onComplete: () => {
                this.startNaturalMovement();
            }
        });
    }

    update(otherCreatures) {
        // Collision avoidance
        if (otherCreatures && otherCreatures.length > 0) {
            const minDistance = this.type === 'firefly' ? 30 : (this.type === 'bird' ? 50 : 20);
            
            otherCreatures.forEach(other => {
                if (other !== this.creature && other.active) {
                    const distance = Phaser.Math.Distance.Between(
                        this.creature.x, this.creature.y,
                        other.x, other.y
                    );
                    
                    if (distance < minDistance) {
                        const angle = Phaser.Math.Angle.Between(
                            other.x, other.y,
                            this.creature.x, this.creature.y
                        );
                        
                        const avoidDistance = (minDistance - distance) * 0.5;
                        this.creature.x += Math.cos(angle) * avoidDistance;
                        this.creature.y += Math.sin(angle) * avoidDistance;
                        
                        this.creature.x = Phaser.Math.Clamp(this.creature.x, this.bounds.minX, this.bounds.maxX);
                        this.creature.y = Phaser.Math.Clamp(this.creature.y, this.bounds.minY, this.bounds.maxY);
                    }
                }
            });
        }
    }

    destroy() {
        if (this.glowTimer) {
            this.glowTimer.remove();
        }
        this.scene.tweens.killTweensOf(this.creature);
    }
}

/**
 * Create ambient creature for menu screen
 */
function createAmbientCreature(scene, creatureData) {
    const spriteKey = creatureData.spriteKey;
    
    let creature;
    try {
        if (scene.textures && scene.textures.exists(spriteKey)) {
            creature = scene.add.sprite(0, 0, spriteKey, 0);
        } else {
            console.warn(`Creature texture ${spriteKey} does not exist`);
            return null;
        }
    } catch (error) {
        console.warn(`Error creating creature sprite:`, error);
        return null;
    }
    
    creature.setOrigin(0.5);
    
    try {
        const behaviorSystem = new AmbientCreaturesBehavior(scene, creature, creatureData);
        creature.setData('behaviorSystem', behaviorSystem);
    } catch (error) {
        console.warn(`Error creating creature behavior system:`, error);
    }
    
    return creature;
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AmbientCreaturesBehavior, createAmbientCreature };
}

