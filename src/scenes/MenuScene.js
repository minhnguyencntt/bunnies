/**
 * MenuScene - Màn hình menu chính với Vườn Tri Thức Phép Thuật
 */
class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
        this.bunnies = [];
        this.sparkles = [];
        this.fireflies = [];
        this.birds = [];
        this.magicParticles = [];
    }

    create() {
        console.log('MenuScene: create() called');
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Ensure bunny textures are generated (if not already done in BootScene)
        if (typeof generateAllBunnyTextures === 'function') {
            // Check if textures exist, if not generate them
            if (!this.textures.exists('bunny_milo_idle')) {
                generateAllBunnyTextures(this);
            }
        }

        // Create magical fairy-tale garden background
        this.createMagicalGarden(width, height);

        // Generate and create ambient creatures (fireflies, birds, magic particles)
        this.createAmbientCreatures(width, height);

        // Enhanced title with glowing outline and fairy dust
        this.createEnhancedTitle(width, height);

        // Magical signboard-style buttons
        this.createMagicalButtons(width, height);

        // Add multiple bunny characters hopping around
        this.createBunnies(width, height);

        // Continuous sparkle particles
        this.startSparkleParticles(width, height);
    }

    createMagicalGarden(width, height) {
        // Sky gradient (magical sky)
        const sky = this.add.graphics();
        sky.fillGradientStyle(0x87CEEB, 0x87CEEB, 0xFFB6C1, 0xFFB6C1, 1);
        sky.fillRect(0, 0, width, height * 0.65);

        // Ground (lush grass)
        const ground = this.add.graphics();
        ground.fillGradientStyle(0x90EE90, 0x90EE90, 0x7ACC7A, 0x7ACC7A, 1);
        ground.fillRect(0, height * 0.65, width, height * 0.35);

        // Trees (lush trees)
        for (let i = 0; i < 8; i++) {
            const x = (width / 9) * (i + 1);
            const treeY = height * 0.55;
            
            // Tree crown (multiple layers for lush look)
            const tree = this.add.graphics();
            // Outer layer
            tree.fillStyle(0x228B22, 1);
            tree.fillCircle(x, treeY, 50);
            // Middle layer
            tree.fillStyle(0x32CD32, 0.8);
            tree.fillCircle(x - 20, treeY - 10, 35);
            tree.fillCircle(x + 20, treeY - 10, 35);
            // Inner highlights
            tree.fillStyle(0x90EE90, 0.6);
            tree.fillCircle(x - 15, treeY - 15, 20);
            tree.fillCircle(x + 15, treeY - 15, 20);
            // Tree trunk
            tree.fillStyle(0x8B4513, 1);
            tree.fillRect(x - 10, treeY, 20, 60);
        }

        // Flowers (colorful flowers)
        const flowerColors = [0xFF69B4, 0xFFD700, 0xFF8C00, 0xFF1493, 0xFFB6C1];
        for (let i = 0; i < 15; i++) {
            const x = Phaser.Math.Between(50, width - 50);
            const y = Phaser.Math.Between(height * 0.7, height - 30);
            const color = flowerColors[Phaser.Math.Between(0, flowerColors.length - 1)];
            
            const flower = this.add.graphics();
            // Petals
            for (let p = 0; p < 6; p++) {
                const angle = (p * 60) * Math.PI / 180;
                const petalX = x + Math.cos(angle) * 8;
                const petalY = y + Math.sin(angle) * 8;
                flower.fillStyle(color, 1);
                flower.fillCircle(petalX, petalY, 6);
            }
            // Center
            flower.fillStyle(0xFFD700, 1);
            flower.fillCircle(x, y, 4);
            // Stem
            flower.fillStyle(0x228B22, 1);
            flower.fillRect(x - 1, y + 4, 2, 15);
        }

    }

    createEnhancedTitle(width, height) {
        // Title text with magical styling
        const title = this.add.text(width / 2, height / 4, 'Bé Thỏ và\nRừng Tri Thức', {
            fontSize: '52px',
            fill: '#FFD700',
            fontFamily: 'Comic Sans MS, Arial Rounded MT Bold, Arial',
            fontStyle: 'bold',
            align: 'center',
            stroke: '#FFFFFF',
            strokeThickness: 6,
            shadow: {
                offsetX: 3,
                offsetY: 3,
                color: '#000000',
                blur: 5,
                stroke: true,
                fill: true
            }
        }).setOrigin(0.5);

        // Glowing outline effect
        this.tweens.add({
            targets: title,
            strokeThickness: 8,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Scale animation
        this.tweens.add({
            targets: title,
            scaleX: 1.05,
            scaleY: 1.05,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Fairy dust particles around title
        this.startFairyDust(title.x, title.y - 30);
    }

    startFairyDust(x, y) {
        const createDust = () => {
            for (let i = 0; i < 3; i++) {
                const dust = this.add.graphics();
                const size = Phaser.Math.Between(3, 6);
                dust.fillStyle(0xFFD700, 0.8);
                dust.fillCircle(0, 0, size);
                dust.x = x + Phaser.Math.Between(-100, 100);
                dust.y = y + Phaser.Math.Between(-50, 50);
                
                const angle = Phaser.Math.Between(0, 360);
                const distance = Phaser.Math.Between(30, 80);
                const targetX = dust.x + Math.cos(Phaser.Math.DegToRad(angle)) * distance;
                const targetY = dust.y + Math.sin(Phaser.Math.DegToRad(angle)) * distance;
                
                this.tweens.add({
                    targets: dust,
                    x: targetX,
                    y: targetY,
                    alpha: 0,
                    scale: 0,
                    duration: 1500 + Math.random() * 500,
                    ease: 'Power2',
                    onComplete: () => {
                        dust.destroy();
                    }
                });
            }
        };
        
        // Create dust particles periodically
        this.time.addEvent({
            delay: 800,
            callback: createDust,
            loop: true
        });
    }

    createMagicalButtons(width, height) {
        // Start Button with magical signboard style
        const startBtnContainer = this.add.container(width / 2, height / 2);
        
        // Button background with magical frame
        const startBtnBg = this.add.graphics();
        const btnWidth = 320;
        const btnHeight = 90;
        const btnX = 0;
        const btnY = 0;
        
        // Shadow
        startBtnBg.fillStyle(0x000000, 0.3);
        startBtnBg.fillRoundedRect(btnX - 5, btnY - 5, btnWidth + 10, btnHeight + 10, 25);
        // Outer glow
        startBtnBg.fillStyle(0xFFD700, 0.3);
        startBtnBg.fillRoundedRect(btnX, btnY, btnWidth, btnHeight, 20);
        // Main button gradient
        startBtnBg.fillGradientStyle(0xFFD700, 0xFFD700, 0xFF8C00, 0xFF8C00, 1);
        startBtnBg.fillRoundedRect(btnX, btnY, btnWidth, btnHeight, 20);
        // Magical border
        startBtnBg.lineStyle(5, 0xFFFFFF, 1);
        startBtnBg.strokeRoundedRect(btnX, btnY, btnWidth, btnHeight, 20);
        // Inner glow
        startBtnBg.lineStyle(3, 0xFFD700, 0.8);
        startBtnBg.strokeRoundedRect(btnX + 5, btnY + 5, btnWidth - 10, btnHeight - 10, 15);
        startBtnBg.generateTexture('btn_start_magical', btnWidth + 10, btnHeight + 10);
        startBtnBg.destroy();
        
        const startBtn = this.add.image(0, 0, 'btn_start_magical')
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });
        startBtnContainer.add(startBtn);

        // Blinking magical lights around button
        for (let i = 0; i < 8; i++) {
            const angle = (i * 45) * Math.PI / 180;
            const lightX = Math.cos(angle) * 180;
            const lightY = Math.sin(angle) * 80;
            const light = this.add.graphics();
            light.fillStyle(0xFFD700, 1);
            light.fillCircle(lightX, lightY, 6);
            light.fillStyle(0xFFFFFF, 0.8);
            light.fillCircle(lightX, lightY, 3);
            startBtnContainer.add(light);
            
            // Blinking animation
            this.tweens.add({
                targets: light,
                alpha: 0.3,
                scale: 0.5,
                duration: 500 + Math.random() * 500,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut',
                delay: i * 100
            });
        }

        // Light particles floating upward
        this.startFloatingParticles(startBtnContainer, 0, 0);

        // Button text
        const startText = this.add.text(0, 0, '🎮 BẮT ĐẦU', {
            fontSize: '36px',
            fill: '#FFFFFF',
            fontFamily: 'Comic Sans MS, Arial Rounded MT Bold, Arial',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);
        startBtnContainer.add(startText);

        // Button interactions
        startBtn.on('pointerdown', () => {
            this.scene.start('Level1Scene');
        })
        .on('pointerover', () => {
            startBtnContainer.setScale(1.1);
            startBtn.setTint(0xFFFFFF);
        })
        .on('pointerout', () => {
            startBtnContainer.setScale(1);
            startBtn.clearTint();
        });

        // Bounce animation
        this.tweens.add({
            targets: startBtnContainer,
            y: height / 2 - 5,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Help/Instructions Button
        const helpBtnContainer = this.add.container(width / 2, height / 2 + 130);
        
        const helpBtnBg = this.add.graphics();
        const helpBtnWidth = 320;
        const helpBtnHeight = 90;
        const helpBtnX = 0;
        const helpBtnY = 0;
        
        // Shadow
        helpBtnBg.fillStyle(0x000000, 0.3);
        helpBtnBg.fillRoundedRect(helpBtnX - 5, helpBtnY - 5, helpBtnWidth + 10, helpBtnHeight + 10, 25);
        // Outer glow
        helpBtnBg.fillStyle(0x4A90E2, 0.3);
        helpBtnBg.fillRoundedRect(helpBtnX, helpBtnY, helpBtnWidth, helpBtnHeight, 20);
        // Main button gradient
        helpBtnBg.fillGradientStyle(0x4A90E2, 0x4A90E2, 0x87CEEB, 0x87CEEB, 1);
        helpBtnBg.fillRoundedRect(helpBtnX, helpBtnY, helpBtnWidth, helpBtnHeight, 20);
        // Magical border
        helpBtnBg.lineStyle(5, 0xFFFFFF, 1);
        helpBtnBg.strokeRoundedRect(helpBtnX, helpBtnY, helpBtnWidth, helpBtnHeight, 20);
        // Inner glow
        helpBtnBg.lineStyle(3, 0x87CEEB, 0.8);
        helpBtnBg.strokeRoundedRect(helpBtnX + 5, helpBtnY + 5, helpBtnWidth - 10, helpBtnHeight - 10, 15);
        helpBtnBg.generateTexture('btn_help_magical', helpBtnWidth + 10, helpBtnHeight + 10);
        helpBtnBg.destroy();
        
        const helpBtn = this.add.image(0, 0, 'btn_help_magical')
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });
        helpBtnContainer.add(helpBtn);

        // Blinking lights for help button
        for (let i = 0; i < 8; i++) {
            const angle = (i * 45) * Math.PI / 180;
            const lightX = Math.cos(angle) * 180;
            const lightY = Math.sin(angle) * 80;
            const light = this.add.graphics();
            light.fillStyle(0x87CEEB, 1);
            light.fillCircle(lightX, lightY, 6);
            light.fillStyle(0xFFFFFF, 0.8);
            light.fillCircle(lightX, lightY, 3);
            helpBtnContainer.add(light);
            
            this.tweens.add({
                targets: light,
                alpha: 0.3,
                scale: 0.5,
                duration: 500 + Math.random() * 500,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut',
                delay: i * 100
            });
        }

        this.startFloatingParticles(helpBtnContainer, 0, 0);

        const helpText = this.add.text(0, 0, '📚 HƯỚNG DẪN', {
            fontSize: '36px',
            fill: '#FFFFFF',
            fontFamily: 'Comic Sans MS, Arial Rounded MT Bold, Arial',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);
        helpBtnContainer.add(helpText);

        helpBtn.on('pointerdown', () => {
            this.showHelp();
        })
        .on('pointerover', () => {
            helpBtnContainer.setScale(1.1);
            helpBtn.setTint(0xFFFFFF);
        })
        .on('pointerout', () => {
            helpBtnContainer.setScale(1);
            helpBtn.clearTint();
        });

        this.tweens.add({
            targets: helpBtnContainer,
            y: height / 2 + 130 - 5,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    startFloatingParticles(container, x, y) {
        const createParticle = () => {
            const particle = this.add.graphics();
            const size = Phaser.Math.Between(2, 4);
            particle.fillStyle(0xFFD700, 0.8);
            particle.fillCircle(0, 0, size);
            particle.x = x;
            particle.y = y;
            container.add(particle);
            
            this.tweens.add({
                targets: particle,
                y: particle.y - 50,
                alpha: 0,
                duration: 1000 + Math.random() * 500,
                ease: 'Power2',
                onComplete: () => {
                    particle.destroy();
                }
            });
        };
        
        this.time.addEvent({
            delay: 300,
            callback: createParticle,
            loop: true
        });
    }

    createBunnies(width, height) {
        // Use the new animated behavior system for menu bunnies
        if (typeof createAnimatedMenuBunny !== 'undefined' && typeof BUNNY_CHARACTERS !== 'undefined') {
            // Ensure animations are generated
            if (typeof generateAllBunnyAnimations === 'function') {
                if (!this.textures.exists('bunny_milo_idle_sheet')) {
                    generateAllBunnyAnimations(this);
                }
            }
            
            // Select 4 different characters for variety
            const selectedCharacters = [
                BUNNY_CHARACTERS.milo,    // Milo - energetic orange
                BUNNY_CHARACTERS.luna,    // Luna - gentle white with flower
                BUNNY_CHARACTERS.sunny,   // Sunny - optimistic yellow
                BUNNY_CHARACTERS.pinky    // Pinky - sweet pink with scarf
            ];

            for (let i = 0; i < selectedCharacters.length; i++) {
                const charConfig = selectedCharacters[i];
                const startX = Phaser.Math.Between(100, width - 100);
                const startY = Phaser.Math.Between(height * 0.7, height - 80);
                
                // Create animated bunny with behavior system
                const bunny = createAnimatedMenuBunny(this, startX, startY, charConfig);
                this.bunnies.push(bunny);
            }
        } else if (typeof BunnyCharacter !== 'undefined' && typeof BUNNY_CHARACTERS !== 'undefined') {
            // Fallback: Use BunnyCharacter system without animations
            const selectedCharacters = [
                BUNNY_CHARACTERS.milo,
                BUNNY_CHARACTERS.luna,
                BUNNY_CHARACTERS.sunny,
                BUNNY_CHARACTERS.pinky
            ];

            for (let i = 0; i < selectedCharacters.length; i++) {
                const charConfig = selectedCharacters[i];
                const bunny = this.createBunnyCharacter(width, height, charConfig);
                this.bunnies.push(bunny);
            }
        } else {
            // Fallback to old system if BunnyCharacter not available
            const bunnyNames = ['Bé Thỏ', 'Thỏ Hồng', 'Thỏ Xanh', 'Thỏ Vàng'];
            const bunnyColors = [
                { body: 0xFFFFFF, ear: 0xFFB6C1 },
                { body: 0xFFB6C1, ear: 0xFF69B4 },
                { body: 0x90EE90, ear: 0x7ACC7A },
                { body: 0xFFD700, ear: 0xFF8C00 }
            ];

            for (let i = 0; i < 4; i++) {
                const name = bunnyNames[i] || `Thỏ ${i + 1}`;
                const colors = bunnyColors[i] || bunnyColors[0];
                const bunny = this.createBunnyCharacterFallback(width, height, name, colors);
                this.bunnies.push(bunny);
            }
        }
    }

    createBunnyCharacter(width, height, charConfig) {
        const startX = Phaser.Math.Between(100, width - 100);
        const startY = Phaser.Math.Between(height * 0.7, height - 80);
        
        // Create bunny character using new system
        const bunnyChar = new BunnyCharacter(this, { ...charConfig, size: 80 });
        
        // Generate idle texture for the bunny
        const idleTexture = bunnyChar.generateTexture('idle');
        
        // Create sprite from texture
        const bunny = this.add.image(startX, startY, idleTexture);
        bunny.setOrigin(0.5);
        bunny.setData('name', charConfig.name);
        bunny.setData('originalY', startY);
        bunny.setData('charConfig', charConfig);
        bunny.setData('bunnyChar', bunnyChar);
        bunny.setData('idleTexture', idleTexture); // Store idle texture for easy access
        // Note: bunny is an image/sprite here, not graphics, so normal interactive is fine
        bunny.setInteractive({ useHandCursor: true });

        // Hopping animation - switch to jumping texture during hop
        const hop = () => {
            const targetX = Phaser.Math.Between(80, width - 80);
            const targetY = Phaser.Math.Between(height * 0.7, height - 80);
            
            // Switch to jumping texture
            const jumpingTexture = bunnyChar.generateTexture('jumping');
            bunny.setTexture(jumpingTexture);
            
            // Hop up
            this.tweens.add({
                targets: bunny,
                y: bunny.y - 30,
                scaleY: 0.8,
                duration: 200,
                ease: 'Power2',
                onComplete: () => {
                    // Move and land
                    this.tweens.add({
                        targets: bunny,
                        x: targetX,
                        y: targetY,
                        scaleY: 1.2,
                        duration: 300,
                        ease: 'Power2',
                        onComplete: () => {
                            // Land - switch back to idle
                            bunny.setTexture(bunny.getData('idleTexture'));
                            this.tweens.add({
                                targets: bunny,
                                scaleY: 1,
                                duration: 150,
                                ease: 'Bounce.easeOut',
                                onComplete: () => {
                                    // Idle
                                    this.time.delayedCall(1000 + Math.random() * 2000, hop);
                                }
                            });
                        }
                    });
                }
            });
        };

        // Start hopping after delay
        this.time.delayedCall(1000 * (this.bunnies.length + 1), hop);

        // Idle animation (gentle bounce)
        this.tweens.add({
            targets: bunny,
            y: startY - 5,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Tap interaction - switch to different poses
        bunny.on('pointerdown', () => {
            const action = Phaser.Math.Between(0, 2);
            const bunnyChar = bunny.getData('bunnyChar');
            
            if (action === 0) {
                // Jump - use jumping texture
                const jumpingTexture = bunnyChar.generateTexture('jumping');
                bunny.setTexture(jumpingTexture);
                this.tweens.add({
                    targets: bunny,
                    y: bunny.y - 40,
                    duration: 200,
                    yoyo: true,
                    ease: 'Bounce.easeOut',
                    onComplete: () => {
                        bunny.setTexture(bunny.getData('idleTexture'));
                    }
                });
            } else if (action === 1) {
                // Wave - use waving texture
                const wavingTexture = bunnyChar.generateTexture('waving');
                bunny.setTexture(wavingTexture);
                this.tweens.add({
                    targets: bunny,
                    angle: 360,
                    duration: 500,
                    ease: 'Power2',
                    onComplete: () => {
                        bunny.setAngle(0);
                        bunny.setTexture(bunny.getData('idleTexture'));
                    }
                });
            } else {
                // Happy - use happy texture
                const happyTexture = bunnyChar.generateTexture('happy');
                bunny.setTexture(happyTexture);
                this.tweens.add({
                    targets: bunny,
                    scaleX: 1.3,
                    scaleY: 1.3,
                    duration: 200,
                    yoyo: true,
                    ease: 'Back.easeOut',
                    onComplete: () => {
                        bunny.setTexture(bunny.getData('idleTexture'));
                    }
                });
            }
        });

        return bunny;
    }

    createBunnyCharacterFallback(width, height, name, colors) {
        // Fallback method if BunnyCharacter system not available
        const startX = Phaser.Math.Between(100, width - 100);
        const startY = Phaser.Math.Between(height * 0.7, height - 80);
        
        const bunny = this.add.graphics();
        bunny.fillStyle(colors.body, 1);
        bunny.fillCircle(0, 0, 25);
        bunny.fillStyle(colors.body, 1);
        bunny.fillEllipse(-15, -20, 12, 25);
        bunny.fillEllipse(15, -20, 12, 25);
        bunny.fillStyle(colors.ear, 1);
        bunny.fillEllipse(-15, -15, 8, 18);
        bunny.fillEllipse(15, -15, 8, 18);
        bunny.fillStyle(0x4A90E2, 1);
        bunny.fillCircle(-8, -5, 6);
        bunny.fillCircle(8, -5, 6);
        bunny.fillStyle(0xFFFFFF, 1);
        bunny.fillCircle(-6, -7, 2);
        bunny.fillCircle(10, -7, 2);
        bunny.fillStyle(0xFF69B4, 1);
        bunny.fillTriangle(0, 2, -3, 8, 3, 8);
        bunny.lineStyle(2, 0xFF69B4, 1);
        bunny.beginPath();
        bunny.moveTo(0, 8);
        bunny.lineTo(-5, 12);
        bunny.moveTo(0, 8);
        bunny.lineTo(5, 12);
        bunny.strokePath();
        
        bunny.x = startX;
        bunny.y = startY;
        bunny.setData('name', name);
        bunny.setData('originalY', startY);
        // For graphics objects, provide a hitArea
        const bunnyHitArea = new Phaser.Geom.Circle(0, 0, 30);
        bunny.setInteractive(bunnyHitArea, Phaser.Geom.Circle.Contains, {
            useHandCursor: true
        });

        const hop = () => {
            const targetX = Phaser.Math.Between(80, width - 80);
            const targetY = Phaser.Math.Between(height * 0.7, height - 80);
            
            this.tweens.add({
                targets: bunny,
                y: bunny.y - 30,
                scaleY: 0.8,
                duration: 200,
                ease: 'Power2',
                onComplete: () => {
                    this.tweens.add({
                        targets: bunny,
                        x: targetX,
                        y: targetY,
                        scaleY: 1.2,
                        duration: 300,
                        ease: 'Power2',
                        onComplete: () => {
                            this.tweens.add({
                                targets: bunny,
                                scaleY: 1,
                                duration: 150,
                                ease: 'Bounce.easeOut',
                                onComplete: () => {
                                    this.time.delayedCall(1000 + Math.random() * 2000, hop);
                                }
                            });
                        }
                    });
                }
            });
        };

        this.time.delayedCall(1000 * (this.bunnies.length + 1), hop);

        this.tweens.add({
            targets: bunny,
            y: startY - 5,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        bunny.on('pointerdown', () => {
            const action = Phaser.Math.Between(0, 2);
            if (action === 0) {
                this.tweens.add({
                    targets: bunny,
                    y: bunny.y - 40,
                    duration: 200,
                    yoyo: true,
                    ease: 'Bounce.easeOut'
                });
            } else if (action === 1) {
                this.tweens.add({
                    targets: bunny,
                    angle: 360,
                    duration: 500,
                    ease: 'Power2'
                });
            } else {
                this.tweens.add({
                    targets: bunny,
                    scaleX: 1.3,
                    scaleY: 1.3,
                    duration: 200,
                    yoyo: true,
                    ease: 'Back.easeOut'
                });
            }
        });

        return bunny;
    }

    createFirework(x, y) {
        const colors = [0xFFD700, 0xFF69B4, 0x87CEEB, 0x90EE90, 0xFF8C00];
        for (let i = 0; i < 20; i++) {
            const particle = this.add.graphics();
            const color = colors[Phaser.Math.Between(0, colors.length - 1)];
            particle.fillStyle(color, 1);
            particle.fillCircle(0, 0, 4);
            particle.x = x;
            particle.y = y;
            
            const angle = (i * 18) * Math.PI / 180;
            const distance = Phaser.Math.Between(60, 120);
            const targetX = x + Math.cos(angle) * distance;
            const targetY = y + Math.sin(angle) * distance;
            
            this.tweens.add({
                targets: particle,
                x: targetX,
                y: targetY,
                alpha: 0,
                scale: 0,
                duration: 600,
                ease: 'Power2',
                onComplete: () => {
                    particle.destroy();
                }
            });
        }
    }

    createNumberSparkles(x, y) {
        const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
        for (let i = 0; i < 8; i++) {
            const number = numbers[Phaser.Math.Between(0, numbers.length - 1)];
            const text = this.add.text(x, y, number, {
                fontSize: '24px',
                fill: '#FFD700',
                fontFamily: 'Comic Sans MS, Arial',
                fontStyle: 'bold',
                stroke: '#FFFFFF',
                strokeThickness: 3
            }).setOrigin(0.5);
            
            const angle = Phaser.Math.Between(0, 360);
            const distance = Phaser.Math.Between(40, 80);
            const targetX = x + Math.cos(Phaser.Math.DegToRad(angle)) * distance;
            const targetY = y + Math.sin(Phaser.Math.DegToRad(angle)) * distance;
            
            this.tweens.add({
                targets: text,
                x: targetX,
                y: targetY,
                alpha: 0,
                scale: 1.5,
                duration: 1000,
                ease: 'Power2',
                onComplete: () => {
                    text.destroy();
                }
            });
        }
    }

    startSparkleParticles(width, height) {
        const createSparkle = () => {
            const x = Phaser.Math.Between(0, width);
            const y = Phaser.Math.Between(0, height);
            const sparkle = this.add.graphics();
            sparkle.fillStyle(0xFFD700, 1);
            sparkle.fillCircle(0, 0, 4);
            sparkle.fillStyle(0xFFFFFF, 0.8);
            sparkle.fillCircle(0, 0, 2);
            sparkle.x = x;
            sparkle.y = y;
            
            this.tweens.add({
                targets: sparkle,
                alpha: 0,
                scale: 0,
                y: y - 30,
                duration: 2000,
                ease: 'Power2',
                onComplete: () => {
                    sparkle.destroy();
                }
            });
        };
        
        this.time.addEvent({
            delay: 500,
            callback: createSparkle,
            loop: true
        });
    }

    createAmbientCreatures(width, height) {
        // Generate fireflies
        if (typeof generateFireflies === 'function' && typeof createMenuFirefly === 'function') {
            const fireflyDataList = generateFireflies(this, 6);
            fireflyDataList.forEach(data => {
                const firefly = createMenuFirefly(this, data);
                if (firefly) {
                    this.fireflies.push(firefly);
                }
            });
        }
        
        // Generate birds
        if (typeof generateBirds === 'function' && typeof createMenuBird === 'function') {
            const birdDataList = generateBirds(this, 4);
            birdDataList.forEach(data => {
                const bird = createMenuBird(this, data);
                if (bird) {
                    this.birds.push(bird);
                }
            });
        }
        
        // Generate magic particles
        if (typeof generateMagicParticles === 'function' && typeof createMenuMagicParticle === 'function') {
            const particleDataList = generateMagicParticles(this, 8);
            particleDataList.forEach(data => {
                const particle = createMenuMagicParticle(this, data);
                if (particle) {
                    this.magicParticles.push(particle);
                }
            });
        }
    }

    update() {
        // Update fireflies
        if (this.fireflies && this.fireflies.length > 0) {
            this.fireflies.forEach(firefly => {
                const behaviorSystem = firefly.getData('behaviorSystem');
                if (behaviorSystem && typeof behaviorSystem.update === 'function') {
                    const allFireflies = [...this.fireflies];
                    behaviorSystem.update(allFireflies);
                }
            });
        }
        
        // Update birds
        if (this.birds && this.birds.length > 0) {
            this.birds.forEach(bird => {
                const behaviorSystem = bird.getData('behaviorSystem');
                if (behaviorSystem && typeof behaviorSystem.update === 'function') {
                    const allBirds = [...this.birds];
                    behaviorSystem.update(allBirds);
                }
            });
        }
        
        // Update magic particles
        if (this.magicParticles && this.magicParticles.length > 0) {
            this.magicParticles.forEach(particle => {
                const behaviorSystem = particle.getData('behaviorSystem');
                if (behaviorSystem && typeof behaviorSystem.update === 'function') {
                    const allParticles = [...this.magicParticles];
                    behaviorSystem.update(allParticles);
                }
            });
        }
    }

    showHelp() {
        // Hiển thị hướng dẫn (có thể tạo scene riêng hoặc overlay)
        alert('Hướng dẫn:\n\n1. Kéo thẻ đáp án vào ô trả lời\n2. Trả lời đúng để sửa cầu\n3. Hoàn thành tất cả câu hỏi để vượt qua level!');
    }

    shutdown() {
        // Cleanup behavior systems when scene is destroyed
        this.bunnies.forEach(bunny => {
            const behaviorSystem = bunny.getData('behaviorSystem');
            if (behaviorSystem && typeof behaviorSystem.destroy === 'function') {
                behaviorSystem.destroy();
            }
        });
        // Cleanup ambient creatures
        if (this.fireflies) {
            this.fireflies.forEach(firefly => {
                const behaviorSystem = firefly.getData('behaviorSystem');
                if (behaviorSystem && typeof behaviorSystem.destroy === 'function') {
                    behaviorSystem.destroy();
                }
            });
        }
        
        if (this.birds) {
            this.birds.forEach(bird => {
                const behaviorSystem = bird.getData('behaviorSystem');
                if (behaviorSystem && typeof behaviorSystem.destroy === 'function') {
                    behaviorSystem.destroy();
                }
            });
        }
        
        if (this.magicParticles) {
            this.magicParticles.forEach(particle => {
                const behaviorSystem = particle.getData('behaviorSystem');
                if (behaviorSystem && typeof behaviorSystem.destroy === 'function') {
                    behaviorSystem.destroy();
                }
            });
        }
        
        this.bunnies = [];
        this.fireflies = [];
        this.birds = [];
        this.magicParticles = [];
        this.sparkles = [];
    }
}

