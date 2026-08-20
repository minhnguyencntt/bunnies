/**
 * screen.js — MirrorCityScreen (Thành phố Gương). Load sau `puzzle.js` (MIRROR_PUZZLES).
 */
class MirrorCityScreen extends Phaser.Scene {
    constructor() {
        super({ key: 'MirrorCityScreen' });
        this.mirrorsRestored = 0;
        this.totalMirrors = 10;
        this.currentPuzzle = null;
        this.currentMirrorIndex = -1;
        this.puzzles = [];
        this.mirrors = [];
        this.wiseOwl = null;
        this.butterflies = [];
        this.fireflies = [];
        this.magicParticles = [];
        this.dialogueIndex = 0;
        this.currentVoice = null;
        this.hintsRemaining = Infinity; // Unlimited hints
        this.isInChallengeView = false;
        this.challengeContainer = null;
        this.levelBGM = null;
        this.levelBgVideo = null;
        this.theme = typeof MirrorCityPuzzle !== 'undefined' ? MirrorCityPuzzle : null;
    }

    preload() {
        const bg = this.theme?.background;
        if (typeof ScreenLevelBackground !== 'undefined' && bg) {
            ScreenLevelBackground.registerLevelBackground(this, bg, {
                bgmKey: 'bgm_mirror_city',
                bgmUrl: 'screens/mirror_city/assets/audio/bgm/bgm.wav',
            });
        } else {
            this.load.image('mirror_city_bg', 'screens/mirror_city/assets/backgrounds/bg.png');
            this.load.audio('bgm_mirror_city', 'screens/mirror_city/assets/audio/bgm/bgm.wav');
        }
        this.load.audio('voice_intro_1', 'screens/mirror_city/assets/audio/voice/intro_1.mp3');
        this.load.audio('voice_intro_2', 'screens/mirror_city/assets/audio/voice/intro_2.mp3');
        this.load.audio('voice_intro_3', 'screens/mirror_city/assets/audio/voice/intro_3.mp3');
        this.load.audio('voice_correct', 'screens/mirror_city/assets/audio/voice/correct_answer.mp3');
        this.load.audio('voice_wrong', 'screens/mirror_city/assets/audio/voice/wrong_answer.mp3');
        this.load.audio('voice_complete', 'screens/mirror_city/assets/audio/voice/level_complete.mp3');
    }

    create() {
        console.log('MirrorCityScreen: create() called');
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Ensure clean audio state (stop any sounds from previous scenes)
        this.sound.stopAll();
        
        // Play Mirror City BGM
        this.playLevelBGM();

        // Create Mirror City background
        this.createMirrorCityBackground();

        // Create ambient creatures
        this.createAmbientCreatures();

        // Select 10 random puzzles for this session
        if (typeof selectMirrorPuzzles === 'function') {
            this.puzzles = selectMirrorPuzzles();
        } else {
            console.warn('selectMirrorPuzzles not found, using fallback');
            this.puzzles = MIRROR_PUZZLES.slice(0, 10);
        }

        // Create 10 mirrors in gallery view
        this.createMirrorGallery();

        // Create Wise Owl
        this.createWiseOwl();

        // UI Scene overlay
        this.scene.launch('UIScreen');
        // Update UIScene for Level 2
        this.updateUIScene();

        // Show introduction dialogue
        this.time.delayedCall(500, () => {
            this.showIntroductionDialogue();
        });

        console.log('MirrorCityScreen: Initialized successfully');
    }

    createMirrorCityBackground() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        const bgCfg = this.theme?.background;
        let bgMode = 'none';
        if (typeof ScreenLevelBackground !== 'undefined' && bgCfg) {
            bgMode = ScreenLevelBackground.createLayer(this, width, height, bgCfg, {
                depth: 0,
                videoRef: 'levelBgVideo',
            });
            if (bgMode !== 'none') {
                console.log('Mirror City background:', bgMode);
            }
        } else if (this.textures.exists('mirror_city_bg')) {
            this.add.image(width / 2, height / 2, 'mirror_city_bg').setDisplaySize(width, height).setDepth(0);
            console.log('Mirror City background image displayed');
            bgMode = 'image';
        }
        if (bgMode === 'none') {
            // Fallback: Create magical crystal city background
            const bgGraphics = this.add.graphics();
        
            // Night sky gradient with stars
            bgGraphics.fillGradientStyle(0x1a0a2e, 0x1a0a2e, 0x16213e, 0x16213e, 1);
            bgGraphics.fillRect(0, 0, width, height * 0.6);
            
            // Ground - crystalline floor
            bgGraphics.fillGradientStyle(0x2d1b4e, 0x2d1b4e, 0x1f1147, 0x1f1147, 1);
            bgGraphics.fillRect(0, height * 0.6, width, height * 0.4);
            
            // Reflective floor effect
            bgGraphics.fillStyle(0xFFFFFF, 0.05);
            bgGraphics.fillRect(0, height * 0.6, width, height * 0.4);
            
            bgGraphics.setDepth(0);

            // Add stars in the sky
            for (let i = 0; i < 50; i++) {
                const starX = Phaser.Math.Between(0, width);
                const starY = Phaser.Math.Between(0, height * 0.5);
                const starSize = Phaser.Math.Between(1, 3);
                const star = this.add.graphics();
                star.fillStyle(0xFFFFFF, Phaser.Math.FloatBetween(0.3, 1));
                star.fillCircle(starX, starY, starSize);
                star.setDepth(1);
                
                // Twinkling animation
                this.tweens.add({
                    targets: star,
                    alpha: Phaser.Math.FloatBetween(0.2, 0.5),
                    duration: Phaser.Math.Between(1000, 3000),
                    yoyo: true,
                    repeat: -1,
                    ease: 'Sine.easeInOut'
                });
            }

            // Crystal towers in background
            this.createCrystalTowers(width, height);

            // Floating light particles
            this.createFloatingLights(width, height);
        }
    }

    createCrystalTowers(width, height) {
        const towerPositions = [
            { x: width * 0.1, h: 180 },
            { x: width * 0.25, h: 220 },
            { x: width * 0.75, h: 200 },
            { x: width * 0.9, h: 160 }
        ];

        towerPositions.forEach(pos => {
            const tower = this.add.graphics();
            const baseY = height * 0.6;
            
            // Tower body (crystal-like)
            tower.fillGradientStyle(0x4a148c, 0x4a148c, 0x7b1fa2, 0x7b1fa2, 0.7);
            tower.fillRect(pos.x - 20, baseY - pos.h, 40, pos.h);
            
            // Tower top (pointed)
            tower.fillStyle(0x9c27b0, 0.8);
            tower.fillTriangle(pos.x - 25, baseY - pos.h, pos.x + 25, baseY - pos.h, pos.x, baseY - pos.h - 40);
            
            // Glow effect
            tower.lineStyle(2, 0xE1BEE7, 0.5);
            tower.strokeRect(pos.x - 20, baseY - pos.h, 40, pos.h);
            
            tower.setDepth(2);
        });
    }

    createFloatingLights(width, height) {
        for (let i = 0; i < 20; i++) {
            const light = this.add.graphics();
            const x = Phaser.Math.Between(0, width);
            const y = Phaser.Math.Between(height * 0.2, height * 0.8);
            const size = Phaser.Math.Between(2, 5);
            const colors = [0xE1BEE7, 0xCE93D8, 0xBA68C8, 0xAB47BC, 0x80DEEA];
            const color = colors[Phaser.Math.Between(0, colors.length - 1)];
            
            light.fillStyle(color, 0.6);
            light.fillCircle(0, 0, size);
            light.fillStyle(0xFFFFFF, 0.8);
            light.fillCircle(0, 0, size * 0.5);
            light.x = x;
            light.y = y;
            light.setDepth(3);

            // Floating animation
            this.tweens.add({
                targets: light,
                y: y - Phaser.Math.Between(20, 50),
                x: x + Phaser.Math.Between(-30, 30),
                alpha: 0.3,
                duration: Phaser.Math.Between(3000, 6000),
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        }
    }

    createMirrorGallery() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        this.mirrors = [];

        const mirrorWidth = 96;
        const mirrorHeight = 118;
        const hudH = 80;
        const cols = 5;
        const spacingX = Math.min(200, (width * 0.78) / cols);
        const spacingY = 168;
        const totalWidth = (cols - 1) * spacingX;
        const startX = (width - totalWidth) / 2;
        const startY = Math.max(hudH + mirrorHeight / 2 + 34, height * 0.30);

        // Màu nhấn pastel cho đá quý trên khung gương
        const accents = [0xFF9EC7, 0x9EC7FF, 0xB39DDB, 0x7FE3C3, 0xFFB74D,
                         0xF48FB1, 0x81D4FA, 0xCE93D8, 0xA5D6A7, 0xFFF176];

        for (let i = 0; i < this.totalMirrors; i++) {
            const row = Math.floor(i / cols);
            const col = i % cols;
            const x = startX + col * spacingX;
            const y = startY + row * spacingY;
            const mirror = this.createBeautifulMirror(x, y, mirrorWidth, mirrorHeight, i, accents[i % accents.length]);
            this.mirrors.push(mirror);
        }
    }


    createBeautifulMirror(x, y, width, height, index, accent) {
        const mirror = {
            x: x,
            y: y,
            width: width,
            height: height,
            index: index,
            isRestored: false,
            container: null,
            graphics: null,
            sparkles: [],
            glowEffect: null,
            accent: accent
        };

        const container = this.add.container(x, y);
        mirror.container = container;

        // Hào quang mềm phía sau
        const glowEffect = this.add.graphics();
        glowEffect.fillStyle(accent, 0.20);
        glowEffect.fillEllipse(0, 0, width * 1.55, height * 1.45);
        glowEffect.fillStyle(accent, 0.30);
        glowEffect.fillEllipse(0, 0, width * 1.2, height * 1.12);
        container.add(glowEffect);
        container.sendToBack(glowEffect);
        mirror.glowEffect = glowEffect;

        this.tweens.add({
            targets: glowEffect,
            alpha: { from: 0.5, to: 0.9 },
            duration: Phaser.Math.Between(1400, 2200),
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Thân gương
        const mirrorGraphics = this.add.graphics();
        this.drawElegantMirror(mirrorGraphics, width, height, false, accent);
        container.add(mirrorGraphics);
        mirror.graphics = mirrorGraphics;

        // Huy hiệu số thứ tự dưới chân gương
        const badgeY = height / 2 + 10;
        const badge = this.add.graphics();
        badge.fillStyle(0xFFFFFF, 0.95);
        badge.fillCircle(0, badgeY, 13);
        badge.lineStyle(2.5, accent, 1);
        badge.strokeCircle(0, badgeY, 13);
        container.add(badge);
        mirror.badge = badge;
        const badgeLabel = this.add.text(0, badgeY, String(index + 1), {
            fontSize: '15px', fontFamily: 'Comic Sans MS, Arial', fontStyle: 'bold', color: '#5C3A1E',
        }).setOrigin(0.5);
        container.add(badgeLabel);
        mirror.badgeLabel = badgeLabel;

        // 3 tia sáng nhỏ lấp lánh quanh gương
        for (let i = 0; i < 3; i++) {
            const a = (i / 3) * Math.PI * 2 + index * 0.8;
            const sparkle = this.add.graphics();
            sparkle.fillStyle(0xFFFFFF, 0.95);
            sparkle.fillCircle(0, 0, 2.2);
            sparkle.fillStyle(accent, 0.8);
            sparkle.fillCircle(0, 0, 1.1);
            sparkle.setPosition(Math.cos(a) * width * 0.72, Math.sin(a) * height * 0.68);
            container.add(sparkle);
            mirror.sparkles.push(sparkle);

            this.tweens.add({
                targets: sparkle,
                alpha: { from: 0.15, to: 1 },
                scale: { from: 0.6, to: 1.3 },
                duration: Phaser.Math.Between(700, 1300),
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut',
                delay: i * 260
            });
        }

        // Vùng chạm hình ellipse, lớn hơn gương để trẻ dễ bấm
        const hitW = width + 40;
        const hitH = height + 52;
        container.setSize(hitW, hitH);
        container.setInteractive(new Phaser.Geom.Ellipse(0, 0, hitW, hitH), Phaser.Geom.Ellipse.Contains, { useHandCursor: true });

        container.on('pointerdown', () => {
            if (!mirror.isRestored && !this.isInChallengeView) {
                this.selectMirror(index);
            }
        });

        container.on('pointerover', () => {
            if (!mirror.isRestored && !this.isInChallengeView) {
                container.setScale(1.12);
                glowEffect.setAlpha(1);
            }
        });

        container.on('pointerout', () => {
            if (!mirror.isRestored) {
                container.setScale(1);
                glowEffect.setAlpha(0.8);
            }
        });

        container.setDepth(50);

        // Nổi nhẹ lên xuống
        this.tweens.add({
            targets: container,
            y: y - 4,
            duration: 1800 + (index % 5) * 160,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
            delay: index * 120
        });

        return mirror;
    }

    /**
     * Vẽ tấm gương oval khung vàng thống nhất (đẹp, sạch, hợp trẻ em).
     * isRestored=false: mặt gương tím huyền bị (bị phù thủy)
     * isRestored=true:  mặt gương sáng rực, khung rực vàng
     */
    drawElegantMirror(graphics, w, h, isRestored, accent) {
        const gold = isRestored ? 0xFFD700 : 0xFFC94D;
        const goldDark = isRestored ? 0xDAA520 : 0xB8860B;
        const gemColor = isRestored ? 0xFFF3B0 : accent;

        // Ngọc trên đỉnh khung
        graphics.fillStyle(gold, 1);
        graphics.fillCircle(0, -h / 2 - 8, 6);
        graphics.fillStyle(gemColor, 1);
        graphics.fillCircle(0, -h / 2 - 8, 3.2);
        graphics.fillStyle(0xFFFFFF, 0.9);
        graphics.fillCircle(-1.5, -h / 2 - 9.5, 1.2);

        // Khung ngoài (viền vàng hai lớp)
        graphics.fillStyle(goldDark, 1);
        graphics.fillEllipse(0, 0, w + 18, h + 18);
        graphics.fillStyle(gold, 1);
        graphics.fillEllipse(0, 0, w + 10, h + 10);
        graphics.lineStyle(2, 0xFFF3B0, 0.9);
        graphics.strokeEllipse(0, 0, w + 6, h + 6);

        // Mặt gương
        if (!isRestored) {
            graphics.fillGradientStyle(0x4A3791, 0x35266E, 0x1F1147, 0x2D1B5E, 1);
            graphics.fillEllipse(0, 0, w, h);
            // Vệt sáng chéo kiểu kính
            graphics.fillStyle(0xFFFFFF, 0.13);
            graphics.fillRect(-w * 0.30, -h / 2, w * 0.16, h);
            graphics.fillStyle(0xFFFFFF, 0.07);
            graphics.fillRect(w * 0.04, -h / 2, w * 0.10, h);
            // Sao mờ bên trong (vị trí cố định — đồng nhất giữa các gương)
            const starSpots = [[-0.22, -0.26, 2.2], [0.18, -0.10, 1.6], [-0.08, 0.14, 1.9], [0.24, 0.28, 1.4], [-0.26, 0.30, 1.5]];
            starSpots.forEach(([sx, sy, r]) => {
                graphics.fillStyle(0xE1BEE7, 0.65);
                graphics.fillCircle(sx * w, sy * h, r);
                graphics.fillStyle(0xFFFFFF, 0.8);
                graphics.fillCircle(sx * w, sy * h, r * 0.45);
            });
        } else {
            graphics.fillGradientStyle(0xFFF8DC, 0xFFECB3, 0xB3E5FC, 0xE1F5FE, 1);
            graphics.fillEllipse(0, 0, w, h);
            // Tia sáng trên mặt gương đã giải
            graphics.fillStyle(0xFFFFFF, 0.6);
            graphics.fillRect(-w * 0.26, -h / 2, w * 0.18, h);
            // Sao vàng lấp lánh
            const starSpots = [[-0.18, -0.22, 2.6], [0.20, 0.05, 2.0], [-0.05, 0.26, 2.2]];
            starSpots.forEach(([sx, sy, r]) => {
                graphics.fillStyle(0xFFD700, 0.9);
                graphics.fillCircle(sx * w, sy * h, r);
                graphics.fillStyle(0xFFFFFF, 0.95);
                graphics.fillCircle(sx * w, sy * h, r * 0.45);
            });
        }

        // 4 viên đá quý ở 4 phía khung
        const gemPos = [[-w / 2 - 3, 0], [w / 2 + 3, 0], [0, -h / 2 - 3], [0, h / 2 + 3]];
        gemPos.forEach(([gx, gy]) => {
            graphics.fillStyle(0xFFFFFF, 0.95);
            graphics.fillCircle(gx, gy, 5);
            graphics.fillStyle(gemColor, 1);
            graphics.fillCircle(gx, gy, 3.2);
        });
    }

    selectMirror(mirrorIndex) {
        if (this.isInChallengeView) return;
        
        this.currentMirrorIndex = mirrorIndex;
        this.currentPuzzle = this.puzzles[mirrorIndex];
        
        // Zoom into mirror with animation
        const mirror = this.mirrors[mirrorIndex];
        
        // Flash effect
        this.cameras.main.flash(300, 255, 255, 255, false);
        
        // Transition to challenge view
        this.time.delayedCall(300, () => {
            this.showChallengeView();
        });
    }

    showChallengeView() {
        this.isInChallengeView = true;
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Hide gallery elements
        this.mirrors.forEach(m => {
            if (m.container) m.container.setVisible(false);
        });

        // Create challenge container
        this.challengeContainer = this.add.container(0, 0);
        this.challengeContainer.setDepth(200);

        // Nền gradient tím đêm + sao lấp lánh
        const challengeBg = this.add.graphics();
        challengeBg.fillGradientStyle(0x2A1A4E, 0x2A1A4E, 0x14082A, 0x14082A, 0.98);
        challengeBg.fillRect(0, 0, width, height);
        this.challengeContainer.add(challengeBg);
        for (let i = 0; i < 26; i++) {
            const sx = ((i * 197) % width);
            const sy = ((i * 131) % height);
            const star = this.add.graphics();
            star.fillStyle(0xFFFFFF, 0.25 + (i % 4) * 0.15);
            star.fillCircle(0, 0, 1 + (i % 3) * 0.7);
            star.setPosition(sx, sy);
            this.challengeContainer.add(star);
        }

        const hudH = 80;
        const titleY = hudH + 30;
        const puzzle = this.currentPuzzle;

        // Pill tiêu đề
        const titleStr = `🪞 Gương ${this.currentMirrorIndex + 1}: ${this.getCategoryName(puzzle.category)}`;
        const titleText = this.add.text(width / 2, titleY, titleStr, {
            fontSize: '23px',
            fill: '#FFE9A8',
            fontFamily: 'Comic Sans MS, Arial',
            fontStyle: 'bold',
        }).setOrigin(0.5);
        const titlePadX = 24;
        const titlePadY = 11;
        const titleBg = this.add.graphics();
        const tbw = titleText.width + titlePadX * 2;
        const tbh = titleText.height + titlePadY * 2;
        titleBg.fillStyle(0x3B2456, 0.92);
        titleBg.fillRoundedRect(width / 2 - tbw / 2, titleY - tbh / 2, tbw, tbh, tbh / 2);
        titleBg.lineStyle(2.5, 0xFFD700, 0.95);
        titleBg.strokeRoundedRect(width / 2 - tbw / 2, titleY - tbh / 2, tbw, tbh, tbh / 2);
        this.challengeContainer.add(titleBg);
        this.challengeContainer.add(titleText);

        const titleBottom = titleY + tbh / 2;

        // Create two image panels (original and reflection) - positioned below title
        this.createImagePanels(width, height, titleBottom);

        // Kính lúp ở giữa hai khung
        const lens = this.add.text(width / 2, this._panelY || height / 2, '🔍', {
            fontSize: '34px',
        }).setOrigin(0.5);
        this.challengeContainer.add(lens);
        this.tweens.add({
            targets: lens,
            scale: 1.18,
            duration: 800,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Pill hướng dẫn dưới đáy
        const instrStr = 'Tìm 1 điểm khác biệt ở bức tranh bên phải!';
        const instructionText = this.add.text(width / 2, height - 78, instrStr, {
            fontSize: '17px', fill: '#FFFFFF', fontFamily: 'Comic Sans MS, Arial', fontStyle: 'bold',
        }).setOrigin(0.5);
        const ibw = instructionText.width + 32;
        const ibh = instructionText.height + 16;
        const instrBg = this.add.graphics();
        instrBg.fillStyle(0x6A3FA0, 0.85);
        instrBg.fillRoundedRect(width / 2 - ibw / 2, height - 78 - ibh / 2, ibw, ibh, ibh / 2);
        instrBg.lineStyle(2, 0xCE93D8, 0.9);
        instrBg.strokeRoundedRect(width / 2 - ibw / 2, height - 78 - ibh / 2, ibw, ibh, ibh / 2);
        this.challengeContainer.add(instrBg);
        this.challengeContainer.add(instructionText);

        // Hint button
        this.createHintButton(width, height);

        // Back button
        this.createBackButton(width, height);

        // Animate challenge view in
        this.challengeContainer.setAlpha(0);
        this.tweens.add({
            targets: this.challengeContainer,
            alpha: 1,
            duration: 300,
            ease: 'Power2'
        });
    }

    getCategoryName(category) {
        const names = {
            'animals': 'Động Vật',
            'nature': 'Thiên Nhiên',
            'objects': 'Đồ Vật',
            'food': 'Thức Ăn',
            'vehicles': 'Phương Tiện',
            'fantasy': 'Kỳ Ảo',
            'seasonal': 'Mùa Lễ Hội'
        };
        return names[category] || category;
    }

    createImagePanels(width, height, titleBottom) {
        const panelWidth = width * 0.36;
        const bottomReserved = 100;
        const availableHeight = height - titleBottom - bottomReserved;
        const panelHeight = Math.min(availableHeight * 0.86, height * 0.52);
        const panelY = titleBottom + availableHeight / 2 + 8;
        this._panelY = panelY;

        // Left panel (Original)
        const leftX = width * 0.27;
        this.createImagePanel(leftX, panelY, panelWidth, panelHeight, '📖 Tranh gốc', true);

        // Right panel (Reflection)
        const rightX = width * 0.73;
        this.createImagePanel(rightX, panelY, panelWidth, panelHeight, '🪞 Gương phản chiếu', false);
    }

    createImagePanel(x, y, width, height, label, isOriginal) {
        const puzzle = this.currentPuzzle;

        // Khung tranh: đế gỗ → viền vàng → nền kem
        const frame = this.add.graphics();
        frame.fillStyle(0x8B5A2B, 1);
        frame.fillRoundedRect(x - width/2 - 14, y - height/2 - 14, width + 28, height + 28, 18);
        frame.fillStyle(0xFFC94D, 1);
        frame.fillRoundedRect(x - width/2 - 9, y - height/2 - 9, width + 18, height + 18, 14);
        frame.fillStyle(0xFFFDF5, 1);
        frame.fillRoundedRect(x - width/2 - 3, y - height/2 - 3, width + 6, height + 6, 10);
        // 4 viên đá ở góc khung
        const cornerAccent = isOriginal ? 0x7FE3C3 : 0xFF9EC7;
        [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sy]) => {
            const gx = x + sx * (width / 2 + 9);
            const gy = y + sy * (height / 2 + 9);
            frame.fillStyle(0xFFFFFF, 0.95);
            frame.fillCircle(gx, gy, 5.5);
            frame.fillStyle(cornerAccent, 1);
            frame.fillCircle(gx, gy, 3.4);
        });
        this.challengeContainer.add(frame);

        // Pill nhãn phía trên khung
        const labelY = y - height / 2 - 14 - 18;
        const labelText = this.add.text(x, labelY, label, {
            fontSize: '16px',
            fill: '#FFFFFF',
            fontFamily: 'Comic Sans MS, Arial',
            fontStyle: 'bold',
        }).setOrigin(0.5);
        const lbw = labelText.width + 26;
        const lbh = labelText.height + 12;
        const labelBg = this.add.graphics();
        labelBg.fillStyle(isOriginal ? 0x2E8B7A : 0xB04A8C, 0.95);
        labelBg.fillRoundedRect(x - lbw / 2, labelY - lbh / 2, lbw, lbh, lbh / 2);
        labelBg.lineStyle(2, 0xFFFFFF, 0.85);
        labelBg.strokeRoundedRect(x - lbw / 2, labelY - lbh / 2, lbw, lbh, lbh / 2);
        this.challengeContainer.add(labelBg);
        this.challengeContainer.add(labelText);

        // Generate scene representation
        this.generateSceneGraphics(x, y, width, height, puzzle, isOriginal);
    }

    /**
     * RNG có seed (mulberry32) — cả 2 panel vẽ từ cùng 1 seed nên bối cảnh
     * giống hệt nhau, chỉ khác đúng 1 điểm khác biệt của câu đố.
     */
    makeSeededRng(seed) {
        let s = (seed >>> 0) || 1;
        const next = () => {
            s |= 0; s = (s + 0x6D2B79F5) | 0;
            let t = Math.imul(s ^ (s >>> 15), 1 | s);
            t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
            return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        };
        return {
            next,
            between: (a, b) => a + Math.floor(next() * (b - a + 1)),
            pick: (arr) => arr[Math.floor(next() * arr.length)],
        };
    }

    /** Map tên vật (tiếng Anh trong dữ liệu) → emoji tương ứng */
    elementEmoji(element) {
        const e = (element || '').toLowerCase();
        const map = [
            ['butterfl', '🦋'], ['bee', '🐝'], ['duck', '🦆'], ['baby bird', '🐤'],
            ['bird', '🐦'], ['fish', '🐠'], ['star', '⭐'], ['heart', '💖'],
            ['cloud', '☁️'], ['tulip', '🌷'], ['flower', '🌸'], ['acorn', '🌰'],
            ['apple', '🍎'], ['balloon', '🎈'], ['cand', '🍬'], ['gem', '💎'],
            ['egg', '🥚'], ['carrot', '🥕'], ['mushroom', '🍄'], ['leaf', '🍃'],
            ['shell', '🐚'], ['ladybug', '🐞'], ['frog', '🐸'], ['snail', '🐌'],
            ['moon', '🌙'], ['hat', '🎩'], ['crown', '👑'], ['ribbon', '🎀'],
            ['collar', '🔴'], ['bottle', '🍼'], ['bone', '🦴'], ['ball', '⚽'],
            ['kite', '🪁'], ['umbrella', '☂️'], ['snow', '❄️'], ['sun', '☀️'],
            ['penguin', '🐧'], ['owl', '🦉'], ['cat', '🐱'], ['dog', '🐶'],
            ['bunn', '🐰'], ['car', '🚗'], ['bus', '🚌'], ['train', '🚂'],
            ['boat', '⛵'], ['rocket', '🚀'], ['cookie', '🍪'], ['cake', '🍰'],
        ];
        for (const [key, emoji] of map) {
            if (e.includes(key)) return emoji;
        }
        return null;
    }

    generateSceneGraphics(x, y, panelWidth, panelHeight, puzzle, isOriginal) {
        // Create a procedurally generated scene based on puzzle data
        const sceneContainer = this.add.container(x, y);
        this.challengeContainer.add(sceneContainer);

        // RNG chung cho cả 2 panel → nền giống hệt nhau
        const rng = this.makeSeededRng(puzzle.id * 7919 + 17);

        // Base scene elements based on category
        this.drawBaseScene(sceneContainer, panelWidth, panelHeight, puzzle.category, rng);

        // Draw main element based on puzzle
        this.drawMainElement(sceneContainer, panelWidth, panelHeight, puzzle, isOriginal, rng);

        // Cắt nội dung theo khung bo góc của panel
        const maskG = this.add.graphics();
        maskG.fillStyle(0xffffff, 1);
        maskG.fillRoundedRect(x - panelWidth / 2, y - panelHeight / 2, panelWidth, panelHeight, 10);
        sceneContainer.setMask(new Phaser.Display.Masks.GeometryMask(this, maskG));
        this.challengeContainer.add(maskG);

        // Create clickable difference area (only on the panel that has the difference)
        if (!isOriginal) {
            // The difference is in the reflection panel
            const diffLocation = puzzle.difference.location;
            const diffX = (diffLocation.x - 0.5) * panelWidth;
            const diffY = (diffLocation.y - 0.5) * panelHeight;
            
            // Create invisible click zone
            const clickZone = this.add.zone(diffX, diffY, panelWidth * 0.25, panelHeight * 0.25);
            clickZone.setInteractive({ useHandCursor: true });
            clickZone.on('pointerdown', () => {
                this.handleCorrectAnswer();
            });
            sceneContainer.add(clickZone);
            this.differenceZone = { container: sceneContainer, zone: clickZone, x: diffX, y: diffY };
        }

        // Make the whole panel clickable for wrong answers
        const wrongClickZone = this.add.zone(0, 0, panelWidth, panelHeight);
        wrongClickZone.setInteractive({ useHandCursor: true });
        wrongClickZone.on('pointerdown', (pointer) => {
            // Check if clicked on the correct difference zone
            if (this.differenceZone && !isOriginal) {
                const localX = pointer.x - x;
                const localY = pointer.y - y;
                const diffLoc = puzzle.difference.location;
                const diffX = (diffLoc.x - 0.5) * panelWidth;
                const diffY = (diffLoc.y - 0.5) * panelHeight;
                const dist = Math.sqrt(Math.pow(localX - diffX, 2) + Math.pow(localY - diffY, 2));
                
                if (dist < panelWidth * 0.15) {
                    this.handleCorrectAnswer();
                    return;
                }
            }
            this.handleWrongAnswer(pointer.x, pointer.y);
        });
        sceneContainer.add(wrongClickZone);
        sceneContainer.sendToBack(wrongClickZone);
    }

    drawBaseScene(container, width, height, category, rng) {
        const baseScene = this.add.graphics();

        // Bầu trời chung cho mọi thể loại
        baseScene.fillGradientStyle(0xB3E5FC, 0xB3E5FC, 0xE8F8FF, 0xE8F8FF, 1);
        baseScene.fillRoundedRect(-width / 2, -height / 2, width, height, 10);

        switch (category) {
            case 'animals':
            case 'nature':
                // Đồng cỏ xanh
                baseScene.fillStyle(0x7CCD7C, 1);
                baseScene.fillRect(-width / 2, height * 0.18, width, height * 0.32);
                baseScene.fillStyle(0x68B968, 1);
                baseScene.fillRect(-width / 2, height * 0.18, width, 8);
                break;
            case 'objects':
            case 'food':
                // Nền trong nhà ấm áp
                baseScene.fillStyle(0xFFE4B5, 1);
                baseScene.fillRect(-width / 2, height * 0.12, width, height * 0.38);
                baseScene.fillStyle(0xD2691E, 1);
                baseScene.fillRect(-width / 2, height * 0.32, width, 10);
                break;
            case 'vehicles':
                // Đường xám + vạch kẻ
                baseScene.fillStyle(0x808080, 1);
                baseScene.fillRect(-width / 2, height * 0.2, width, height * 0.3);
                baseScene.fillStyle(0xFFFFFF, 1);
                for (let i = 0; i < 5; i++) {
                    baseScene.fillRect(-width / 2 + 10 + i * (width / 4.4), height * 0.33, width / 7, 5);
                }
                break;
            case 'fantasy':
                // Bầu trời phép thuật
                baseScene.fillGradientStyle(0x4B0082, 0x6A3FA0, 0x2A1A4E, 0x4B0082, 0.9);
                baseScene.fillRect(-width / 2, height * 0.08, width, height * 0.42);
                for (let i = 0; i < 8; i++) {
                    const sx = rng.between(-Math.round(width / 2) + 12, Math.round(width / 2) - 12);
                    const sy = rng.between(-Math.round(height / 2) + 12, -6);
                    baseScene.fillStyle(0xFFD700, 0.85);
                    baseScene.fillCircle(sx, sy, 2.5);
                    baseScene.fillStyle(0xFFFFFF, 0.9);
                    baseScene.fillCircle(sx, sy, 1.1);
                }
                break;
            case 'seasonal':
                // Nền lễ hội kem
                baseScene.fillStyle(0xFFF3DC, 1);
                baseScene.fillRect(-width / 2, height * 0.2, width, height * 0.3);
                break;
        }
        container.add(baseScene);

        // Hoa emoji trang trí cho cảnh thiên nhiên (vị trí seeded → 2 panel giống nhau)
        if (category === 'animals' || category === 'nature') {
            const flowers = ['🌸', '🌼', '🌷', '🌻'];
            for (let i = 0; i < 4; i++) {
                const fx = rng.between(-Math.round(width / 2) + 26, Math.round(width / 2) - 26);
                const fy = Math.round(height * 0.30) + rng.between(-6, 14);
                const f = this.add.text(fx, fy, flowers[rng.between(0, flowers.length - 1)], { fontSize: '20px' }).setOrigin(0.5);
                container.add(f);
            }
        }
    }

    drawMainElement(container, width, height, puzzle, isOriginal, rng) {
        const diff = puzzle.difference;

        // Position based on difference location
        const elemX = (diff.location.x - 0.5) * width;
        const elemY = (diff.location.y - 0.5) * height;

        // Draw element based on type and apply difference
        const showDifference = !isOriginal;

        switch (diff.type) {
            case 'count':
                this.drawCountElement(container, rng, elemX, elemY, puzzle, showDifference);
                break;
            case 'color':
                this.drawColorElement(container, rng, elemX, elemY, puzzle, showDifference);
                break;
            case 'presence':
                this.drawPresenceElement(container, rng, elemX, elemY, puzzle, showDifference);
                break;
            case 'size':
                this.drawSizeElement(container, rng, elemX, elemY, puzzle, showDifference);
                break;
            case 'direction':
                this.drawDirectionElement(container, rng, elemX, elemY, puzzle, showDifference);
                break;
            case 'shape':
                this.drawShapeElement(container, rng, elemX, elemY, puzzle, showDifference);
                break;
            case 'pattern':
                this.drawPatternElement(container, rng, elemX, elemY, puzzle, showDifference);
                break;
            case 'position':
                this.drawPositionElement(container, rng, elemX, elemY, puzzle, showDifference);
                break;
            default:
                this.drawGenericElement(container, rng, elemX, elemY, puzzle, showDifference);
        }
    }

    drawCountElement(container, rng, x, y, puzzle, showDifference) {
        // Parse count from original/reflection
        const originalMatch = puzzle.difference.original.match(/(\d+)/);
        const reflectionMatch = puzzle.difference.reflection.match(/(\d+)/);
        const originalCount = originalMatch ? parseInt(originalMatch[1]) : 3;
        const reflectionCount = reflectionMatch ? parseInt(reflectionMatch[1]) : 2;
        const count = showDifference ? reflectionCount : originalCount;

        const element = puzzle.difference.element.toLowerCase();
        const emoji = this.elementEmoji(element);
        const isDot = element.includes('dot') || element.includes('spot');
        const colors = [0xFF69B4, 0xFFD700, 0x87CEEB, 0x90EE90, 0xFF6347, 0x9370DB, 0x00CED1, 0xFFA500];

        // Số thứ tự i dùng chung seed → các phần tử trùng nhau ở cả 2 panel,
        // chỉ phần tử thừa/thiếu là điểm khác biệt duy nhất.
        for (let i = 0; i < count; i++) {
            const offsetX = (i - (count - 1) / 2) * 36 + rng.between(-4, 4);
            const offsetY = rng.between(-12, 12);

            if (emoji && !isDot) {
                const t = this.add.text(x + offsetX, y + offsetY, emoji, { fontSize: '32px' }).setOrigin(0.5);
                container.add(t);
            } else {
                // Chấm tròn (đốm bọ rùa, đốm bò…) hoặc vật chưa có emoji
                const g = this.add.graphics();
                const color = colors[(i + rng.between(0, 2)) % colors.length];
                g.fillStyle(color, 1);
                g.fillCircle(x + offsetX, y + offsetY, 10);
                g.lineStyle(2, 0xFFFFFF, 0.8);
                g.strokeCircle(x + offsetX, y + offsetY, 10);
                g.fillStyle(0xFFFFFF, 0.55);
                g.fillCircle(x + offsetX - 3, y + offsetY - 3, 3);
                container.add(g);
            }
        }
    }

    drawColorElement(container, rng, x, y, puzzle, showDifference) {
        const colorMap = {
            'red': 0xFF4D4D, 'blue': 0x3D7BFF, 'green': 0x3ECF6E, 'yellow': 0xFFE14D,
            'pink': 0xFF69B4, 'purple': 0x9370DB, 'orange': 0xFFA500, 'brown': 0x8B4513,
            'white': 0xFFFFFF, 'black': 0x2A2A2A, 'gold': 0xFFD700, 'silver': 0xC0C0C0,
            'teal': 0x00B2A9, 'chocolate': 0xD2691E, 'strawberry': 0xFF1493
        };

        let color = 0xFF69B4;
        const colorText = showDifference ? puzzle.difference.reflection.toLowerCase() : puzzle.difference.original.toLowerCase();

        for (const [name, hex] of Object.entries(colorMap)) {
            if (colorText.includes(name)) {
                color = hex;
                break;
            }
        }

        // Quả cầu phép màu với quầng sáng + tia lấp lánh
        const g = this.add.graphics();
        g.fillStyle(color, 0.25);
        g.fillCircle(x, y, 36);
        g.fillStyle(color, 1);
        g.fillCircle(x, y, 26);
        g.lineStyle(3, 0xFFFFFF, 0.9);
        g.strokeCircle(x, y, 26);
        g.fillStyle(0xFFFFFF, 0.8);
        g.fillCircle(x - 8, y - 9, 7);
        g.fillStyle(0xFFFFFF, 0.4);
        g.fillCircle(x + 7, y + 9, 4);
        container.add(g);

        [[-32, -24], [32, 22]].forEach(([sx, sy]) => {
            const s = this.add.text(x + sx, y + sy, '✨', { fontSize: '15px' }).setOrigin(0.5);
            container.add(s);
        });
    }

    drawPresenceElement(container, rng, x, y, puzzle, showDifference) {
        const hasElement = puzzle.difference.original.toLowerCase().includes('with');
        const shouldDraw = hasElement !== showDifference;
        if (!shouldDraw) return;

        const element = puzzle.difference.element.toLowerCase();
        const emoji = this.elementEmoji(element);

        if (emoji) {
            // Hào quang nhỏ sau vật thể
            const halo = this.add.graphics();
            halo.fillStyle(0xFFF3B0, 0.4);
            halo.fillCircle(x, y, 30);
            container.add(halo);
            const t = this.add.text(x, y, emoji, { fontSize: '44px' }).setOrigin(0.5);
            container.add(t);
        } else {
            // Hộp kho báu vàng cho vật chưa có emoji
            const g = this.add.graphics();
            g.fillStyle(0xFFF3B0, 0.4);
            g.fillCircle(x, y, 28);
            g.fillStyle(0xFFD700, 1);
            g.fillRoundedRect(x - 16, y - 16, 32, 32, 8);
            g.lineStyle(2.5, 0xB8860B, 1);
            g.strokeRoundedRect(x - 16, y - 16, 32, 32, 8);
            g.fillStyle(0xFFFFFF, 0.6);
            g.fillRoundedRect(x - 11, y - 11, 10, 8, 3);
            container.add(g);
        }
    }

    drawSizeElement(container, rng, x, y, puzzle, showDifference) {
        const text = (showDifference ? puzzle.difference.reflection : puzzle.difference.original).toLowerCase();
        const isSmall = /(small|narrow|short|tiny)/.test(text);
        const size = isSmall ? 15 : 30;

        const emoji = this.elementEmoji(puzzle.difference.element);
        if (emoji) {
            const t = this.add.text(x, y, emoji, { fontSize: `${Math.round(size * 2)}px` }).setOrigin(0.5);
            container.add(t);
            return;
        }

        const g = this.add.graphics();
        g.fillStyle(0x7FE3C3, 1);
        g.fillCircle(x, y, size);
        g.lineStyle(3, 0xFFFFFF, 0.85);
        g.strokeCircle(x, y, size);
        g.fillStyle(0x2E8B7A, 1);
        g.fillCircle(x - size * 0.2, y - size * 0.2, size * 0.3);
        container.add(g);
    }

    drawDirectionElement(container, rng, x, y, puzzle, showDifference) {
        const facingRight = showDifference ?
            puzzle.difference.reflection.toLowerCase().includes('right') :
            puzzle.difference.original.toLowerCase().includes('right');

        const emoji = this.elementEmoji(puzzle.difference.element) || '🐤';
        const t = this.add.text(x, y, emoji, { fontSize: '46px' }).setOrigin(0.5);
        // Lật ngang emoji theo hướng nhìn
        t.setScale(facingRight ? 1 : -1, 1);
        container.add(t);
    }

    drawShapeElement(container, rng, x, y, puzzle, showDifference) {
        const shapeText = showDifference ? puzzle.difference.reflection : puzzle.difference.original;
        const graphics = this.add.graphics();
        container.add(graphics);

        graphics.fillStyle(0x9370DB, 1);
        graphics.lineStyle(3, 0xFFFFFF, 0.85);

        const lower = shapeText.toLowerCase();
        if (lower.includes('circle') || lower.includes('round')) {
            graphics.fillCircle(x, y, 25);
            graphics.strokeCircle(x, y, 25);
        } else if (lower.includes('square') || lower.includes('rectangle')) {
            graphics.fillRoundedRect(x - 20, y - 20, 40, 40, 6);
            graphics.strokeRoundedRect(x - 20, y - 20, 40, 40, 6);
        } else if (lower.includes('triangle')) {
            graphics.fillTriangle(x, y - 25, x - 25, y + 20, x + 25, y + 20);
        } else if (lower.includes('star')) {
            this.drawStar(graphics, x, y, 27, 5, 0xFFD700);
        } else if (lower.includes('heart')) {
            this.drawHeart(graphics, x, y, 32, 0xFF69B4);
        } else if (lower.includes('diamond')) {
            graphics.fillTriangle(x, y - 25, x - 20, y, x + 20, y);
            graphics.fillTriangle(x, y + 25, x - 20, y, x + 20, y);
        } else if (lower.includes('crescent')) {
            graphics.fillStyle(0xFFE14D, 1);
            graphics.fillCircle(x, y, 25);
            graphics.fillStyle(0xB3E5FC, 1);
            graphics.fillCircle(x + 10, y, 22);
        } else if (lower.includes('oval')) {
            graphics.fillEllipse(x, y, 40, 28);
            graphics.strokeEllipse(x, y, 40, 28);
        } else {
            graphics.fillCircle(x, y, 25);
            graphics.strokeCircle(x, y, 25);
        }
    }

    drawPatternElement(container, rng, x, y, puzzle, showDifference) {
        const patternText = showDifference ? puzzle.difference.reflection : puzzle.difference.original;
        const graphics = this.add.graphics();
        container.add(graphics);

        // Thẻ canvas trắng viền tím
        graphics.fillStyle(0xFFFFFF, 1);
        graphics.fillRoundedRect(x - 32, y - 32, 64, 64, 12);
        graphics.lineStyle(3, 0xB39DDB, 1);
        graphics.strokeRoundedRect(x - 32, y - 32, 64, 64, 12);

        const lower = patternText.toLowerCase();
        if (lower.includes('stripe') || lower.includes('striped')) {
            graphics.fillStyle(0xFF6B6B, 1);
            for (let i = 0; i < 4; i++) {
                graphics.fillRect(x - 26 + i * 15, y - 26, 8, 52);
            }
        } else if (lower.includes('polka') || lower.includes('dot')) {
            graphics.fillStyle(0x4D9FFF, 1);
            for (let i = 0; i < 9; i++) {
                const px = x - 20 + (i % 3) * 20;
                const py = y - 20 + Math.floor(i / 3) * 20;
                graphics.fillCircle(px, py, 5.5);
            }
        } else if (lower.includes('checker')) {
            graphics.fillStyle(0x5C3A1E, 1);
            for (let i = 0; i < 4; i++) {
                for (let j = 0; j < 4; j++) {
                    if ((i + j) % 2 === 0) {
                        graphics.fillRect(x - 28 + i * 14, y - 28 + j * 14, 14, 14);
                    }
                }
            }
        } else {
            graphics.fillStyle(0x90EE90, 1);
            graphics.fillCircle(x, y, 20);
        }
    }

    drawPositionElement(container, rng, x, y, puzzle, showDifference) {
        // This is typically for clock hands or similar position-based differences
        const posText = showDifference ? puzzle.difference.reflection : puzzle.difference.original;
        const graphics = this.add.graphics();
        container.add(graphics);

        // Mặt đồng hồ kem viền vàng
        graphics.fillStyle(0xFFF8DC, 1);
        graphics.fillCircle(x, y, 32);
        graphics.lineStyle(4, 0xFFC94D, 1);
        graphics.strokeCircle(x, y, 32);
        graphics.lineStyle(2, 0x8B5A2B, 1);
        graphics.strokeCircle(x, y, 28);

        // Draw hour markers
        for (let i = 0; i < 12; i++) {
            const angle = (i * 30 - 90) * Math.PI / 180;
            graphics.lineStyle(2, 0x5C3A1E, 1);
            graphics.beginPath();
            graphics.moveTo(x + Math.cos(angle) * 23, y + Math.sin(angle) * 23);
            graphics.lineTo(x + Math.cos(angle) * 26, y + Math.sin(angle) * 26);
            graphics.strokePath();
        }

        // Parse time
        let hours = 3;
        if (posText.includes('6')) hours = 6;
        else if (posText.includes('9')) hours = 9;
        else if (posText.includes('12')) hours = 12;

        // Kim giờ
        const hourAngle = (hours * 30 - 90) * Math.PI / 180;
        graphics.lineStyle(5, 0x5C3A1E, 1);
        graphics.beginPath();
        graphics.moveTo(x, y);
        graphics.lineTo(x + Math.cos(hourAngle) * 14, y + Math.sin(hourAngle) * 14);
        graphics.strokePath();

        // Kim phút luôn chỉ 12
        graphics.lineStyle(3, 0x8B5A2B, 1);
        graphics.beginPath();
        graphics.moveTo(x, y);
        graphics.lineTo(x, y - 21);
        graphics.strokePath();

        graphics.fillStyle(0xFF6B6B, 1);
        graphics.fillCircle(x, y, 3);
    }

    drawGenericElement(container, rng, x, y, puzzle, showDifference) {
        const graphics = this.add.graphics();
        container.add(graphics);
        graphics.fillStyle(0x90EE90, 1);
        graphics.fillCircle(x, y, 25);
        graphics.lineStyle(3, 0xFFFFFF, 0.85);
        graphics.strokeCircle(x, y, 25);
        graphics.fillStyle(0xFFD700, 1);
        graphics.fillCircle(x, y, 15);
    }

    drawStar(graphics, x, y, radius, points, color) {
        graphics.fillStyle(color, 1);
        graphics.beginPath();
        for (let i = 0; i < points * 2; i++) {
            const r = i % 2 === 0 ? radius : radius * 0.5;
            const angle = (i * Math.PI / points) - Math.PI / 2;
            const px = x + Math.cos(angle) * r;
            const py = y + Math.sin(angle) * r;
            if (i === 0) graphics.moveTo(px, py);
            else graphics.lineTo(px, py);
        }
        graphics.closePath();
        graphics.fillPath();
    }

    drawHeart(graphics, x, y, size, color) {
        graphics.fillStyle(color, 1);
        // Draw heart shape using points
        const points = [];
        const centerY = y + size * 0.3;
        
        // Create heart shape with bezier approximation using points
        for (let i = 0; i <= 20; i++) {
            const t = i / 20;
            let px, py;
            
            if (t < 0.5) {
                // Left side of heart
                const t2 = t * 2;
                px = Phaser.Math.Interpolation.Bezier([x, x - size * 0.5, x - size, x], t2);
                py = Phaser.Math.Interpolation.Bezier([centerY, y - size * 0.3, y + size * 0.1, y + size * 0.5], t2);
            } else {
                // Right side of heart
                const t2 = (t - 0.5) * 2;
                px = Phaser.Math.Interpolation.Bezier([x, x + size, x + size * 0.5, x], t2);
                py = Phaser.Math.Interpolation.Bezier([y + size * 0.5, y + size * 0.1, y - size * 0.3, centerY], t2);
            }
            
            points.push({ x: px, y: py });
        }
        
        graphics.fillPoints(points, true);
    }

    createHintButton(width, height) {
        const btnWidth = 100;
        const btnHeight = 45;
        const btnX = width - btnWidth / 2 - 22;
        const btnY = height - btnHeight / 2 - 18;
        
        const hintBtn = this.add.container(btnX, btnY);
        
        // Background with gradient effect
        const hintBg = this.add.graphics();
        // Main fill - bright green
        hintBg.fillStyle(0x4CAF50, 1);
        hintBg.fillRoundedRect(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight, 12);
        // Border - gold
        hintBg.lineStyle(3, 0xFFD700, 1);
        hintBg.strokeRoundedRect(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight, 12);
        // Inner highlight
        hintBg.fillStyle(0x66BB6A, 0.5);
        hintBg.fillRoundedRect(-btnWidth/2 + 2, -btnHeight/2 + 2, btnWidth - 4, btnHeight/2 - 2, 10);
        hintBtn.add(hintBg);

        // Icon and text - better spacing
        const iconText = this.add.text(-25, 0, '💡', {
            fontSize: '22px',
        }).setOrigin(0.5, 0.5);
        hintBtn.add(iconText);
        
        const hintText = this.add.text(15, 0, 'HINT', {
            fontSize: '18px',
            fill: '#FFFFFF',
            fontFamily: 'Comic Sans MS, Arial',
            fontStyle: 'bold',
            stroke: '#2E7D32',
            strokeThickness: 2
        }).setOrigin(0.5, 0.5);
        hintBtn.add(hintText);
        this.hintButtonText = hintText;

        hintBtn.setSize(btnWidth, btnHeight);
        hintBtn.setInteractive({ useHandCursor: true });
        
        hintBtn.on('pointerdown', () => {
            // Always allow hints (unlimited)
            this.useHint();
        });

        // Better hover effect
        hintBtn.on('pointerover', () => {
            hintBtn.setScale(1.05);
            hintBg.clear();
            // Brighter on hover
            hintBg.fillStyle(0x66BB6A, 1);
            hintBg.fillRoundedRect(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight, 12);
            hintBg.lineStyle(3, 0xFFD700, 1);
            hintBg.strokeRoundedRect(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight, 12);
            hintBg.fillStyle(0x81C784, 0.5);
            hintBg.fillRoundedRect(-btnWidth/2 + 2, -btnHeight/2 + 2, btnWidth - 4, btnHeight/2 - 2, 10);
        });
        
        hintBtn.on('pointerout', () => {
            hintBtn.setScale(1);
            hintBg.clear();
            hintBg.fillStyle(0x4CAF50, 1);
            hintBg.fillRoundedRect(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight, 12);
            hintBg.lineStyle(3, 0xFFD700, 1);
            hintBg.strokeRoundedRect(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight, 12);
            hintBg.fillStyle(0x66BB6A, 0.5);
            hintBg.fillRoundedRect(-btnWidth/2 + 2, -btnHeight/2 + 2, btnWidth - 4, btnHeight/2 - 2, 10);
        });

        this.challengeContainer.add(hintBtn);
    }

    createBackButton(width, height) {
        const btnW = 110;
        const btnH = 44;
        const backBtn = this.add.container(btnW / 2 + 20, height - btnH / 2 - 18);

        const backBg = this.add.graphics();
        backBg.fillStyle(0xE91E63, 1);
        backBg.fillRoundedRect(-btnW / 2, -btnH / 2, btnW, btnH, 10);
        backBg.lineStyle(2, 0xFFD700, 1);
        backBg.strokeRoundedRect(-btnW / 2, -btnH / 2, btnW, btnH, 10);
        backBtn.add(backBg);

        const backText = this.add.text(0, 0, '← Quay lại', {
            fontSize: '16px', fill: '#FFFFFF', fontFamily: 'Comic Sans MS, Arial', fontStyle: 'bold',
        }).setOrigin(0.5);
        backBtn.add(backText);

        backBtn.setSize(btnW, btnH);
        backBtn.setInteractive({ useHandCursor: true });
        
        backBtn.on('pointerdown', () => {
            this.hideChallengeView();
        });

        backBtn.on('pointerover', () => backBtn.setScale(1.1));
        backBtn.on('pointerout', () => backBtn.setScale(1));

        this.challengeContainer.add(backBtn);
    }

    useHint() {
        // Unlimited hints - no check needed
        
        // Show hint from Wise Owl
        const puzzle = this.currentPuzzle;
        if (this.wiseOwl) {
            this.wiseOwl.encourage();
            this.wiseOwl.showDialogue(puzzle.difference.hint, 4000);
        }

        // Highlight the difference area briefly
        if (this.differenceZone) {
            const highlightCircle = this.add.graphics();
            highlightCircle.lineStyle(4, 0xFFD700, 0.8);
            highlightCircle.strokeCircle(0, 0, 40);
            highlightCircle.x = this.differenceZone.container.x + this.differenceZone.x;
            highlightCircle.y = this.differenceZone.container.y + this.differenceZone.y;
            highlightCircle.setDepth(250);

            this.tweens.add({
                targets: highlightCircle,
                alpha: 0,
                scale: 1.5,
                duration: 1500,
                repeat: 2,
                onComplete: () => highlightCircle.destroy()
            });
        }
    }

    handleCorrectAnswer() {
        // Prevent multiple triggers
        if (this.isProcessingAnswer) return;
        this.isProcessingAnswer = true;

        const mirrorIndex = this.currentMirrorIndex;

        // Điểm khác biệt trên panel phản chiếu (tọa độ màn hình)
        const dz = this.differenceZone;
        const fx = dz ? dz.container.x + dz.x : this.cameras.main.width / 2;
        const fy = dz ? dz.container.y + dz.y : this.cameras.main.height / 2;

        // Hiệu ứng ăn mừng lớn (flash + vòng sáng + confetti + sao bay về HUD)
        if (typeof RewardFX !== 'undefined') {
            RewardFX.correctAnswer(this, fx, fy);
        } else {
            this.createMagicalSparkles(fx, fy);
        }

        // Show Wise Owl celebration with voice
        if (this.wiseOwl) {
            this.wiseOwl.cheer();
            const messages = [
                "Xuất sắc! Mắt bạn thật tinh tường!",
                "Tuyệt vời! Tấm gương đã sáng trở lại!",
                "Giỏi lắm! Ánh sáng đang lan tỏa!",
                "Phi thường! Bạn tìm ra rồi!",
                "Hay quá! Tiếp tục nhé!"
            ];
            const message = messages[Phaser.Math.Between(0, messages.length - 1)];
            this.wiseOwl.showDialogue(message, 2500);
            // Play correct answer voice
            this.playVoice('voice_correct');
        }

        // Restore the mirror (chờ hiệu ứng ăn mừng chạy xong)
        this.time.delayedCall(2000, () => {
            this.hideChallengeView();
            this.restoreMirror(mirrorIndex);
            this.isProcessingAnswer = false;
            
            // Check for level completion
            if (this.mirrorsRestored >= this.totalMirrors) {
                this.time.delayedCall(1000, () => {
                    this.completeLevel();
                });
            }
        });
    }

    handleWrongAnswer(x, y) {
        // Create wrong answer effect at click position
        const wrongMark = this.add.graphics();
        wrongMark.lineStyle(4, 0xFF0000, 1);
        wrongMark.beginPath();
        wrongMark.moveTo(-10, -10);
        wrongMark.lineTo(10, 10);
        wrongMark.moveTo(10, -10);
        wrongMark.lineTo(-10, 10);
        wrongMark.strokePath();
        wrongMark.x = x;
        wrongMark.y = y;
        wrongMark.setDepth(300);

        // Shake animation
        this.tweens.add({
            targets: wrongMark,
            x: x - 5,
            duration: 50,
            yoyo: true,
            repeat: 3,
            onComplete: () => {
                this.tweens.add({
                    targets: wrongMark,
                    alpha: 0,
                    duration: 300,
                    onComplete: () => wrongMark.destroy()
                });
            }
        });

        // Wise Owl encouragement with voice
        if (this.wiseOwl) {
            this.wiseOwl.showSadness();
            const messages = [
                "Gần rồi! Hãy nhìn kỹ hơn nhé!",
                "Từ từ thôi, đừng vội. Quan sát thật cẩn thận!",
                "Thử lại nào! Tôi tin bạn sẽ tìm ra!",
                "Chưa đúng, hãy tìm ở chỗ khác!",
                "Cố lên! Sự khác biệt đang ẩn nấp đâu đó!"
            ];
            const message = messages[Phaser.Math.Between(0, messages.length - 1)];
            this.wiseOwl.showDialogue(message, 3000);
            // Play wrong answer voice
            this.playVoice('voice_wrong');
            
            this.time.delayedCall(3500, () => {
                this.wiseOwl.returnToIdle();
            });
        }
    }

    hideChallengeView() {
        this.isInChallengeView = false;

        // Animate out
        this.tweens.add({
            targets: this.challengeContainer,
            alpha: 0,
            duration: 300,
            ease: 'Power2',
            onComplete: () => {
                if (this.challengeContainer) {
                    this.challengeContainer.destroy();
                    this.challengeContainer = null;
                }
            }
        });

        // Show gallery again
        this.mirrors.forEach(m => {
            if (m.container) m.container.setVisible(true);
        });

        this.currentMirrorIndex = -1;
        this.currentPuzzle = null;
        this.differenceZone = null;
    }

    restoreMirror(mirrorIndex) {
        const mirror = this.mirrors[mirrorIndex];
        if (!mirror || mirror.isRestored) return;

        mirror.isRestored = true;
        this.mirrorsRestored++;

        const container = mirror.container;
        const width = mirror.width;
        const height = mirror.height;

        // Remove old graphics
        if (mirror.graphics) {
            mirror.graphics.destroy();
        }
        if (mirror.glowEffect) {
            mirror.glowEffect.destroy();
        }

        // Create restored mirror graphics (bright and beautiful)
        const restoredGraphics = this.add.graphics();
        this.drawElegantMirror(restoredGraphics, width, height, true, mirror.accent || 0xFFD700);
        container.add(restoredGraphics);
        mirror.graphics = restoredGraphics;

        // Badge chuyển vàng khi gương được giải cứu
        if (mirror.badge) {
            mirror.badge.clear();
            const badgeY = height / 2 + 10;
            mirror.badge.fillStyle(0xFFD700, 1);
            mirror.badge.fillCircle(0, badgeY, 13);
            mirror.badge.lineStyle(2.5, 0xFFFFFF, 1);
            mirror.badge.strokeCircle(0, badgeY, 13);
        }

        // Create bright glow effect
        const brightGlow = this.add.graphics();
        brightGlow.fillStyle(0xFFE082, 0.30);
        brightGlow.fillEllipse(0, 0, width * 1.7, height * 1.6);
        brightGlow.fillStyle(0xFFD700, 0.40);
        brightGlow.fillEllipse(0, 0, width * 1.3, height * 1.2);
        container.add(brightGlow);
        container.sendToBack(brightGlow);
        mirror.glowEffect = brightGlow;

        // Animate bright glow
        this.tweens.add({
            targets: brightGlow,
            alpha: { from: 0.5, to: 0.9 },
            scaleX: { from: 1.0, to: 1.2 },
            scaleY: { from: 1.0, to: 1.2 },
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Update sparkles to be brighter
        mirror.sparkles.forEach(sparkle => {
            sparkle.clear();
            sparkle.fillStyle(0xFFD700, 1);
            sparkle.fillCircle(0, 0, 4);
            sparkle.fillStyle(0xFFFFFF, 0.8);
            sparkle.fillCircle(0, 0, 2);
        });

        // Pop animation
        container.setScale(0.5);
        this.tweens.add({
            targets: container,
            scaleX: 1,
            scaleY: 1,
            duration: 500,
            ease: 'Back.easeOut'
        });

        // Create sparkles
        this.createMagicalSparkles(mirror.x, mirror.y);

        // Make non-interactive
        container.disableInteractive();

        // Update UI progress
        this.updateProgress();
    }

    updateProgress() {
        // This would update a progress indicator if implemented
        console.log(`Progress: ${this.mirrorsRestored}/${this.totalMirrors} mirrors restored`);
    }

    createWiseOwl() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        const owlX = width * 0.88;
        const owlY = height * 0.45;
        
        if (typeof WiseOwlCharacter !== 'undefined') {
            this.wiseOwl = new WiseOwlCharacter(this, {
                x: owlX,
                y: owlY,
                size: 90
            });
            this.wiseOwl.create();
        }
    }

    showIntroductionDialogue() {
        // Intro ngắn 5–10s, có nút bỏ qua
        if (typeof IntroHelper !== 'undefined') {
            IntroHelper.play(this, {
                text: '10 tấm gương bị phù thủy làm mờ! Chạm vào gương và tìm điểm khác biệt nhé!',
                voiceKey: 'voice_intro_1',
                voiceRate: 1.35,
                showText: (t, ms) => { if (this.wiseOwl) this.wiseOwl.showDialogue(t, ms); },
                onComplete: () => console.log('Introduction complete, ready to play'),
            });
        }
    }

    // ==========================================
    // AUDIO METHODS
    // ==========================================
    
    playLevelBGM() {
        if (typeof ScreenLevelBackground !== 'undefined' && ScreenLevelBackground.hasLoadedVideo(this)) return;
        if (this.cache.audio.exists('bgm_mirror_city') && window.gameData?.musicEnabled !== false) {
            // Stop any existing sounds (but keep voice audio capability)
            this.sound.stopAll();
            
            // Create and play Mirror City BGM
            this.levelBGM = this.sound.add('bgm_mirror_city', {
                volume: 0.65, // Increased volume for better presence
                loop: true
            });
            this.levelBGM.play();
            console.log('🎵 Playing Mirror City BGM');
        }
    }

    stopLevelBGM() {
        if (typeof ScreenLevelBackground !== 'undefined') {
            ScreenLevelBackground.fadeOutBackgroundMedia(this, {
                soundProp: 'levelBGM', videoProp: 'levelBgVideo', duration: 500,
            });
            return;
        }
        if (this.levelBGM) {
            this.tweens.add({
                targets: this.levelBGM,
                volume: 0,
                duration: 500,
                onComplete: () => {
                    if (this.levelBGM) {
                        this.levelBGM.stop();
                    }
                }
            });
        }
    }

    playVoice(voiceKey) {
        // Stop current voice if playing
        if (this.currentVoice) {
            this.currentVoice.stop();
            this.currentVoice = null;
        }
        
        // Check if audio exists and play
        if (this.cache.audio.exists(voiceKey)) {
            this.currentVoice = this.sound.add(voiceKey, { volume: 0.35 }); // Lower volume for Wise Owl
            this.currentVoice.play();
            console.log('Playing voice:', voiceKey);
            return this.currentVoice;
        } else {
            console.warn('Voice audio not found:', voiceKey);
            return null;
        }
    }

    playVoiceWithFallback(primaryKey, fallbackKey) {
        if (this.cache.audio.exists(primaryKey)) {
            return this.playVoice(primaryKey);
        } else if (fallbackKey && this.cache.audio.exists(fallbackKey)) {
            return this.playVoice(fallbackKey);
        }
        return null;
    }

    stopVoice() {
        if (this.currentVoice) {
            this.currentVoice.stop();
            this.currentVoice = null;
        }
    }

    createAmbientCreatures() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // Fireflies for magical atmosphere
        if (typeof generateFireflies === 'function' && typeof createMenuFirefly === 'function') {
            const fireflyDataList = generateFireflies(this, 8);
            fireflyDataList.forEach(data => {
                const firefly = createMenuFirefly(this, data);
                if (firefly) {
                    firefly.x = Phaser.Math.Between(width * 0.1, width * 0.9);
                    firefly.y = Phaser.Math.Between(height * 0.2, height * 0.8);
                    this.fireflies.push(firefly);
                }
            });
        }
        
        // Magic particles
        if (typeof generateMagicParticles === 'function' && typeof createMenuMagicParticle === 'function') {
            const particleDataList = generateMagicParticles(this, 10);
            particleDataList.forEach(data => {
                const particle = createMenuMagicParticle(this, data);
                if (particle) {
                    particle.x = Phaser.Math.Between(width * 0.1, width * 0.9);
                    particle.y = Phaser.Math.Between(height * 0.2, height * 0.8);
                    this.magicParticles.push(particle);
                }
            });
        }
    }

    createMagicalSparkles(x, y) {
        const colors = [0xFFD700, 0xFF69B4, 0x87CEEB, 0x90EE90, 0x9370DB, 0xE1BEE7];
        for (let i = 0; i < 25; i++) {
            const sparkle = this.add.graphics();
            const color = colors[Phaser.Math.Between(0, colors.length - 1)];
            
            sparkle.fillStyle(color, 0.8);
            sparkle.fillCircle(0, 0, 6);
            sparkle.fillStyle(0xFFFFFF, 1);
            sparkle.fillCircle(0, 0, 3);
            
            sparkle.x = x;
            sparkle.y = y;
            sparkle.setDepth(300);
            
            const angle = Phaser.Math.Between(0, 360);
            const distance = Phaser.Math.Between(50, 120);
            const targetX = x + Math.cos(Phaser.Math.DegToRad(angle)) * distance;
            const targetY = y + Math.sin(Phaser.Math.DegToRad(angle)) * distance;
            
            this.tweens.add({
                targets: sparkle,
                x: targetX,
                y: targetY,
                alpha: 0,
                scale: 0,
                rotation: 360,
                duration: 1000,
                ease: 'Power2',
                onComplete: () => sparkle.destroy()
            });
        }
    }

    updateUIScene() {
        // Update the UI scene to show Level 2 info
        const uiScene = this.scene.get('UIScene');
        if (uiScene) {
            // The UIScene can be updated to show "Level 2: Thành Phố Gương"
            // For now, we'll leave it as is
        }
    }

    update() {
        // Update ambient creatures
        if (this.fireflies && this.fireflies.length > 0) {
            this.fireflies.forEach(firefly => {
                const behaviorSystem = firefly.getData('behaviorSystem');
                if (behaviorSystem && typeof behaviorSystem.update === 'function') {
                    behaviorSystem.update(this.fireflies);
                }
            });
        }
        
        if (this.magicParticles && this.magicParticles.length > 0) {
            this.magicParticles.forEach(particle => {
                const behaviorSystem = particle.getData('behaviorSystem');
                if (behaviorSystem && typeof behaviorSystem.update === 'function') {
                    behaviorSystem.update(this.magicParticles);
                }
            });
        }
    }

    completeLevel() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Grand celebration sparkles
        for (let i = 0; i < 10; i++) {
            const x = Phaser.Math.Between(50, width - 50);
            const y = Phaser.Math.Between(50, height - 50);
            this.time.delayedCall(i * 200, () => {
                this.createMagicalSparkles(x, y);
            });
        }

        // Wise Owl final celebration with voice
        if (this.wiseOwl) {
            this.wiseOwl.celebrate();
            this.wiseOwl.showDialogue("Phi thường! Tất cả 10 tấm gương đã sáng rực rỡ! Thành Phố Gương đã được giải cứu!", 6000);
            // Play level complete voice
            this.playVoice('voice_complete');
        }

        // Show reward after delay
        this.time.delayedCall(3000, () => {
            this.showReward();
        });
    }

    showReward() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // Reward overlay
        const rewardBg = this.add.graphics();
        rewardBg.fillStyle(0x000000, 0.8);
        rewardBg.fillRect(0, 0, width, height);
        rewardBg.setDepth(400);
        
        // Reward panel
        const panelBg = this.add.graphics();
        panelBg.fillGradientStyle(0xFFD700, 0xFFD700, 0xFFA500, 0xFFA500, 1);
        panelBg.fillRoundedRect(0, 0, width * 0.7, height * 0.55, 25);
        panelBg.lineStyle(5, 0xFFFFFF, 1);
        panelBg.strokeRoundedRect(0, 0, width * 0.7, height * 0.55, 25);
        panelBg.generateTexture('rewardPanel2', width * 0.7, height * 0.55);
        panelBg.destroy();
        
        const panel = this.add.image(width / 2, height / 2, 'rewardPanel2');
        panel.setDepth(401);
        
        // Reward title
        const rewardTitle = this.add.text(width / 2, height * 0.32, '🏆 Trang sách số 2', {
            fontSize: '36px',
            fill: '#8B4513',
            fontFamily: 'Comic Sans MS, Arial',
            fontStyle: 'bold',
            stroke: '#FFFFFF',
            strokeThickness: 3
        }).setOrigin(0.5);
        rewardTitle.setDepth(402);
        
        // Reward subtitle
        const rewardSubtitle = this.add.text(width / 2, height * 0.42, 'Sức Mạnh Của Quan Sát', {
            fontSize: '28px',
            fill: '#8B4513',
            fontFamily: 'Comic Sans MS, Arial',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        rewardSubtitle.setDepth(402);
        
        // Eye/Mirror symbol
        const symbol = this.add.graphics();
        symbol.fillStyle(0x4B0082, 1);
        symbol.fillCircle(width / 2, height * 0.52, 25);
        symbol.fillStyle(0x87CEEB, 1);
        symbol.fillCircle(width / 2, height * 0.52, 18);
        symbol.fillStyle(0x000000, 1);
        symbol.fillCircle(width / 2, height * 0.52, 10);
        symbol.fillStyle(0xFFFFFF, 1);
        symbol.fillCircle(width / 2 - 5, height * 0.52 - 5, 4);
        symbol.setDepth(402);
        
        // Stars decoration
        const starPositions = [
            { x: width * 0.25, y: height * 0.35 },
            { x: width * 0.75, y: height * 0.35 },
            { x: width * 0.3, y: height * 0.6 },
            { x: width * 0.7, y: height * 0.6 }
        ];
        starPositions.forEach(pos => {
            const star = this.add.text(pos.x, pos.y, '⭐', {
                fontSize: '24px'
            }).setOrigin(0.5).setDepth(402);
            
            this.tweens.add({
                targets: star,
                scale: 1.2,
                duration: 500,
                yoyo: true,
                repeat: -1
            });
        });
        
        // Continue button
        const continueBtn = this.add.graphics();
        continueBtn.fillStyle(0x8B4513, 1);
        continueBtn.fillRoundedRect(0, 0, 200, 55, 12);
        continueBtn.lineStyle(3, 0xFFD700, 1);
        continueBtn.strokeRoundedRect(0, 0, 200, 55, 12);
        continueBtn.generateTexture('continueBtn2', 200, 55);
        continueBtn.destroy();
        
        const btn = this.add.image(width / 2, height * 0.68, 'continueBtn2')
            .setInteractive({ useHandCursor: true })
            .setDepth(402);
        
        const btnText = this.add.text(width / 2, height * 0.68, 'Tiếp tục', {
            fontSize: '22px',
            fill: '#FFFFFF',
            fontFamily: 'Comic Sans MS, Arial',
            fontStyle: 'bold'
        }).setOrigin(0.5).setDepth(403);
        
        btn.on('pointerdown', () => {
            this.sound.stopAll();
            this.scene.stop('UIScreen');
            this.scene.start('MenuScreen');
        });
        
        btn.on('pointerover', () => btn.setScale(1.1));
        btn.on('pointerout', () => btn.setScale(1));
    }

    showNextLevelTransition() {
        this.scene.stop('UIScreen');
        this.scene.start('MenuScreen');
    }

    shutdown() {
        this.stopLevelBGM();
        if (typeof ScreenLevelBackground !== 'undefined') {
            ScreenLevelBackground.destroyVideo(this, 'levelBgVideo');
        }
        this.stopVoice();
        this.sound.stopAll();
        
        // Cleanup Wise Owl
        if (this.wiseOwl) {
            this.wiseOwl.destroy();
            this.wiseOwl = null;
        }
        
        // Cleanup ambient creatures
        this.fireflies.forEach(firefly => {
            const behaviorSystem = firefly.getData('behaviorSystem');
            if (behaviorSystem && typeof behaviorSystem.destroy === 'function') {
                behaviorSystem.destroy();
            }
        });
        
        this.magicParticles.forEach(particle => {
            const behaviorSystem = particle.getData('behaviorSystem');
            if (behaviorSystem && typeof behaviorSystem.destroy === 'function') {
                behaviorSystem.destroy();
            }
        });
        
        // Cleanup challenge view
        if (this.challengeContainer) {
            this.challengeContainer.destroy();
            this.challengeContainer = null;
        }
        
        // Reset arrays
        this.mirrors = [];
        this.puzzles = [];
        this.fireflies = [];
        this.magicParticles = [];
        this.mirrorsRestored = 0;
        this.dialogueIndex = 0;
    }
}

