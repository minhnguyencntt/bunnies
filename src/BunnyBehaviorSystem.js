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
        
        // Behavior weights (higher = more likely)
        this.behaviorWeights = {
            'idle': 30,
            'runright': 15,
            'runleft': 15,
            'jump': 10,
            'dance': 12,
            'victory': 8,
            'talk': 8,
            'sleep': 5,
            'hit': 3,
            'walk': 10
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
        
        // Stay idle for 3-6 seconds
        const duration = Phaser.Math.Between(3000, 6000);
        this.behaviorTimer = this.scene.time.delayedCall(duration, () => {
            this.selectRandomBehavior();
        });
    }

    /**
     * Run behavior - move in direction
     */
    doRun(direction) {
        const isRight = direction === 'runright';
        this.playAnimation(direction);
        this.isMoving = true;
        
        // Determine movement target
        const width = this.scene.cameras.main.width;
        const height = this.scene.cameras.main.height;
        const currentX = this.bunny.x;
        const currentY = this.bunny.y;
        const moveDistance = Phaser.Math.Between(50, 150);
        const targetX = isRight 
            ? Math.min(currentX + moveDistance, width - 50)
            : Math.max(currentX - moveDistance, 50);
        
        // Keep within garden bounds
        const targetY = Phaser.Math.Clamp(
            currentY + Phaser.Math.Between(-15, 15),
            height * 0.7,
            height - 50
        );
        
        // Move bunny
        this.scene.tweens.add({
            targets: this.bunny,
            x: targetX,
            y: targetY,
            duration: 1000 + moveDistance * 2,
            ease: 'Linear',
            onComplete: () => {
                this.isMoving = false;
                // After running, go to idle or another behavior
                this.behaviorTimer = this.scene.time.delayedCall(500, () => {
                    this.selectRandomBehavior();
                });
            }
        });
    }

    /**
     * Jump behavior - perform a jump
     */
    doJump() {
        this.playAnimation('jump');
        this.isMoving = false;
        
        // Jump animation with movement
        const jumpDistance = Phaser.Math.Between(30, 80);
        const jumpHeight = 40;
        
        // Jump up and forward
        this.scene.tweens.add({
            targets: this.bunny,
            y: this.bunny.y - jumpHeight,
            x: this.bunny.x + jumpDistance,
            duration: 300,
            ease: 'Power2',
            yoyo: true,
            onComplete: () => {
                // After jump, return to idle
                this.behaviorTimer = this.scene.time.delayedCall(500, () => {
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
     * Walk behavior - slow, gentle movement
     */
    doWalk() {
        // Use run animation but slower
        const direction = Phaser.Math.Between(0, 1) === 0 ? 'runright' : 'runleft';
        this.playAnimation(direction);
        this.isMoving = true;
        
        const width = this.scene.cameras.main.width;
        const currentX = this.bunny.x;
        const moveDistance = Phaser.Math.Between(30, 80);
        const targetX = direction === 'runright'
            ? Math.min(currentX + moveDistance, width - 50)
            : Math.max(currentX - moveDistance, 50);
        
        // Slower movement for walking
        this.scene.tweens.add({
            targets: this.bunny,
            x: targetX,
            duration: 1500 + moveDistance * 3,
            ease: 'Linear',
            onComplete: () => {
                this.isMoving = false;
                this.behaviorTimer = this.scene.time.delayedCall(500, () => {
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
     * Update method (called each frame if needed)
     */
    update() {
        // Add any per-frame logic here if needed
        // For now, behaviors are timer-based
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

