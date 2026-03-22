/**
 * menu_screen.js — Màn hình menu (scene Phaser `MenuScreen`).
 * Dữ liệu marker: `world_map_data.js`; mô tả thành phố: `map.md`, `story.md`.
 */
class MenuScreen extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScreen' });
        this.bunnies = [];
        this.sparkles = [];
        this.fireflies = [];
        this.birds = [];
        this.magicParticles = [];
        this.cityMarkers = [];
        this.currentHoveredMarker = null;
        this.blurOverlay = null;
        this.highlightMask = null;
        this.speechSynthesis = null;
        this.currentUtterance = null;
        this.currentCityAudio = null; // Current playing city audio
    }

    preload() {
        // Load menu screen assets - World of Knowledge map
        if (!this.textures.exists('menu_bg')) {
            this.load.image('menu_bg', 'screens/menu/assets/backgrounds/bunnies_world.jpg');
            console.log('MenuScreen: Loading background image');
        }
        // Load menu BGM
        this.load.audio('bgm_menu', 'screens/menu/assets/audio/bgm/menu_bgm.wav');
        
        // Load city description audio files
        this.load.audio('voice_city_1', 'screens/menu/assets/audio/voice/city_1_khu_rung_dem_so.mp3');
        this.load.audio('voice_city_2', 'screens/menu/assets/audio/voice/city_2_thanh_pho_guong.mp3');
        this.load.audio('voice_city_4', 'screens/menu/assets/audio/voice/city_4_doi_phep_tru.mp3');
        this.load.audio('voice_city_click', 'screens/menu/assets/audio/voice/city_click.mp3');
    }

    create() {
        console.log('MenuScreen: create() called');
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Stop any lingering sounds from previous scenes
        this.sound.stopAll();

        // Play menu background music
        this.playMenuBGM();

        // Ensure bunny textures are generated (if not already done in BootScene)
        if (typeof generateAllBunnyTextures === 'function') {
            // Check if textures exist, if not generate them
            if (!this.textures.exists('bunny_milo_idle')) {
                generateAllBunnyTextures(this);
            }
        }

        // Use background image
        if (this.textures.exists('menu_bg')) {
            const bg = this.add.image(width / 2, height / 2, 'menu_bg');
            bg.setDisplaySize(width, height);
            bg.setDepth(0);
        } else {
            // Fallback: simple background color
            this.cameras.main.setBackgroundColor(0x87CEEB);
            console.warn('Background image not found, using fallback color');
        }

        // Generate and create ambient creatures (fireflies, birds, magic particles)
        this.createAmbientCreatures(width, height);

        // Title removed - already in background image

        // Buttons removed - navigation now via map markers

        // Add multiple bunny characters hopping around
        this.createBunnies(width, height);

        // Continuous sparkle particles
        this.startSparkleParticles(width, height);

        // Create world map markers
        this.createWorldMapMarkers(width, height);
        
        // Initialize speech synthesis for audio descriptions
        this.initSpeechSynthesis();
    }


    createEnhancedTitle(width, height) {
        // Title text with magical styling
        const title = this.add.text(width / 2, height / 4, 'Bunnies\nvà\nthế giới tri thức', {
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

    // Buttons removed - navigation now via map markers
    // Legacy button code (createSingleStartButton, createLevelSelectButtons, createLevelCard) removed

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
        // Reduced number of bunnies: 2-4 for cleaner look
        const bunnyCount = Phaser.Math.Between(2, 4);
        
        // Minimum distance between bunnies when spawning
        const minSpawnDistance = 80;
        const existingPositions = []; // Track positions to avoid overlap
        const maxAttempts = 50; // Maximum attempts to find a valid position
        
        // Calculate button area to avoid - buttons are at height/2 + 20 with height 180
        // So button area is roughly from height/2 - 70 to height/2 + 110
        const buttonAreaTop = height / 2 - 100; // Add extra margin
        const buttonAreaBottom = height / 2 + 150; // Add extra margin
        
        // Bunnies should only be at the bottom of screen, below button area
        const bottomAreaTop = buttonAreaBottom;
        const bottomAreaBottom = height - 60;
        
        // Helper function to find a valid position without overlap
        const findValidPosition = () => {
            let attempts = 0;
            let validPosition = null;
            
            while (attempts < maxAttempts && !validPosition) {
                // Bunnies only at bottom of screen, avoiding button area
                const startX = Phaser.Math.Between(80, width - 80);
                const startY = Phaser.Math.Between(bottomAreaTop, bottomAreaBottom);
                
                // Check if position is far enough from existing bunnies
                let tooClose = false;
                for (const existingPos of existingPositions) {
                    const distance = Phaser.Math.Distance.Between(
                        startX, startY,
                        existingPos.x, existingPos.y
                    );
                    if (distance < minSpawnDistance) {
                        tooClose = true;
                        break;
                    }
                }
                
                if (!tooClose) {
                    validPosition = { x: startX, y: startY };
                    existingPositions.push(validPosition);
                }
                
                attempts++;
            }
            
            // If couldn't find valid position, use a random one anyway (better than nothing)
            if (!validPosition) {
                validPosition = {
                    x: Phaser.Math.Between(80, width - 80),
                    y: Phaser.Math.Between(bottomAreaTop, bottomAreaBottom)
                };
                existingPositions.push(validPosition);
            }
            
            return validPosition;
        };
        
        // Use the new animated behavior system for menu bunnies
        if (typeof createAnimatedMenuBunny !== 'undefined' && typeof BUNNY_CHARACTERS !== 'undefined') {
            // Ensure animations are generated
            if (typeof generateAllBunnyAnimations === 'function') {
                if (!this.textures.exists('bunny_milo_idle_sheet')) {
                    generateAllBunnyAnimations(this);
                }
            }
            
            // Get all available characters
            const allCharacterKeys = Object.keys(BUNNY_CHARACTERS);
            
            // Select random characters for variety (can repeat if needed)
            for (let i = 0; i < bunnyCount; i++) {
                const randomKey = allCharacterKeys[Phaser.Math.Between(0, allCharacterKeys.length - 1)];
                const charConfig = BUNNY_CHARACTERS[randomKey];
                const position = findValidPosition();
                
                // Create animated bunny with behavior system
                const bunny = createAnimatedMenuBunny(this, position.x, position.y, charConfig);
                
                // Store bottom area bounds for movement constraints
                const buttonAreaTop = height / 2 - 100;
                const buttonAreaBottom = height / 2 + 150;
                const bottomAreaTop = buttonAreaBottom;
                const bottomAreaBottom = height - 60;
                bunny.setData('bottomAreaTop', bottomAreaTop);
                bunny.setData('bottomAreaBottom', bottomAreaBottom);
                bunny.setData('buttonAreaTop', buttonAreaTop);
                bunny.setData('buttonAreaBottom', buttonAreaBottom);
                
                // Set depth lower than buttons (buttons will be at depth 200)
                if (bunny.setDepth) {
                    bunny.setDepth(50);
                }
                
                // Disable interaction to prevent blocking button clicks
                if (bunny.disableInteractive) {
                    bunny.disableInteractive();
                }
                
                this.bunnies.push(bunny);
            }
        } else if (typeof BunnyCharacter !== 'undefined' && typeof BUNNY_CHARACTERS !== 'undefined') {
            // Fallback: Use BunnyCharacter system without animations
            const allCharacterKeys = Object.keys(BUNNY_CHARACTERS);
            
            for (let i = 0; i < bunnyCount; i++) {
                const randomKey = allCharacterKeys[Phaser.Math.Between(0, allCharacterKeys.length - 1)];
                const charConfig = BUNNY_CHARACTERS[randomKey];
                const position = findValidPosition();
                const bunny = this.createBunnyCharacter(width, height, charConfig, position.x, position.y);
                
                // Store bottom area bounds for movement constraints
                const buttonAreaTop = height / 2 - 100;
                const buttonAreaBottom = height / 2 + 150;
                const bottomAreaTop = buttonAreaBottom;
                const bottomAreaBottom = height - 60;
                bunny.setData('bottomAreaTop', bottomAreaTop);
                bunny.setData('bottomAreaBottom', bottomAreaBottom);
                
                // Set depth lower than buttons
                if (bunny.setDepth) {
                    bunny.setDepth(50);
                }
                
                // Disable interaction to prevent blocking button clicks
                if (bunny.disableInteractive) {
                    bunny.disableInteractive();
                }
                
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

            for (let i = 0; i < bunnyCount; i++) {
                const nameIndex = i % bunnyNames.length;
                const name = bunnyNames[nameIndex] || `Thỏ ${i + 1}`;
                const colors = bunnyColors[nameIndex] || bunnyColors[0];
                const position = findValidPosition();
                const bunny = this.createBunnyCharacterFallback(width, height, name, colors, position.x, position.y);
                
                // Store bottom area bounds for movement constraints
                const buttonAreaTop = height / 2 - 100;
                const buttonAreaBottom = height / 2 + 150;
                const bottomAreaTop = buttonAreaBottom;
                const bottomAreaBottom = height - 60;
                bunny.setData('bottomAreaTop', bottomAreaTop);
                bunny.setData('bottomAreaBottom', bottomAreaBottom);
                
                // Set depth lower than buttons
                if (bunny.setDepth) {
                    bunny.setDepth(50);
                }
                
                // Disable interaction to prevent blocking button clicks
                if (bunny.disableInteractive) {
                    bunny.disableInteractive();
                }
                
                this.bunnies.push(bunny);
            }
        }
    }

    createBunnyCharacter(width, height, charConfig, startX = null, startY = null) {
        // Use provided position or generate random one
        // If not provided, constrain to bottom area
        if (startX === null) startX = Phaser.Math.Between(100, width - 100);
        if (startY === null) {
            const buttonAreaBottom = height / 2 + 150;
            const bottomAreaBottom = height - 60;
            startY = Phaser.Math.Between(buttonAreaBottom, bottomAreaBottom);
        }
        
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
            // Constrain Y to bottom area only
            const bottomAreaTop = bunny.getData('bottomAreaTop') || (height / 2 + 150);
            const bottomAreaBottom = bunny.getData('bottomAreaBottom') || (height - 60);
            const targetY = Phaser.Math.Between(bottomAreaTop, bottomAreaBottom);
            
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

    createBunnyCharacterFallback(width, height, name, colors, startX = null, startY = null) {
        // Fallback method if BunnyCharacter system not available
        // Use provided position or generate random one
        // If not provided, constrain to bottom area
        if (startX === null) startX = Phaser.Math.Between(100, width - 100);
        if (startY === null) {
            const buttonAreaBottom = height / 2 + 150;
            const bottomAreaBottom = height - 60;
            startY = Phaser.Math.Between(buttonAreaBottom, bottomAreaBottom);
        }
        
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
            // Constrain Y to bottom area only
            const bottomAreaTop = bunny.getData('bottomAreaTop') || (height / 2 + 150);
            const bottomAreaBottom = bunny.getData('bottomAreaBottom') || (height - 60);
            const targetY = Phaser.Math.Between(bottomAreaTop, bottomAreaBottom);
            
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
        // Update bunnies (collision detection)
        if (this.bunnies && this.bunnies.length > 0) {
            this.bunnies.forEach(bunny => {
                const behaviorSystem = bunny.getData('behaviorSystem');
                if (behaviorSystem && typeof behaviorSystem.update === 'function') {
                    const allBunnies = [...this.bunnies];
                    behaviorSystem.update(allBunnies);
                }
            });
        }
        
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


    /**
     * Play menu scene background music
     */
    playMenuBGM() {
        if (this.cache.audio.exists('bgm_menu') && window.gameData?.musicEnabled !== false) {
            // Stop any existing sounds
            this.sound.stopAll();
            
            // Create and play menu BGM
            this.menuBGM = this.sound.add('bgm_menu', {
                volume: 0.35,
                loop: true
            });
            this.menuBGM.play();
            console.log('🎵 Playing menu BGM');
        }
    }
    
    /**
     * Stop menu BGM (called before scene transition)
     */
    stopMenuBGM() {
        if (this.menuBGM) {
            // Fade out BGM
            this.tweens.add({
                targets: this.menuBGM,
                volume: 0,
                duration: 500,
                onComplete: () => {
                    if (this.menuBGM) {
                        this.menuBGM.stop();
                    }
                }
            });
        }
    }

    /**
     * Initialize Web Speech API for audio descriptions
     */
    initSpeechSynthesis() {
        if ('speechSynthesis' in window) {
            this.speechSynthesis = window.speechSynthesis;
            console.log('Speech synthesis initialized');
        } else {
            console.warn('Speech synthesis not supported in this browser');
        }
    }

    /**
     * Create world map markers for all cities with collision detection
     */
    createWorldMapMarkers(width, height) {
        // Check if WorldMapData is available
        if (typeof WORLD_MAP_CITIES === 'undefined') {
            console.warn('WorldMapData not loaded, skipping markers');
            return;
        }

        // Calculate scale factor from 1920x1080 to actual screen size
        const scaleX = width / 1920;
        const scaleY = height / 1080;
        const scale = Math.min(scaleX, scaleY); // Use min to maintain aspect ratio

        // Create blur overlay (initially hidden)
        this.createBlurOverlay(width, height);

        // Calculate button area to avoid (center of screen)
        const buttonArea = {
            x: width / 2 - 200,
            y: height / 2 - 100,
            width: 400,
            height: 300
        };

        // Process cities with collision detection
        // Chỉ tạo marker cho các thành phố có visible = true
        const processedPositions = [];
        const minDistance = 50 * scale; // Minimum distance between markers

        WORLD_MAP_CITIES.forEach(city => {
            // Kiểm tra visible flag - chỉ tạo marker nếu visible !== false
            // Mặc định visible = true nếu không được định nghĩa (backward compatibility)
            if (city.visible === false) {
                return; // Bỏ qua thành phố này
            }
            
            // Calculate base position
            let baseX = city.x * scale;
            let baseY = city.y * scale;
            
            // Adjust position to avoid overlaps and button area
            const adjustedPos = this.adjustMarkerPosition(
                baseX, baseY, 
                processedPositions, 
                buttonArea, 
                minDistance,
                width, height
            );
            
            const marker = this.createCityMarker(
                city,
                adjustedPos.x,
                adjustedPos.y,
                width,
                height,
                scale
            );
            
            if (marker) {
                this.cityMarkers.push(marker);
                // Store position for collision detection
                processedPositions.push({
                    x: adjustedPos.x,
                    y: adjustedPos.y,
                    radius: 40 * scale // Approximate marker radius
                });
            }
        });

        console.log(`Created ${this.cityMarkers.length} city markers with collision detection`);
    }

    /**
     * Adjust marker position to avoid overlaps and button area
     */
    adjustMarkerPosition(x, y, existingPositions, buttonArea, minDistance, screenWidth, screenHeight) {
        let adjustedX = x;
        let adjustedY = y;
        let attempts = 0;
        const maxAttempts = 20;
        const stepSize = minDistance * 0.5;

        while (attempts < maxAttempts) {
            // Check if position is in button area
            const inButtonArea = (
                adjustedX >= buttonArea.x && 
                adjustedX <= buttonArea.x + buttonArea.width &&
                adjustedY >= buttonArea.y && 
                adjustedY <= buttonArea.y + buttonArea.height
            );

            // Check collision with existing markers
            let hasCollision = false;
            for (const pos of existingPositions) {
                const distance = Phaser.Math.Distance.Between(adjustedX, adjustedY, pos.x, pos.y);
                if (distance < minDistance) {
                    hasCollision = true;
                    break;
                }
            }

            if (!hasCollision && !inButtonArea) {
                adjustedX = Phaser.Math.Clamp(adjustedX, 50, screenWidth - 50);
                adjustedY = Phaser.Math.Clamp(adjustedY, 90, screenHeight - 50);
                return { x: adjustedX, y: adjustedY };
            }

            // Try different positions in a spiral pattern
            const angle = (attempts * 45) * Math.PI / 180;
            const radius = stepSize * (1 + Math.floor(attempts / 8));
            adjustedX = x + Math.cos(angle) * radius;
            adjustedY = y + Math.sin(angle) * radius;
            
            // Keep within bounds
            adjustedX = Phaser.Math.Clamp(adjustedX, 50, screenWidth - 50);
            adjustedY = Phaser.Math.Clamp(adjustedY, 90, screenHeight - 50);

            attempts++;
        }

        // If all attempts failed, return original position (better than nothing)
        return {
            x: Phaser.Math.Clamp(x, 50, screenWidth - 50),
            y: Phaser.Math.Clamp(y, 90, screenHeight - 50),
        };
    }

    /**
     * Create blur overlay for highlighting hovered city
     */
    createBlurOverlay(width, height) {
        // Create a graphics object for the blur overlay
        this.blurOverlay = this.add.graphics();
        this.blurOverlay.fillStyle(0x000000, 0.3);
        this.blurOverlay.fillRect(0, 0, width, height);
        this.blurOverlay.setDepth(250); // Above buttons/bunnies but below markers
        this.blurOverlay.setAlpha(0); // Initially invisible
        this.blurOverlay.setVisible(false);

        // Create highlight mask for bright area around marker
        this.highlightMask = this.add.graphics();
        this.highlightMask.setDepth(251); // Just above blur overlay
        this.highlightMask.setAlpha(0);
        this.highlightMask.setVisible(false);
    }

    /**
     * Get icon emoji for city based on theme
     */
    getCityIcon(city) {
        const iconMap = {
            'Đếm số': '🔢',
            'Tìm điểm khác biệt': '🔍',
            'Phép cộng': '➕',
            'Phép trừ': '➖',
            'Hình học cơ bản': '🔷',
            'Màu sắc': '🌈',
            'Chữ cái': '📝',
            'Âm thanh': '🎵',
            'Từ vựng': '📚',
            'Thời gian': '⏰',
            'Logic': '🧩',
            'Ghép hình': '🧩',
            'So sánh số': '⚖️',
            'Bảng chữ cái': '🔤',
            'Khoa học': '🔬',
            'Trung bình cộng': '📊',
            'Quy luật số': '🔢',
            'Trí nhớ': '🧠',
            'Quy trình': '🔄',
            'Bảng cửu chương': '✖️',
            'Đối xứng': '🪞',
            'Âm nhạc': '🎶',
            'Hình bóng': '👤',
            'Khối lượng': '⚖️',
            'Phép nhân': '✖️',
            'Định hướng': '🧭',
            'Năng lượng': '⚡',
            'Hình học': '📐',
            'Sáng tạo': '✨',
            'Khủng long': '🦕'
        };
        return iconMap[city.puzzleTheme] || '⭐';
    }

    /**
     * Get pastel color for marker based on city ID
     */
    getMarkerColor(cityId) {
        const colors = [
            { bg: 0xFFF9C4, border: 0xFFFFFF, icon: 0xFFD700 }, // Vàng pastel
            { bg: 0xB2F5EA, border: 0xFFFFFF, icon: 0x4FD1C7 }, // Mint
            { bg: 0xFFE0E6, border: 0xFFFFFF, icon: 0xFF69B4 }, // Hồng pastel
            { bg: 0xE9D5FF, border: 0xFFFFFF, icon: 0x9B59B6 }, // Tím nhẹ
            { bg: 0xFFF9C4, border: 0xFFFFFF, icon: 0xFFD700 }, // Vàng pastel
            { bg: 0xB2F5EA, border: 0xFFFFFF, icon: 0x4FD1C7 }, // Mint
            { bg: 0xFFE0E6, border: 0xFFFFFF, icon: 0xFF69B4 }, // Hồng pastel
            { bg: 0xE9D5FF, border: 0xFFFFFF, icon: 0x9B59B6 }, // Tím nhẹ
        ];
        return colors[cityId % colors.length];
    }

    /**
     * Create a single city marker with new pastel design
     */
    createCityMarker(city, x, y, screenWidth, screenHeight, scale) {
        // Create marker container
        const markerContainer = this.add.container(x, y);
        markerContainer.setDepth(300); // Above everything
        markerContainer.setData('city', city);
        markerContainer.setData('originalScale', 1);
        markerContainer.setData('idleTween', null);
        markerContainer.setData('hoverTween', null);

        // Giảm kích thước icon (từ 35 xuống 24)
        const markerSize = Math.max(20, 24 * scale);
        const colors = this.getMarkerColor(city.id);
        const iconEmoji = this.getCityIcon(city);
        
        // Store marker size and scale for highlight calculation
        markerContainer.setData('markerSize', markerSize);
        markerContainer.setData('scale', scale);

        // Create marker background (pastel circle with transparency)
        const markerBg = this.add.graphics();
        const bgRadius = markerSize;
        
        // Outer glow (subtle)
        markerBg.fillStyle(colors.bg, 0.2);
        markerBg.fillCircle(0, 0, bgRadius + 3);
        
        // Main background - pastel color with 50% opacity
        markerBg.fillStyle(colors.bg, 0.5);
        markerBg.fillCircle(0, 0, bgRadius);
        
        // White border
        markerBg.lineStyle(2, colors.border, 0.9);
        markerBg.strokeCircle(0, 0, bgRadius);
        
        // Inner highlight
        markerBg.fillStyle(0xFFFFFF, 0.3);
        markerBg.fillCircle(0, -bgRadius * 0.2, bgRadius * 0.4);
        
        markerContainer.add(markerBg);

        // Create icon text (emoji) - giảm kích thước
        const iconText = this.add.text(0, 0, iconEmoji, {
            fontSize: `${Math.max(14, 18 * scale)}px`,
            fontFamily: 'Arial'
        }).setOrigin(0.5);
        markerContainer.add(iconText);

        // Create city name label - đặt ở dưới icon với margin
        const nameLabel = this.createCityNameLabel(city.name, markerSize, scale, screenWidth, x);
        
        // Tính toán vị trí title dựa trên chiều cao thực tế của text
        // Lấy chiều cao thực tế của text (có thể 1 hoặc 2 dòng)
        const labelTextHeight = nameLabel.getData('textHeight') || 0;
        const labelBgHeight = nameLabel.getData('bgHeight') || 0;
        const actualLabelHeight = Math.max(labelTextHeight, labelBgHeight);
        
        // Khoảng cách tối thiểu giữa icon và text
        // markerSize là bán kính, nên cần + markerSize để ra khỏi icon + margin an toàn
        const marginBetween = 25 * scale; // Giảm margin một chút
        // Tính safe distance: từ tâm icon (0) xuống dưới icon (markerSize) + margin + nửa chiều cao label
        const safeDistance = markerSize + marginBetween + (actualLabelHeight / 2);
        
        // Đặt label ở dưới icon với khoảng cách an toàn
        nameLabel.y = safeDistance;
        markerContainer.add(nameLabel);
        markerContainer.setData('nameLabel', nameLabel);
        // Lưu chiều cao label để dùng cho hit area
        markerContainer.setData('labelHeight', actualLabelHeight);

        // Make interactive - tăng hit area để dễ hover/click
        // Tính toán hit area bao gồm cả icon và label
        const hitAreaSize = Math.max(markerSize * 3, 80 * scale);
        
        // Sử dụng chiều cao label đã tính ở trên
        const labelHeight = markerContainer.getData('labelHeight') || actualLabelHeight || 50 * scale;
        
        // Height bao gồm: icon (markerSize*2) + margin (25*scale) + label height + margin dưới (20*scale)
        const totalHeight = markerSize * 2 + 25 * scale + labelHeight + 20 * scale;
        markerContainer.setSize(hitAreaSize, totalHeight);
        
        // Hit area bắt đầu từ trên icon, kéo dài xuống dưới label
        markerContainer.setInteractive(new Phaser.Geom.Rectangle(-hitAreaSize/2, -markerSize - 10, hitAreaSize, totalHeight), Phaser.Geom.Rectangle.Contains);
        markerContainer.input.cursor = 'pointer';
        markerContainer.setDepth(300); // Đảm bảo depth cao để có thể tương tác

        // Hover events
        markerContainer.on('pointerover', () => {
            this.onMarkerHover(markerContainer, city, screenWidth, screenHeight);
        });

        markerContainer.on('pointerout', () => {
            this.onMarkerOut(markerContainer);
        });

        // Click event
        markerContainer.on('pointerdown', () => {
            this.onMarkerClick(markerContainer, city);
        });

        // Idle animation - nhún nhảy nhẹ (0.95 → 1.05 → 1.0)
        const idleTween = this.tweens.add({
            targets: markerContainer,
            scaleX: 0.95,
            scaleY: 0.95,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
            delay: city.id * 100 // Stagger animations
        });
        
        // Add bounce effect
        this.tweens.add({
            targets: markerContainer,
            scaleX: 1.05,
            scaleY: 1.05,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeOut',
            delay: city.id * 100 + 500
        });
        
        markerContainer.setData('idleTween', idleTween);

        return markerContainer;
    }

    /**
     * Create city name label with smart positioning and backdrop blur effect
     */
    createCityNameLabel(name, markerSize, scale, screenWidth, markerX) {
        const fontSize = Math.max(12, 14 * scale);
        // Tăng padding để text không sát viền
        const padding = 10 * scale; // Tăng từ 6 lên 10
        const verticalPadding = 8 * scale; // Padding dọc riêng
        
        // Create text first - vị trí sẽ được set bởi parent container
        const nameText = this.add.text(0, 0, name, {
            fontSize: `${fontSize}px`,
            fill: '#FFFFFF',
            fontFamily: 'Poppins, Baloo, Nunito, Comic Sans MS, Arial Rounded MT Bold, Arial',
            fontStyle: 'bold',
            align: 'center',
            wordWrap: { width: 150 * scale }
        }).setOrigin(0.5);
        
        // Tính toán chiều cao thực tế của text (có thể wrap thành nhiều dòng)
        // Cần update text để tính bounds chính xác
        nameText.updateText();
        const textBounds = nameText.getBounds();
        const actualTextHeight = textBounds.height;
        
        // Create background for text (simulate backdrop blur with semi-transparent background)
        const textBg = this.add.graphics();
        // Sử dụng padding riêng cho width và height
        const bgWidth = textBounds.width + padding * 2;
        const bgHeight = actualTextHeight + verticalPadding * 2;
        
        // Draw rounded rectangle background with transparency
        textBg.fillStyle(0x000000, 0.4); // Semi-transparent black for readability
        textBg.fillRoundedRect(
            -bgWidth / 2, 
            -bgHeight / 2, 
            bgWidth, 
            bgHeight, 
            8 * scale
        );
        
        // White border
        textBg.lineStyle(1, 0xFFFFFF, 0.6);
        textBg.strokeRoundedRect(
            -bgWidth / 2, 
            -bgHeight / 2, 
            bgWidth, 
            bgHeight, 
            8 * scale
        );
        
        // Position background behind text
        textBg.x = nameText.x;
        textBg.y = nameText.y;
        textBg.setDepth(nameText.depth - 1);
        
        // Add shadow to text
        nameText.setShadow(1, 1, '#000000', 2, true, true);
        
        // Create container for label - đặt ở center (0, 0) vì sẽ được parent container điều chỉnh
        const labelContainer = this.add.container(0, 0);
        labelContainer.add(textBg);
        labelContainer.add(nameText);
        labelContainer.setData('text', nameText);
        labelContainer.setData('bg', textBg);
        // Lưu chiều cao thực tế để tính toán vị trí
        labelContainer.setData('textHeight', actualTextHeight);
        labelContainer.setData('bgHeight', bgHeight);
        
        return labelContainer;
    }

    /**
     * Handle marker hover - animation, blur, and audio
     */
    onMarkerHover(markerContainer, city, screenWidth, screenHeight) {
        // Don't process if already hovering this marker
        if (this.currentHoveredMarker === markerContainer) {
            return;
        }

        // Stop any previous hover effects
        if (this.currentHoveredMarker) {
            this.onMarkerOut(this.currentHoveredMarker);
        }

        this.currentHoveredMarker = markerContainer;

        // Stop idle animation
        const idleTween = markerContainer.getData('idleTween');
        if (idleTween) {
            this.tweens.killTweensOf(markerContainer);
        }

        // Scale up animation (15-20% increase)
        const hoverTween = this.tweens.add({
            targets: markerContainer,
            scaleX: 1.2,
            scaleY: 1.2,
            duration: 200,
            ease: 'Back.easeOut'
        });
        markerContainer.setData('hoverTween', hoverTween);

        // Add glow effect to marker background
        const glow = this.add.graphics();
        const glowRadius = 40 * (screenWidth / 1920);
        glow.fillStyle(0xFFD700, 0.4);
        glow.fillCircle(0, 0, glowRadius);
        glow.setPosition(markerContainer.x, markerContainer.y);
        glow.setDepth(markerContainer.depth - 1);
        markerContainer.setData('glow', glow);
        
        // Pulse glow
        this.tweens.add({
            targets: glow,
            alpha: 0.6,
            scaleX: 1.2,
            scaleY: 1.2,
            duration: 500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Scale up name label
        const nameLabel = markerContainer.getData('nameLabel');
        if (nameLabel) {
            this.tweens.add({
                targets: nameLabel,
                scaleX: 1.1,
                scaleY: 1.1,
                duration: 200,
                ease: 'Back.easeOut'
            });
        }

        // Create blur overlay with highlight
        this.showBlurOverlay(markerContainer, city, screenWidth, screenHeight);

        // Play audio description (only if not already playing)
        this.playCityDescription(city);
    }

    /**
     * Show blur overlay with highlight for hovered city
     * Highlight chỉ bao quanh icon tròn, không bao gồm text label
     */
    showBlurOverlay(markerContainer, city, screenWidth, screenHeight) {
        if (!this.blurOverlay) return;

        // Lấy kích thước thực tế của marker icon (chỉ icon tròn)
        const markerSize = markerContainer.getData('markerSize') || 35;
        const scale = markerContainer.getData('scale') || 1;
        const currentScale = markerContainer.scaleX || 1; // Scale khi hover (1.2)
        
        // Tính highlight radius chỉ bao quanh icon tròn
        // markerSize là bán kính của icon, nhân với currentScale để tính khi đã zoom
        // Thêm padding nhỏ (1.3x) để có chút không gian xung quanh
        const baseRadius = markerSize * currentScale;
        const highlightRadius = baseRadius * 1.3; // Chỉ lớn hơn icon một chút
        
        // Vị trí chính xác của marker (icon tròn ở center của container)
        const markerX = markerContainer.x;
        const markerY = markerContainer.y;

        // Clear and redraw overlay
        this.blurOverlay.clear();
        
        // Draw dark overlay covering entire screen
        this.blurOverlay.fillStyle(0x000000, 0.5);
        this.blurOverlay.fillRect(0, 0, screenWidth, screenHeight);

        // Use existing highlight mask
        if (!this.highlightMask) return;
        
        this.highlightMask.clear();
        
        // Draw highlight circle chỉ bao quanh icon tròn
        this.highlightMask.fillStyle(0xFFFFFF, 0.15);
        this.highlightMask.fillCircle(markerX, markerY, highlightRadius);
        
        // Add subtle glow effect around highlight (nhỏ hơn trước)
        for (let i = 1; i <= 2; i++) {
            const radius = highlightRadius + (i * 10); // Giảm từ 20 xuống 10
            const alpha = 0.08 / i; // Tăng alpha một chút để thấy rõ hơn
            this.highlightMask.fillStyle(0xFFFFFF, alpha);
            this.highlightMask.fillCircle(markerX, markerY, radius);
        }

        // Fade in overlay
        this.blurOverlay.setVisible(true);
        this.highlightMask.setVisible(true);
        this.tweens.add({
            targets: [this.blurOverlay, this.highlightMask],
            alpha: 1,
            duration: 300,
            ease: 'Power2'
        });
    }

    /**
     * Play city description using audio files (like CountingForestScreen)
     */
    playCityDescription(city) {
        // Don't restart if already playing the same city
        if (this.currentCityAudio && this.currentCityAudio.cityId === city.id) {
            if (this.currentCityAudio.isPlaying) {
                return; // Already playing, don't restart
            }
        }

        // Stop any ongoing audio from different city
        if (this.currentCityAudio) {
            this.currentCityAudio.stop();
            this.currentCityAudio = null;
        }

        // Map city ID to audio key
        const audioKey = `voice_city_${city.id}`;
        
        // Check if audio exists
        if (this.cache.audio.exists(audioKey)) {
            // Play audio file
            this.currentCityAudio = this.sound.add(audioKey, {
                volume: 0.7,
                loop: false
            });
            this.currentCityAudio.cityId = city.id; // Store city ID
            this.currentCityAudio.play();
            
            console.log(`Playing audio for city: ${city.name}`);
        } else {
            // Fallback: use speech synthesis if audio file not found
            const description = `${city.name}. ${city.description} Chủ đề: ${city.puzzleTheme}.`;
            
            if (this.speechSynthesis && 'SpeechSynthesisUtterance' in window) {
                const utterance = new SpeechSynthesisUtterance(description);
                utterance.lang = 'vi-VN';
                utterance.rate = 0.9;
                utterance.pitch = 1.1;
                utterance.volume = 0.8;
                utterance.cityId = city.id;
                this.currentUtterance = utterance;
                this.speechSynthesis.speak(utterance);
            } else {
                console.log(`City: ${city.name} - ${city.description} - Chủ đề: ${city.puzzleTheme}`);
            }
        }
    }

    /**
     * Stop city description with fade-out effect
     */
    stopCityDescription() {
        // Stop audio file with fade-out
        if (this.currentCityAudio && this.currentCityAudio.isPlaying) {
            this.tweens.add({
                targets: this.currentCityAudio,
                volume: 0,
                duration: 250,
                ease: 'Power2',
                onComplete: () => {
                    if (this.currentCityAudio) {
                        this.currentCityAudio.stop();
                        this.currentCityAudio = null;
                    }
                }
            });
        } else if (this.currentCityAudio) {
            this.currentCityAudio.stop();
            this.currentCityAudio = null;
        }
        
        // Stop speech synthesis
        if (this.speechSynthesis && this.currentUtterance) {
            this.speechSynthesis.cancel();
            this.currentUtterance = null;
        }
    }

    /**
     * Handle marker pointer out - stop animations and audio
     */
    onMarkerOut(markerContainer) {
        if (this.currentHoveredMarker !== markerContainer) {
            return;
        }

        this.currentHoveredMarker = null;

        // Stop hover animation
        const hoverTween = markerContainer.getData('hoverTween');
        if (hoverTween) {
            this.tweens.killTweensOf(markerContainer);
        }

        // Remove glow effect
        const glow = markerContainer.getData('glow');
        if (glow) {
            this.tweens.add({
                targets: glow,
                alpha: 0,
                duration: 200,
                onComplete: () => {
                    if (glow && glow.active) {
                        glow.destroy();
                    }
                }
            });
            markerContainer.setData('glow', null);
        }

        // Scale back down
        this.tweens.add({
            targets: markerContainer,
            scaleX: 1,
            scaleY: 1,
            duration: 200,
            ease: 'Power2',
            onComplete: () => {
                // Restart idle animation
                const city = markerContainer.getData('city');
                if (city) {
                    const idleTween = this.tweens.add({
                        targets: markerContainer,
                        scaleX: 0.95,
                        scaleY: 0.95,
                        duration: 1000,
                        yoyo: true,
                        repeat: -1,
                        ease: 'Sine.easeInOut'
                    });
                    markerContainer.setData('idleTween', idleTween);
                }
            }
        });

        // Scale down name label
        const nameLabel = markerContainer.getData('nameLabel');
        if (nameLabel) {
            this.tweens.add({
                targets: nameLabel,
                scaleX: 1,
                scaleY: 1,
                duration: 200,
                ease: 'Power2'
            });
        }

        // Hide blur overlay
        if (this.blurOverlay) {
            this.tweens.add({
                targets: [this.blurOverlay, this.highlightMask],
                alpha: 0,
                duration: 300,
                ease: 'Power2',
                onComplete: () => {
                    if (this.blurOverlay) {
                        this.blurOverlay.setVisible(false);
                        this.blurOverlay.clear();
                    }
                    if (this.highlightMask) {
                        this.highlightMask.setVisible(false);
                        this.highlightMask.clear();
                    }
                }
            });
        }

        // Fade out and stop speech
        this.stopCityDescription();
    }

    /**
     * Handle marker click - navigate to city screen
     */
    onMarkerClick(markerContainer, city) {
        console.log(`Clicked on city: ${city.name}`, city);
        
        // Navigate to city screen if screenKey exists
        if (city.screenKey) {
            // Play click sound if available
            if (this.cache.audio.exists('voice_city_click')) {
                this.sound.play('voice_city_click', { volume: 0.7 });
            }
            
            // Stop menu BGM
            this.stopMenuBGM();
            
            // Stop any playing city description
            this.stopCityDescription();
            
            // Navigate to city screen
            this.scene.start(city.screenKey);
        } else {
            console.warn(`City ${city.name} has no screenKey configured`);
        }
    }

    shutdown() {
        // Stop BGM on shutdown
        if (this.menuBGM) {
            this.menuBGM.stop();
        }

        // Stop speech synthesis
        if (this.speechSynthesis) {
            this.speechSynthesis.cancel();
        }
        
        // Stop city audio
        if (this.currentCityAudio) {
            this.currentCityAudio.stop();
            this.currentCityAudio = null;
        }
        
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
        this.cityMarkers = [];
        this.currentHoveredMarker = null;
        
        // Cleanup highlight mask
        if (this.highlightMask) {
            this.highlightMask.destroy();
            this.highlightMask = null;
        }
    }
}

