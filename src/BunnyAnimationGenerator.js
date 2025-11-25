/**
 * BunnyAnimationGenerator - Generates complete sprite sheet animations for bunny characters
 * Creates all required animations programmatically using Phaser graphics
 * Outputs sprite sheets compatible with Phaser 3
 */

class BunnyAnimationGenerator {
    constructor(scene) {
        this.scene = scene;
        this.frameWidth = 128;
        this.frameHeight = 128;
    }

    /**
     * Generate all animations for a bunny character
     * @param {Object} charConfig - Character configuration from BUNNY_CHARACTERS
     * @returns {Object} Object with animation keys and sprite sheet keys
     */
    generateAllAnimations(charConfig) {
        const charName = charConfig.name.toLowerCase();
        const animations = {};

        // Generate each animation
        animations.idle = this.generateIdleAnimation(charConfig, charName);
        animations.runRight = this.generateRunRightAnimation(charConfig, charName);
        animations.runLeft = this.generateRunLeftAnimation(charConfig, charName);
        animations.jump = this.generateJumpAnimation(charConfig, charName);
        animations.victory = this.generateVictoryAnimation(charConfig, charName);
        animations.sleep = this.generateSleepAnimation(charConfig, charName);
        animations.hit = this.generateHitAnimation(charConfig, charName);
        animations.dance = this.generateDanceAnimation(charConfig, charName);
        animations.talk = this.generateTalkAnimation(charConfig, charName);

        return animations;
    }

    /**
     * Generate Idle Animation (12-16 frames)
     * Gentle breathing, ear wiggle, blinking, head bob
     */
    generateIdleAnimation(charConfig, charName) {
        const frames = 14;
        const spriteKey = `bunny_${charName}_idle_sheet`;
        const graphics = this.scene.add.graphics();
        
        for (let frame = 0; frame < frames; frame++) {
            const progress = frame / frames;
            const x = frame * this.frameWidth + this.frameWidth / 2;
            const y = this.frameHeight / 2;
            
            // Breathing cycle (0-1)
            const breathScale = 1 + Math.sin(progress * Math.PI * 4) * 0.05;
            
            // Head bob (subtle)
            const headBob = Math.sin(progress * Math.PI * 2) * 2;
            
            // Ear wiggle
            const earWiggle = Math.sin(progress * Math.PI * 6) * 0.1;
            
            // Blinking (every 3 seconds, 2 frames)
            const isBlinking = (Math.floor(progress * 14) % 14 === 13 || Math.floor(progress * 14) % 14 === 0);
            
            this.drawBunnyFrame(graphics, x, y + headBob, charConfig, {
                scale: breathScale,
                earAngle: earWiggle,
                eyeState: isBlinking ? 'closed' : 'open',
                pose: 'idle'
            });
        }
        
        // Generate texture as sprite sheet
        graphics.generateTexture(spriteKey, frames * this.frameWidth, this.frameHeight);
        graphics.destroy();
        
        // Add sprite sheet frame configuration
        if (this.scene.textures.exists(spriteKey)) {
            try {
                const texture = this.scene.textures.get(spriteKey);
                if (texture) {
                    texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
                    
                    // Add frames for sprite sheet (if not already added)
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
        
        return {
            key: spriteKey,
            frames: frames,
            frameWidth: this.frameWidth,
            frameHeight: this.frameHeight
        };
    }

    /**
     * Generate Run Right Animation (8-12 frames)
     * Natural running cycle with ear bounce and tail follow-through
     */
    generateRunRightAnimation(charConfig, charName) {
        const frames = 10;
        const spriteKey = `bunny_${charName}_runright_sheet`;
        const graphics = this.scene.add.graphics();
        
        for (let frame = 0; frame < frames; frame++) {
            const progress = frame / frames;
            const x = frame * this.frameWidth + this.frameWidth / 2;
            const y = this.frameHeight / 2;
            
            // Running cycle phases
            const cycle = (progress * 2) % 1; // 0-1 cycle
            
            // Body position (bounce)
            const bodyY = y + Math.sin(cycle * Math.PI * 2) * 8;
            
            // Leg positions (running cycle)
            const leftLegPhase = cycle;
            const rightLegPhase = (cycle + 0.5) % 1;
            
            // Ear bounce
            const earBounce = Math.sin(cycle * Math.PI * 2) * 0.15;
            
            // Tail follow-through
            const tailSwing = Math.sin(cycle * Math.PI * 2) * 0.2;
            
            this.drawBunnyFrame(graphics, x, bodyY, charConfig, {
                pose: 'running',
                legPhase: { left: leftLegPhase, right: rightLegPhase },
                earAngle: earBounce,
                tailAngle: tailSwing,
                direction: 'right',
                expression: 'cheerful'
            });
        }
        
        // Generate texture as sprite sheet
        graphics.generateTexture(spriteKey, frames * this.frameWidth, this.frameHeight);
        graphics.destroy();
        
        // Add sprite sheet frame configuration
        if (this.scene.textures.exists(spriteKey)) {
            try {
                const texture = this.scene.textures.get(spriteKey);
                if (texture) {
                    texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
                    
                    // Add frames for sprite sheet (if not already added)
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
        
        return {
            key: spriteKey,
            frames: frames,
            frameWidth: this.frameWidth,
            frameHeight: this.frameHeight
        };
    }

    /**
     * Generate Run Left Animation (8-12 frames)
     * Properly redrawn, not mirrored
     */
    generateRunLeftAnimation(charConfig, charName) {
        const frames = 10;
        const spriteKey = `bunny_${charName}_runleft_sheet`;
        const graphics = this.scene.add.graphics();
        
        for (let frame = 0; frame < frames; frame++) {
            const progress = frame / frames;
            const x = frame * this.frameWidth + this.frameWidth / 2;
            const y = this.frameHeight / 2;
            
            const cycle = (progress * 2) % 1;
            const bodyY = y + Math.sin(cycle * Math.PI * 2) * 8;
            
            // Mirror leg phases for left direction
            const leftLegPhase = (cycle + 0.5) % 1;
            const rightLegPhase = cycle;
            
            const earBounce = Math.sin(cycle * Math.PI * 2) * 0.15;
            const tailSwing = -Math.sin(cycle * Math.PI * 2) * 0.2; // Opposite direction
            
            this.drawBunnyFrame(graphics, x, bodyY, charConfig, {
                pose: 'running',
                legPhase: { left: leftLegPhase, right: rightLegPhase },
                earAngle: earBounce,
                tailAngle: tailSwing,
                direction: 'left',
                expression: 'cheerful'
            });
        }
        
        // Generate texture as sprite sheet
        graphics.generateTexture(spriteKey, frames * this.frameWidth, this.frameHeight);
        graphics.destroy();
        
        // Add sprite sheet frame configuration
        if (this.scene.textures.exists(spriteKey)) {
            try {
                const texture = this.scene.textures.get(spriteKey);
                if (texture) {
                    texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
                    
                    // Add frames for sprite sheet (if not already added)
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
        
        return {
            key: spriteKey,
            frames: frames,
            frameWidth: this.frameWidth,
            frameHeight: this.frameHeight
        };
    }

    /**
     * Generate Jump Animation (6-10 frames)
     * Squash & stretch, anticipation → takeoff → mid-air → landing
     */
    generateJumpAnimation(charConfig, charName) {
        const frames = 8;
        const spriteKey = `bunny_${charName}_jump_sheet`;
        const graphics = this.scene.add.graphics();
        
        for (let frame = 0; frame < frames; frame++) {
            const progress = frame / frames;
            const x = frame * this.frameWidth + this.frameWidth / 2;
            const y = this.frameHeight / 2;
            
            let bodyY, scaleX, scaleY, earAngle;
            
            if (progress < 0.2) {
                // Anticipation (squash down)
                const anticipation = progress / 0.2;
                bodyY = y + anticipation * 10;
                scaleX = 1 + anticipation * 0.1;
                scaleY = 1 - anticipation * 0.2;
                earAngle = -anticipation * 0.2;
            } else if (progress < 0.5) {
                // Takeoff (stretch up)
                const takeoff = (progress - 0.2) / 0.3;
                bodyY = y - takeoff * 30;
                scaleX = 1.1 - takeoff * 0.1;
                scaleY = 0.8 + takeoff * 0.2;
                earAngle = -0.2 + takeoff * 0.3;
            } else if (progress < 0.8) {
                // Mid-air
                const midair = (progress - 0.5) / 0.3;
                bodyY = y - 30 + midair * 10;
                scaleX = 1;
                scaleY = 1;
                earAngle = 0.1 - midair * 0.1;
            } else {
                // Landing (squash)
                const landing = (progress - 0.8) / 0.2;
                bodyY = y - 20 + landing * 20;
                scaleX = 1 + landing * 0.1;
                scaleY = 1 - landing * 0.15;
                earAngle = 0.1 - landing * 0.1;
            }
            
            this.drawBunnyFrame(graphics, x, bodyY, charConfig, {
                pose: 'jumping',
                scale: { x: scaleX, y: scaleY },
                earAngle: earAngle,
                expression: 'excited'
            });
        }
        
        // Generate texture as sprite sheet
        graphics.generateTexture(spriteKey, frames * this.frameWidth, this.frameHeight);
        graphics.destroy();
        
        // Add sprite sheet frame configuration
        if (this.scene.textures.exists(spriteKey)) {
            try {
                const texture = this.scene.textures.get(spriteKey);
                if (texture) {
                    texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
                    
                    // Add frames for sprite sheet (if not already added)
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
        
        return {
            key: spriteKey,
            frames: frames,
            frameWidth: this.frameWidth,
            frameHeight: this.frameHeight
        };
    }

    /**
     * Generate Victory/Celebrate Animation (10-14 frames)
     * Jumping happily, big smile, ears lifted
     */
    generateVictoryAnimation(charConfig, charName) {
        const frames = 12;
        const spriteKey = `bunny_${charName}_victory_sheet`;
        const graphics = this.scene.add.graphics();
        
        for (let frame = 0; frame < frames; frame++) {
            const progress = frame / frames;
            const x = frame * this.frameWidth + this.frameWidth / 2;
            const y = this.frameHeight / 2;
            
            // Jumping cycle
            const jumpCycle = (progress * 3) % 1;
            const bodyY = y - Math.abs(Math.sin(jumpCycle * Math.PI)) * 25;
            
            // Ears lifted with excitement
            const earLift = 0.3 + Math.sin(progress * Math.PI * 4) * 0.1;
            
            // Arms raised
            const armRaise = Math.sin(progress * Math.PI * 2) * 0.2;
            
            // Sparkles (optional)
            const hasSparkles = frame % 3 === 0;
            
            this.drawBunnyFrame(graphics, x, bodyY, charConfig, {
                pose: 'victory',
                earAngle: earLift,
                armRaise: armRaise,
                expression: 'bigSmile',
                sparkles: hasSparkles
            });
        }
        
        // Generate texture as sprite sheet
        graphics.generateTexture(spriteKey, frames * this.frameWidth, this.frameHeight);
        graphics.destroy();
        
        // Add sprite sheet frame configuration
        if (this.scene.textures.exists(spriteKey)) {
            try {
                const texture = this.scene.textures.get(spriteKey);
                if (texture) {
                    texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
                    
                    // Add frames for sprite sheet (if not already added)
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
        
        return {
            key: spriteKey,
            frames: frames,
            frameWidth: this.frameWidth,
            frameHeight: this.frameHeight
        };
    }

    /**
     * Generate Sleep Animation (6-10 frames loop)
     * Bunny lying down, breathing cycle, relaxed ears
     */
    generateSleepAnimation(charConfig, charName) {
        const frames = 8;
        const spriteKey = `bunny_${charName}_sleep_sheet`;
        const graphics = this.scene.add.graphics();
        
        for (let frame = 0; frame < frames; frame++) {
            const progress = frame / frames;
            const x = frame * this.frameWidth + this.frameWidth / 2;
            const y = this.frameHeight / 2 + 20; // Lower position
            
            // Breathing cycle
            const breath = Math.sin(progress * Math.PI * 2) * 0.05;
            
            // Chest rising (subtle)
            const chestRise = Math.sin(progress * Math.PI * 2) * 3;
            
            this.drawBunnyFrame(graphics, x, y + chestRise, charConfig, {
                pose: 'sleeping',
                scale: 1 + breath,
                earAngle: -0.3, // Relaxed, down
                eyeState: 'closed',
                expression: 'peaceful',
                zzz: frame % 4 < 2 // Show Zzz on some frames
            });
        }
        
        // Generate texture as sprite sheet
        graphics.generateTexture(spriteKey, frames * this.frameWidth, this.frameHeight);
        graphics.destroy();
        
        // Add sprite sheet frame configuration
        if (this.scene.textures.exists(spriteKey)) {
            try {
                const texture = this.scene.textures.get(spriteKey);
                if (texture) {
                    texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
                    
                    // Add frames for sprite sheet (if not already added)
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
        
        return {
            key: spriteKey,
            frames: frames,
            frameWidth: this.frameWidth,
            frameHeight: this.frameHeight
        };
    }

    /**
     * Generate Hit/Hurt Reaction (4-6 frames)
     * Quick shake, recoil, small pain expression (still cute)
     */
    generateHitAnimation(charConfig, charName) {
        const frames = 5;
        const spriteKey = `bunny_${charName}_hit_sheet`;
        const graphics = this.scene.add.graphics();
        
        for (let frame = 0; frame < frames; frame++) {
            const progress = frame / frames;
            const x = frame * this.frameWidth + this.frameWidth / 2;
            const y = this.frameHeight / 2;
            
            // Shake/recoil
            const shakeX = Math.sin(progress * Math.PI * 8) * 3;
            const recoilY = progress < 0.3 ? progress * 8 : (0.3 - (progress - 0.3) * 0.5) * 8;
            
            // Slight rotation (knockback effect)
            const rotation = Math.sin(progress * Math.PI * 4) * 0.1;
            
            this.drawBunnyFrame(graphics, x + shakeX, y + recoilY, charConfig, {
                pose: 'hit',
                rotation: rotation,
                expression: 'surprised',
                shockLines: frame < 2
            });
        }
        
        // Generate texture as sprite sheet
        graphics.generateTexture(spriteKey, frames * this.frameWidth, this.frameHeight);
        graphics.destroy();
        
        // Add sprite sheet frame configuration
        if (this.scene.textures.exists(spriteKey)) {
            try {
                const texture = this.scene.textures.get(spriteKey);
                if (texture) {
                    texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
                    
                    // Add frames for sprite sheet (if not already added)
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
        
        return {
            key: spriteKey,
            frames: frames,
            frameWidth: this.frameWidth,
            frameHeight: this.frameHeight
        };
    }

    /**
     * Generate Dance Animation (10-16 frames)
     * Cartoonish bouncing, hopping, ear-flapping
     */
    generateDanceAnimation(charConfig, charName) {
        const frames = 14;
        const spriteKey = `bunny_${charName}_dance_sheet`;
        const graphics = this.scene.add.graphics();
        
        for (let frame = 0; frame < frames; frame++) {
            const progress = frame / frames;
            const x = frame * this.frameWidth + this.frameWidth / 2;
            const y = this.frameHeight / 2;
            
            // Bouncing cycle
            const bounce = Math.abs(Math.sin(progress * Math.PI * 4)) * 15;
            const bodyY = y - bounce;
            
            // Ear flapping
            const earFlap = Math.sin(progress * Math.PI * 6) * 0.3;
            
            // Body tilt (dancing motion)
            const tilt = Math.sin(progress * Math.PI * 2) * 0.15;
            
            // Arms position
            const armCycle = (progress * 2) % 1;
            const leftArmUp = armCycle < 0.5;
            const rightArmUp = armCycle >= 0.5;
            
            this.drawBunnyFrame(graphics, x, bodyY, charConfig, {
                pose: 'dancing',
                earAngle: earFlap,
                rotation: tilt,
                armRaise: { left: leftArmUp ? 0.4 : 0, right: rightArmUp ? 0.4 : 0 },
                expression: 'bigSmile',
                sparkles: true
            });
        }
        
        // Generate texture as sprite sheet
        graphics.generateTexture(spriteKey, frames * this.frameWidth, this.frameHeight);
        graphics.destroy();
        
        // Add sprite sheet frame configuration
        if (this.scene.textures.exists(spriteKey)) {
            try {
                const texture = this.scene.textures.get(spriteKey);
                if (texture) {
                    texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
                    
                    // Add frames for sprite sheet (if not already added)
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
        
        return {
            key: spriteKey,
            frames: frames,
            frameWidth: this.frameWidth,
            frameHeight: this.frameHeight
        };
    }

    /**
     * Generate Talk Animation (6-10 frames)
     * Mouth opening/closing, head bob, expressive eyes
     */
    generateTalkAnimation(charConfig, charName) {
        const frames = 8;
        const spriteKey = `bunny_${charName}_talk_sheet`;
        const graphics = this.scene.add.graphics();
        
        for (let frame = 0; frame < frames; frame++) {
            const progress = frame / frames;
            const x = frame * this.frameWidth + this.frameWidth / 2;
            const y = this.frameHeight / 2;
            
            // Head bob
            const headBob = Math.sin(progress * Math.PI * 4) * 2;
            
            // Mouth open/close cycle
            const mouthOpen = Math.abs(Math.sin(progress * Math.PI * 6));
            
            // Ear subtle motion
            const earMotion = Math.sin(progress * Math.PI * 3) * 0.05;
            
            this.drawBunnyFrame(graphics, x, y + headBob, charConfig, {
                pose: 'talking',
                mouthOpen: mouthOpen,
                earAngle: earMotion,
                expression: 'talking',
                eyeState: 'expressive'
            });
        }
        
        // Generate texture as sprite sheet
        graphics.generateTexture(spriteKey, frames * this.frameWidth, this.frameHeight);
        graphics.destroy();
        
        // Add sprite sheet frame configuration
        if (this.scene.textures.exists(spriteKey)) {
            try {
                const texture = this.scene.textures.get(spriteKey);
                if (texture) {
                    texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
                    
                    // Add frames for sprite sheet (if not already added)
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
        
        return {
            key: spriteKey,
            frames: frames,
            frameWidth: this.frameWidth,
            frameHeight: this.frameHeight
        };
    }

    /**
     * Draw a single bunny frame with all parameters
     */
    drawBunnyFrame(graphics, centerX, centerY, charConfig, params = {}) {
        const bodyRadius = 25;
        const earWidth = 12;
        const earHeight = 25;
        
        // Apply transformations
        const scale = params.scale || (params.scale?.x ? params.scale : { x: 1, y: 1 });
        const rotation = params.rotation || 0;
        
        // Note: Phaser graphics doesn't support save/restore or rotation directly
        // We'll apply transformations by adjusting positions
        
        // Body with soft shading
        graphics.fillStyle(charConfig.furColor, 1);
        graphics.fillCircle(centerX, centerY, bodyRadius * (scale.y || scale));
        
        // Soft highlight
        graphics.fillStyle(0xFFFFFF, 0.3);
        graphics.fillCircle(centerX - bodyRadius * 0.3, centerY - bodyRadius * 0.3, bodyRadius * 0.4 * (scale.y || scale));
        
        // Ears
        const earAngle = params.earAngle || 0;
        const earLeftX = centerX - bodyRadius * 0.6;
        const earRightX = centerX + bodyRadius * 0.6;
        const earY = centerY - bodyRadius * 0.8;
        
        // Left ear
        graphics.fillStyle(charConfig.furColor, 1);
        if (earAngle !== 0) {
            const offsetX = Math.sin(earAngle) * earHeight * 0.2;
            const offsetY = -Math.cos(earAngle) * earHeight * 0.2;
            graphics.fillEllipse(earLeftX + offsetX, earY + offsetY, earWidth, earHeight);
        } else {
            graphics.fillEllipse(earLeftX, earY, earWidth, earHeight);
        }
        
        // Right ear
        if (earAngle !== 0) {
            const offsetX = -Math.sin(earAngle) * earHeight * 0.2;
            const offsetY = -Math.cos(earAngle) * earHeight * 0.2;
            graphics.fillEllipse(earRightX + offsetX, earY + offsetY, earWidth, earHeight);
        } else {
            graphics.fillEllipse(earRightX, earY, earWidth, earHeight);
        }
        
        // Inner ears
        graphics.fillStyle(charConfig.earColor, 1);
        graphics.fillEllipse(earLeftX, earY + earHeight * 0.1, earWidth * 0.6, earHeight * 0.7);
        graphics.fillEllipse(earRightX, earY + earHeight * 0.1, earWidth * 0.6, earHeight * 0.7);
        
        // Eyes
        const eyeSize = bodyRadius * 0.25;
        const eyeLeftX = centerX - bodyRadius * 0.3;
        const eyeRightX = centerX + bodyRadius * 0.3;
        const eyeY = centerY - bodyRadius * 0.2;
        
        if (params.eyeState !== 'closed') {
            // Eye whites
            graphics.fillStyle(0xFFFFFF, 1);
            graphics.fillCircle(eyeLeftX, eyeY, eyeSize);
            graphics.fillCircle(eyeRightX, eyeY, eyeSize);
            
            // Eye color
            graphics.fillStyle(charConfig.eyeColor, 1);
            graphics.fillCircle(eyeLeftX, eyeY, eyeSize * 0.7);
            graphics.fillCircle(eyeRightX, eyeY, eyeSize * 0.7);
            
            // Eye highlights
            graphics.fillStyle(0xFFFFFF, 1);
            graphics.fillCircle(eyeLeftX - eyeSize * 0.2, eyeY - eyeSize * 0.2, eyeSize * 0.3);
            graphics.fillCircle(eyeRightX - eyeSize * 0.2, eyeY - eyeSize * 0.2, eyeSize * 0.3);
            
            // Pupils
            graphics.fillStyle(0x000000, 1);
            graphics.fillCircle(eyeLeftX, eyeY, eyeSize * 0.4);
            graphics.fillCircle(eyeRightX, eyeY, eyeSize * 0.4);
        } else {
            // Closed eyes (sleeping)
            graphics.lineStyle(2, 0x000000, 1);
            graphics.beginPath();
            graphics.arc(eyeLeftX, eyeY, eyeSize * 0.5, 0, Math.PI);
            graphics.strokePath();
            graphics.beginPath();
            graphics.arc(eyeRightX, eyeY, eyeSize * 0.5, 0, Math.PI);
            graphics.strokePath();
        }
        
        // Nose
        graphics.fillStyle(0xFF69B4, 1);
        const noseY = centerY + bodyRadius * 0.1;
        graphics.fillTriangle(centerX, noseY, centerX - bodyRadius * 0.15, noseY + bodyRadius * 0.2, centerX + bodyRadius * 0.15, noseY + bodyRadius * 0.2);
        
        // Mouth
        const mouthY = centerY + bodyRadius * 0.3;
        if (params.mouthOpen !== undefined) {
            // Talking mouth
            if (params.mouthOpen > 0.5) {
                graphics.fillStyle(0xFF69B4, 1);
                graphics.fillCircle(centerX, mouthY, bodyRadius * 0.1 * params.mouthOpen);
            } else {
                this.drawMouth(graphics, centerX, mouthY, bodyRadius, params.expression || 'smile');
            }
        } else {
            this.drawMouth(graphics, centerX, mouthY, bodyRadius, params.expression || 'smile');
        }
        
        // Arms (if needed for pose)
        if (params.pose === 'running' || params.pose === 'jumping' || params.pose === 'victory' || params.pose === 'dancing') {
            graphics.fillStyle(charConfig.furColor, 1);
            
            if (params.armRaise) {
                const armY = typeof params.armRaise === 'number' 
                    ? centerY - bodyRadius * 0.5 - params.armRaise * bodyRadius
                    : centerY - bodyRadius * 0.3;
                
                if (params.pose === 'dancing' && typeof params.armRaise === 'object') {
                    // Left arm
                    if (params.armRaise.left > 0) {
                        graphics.fillEllipse(centerX - bodyRadius * 0.5, centerY - bodyRadius * 0.5 - params.armRaise.left * bodyRadius, bodyRadius * 0.2, bodyRadius * 0.25);
                    }
                    // Right arm
                    if (params.armRaise.right > 0) {
                        graphics.fillEllipse(centerX + bodyRadius * 0.5, centerY - bodyRadius * 0.5 - params.armRaise.right * bodyRadius, bodyRadius * 0.2, bodyRadius * 0.25);
                    }
                } else {
                    graphics.fillEllipse(centerX - bodyRadius * 0.5, armY, bodyRadius * 0.2, bodyRadius * 0.25);
                    graphics.fillEllipse(centerX + bodyRadius * 0.5, armY, bodyRadius * 0.2, bodyRadius * 0.25);
                }
            }
        }
        
        // Legs (for running pose)
        if (params.pose === 'running' && params.legPhase) {
            graphics.fillStyle(charConfig.furColor, 1);
            const legY = centerY + bodyRadius * 0.5;
            
            // Left leg
            const leftLegOffset = Math.sin(params.legPhase.left * Math.PI * 2) * bodyRadius * 0.3;
            graphics.fillEllipse(centerX - bodyRadius * 0.3, legY + leftLegOffset, bodyRadius * 0.25, bodyRadius * 0.2);
            
            // Right leg
            const rightLegOffset = Math.sin(params.legPhase.right * Math.PI * 2) * bodyRadius * 0.3;
            graphics.fillEllipse(centerX + bodyRadius * 0.3, legY + rightLegOffset, bodyRadius * 0.25, bodyRadius * 0.2);
        }
        
        // Tail
        const tailX = centerX + bodyRadius * 0.7;
        const tailY = centerY + bodyRadius * 0.5;
        const tailAngle = params.tailAngle || 0;
        
        graphics.fillStyle(charConfig.furColor, 1);
        if (tailAngle !== 0) {
            const tailOffsetX = Math.sin(tailAngle) * bodyRadius * 0.3;
            const tailOffsetY = Math.cos(tailAngle) * bodyRadius * 0.2;
            graphics.fillCircle(tailX + tailOffsetX, tailY + tailOffsetY, bodyRadius * 0.4);
        } else {
            graphics.fillCircle(tailX, tailY, bodyRadius * 0.4);
        }
        
        // Sparkles (for victory/dance)
        if (params.sparkles) {
            this.drawSparkles(graphics, centerX, centerY, bodyRadius);
        }
        
        // Shock lines (for hit)
        if (params.shockLines) {
            this.drawShockLines(graphics, centerX, centerY, bodyRadius);
        }
        
        // Zzz (for sleep)
        if (params.zzz) {
            this.drawZzz(graphics, centerX, centerY - bodyRadius * 0.8, bodyRadius);
        }
        
        // Graphics context cleanup (Phaser handles this automatically)
    }

    drawMouth(graphics, x, y, bodyRadius, expression) {
        graphics.lineStyle(bodyRadius * 0.08, 0xFF69B4, 1);
        
        switch(expression) {
            case 'bigSmile':
                graphics.beginPath();
                graphics.arc(x, y, bodyRadius * 0.25, 0.1, Math.PI - 0.1, false);
                graphics.strokePath();
                break;
            case 'excited':
                graphics.beginPath();
                graphics.arc(x, y, bodyRadius * 0.22, 0.15, Math.PI - 0.15, false);
                graphics.strokePath();
                break;
            case 'smile':
            default:
                graphics.beginPath();
                graphics.arc(x, y, bodyRadius * 0.2, 0.2, Math.PI - 0.2, false);
                graphics.strokePath();
                break;
        }
    }

    drawSparkles(graphics, centerX, centerY, bodyRadius) {
        for (let i = 0; i < 6; i++) {
            const angle = (i * 60) * Math.PI / 180;
            const sparkleX = centerX + Math.cos(angle) * bodyRadius * 0.8;
            const sparkleY = centerY + Math.sin(angle) * bodyRadius * 0.8;
            
            graphics.fillStyle(0xFFD700, 1);
            graphics.fillCircle(sparkleX, sparkleY, bodyRadius * 0.08);
            graphics.fillStyle(0xFFFFFF, 0.8);
            graphics.fillCircle(sparkleX, sparkleY, bodyRadius * 0.04);
        }
    }

    drawShockLines(graphics, centerX, centerY, bodyRadius) {
        graphics.lineStyle(2, 0x000000, 1);
        for (let i = 0; i < 4; i++) {
            const angle = (i * 90) * Math.PI / 180;
            const startX = centerX + Math.cos(angle) * bodyRadius * 0.8;
            const startY = centerY + Math.sin(angle) * bodyRadius * 0.8;
            const endX = centerX + Math.cos(angle) * bodyRadius * 1.2;
            const endY = centerY + Math.sin(angle) * bodyRadius * 1.2;
            
            graphics.beginPath();
            graphics.moveTo(startX, startY);
            graphics.lineTo(endX, endY);
            graphics.strokePath();
        }
    }

    drawZzz(graphics, centerX, centerY, bodyRadius) {
        graphics.fillStyle(0x87CEEB, 0.8);
        // Draw "Z" shapes
        graphics.lineStyle(3, 0x87CEEB, 1);
        graphics.beginPath();
        graphics.moveTo(centerX - bodyRadius * 0.3, centerY);
        graphics.lineTo(centerX + bodyRadius * 0.3, centerY);
        graphics.moveTo(centerX - bodyRadius * 0.2, centerY - bodyRadius * 0.1);
        graphics.lineTo(centerX + bodyRadius * 0.2, centerY - bodyRadius * 0.1);
        graphics.moveTo(centerX - bodyRadius * 0.3, centerY - bodyRadius * 0.2);
        graphics.lineTo(centerX + bodyRadius * 0.3, centerY - bodyRadius * 0.2);
        graphics.strokePath();
    }

    /**
     * Create Phaser 3 animations from generated sprite sheets
     */
    createPhaserAnimations(charName, animationData) {
        const animations = {};
        
        Object.keys(animationData).forEach(animKey => {
            const data = animationData[animKey];
            
            // Check if texture exists
            if (!this.scene.textures.exists(data.key)) {
                console.warn(`Texture ${data.key} does not exist, skipping animation creation`);
                return;
            }
            
            try {
                // Create animation frames
                const frames = this.scene.anims.generateFrameNumbers(data.key, {
                    start: 0,
                    end: data.frames - 1
                });
                
                // Validate frames
                if (!frames || frames.length === 0) {
                    console.warn(`Could not generate frames for ${data.key}, skipping animation`);
                    return;
                }
                
                // Determine frame rate based on animation type
                let frameRate = 10;
                switch(animKey) {
                    case 'idle':
                        frameRate = 8;
                        break;
                    case 'runRight':
                    case 'runLeft':
                        frameRate = 12;
                        break;
                    case 'jump':
                        frameRate = 15;
                        break;
                    case 'victory':
                        frameRate = 10;
                        break;
                    case 'sleep':
                        frameRate = 6;
                        break;
                    case 'hit':
                        frameRate = 15;
                        break;
                    case 'dance':
                        frameRate = 12;
                        break;
                    case 'talk':
                        frameRate = 10;
                        break;
                }
                
                // Create animation
                const animKeyName = `bunny_${charName}_${animKey}`;
                
                // Check if animation already exists
                if (this.scene.anims.exists(animKeyName)) {
                    this.scene.anims.remove(animKeyName);
                }
                
                this.scene.anims.create({
                    key: animKeyName,
                    frames: frames,
                    frameRate: frameRate,
                    repeat: animKey === 'hit' ? 0 : (animKey === 'jump' ? 0 : -1), // Hit and jump don't loop
                    yoyo: animKey === 'idle' || animKey === 'sleep'
                });
                
                animations[animKey] = animKeyName;
            } catch (error) {
                console.error(`Error creating animation ${animKey} for ${charName}:`, error);
            }
        });
        
        return animations;
    }
}

/**
 * Generate all animations for all bunny characters
 */
function generateAllBunnyAnimations(scene) {
    if (typeof BUNNY_CHARACTERS === 'undefined') {
        console.warn('BUNNY_CHARACTERS not defined. Cannot generate animations.');
        return;
    }
    
    const generator = new BunnyAnimationGenerator(scene);
    const allAnimations = {};
    
    Object.keys(BUNNY_CHARACTERS).forEach(charKey => {
        const charConfig = BUNNY_CHARACTERS[charKey];
        console.log(`Generating animations for ${charConfig.name}...`);
        
        // Generate sprite sheets
        const animationData = generator.generateAllAnimations(charConfig);
        
        // Create Phaser animations
        const phaserAnims = generator.createPhaserAnimations(charKey, animationData);
        
        allAnimations[charKey] = {
            data: animationData,
            animations: phaserAnims
        };
    });
    
    console.log('All bunny animations generated!');
    return allAnimations;
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { BunnyAnimationGenerator, generateAllBunnyAnimations };
}

