/**
 * BootScreen - Khởi tạo game và load assets cơ bản
 * Enhanced with magical garden loading screen
 */
class BootScreen extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScreen' });
        this.loadingProgress = 0;
        this.runningBunny = null;
    }

    preload() {
        // Load boot screen background - World of Knowledge map
        this.load.image('boot_bg', 'screens/boot/assets/backgrounds/bunnies_world.jpg');

        // Load boot screen BGM
        this.load.audio('bgm_boot', 'screens/boot/assets/audio/bgm/boot_bgm.mp3');

        // Sprite nhân vật vẽ tay (dùng chung toàn game)
        const sprites = [
            'bunny_idle', 'bunny_hop', 'bunny_happy', 'bunny_sad',
            'squirrel_side', 'squirrel_front', 'squirrel_back', 'squirrel_happy',
            'owl_idle', 'owl_cheer', 'owl_sad', 'owl_encourage',
            'fox_idle', 'fox_joy', 'fox_hopeful', 'fox_walk',
        ];
        sprites.forEach((n) => this.load.image(`spr_${n}`, `core/characters/assets/${n}.png`));
        
        // Add load event handlers for debugging
        this.load.on('filecomplete-image-boot_bg', () => {
            console.log('✓ Boot background image loaded successfully');
        });
        
        this.load.on('filecomplete-audio-bgm_boot', () => {
            console.log('✓ BGM: boot_bgm loaded');
        });
        
        this.load.on('loaderror', (file) => {
            if (file.key === 'boot_bg') {
                console.error('✗ Failed to load boot background image from:', file.src);
            }
            if (file.key === 'bgm_boot') {
                console.warn('⚠ BGM not loaded:', file.key, '- scene will play without background music');
            }
        });
    }

    create() {
        console.log('BootScreen: create() called');
        
        // Play boot background music
        this.playBootBGM();
        
        // Tạo loading screen với magical garden
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // Use background image
        if (this.textures.exists('boot_bg')) {
            const bg = this.add.image(width / 2, height / 2, 'boot_bg');
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

        // Create stylized loading bar container (magical wooden frame)
        this.createMagicalLoadingBar(width, height);

        // Create running bunny for loading bar
        this.createRunningBunny(width, height);

        // Thanh tiến trình fill thật theo từng bước generate
        this.loadingBarFill = this.add.graphics();
        this.loadingBarFill.setDepth(5);

        // Chia việc generate texture nặng thành từng bước nhỏ theo frame
        // → thanh loading chạy mượt, không treo màn hình
        // (Có sprite vẽ tay rồi thì bỏ qua generate thỏ/cú — vào game nhanh hơn nhiều)
        const hasBunnyArt = this.textures.exists('spr_bunny_idle');
        const hasOwlArt = this.textures.exists('spr_owl_idle');
        this.generationSteps = [];
        if (!hasBunnyArt && typeof generateAllBunnyTextures === 'function') {
            this.generationSteps.push(() => generateAllBunnyTextures(this));
        }
        if (typeof generateFireflies === 'function') {
            this.generationSteps.push(() => generateFireflies(this, 6));
        }
        if (typeof generateBirds === 'function') {
            this.generationSteps.push(() => generateBirds(this, 4));
        }
        if (typeof generateMagicParticles === 'function') {
            this.generationSteps.push(() => generateMagicParticles(this, 8));
        }
        if (!hasBunnyArt && typeof generateAllBunnyAnimations === 'function') {
            this.generationSteps.push(() => generateAllBunnyAnimations(this));
        }
        if (!hasOwlArt && typeof generateWiseOwlAnimations === 'function') {
            this.generationSteps.push(() => generateWiseOwlAnimations(this));
        }
        this.generationIndex = 0;
        this.runNextGenerationStep();
    }

    runNextGenerationStep() {
        const total = this.generationSteps.length;
        if (this.generationIndex >= total) {
            this.setLoadingProgress(1);
            console.log('BootScreen: Graphics created, starting MenuScreen...');
            this.stopBootBGM();
            this.scene.start('MenuScreen');
            return;
        }
        // Nhường 1 frame để thanh loading repaint trước khi làm việc nặng
        this.time.delayedCall(30, () => {
            const step = this.generationSteps[this.generationIndex];
            try {
                step();
            } catch (e) {
                console.warn('BootScreen: generation step failed', e);
            }
            this.generationIndex++;
            this.setLoadingProgress(this.generationIndex / total);
            this.runNextGenerationStep();
        });
    }

    setLoadingProgress(progress) {
        this.loadingProgress = progress;

        // Fill bar
        if (this.loadingBarFill) {
            const w = Math.max(10, (this.loadingBarWidth - 8) * progress);
            this.loadingBarFill.clear();
            this.loadingBarFill.fillGradientStyle(0xFFD700, 0xFFB300, 0xFF9E5E, 0xFFD700, 1);
            this.loadingBarFill.fillRoundedRect(
                this.loadingBarX - this.loadingBarWidth / 2 + 4,
                this.loadingBarY - this.loadingBarHeight / 2 + 4,
                w,
                this.loadingBarHeight - 8,
                4
            );
        }

        // Bunny chạy theo tiến trình
        if (this.runningBunny) {
            const minX = this.loadingBarX - this.loadingBarWidth / 2 + 20;
            const maxX = this.loadingBarX + this.loadingBarWidth / 2 - 20;
            this.runningBunny.x = minX + (maxX - minX) * progress;
        }
    }

    createMagicalLoadingBar(width, height) {
        const barX = width / 2;
        const barY = height / 2 + 30;
        const barWidth = 500;
        const barHeight = 40;

        // Create magical wooden frame container
        const container = this.add.container(barX, barY);
        
        // Outer glow - transparent
        const outerGlow = this.add.graphics();
        outerGlow.fillStyle(0xFFD700, 0.1);
        outerGlow.fillRoundedRect(-barWidth/2 - 15, -barHeight/2 - 15, barWidth + 30, barHeight + 30, 10);
        container.add(outerGlow);

        // Transparent frame with glass effect
        const frame = this.add.graphics();
        frame.fillStyle(0x000000, 0.15);
        frame.fillRoundedRect(-barWidth/2 - 10 + 2, -barHeight/2 - 10 + 2, barWidth + 20, barHeight + 20, 8);
        frame.fillStyle(0xFFFFFF, 0.25);
        frame.fillRoundedRect(-barWidth/2 - 10, -barHeight/2 - 10, barWidth + 20, barHeight + 20, 8);
        frame.lineStyle(3, 0xFFFFFF, 0.6);
        frame.strokeRoundedRect(-barWidth/2 - 10, -barHeight/2 - 10, barWidth + 20, barHeight + 20, 8);
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

        // Pulsing glow effect
        this.tweens.add({
            targets: outerGlow,
            alpha: 0.2,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        container.setAlpha(0.85);

        // Store container reference and dimensions
        this.loadingBarContainer = container;
        this.loadingBarX = barX;
        this.loadingBarY = barY;
        this.loadingBarWidth = barWidth;
        this.loadingBarHeight = barHeight;
    }

    createRunningBunny(width, height) {
        const startX = this.loadingBarX - this.loadingBarWidth / 2 + 20;
        const bunnyY = this.loadingBarY;

        // Ưu tiên sprite vẽ tay
        if (this.textures.exists('spr_bunny_hop')) {
            const tex = this.textures.get('spr_bunny_hop').getSourceImage();
            const scale = 56 / tex.height;
            this.runningBunny = this.add.image(startX, bunnyY, 'spr_bunny_hop');
            this.runningBunny.setOrigin(0.5, 1);
            this.runningBunny.setScale(scale);
            this.runningBunny.setDepth(1000);
            this.tweens.add({
                targets: this.runningBunny,
                y: bunnyY - 6,
                scaleY: scale * 1.08,
                duration: 220,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
            return;
        }

        // Use Milo (energetic, cheerful) for the loading screen bunny
        if (typeof BunnyCharacter !== 'undefined' && typeof BUNNY_CHARACTERS !== 'undefined') {
            const milo = new BunnyCharacter(this, { ...BUNNY_CHARACTERS.milo, size: 40 });
            const runningTexture = milo.generateTexture('running');
            
            const startX = this.loadingBarX - this.loadingBarWidth/2 + 20;
            const bunnyY = this.loadingBarY;
            
            this.runningBunny = this.add.image(startX, bunnyY, runningTexture);
            this.runningBunny.setOrigin(0.5);
            this.runningBunny.setDepth(1000);
            this.runningBunny.setScale(0.8);

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

    playBootBGM() {
        if (this.cache.audio.exists('bgm_boot') && window.gameData?.musicEnabled !== false) {
            this.sound.stopAll();
            this.bootBGM = this.sound.add('bgm_boot', {
                volume: 0.4,
                loop: true
            });
            this.bootBGM.play();
            console.log('🎵 Playing boot BGM');
        }
    }
    
    stopBootBGM() {
        if (this.bootBGM) {
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

}

