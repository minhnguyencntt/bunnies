/**
 * WiseOwlAnimationGenerator - Generates complete sprite sheet animations for the wise owl character
 * Creates all required animations programmatically using Phaser graphics
 * Outputs sprite sheets compatible with Phaser 3
 * 
 * Animation States:
 * - Idle/Neutral (4 frames)
 * - Cheering/Applauding (6 frames)
 * - Encouraging/Motivating (4 frames)
 * - Sad/Disappointed (4 frames)
 * - Celebrating/Excited (6 frames)
 */

class WiseOwlAnimationGenerator {
    constructor(scene) {
        this.scene = scene;
        this.frameWidth = 128; // Can be changed to 64 for smaller games
        this.frameHeight = 128;
    }

    /**
     * Generate all animations for the wise owl
     * @returns {Object} Object with animation keys and sprite sheet keys
     */
    generateAllAnimations() {
        const animations = {};

        // Generate each animation
        animations.idle = this.generateIdleAnimation();
        animations.cheering = this.generateCheeringAnimation();
        animations.encouraging = this.generateEncouragingAnimation();
        animations.sad = this.generateSadAnimation();
        animations.celebrating = this.generateCelebratingAnimation();

        return animations;
    }

    /**
     * Generate Idle/Neutral Animation (4 frames)
     * Calm, slight blinking, wings relaxed
     */
    generateIdleAnimation() {
        const frames = 4;
        const spriteKey = 'wise_owl_idle_sheet';
        const graphics = this.scene.add.graphics();
        
        for (let frame = 0; frame < frames; frame++) {
            const progress = frame / frames;
            const x = frame * this.frameWidth + this.frameWidth / 2;
            const y = this.frameHeight / 2;
            
            // Gentle breathing
            const breathScale = 1 + Math.sin(progress * Math.PI * 2) * 0.03;
            
            // Subtle head movement
            const headBob = Math.sin(progress * Math.PI * 2) * 1;
            
            // Blinking (frame 2 is blink)
            const isBlinking = frame === 2;
            
            // Subtle wing movement
            const wingBob = Math.sin(progress * Math.PI * 2) * 1;
            
            this.drawOwlFrame(graphics, x, y + headBob, {
                scale: breathScale,
                isBlinking: isBlinking,
                wingPosition: wingBob,
                expression: 'neutral',
                headRotation: Math.sin(progress * Math.PI * 2) * 0.05
            });
        }
        
        // Generate texture as sprite sheet
        graphics.generateTexture(spriteKey, frames * this.frameWidth, this.frameHeight);
        graphics.destroy();
        
        // Configure sprite sheet frames
        this.configureSpriteSheet(spriteKey, frames);
        
        return {
            key: spriteKey,
            frames: frames,
            frameWidth: this.frameWidth,
            frameHeight: this.frameHeight
        };
    }

    /**
     * Generate Cheering/Applauding Animation (6 frames)
     * Wings raised, eyes bright, happy smile, clapping motion
     */
    generateCheeringAnimation() {
        const frames = 6;
        const spriteKey = 'wise_owl_cheering_sheet';
        const graphics = this.scene.add.graphics();
        
        for (let frame = 0; frame < frames; frame++) {
            const progress = frame / frames;
            const x = frame * this.frameWidth + this.frameWidth / 2;
            const y = this.frameHeight / 2;
            
            // Clapping motion (wings coming together and apart)
            const clapPhase = (progress * 2) % 1; // Two claps per cycle
            const wingSpread = Math.abs(Math.sin(clapPhase * Math.PI * 2)) * 0.4;
            const wingHeight = -Math.sin(clapPhase * Math.PI * 2) * 15;
            
            // Head bobbing with excitement
            const headBob = Math.sin(progress * Math.PI * 4) * 2;
            
            // Eyes bright (wider)
            const eyeBrightness = 1 + Math.sin(progress * Math.PI * 2) * 0.2;
            
            this.drawOwlFrame(graphics, x, y + headBob, {
                wingPosition: wingHeight,
                wingSpread: wingSpread,
                expression: 'cheering',
                eyeBrightness: eyeBrightness,
                headRotation: Math.sin(progress * Math.PI * 4) * 0.1
            });
        }
        
        graphics.generateTexture(spriteKey, frames * this.frameWidth, this.frameHeight);
        graphics.destroy();
        this.configureSpriteSheet(spriteKey, frames);
        
        return {
            key: spriteKey,
            frames: frames,
            frameWidth: this.frameWidth,
            frameHeight: this.frameHeight
        };
    }

    /**
     * Generate Encouraging/Motivating Animation (4 frames)
     * Wings slightly stretched forward, head nodding, friendly expression
     */
    generateEncouragingAnimation() {
        const frames = 4;
        const spriteKey = 'wise_owl_encouraging_sheet';
        const graphics = this.scene.add.graphics();
        
        for (let frame = 0; frame < frames; frame++) {
            const progress = frame / frames;
            const x = frame * this.frameWidth + this.frameWidth / 2;
            const y = this.frameHeight / 2;
            
            // Head nodding motion
            const nodPhase = Math.sin(progress * Math.PI * 2);
            const headNod = nodPhase * 3;
            const headRotation = nodPhase * 0.1;
            
            // Wings forward (encouraging gesture)
            const wingForward = Math.abs(nodPhase) * 0.3;
            
            this.drawOwlFrame(graphics, x, y + headNod, {
                wingPosition: 0,
                wingForward: wingForward,
                expression: 'encouraging',
                headRotation: headRotation,
                eyeBrightness: 1.1
            });
        }
        
        graphics.generateTexture(spriteKey, frames * this.frameWidth, this.frameHeight);
        graphics.destroy();
        this.configureSpriteSheet(spriteKey, frames);
        
        return {
            key: spriteKey,
            frames: frames,
            frameWidth: this.frameWidth,
            frameHeight: this.frameHeight
        };
    }

    /**
     * Generate Sad/Disappointed Animation (4 frames)
     * Drooping wings, eyes slightly closed, small frown
     */
    generateSadAnimation() {
        const frames = 4;
        const spriteKey = 'wise_owl_sad_sheet';
        const graphics = this.scene.add.graphics();
        
        for (let frame = 0; frame < frames; frame++) {
            const progress = frame / frames;
            const x = frame * this.frameWidth + this.frameWidth / 2;
            const y = this.frameHeight / 2;
            
            // Slight drooping motion
            const droop = Math.sin(progress * Math.PI * 2) * 2;
            
            // Eyes more closed (sad)
            const eyeClose = 0.6 + Math.sin(progress * Math.PI * 2) * 0.1;
            
            // Head slightly down
            const headDown = Math.sin(progress * Math.PI * 2) * 2;
            
            this.drawOwlFrame(graphics, x, y + headDown, {
                wingPosition: droop,
                wingDroop: 0.3,
                expression: 'sad',
                eyeClose: eyeClose,
                headRotation: -0.05
            });
        }
        
        graphics.generateTexture(spriteKey, frames * this.frameWidth, this.frameHeight);
        graphics.destroy();
        this.configureSpriteSheet(spriteKey, frames);
        
        return {
            key: spriteKey,
            frames: frames,
            frameWidth: this.frameWidth,
            frameHeight: this.frameHeight
        };
    }

    /**
     * Generate Celebrating/Excited Animation (6 frames)
     * Wings flapping joyfully, wide eyes, beak open in happiness, optional sparkles
     */
    generateCelebratingAnimation() {
        const frames = 6;
        const spriteKey = 'wise_owl_celebrating_sheet';
        const graphics = this.scene.add.graphics();
        
        for (let frame = 0; frame < frames; frame++) {
            const progress = frame / frames;
            const x = frame * this.frameWidth + this.frameWidth / 2;
            const y = this.frameHeight / 2;
            
            // Joyful wing flapping
            const flapPhase = progress * Math.PI * 4; // Two full flaps
            const wingFlap = Math.sin(flapPhase) * 20;
            const wingAngle = Math.sin(flapPhase) * 0.3;
            
            // Bouncing with excitement
            const bounce = Math.abs(Math.sin(flapPhase)) * 3;
            
            // Wide eyes (excited)
            const eyeWideness = 1.3 + Math.sin(flapPhase) * 0.2;
            
            // Sparkles appear on certain frames
            const showSparkles = frame % 2 === 0;
            
            this.drawOwlFrame(graphics, x, y - bounce, {
                wingPosition: wingFlap,
                wingAngle: wingAngle,
                expression: 'celebrating',
                eyeWideness: eyeWideness,
                beakOpen: true,
                showSparkles: showSparkles,
                headRotation: Math.sin(flapPhase) * 0.15
            });
        }
        
        graphics.generateTexture(spriteKey, frames * this.frameWidth, this.frameHeight);
        graphics.destroy();
        this.configureSpriteSheet(spriteKey, frames);
        
        return {
            key: spriteKey,
            frames: frames,
            frameWidth: this.frameWidth,
            frameHeight: this.frameHeight
        };
    }

    /**
     * Draw a single owl frame
     * @param {Phaser.GameObjects.Graphics} graphics - Graphics object to draw on
     * @param {number} centerX - X center position
     * @param {number} centerY - Y center position
     * @param {Object} params - Animation parameters
     */
    drawOwlFrame(graphics, centerX, centerY, params = {}) {
        const {
            scale = 1,
            isBlinking = false,
            wingPosition = 0,
            wingSpread = 0,
            wingForward = 0,
            wingDroop = 0,
            wingAngle = 0,
            expression = 'neutral',
            headRotation = 0,
            eyeBrightness = 1,
            eyeClose = 1,
            eyeWideness = 1,
            beakOpen = false,
            showSparkles = false
        } = params;

        const size = Math.min(this.frameWidth, this.frameHeight) * 0.8 * scale;
        const bodyRadius = size * 0.25;
        const headRadius = bodyRadius * 0.9;

        // Body (white/cream with soft shading)
        const bodyColor = 0xF5F5DC; // Beige/cream white
        const bodyShadow = 0xE8E8E8;
        
        // Main body circle
        graphics.fillStyle(bodyColor, 1);
        graphics.fillCircle(centerX, centerY, bodyRadius);
        
        // Soft highlight on body
        graphics.fillStyle(0xFFFFFF, 0.4);
        graphics.fillCircle(centerX - bodyRadius * 0.3, centerY - bodyRadius * 0.3, bodyRadius * 0.4);
        
        // Body shadow for depth
        graphics.fillStyle(bodyShadow, 0.3);
        graphics.fillCircle(centerX + bodyRadius * 0.2, centerY + bodyRadius * 0.2, bodyRadius * 0.3);

        // Head (larger, rounded, with rotation)
        const headX = centerX + Math.sin(headRotation) * bodyRadius * 0.2;
        const headY = centerY - bodyRadius * 0.6 + Math.cos(headRotation) * bodyRadius * 0.1;
        
        graphics.fillStyle(bodyColor, 1);
        graphics.fillCircle(headX, headY, headRadius);
        
        // Head highlight
        graphics.fillStyle(0xFFFFFF, 0.5);
        graphics.fillCircle(headX - headRadius * 0.3, headY - headRadius * 0.3, headRadius * 0.4);

        // Eyes (large, expressive, behind glasses)
        const eyeSize = headRadius * 0.35 * eyeWideness;
        const eyeLeftX = headX - headRadius * 0.3;
        const eyeRightX = headX + headRadius * 0.3;
        const eyeY = headY;

        if (isBlinking || eyeClose < 1) {
            // Closed eyes (simple curved line)
            const closeAmount = isBlinking ? 1 : (1 - eyeClose);
            graphics.lineStyle(3, 0x654321, 1);
            graphics.beginPath();
            graphics.arc(eyeLeftX, eyeY, eyeSize * 0.5, 0, Math.PI, false);
            graphics.strokePath();
            graphics.beginPath();
            graphics.arc(eyeRightX, eyeY, eyeSize * 0.5, 0, Math.PI, false);
            graphics.strokePath();
        } else {
            // Open eyes (bright and expressive)
            // Eye whites
            graphics.fillStyle(0xFFFFFF, 1);
            graphics.fillCircle(eyeLeftX, eyeY, eyeSize);
            graphics.fillCircle(eyeRightX, eyeY, eyeSize);
            
            // Eye color (golden/amber - wise and intelligent)
            const eyeColor = 0xFFD700; // Gold
            graphics.fillStyle(eyeColor, eyeBrightness);
            graphics.fillCircle(eyeLeftX, eyeY, eyeSize * 0.7);
            graphics.fillCircle(eyeRightX, eyeY, eyeSize * 0.7);
            
            // Pupils
            graphics.fillStyle(0x000000, 1);
            graphics.fillCircle(eyeLeftX, eyeY, eyeSize * 0.4);
            graphics.fillCircle(eyeRightX, eyeY, eyeSize * 0.4);
            
            // Eye highlights (bright and cheerful)
            graphics.fillStyle(0xFFFFFF, 1);
            graphics.fillCircle(eyeLeftX - eyeSize * 0.15, eyeY - eyeSize * 0.15, eyeSize * 0.25);
            graphics.fillCircle(eyeRightX - eyeSize * 0.15, eyeY - eyeSize * 0.15, eyeSize * 0.25);
        }

        // Round glasses (characteristic feature)
        const glassesRadius = headRadius * 0.5;
        const glassesThickness = 3;
        const glassesColor = 0x4A4A4A; // Dark gray/black
        
        // Left lens
        graphics.lineStyle(glassesThickness, glassesColor, 1);
        graphics.strokeCircle(eyeLeftX, eyeY, glassesRadius);
        
        // Right lens
        graphics.strokeCircle(eyeRightX, eyeY, glassesRadius);
        
        // Bridge between lenses
        graphics.lineStyle(glassesThickness, glassesColor, 1);
        graphics.beginPath();
        graphics.moveTo(eyeLeftX + glassesRadius * 0.7, eyeY);
        graphics.lineTo(eyeRightX - glassesRadius * 0.7, eyeY);
        graphics.strokePath();
        
        // Glasses reflection (subtle highlight)
        graphics.fillStyle(0xFFFFFF, 0.2);
        graphics.fillCircle(eyeLeftX - glassesRadius * 0.3, eyeY - glassesRadius * 0.3, glassesRadius * 0.3);
        graphics.fillCircle(eyeRightX - glassesRadius * 0.3, eyeY - glassesRadius * 0.3, glassesRadius * 0.3);

        // Beak (small triangle, can be open)
        const beakY = headY + headRadius * 0.3;
        if (beakOpen) {
            // Open beak (happiness)
            graphics.fillStyle(0xFF8C00, 1);
            graphics.fillCircle(headX, beakY, headRadius * 0.15);
            // Inside of beak (darker)
            graphics.fillStyle(0xFF6347, 1);
            graphics.fillCircle(headX, beakY, headRadius * 0.1);
        } else {
            // Closed beak
            graphics.fillStyle(0xFF8C00, 1);
            graphics.fillTriangle(
                headX, beakY,
                headX - headRadius * 0.15, beakY + headRadius * 0.2,
                headX + headRadius * 0.15, beakY + headRadius * 0.2
            );
        }

        // Wings (expressive, can move)
        const wingBaseX = centerX;
        const wingBaseY = centerY;
        const wingWidth = bodyRadius * 0.4;
        const wingHeight = bodyRadius * 0.6;
        
        // Left wing
        const leftWingX = wingBaseX - bodyRadius * 0.6;
        const leftWingY = wingBaseY + wingPosition + (wingDroop * 10);
        const leftWingRotation = -wingAngle + wingForward * 0.3;
        
        // Draw rotated left wing using ellipse with calculated position
        const leftWingWidth = wingWidth * (1 + wingSpread);
        const leftWingHeight = wingHeight;
        
        // For rotation, we'll approximate with an ellipse at an angle
        // Since Phaser graphics doesn't support rotation directly, we'll adjust the position
        const leftWingOffsetX = Math.sin(leftWingRotation) * wingHeight * 0.3;
        const leftWingOffsetY = -Math.cos(leftWingRotation) * wingHeight * 0.3;
        
        graphics.fillStyle(bodyColor, 0.9);
        graphics.fillEllipse(
            leftWingX + leftWingOffsetX, 
            leftWingY + leftWingOffsetY, 
            leftWingWidth, 
            leftWingHeight
        );
        
        // Wing feather details
        graphics.fillStyle(0xFFFFFF, 0.3);
        graphics.fillEllipse(
            leftWingX + leftWingOffsetX, 
            leftWingY + leftWingOffsetY - wingHeight * 0.2, 
            leftWingWidth * 0.7, 
            wingHeight * 0.5
        );
        
        // Right wing
        const rightWingX = wingBaseX + bodyRadius * 0.6;
        const rightWingY = wingBaseY + wingPosition + (wingDroop * 10);
        const rightWingRotation = wingAngle - wingForward * 0.3;
        
        const rightWingWidth = wingWidth * (1 + wingSpread);
        const rightWingHeight = wingHeight;
        
        const rightWingOffsetX = -Math.sin(rightWingRotation) * wingHeight * 0.3;
        const rightWingOffsetY = -Math.cos(rightWingRotation) * wingHeight * 0.3;
        
        graphics.fillStyle(bodyColor, 0.9);
        graphics.fillEllipse(
            rightWingX + rightWingOffsetX, 
            rightWingY + rightWingOffsetY, 
            rightWingWidth, 
            rightWingHeight
        );
        
        // Wing feather details
        graphics.fillStyle(0xFFFFFF, 0.3);
        graphics.fillEllipse(
            rightWingX + rightWingOffsetX, 
            rightWingY + rightWingOffsetY - wingHeight * 0.2, 
            rightWingWidth * 0.7, 
            wingHeight * 0.5
        );

        // Feet (simple, cute)
        graphics.fillStyle(0xFF8C00, 1);
        const footSize = bodyRadius * 0.15;
        graphics.fillEllipse(centerX - bodyRadius * 0.3, centerY + bodyRadius * 0.8, footSize, footSize * 0.8);
        graphics.fillEllipse(centerX + bodyRadius * 0.3, centerY + bodyRadius * 0.8, footSize, footSize * 0.8);

        // Expression-specific details
        if (expression === 'cheering' || expression === 'celebrating') {
            // Happy smile (curved line)
            graphics.lineStyle(2, 0xFF8C00, 1);
            graphics.beginPath();
            graphics.arc(headX, beakY + headRadius * 0.2, headRadius * 0.15, 0.2, Math.PI - 0.2, false);
            graphics.strokePath();
        } else if (expression === 'sad') {
            // Small frown
            graphics.lineStyle(2, 0xFF8C00, 1);
            graphics.beginPath();
            graphics.arc(headX, beakY + headRadius * 0.25, headRadius * 0.1, Math.PI + 0.2, -0.2, false);
            graphics.strokePath();
        } else if (expression === 'encouraging') {
            // Friendly, gentle smile
            graphics.lineStyle(2, 0xFF8C00, 1);
            graphics.beginPath();
            graphics.arc(headX, beakY + headRadius * 0.15, headRadius * 0.12, 0.3, Math.PI - 0.3, false);
            graphics.strokePath();
        }

        // Sparkles for celebrating animation
        if (showSparkles) {
            this.drawSparkles(graphics, centerX, centerY, bodyRadius);
        }

        // Magical glow (subtle, optional)
        if (expression === 'celebrating' || expression === 'cheering') {
            graphics.fillStyle(0xFFD700, 0.2);
            graphics.fillCircle(centerX, centerY, bodyRadius * 1.5);
        }
    }

    /**
     * Draw sparkles around the owl
     */
    drawSparkles(graphics, centerX, centerY, bodyRadius) {
        const sparkleCount = 6;
        for (let i = 0; i < sparkleCount; i++) {
            const angle = (i * 360 / sparkleCount) * Math.PI / 180;
            const distance = bodyRadius * 0.9;
            const sparkleX = centerX + Math.cos(angle) * distance;
            const sparkleY = centerY + Math.sin(angle) * distance;
            
            // Star sparkle
            graphics.fillStyle(0xFFD700, 1);
            this.drawStar(graphics, sparkleX, sparkleY, bodyRadius * 0.1);
            
            // Outer glow
            graphics.fillStyle(0xFFFFFF, 0.5);
            graphics.fillCircle(sparkleX, sparkleY, bodyRadius * 0.05);
        }
    }

    /**
     * Draw a star shape
     */
    drawStar(graphics, x, y, size) {
        const points = 5;
        const outerRadius = size;
        const innerRadius = size * 0.5;
        
        graphics.beginPath();
        for (let i = 0; i < points * 2; i++) {
            const radius = i % 2 === 0 ? outerRadius : innerRadius;
            const angle = (i * Math.PI) / points - Math.PI / 2;
            const px = x + Math.cos(angle) * radius;
            const py = y + Math.sin(angle) * radius;
            if (i === 0) {
                graphics.moveTo(px, py);
            } else {
                graphics.lineTo(px, py);
            }
        }
        graphics.closePath();
        graphics.fillPath();
    }

    /**
     * Configure sprite sheet frames for Phaser
     */
    configureSpriteSheet(spriteKey, frames) {
        if (this.scene.textures.exists(spriteKey)) {
            try {
                const texture = this.scene.textures.get(spriteKey);
                if (texture) {
                    texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
                    
                    // Add frames for sprite sheet
                    if (texture.frameTotal === 0 || texture.frameTotal < frames) {
                        for (let i = 0; i < frames; i++) {
                            texture.add(i, 0, i * this.frameWidth, 0, this.frameWidth, this.frameHeight);
                        }
                    }
                }
            } catch (error) {
                console.warn(`Error configuring sprite sheet frames for ${spriteKey}:`, error);
            }
        }
    }

    /**
     * Create Phaser 3 animations from generated sprite sheets
     */
    createPhaserAnimations() {
        const animations = {};
        
        const animationConfigs = [
            { key: 'idle', frameRate: 8, repeat: -1, yoyo: true },
            { key: 'cheering', frameRate: 10, repeat: -1 },
            { key: 'encouraging', frameRate: 8, repeat: -1, yoyo: true },
            { key: 'sad', frameRate: 6, repeat: -1, yoyo: true },
            { key: 'celebrating', frameRate: 12, repeat: -1 }
        ];

        animationConfigs.forEach(config => {
            const spriteKey = `wise_owl_${config.key}_sheet`;
            
            if (!this.scene.textures.exists(spriteKey)) {
                console.warn(`Sprite sheet ${spriteKey} does not exist`);
                return;
            }

            const texture = this.scene.textures.get(spriteKey);
            const frameCount = texture.frameTotal || 4; // Default to 4 if unknown
            
            try {
                const animKey = `wise_owl_${config.key}`;
                
                // Check if animation already exists
                if (this.scene.anims.exists(animKey)) {
                    this.scene.anims.remove(animKey);
                }
                
                this.scene.anims.create({
                    key: animKey,
                    frames: this.scene.anims.generateFrameNumbers(spriteKey, { start: 0, end: frameCount - 1 }),
                    frameRate: config.frameRate,
                    repeat: config.repeat !== undefined ? config.repeat : -1,
                    yoyo: config.yoyo || false
                });
                
                animations[config.key] = animKey;
            } catch (error) {
                console.error(`Error creating animation ${config.key}:`, error);
            }
        });
        
        return animations;
    }
}

/**
 * Generate all wise owl animations
 * Call this during BootScene to pre-generate all animations
 */
function generateWiseOwlAnimations(scene) {
    const generator = new WiseOwlAnimationGenerator(scene);
    const animationData = generator.generateAllAnimations();
    const animations = generator.createPhaserAnimations();
    
    console.log('Wise owl animations generated!', animationData);
    return { animationData, animations };
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { WiseOwlAnimationGenerator, generateWiseOwlAnimations };
}

