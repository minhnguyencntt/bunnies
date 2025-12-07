/**
 * ButterflyGenerator - Generates butterfly sprite sheets for magical garden
 * Creates decorative butterflies with flying animations
 */

class ButterflyGenerator {
    constructor(scene) {
        this.scene = scene;
        this.frameWidth = 64;
        this.frameHeight = 64;
    }

    /**
     * Generate a butterfly sprite sheet with flying animation
     * @param {string} butterflyKey - Unique key for this butterfly
     * @param {Object} colorConfig - Color configuration
     * @returns {Object} Animation data
     */
    generateButterfly(butterflyKey, colorConfig) {
        const frames = 10; // Complete wing flap cycle
        const spriteKey = `butterfly_${butterflyKey}_sheet`;
        
        const graphics = this.scene.add.graphics();
        
        for (let frame = 0; frame < frames; frame++) {
            const progress = frame / frames;
            const x = frame * this.frameWidth + this.frameWidth / 2;
            const y = this.frameHeight / 2;
            
            // Wing flap cycle (0-1, repeating)
            const wingCycle = (progress * 2) % 1; // Two flaps per cycle
            const wingAngle = Math.sin(wingCycle * Math.PI * 2) * 0.4; // Wing angle
            
            // Body vertical bobbing
            const bodyBob = Math.sin(progress * Math.PI * 4) * 2;
            
            // Wing squash/stretch
            const wingScaleY = 1 + Math.abs(Math.sin(wingCycle * Math.PI * 2)) * 0.2;
            
            this.drawButterflyFrame(graphics, x, y + bodyBob, colorConfig, {
                wingAngle: wingAngle,
                wingScaleY: wingScaleY,
                frame: frame
            });
        }
        
        graphics.generateTexture(spriteKey, frames * this.frameWidth, this.frameHeight);
        graphics.destroy();
        
        // Add sprite sheet frame configuration
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
                console.warn(`Error configuring butterfly sprite sheet frames for ${spriteKey}:`, error);
            }
        }
        
        return {
            key: spriteKey,
            frames: frames,
            frameWidth: this.frameWidth,
            frameHeight: this.frameHeight
        };
    }

    /**
     * Draw a single butterfly frame
     */
    drawButterflyFrame(graphics, centerX, centerY, colorConfig, params) {
        const { wingAngle, wingScaleY } = params;
        
        // Body (thin, elongated)
        graphics.fillStyle(colorConfig.bodyColor || 0x654321, 1);
        graphics.fillEllipse(centerX, centerY, 3, 8);
        
        // Upper wings (larger)
        const upperWingSize = 20;
        const upperWingY = centerY - 5;
        
        // Left upper wing
        graphics.fillStyle(colorConfig.upperWingColor || 0xFFD700, 0.9);
        this.drawWing(graphics, centerX - 8, upperWingY, upperWingSize, -wingAngle, wingScaleY, colorConfig);
        
        // Right upper wing
        this.drawWing(graphics, centerX + 8, upperWingY, upperWingSize, wingAngle, wingScaleY, colorConfig);
        
        // Lower wings (smaller)
        const lowerWingSize = 15;
        const lowerWingY = centerY + 3;
        
        // Left lower wing
        graphics.fillStyle(colorConfig.lowerWingColor || 0xFFB6C1, 0.8);
        this.drawWing(graphics, centerX - 6, lowerWingY, lowerWingSize, -wingAngle * 0.7, wingScaleY * 0.9, colorConfig);
        
        // Right lower wing
        this.drawWing(graphics, centerX + 6, lowerWingY, lowerWingSize, wingAngle * 0.7, wingScaleY * 0.9, colorConfig);
        
        // Antennas (subtle movement)
        const antennaAngle = Math.sin(wingAngle * 2) * 0.1;
        graphics.lineStyle(1.5, colorConfig.bodyColor || 0x654321, 1);
        graphics.beginPath();
        graphics.moveTo(centerX, centerY - 8);
        graphics.lineTo(centerX - 2 - antennaAngle * 3, centerY - 12);
        graphics.moveTo(centerX, centerY - 8);
        graphics.lineTo(centerX + 2 + antennaAngle * 3, centerY - 12);
        graphics.strokePath();
        
        // Antenna tips (small circles)
        graphics.fillStyle(0xFFD700, 1);
        graphics.fillCircle(centerX - 2 - antennaAngle * 3, centerY - 12, 1.5);
        graphics.fillCircle(centerX + 2 + antennaAngle * 3, centerY - 12, 1.5);
        
        // Optional: Magical shimmer (subtle)
        if (colorConfig.hasShimmer && Math.random() > 0.7) {
            graphics.fillStyle(0xFFFFFF, 0.3);
            graphics.fillCircle(centerX, centerY, 15);
        }
    }

    /**
     * Draw a single wing with proper shape and follow-through
     */
    drawWing(graphics, x, y, size, angle, scaleY, colorConfig) {
        // Wing shape (rounded teardrop)
        const wingWidth = size;
        const wingHeight = size * scaleY;
        
        // Apply rotation effect by offsetting
        const offsetX = Math.sin(angle) * wingHeight * 0.3;
        const offsetY = -Math.cos(angle) * wingHeight * 0.3;
        
        // Draw wing as ellipse with slight rotation effect
        // Note: Phaser graphics doesn't support save/restore, so we calculate rotated position
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        // Approximate rotated ellipse by adjusting dimensions
        const rotatedWidth = Math.abs(wingWidth * cos) + Math.abs(wingHeight * sin);
        const rotatedHeight = Math.abs(wingWidth * sin) + Math.abs(wingHeight * cos);
        
        // Draw rotated ellipse by adjusting position
        graphics.fillEllipse(x + offsetX, y + offsetY, rotatedWidth, rotatedHeight);
        
        // Wing pattern (optional, simple dots)
        if (colorConfig.hasPattern) {
            graphics.fillStyle(0xFFFFFF, 0.4);
            graphics.fillCircle(x + offsetX - 3, y + offsetY - 2, 2);
            graphics.fillCircle(x + offsetX + 3, y + offsetY + 2, 1.5);
        }
    }

    /**
     * Create Phaser animation from sprite sheet
     */
    createButterflyAnimation(butterflyKey) {
        const spriteKey = `butterfly_${butterflyKey}_sheet`;
        const animKey = `butterfly_${butterflyKey}_fly`;
        
        if (!this.scene.textures.exists(spriteKey)) {
            console.warn(`Butterfly texture ${spriteKey} does not exist`);
            return null;
        }
        
        try {
            // Create animation frames
            const frames = this.scene.anims.generateFrameNumbers(spriteKey, {
                start: 0,
                end: 9
            });
            
            if (!frames || frames.length === 0) {
                console.warn(`Could not generate frames for ${spriteKey}`);
                return null;
            }
            
            // Check if animation already exists
            if (this.scene.anims.exists(animKey)) {
                this.scene.anims.remove(animKey);
            }
            
            // Create animation (smooth, loopable)
            this.scene.anims.create({
                key: animKey,
                frames: frames,
                frameRate: 12, // Smooth wing flapping
                repeat: -1 // Loop forever
            });
            
            return animKey;
        } catch (error) {
            console.error(`Error creating butterfly animation ${animKey}:`, error);
            return null;
        }
    }
}

/**
 * Generate multiple butterfly variants with color variations
 */
function generateButterflies(scene, count = 8) {
    const generator = new ButterflyGenerator(scene);
    const butterflies = [];
    
    // Color palette for butterflies (soft, magical colors)
    const colorPalettes = [
        { upperWingColor: 0xFFD700, lowerWingColor: 0xFFB6C1, bodyColor: 0x654321, hasShimmer: true, hasPattern: true }, // Golden pink
        { upperWingColor: 0x87CEEB, lowerWingColor: 0xADD8E6, bodyColor: 0x4A90E2, hasShimmer: false, hasPattern: true }, // Sky blue
        { upperWingColor: 0xFF69B4, lowerWingColor: 0xFFB6C1, bodyColor: 0x8B008B, hasShimmer: true, hasPattern: false }, // Pink
        { upperWingColor: 0x9370DB, lowerWingColor: 0xDDA0DD, bodyColor: 0x6A5ACD, hasShimmer: true, hasPattern: true }, // Purple
        { upperWingColor: 0xFF8C00, lowerWingColor: 0xFFD700, bodyColor: 0x8B4513, hasShimmer: false, hasPattern: true }, // Orange gold
        { upperWingColor: 0x90EE90, lowerWingColor: 0x98FB98, bodyColor: 0x228B22, hasShimmer: false, hasPattern: false }, // Mint green
        { upperWingColor: 0xFF1493, lowerWingColor: 0xFF69B4, bodyColor: 0x8B008B, hasShimmer: true, hasPattern: true }, // Deep pink
        { upperWingColor: 0x00CED1, lowerWingColor: 0x87CEEB, bodyColor: 0x4682B4, hasShimmer: true, hasPattern: false }, // Turquoise
    ];
    
    for (let i = 0; i < count; i++) {
        const colorIndex = i % colorPalettes.length;
        const colorConfig = { ...colorPalettes[colorIndex] };
        
        // Add slight variations
        if (Math.random() > 0.5) {
            colorConfig.hasShimmer = !colorConfig.hasShimmer;
        }
        if (Math.random() > 0.5) {
            colorConfig.hasPattern = !colorConfig.hasPattern;
        }
        
        const butterflyKey = `variant_${i}`;
        
        // Generate sprite sheet
        const animationData = generator.generateButterfly(butterflyKey, colorConfig);
        
        // Create Phaser animation
        const animKey = generator.createButterflyAnimation(butterflyKey);
        
        butterflies.push({
            key: butterflyKey,
            spriteKey: animationData.key,
            animKey: animKey,
            colorConfig: colorConfig
        });
    }
    
    console.log(`Generated ${butterflies.length} butterfly variants`);
    return butterflies;
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ButterflyGenerator, generateButterflies };
}

