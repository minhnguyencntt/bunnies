/**
 * WiseOwlCharacter - Cú Thông Thái (Wise Owl)
 * Main NPC character for Level 1 - Counting Forest
 * Soft cartoon style, friendly and wise expression
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
    }

    /**
     * Generate idle animation sprite sheet
     */
    generateIdleAnimation() {
        const frames = 12;
        const frameWidth = this.size;
        const frameHeight = this.size;
        const spriteKey = 'wise_owl_idle_sheet';
        
        if (this.scene.textures.exists(spriteKey)) {
            return spriteKey;
        }

        const graphics = this.scene.add.graphics();
        
        for (let frame = 0; frame < frames; frame++) {
            const progress = frame / frames;
            const x = frame * frameWidth + frameWidth / 2;
            const y = frameHeight / 2;
            
            // Blinking cycle (every 3 seconds, 0.2s blink)
            const blinkProgress = (progress * 3) % 1;
            const isBlinking = blinkProgress > 0.9;
            
            // Head rotation (subtle, slow)
            const headRotation = Math.sin(progress * Math.PI * 2) * 0.1;
            
            // Wing movement (subtle)
            const wingBob = Math.sin(progress * Math.PI * 4) * 2;
            
            this.drawOwlFrame(graphics, x, y + wingBob, {
                isBlinking: isBlinking,
                headRotation: headRotation,
                frame: frame
            });
        }
        
        graphics.generateTexture(spriteKey, frames * frameWidth, frameHeight);
        graphics.destroy();
        
        // Configure sprite sheet
        if (this.scene.textures.exists(spriteKey)) {
            try {
                const texture = this.scene.textures.get(spriteKey);
                if (texture) {
                    texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
                    for (let i = 0; i < frames; i++) {
                        texture.add(i, 0, i * frameWidth, 0, frameWidth, frameHeight);
                    }
                }
            } catch (error) {
                console.warn(`Error configuring owl sprite sheet:`, error);
            }
        }
        
        return spriteKey;
    }

    /**
     * Draw owl frame
     */
    drawOwlFrame(graphics, centerX, centerY, params) {
        const { isBlinking, headRotation } = params;
        const size = this.size;
        const bodyRadius = size * 0.25;
        
        // Body (rounded, brown and golden)
        graphics.fillStyle(0x8B4513, 1); // Brown
        graphics.fillCircle(centerX, centerY, bodyRadius);
        
        // Golden glow/shimmer
        graphics.fillStyle(0xFFD700, 0.3);
        graphics.fillCircle(centerX - bodyRadius * 0.3, centerY - bodyRadius * 0.3, bodyRadius * 0.4);
        
        // Head (larger, rounded)
        const headRadius = bodyRadius * 0.9;
        const headX = centerX + Math.sin(headRotation) * bodyRadius * 0.2;
        const headY = centerY - bodyRadius * 0.6;
        
        graphics.fillStyle(0x8B4513, 1);
        graphics.fillCircle(headX, headY, headRadius);
        
        // Golden glow on head
        graphics.fillStyle(0xFFD700, 0.4);
        graphics.fillCircle(headX - headRadius * 0.3, headY - headRadius * 0.3, headRadius * 0.4);
        
        // Eyes (large, expressive)
        const eyeSize = headRadius * 0.35;
        const eyeLeftX = headX - headRadius * 0.3;
        const eyeRightX = headX + headRadius * 0.3;
        const eyeY = headY;
        
        if (isBlinking) {
            // Closed eyes (simple line)
            graphics.lineStyle(3, 0x654321, 1);
            graphics.beginPath();
            graphics.moveTo(eyeLeftX - eyeSize * 0.5, eyeY);
            graphics.lineTo(eyeLeftX + eyeSize * 0.5, eyeY);
            graphics.moveTo(eyeRightX - eyeSize * 0.5, eyeY);
            graphics.lineTo(eyeRightX + eyeSize * 0.5, eyeY);
            graphics.strokePath();
        } else {
            // Open eyes
            graphics.fillStyle(0xFFFFFF, 1);
            graphics.fillCircle(eyeLeftX, eyeY, eyeSize);
            graphics.fillCircle(eyeRightX, eyeY, eyeSize);
            
            // Eye color (golden)
            graphics.fillStyle(0xFFD700, 1);
            graphics.fillCircle(eyeLeftX, eyeY, eyeSize * 0.7);
            graphics.fillCircle(eyeRightX, eyeY, eyeSize * 0.7);
            
            // Pupils
            graphics.fillStyle(0x000000, 1);
            graphics.fillCircle(eyeLeftX, eyeY, eyeSize * 0.4);
            graphics.fillCircle(eyeRightX, eyeY, eyeSize * 0.4);
            
            // Eye highlights
            graphics.fillStyle(0xFFFFFF, 1);
            graphics.fillCircle(eyeLeftX - eyeSize * 0.15, eyeY - eyeSize * 0.15, eyeSize * 0.2);
            graphics.fillCircle(eyeRightX - eyeSize * 0.15, eyeY - eyeSize * 0.15, eyeSize * 0.2);
        }
        
        // Beak (small triangle)
        graphics.fillStyle(0xFF8C00, 1);
        graphics.fillTriangle(
            headX, headY + headRadius * 0.3,
            headX - headRadius * 0.15, headY + headRadius * 0.5,
            headX + headRadius * 0.15, headY + headRadius * 0.5
        );
        
        // Wings (subtle movement)
        graphics.fillStyle(0x8B4513, 0.8);
        graphics.fillEllipse(centerX - bodyRadius * 0.6, centerY, bodyRadius * 0.4, bodyRadius * 0.6);
        graphics.fillEllipse(centerX + bodyRadius * 0.6, centerY, bodyRadius * 0.4, bodyRadius * 0.6);
        
        // Feather details
        graphics.fillStyle(0xFFD700, 0.3);
        graphics.fillEllipse(centerX - bodyRadius * 0.6, centerY - bodyRadius * 0.2, bodyRadius * 0.3, bodyRadius * 0.4);
        graphics.fillEllipse(centerX + bodyRadius * 0.6, centerY - bodyRadius * 0.2, bodyRadius * 0.3, bodyRadius * 0.4);
        
        // Feet (simple)
        graphics.fillStyle(0xFF8C00, 1);
        graphics.fillEllipse(centerX - bodyRadius * 0.3, centerY + bodyRadius * 0.8, bodyRadius * 0.2, bodyRadius * 0.15);
        graphics.fillEllipse(centerX + bodyRadius * 0.3, centerY + bodyRadius * 0.8, bodyRadius * 0.2, bodyRadius * 0.15);
    }

    /**
     * Create owl sprite in scene
     */
    create() {
        const spriteKey = this.generateIdleAnimation();
        
        this.sprite = this.scene.add.sprite(this.x, this.y, spriteKey, 0);
        this.sprite.setOrigin(0.5);
        this.sprite.setDepth(100);
        
        // Create idle animation
        if (!this.scene.anims.exists('wise_owl_idle')) {
            this.scene.anims.create({
                key: 'wise_owl_idle',
                frames: this.scene.anims.generateFrameNumbers(spriteKey, { start: 0, end: 11 }),
                frameRate: 8,
                repeat: -1
            });
        }
        
        this.sprite.play('wise_owl_idle');
        
        // Gentle floating animation
        this.scene.tweens.add({
            targets: this.sprite,
            y: this.sprite.y - 5,
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        return this.sprite;
    }

    /**
     * Show dialogue/speech bubble
     */
    showDialogue(text, duration = 3000) {
        // Clear previous dialogue
        this.hideDialogue();
        
        if (!this.sprite) return;
        
        const bubbleWidth = Math.min(300, text.length * 8 + 40);
        const bubbleHeight = 80;
        const bubbleX = this.sprite.x;
        const bubbleY = this.sprite.y - this.size * 0.7;
        
        // Create speech bubble background
        const bubbleBg = this.scene.add.graphics();
        bubbleBg.fillStyle(0xFFFFFF, 0.95);
        bubbleBg.fillRoundedRect(0, 0, bubbleWidth, bubbleHeight, 15);
        bubbleBg.lineStyle(3, 0x8B4513, 1);
        bubbleBg.strokeRoundedRect(0, 0, bubbleWidth, bubbleHeight, 15);
        bubbleBg.generateTexture('speech_bubble', bubbleWidth, bubbleHeight);
        bubbleBg.destroy();
        
        this.speechBubble = this.scene.add.container(bubbleX, bubbleY);
        
        const bubble = this.scene.add.image(0, 0, 'speech_bubble');
        this.speechBubble.add(bubble);
        
        // Dialogue text
        const dialogueText = this.scene.add.text(0, 0, text, {
            fontSize: '18px',
            fill: '#000000',
            fontFamily: 'Comic Sans MS, Arial',
            align: 'center',
            wordWrap: { width: bubbleWidth - 20 }
        }).setOrigin(0.5);
        this.speechBubble.add(dialogueText);
        
        this.speechBubble.setDepth(200);
        
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

