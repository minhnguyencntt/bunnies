/**
 * BootScene - Khởi tạo game và load assets cơ bản
 * Enhanced with magical garden loading screen
 */
class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
        this.loadingProgress = 0;
        this.runningBunny = null;
    }

    preload() {
        // Load background images
        // Path is relative to where index.html is served from
        this.load.image('garden_bg', 'assets/backgrounds/garden_bg_1.png');
        this.load.image('level1_bg', 'assets/backgrounds/l1_bg_1.png');
        
        // Load background music (BGM) for all scenes
        this.load.audio('bgm_boot', 'assets/audio/bgm/boot_bgm.wav');
        this.load.audio('bgm_menu', 'assets/audio/bgm/menu_bgm.wav');
        this.load.audio('bgm_level1', 'assets/audio/bgm/level1_bgm.wav');
        
        // Load voice audio files for dialogues
        this.load.audio('voice_intro_1', 'assets/audio/voice/intro_1.mp3');
        this.load.audio('voice_intro_2', 'assets/audio/voice/intro_2.mp3');
        this.load.audio('voice_intro_3', 'assets/audio/voice/intro_3.mp3');
        this.load.audio('voice_correct', 'assets/audio/voice/correct_answer.mp3');
        this.load.audio('voice_wrong', 'assets/audio/voice/wrong_answer.mp3');
        this.load.audio('voice_complete', 'assets/audio/voice/level_complete.mp3');
        
        // Add load event handlers for debugging
        this.load.on('filecomplete-image-garden_bg', () => {
            console.log('✓ Garden background image loaded successfully');
        });
        
        this.load.on('filecomplete-image-level1_bg', () => {
            console.log('✓ Level 1 background image loaded successfully');
        });
        
        // BGM audio load handlers
        this.load.on('filecomplete-audio-bgm_boot', () => {
            console.log('✓ BGM: boot_bgm loaded');
        });
        this.load.on('filecomplete-audio-bgm_menu', () => {
            console.log('✓ BGM: menu_bgm loaded');
        });
        this.load.on('filecomplete-audio-bgm_level1', () => {
            console.log('✓ BGM: level1_bgm loaded');
        });
        
        // Voice audio load handlers
        this.load.on('filecomplete-audio-voice_intro_1', () => {
            console.log('✓ Voice audio: intro_1 loaded');
        });
        this.load.on('filecomplete-audio-voice_intro_2', () => {
            console.log('✓ Voice audio: intro_2 loaded');
        });
        this.load.on('filecomplete-audio-voice_intro_3', () => {
            console.log('✓ Voice audio: intro_3 loaded');
        });
        this.load.on('filecomplete-audio-voice_correct', () => {
            console.log('✓ Voice audio: correct_answer loaded');
        });
        this.load.on('filecomplete-audio-voice_wrong', () => {
            console.log('✓ Voice audio: wrong_answer loaded');
        });
        this.load.on('filecomplete-audio-voice_complete', () => {
            console.log('✓ Voice audio: level_complete loaded');
        });
        
        this.load.on('loaderror', (file) => {
            if (file.key === 'garden_bg') {
                console.error('✗ Failed to load garden background image from:', file.src);
                console.error('Trying alternative path...');
                // Try alternative path
                this.load.image('garden_bg', 'src/assets/backgrounds/garden_bg_1.png');
            }
            if (file.key === 'level1_bg') {
                console.error('✗ Failed to load Level 1 background image from:', file.src);
                console.error('Trying alternative path...');
                // Try alternative path
                this.load.image('level1_bg', 'src/assets/backgrounds/l1_bg_1.png');
            }
            // Log voice audio load errors
            if (file.key && file.key.startsWith('voice_')) {
                console.warn('⚠ Voice audio not loaded:', file.key, '- dialogues will show text only');
            }
            // Log BGM load errors
            if (file.key && file.key.startsWith('bgm_')) {
                console.warn('⚠ BGM not loaded:', file.key, '- scene will play without background music');
            }
        });
    }

    create() {
        console.log('BootScene: create() called');
        
        // Play boot background music
        this.playBootBGM();
        
        // Tạo loading screen với magical garden
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // Use background image
        if (this.textures.exists('garden_bg')) {
            const bg = this.add.image(width / 2, height / 2, 'garden_bg');
            bg.setDisplaySize(width, height);
            bg.setDepth(0);
            console.log('Background image displayed');
        } else {
            // Fallback: simple background color
            this.cameras.main.setBackgroundColor(0x87CEEB);
            console.warn('Background image not found, using fallback color');
        }
        
        // Loading text with magical styling
        const loadingText = this.add.text(width / 2, height / 2 - 80, 'Đang tải game...', {
            fontSize: '36px',
            fill: '#FFD700',
            fontFamily: 'Comic Sans MS, Arial Rounded MT Bold, Arial',
            fontStyle: 'bold',
            stroke: '#FFFFFF',
            strokeThickness: 4,
            shadow: {
                offsetX: 2,
                offsetY: 2,
                color: '#000000',
                blur: 5,
                stroke: true,
                fill: true
            }
        }).setOrigin(0.5);

        // Glow animation for loading text
        this.tweens.add({
            targets: loadingText,
            alpha: 0.7,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Generate bunny textures first (if BunnyCharacter system available)
        if (typeof generateAllBunnyTextures === 'function') {
            generateAllBunnyTextures(this);
        }
        
        // Generate ambient creatures (fireflies, birds, particles) for menu
        if (typeof generateFireflies === 'function') {
            generateFireflies(this, 6);
        }
        if (typeof generateBirds === 'function') {
            generateBirds(this, 4);
        }
        if (typeof generateMagicParticles === 'function') {
            generateMagicParticles(this, 8);
        }

        // Create stylized loading bar container (magical wooden frame)
        this.createMagicalLoadingBar(width, height);

        // Create running bunny for loading bar
        this.createRunningBunny(width, height);

        // Simulate loading progress
        this.loadingProgress = 0;
        this.updateLoadingProgress();
    }


    startLoadingSparkles(width, height) {
        const createSparkle = () => {
            const x = Phaser.Math.Between(0, width);
            const y = Phaser.Math.Between(0, height * 0.6);
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
            delay: 600,
            callback: createSparkle,
            loop: true
        });
    }

    createMagicalLoadingBar(width, height) {
        const barX = width / 2;
        const barY = height / 2 + 30;
        const barWidth = 500;
        const barHeight = 40;
        const padding = 8;

        // Create magical wooden frame container
        const container = this.add.container(barX, barY);
        
        // Outer glow - transparent
        const outerGlow = this.add.graphics();
        outerGlow.fillStyle(0xFFD700, 0.1);
        outerGlow.fillRoundedRect(-barWidth/2 - 15, -barHeight/2 - 15, barWidth + 30, barHeight + 30, 10);
        container.add(outerGlow);

        // Transparent frame with glass effect
        const frame = this.add.graphics();
        // Shadow - very subtle
        frame.fillStyle(0x000000, 0.15);
        frame.fillRoundedRect(-barWidth/2 - 10 + 2, -barHeight/2 - 10 + 2, barWidth + 20, barHeight + 20, 8);
        // Glass-like background - semi-transparent white
        frame.fillStyle(0xFFFFFF, 0.25);
        frame.fillRoundedRect(-barWidth/2 - 10, -barHeight/2 - 10, barWidth + 20, barHeight + 20, 8);
        // Border - subtle
        frame.lineStyle(3, 0xFFFFFF, 0.6);
        frame.strokeRoundedRect(-barWidth/2 - 10, -barHeight/2 - 10, barWidth + 20, barHeight + 20, 8);
        // Inner highlight
        frame.lineStyle(2, 0xFFFFFF, 0.3);
        frame.strokeRoundedRect(-barWidth/2 - 8, -barHeight/2 - 8, barWidth + 16, barHeight + 16, 6);
        container.add(frame);

        // Loading bar background - transparent
        const barBg = this.add.graphics();
        barBg.fillStyle(0xFFFFFF, 0.2);
        barBg.fillRoundedRect(-barWidth/2, -barHeight/2, barWidth, barHeight, 5);
        container.add(barBg);

        // Animated sparkles on frame
        for (let i = 0; i < 6; i++) {
            const sparkle = this.add.graphics();
            sparkle.fillStyle(0xFFD700, 1);
            sparkle.fillCircle(0, 0, 3);
            sparkle.fillStyle(0xFFFFFF, 0.8);
            sparkle.fillCircle(0, 0, 1.5);
            const angle = (i * 60) * Math.PI / 180;
            sparkle.x = Math.cos(angle) * (barWidth/2 + 25);
            sparkle.y = Math.sin(angle) * (barHeight/2 + 25);
            container.add(sparkle);
            
            this.tweens.add({
                targets: sparkle,
                alpha: 0.3,
                scale: 0.5,
                duration: 500 + Math.random() * 500,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut',
                delay: i * 100
            });
        }

        // Pulsing glow effect - subtle
        this.tweens.add({
            targets: outerGlow,
            alpha: 0.2,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // Make container slightly transparent
        container.setAlpha(0.85);

        // Store container reference and dimensions
        this.loadingBarContainer = container;
        this.loadingBarX = barX;
        this.loadingBarY = barY;
        this.loadingBarWidth = barWidth;
        this.loadingBarHeight = barHeight;
    }

    createRunningBunny(width, height) {
        // Use Milo (energetic, cheerful) for the loading screen bunny
        if (typeof BunnyCharacter !== 'undefined' && typeof BUNNY_CHARACTERS !== 'undefined') {
            const milo = new BunnyCharacter(this, { ...BUNNY_CHARACTERS.milo, size: 40 });
            const runningTexture = milo.generateTexture('running');
            
            // Create bunny sprite
            const startX = this.loadingBarX - this.loadingBarWidth/2 + 20;
            const bunnyY = this.loadingBarY;
            
            this.runningBunny = this.add.image(startX, bunnyY, runningTexture);
            this.runningBunny.setOrigin(0.5);
            this.runningBunny.setDepth(1000); // Above loading bar
            this.runningBunny.setScale(0.8); // Scale down to fit loading bar

            // Running animation (bounce)
            this.tweens.add({
                targets: this.runningBunny,
                y: bunnyY - 3,
                duration: 200,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        } else {
            // Fallback if BunnyCharacter system not loaded
            const bunnyGraphics = this.add.graphics();
            bunnyGraphics.fillStyle(0xFFFFFF, 1);
            bunnyGraphics.fillCircle(20, 20, 12);
            bunnyGraphics.fillStyle(0xFFFFFF, 1);
            bunnyGraphics.fillEllipse(10, 5, 8, 15);
            bunnyGraphics.fillEllipse(30, 5, 8, 15);
            bunnyGraphics.fillStyle(0xFFB6C1, 1);
            bunnyGraphics.fillEllipse(10, 8, 5, 12);
            bunnyGraphics.fillEllipse(30, 8, 5, 12);
            bunnyGraphics.fillStyle(0x4A90E2, 1);
            bunnyGraphics.fillCircle(16, 18, 4);
            bunnyGraphics.fillCircle(24, 18, 4);
            bunnyGraphics.fillStyle(0xFFFFFF, 1);
            bunnyGraphics.fillCircle(17, 17, 1.5);
            bunnyGraphics.fillCircle(25, 17, 1.5);
            bunnyGraphics.fillStyle(0xFF69B4, 1);
            bunnyGraphics.fillTriangle(20, 20, 18, 24, 22, 24);
            bunnyGraphics.lineStyle(1.5, 0xFF69B4, 1);
            bunnyGraphics.beginPath();
            bunnyGraphics.moveTo(20, 24);
            bunnyGraphics.lineTo(17, 27);
            bunnyGraphics.moveTo(20, 24);
            bunnyGraphics.lineTo(23, 27);
            bunnyGraphics.strokePath();
            bunnyGraphics.generateTexture('bunny_running', 40, 40);
            bunnyGraphics.destroy();

            const startX = this.loadingBarX - this.loadingBarWidth/2 + 20;
            const bunnyY = this.loadingBarY;
            
            this.runningBunny = this.add.image(startX, bunnyY, 'bunny_running');
            this.runningBunny.setOrigin(0.5);
            this.runningBunny.setDepth(1000);
            
            this.tweens.add({
                targets: this.runningBunny,
                y: bunnyY - 3,
                duration: 200,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        }
    }

    updateLoadingProgress() {
        this.loadingProgress += 0.15;
        if (this.loadingProgress > 1) {
            this.loadingProgress = 1;
        }

        // Update bunny position based on progress
        // Ensure bunny stays within loading bar bounds
        const minX = this.loadingBarX - this.loadingBarWidth/2 + 20;
        const maxX = this.loadingBarX + this.loadingBarWidth/2 - 20;
        const bunnyX = minX + (maxX - minX) * this.loadingProgress;
        
        // Clamp bunny position to prevent overflow
        this.runningBunny.x = Phaser.Math.Clamp(bunnyX, minX, maxX);

        // Create magic particles behind bunny
        if (Math.random() > 0.7) {
            const particle = this.add.graphics();
            particle.fillStyle(0xFFD700, 0.8);
            particle.fillCircle(0, 0, 3);
            particle.x = this.runningBunny.x - 10;
            particle.y = this.runningBunny.y;
            
            this.tweens.add({
                targets: particle,
                x: particle.x - 20,
                alpha: 0,
                scale: 0,
                duration: 500,
                ease: 'Power2',
                onComplete: () => {
                    particle.destroy();
                }
            });
        }

        // Loop bunny back to start when it reaches the end (only if still loading)
        if (this.loadingProgress >= 0.99 && this.runningBunny.x >= maxX - 10) {
            // Reset to start for seamless loop (only if not complete)
            if (this.loadingProgress < 1) {
                this.runningBunny.x = minX;
                this.loadingProgress = 0;
            }
        }

        if (this.loadingProgress < 1) {
            this.time.delayedCall(80, () => {
                this.updateLoadingProgress();
            });
        } else {
            // Loading complete - ensure bunny is at the end
            this.runningBunny.x = maxX;
            this.time.delayedCall(300, () => {
                console.log('BootScene: Creating placeholder graphics...');
                this.createPlaceholderGraphics();
                console.log('BootScene: Graphics created, starting MenuScene...');
                // Stop boot BGM before transitioning
                this.stopBootBGM();
                this.time.delayedCall(500, () => {
                    this.scene.start('MenuScene');
                });
                });
            }
    }

    /**
     * Play boot scene background music
     */
    playBootBGM() {
        if (this.cache.audio.exists('bgm_boot') && window.gameData?.musicEnabled !== false) {
            // Stop any existing BGM
            this.sound.stopAll();
            
            // Create and play boot BGM
            this.bootBGM = this.sound.add('bgm_boot', {
                volume: 0.4,
                loop: true
            });
            this.bootBGM.play();
            console.log('🎵 Playing boot BGM');
        }
    }
    
    /**
     * Stop boot BGM (called before scene transition)
     */
    stopBootBGM() {
        if (this.bootBGM) {
            // Fade out BGM
            this.tweens.add({
                targets: this.bootBGM,
                volume: 0,
                duration: 500,
                onComplete: () => {
                    this.bootBGM.stop();
                }
            });
        }
    }

    createPlaceholderGraphics() {
        // Tạo background forest đẹp hơn
        const bgGraphics = this.add.graphics();
        // Sky gradient
        bgGraphics.fillGradientStyle(0x87CEEB, 0x87CEEB, 0xFFB6C1, 0xFFB6C1, 1);
        bgGraphics.fillRect(0, 0, 800, 400);
        // Ground
        bgGraphics.fillStyle(0x90EE90, 1);
        bgGraphics.fillRect(0, 400, 800, 200);
        // Trees in background
        for (let i = 0; i < 6; i++) {
            const x = (800 / 7) * (i + 1);
            // Tree crown
            bgGraphics.fillStyle(0x228B22, 1);
            bgGraphics.fillCircle(x, 350, 40);
            bgGraphics.fillStyle(0x32CD32, 0.7);
            bgGraphics.fillCircle(x - 15, 340, 25);
            bgGraphics.fillCircle(x + 15, 340, 25);
            // Tree trunk
            bgGraphics.fillStyle(0x8B4513, 1);
            bgGraphics.fillRect(x - 8, 350, 16, 50);
        }
        bgGraphics.generateTexture('bg_forest_level1', 800, 600);
        bgGraphics.destroy();

        // Tạo button đẹp hơn với shadow
        const btnGraphics = this.add.graphics();
        // Shadow
        btnGraphics.fillStyle(0x000000, 0.3);
        btnGraphics.fillRoundedRect(4, 4, 320, 90, 20);
        // Button gradient
        btnGraphics.fillGradientStyle(0xFFD700, 0xFFD700, 0xFF8C00, 0xFF8C00, 1);
        btnGraphics.fillRoundedRect(0, 0, 320, 90, 20);
        // Border
        btnGraphics.lineStyle(4, 0xFFFFFF, 1);
        btnGraphics.strokeRoundedRect(0, 0, 320, 90, 20);
        // Inner highlight
        btnGraphics.lineStyle(2, 0xFFFFFF, 0.5);
        btnGraphics.strokeRoundedRect(5, 5, 310, 80, 15);
        btnGraphics.generateTexture('btn_primary', 320, 90);
        btnGraphics.destroy();

        // Tạo particle sparkle đẹp hơn
        const particleGraphics = this.add.graphics();
        // Outer glow
        particleGraphics.fillStyle(0xFFD700, 0.5);
        particleGraphics.fillCircle(16, 16, 12);
        // Inner bright
        particleGraphics.fillStyle(0xFFFFFF, 1);
        particleGraphics.fillCircle(16, 16, 6);
        // Points
        particleGraphics.fillStyle(0xFFD700, 1);
        particleGraphics.fillCircle(16, 8, 3);
        particleGraphics.fillCircle(16, 24, 3);
        particleGraphics.fillCircle(8, 16, 3);
        particleGraphics.fillCircle(24, 16, 3);
        particleGraphics.generateTexture('particle_sparkle', 32, 32);
        particleGraphics.destroy();

        // Generate all bunny character textures using BunnyCharacter system
        if (typeof generateAllBunnyTextures === 'function') {
            console.log('BootScene: Generating all bunny character textures...');
            generateAllBunnyTextures(this);
        }
        
        // Generate all bunny animations using BunnyAnimationGenerator
        if (typeof generateAllBunnyAnimations === 'function') {
            console.log('BootScene: Generating all bunny animations...');
            generateAllBunnyAnimations(this);
        }
        
        // Generate wise owl animations using WiseOwlAnimationGenerator
        if (typeof generateWiseOwlAnimations === 'function') {
            console.log('BootScene: Generating wise owl animations...');
            generateWiseOwlAnimations(this);
        }
        
        // Fallback if systems not available
        if (typeof generateAllBunnyTextures === 'undefined') {
            // Fallback: Create simple bunny sprite if BunnyCharacter system not loaded
        const bunnyGraphics = this.add.graphics();
        // Body (white)
        bunnyGraphics.fillStyle(0xFFFFFF, 1);
        bunnyGraphics.fillCircle(40, 50, 25);
        // Ears
        bunnyGraphics.fillStyle(0xFFFFFF, 1);
        bunnyGraphics.fillEllipse(25, 20, 12, 25);
        bunnyGraphics.fillEllipse(55, 20, 12, 25);
        // Inner ears (pink)
        bunnyGraphics.fillStyle(0xFFB6C1, 1);
        bunnyGraphics.fillEllipse(25, 25, 8, 18);
        bunnyGraphics.fillEllipse(55, 25, 8, 18);
        // Eyes
        bunnyGraphics.fillStyle(0x4A90E2, 1);
        bunnyGraphics.fillCircle(32, 45, 6);
        bunnyGraphics.fillCircle(48, 45, 6);
        // Eye highlights
        bunnyGraphics.fillStyle(0xFFFFFF, 1);
        bunnyGraphics.fillCircle(34, 43, 2);
        bunnyGraphics.fillCircle(50, 43, 2);
        // Nose
        bunnyGraphics.fillStyle(0xFF69B4, 1);
        bunnyGraphics.fillTriangle(40, 52, 37, 58, 43, 58);
        // Mouth
        bunnyGraphics.lineStyle(2, 0xFF69B4, 1);
        bunnyGraphics.beginPath();
        bunnyGraphics.moveTo(40, 58);
        bunnyGraphics.lineTo(35, 62);
        bunnyGraphics.moveTo(40, 58);
        bunnyGraphics.lineTo(45, 62);
        bunnyGraphics.strokePath();
        bunnyGraphics.generateTexture('bunny_sprite', 80, 80);
        bunnyGraphics.destroy();
        }
    }
}

