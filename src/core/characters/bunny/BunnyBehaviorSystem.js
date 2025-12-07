/**
 * BunnyBehaviorSystem - Manages animated behaviors for bunny characters on menu screen
 * Creates playful, random animations and movements for magical garden atmosphere
 */

class BunnyBehaviorSystem {
    constructor(scene, bunnySprite, charConfig) {
        this.scene = scene;
        this.bunny = bunnySprite;
        this.charConfig = charConfig;
        this.charName = charConfig.name.toLowerCase();
        
        // Behavior state
        this.currentAnimation = 'idle';
        this.currentBehavior = 'idle';
        this.behaviorTimer = null;
        this.movementTarget = null;
        this.isMoving = false;
        this.collisionCooldown = 0; // Cooldown to prevent too frequent collision reactions
        
        // Animation options
        this.availableAnimations = [
            'idle',
            'runright',
            'runleft',
            'jump',
            'dance',
            'victory',
            'talk',
            'sleep',
            'hit',
            'walk'
        ];
        
        // Behavior weights (higher = more likely) - more random distribution
        this.behaviorWeights = {
            'idle': 20,
            'runright': 18,
            'runleft': 18,
            'jump': 15,
            'dance': 12,
            'victory': 8,
            'talk': 8,
            'sleep': 3,
            'hit': 2,
            'walk': 14
        };
        
        // Initialize
        this.setupBunny();
        this.startBehaviorLoop();
    }

    setupBunny() {
        // Set initial animation
        const idleSheet = `bunny_${this.charName}_idle_sheet`;
        try {
            if (this.scene.textures && this.scene.textures.exists(idleSheet)) {
                if (this.bunny.setTexture) {
                    this.bunny.setTexture(idleSheet, 0);
                }
                // Wait a bit before playing animation to ensure it's ready
                this.scene.time.delayedCall(100, () => {
                    this.playAnimation('idle');
                });
            }
        } catch (error) {
            console.warn(`Error setting up bunny ${this.charName}:`, error);
        }
        
        // Make bunny interactive
        if (this.bunny.setInteractive) {
            // Check if it's a graphics object (needs hitArea)
            if (this.bunny.type === 'Graphics') {
                // For graphics, provide a hitArea
                const hitArea = new Phaser.Geom.Circle(0, 0, 40);
                this.bunny.setInteractive(hitArea, Phaser.Geom.Circle.Contains, {
                    useHandCursor: true
                });
            } else {
                // For sprites/images, normal interactive
                this.bunny.setInteractive({ useHandCursor: true });
            }
            this.bunny.on('pointerdown', () => this.onBunnyClicked());
        }
        
        // Set depth for proper layering
        if (this.bunny.setDepth) {
            this.bunny.setDepth(100);
        }
    }

    /**
     * Start the behavior loop - randomly selects behaviors
     */
    startBehaviorLoop() {
        this.selectRandomBehavior();
    }

    /**
     * Select a random behavior based on weights
     */
    selectRandomBehavior() {
        // Calculate total weight
        let totalWeight = 0;
        Object.values(this.behaviorWeights).forEach(weight => {
            totalWeight += weight;
        });
        
        // Pick random behavior
        let random = Phaser.Math.Between(0, totalWeight - 1);
        let selectedBehavior = 'idle';
        
        for (const [behavior, weight] of Object.entries(this.behaviorWeights)) {
            random -= weight;
            if (random < 0) {
                selectedBehavior = behavior;
                break;
            }
        }
        
        this.executeBehavior(selectedBehavior);
    }

    /**
     * Execute a specific behavior
     */
    executeBehavior(behavior) {
        this.currentBehavior = behavior;
        
        // Clear any existing timers
        if (this.behaviorTimer) {
            this.behaviorTimer.remove();
        }
        
        switch(behavior) {
            case 'idle':
                this.doIdle();
                break;
            case 'runright':
            case 'runleft':
                this.doRun(behavior);
                break;
            case 'jump':
                this.doJump();
                break;
            case 'dance':
                this.doDance();
                break;
            case 'victory':
                this.doVictory();
                break;
            case 'talk':
                this.doTalk();
                break;
            case 'sleep':
                this.doSleep();
                break;
            case 'hit':
                this.doHit();
                break;
            case 'walk':
                this.doWalk();
                break;
        }
    }

    /**
     * Play animation by name
     */
    playAnimation(animName) {
        const animKey = `bunny_${this.charName}_${animName}`;
        
        try {
            if (this.scene.anims && this.scene.anims.exists(animKey)) {
                this.bunny.play(animKey);
                this.currentAnimation = animName;
            } else {
                // Fallback: try to set texture directly
                const sheetKey = `bunny_${this.charName}_${animName}_sheet`;
                if (this.scene.textures && this.scene.textures.exists(sheetKey)) {
                    if (this.bunny.setTexture) {
                        this.bunny.setTexture(sheetKey, 0);
                    }
                } else {
                    // Final fallback: use idle texture
                    const idleSheet = `bunny_${this.charName}_idle_sheet`;
                    if (this.scene.textures && this.scene.textures.exists(idleSheet)) {
                        if (this.bunny.setTexture) {
                            this.bunny.setTexture(idleSheet, 0);
                        }
                    }
                }
            }
        } catch (error) {
            console.warn(`Error playing animation ${animName} for ${this.charName}:`, error);
            // Fallback to idle texture
            const idleSheet = `bunny_${this.charName}_idle_sheet`;
            if (this.scene.textures && this.scene.textures.exists(idleSheet)) {
                if (this.bunny.setTexture) {
                    this.bunny.setTexture(idleSheet, 0);
                }
            }
        }
    }

    /**
     * Idle behavior - gentle breathing, occasional blinks
     */
    doIdle() {
        this.playAnimation('idle');
        this.isMoving = false;
        
        // Stay idle for 2-5 seconds (more random, shorter)
        const duration = Phaser.Math.Between(2000, 5000);
        this.behaviorTimer = this.scene.time.delayedCall(duration, () => {
            this.selectRandomBehavior();
        });
    }

    /**
     * Run behavior - move in direction (more random)
     */
    doRun(direction) {
        const isRight = direction === 'runright';
        this.playAnimation(direction);
        this.isMoving = true;
        
        // Determine movement target - more random
        const width = this.scene.cameras.main.width;
        const height = this.scene.cameras.main.height;
        const currentX = this.bunny.x;
        const currentY = this.bunny.y;
        
        // More random distance and direction
        const moveDistance = Phaser.Math.Between(80, 200);
        const randomDirection = Phaser.Math.Between(0, 1) === 0 ? 1 : -1;
        const targetX = Phaser.Math.Clamp(
            currentX + (isRight ? moveDistance : -moveDistance) * randomDirection,
            50,
            width - 50
        );
        
        // More random Y movement (allow more area, avoid top 20% for title/buttons)
        const targetY = Phaser.Math.Clamp(
            currentY + Phaser.Math.Between(-40, 40),
            height * 0.25,
            height - 50
        );
        
        // Variable speed for more randomness
        const speed = Phaser.Math.Between(800, 1500);
        
        // Move bunny
        this.scene.tweens.add({
            targets: this.bunny,
            x: targetX,
            y: targetY,
            duration: speed + moveDistance * 1.5,
            ease: 'Power1',
            onComplete: () => {
                this.isMoving = false;
                // After running, go to idle or another behavior (shorter delay)
                this.behaviorTimer = this.scene.time.delayedCall(Phaser.Math.Between(300, 800), () => {
                    this.selectRandomBehavior();
                });
            }
        });
    }

    /**
     * Jump behavior - perform a jump (more random)
     */
    doJump() {
        this.playAnimation('jump');
        this.isMoving = false;
        
        // More random jump distance and direction
        const jumpDistance = Phaser.Math.Between(40, 120);
        const jumpDirection = Phaser.Math.Between(0, 1) === 0 ? 1 : -1;
        const jumpHeight = Phaser.Math.Between(30, 60);
        
        // Jump up and forward/backward randomly
        this.scene.tweens.add({
            targets: this.bunny,
            y: this.bunny.y - jumpHeight,
            x: this.bunny.x + (jumpDistance * jumpDirection),
            duration: Phaser.Math.Between(250, 400),
            ease: 'Power2',
            yoyo: true,
            onComplete: () => {
                // After jump, return to idle (shorter delay)
                this.behaviorTimer = this.scene.time.delayedCall(Phaser.Math.Between(300, 700), () => {
                    this.selectRandomBehavior();
                });
            }
        });
        
        // Handle animation complete
        this.bunny.once('animationcomplete', () => {
            this.playAnimation('idle');
        });
    }

    /**
     * Dance behavior - playful dancing
     */
    doDance() {
        this.playAnimation('dance');
        this.isMoving = false;
        
        // Dance in place with slight movement
        const danceDuration = Phaser.Math.Between(2000, 4000);
        
        // Slight bouncing during dance
        this.scene.tweens.add({
            targets: this.bunny,
            y: this.bunny.y - 10,
            duration: 300,
            yoyo: true,
            repeat: Math.floor(danceDuration / 300),
            ease: 'Sine.easeInOut'
        });
        
        // Slight rotation
        this.scene.tweens.add({
            targets: this.bunny,
            angle: 5,
            duration: 400,
            yoyo: true,
            repeat: Math.floor(danceDuration / 400),
            ease: 'Sine.easeInOut'
        });
        
        this.behaviorTimer = this.scene.time.delayedCall(danceDuration, () => {
            this.bunny.setAngle(0);
            this.selectRandomBehavior();
        });
    }

    /**
     * Victory behavior - celebrate
     */
    doVictory() {
        this.playAnimation('victory');
        this.isMoving = false;
        
        // Jump up with celebration
        this.scene.tweens.add({
            targets: this.bunny,
            y: this.bunny.y - 30,
            scaleX: 1.2,
            scaleY: 1.2,
            duration: 400,
            yoyo: true,
            ease: 'Bounce.easeOut'
        });
        
        const duration = Phaser.Math.Between(2000, 3000);
        this.behaviorTimer = this.scene.time.delayedCall(duration, () => {
            this.bunny.setScale(1);
            this.selectRandomBehavior();
        });
    }

    /**
     * Talk behavior - talking animation
     */
    doTalk() {
        this.playAnimation('talk');
        this.isMoving = false;
        
        // Slight head bob while talking
        const originalY = this.bunny.y;
        this.scene.tweens.add({
            targets: this.bunny,
            y: originalY - 3,
            duration: 300,
            yoyo: true,
            repeat: 3,
            ease: 'Sine.easeInOut'
        });
        
        const duration = Phaser.Math.Between(2000, 3500);
        this.behaviorTimer = this.scene.time.delayedCall(duration, () => {
            this.selectRandomBehavior();
        });
    }

    /**
     * Sleep behavior - sleeping animation
     */
    doSleep() {
        this.playAnimation('sleep');
        this.isMoving = false;
        
        // Sleep for a while
        const duration = Phaser.Math.Between(4000, 8000);
        
        // Gentle breathing motion
        this.scene.tweens.add({
            targets: this.bunny,
            scaleY: 0.95,
            duration: 1500,
            yoyo: true,
            repeat: Math.floor(duration / 1500),
            ease: 'Sine.easeInOut'
        });
        
        this.behaviorTimer = this.scene.time.delayedCall(duration, () => {
            this.selectRandomBehavior();
        });
    }

    /**
     * Hit behavior - light hurt reaction (child-friendly)
     */
    doHit() {
        this.playAnimation('hit');
        this.isMoving = false;
        
        // Quick shake
        this.scene.tweens.add({
            targets: this.bunny,
            x: this.bunny.x - 5,
            duration: 50,
            yoyo: true,
            repeat: 3,
            ease: 'Power2'
        });
        
        // Handle animation complete
        this.bunny.once('animationcomplete', () => {
            this.playAnimation('idle');
            // After hit, go to idle
            this.behaviorTimer = this.scene.time.delayedCall(1000, () => {
                this.selectRandomBehavior();
            });
        });
    }

    /**
     * Walk behavior - slow, gentle movement (more random)
     */
    doWalk() {
        // Use run animation but slower
        const direction = Phaser.Math.Between(0, 1) === 0 ? 'runright' : 'runleft';
        this.playAnimation(direction);
        this.isMoving = true;
        
        const width = this.scene.cameras.main.width;
        const height = this.scene.cameras.main.height;
        const currentX = this.bunny.x;
        const currentY = this.bunny.y;
        
        // More random walk distance
        const moveDistance = Phaser.Math.Between(50, 120);
        const targetX = Phaser.Math.Clamp(
            direction === 'runright' 
                ? currentX + moveDistance 
                : currentX - moveDistance,
            50,
            width - 50
        );
        
        // Random Y movement during walk (allow more area)
        const targetY = Phaser.Math.Clamp(
            currentY + Phaser.Math.Between(-25, 25),
            height * 0.25,
            height - 50
        );
        
        // Variable speed for walking
        const walkSpeed = Phaser.Math.Between(1200, 2000);
        
        // Slower movement for walking
        this.scene.tweens.add({
            targets: this.bunny,
            x: targetX,
            y: targetY,
            duration: walkSpeed + moveDistance * 2,
            ease: 'Power1',
            onComplete: () => {
                this.isMoving = false;
                this.behaviorTimer = this.scene.time.delayedCall(Phaser.Math.Between(400, 800), () => {
                    this.selectRandomBehavior();
                });
            }
        });
    }

    /**
     * Handle bunny click interaction
     */
    onBunnyClicked() {
        // When clicked, perform a special reaction
        const reactions = ['victory', 'jump', 'dance'];
        const reaction = reactions[Phaser.Math.Between(0, reactions.length - 1)];
        
        // Cancel current behavior
        if (this.behaviorTimer) {
            this.behaviorTimer.remove();
        }
        
        // Perform reaction
        this.executeBehavior(reaction);
    }

    /**
     * Update method (called each frame for collision detection)
     */
    update(allBunnies) {
        // Update collision cooldown
        if (this.collisionCooldown > 0) {
            this.collisionCooldown--;
        }
        
        // Collision detection and avoidance - more sensitive
        if (allBunnies && allBunnies.length > 0) {
            // More sensitive detection - larger minimum distance
            const minDistance = 80; // Increased from 60 for earlier detection
            const warningDistance = 100; // Start adjusting slightly even before collision
            const avoidForce = 3; // Increased force to move away faster
            
            let closestBunny = null;
            let closestDistance = Infinity;
            
            // Find closest bunny
            allBunnies.forEach(other => {
                if (other !== this.bunny && other.active && other.visible) {
                    const distance = Phaser.Math.Distance.Between(
                        this.bunny.x, this.bunny.y,
                        other.x, other.y
                    );
                    
                    if (distance < closestDistance) {
                        closestDistance = distance;
                        closestBunny = other;
                    }
                }
            });
            
            // React to collision or near-collision
            if (closestBunny && closestDistance < warningDistance) {
                // If very close (collision), react immediately
                if (closestDistance < minDistance && this.collisionCooldown === 0) {
                    // Set shorter cooldown for more responsive reactions
                    this.collisionCooldown = 15; // ~0.25 seconds at 60fps (reduced from 30)
                    
                    // Calculate angle away from other bunny
                    const angle = Phaser.Math.Angle.Between(
                        closestBunny.x, closestBunny.y,
                        this.bunny.x, this.bunny.y
                    );
                    
                    // Calculate avoidance distance - more aggressive
                    const avoidDistance = (minDistance - closestDistance) * avoidForce;
                    
                    // Calculate new position
                    const newX = this.bunny.x + Math.cos(angle) * avoidDistance;
                    const newY = this.bunny.y + Math.sin(angle) * avoidDistance;
                    
                    // Clamp to screen bounds (allow more area)
                    const width = this.scene.cameras.main.width;
                    const height = this.scene.cameras.main.height;
                    const clampedX = Phaser.Math.Clamp(newX, 50, width - 50);
                    const clampedY = Phaser.Math.Clamp(newY, 50, height - 50); // Allow full height
                    
                    // Cancel any existing movement tweens and move away from collision
                    this.scene.tweens.killTweensOf(this.bunny);
                    this.isMoving = false;
                    
                    // Cancel behavior timer if exists
                    if (this.behaviorTimer) {
                        this.behaviorTimer.remove();
                    }
                    
                    // Move away from collision - faster reaction
                    this.scene.tweens.add({
                        targets: this.bunny,
                        x: clampedX,
                        y: clampedY,
                        duration: 200, // Faster reaction (reduced from 300)
                        ease: 'Power2',
                        onComplete: () => {
                            // After avoiding, select new random behavior
                            this.behaviorTimer = this.scene.time.delayedCall(100, () => {
                                this.selectRandomBehavior();
                            });
                        }
                    });
                    
                    // Play jump animation briefly to show reaction
                    this.playAnimation('jump');
                    this.scene.time.delayedCall(200, () => {
                        this.playAnimation('idle');
                    });
                } 
                // If getting close but not colliding yet, make slight adjustment
                else if (closestDistance < warningDistance && closestDistance >= minDistance && this.collisionCooldown === 0) {
                    // Gentle adjustment to avoid future collision
                    const adjustmentAngle = Phaser.Math.Angle.Between(
                        closestBunny.x, closestBunny.y,
                        this.bunny.x, this.bunny.y
                    );
                    
                    // Small adjustment
                    const adjustmentDistance = (warningDistance - closestDistance) * 0.3;
                    const adjustX = this.bunny.x + Math.cos(adjustmentAngle) * adjustmentDistance;
                    const adjustY = this.bunny.y + Math.sin(adjustmentAngle) * adjustmentDistance;
                    
                    const width = this.scene.cameras.main.width;
                    const height = this.scene.cameras.main.height;
                    const clampedX = Phaser.Math.Clamp(adjustX, 50, width - 50);
                    const clampedY = Phaser.Math.Clamp(adjustY, 50, height - 50);
                    
                    // Only adjust if not currently moving with a tween
                    if (!this.isMoving) {
                        this.scene.tweens.add({
                            targets: this.bunny,
                            x: clampedX,
                            y: clampedY,
                            duration: 150,
                            ease: 'Power1'
                        });
                    }
                }
            }
        }
    }

    /**
     * Cleanup
     */
    destroy() {
        if (this.behaviorTimer) {
            this.behaviorTimer.remove();
        }
        // Remove any tweens
        this.scene.tweens.killTweensOf(this.bunny);
    }
}

/**
 * Create animated bunny with behavior system for menu screen
 */
function createAnimatedMenuBunny(scene, x, y, charConfig) {
    const charName = charConfig.name.toLowerCase();
    const idleSheet = `bunny_${charName}_idle_sheet`;
    
    // Create sprite
    let bunny;
    try {
        if (scene.textures && scene.textures.exists(idleSheet)) {
            bunny = scene.add.sprite(x, y, idleSheet, 0);
        } else {
            // Fallback: create simple bunny using BunnyCharacter
            if (typeof BunnyCharacter !== 'undefined') {
                const bunnyChar = new BunnyCharacter(scene, { ...charConfig, size: 80 });
                const idleTexture = bunnyChar.generateTexture('idle');
                bunny = scene.add.image(x, y, idleTexture);
            } else {
                // Final fallback: create simple graphics bunny
                bunny = scene.add.graphics();
                bunny.fillStyle(charConfig.furColor || 0xFFFFFF, 1);
                bunny.fillCircle(0, 0, 25);
                bunny.x = x;
                bunny.y = y;
                // For graphics objects, we need to provide a hitArea
                if (bunny.setInteractive) {
                    bunny.setInteractive(new Phaser.Geom.Circle(0, 0, 25), Phaser.Geom.Circle.Contains, {
                        useHandCursor: true
                    });
                }
            }
        }
    } catch (error) {
        console.warn(`Error creating bunny sprite for ${charName}:`, error);
        // Create fallback graphics bunny
        bunny = scene.add.graphics();
        bunny.fillStyle(charConfig.furColor || 0xFFFFFF, 1);
        bunny.fillCircle(0, 0, 25);
        bunny.x = x;
        bunny.y = y;
    }
    
    // Set initial properties
    if (bunny.setOrigin) {
        bunny.setOrigin(0.5);
    }
    if (bunny.setScale) {
        bunny.setScale(1.2); // Slightly larger for menu
    }
    
    // Create behavior system (with error handling)
    try {
        const behaviorSystem = new BunnyBehaviorSystem(scene, bunny, charConfig);
        // Store reference
        if (bunny.setData) {
            bunny.setData('behaviorSystem', behaviorSystem);
        }
    } catch (error) {
        console.warn(`Error creating behavior system for ${charName}:`, error);
    }
    
    // Gentle floating animation (always active)
    try {
        scene.tweens.add({
            targets: bunny,
            y: bunny.y - 5,
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    } catch (error) {
        console.warn(`Error creating floating animation for ${charName}:`, error);
    }
    
    return bunny;
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { BunnyBehaviorSystem, createAnimatedMenuBunny };
}

