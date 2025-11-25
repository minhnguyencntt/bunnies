/**
 * WiseOwlCharacter - Cú Thông Thái (Wise Owl)
 * Main NPC character for Level 1 - Counting Forest
 * Friendly, wise white cartoon owl with round glasses
 * Supports multiple animation states: idle, cheering, encouraging, sad, celebrating
 */

class WiseOwlCharacter {
    constructor(scene, config = {}) {
        this.scene = scene;
        this.x = config.x || 0;
        this.y = config.y || 0;
        this.size = config.size || 120;
        this.sprite = null;
        this.speechBubble = null;
        this.currentDialogue = null;
        this.dialogueTimer = null;
        this.currentAnimation = 'idle';
        
        // Ensure animations are generated
        this.ensureAnimationsGenerated();
    }

    /**
     * Ensure all owl animations are generated
     */
    ensureAnimationsGenerated() {
        // Check if animations already exist
        if (this.scene.textures.exists('wise_owl_idle_sheet')) {
            return; // Already generated
        }
        
        // Generate all animations using the animation generator
        if (typeof generateWiseOwlAnimations === 'function') {
            generateWiseOwlAnimations(this.scene);
        } else {
            console.warn('WiseOwlAnimationGenerator not loaded. Please include WiseOwlAnimationGenerator.js');
        }
    }

    /**
     * Create owl sprite in scene
     */
    create() {
        // Ensure animations are generated
        this.ensureAnimationsGenerated();
        
        // Use idle sprite sheet as default
        const spriteKey = 'wise_owl_idle_sheet';
        
        if (!this.scene.textures.exists(spriteKey)) {
            console.error('Wise owl sprite sheet not found. Generating animations...');
            this.ensureAnimationsGenerated();
        }
        
        this.sprite = this.scene.add.sprite(this.x, this.y, spriteKey, 0);
        this.sprite.setOrigin(0.5);
        this.sprite.setDepth(300); // Highest depth to always display above all other objects
        
        // Store original position for movement animations
        this.originalX = this.x;
        this.originalY = this.y;
        
        // Play idle animation by default
        this.playAnimation('idle');
        
        // Start random movement animations
        this.startRandomMovements();
        
        return this.sprite;
    }

    /**
     * Start random movement animations (jumping, flying, floating)
     */
    startRandomMovements() {
        if (!this.sprite) return;
        
        const sceneWidth = this.scene.cameras.main.width;
        const sceneHeight = this.scene.cameras.main.height;
        
        // Define movement boundaries - full screen with small margin to prevent clipping
        const margin = this.size / 2 + 20; // Margin based on owl size to keep it fully visible
        const minX = margin; // Left edge with margin
        const maxX = sceneWidth - margin; // Right edge with margin
        const minY = margin; // Top edge with margin (considering HUD at top)
        const maxY = sceneHeight - margin; // Bottom edge with margin
        
        // Continuous smooth movement - always moving, no teleport, slower speed
        // Main continuous movement (combines X and Y movement smoothly)
        const continuousMove = () => {
            if (!this.sprite) return;
            
            // Get current position
            const currentX = this.sprite.x;
            const currentY = this.sprite.y;
            
            // Calculate new target position (smaller steps for smoother movement)
            const moveDistanceX = Phaser.Math.Between(-sceneWidth * 0.15, sceneWidth * 0.15);
            const moveDistanceY = Phaser.Math.Between(-sceneHeight * 0.1, sceneHeight * 0.1);
            const targetX = Phaser.Math.Clamp(currentX + moveDistanceX, minX, maxX);
            const targetY = Phaser.Math.Clamp(currentY + moveDistanceY, minY, maxY);
            
            // Calculate distance for duration
            const distance = Math.sqrt(Math.pow(targetX - currentX, 2) + Math.pow(targetY - currentY, 2));
            // Slower movement: 3-6 seconds for movement, based on distance
            const baseDuration = 3000;
            const maxDuration = 6000;
            const moveDuration = Math.min(maxDuration, baseDuration + (distance / 50)); // Slower: divide by 50 instead of 100
            
            // Smooth continuous movement
            this.scene.tweens.add({
                targets: this.sprite,
                x: targetX,
                y: targetY,
                duration: moveDuration,
                ease: 'Sine.easeInOut',
                onUpdate: () => {
                    this.updateDialoguePosition();
                },
                onComplete: () => {
                    // Immediately start next movement - no delay for continuous movement
                    continuousMove();
                }
            });
        };
        
        // Start continuous movement immediately
        continuousMove();
        
        // Gentle floating animation (continuous, smooth, slower)
        const updateFloating = () => {
            if (!this.sprite) return;
            const currentY = this.sprite.y;
            this.scene.tweens.add({
                targets: this.sprite,
                y: currentY - 8, // Smaller movement
                duration: 3000, // Slower: increased from 1800 to 3000
                yoyo: true,
                repeat: 0,
                ease: 'Sine.easeInOut',
                onUpdate: () => {
                    this.updateDialoguePosition();
                },
                onComplete: () => {
                    // Continue floating from new position immediately
                    updateFloating();
                }
            });
        };
        updateFloating();
        
        // Gentle circular movement (continuous, slower, smooth)
        const circularMove = () => {
            if (!this.sprite) return;
            
            // Use current position as center for smooth transition
            const centerX = this.sprite.x;
            const centerY = this.sprite.y;
            
            // Smaller radius for gentler movement
            const maxRadius = Math.min(sceneWidth * 0.15, sceneHeight * 0.15);
            const radius = Phaser.Math.Between(30, maxRadius);
            const startAngle = 0;
            const duration = Phaser.Math.Between(5000, 8000); // Much slower: 5-8 seconds for full circle
            
            const circularTween = this.scene.tweens.addCounter({
                from: 0,
                to: Math.PI * 2,
                duration: duration,
                ease: 'Linear',
                onUpdate: (tween) => {
                    if (!this.sprite) return;
                    const angle = startAngle + (tween.getValue() * 180 / Math.PI);
                    const rad = Phaser.Math.DegToRad(angle);
                    const newX = centerX + Math.cos(rad) * radius;
                    const newY = centerY + Math.sin(rad) * radius;
                    // Smooth position update
                    this.sprite.x = Phaser.Math.Clamp(newX, minX, maxX);
                    this.sprite.y = Phaser.Math.Clamp(newY, minY, maxY);
                    this.updateDialoguePosition();
                },
                onComplete: () => {
                    // Immediately start next circular movement - continuous
                    circularMove();
                }
            });
        };
        
        // Start circular movement after a short delay
        this.scene.time.delayedCall(2000, circularMove);
    }

    /**
     * Update dialogue position to follow owl
     */
    updateDialoguePosition() {
        if (!this.speechBubble || !this.sprite) return;
        
        const sceneWidth = this.scene.cameras.main.width;
        const sceneHeight = this.scene.cameras.main.height;
        
        // Position bubble above owl (not overlapping face)
        const owlX = this.sprite.x;
        const owlY = this.sprite.y;
        
        // Get bubble dimensions
        const bubbleWidth = this.speechBubble.width || 300;
        const bubbleHeight = this.speechBubble.height || 80;
        
        // Position above owl with enough clearance
        let bubbleX = owlX;
        let bubbleY = owlY - this.size * 0.9; // Closer to owl head, reduced from 1.2
        
        // Ensure bubble doesn't go off screen
        const rightEdge = sceneWidth - 20;
        if (bubbleX + bubbleWidth / 2 > rightEdge) {
            bubbleX = rightEdge - bubbleWidth / 2;
        }
        
        const leftEdge = 20;
        if (bubbleX - bubbleWidth / 2 < leftEdge) {
            bubbleX = leftEdge + bubbleWidth / 2;
        }
        
        // Ensure bubble doesn't go off top
        if (bubbleY - bubbleHeight / 2 < 0) {
            bubbleY = bubbleHeight / 2 + 10;
        }
        
        // Update bubble position directly (smooth following)
        this.speechBubble.x = bubbleX;
        this.speechBubble.y = bubbleY;
    }

    /**
     * Play a specific animation
     * @param {string} animationName - 'idle', 'cheering', 'encouraging', 'sad', 'celebrating'
     */
    playAnimation(animationName = 'idle') {
        if (!this.sprite) {
            console.warn('Owl sprite not created yet. Call create() first.');
            return;
        }
        
        const animKey = `wise_owl_${animationName}`;
        const spriteKey = `wise_owl_${animationName}_sheet`;
        
        // Check if animation exists
        if (!this.scene.anims.exists(animKey)) {
            console.warn(`Animation ${animKey} does not exist. Using idle instead.`);
            this.playAnimation('idle');
            return;
        }
        
        // If switching to a different animation, update sprite texture
        if (this.currentAnimation !== animationName) {
            if (this.scene.textures.exists(spriteKey)) {
                this.sprite.setTexture(spriteKey, 0);
            }
            this.currentAnimation = animationName;
        }
        
        // Play the animation
        this.sprite.play(animKey);
    }

    /**
     * Play cheering/applauding animation
     */
    cheer() {
        this.playAnimation('cheering');
    }

    /**
     * Play encouraging/motivating animation
     */
    encourage() {
        this.playAnimation('encouraging');
    }

    /**
     * Play sad/disappointed animation
     */
    showSadness() {
        this.playAnimation('sad');
    }

    /**
     * Play celebrating/excited animation
     */
    celebrate() {
        this.playAnimation('celebrating');
    }

    /**
     * Return to idle animation
     */
    returnToIdle() {
        this.playAnimation('idle');
    }

    /**
     * Show dialogue/speech bubble
     */
    showDialogue(text, duration = 3000) {
        // Clear previous dialogue
        this.hideDialogue();
        
        if (!this.sprite) return;
        
        const sceneWidth = this.scene.cameras.main.width;
        const sceneHeight = this.scene.cameras.main.height;
        
        // Calculate optimal bubble width (max 60% of screen width, min 250px)
        // For Vietnamese text, use more space per character
        const maxBubbleWidth = sceneWidth * 0.6;
        const minBubbleWidth = 250;
        const calculatedWidth = Math.min(maxBubbleWidth, Math.max(minBubbleWidth, text.length * 10 + 60));
        const bubbleWidth = calculatedWidth;
        
        // Create temporary text to measure actual height needed
        const tempText = this.scene.add.text(0, 0, text, {
            fontSize: '18px',
            fill: '#000000',
            fontFamily: 'Comic Sans MS, Arial',
            align: 'center',
            wordWrap: { width: bubbleWidth - 40 } // More padding for text
        });
        tempText.setOrigin(0.5);
        
        // Calculate actual text height
        const textHeight = tempText.height;
        const minBubbleHeight = 80;
        const bubbleHeight = Math.max(minBubbleHeight, textHeight + 40); // Add padding
        
        // Destroy temp text
        tempText.destroy();
        
        // Position bubble ABOVE owl (not overlapping face)
        const owlX = this.sprite.x;
        const owlY = this.sprite.y;
        
        // Position above owl with enough clearance to avoid overlapping face
        let bubbleX = owlX;
        let bubbleY = owlY - this.size * 0.9; // Closer to owl head, reduced from 1.2
        
        // Ensure bubble doesn't go off right edge
        const rightEdge = sceneWidth - 20;
        if (bubbleX + bubbleWidth / 2 > rightEdge) {
            bubbleX = rightEdge - bubbleWidth / 2;
        }
        
        // Ensure bubble doesn't go off left edge
        const leftEdge = 20;
        if (bubbleX - bubbleWidth / 2 < leftEdge) {
            bubbleX = leftEdge + bubbleWidth / 2;
        }
        
        // Ensure bubble doesn't go off top
        if (bubbleY - bubbleHeight / 2 < 0) {
            bubbleY = bubbleHeight / 2 + 10;
        }
        
        // Create speech bubble background with elegant transparency
        // Use unique texture key to avoid overwriting previous textures
        const textureKey = `speech_bubble_${bubbleWidth}_${bubbleHeight}`;
        
        // Only create texture if it doesn't exist (reuse for same size)
        if (!this.scene.textures.exists(textureKey)) {
            const bubbleBg = this.scene.add.graphics();
            
            // Outer glow/shadow effect (subtle)
            bubbleBg.fillStyle(0x000000, 0.2);
            bubbleBg.fillRoundedRect(2, 2, bubbleWidth, bubbleHeight, 25);
            
            // Main background - more transparent and elegant
            bubbleBg.fillStyle(0xFFFFFF, 0.4); // More transparent (reduced from 0.75)
            bubbleBg.fillRoundedRect(0, 0, bubbleWidth, bubbleHeight, 25); // More rounded (increased from 15)
            
            // Subtle inner highlight for depth
            bubbleBg.fillStyle(0xFFFFFF, 0.2);
            bubbleBg.fillRoundedRect(5, 5, bubbleWidth - 10, bubbleHeight - 10, 20);
            
            // No border - removed as requested
            // Optional: very subtle border if needed (commented out)
            // bubbleBg.lineStyle(1, 0xFFFFFF, 0.3);
            // bubbleBg.strokeRoundedRect(0, 0, bubbleWidth, bubbleHeight, 25);
            
            bubbleBg.generateTexture(textureKey, bubbleWidth, bubbleHeight);
            bubbleBg.destroy();
        }
        
        this.speechBubble = this.scene.add.container(bubbleX, bubbleY);
        
        const bubble = this.scene.add.image(0, 0, textureKey);
        this.speechBubble.add(bubble);
        
        // Store dimensions for position updates
        this.speechBubble.width = bubbleWidth;
        this.speechBubble.height = bubbleHeight;
        
        // Dialogue text with proper word wrapping and clear visibility
        const dialogueText = this.scene.add.text(0, 0, text, {
            fontSize: '18px',
            fill: '#FFFFFF', // White text for better visibility on transparent background
            fontFamily: 'Comic Sans MS, Arial',
            align: 'center',
            fontStyle: 'bold', // Bold for better readability
            stroke: '#000000', // Black stroke for contrast against transparent background
            strokeThickness: 3, // Thick stroke to make text stand out
            shadow: {
                offsetX: 1,
                offsetY: 1,
                color: '#000000',
                blur: 3,
                stroke: true,
                fill: true
            },
            wordWrap: { 
                width: bubbleWidth - 40, // More padding to prevent overflow
                useAdvancedWrap: true // Better wrapping for Vietnamese
            }
        }).setOrigin(0.5);
        this.speechBubble.add(dialogueText);
        
        this.speechBubble.setDepth(301); // Even higher than owl to ensure dialogue is always visible
        
        // Pop-in animation
        this.speechBubble.setScale(0);
        this.scene.tweens.add({
            targets: this.speechBubble,
            scaleX: 1,
            scaleY: 1,
            duration: 300,
            ease: 'Back.easeOut'
        });
        
        // Auto-hide after duration
        if (duration > 0) {
            this.dialogueTimer = this.scene.time.delayedCall(duration, () => {
                this.hideDialogue();
            });
        }
    }

    /**
     * Hide dialogue
     */
    hideDialogue() {
        if (this.dialogueTimer) {
            this.dialogueTimer.remove();
            this.dialogueTimer = null;
        }
        
        if (this.speechBubble) {
            this.scene.tweens.add({
                targets: this.speechBubble,
                scaleX: 0,
                scaleY: 0,
                alpha: 0,
                duration: 200,
                onComplete: () => {
                    this.speechBubble.destroy();
                    this.speechBubble = null;
                }
            });
        }
    }

    /**
     * Destroy owl
     */
    destroy() {
        this.hideDialogue();
        if (this.sprite) {
            this.sprite.destroy();
            this.sprite = null;
        }
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { WiseOwlCharacter };
}

