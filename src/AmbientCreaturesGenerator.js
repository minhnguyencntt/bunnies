/**
 * AmbientCreaturesGenerator - Generates fireflies, birds, and magic particles
 * Creates decorative ambient creatures for magical garden
 */

class AmbientCreaturesGenerator {
    constructor(scene) {
        this.scene = scene;
    }

    /**
     * Generate firefly sprite sheet
     */
    generateFirefly(fireflyKey, colorConfig) {
        const frames = 8; // Complete glow cycle
        const frameWidth = 32;
        const frameHeight = 32;
        const spriteKey = `firefly_${fireflyKey}_sheet`;
        
        const graphics = this.scene.add.graphics();
        
        for (let frame = 0; frame < frames; frame++) {
            const progress = frame / frames;
            const x = frame * frameWidth + frameWidth / 2;
            const y = frameHeight / 2;
            
            // Glow intensity (flickering)
            const glowIntensity = 0.6 + Math.sin(progress * Math.PI * 4) * 0.3;
            
            // Body position (slight bobbing)
            const bodyBob = Math.sin(progress * Math.PI * 2) * 1;
            
            this.drawFireflyFrame(graphics, x, y + bodyBob, colorConfig, {
                glowIntensity: glowIntensity,
                frame: frame
            });
        }
        
        graphics.generateTexture(spriteKey, frames * frameWidth, frameHeight);
        graphics.destroy();
        
        // Configure sprite sheet frames
        this.configureSpriteSheet(spriteKey, frames, frameWidth, frameHeight);
        
        return {
            key: spriteKey,
            frames: frames,
            frameWidth: frameWidth,
            frameHeight: frameHeight
        };
    }

    drawFireflyFrame(graphics, centerX, centerY, colorConfig, params) {
        const { glowIntensity } = params;
        const glowColor = colorConfig.glowColor || 0xFFD700;
        
        // Outer glow (larger, more transparent)
        graphics.fillStyle(glowColor, glowIntensity * 0.3);
        graphics.fillCircle(centerX, centerY, 12);
        
        // Middle glow
        graphics.fillStyle(glowColor, glowIntensity * 0.6);
        graphics.fillCircle(centerX, centerY, 8);
        
        // Inner bright core
        graphics.fillStyle(glowColor, glowIntensity);
        graphics.fillCircle(centerX, centerY, 4);
        
        // White center highlight
        graphics.fillStyle(0xFFFFFF, glowIntensity * 0.8);
        graphics.fillCircle(centerX, centerY, 2);
        
        // Body (small, dark)
        graphics.fillStyle(0x2F4F2F, 0.8);
        graphics.fillEllipse(centerX, centerY, 2, 4);
        
        // Wings (very subtle, optional)
        if (colorConfig.hasWings) {
            graphics.fillStyle(0xFFFFFF, glowIntensity * 0.2);
            graphics.fillEllipse(centerX - 2, centerY - 1, 3, 2);
            graphics.fillEllipse(centerX + 2, centerY - 1, 3, 2);
        }
    }

    /**
     * Generate bird sprite sheet
     */
    generateBird(birdKey, colorConfig) {
        const frames = 10; // Complete wing flap cycle
        const frameWidth = 48;
        const frameHeight = 48;
        const spriteKey = `bird_${birdKey}_sheet`;
        
        const graphics = this.scene.add.graphics();
        
        for (let frame = 0; frame < frames; frame++) {
            const progress = frame / frames;
            const x = frame * frameWidth + frameWidth / 2;
            const y = frameHeight / 2;
            
            // Wing flap cycle
            const wingCycle = progress;
            const wingAngle = Math.sin(wingCycle * Math.PI * 2) * 0.5;
            
            // Body bobbing
            const bodyBob = Math.sin(progress * Math.PI * 4) * 2;
            
            // Wing follow-through
            const wingScaleY = 1 + Math.abs(Math.sin(wingCycle * Math.PI * 2)) * 0.3;
            
            this.drawBirdFrame(graphics, x, y + bodyBob, colorConfig, {
                wingAngle: wingAngle,
                wingScaleY: wingScaleY,
                frame: frame
            });
        }
        
        graphics.generateTexture(spriteKey, frames * frameWidth, frameHeight);
        graphics.destroy();
        
        // Configure sprite sheet frames
        this.configureSpriteSheet(spriteKey, frames, frameWidth, frameHeight);
        
        return {
            key: spriteKey,
            frames: frames,
            frameWidth: frameWidth,
            frameHeight: frameHeight
        };
    }

    drawBirdFrame(graphics, centerX, centerY, colorConfig, params) {
        const { wingAngle, wingScaleY } = params;
        const bodyColor = colorConfig.bodyColor || 0xFFD700;
        const wingColor = colorConfig.wingColor || 0xFF8C00;
        
        // Body (rounded)
        graphics.fillStyle(bodyColor, 1);
        graphics.fillEllipse(centerX, centerY, 8, 10);
        
        // Head
        graphics.fillCircle(centerX, centerY - 6, 6);
        
        // Beak (small triangle)
        graphics.fillStyle(0xFF8C00, 1);
        graphics.fillTriangle(centerX, centerY - 8, centerX - 2, centerY - 10, centerX + 2, centerY - 10);
        
        // Eye
        graphics.fillStyle(0x000000, 1);
        graphics.fillCircle(centerX - 2, centerY - 7, 1.5);
        graphics.fillStyle(0xFFFFFF, 1);
        graphics.fillCircle(centerX - 1.5, centerY - 7.5, 0.5);
        
        // Wings (flapping)
        const wingSize = 12;
        const wingY = centerY;
        
        // Left wing
        graphics.fillStyle(wingColor, 0.9);
        const leftWingX = centerX - 6;
        const leftWingOffsetX = Math.sin(-wingAngle) * wingSize * 0.4;
        const leftWingOffsetY = -Math.cos(-wingAngle) * wingSize * 0.4;
        graphics.fillEllipse(leftWingX + leftWingOffsetX, wingY + leftWingOffsetY, wingSize, wingSize * wingScaleY);
        
        // Right wing
        const rightWingX = centerX + 6;
        const rightWingOffsetX = Math.sin(wingAngle) * wingSize * 0.4;
        const rightWingOffsetY = -Math.cos(wingAngle) * wingSize * 0.4;
        graphics.fillEllipse(rightWingX + rightWingOffsetX, wingY + rightWingOffsetY, wingSize, wingSize * wingScaleY);
        
        // Tail (slight movement)
        const tailAngle = Math.sin(wingAngle * 0.5) * 0.2;
        graphics.fillStyle(bodyColor, 1);
        graphics.fillTriangle(
            centerX, centerY + 8,
            centerX - 4 - tailAngle * 5, centerY + 12,
            centerX + 4 + tailAngle * 5, centerY + 12
        );
    }

    /**
     * Generate magic particle sprite sheet
     */
    generateMagicParticle(particleKey, colorConfig) {
        const frames = 6; // Complete cycle
        const frameWidth = 24;
        const frameHeight = 24;
        const spriteKey = `particle_${particleKey}_sheet`;
        
        const graphics = this.scene.add.graphics();
        
        for (let frame = 0; frame < frames; frame++) {
            const progress = frame / frames;
            const x = frame * frameWidth + frameWidth / 2;
            const y = frameHeight / 2;
            
            // Scale variation
            const scale = 0.7 + Math.sin(progress * Math.PI * 2) * 0.3;
            
            // Rotation
            const rotation = progress * Math.PI * 2;
            
            // Glow intensity
            const glowIntensity = 0.5 + Math.sin(progress * Math.PI * 4) * 0.4;
            
            // Alpha (fading)
            const alpha = 0.6 + Math.sin(progress * Math.PI * 2) * 0.3;
            
            this.drawParticleFrame(graphics, x, y, colorConfig, {
                scale: scale,
                rotation: rotation,
                glowIntensity: glowIntensity,
                alpha: alpha,
                frame: frame
            });
        }
        
        graphics.generateTexture(spriteKey, frames * frameWidth, frameHeight);
        graphics.destroy();
        
        // Configure sprite sheet frames
        this.configureSpriteSheet(spriteKey, frames, frameWidth, frameHeight);
        
        return {
            key: spriteKey,
            frames: frames,
            frameWidth: frameWidth,
            frameHeight: frameHeight
        };
    }

    drawParticleFrame(graphics, centerX, centerY, colorConfig, params) {
        const { scale, rotation, glowIntensity, alpha } = params;
        const particleColor = colorConfig.particleColor || 0xFFD700;
        const particleType = colorConfig.type || 'sparkle'; // sparkle, orb, dust
        
        if (particleType === 'sparkle') {
            // Sparkle shape (star-like)
            const size = 8 * scale;
            
            // Outer glow
            graphics.fillStyle(particleColor, glowIntensity * alpha * 0.4);
            graphics.fillCircle(centerX, centerY, size * 1.5);
            
            // Main sparkle
            graphics.fillStyle(particleColor, glowIntensity * alpha);
            for (let i = 0; i < 4; i++) {
                const angle = (i * Math.PI / 2) + rotation;
                const x1 = centerX + Math.cos(angle) * size;
                const y1 = centerY + Math.sin(angle) * size;
                const x2 = centerX + Math.cos(angle + Math.PI / 4) * size * 0.6;
                const y2 = centerY + Math.sin(angle + Math.PI / 4) * size * 0.6;
                
                graphics.fillCircle(x1, y1, size * 0.3);
                graphics.fillCircle(x2, y2, size * 0.2);
            }
            
            // Center
            graphics.fillStyle(0xFFFFFF, glowIntensity * alpha * 0.9);
            graphics.fillCircle(centerX, centerY, size * 0.4);
            
        } else if (particleType === 'orb') {
            // Magic orb
            const size = 6 * scale;
            
            // Outer glow
            graphics.fillStyle(particleColor, glowIntensity * alpha * 0.3);
            graphics.fillCircle(centerX, centerY, size * 2);
            
            // Middle glow
            graphics.fillStyle(particleColor, glowIntensity * alpha * 0.6);
            graphics.fillCircle(centerX, centerY, size * 1.3);
            
            // Core
            graphics.fillStyle(particleColor, glowIntensity * alpha);
            graphics.fillCircle(centerX, centerY, size);
            
            // Highlight
            graphics.fillStyle(0xFFFFFF, glowIntensity * alpha * 0.8);
            graphics.fillCircle(centerX - size * 0.3, centerY - size * 0.3, size * 0.4);
            
        } else if (particleType === 'dust') {
            // Dust mote (small, simple)
            const size = 4 * scale;
            
            graphics.fillStyle(particleColor, glowIntensity * alpha * 0.7);
            graphics.fillCircle(centerX, centerY, size);
            
            // Glow
            graphics.fillStyle(particleColor, glowIntensity * alpha * 0.3);
            graphics.fillCircle(centerX, centerY, size * 1.5);
        }
    }

    /**
     * Configure sprite sheet with frames
     */
    configureSpriteSheet(spriteKey, frames, frameWidth, frameHeight) {
        if (this.scene.textures.exists(spriteKey)) {
            try {
                const texture = this.scene.textures.get(spriteKey);
                if (texture) {
                    texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
                    
                    // Add frames for sprite sheet
                    if (texture.frameTotal === 0 || texture.frameTotal < frames) {
                        for (let i = 0; i < frames; i++) {
                            texture.add(i, 0, i * frameWidth, 0, frameWidth, frameHeight);
                        }
                    }
                }
            } catch (error) {
                console.warn(`Error configuring sprite sheet frames for ${spriteKey}:`, error);
            }
        }
    }

    /**
     * Create Phaser animation from sprite sheet
     */
    createAnimation(creatureKey, spriteKey, frames, frameRate = 10) {
        const animKey = `${creatureKey}_fly`;
        
        if (!this.scene.textures.exists(spriteKey)) {
            console.warn(`Texture ${spriteKey} does not exist`);
            return null;
        }
        
        try {
            const animFrames = this.scene.anims.generateFrameNumbers(spriteKey, {
                start: 0,
                end: frames - 1
            });
            
            if (!animFrames || animFrames.length === 0) {
                console.warn(`Could not generate frames for ${spriteKey}`);
                return null;
            }
            
            if (this.scene.anims.exists(animKey)) {
                this.scene.anims.remove(animKey);
            }
            
            this.scene.anims.create({
                key: animKey,
                frames: animFrames,
                frameRate: frameRate,
                repeat: -1
            });
            
            return animKey;
        } catch (error) {
            console.error(`Error creating animation ${animKey}:`, error);
            return null;
        }
    }
}

/**
 * Generate all fireflies
 */
function generateFireflies(scene, count = 6) {
    const generator = new AmbientCreaturesGenerator(scene);
    const fireflies = [];
    
    const colorPalettes = [
        { glowColor: 0xFFD700, hasWings: false }, // Golden
        { glowColor: 0x87CEEB, hasWings: true },  // Sky blue
        { glowColor: 0xFF69B4, hasWings: false }, // Pink
        { glowColor: 0x90EE90, hasWings: true }, // Light green
        { glowColor: 0xFF8C00, hasWings: false }, // Orange
        { glowColor: 0xDDA0DD, hasWings: true },  // Plum
    ];
    
    for (let i = 0; i < count; i++) {
        const colorIndex = i % colorPalettes.length;
        const colorConfig = { ...colorPalettes[colorIndex] };
        
        const fireflyKey = `firefly_${i}`;
        const animationData = generator.generateFirefly(fireflyKey, colorConfig);
        const animKey = generator.createAnimation('firefly', animationData.key, animationData.frames, 8);
        
        fireflies.push({
            key: fireflyKey,
            spriteKey: animationData.key,
            animKey: animKey,
            colorConfig: colorConfig,
            type: 'firefly'
        });
    }
    
    console.log(`Generated ${fireflies.length} fireflies`);
    return fireflies;
}

/**
 * Generate all birds
 */
function generateBirds(scene, count = 4) {
    const generator = new AmbientCreaturesGenerator(scene);
    const birds = [];
    
    const colorPalettes = [
        { bodyColor: 0xFFD700, wingColor: 0xFF8C00 }, // Golden
        { bodyColor: 0x87CEEB, wingColor: 0x4A90E2 }, // Blue
        { bodyColor: 0xFF69B4, wingColor: 0xFF1493 }, // Pink
        { bodyColor: 0x90EE90, wingColor: 0x32CD32 }, // Green
        { bodyColor: 0x9370DB, wingColor: 0x8A2BE2 }, // Purple
    ];
    
    for (let i = 0; i < count; i++) {
        const colorIndex = i % colorPalettes.length;
        const colorConfig = { ...colorPalettes[colorIndex] };
        
        const birdKey = `bird_${i}`;
        const animationData = generator.generateBird(birdKey, colorConfig);
        const animKey = generator.createAnimation('bird', animationData.key, animationData.frames, 10);
        
        birds.push({
            key: birdKey,
            spriteKey: animationData.key,
            animKey: animKey,
            colorConfig: colorConfig,
            type: 'bird'
        });
    }
    
    console.log(`Generated ${birds.length} birds`);
    return birds;
}

/**
 * Generate all magic particles
 */
function generateMagicParticles(scene, count = 8) {
    const generator = new AmbientCreaturesGenerator(scene);
    const particles = [];
    
    const particleTypes = ['sparkle', 'orb', 'dust'];
    const colorPalettes = [
        { particleColor: 0xFFD700 }, // Golden
        { particleColor: 0x87CEEB }, // Sky blue
        { particleColor: 0xFF69B4 }, // Pink
        { particleColor: 0x90EE90 }, // Light green
        { particleColor: 0x9370DB }, // Purple
        { particleColor: 0xFF8C00 }, // Orange
    ];
    
    for (let i = 0; i < count; i++) {
        const typeIndex = i % particleTypes.length;
        const colorIndex = i % colorPalettes.length;
        const colorConfig = {
            ...colorPalettes[colorIndex],
            type: particleTypes[typeIndex]
        };
        
        const particleKey = `particle_${i}`;
        const animationData = generator.generateMagicParticle(particleKey, colorConfig);
        const animKey = generator.createAnimation('particle', animationData.key, animationData.frames, 8);
        
        particles.push({
            key: particleKey,
            spriteKey: animationData.key,
            animKey: animKey,
            colorConfig: colorConfig,
            type: 'particle'
        });
    }
    
    console.log(`Generated ${particles.length} magic particles`);
    return particles;
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        AmbientCreaturesGenerator,
        generateFireflies,
        generateBirds,
        generateMagicParticles
    };
}

