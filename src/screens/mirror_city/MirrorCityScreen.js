/**
 * Level2Scene - Màn 2: Thành Phố Gương (Mirror City)
 * Gameplay: Spot the difference to restore 10 magical mirrors
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
        this.hintsRemaining = 3;
        this.isInChallengeView = false;
        this.challengeContainer = null;
    }

    preload() {
        // Load Mirror City assets
        this.load.image('mirror_city_bg', 'screens/mirror_city/assets/backgrounds/l2_bg_1.png');
        // Note: Mirror City currently has no audio (BGM and voice disabled)
    }

    create() {
        console.log('MirrorCityScreen: create() called');
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Ensure clean audio state (stop any sounds from previous scenes)
        this.sound.stopAll();
        
        // NOTE: Level 2 currently runs WITHOUT audio
        // BGM and voice will be added in future update

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

        // Use Mirror City background image if available
        if (this.textures.exists('mirror_city_bg')) {
            const bg = this.add.image(width / 2, height / 2, 'mirror_city_bg');
            bg.setDisplaySize(width, height);
            bg.setDepth(0);
            console.log('Mirror City background image displayed');
        } else {
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

        // Position mirrors in 2 rows (5 + 5 arrangement)
        const mirrorWidth = 65;
        const mirrorHeight = 85;
        const spacingX = 75;
        const spacingY = 100;
        const startY = height * 0.35;

        // Calculate positions for semi-circular arrangement
        for (let i = 0; i < this.totalMirrors; i++) {
            const row = Math.floor(i / 5);
            const col = i % 5;
            const x = width * 0.18 + col * spacingX;
            const y = startY + row * spacingY;
            
            const mirror = this.createMirror(x, y, mirrorWidth, mirrorHeight, i);
            this.mirrors.push(mirror);
        }
    }

    createMirror(x, y, width, height, index) {
        const mirror = {
            x: x,
            y: y,
            width: width,
            height: height,
            index: index,
            isRestored: false,
            container: null,
            graphics: null,
            glowEffect: null,
            numberText: null
        };

        // Create container
        const container = this.add.container(x, y);
        mirror.container = container;

        // Create darkened mirror (covered in shadow)
        const mirrorGraphics = this.add.graphics();
        
        // Outer ornate frame
        mirrorGraphics.fillStyle(0x8B4513, 1);
        mirrorGraphics.fillRoundedRect(-width/2 - 8, -height/2 - 8, width + 16, height + 16, 8);
        
        // Golden inner frame
        mirrorGraphics.fillStyle(0xDAA520, 1);
        mirrorGraphics.fillRoundedRect(-width/2 - 4, -height/2 - 4, width + 8, height + 8, 6);
        
        // Mirror surface (darkened)
        mirrorGraphics.fillGradientStyle(0x2d1b4e, 0x2d1b4e, 0x1a0a2e, 0x1a0a2e, 0.9);
        mirrorGraphics.fillRoundedRect(-width/2, -height/2, width, height, 4);
        
        // Dark fog overlay
        mirrorGraphics.fillStyle(0x000000, 0.6);
        mirrorGraphics.fillRoundedRect(-width/2, -height/2, width, height, 4);
        
        // Magical energy pulse (indicates it's interactive)
        mirrorGraphics.lineStyle(2, 0x9370DB, 0.5);
        mirrorGraphics.strokeRoundedRect(-width/2, -height/2, width, height, 4);
        
        container.add(mirrorGraphics);
        mirror.graphics = mirrorGraphics;

        // Mirror number
        const numberText = this.add.text(0, height/2 + 15, (index + 1).toString(), {
            fontSize: '16px',
            fill: '#FFD700',
            fontFamily: 'Comic Sans MS, Arial',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);
        container.add(numberText);
        mirror.numberText = numberText;

        // Pulsing glow effect
        const glowEffect = this.add.graphics();
        glowEffect.fillStyle(0x9370DB, 0.2);
        glowEffect.fillRoundedRect(-width/2 - 10, -height/2 - 10, width + 20, height + 20, 10);
        container.add(glowEffect);
        container.sendToBack(glowEffect);
        mirror.glowEffect = glowEffect;

        this.tweens.add({
            targets: glowEffect,
            alpha: 0.4,
            scaleX: 1.05,
            scaleY: 1.05,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Make interactive
        const hitArea = new Phaser.Geom.Rectangle(-width/2 - 8, -height/2 - 8, width + 16, height + 16);
        container.setSize(width + 16, height + 16);
        container.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains, { useHandCursor: true });
        
        container.on('pointerdown', () => {
            if (!mirror.isRestored && !this.isInChallengeView) {
                this.selectMirror(index);
            }
        });

        container.on('pointerover', () => {
            if (!mirror.isRestored && !this.isInChallengeView) {
                container.setScale(1.1);
            }
        });

        container.on('pointerout', () => {
            if (!mirror.isRestored) {
                container.setScale(1);
            }
        });

        container.setDepth(50);

        return mirror;
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

        // Challenge background
        const challengeBg = this.add.graphics();
        challengeBg.fillStyle(0x1a0a2e, 0.95);
        challengeBg.fillRect(0, 0, width, height);
        this.challengeContainer.add(challengeBg);

        // Title
        const puzzle = this.currentPuzzle;
        const titleText = this.add.text(width / 2, 55, `Gương ${this.currentMirrorIndex + 1}: ${this.getCategoryName(puzzle.category)}`, {
            fontSize: '22px',
            fill: '#FFD700',
            fontFamily: 'Comic Sans MS, Arial',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);
        this.challengeContainer.add(titleText);

        // Create two image panels (original and reflection)
        this.createImagePanels(width, height);

        // Instruction text
        const instructionText = this.add.text(width / 2, height - 70, 'Tìm điểm khác biệt giữa hai hình!', {
            fontSize: '18px',
            fill: '#FFFFFF',
            fontFamily: 'Comic Sans MS, Arial',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);
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

    createImagePanels(width, height) {
        const puzzle = this.currentPuzzle;
        const panelWidth = width * 0.38;
        const panelHeight = height * 0.55;
        const panelY = height * 0.42;
        const gap = 20;

        // Left panel (Original)
        const leftX = width * 0.28;
        this.createImagePanel(leftX, panelY, panelWidth, panelHeight, 'Gốc', true);

        // Right panel (Reflection)
        const rightX = width * 0.72;
        this.createImagePanel(rightX, panelY, panelWidth, panelHeight, 'Phản Chiếu', false);
    }

    createImagePanel(x, y, width, height, label, isOriginal) {
        const puzzle = this.currentPuzzle;
        
        // Mirror frame
        const frame = this.add.graphics();
        
        // Ornate outer frame
        frame.fillGradientStyle(0x8B4513, 0x8B4513, 0xA0522D, 0xA0522D, 1);
        frame.fillRoundedRect(x - width/2 - 12, y - height/2 - 12, width + 24, height + 24, 15);
        
        // Golden border
        frame.lineStyle(4, 0xFFD700, 1);
        frame.strokeRoundedRect(x - width/2 - 8, y - height/2 - 8, width + 16, height + 16, 12);
        
        // Inner decorative border
        frame.lineStyle(2, 0xDAA520, 0.8);
        frame.strokeRoundedRect(x - width/2 - 4, y - height/2 - 4, width + 8, height + 8, 10);
        
        this.challengeContainer.add(frame);

        // Image area background (scene representation)
        const imageArea = this.add.graphics();
        imageArea.fillGradientStyle(0x87CEEB, 0x87CEEB, 0x90EE90, 0x90EE90, 1);
        imageArea.fillRoundedRect(x - width/2, y - height/2, width, height, 8);
        this.challengeContainer.add(imageArea);

        // Generate scene representation
        this.generateSceneGraphics(x, y, width, height, puzzle, isOriginal);

        // Label
        const labelText = this.add.text(x, y + height/2 + 25, label, {
            fontSize: '14px',
            fill: '#FFD700',
            fontFamily: 'Comic Sans MS, Arial',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);
        this.challengeContainer.add(labelText);
    }

    generateSceneGraphics(x, y, panelWidth, panelHeight, puzzle, isOriginal) {
        // Create a procedurally generated scene based on puzzle data
        const sceneContainer = this.add.container(x, y);
        this.challengeContainer.add(sceneContainer);

        // Base scene elements based on category
        this.drawBaseScene(sceneContainer, panelWidth, panelHeight, puzzle.category);

        // Draw main element based on puzzle
        this.drawMainElement(sceneContainer, panelWidth, panelHeight, puzzle, isOriginal);

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

    drawBaseScene(container, width, height, category) {
        const baseScene = this.add.graphics();
        
        // Draw different backgrounds based on category
        switch (category) {
            case 'animals':
            case 'nature':
                // Forest/garden scene
                baseScene.fillStyle(0x228B22, 1);
                baseScene.fillRect(-width/2, height * 0.2, width, height * 0.3);
                // Flowers
                for (let i = 0; i < 5; i++) {
                    const fx = Phaser.Math.Between(-width/2 + 20, width/2 - 20);
                    const fy = height * 0.3 + Phaser.Math.Between(-10, 10);
                    baseScene.fillStyle([0xFF69B4, 0xFFD700, 0xFF6347, 0x9370DB][i % 4], 1);
                    baseScene.fillCircle(fx, fy, 8);
                    baseScene.fillStyle(0xFFD700, 1);
                    baseScene.fillCircle(fx, fy, 3);
                }
                break;
            case 'objects':
            case 'food':
                // Indoor scene
                baseScene.fillStyle(0xDEB887, 1);
                baseScene.fillRect(-width/2, height * 0.15, width, height * 0.35);
                baseScene.fillStyle(0x8B4513, 1);
                baseScene.fillRect(-width/2, height * 0.35, width, 10);
                break;
            case 'vehicles':
                // Road/sky scene
                baseScene.fillStyle(0x808080, 1);
                baseScene.fillRect(-width/2, height * 0.2, width, height * 0.3);
                baseScene.lineStyle(3, 0xFFFFFF, 1);
                for (let i = 0; i < 5; i++) {
                    baseScene.fillRect(-width/2 + i * (width/4), height * 0.33, width/6, 5);
                }
                break;
            case 'fantasy':
                // Magical scene
                baseScene.fillGradientStyle(0x4B0082, 0x4B0082, 0x9370DB, 0x9370DB, 0.8);
                baseScene.fillRect(-width/2, height * 0.1, width, height * 0.4);
                // Stars
                for (let i = 0; i < 8; i++) {
                    const sx = Phaser.Math.Between(-width/2 + 10, width/2 - 10);
                    const sy = Phaser.Math.Between(-height/2 + 10, 0);
                    baseScene.fillStyle(0xFFD700, 0.8);
                    baseScene.fillCircle(sx, sy, 3);
                }
                break;
            case 'seasonal':
                // Festive scene
                baseScene.fillStyle(0xF5F5DC, 1);
                baseScene.fillRect(-width/2, height * 0.2, width, height * 0.3);
                break;
        }
        
        container.add(baseScene);
    }

    drawMainElement(container, width, height, puzzle, isOriginal) {
        const diff = puzzle.difference;
        const mainGraphics = this.add.graphics();
        
        // Position based on difference location
        const elemX = (diff.location.x - 0.5) * width;
        const elemY = (diff.location.y - 0.5) * height;

        // Draw element based on type and apply difference
        const showDifference = !isOriginal;
        
        switch (diff.type) {
            case 'count':
                this.drawCountElement(mainGraphics, elemX, elemY, puzzle, showDifference);
                break;
            case 'color':
                this.drawColorElement(mainGraphics, elemX, elemY, puzzle, showDifference);
                break;
            case 'presence':
                this.drawPresenceElement(mainGraphics, elemX, elemY, puzzle, showDifference);
                break;
            case 'size':
                this.drawSizeElement(mainGraphics, elemX, elemY, puzzle, showDifference);
                break;
            case 'direction':
                this.drawDirectionElement(mainGraphics, elemX, elemY, puzzle, showDifference);
                break;
            case 'shape':
                this.drawShapeElement(mainGraphics, elemX, elemY, puzzle, showDifference);
                break;
            case 'pattern':
                this.drawPatternElement(mainGraphics, elemX, elemY, puzzle, showDifference);
                break;
            case 'position':
                this.drawPositionElement(mainGraphics, elemX, elemY, puzzle, showDifference);
                break;
            default:
                this.drawGenericElement(mainGraphics, elemX, elemY, puzzle, showDifference);
        }

        container.add(mainGraphics);
    }

    drawCountElement(graphics, x, y, puzzle, showDifference) {
        // Parse count from original/reflection
        const originalMatch = puzzle.difference.original.match(/(\d+)/);
        const reflectionMatch = puzzle.difference.reflection.match(/(\d+)/);
        const originalCount = originalMatch ? parseInt(originalMatch[1]) : 3;
        const reflectionCount = reflectionMatch ? parseInt(reflectionMatch[1]) : 2;
        const count = showDifference ? reflectionCount : originalCount;
        
        // Draw elements based on element type
        const element = puzzle.difference.element.toLowerCase();
        const colors = [0xFF69B4, 0xFFD700, 0x87CEEB, 0x90EE90, 0xFF6347, 0x9370DB, 0x00CED1, 0xFFA500];
        
        for (let i = 0; i < count; i++) {
            const offsetX = (i - count/2) * 20 + Phaser.Math.Between(-5, 5);
            const offsetY = Phaser.Math.Between(-15, 15);
            const color = colors[i % colors.length];
            
            if (element.includes('butterfl') || element.includes('bee')) {
                // Draw butterfly/bee
                graphics.fillStyle(color, 1);
                graphics.fillEllipse(x + offsetX - 8, y + offsetY, 10, 6);
                graphics.fillEllipse(x + offsetX + 8, y + offsetY, 10, 6);
                graphics.fillStyle(0x000000, 1);
                graphics.fillCircle(x + offsetX, y + offsetY, 4);
            } else if (element.includes('star')) {
                this.drawStar(graphics, x + offsetX, y + offsetY, 8, 5, color);
            } else if (element.includes('heart')) {
                this.drawHeart(graphics, x + offsetX, y + offsetY, 10, color);
            } else {
                // Generic circle for other elements
                graphics.fillStyle(color, 1);
                graphics.fillCircle(x + offsetX, y + offsetY, 10);
                graphics.fillStyle(0xFFFFFF, 0.5);
                graphics.fillCircle(x + offsetX - 3, y + offsetY - 3, 3);
            }
        }
    }

    drawColorElement(graphics, x, y, puzzle, showDifference) {
        const colorMap = {
            'red': 0xFF0000, 'blue': 0x0000FF, 'green': 0x00FF00, 'yellow': 0xFFFF00,
            'pink': 0xFF69B4, 'purple': 0x9370DB, 'orange': 0xFFA500, 'brown': 0x8B4513,
            'white': 0xFFFFFF, 'black': 0x000000, 'gold': 0xFFD700, 'silver': 0xC0C0C0,
            'teal': 0x008080, 'chocolate': 0xD2691E, 'strawberry': 0xFF1493
        };
        
        let color = 0xFF69B4;
        const colorText = showDifference ? puzzle.difference.reflection.toLowerCase() : puzzle.difference.original.toLowerCase();
        
        for (const [name, hex] of Object.entries(colorMap)) {
            if (colorText.includes(name)) {
                color = hex;
                break;
            }
        }

        // Draw main element
        graphics.fillStyle(color, 1);
        graphics.fillRoundedRect(x - 25, y - 25, 50, 50, 10);
        graphics.lineStyle(3, 0x000000, 0.5);
        graphics.strokeRoundedRect(x - 25, y - 25, 50, 50, 10);
        
        // Highlight
        graphics.fillStyle(0xFFFFFF, 0.3);
        graphics.fillRoundedRect(x - 20, y - 20, 20, 15, 5);
    }

    drawPresenceElement(graphics, x, y, puzzle, showDifference) {
        const hasElement = puzzle.difference.original.toLowerCase().includes('with');
        const shouldDraw = hasElement !== showDifference;
        
        if (shouldDraw) {
            // Draw the element that may or may not be present
            const element = puzzle.difference.element.toLowerCase();
            
            if (element.includes('moon')) {
                graphics.fillStyle(0xFFFACD, 1);
                graphics.fillCircle(x, y, 20);
                graphics.fillStyle(0x87CEEB, 1);
                graphics.fillCircle(x + 8, y, 18);
            } else if (element.includes('hat') || element.includes('crown')) {
                graphics.fillStyle(0xFFD700, 1);
                graphics.fillTriangle(x - 15, y + 10, x + 15, y + 10, x, y - 20);
                graphics.fillStyle(0xFF0000, 1);
                graphics.fillCircle(x, y - 15, 5);
            } else if (element.includes('collar') || element.includes('ribbon')) {
                graphics.fillStyle(0xFF0000, 1);
                graphics.fillRoundedRect(x - 20, y - 5, 40, 10, 3);
                graphics.fillCircle(x, y, 8);
            } else {
                // Generic object
                graphics.fillStyle(0xFFD700, 1);
                graphics.fillRoundedRect(x - 15, y - 15, 30, 30, 5);
            }
        }
    }

    drawSizeElement(graphics, x, y, puzzle, showDifference) {
        const isSmall = showDifference ? 
            puzzle.difference.reflection.toLowerCase().includes('small') :
            puzzle.difference.original.toLowerCase().includes('small');
        
        const size = isSmall ? 15 : 30;
        
        graphics.fillStyle(0x90EE90, 1);
        graphics.fillCircle(x, y, size);
        graphics.fillStyle(0x228B22, 1);
        graphics.fillCircle(x - size * 0.2, y - size * 0.2, size * 0.3);
    }

    drawDirectionElement(graphics, x, y, puzzle, showDifference) {
        const facingRight = showDifference ?
            puzzle.difference.reflection.toLowerCase().includes('right') :
            puzzle.difference.original.toLowerCase().includes('right');
        
        const direction = facingRight ? 1 : -1;
        
        // Draw animal/object facing direction
        graphics.fillStyle(0xFFA500, 1);
        graphics.fillCircle(x, y, 20);
        
        // Eye
        graphics.fillStyle(0x000000, 1);
        graphics.fillCircle(x + direction * 8, y - 5, 4);
        
        // Nose/beak pointing direction
        graphics.fillStyle(0xFF6347, 1);
        graphics.fillTriangle(x + direction * 20, y, x + direction * 10, y - 5, x + direction * 10, y + 5);
    }

    drawShapeElement(graphics, x, y, puzzle, showDifference) {
        const shapeText = showDifference ? puzzle.difference.reflection : puzzle.difference.original;
        
        graphics.fillStyle(0x9370DB, 1);
        
        if (shapeText.toLowerCase().includes('circle') || shapeText.toLowerCase().includes('round')) {
            graphics.fillCircle(x, y, 25);
        } else if (shapeText.toLowerCase().includes('square') || shapeText.toLowerCase().includes('rectangle')) {
            graphics.fillRect(x - 20, y - 20, 40, 40);
        } else if (shapeText.toLowerCase().includes('triangle')) {
            graphics.fillTriangle(x, y - 25, x - 25, y + 20, x + 25, y + 20);
        } else if (shapeText.toLowerCase().includes('star')) {
            this.drawStar(graphics, x, y, 25, 5, 0xFFD700);
        } else if (shapeText.toLowerCase().includes('heart')) {
            this.drawHeart(graphics, x, y, 30, 0xFF69B4);
        } else if (shapeText.toLowerCase().includes('diamond')) {
            graphics.fillTriangle(x, y - 25, x - 20, y, x + 20, y);
            graphics.fillTriangle(x, y + 25, x - 20, y, x + 20, y);
        } else if (shapeText.toLowerCase().includes('crescent')) {
            graphics.fillCircle(x, y, 25);
            graphics.fillStyle(0x87CEEB, 1);
            graphics.fillCircle(x + 10, y, 22);
        } else if (shapeText.toLowerCase().includes('oval')) {
            graphics.fillEllipse(x, y, 35, 25);
        } else {
            graphics.fillCircle(x, y, 25);
        }
    }

    drawPatternElement(graphics, x, y, puzzle, showDifference) {
        const patternText = showDifference ? puzzle.difference.reflection : puzzle.difference.original;
        
        // Draw base shape
        graphics.fillStyle(0xFFFFFF, 1);
        graphics.fillRoundedRect(x - 30, y - 30, 60, 60, 8);
        
        // Draw pattern
        if (patternText.toLowerCase().includes('stripe') || patternText.toLowerCase().includes('striped')) {
            graphics.fillStyle(0xFF0000, 1);
            for (let i = 0; i < 5; i++) {
                graphics.fillRect(x - 30 + i * 15, y - 30, 7, 60);
            }
        } else if (patternText.toLowerCase().includes('polka') || patternText.toLowerCase().includes('dot')) {
            graphics.fillStyle(0x0000FF, 1);
            for (let i = 0; i < 9; i++) {
                const px = x - 20 + (i % 3) * 20;
                const py = y - 20 + Math.floor(i / 3) * 20;
                graphics.fillCircle(px, py, 5);
            }
        } else if (patternText.toLowerCase().includes('checker')) {
            graphics.fillStyle(0x000000, 1);
            for (let i = 0; i < 4; i++) {
                for (let j = 0; j < 4; j++) {
                    if ((i + j) % 2 === 0) {
                        graphics.fillRect(x - 30 + i * 15, y - 30 + j * 15, 15, 15);
                    }
                }
            }
        } else {
            // Default pattern
            graphics.fillStyle(0x90EE90, 1);
            graphics.fillCircle(x, y, 20);
        }
    }

    drawPositionElement(graphics, x, y, puzzle, showDifference) {
        // This is typically for clock hands or similar position-based differences
        const posText = showDifference ? puzzle.difference.reflection : puzzle.difference.original;
        
        // Draw clock
        graphics.fillStyle(0xFFFFFF, 1);
        graphics.fillCircle(x, y, 30);
        graphics.lineStyle(3, 0x000000, 1);
        graphics.strokeCircle(x, y, 30);
        
        // Draw hour markers
        for (let i = 0; i < 12; i++) {
            const angle = (i * 30 - 90) * Math.PI / 180;
            const innerR = 25;
            const outerR = 28;
            graphics.lineStyle(2, 0x000000, 1);
            graphics.beginPath();
            graphics.moveTo(x + Math.cos(angle) * innerR, y + Math.sin(angle) * innerR);
            graphics.lineTo(x + Math.cos(angle) * outerR, y + Math.sin(angle) * outerR);
            graphics.strokePath();
        }
        
        // Parse time
        let hours = 3;
        if (posText.includes('6')) hours = 6;
        else if (posText.includes('9')) hours = 9;
        else if (posText.includes('12')) hours = 12;
        
        // Draw hands
        const hourAngle = (hours * 30 - 90) * Math.PI / 180;
        graphics.lineStyle(4, 0x000000, 1);
        graphics.beginPath();
        graphics.moveTo(x, y);
        graphics.lineTo(x + Math.cos(hourAngle) * 15, y + Math.sin(hourAngle) * 15);
        graphics.strokePath();
        
        // Minute hand always at 12
        graphics.lineStyle(2, 0x000000, 1);
        graphics.beginPath();
        graphics.moveTo(x, y);
        graphics.lineTo(x, y - 22);
        graphics.strokePath();
    }

    drawGenericElement(graphics, x, y, puzzle, showDifference) {
        // Fallback generic element
        graphics.fillStyle(0x90EE90, 1);
        graphics.fillCircle(x, y, 25);
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
        graphics.beginPath();
        graphics.moveTo(x, y + size * 0.3);
        graphics.bezierCurveTo(x - size * 0.5, y - size * 0.3, x - size, y + size * 0.1, x, y + size * 0.5);
        graphics.bezierCurveTo(x + size, y + size * 0.1, x + size * 0.5, y - size * 0.3, x, y + size * 0.3);
        graphics.closePath();
        graphics.fillPath();
    }

    createHintButton(width, height) {
        const hintBtn = this.add.container(width - 80, height - 50);
        
        const hintBg = this.add.graphics();
        hintBg.fillStyle(0x4CAF50, 1);
        hintBg.fillRoundedRect(-40, -20, 80, 40, 10);
        hintBg.lineStyle(2, 0xFFD700, 1);
        hintBg.strokeRoundedRect(-40, -20, 80, 40, 10);
        hintBtn.add(hintBg);

        const hintText = this.add.text(0, 0, `💡 ${this.hintsRemaining}`, {
            fontSize: '18px',
            fill: '#FFFFFF',
            fontFamily: 'Comic Sans MS, Arial',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        hintBtn.add(hintText);
        this.hintButtonText = hintText;

        hintBtn.setSize(80, 40);
        hintBtn.setInteractive({ useHandCursor: true });
        
        hintBtn.on('pointerdown', () => {
            if (this.hintsRemaining > 0) {
                this.useHint();
            }
        });

        hintBtn.on('pointerover', () => hintBtn.setScale(1.1));
        hintBtn.on('pointerout', () => hintBtn.setScale(1));

        this.challengeContainer.add(hintBtn);
    }

    createBackButton(width, height) {
        const backBtn = this.add.container(80, height - 50);
        
        const backBg = this.add.graphics();
        backBg.fillStyle(0xE91E63, 1);
        backBg.fillRoundedRect(-40, -20, 80, 40, 10);
        backBg.lineStyle(2, 0xFFD700, 1);
        backBg.strokeRoundedRect(-40, -20, 80, 40, 10);
        backBtn.add(backBg);

        const backText = this.add.text(0, 0, '← Quay lại', {
            fontSize: '14px',
            fill: '#FFFFFF',
            fontFamily: 'Comic Sans MS, Arial',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        backBtn.add(backText);

        backBtn.setSize(80, 40);
        backBtn.setInteractive({ useHandCursor: true });
        
        backBtn.on('pointerdown', () => {
            this.hideChallengeView();
        });

        backBtn.on('pointerover', () => backBtn.setScale(1.1));
        backBtn.on('pointerout', () => backBtn.setScale(1));

        this.challengeContainer.add(backBtn);
    }

    useHint() {
        if (this.hintsRemaining <= 0) return;
        
        this.hintsRemaining--;
        if (this.hintButtonText) {
            this.hintButtonText.setText(`💡 ${this.hintsRemaining}`);
        }

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
        
        // Play correct answer effects
        this.createMagicalSparkles(this.cameras.main.width / 2, this.cameras.main.height / 2);
        
        // Show Wise Owl celebration (no voice - text only)
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
            this.wiseOwl.showDialogue(message, 3000);
            // Voice disabled for Level 2
        }

        // Restore the mirror
        this.time.delayedCall(1500, () => {
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

        // Wise Owl encouragement (no voice - text only)
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
            // Voice disabled for Level 2
            
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

        // Create restored mirror (bright, shiny)
        const restoredGraphics = this.add.graphics();
        
        // Ornate outer frame (golden)
        restoredGraphics.fillStyle(0xFFD700, 1);
        restoredGraphics.fillRoundedRect(-width/2 - 8, -height/2 - 8, width + 16, height + 16, 8);
        
        // Inner frame
        restoredGraphics.fillGradientStyle(0xDAA520, 0xDAA520, 0xFFD700, 0xFFD700, 1);
        restoredGraphics.fillRoundedRect(-width/2 - 4, -height/2 - 4, width + 8, height + 8, 6);
        
        // Mirror surface (bright, reflective)
        restoredGraphics.fillGradientStyle(0xE0FFFF, 0xE0FFFF, 0x87CEEB, 0x87CEEB, 1);
        restoredGraphics.fillRoundedRect(-width/2, -height/2, width, height, 4);
        
        // Shimmer effect
        restoredGraphics.fillStyle(0xFFFFFF, 0.4);
        restoredGraphics.fillRoundedRect(-width/2 + 5, -height/2 + 5, width * 0.4, height * 0.3, 3);
        
        // Magical sparkle border
        restoredGraphics.lineStyle(3, 0xFFD700, 1);
        restoredGraphics.strokeRoundedRect(-width/2, -height/2, width, height, 4);
        
        container.add(restoredGraphics);
        mirror.graphics = restoredGraphics;

        // Update glow effect to bright
        if (mirror.glowEffect) {
            mirror.glowEffect.clear();
            mirror.glowEffect.fillStyle(0xFFD700, 0.4);
            mirror.glowEffect.fillRoundedRect(-width/2 - 15, -height/2 - 15, width + 30, height + 30, 12);
        }

        // Star indicator
        const star = this.add.text(width/2 - 5, -height/2 + 5, '⭐', {
            fontSize: '16px'
        }).setOrigin(0.5);
        container.add(star);

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
        // Level 2 dialogues - NO VOICE (text only)
        const dialogues = [
            {
                text: "Chào mừng đến Thành Phố Gương! Nơi này từng sáng rực như ngàn vì sao.",
                duration: 4000
            },
            {
                text: "10 tấm gương thiêng đã bị làm mờ bởi phép thuật đen tối.",
                duration: 3500
            },
            {
                text: "Hãy dùng đôi mắt tinh tường để tìm điểm khác biệt và giải cứu ánh sáng!",
                duration: 4500
            }
        ];
        
        this.showDialogueSequence(dialogues, () => {
            // Ready to play
            console.log('Introduction complete, ready to play');
        });
    }

    showDialogueSequenceWithVoice(dialogues, onComplete) {
        if (this.dialogueIndex >= dialogues.length) {
            this.dialogueIndex = 0;
            if (onComplete) onComplete();
            return;
        }
        
        const dialogue = dialogues[this.dialogueIndex];
        
        if (this.wiseOwl) {
            this.wiseOwl.showDialogue(dialogue.text, dialogue.duration);
        }
        
        // Voice disabled for Level 2
        // this.playVoice(dialogue.voiceKey);
        
        this.dialogueIndex++;
        this.time.delayedCall(dialogue.duration + 500, () => {
            this.showDialogueSequenceWithVoice(dialogues, onComplete);
        });
    }

    /**
     * Show dialogue sequence WITHOUT voice (text only)
     */
    showDialogueSequence(dialogues, onComplete) {
        if (this.dialogueIndex >= dialogues.length) {
            this.dialogueIndex = 0;
            if (onComplete) onComplete();
            return;
        }
        
        const dialogue = dialogues[this.dialogueIndex];
        
        if (this.wiseOwl) {
            this.wiseOwl.showDialogue(dialogue.text, dialogue.duration);
        }
        
        // No voice - text only
        
        this.dialogueIndex++;
        this.time.delayedCall(dialogue.duration + 500, () => {
            this.showDialogueSequence(dialogues, onComplete);
        });
    }

    // ==========================================
    // AUDIO METHODS - DISABLED FOR LEVEL 2
    // Will be implemented in future update
    // ==========================================
    
    playLevelBGM() {
        // BGM disabled for Level 2 - will be added later
        console.log('Level 2: BGM disabled');
    }

    stopLevelBGM() {
        // BGM disabled for Level 2
    }

    playVoice(voiceKey) {
        // Voice disabled for Level 2
        return null;
    }

    playVoiceWithFallback(primaryKey, fallbackKey) {
        // Voice disabled for Level 2
        return null;
    }

    stopVoice() {
        // Voice disabled for Level 2
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

        // Wise Owl final celebration (no voice - text only)
        if (this.wiseOwl) {
            this.wiseOwl.celebrate();
            this.wiseOwl.showDialogue("Phi thường! Tất cả 10 tấm gương đã sáng rực rỡ! Thành Phố Gương đã được giải cứu!", 6000);
            // Voice disabled for Level 2
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
            // Return to menu (no sounds to stop in Level 2)
            this.scene.stop('UIScreen');
            this.scene.start('MenuScreen');
        });
        
        btn.on('pointerover', () => btn.setScale(1.1));
        btn.on('pointerout', () => btn.setScale(1));
    }

    // This method is not used since levels are independent
    // Kept for potential future use
    showNextLevelTransition(nextLevelKey) {
        // Levels are independent - this shouldn't be called
        // Just return to menu instead
        this.scene.stop('UIScene');
        this.scene.start('MenuScene');
    }

    shutdown() {
        // Stop all sounds (ensures clean state when leaving scene)
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

