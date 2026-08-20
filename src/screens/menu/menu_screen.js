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
        this.load.audio('voice_city_26', 'screens/menu/assets/audio/voice/city_26_khu_rung_dinh_huong.mp3');
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
     * Create world map markers for all visible cities.
     * Tọa độ trong world_map_data.js theo nền 1344×768; background được
     * setDisplaySize(width, height) nên scale theo từng trục để khớp landmark.
     */
    createWorldMapMarkers(width, height) {
        if (typeof WORLD_MAP_CITIES === 'undefined') {
            console.warn('WorldMapData not loaded, skipping markers');
            return;
        }

        const mapW = (typeof WORLD_MAP_WIDTH !== 'undefined') ? WORLD_MAP_WIDTH : 1344;
        const mapH = (typeof WORLD_MAP_HEIGHT !== 'undefined') ? WORLD_MAP_HEIGHT : 768;
        const scaleX = width / mapW;
        const scaleY = height / mapH;
        const scale = Math.min(scaleX, scaleY);

        // Create blur overlay (initially hidden)
        this.createBlurOverlay(width, height);

        WORLD_MAP_CITIES.forEach(city => {
            if (city.visible === false) {
                return;
            }

            const x = Phaser.Math.Clamp(city.x * scaleX, 60, width - 60);
            const y = Phaser.Math.Clamp(city.y * scaleY, 60, height - 60);

            const marker = this.createCityMarker(city, x, y, width, height, scale);
            if (marker) {
                this.cityMarkers.push(marker);
            }
        });

        console.log(`Created ${this.cityMarkers.length} city markers`);
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
     * Create a single city marker — cổng phép phát sáng đặt trên landmark.
     * Label tên chỉ hiện khi hover để khỏi đè lên tên đã vẽ sẵn trong nền.
     */
    createCityMarker(city, x, y, screenWidth, screenHeight, scale) {
        const markerContainer = this.add.container(x, y);
        markerContainer.setDepth(300);
        markerContainer.setData('city', city);

        const markerSize = Math.max(26, 30 * scale);
        const colors = this.getMarkerColor(city.id);
        const iconEmoji = this.getCityIcon(city);

        markerContainer.setData('markerSize', markerSize);
        markerContainer.setData('scale', scale);

        // Hào quang mềm phía sau
        const glow = this.add.graphics();
        glow.fillStyle(colors.icon, 0.18);
        glow.fillCircle(0, 0, markerSize * 1.75);
        glow.fillStyle(colors.icon, 0.28);
        glow.fillCircle(0, 0, markerSize * 1.3);
        markerContainer.add(glow);

        // Vòng cổng: nền pastel đặc + viền kép
        const ring = this.add.graphics();
        ring.fillStyle(colors.bg, 0.95);
        ring.fillCircle(0, 0, markerSize);
        ring.lineStyle(3, 0xFFFFFF, 0.95);
        ring.strokeCircle(0, 0, markerSize);
        ring.lineStyle(2, colors.icon, 0.9);
        ring.strokeCircle(0, 0, markerSize - 4);
        // Điểm sáng trên vành
        ring.fillStyle(0xFFFFFF, 0.85);
        ring.fillCircle(-markerSize * 0.35, -markerSize * 0.45, markerSize * 0.16);
        markerContainer.add(ring);

        // Icon
        const iconText = this.add.text(0, 1, iconEmoji, {
            fontSize: `${Math.round(markerSize * 1.05)}px`,
            fontFamily: 'Arial'
        }).setOrigin(0.5);
        markerContainer.add(iconText);

        // 4 tia sáng quay quanh cổng
        const sparkRing = this.add.graphics();
        for (let i = 0; i < 4; i++) {
            const a = (i / 4) * Math.PI * 2;
            sparkRing.fillStyle(0xFFFFFF, 0.95);
            sparkRing.fillCircle(Math.cos(a) * markerSize * 1.45, Math.sin(a) * markerSize * 1.45, 2.4);
            sparkRing.fillStyle(colors.icon, 0.8);
            sparkRing.fillCircle(Math.cos(a) * markerSize * 1.45, Math.sin(a) * markerSize * 1.45, 1.3);
        }
        markerContainer.add(sparkRing);
        this.tweens.add({
            targets: sparkRing,
            angle: 360,
            duration: 6000,
            repeat: -1,
            ease: 'Linear'
        });

        // Label tên (ẩn, chỉ hiện khi hover) — nằm trên icon
        const nameLabel = this.createCityNameLabel(city.name, markerSize, scale, screenWidth, x);
        const labelBgHeight = nameLabel.getData('bgHeight') || 30;
        nameLabel.y = -(markerSize + 14 * scale + labelBgHeight / 2);
        nameLabel.setAlpha(0);
        nameLabel.setVisible(false);
        markerContainer.add(nameLabel);
        markerContainer.setData('nameLabel', nameLabel);

        // Vùng chạm tròn lớn, đúng tâm icon (tối thiểu ~88px đường kính)
        // Lưu ý: hitArea của Container tính từ góc trái-trên của size box
        // (displayOrigin = width/2, height/2), nên tâm hình tròn ở (hitRadius, hitRadius)
        const hitRadius = Math.max(markerSize * 1.5, 44);
        markerContainer.setSize(hitRadius * 2, hitRadius * 2);
        markerContainer.setInteractive(new Phaser.Geom.Circle(hitRadius, hitRadius, hitRadius), Phaser.Geom.Circle.Contains);
        markerContainer.input.cursor = 'pointer';

        markerContainer.on('pointerover', () => {
            this.onMarkerHover(markerContainer, city, screenWidth, screenHeight);
        });
        markerContainer.on('pointerout', () => {
            this.onMarkerOut(markerContainer);
        });
        markerContainer.on('pointerdown', () => {
            this.onMarkerClick(markerContainer, city);
        });

        // Idle: nổi nhẹ lên xuống + glow thở
        const idleTween = this.tweens.add({
            targets: markerContainer,
            y: y - 5 * scale,
            duration: 1600,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
            delay: city.id * 150
        });
        this.tweens.add({
            targets: glow,
            alpha: { from: 0.65, to: 1 },
            scaleX: { from: 0.95, to: 1.1 },
            scaleY: { from: 0.95, to: 1.1 },
            duration: 1400,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
            delay: city.id * 150
        });

        markerContainer.setData('idleTween', idleTween);
        markerContainer.setData('glow', glow);

        return markerContainer;
    }

    /**
     * Create city name label (pill nền tối, chữ trắng) — dùng khi hover
     */
    createCityNameLabel(name, markerSize, scale, screenWidth, markerX) {
        const fontSize = Math.max(14, Math.round(17 * scale));
        const padding = 12 * scale;
        const verticalPadding = 8 * scale;

        const nameText = this.add.text(0, 0, name, {
            fontSize: `${fontSize}px`,
            fill: '#FFFFFF',
            fontFamily: 'Poppins, Baloo, Nunito, Comic Sans MS, Arial Rounded MT Bold, Arial',
            fontStyle: 'bold',
            align: 'center',
            wordWrap: { width: 180 * scale }
        }).setOrigin(0.5);

        nameText.updateText();
        const textBounds = nameText.getBounds();
        const actualTextHeight = textBounds.height;

        const textBg = this.add.graphics();
        const bgWidth = textBounds.width + padding * 2;
        const bgHeight = actualTextHeight + verticalPadding * 2;

        textBg.fillStyle(0x3B2456, 0.88);
        textBg.fillRoundedRect(-bgWidth / 2, -bgHeight / 2, bgWidth, bgHeight, bgHeight / 2);
        textBg.lineStyle(2, 0xFFD700, 0.9);
        textBg.strokeRoundedRect(-bgWidth / 2, -bgHeight / 2, bgWidth, bgHeight, bgHeight / 2);

        nameText.setShadow(1, 1, '#000000', 2, true, true);

        const labelContainer = this.add.container(0, 0);
        labelContainer.add(textBg);
        labelContainer.add(nameText);
        labelContainer.setData('text', nameText);
        labelContainer.setData('bg', textBg);
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
            scaleX: 1.15,
            scaleY: 1.15,
            duration: 200,
            ease: 'Back.easeOut'
        });
        markerContainer.setData('hoverTween', hoverTween);

        // Glow sáng hơn khi hover (glow là con của container, đã tồn tại sẵn)
        const glow = markerContainer.getData('glow');
        if (glow) {
            this.tweens.add({
                targets: glow,
                alpha: 1,
                scaleX: 1.35,
                scaleY: 1.35,
                duration: 250,
                ease: 'Power2'
            });
        }

        // Hiện label tên thành phố
        const nameLabel = markerContainer.getData('nameLabel');
        if (nameLabel) {
            nameLabel.setVisible(true);
            this.tweens.add({
                targets: nameLabel,
                alpha: 1,
                scaleX: 1,
                scaleY: 1,
                duration: 180,
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

        const scale = markerContainer.getData('scale') || 1;

        // Glow về trạng thái thở bình thường
        const glow = markerContainer.getData('glow');
        if (glow) {
            this.tweens.add({
                targets: glow,
                alpha: 0.8,
                scaleX: 1,
                scaleY: 1,
                duration: 200,
                ease: 'Power2'
            });
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
                        y: markerContainer.y - 5 * scale,
                        duration: 1600,
                        yoyo: true,
                        repeat: -1,
                        ease: 'Sine.easeInOut'
                    });
                    markerContainer.setData('idleTween', idleTween);
                }
            }
        });

        // Ẩn label tên
        const nameLabel = markerContainer.getData('nameLabel');
        if (nameLabel) {
            this.tweens.add({
                targets: nameLabel,
                alpha: 0,
                duration: 150,
                ease: 'Power2',
                onComplete: () => nameLabel.setVisible(false)
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

