/**
 * Level1Scene - Màn 1: Khu Rừng Đếm Số (Counting Forest)
 * Gameplay: Solve addition problems to rebuild broken bridge (10 planks)
 */
class Level1Scene extends Phaser.Scene {
    constructor() {
        super({ key: 'Level1Scene' });
        this.planksRestored = 0;
        this.totalPlanks = 10;
        this.currentQuestion = null;
        this.draggedCard = null;
        this.checkingAnswer = false;
        this.wiseOwl = null;
        this.bridgePlanks = [];
        this.answerCards = [];
        this.butterflies = [];
        this.fireflies = [];
        this.magicParticles = [];
        this.dialogueIndex = 0;
    }

    create() {
        console.log('Level1Scene: create() called');
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Create magical forest background
        this.createForestBackground();

        // Create ambient creatures
        this.createAmbientCreatures();

        // Create broken bridge with 10 planks
        this.createBridge();

        // Create Wise Owl (Cú Thông Thái)
        this.createWiseOwl();

        // UI Scene overlay
        this.scene.launch('UIScene');

        // Show introduction dialogue
        this.time.delayedCall(500, () => {
            this.showIntroductionDialogue();
        });

        console.log('Level1Scene: Initialized successfully');
    }

    createForestBackground() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Use Level 1 background image if available
        if (this.textures.exists('level1_bg')) {
            const bg = this.add.image(width / 2, height / 2, 'level1_bg');
            bg.setDisplaySize(width, height);
            bg.setDepth(0);
            console.log('Level 1 background image displayed');
        } else {
            // Fallback: Create programmatic background if image not loaded
            console.warn('Level 1 background image not found, using fallback graphics');
            
            // Sky gradient (soft sunlight)
            const sky = this.add.graphics();
            sky.fillGradientStyle(0x87CEEB, 0x87CEEB, 0xFFE4B5, 0xFFE4B5, 1);
            sky.fillRect(0, 0, width, height * 0.65);
            sky.setDepth(0);

            // Ground (forest floor with moss)
            const ground = this.add.graphics();
            ground.fillStyle(0x228B22, 1);
            ground.fillRect(0, height * 0.65, width, height * 0.35);
            ground.setDepth(0);

            // Mossy rocks (decorative)
            for (let i = 0; i < 3; i++) {
                const rockX = (width / 4) * (i + 1);
                const rockY = height * 0.7;
                const rock = this.add.graphics();
                rock.fillStyle(0x696969, 1);
                rock.fillCircle(rockX, rockY, 25);
                rock.fillStyle(0x90EE90, 0.6);
                rock.fillCircle(rockX - 5, rockY - 5, 15);
                rock.setDepth(1);
            }

            // Colorful flowers
            const flowerColors = [0xFF69B4, 0xFFD700, 0xFF8C00, 0x9370DB];
            for (let i = 0; i < 8; i++) {
                const flowerX = Phaser.Math.Between(50, width - 50);
                const flowerY = height * 0.7 + Phaser.Math.Between(-10, 10);
                const flower = this.add.graphics();
                const color = flowerColors[Phaser.Math.Between(0, flowerColors.length - 1)];
                
                // Petals
                for (let j = 0; j < 5; j++) {
                    const angle = (j * 72) * Math.PI / 180;
                    const petalX = flowerX + Math.cos(angle) * 8;
                    const petalY = flowerY + Math.sin(angle) * 8;
                    flower.fillStyle(color, 1);
                    flower.fillCircle(petalX, petalY, 5);
                }
                // Center
                flower.fillStyle(0xFFD700, 1);
                flower.fillCircle(flowerX, flowerY, 4);
                flower.setDepth(1);
            }

            // Trees (dense green)
            for (let i = 0; i < 6; i++) {
                const treeX = (width / 7) * (i + 1);
                const treeY = height * 0.6;
                const tree = this.add.graphics();
                
                // Trunk
                tree.fillStyle(0x8B4513, 1);
                tree.fillRect(treeX - 8, treeY, 16, 40);
                
                // Foliage (layers)
                tree.fillStyle(0x228B22, 1);
                tree.fillCircle(treeX, treeY - 10, 35);
                tree.fillStyle(0x32CD32, 0.8);
                tree.fillCircle(treeX - 10, treeY - 15, 25);
                tree.fillCircle(treeX + 10, treeY - 15, 25);
                tree.setDepth(1);
            }

            // Mist effect removed as requested
        }
    }

    createBridge() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        const bridgeX = width * 0.15;
        const bridgeY = height * 0.68;
        const bridgeWidth = width * 0.7;
        const plankWidth = (bridgeWidth / this.totalPlanks) * 0.9; // 90% width for spacing
        const plankSpacing = (bridgeWidth / this.totalPlanks) * 0.1; // 10% spacing
        const plankHeight = 28;
        
        // Stream removed as requested - no blue water area under bridge
        // Bridge supports removed as requested - no blue rectangular bars at bridge ends
        
        // Create 10 individual planks (all broken initially, clearly separated)
        this.bridgePlanks = [];
        for (let i = 0; i < this.totalPlanks; i++) {
            const plankX = bridgeX + i * (plankWidth + plankSpacing) + plankSpacing / 2;
            const plank = this.createPlank(plankX, bridgeY, plankWidth, plankHeight, i);
            this.bridgePlanks.push(plank);
        }
    }

    createPlank(x, y, width, height, index) {
        const plank = {
            x: x,
            y: y,
            width: width,
            height: height,
            index: index,
            isRestored: false,
            graphics: null,
            glowEffect: null,
            dropZone: null,
            container: null,
            answerText: null,
            answerValue: null,
            bunnies: [] // Store bunnies on this plank
        };
        
        // Create container for floating effect
        const container = this.add.container(x + width / 2, y + height / 2);
        plank.container = container;
        
        // Create broken plank visual (cracked, dark, dimmed, with X mark)
        const brokenPlank = this.add.graphics();
        
        // Outer glow (very subtle, indicating it's interactive)
        brokenPlank.fillStyle(0x9370DB, 0.1);
        brokenPlank.fillRoundedRect(-width/2 - 2, -height/2 - 2, width + 4, height + 4, 5);
        
        // Main broken plank (dark, cracked, but more visible/bold)
        brokenPlank.fillStyle(0x654321, 0.85); // Much more visible/bold
        brokenPlank.fillRoundedRect(-width/2, -height/2, width, height, 4);
        
        // Border (dark, broken appearance, but more visible)
        brokenPlank.lineStyle(3, 0x4A4A4A, 0.9);
        brokenPlank.strokeRoundedRect(-width/2, -height/2, width, height, 4);
        
        // Crack lines (multiple for broken effect, more visible)
        brokenPlank.lineStyle(2, 0x2A2A2A, 0.9);
        brokenPlank.beginPath();
        brokenPlank.moveTo(-width * 0.3, -height/2);
        brokenPlank.lineTo(width * 0.2, height/2);
        brokenPlank.moveTo(width * 0.3, -height/2);
        brokenPlank.lineTo(-width * 0.2, height/2);
        brokenPlank.strokePath();
        
        // X mark removed as requested
        
        container.add(brokenPlank);
        brokenPlank.setDepth(10);
        brokenPlank.setAlpha(0.9); // Much more visible - bold for easier interaction
        plank.graphics = brokenPlank;
        
        // Gentle floating animation for broken planks
        this.tweens.add({
            targets: container,
            y: container.y - 2,
            duration: 2000 + index * 100,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
            delay: index * 50
        });
        
        // Create drop zone (slightly larger for easier interaction)
        const dropZone = this.add.zone(x + width / 2, y + height / 2, width * 1.2, height * 1.5);
        dropZone.setData('plankIndex', index);
        dropZone.setData('isDropZone', true);
        plank.dropZone = dropZone;
        
        return plank;
    }

    restorePlank(plankIndex, answerValue = null) {
        if (plankIndex < 0 || plankIndex >= this.bridgePlanks.length) return;
        
        const plank = this.bridgePlanks[plankIndex];
        if (plank.isRestored) return;
        
        plank.isRestored = true;
        this.planksRestored++;
        
        // Store answer value for display
        if (answerValue !== null) {
            plank.answerValue = answerValue;
        }
        
        const container = plank.container;
        const centerX = 0;
        const centerY = 0;
        
        // Remove broken plank graphics
        if (plank.graphics) {
            this.tweens.add({
                targets: plank.graphics,
                alpha: 0,
                scaleX: 0.8,
                scaleY: 0.8,
                duration: 200,
                onComplete: () => {
                    plank.graphics.destroy();
                    plank.graphics = null;
                }
            });
        }
        
        // Create restored plank (bold, bright, prominent with mathematical symbols)
        const restoredPlank = this.add.graphics();
        
        // Outer glow (strong magical energy - ethereal crystal-like)
        restoredPlank.fillStyle(0xFFD700, 0.5);
        restoredPlank.fillRoundedRect(-plank.width/2 - 4, -plank.height/2 - 4, plank.width + 8, plank.height + 8, 5);
        
        // Main plank (bold, bright, crystal-like appearance with gradient - very bold)
        restoredPlank.fillGradientStyle(0x9370DB, 0x9370DB, 0x8A2BE2, 0x8A2BE2, 1);
        restoredPlank.fillRoundedRect(-plank.width/2, -plank.height/2, plank.width, plank.height, 4);
        
        // Strong glowing border (bold, golden, thicker)
        restoredPlank.lineStyle(5, 0xFFD700, 1);
        restoredPlank.strokeRoundedRect(-plank.width/2, -plank.height/2, plank.width, plank.height, 4);
        
        // Inner highlight (bright, crystal-like, more visible)
        restoredPlank.lineStyle(4, 0xFFFFFF, 1);
        restoredPlank.strokeRoundedRect(-plank.width/2 + 2, -plank.height/2 + 2, plank.width - 4, plank.height - 4, 3);
        
        // Intertwined glowing mathematical symbols (ethereal energy)
        const symbols = ['+', '×', '=', '÷', '±'];
        const symbolSize = Math.min(plank.width * 0.15, plank.height * 0.4);
        
        // Small glowing symbols scattered on plank
        for (let i = 0; i < 3; i++) {
            const symbol = symbols[(plankIndex + i) % symbols.length];
            const offsetX = (i - 1) * plank.width * 0.25;
            const offsetY = (Math.sin(i) * plank.height * 0.2);
            
            // Glowing symbol background
            restoredPlank.fillStyle(0xFFD700, 0.3);
            restoredPlank.fillCircle(offsetX, offsetY, symbolSize * 0.6);
        }
        
        // Ethereal energy lines (crystal-like energy flowing)
        restoredPlank.lineStyle(1, 0xFFD700, 0.6);
        for (let i = 0; i < 2; i++) {
            const offset = (i - 0.5) * plank.width * 0.3;
            restoredPlank.beginPath();
            restoredPlank.moveTo(offset, -plank.height/2);
            restoredPlank.lineTo(offset, plank.height/2);
            restoredPlank.strokePath();
        }
        
        container.add(restoredPlank);
        restoredPlank.setDepth(11);
        restoredPlank.setAlpha(1); // Full opacity - bold and prominent
        
        // Add extra boldness layer for better visibility
        const boldLayer = this.add.graphics();
        boldLayer.fillStyle(0x9370DB, 0.3);
        boldLayer.fillRoundedRect(-plank.width/2, -plank.height/2, plank.width, plank.height, 4);
        container.add(boldLayer);
        boldLayer.setDepth(10);
        
        plank.graphics = restoredPlank;
        
        // Display answer number on the plank (optimized size to match plank dimensions)
        if (plank.answerValue !== null) {
            // Calculate font size based on plank dimensions - ensure it fits nicely
            // Use smaller percentage to make number proportional to plank size
            const fontSize = Math.min(Math.max(plank.width * 0.35, plank.height * 0.6), 24);
            const answerText = this.add.text(0, 0, plank.answerValue.toString(), {
                fontSize: fontSize + 'px',
                fill: '#FFD700',
                fontFamily: 'Comic Sans MS, Arial',
                fontStyle: 'bold',
                stroke: '#000000',
                strokeThickness: Math.max(1, fontSize * 0.1),
                shadow: {
                    offsetX: 1,
                    offsetY: 1,
                    color: '#000000',
                    blur: 2,
                    stroke: true,
                    fill: true
                }
            }).setOrigin(0.5);
            container.add(answerText);
            answerText.setDepth(20); // High depth to ensure number is always visible above bunny
            plank.answerText = answerText;
        }
        
        // Create continuous glow effect
        const glowEffect = this.add.graphics();
        glowEffect.fillStyle(0xFFD700, 0.4);
        glowEffect.fillRoundedRect(-plank.width/2 - 5, -plank.height/2 - 5, plank.width + 10, plank.height + 10, 6);
        container.add(glowEffect);
        glowEffect.setDepth(10);
        plank.glowEffect = glowEffect;
        
        // Pulsing glow animation (shimmering effect)
        this.tweens.add({
            targets: glowEffect,
            alpha: 0.2,
            scaleX: 1.15,
            scaleY: 1.15,
            duration: 1200,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // Shimmering effect on the plank itself
        this.tweens.add({
            targets: restoredPlank,
            alpha: 0.95,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // Pop-in animation with magical effect
        container.setScale(0);
        this.tweens.add({
            targets: container,
            scaleX: 1,
            scaleY: 1,
            duration: 500,
            ease: 'Back.easeOut',
            onComplete: () => {
                // Gentle floating animation for restored planks (lightweight, floating above)
                this.tweens.add({
                    targets: container,
                    y: container.y - 2,
                    duration: 2000,
                    yoyo: true,
                    repeat: -1,
                    ease: 'Sine.easeInOut'
                });
            }
        });
        
        // Enhanced sparkle effect
        this.createMagicalSparkles(plank.x + plank.width / 2, plank.y + plank.height / 2);
        
        // Check if all planks are restored
        if (this.planksRestored >= this.totalPlanks) {
            this.completeLevel();
        }
    }

    createBunnyOnPlank(plankIndex) {
        const plank = this.bridgePlanks[plankIndex];
        if (!plank || !plank.container) return;
        
        // Position bunny at the center (X = 0) but above the number (negative Y)
        // Bunny should be on top of the number, centered
        const bunnyX = 0; // Center of plank, same as number
        const bunnyY = -plank.height * 0.6; // Above the number (negative Y = up)
        
        // Create bunny character
        let bunny;
        if (typeof BunnyCharacter !== 'undefined' && typeof BUNNY_CHARACTERS !== 'undefined') {
            // Use random bunny character
            const bunnyKeys = Object.keys(BUNNY_CHARACTERS);
            const randomBunnyKey = bunnyKeys[Phaser.Math.Between(0, bunnyKeys.length - 1)];
            const bunnyConfig = BUNNY_CHARACTERS[randomBunnyKey];
            
            const bunnyChar = new BunnyCharacter(this, { ...bunnyConfig, size: Math.min(plank.width * 0.7, 35) });
            const jumpingTexture = bunnyChar.generateTexture('jumping');
            bunny = this.add.image(bunnyX, bunnyY, jumpingTexture);
        } else {
            // Fallback: simple bunny graphic
            bunny = this.add.graphics();
            bunny.fillStyle(0xFFFFFF, 1);
            bunny.fillCircle(0, 0, 12);
            bunny.fillStyle(0xFFB6C1, 1);
            bunny.fillEllipse(-6, -10, 5, 10);
            bunny.fillEllipse(6, -10, 5, 10);
            bunny.fillStyle(0x4A90E2, 1);
            bunny.fillCircle(-4, -2, 3);
            bunny.fillCircle(4, -2, 3);
            bunny.fillStyle(0xFF69B4, 1);
            bunny.fillTriangle(0, 1, -2, 5, 2, 5);
            bunny.generateTexture('simple_bunny', 25, 25);
            bunny.destroy();
            bunny = this.add.image(bunnyX, bunnyY, 'simple_bunny');
        }
        
        bunny.setOrigin(0.5);
        bunny.setDepth(14); // Below answer text (which is depth 20) so number is always visible
        plank.container.add(bunny);
        
        // Store bunny reference
        if (!plank.bunnies) {
            plank.bunnies = [];
        }
        plank.bunnies.push(bunny);
        
        // Random jumping animation (jump up and down randomly)
        const jump = () => {
            const jumpHeight = Phaser.Math.Between(8, 15);
            const jumpDuration = Phaser.Math.Between(300, 600);
            const delay = Phaser.Math.Between(500, 1500);
            
            this.tweens.add({
                targets: bunny,
                y: bunny.y - jumpHeight,
                duration: jumpDuration,
                ease: 'Power2',
                yoyo: true,
                onComplete: () => {
                    this.time.delayedCall(delay, jump);
                }
            });
        };
        
        // Start jumping after a short delay
        this.time.delayedCall(Phaser.Math.Between(200, 500), jump);
    }

    createWiseOwl() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // Position owl near the broken bridge
        const owlX = width * 0.15;
        const owlY = height * 0.55;
        
        if (typeof WiseOwlCharacter !== 'undefined') {
            this.wiseOwl = new WiseOwlCharacter(this, {
                x: owlX,
                y: owlY,
                size: 100
            });
            this.wiseOwl.create();
        } else {
            // Fallback: simple owl graphic
            const owl = this.add.graphics();
            owl.fillStyle(0x8B4513, 1);
            owl.fillCircle(0, 0, 40);
            owl.fillStyle(0xFFD700, 0.3);
            owl.fillCircle(-10, -10, 20);
            owl.x = owlX;
            owl.y = owlY;
            owl.setDepth(100);
        }
    }

    showIntroductionDialogue() {
        const dialogues = [
            "Chào mừng đến Khu Rừng Đếm Số, Bé Thỏ! Con đường ma thuật này đầy những con số đang chờ bạn khám phá.",
            "Ồ không! Cây cầu gỗ bị gãy, và bạn không thể băng qua dòng suối. Nhưng đừng lo, mỗi câu trả lời đúng sẽ giúp khôi phục một tấm ván.",
            "Giải các bài toán cộng bằng cách chọn số đúng. Kéo nó vào chỗ trống trên cầu. Mỗi câu trả lời đúng sẽ khôi phục một tấm ván. Hãy xem bạn có thể khôi phục cả 10 tấm ván không!"
        ];
        
        this.showDialogueSequence(dialogues, () => {
            // Start first question after dialogues
            this.generateNewQuestion();
        });
    }

    showDialogueSequence(dialogues, onComplete) {
        if (this.dialogueIndex >= dialogues.length) {
            this.dialogueIndex = 0;
            if (onComplete) onComplete();
            return;
        }
        
        const text = dialogues[this.dialogueIndex];
        if (this.wiseOwl) {
            this.wiseOwl.showDialogue(text, 4000);
        }
        
        this.dialogueIndex++;
        this.time.delayedCall(4500, () => {
            this.showDialogueSequence(dialogues, onComplete);
        });
    }

    generateNewQuestion() {
        // Generate random addition problem (ages 4-10)
        // Simple: 1-10 + 1-10, result up to 20
        const num1 = Phaser.Math.Between(1, 10);
        const num2 = Phaser.Math.Between(1, 10);
        const correctAnswer = num1 + num2;
        
        // Generate wrong answers (within reasonable range)
        const wrongAnswers = [];
        while (wrongAnswers.length < 2) {
            const wrong = Phaser.Math.Between(Math.max(1, correctAnswer - 5), correctAnswer + 5);
            if (wrong !== correctAnswer && !wrongAnswers.includes(wrong)) {
                wrongAnswers.push(wrong);
            }
        }
        
        // Shuffle answers
        const allAnswers = [correctAnswer, ...wrongAnswers];
        Phaser.Utils.Array.Shuffle(allAnswers);
        const correctIndex = allAnswers.indexOf(correctAnswer);
        
        this.currentQuestion = {
            question: `${num1} + ${num2} = ?`,
            answers: allAnswers.map(a => a.toString()),
            correct: correctIndex,
            correctAnswer: correctAnswer
        };
        
        // Clear previous question UI
        this.clearQuestionUI();
        
        // Create new question UI
        this.createQuestionUI();
    }

    clearQuestionUI() {
        if (this.questionPanel) {
            this.questionPanel.destroy();
            this.questionPanel = null;
        }
        if (this.questionText) {
            this.questionText.destroy();
            this.questionText = null;
        }
        this.answerCards.forEach(card => {
            if (card && !card.destroyed) card.destroy();
        });
        this.answerCards = [];
    }

    createQuestionUI() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        const question = this.currentQuestion;
        
        // Question panel
        const panelBg = this.add.graphics();
        panelBg.fillStyle(0x8B4513, 0.9);
        panelBg.fillRoundedRect(0, 0, width * 0.85, 120, 20);
        panelBg.lineStyle(4, 0xFFD700, 1);
        panelBg.strokeRoundedRect(0, 0, width * 0.85, 120, 20);
        panelBg.generateTexture('questionPanel', width * 0.85, 120);
        panelBg.destroy();
        
        this.questionPanel = this.add.image(width / 2, height * 0.15, 'questionPanel');
        this.questionPanel.setDepth(150);
        
        // Question text
        this.questionText = this.add.text(width / 2, height * 0.15, question.question, {
            fontSize: '36px',
            fill: '#FFFFFF',
            fontFamily: 'Comic Sans MS, Arial',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);
        this.questionText.setDepth(151);
        
        // Answer cards
        this.createAnswerCards();
    }

    createAnswerCards() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        const question = this.currentQuestion;
        
        // Calculate card size to match bridge plank proportions
        // Bridge plank: width = (width * 0.7 / 10) * 0.9, height = 28
        const bridgeWidth = width * 0.7;
        const plankWidth = (bridgeWidth / this.totalPlanks) * 0.9;
        const plankHeight = 28;
        
        // Cards should be slightly larger than planks for easy interaction
        // but maintain similar proportions
        const cardWidth = Math.max(plankWidth * 1.3, 50); // At least 50px, or 1.3x plank width
        const cardHeight = Math.max(plankHeight * 2.5, 70); // At least 70px, or 2.5x plank height
        
        const spacing = 15;
        const totalWidth = (cardWidth + spacing) * question.answers.length - spacing;
        const startX = (width - totalWidth) / 2;
        const cardY = height * 0.32;
        
        // Pastel color palette with glowing edges
        const colorPalettes = [
            { main: 0xFFB6C1, dark: 0xFF91A4, glow: 0xFF69B4 }, // Pink
            { main: 0x90EE90, dark: 0x7ACC7A, glow: 0x32CD32 }, // Green
            { main: 0x87CEEB, dark: 0x6BB6E2, glow: 0x4682B4 }, // Sky Blue
            { main: 0xFFD700, dark: 0xFFA500, glow: 0xFF8C00 }, // Gold
            { main: 0xDDA0DD, dark: 0xDA70D6, glow: 0x9370DB }, // Plum
            { main: 0xFFE4B5, dark: 0xFFDAB9, glow: 0xFFA500 }  // Peach
        ];
        
        question.answers.forEach((answer, index) => {
            const palette = colorPalettes[index % colorPalettes.length];
            
            // Create card with glowing edges
            const cardBg = this.add.graphics();
            
            // Outer glow (magical effect)
            cardBg.fillStyle(palette.glow, 0.4);
            cardBg.fillRoundedRect(-3, -3, cardWidth + 6, cardHeight + 6, 18);
            
            // Shadow
            cardBg.fillStyle(0x000000, 0.25);
            cardBg.fillRoundedRect(2, 2, cardWidth, cardHeight, 15);
            
            // Card gradient (soft pastel)
            cardBg.fillGradientStyle(palette.main, palette.main, palette.dark, palette.dark, 1);
            cardBg.fillRoundedRect(0, 0, cardWidth, cardHeight, 15);
            
            // Glowing border (bright, magical)
            cardBg.lineStyle(4, palette.glow, 1);
            cardBg.strokeRoundedRect(0, 0, cardWidth, cardHeight, 15);
            
            // Inner highlight
            cardBg.lineStyle(2, 0xFFFFFF, 0.7);
            cardBg.strokeRoundedRect(3, 3, cardWidth - 6, cardHeight - 6, 12);
            
            cardBg.generateTexture(`card_${index}`, cardWidth + 6, cardHeight + 6);
            cardBg.destroy();
            
            const cardX = startX + index * (cardWidth + spacing) + cardWidth / 2;
            
            // Create container with glow effect
            const cardContainer = this.add.container(cardX, cardY);
            
            // Glow effect (continuous pulsing)
            const glow = this.add.graphics();
            glow.fillStyle(palette.glow, 0.3);
            glow.fillRoundedRect(-cardWidth/2 - 2, -cardHeight/2 - 2, cardWidth + 4, cardHeight + 4, 17);
            cardContainer.add(glow);
            
            // Card image
            const card = this.add.image(0, 0, `card_${index}`);
            cardContainer.add(card);
            
            // Answer text (optimized size to fit better in card)
            const fontSize = Math.min(cardWidth * 0.4, cardHeight * 0.5, 42); // Smaller, fits better
            const answerText = this.add.text(0, 0, answer, {
                fontSize: fontSize + 'px',
                fill: '#FFFFFF',
                fontFamily: 'Comic Sans MS, Arial',
                fontStyle: 'bold',
                stroke: '#000000',
                strokeThickness: Math.max(2, fontSize * 0.08),
                shadow: {
                    offsetX: 1,
                    offsetY: 1,
                    color: '#000000',
                    blur: 3,
                    stroke: true,
                    fill: true
                }
            }).setOrigin(0.5);
            cardContainer.add(answerText);
            
            // Pulsing glow animation
            this.tweens.add({
                targets: glow,
                alpha: 0.5,
                scaleX: 1.05,
                scaleY: 1.05,
                duration: 1200,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
            
            // Gentle floating animation
            this.tweens.add({
                targets: cardContainer,
                y: cardY - 3,
                duration: 2000 + index * 100,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut',
                delay: index * 150
            });
            
            // Make draggable
            cardContainer.setSize(cardWidth, cardHeight);
            cardContainer.setInteractive({ 
                draggable: true,
                useHandCursor: true
            });
            
            cardContainer.setData('answerIndex', index);
            cardContainer.setData('answerText', answer);
            cardContainer.setData('originalX', cardX);
            cardContainer.setData('originalY', cardY);
            cardContainer.setData('palette', palette);
            cardContainer.setDepth(150);
            
            // Drag events
            cardContainer.on('dragstart', (pointer) => {
                this.draggedCard = cardContainer;
                // Stop floating animation
                this.tweens.killTweensOf(cardContainer);
                // Enhance glow when dragging
                this.tweens.add({
                    targets: glow,
                    alpha: 0.8,
                    scaleX: 1.2,
                    scaleY: 1.2,
                    duration: 200
                });
                cardContainer.setScale(1.15);
                cardContainer.setDepth(200);
            });
            
            cardContainer.on('drag', (pointer, dragX, dragY) => {
                cardContainer.x = dragX;
                cardContainer.y = dragY;
            });
            
            cardContainer.on('dragend', () => {
                this.handleCardDrop(cardContainer);
            });
            
            this.answerCards.push(cardContainer);
        });
    }

    handleCardDrop(card) {
        if (this.checkingAnswer) return;
        
        const cardX = card.x;
        const cardY = card.y;
        
        // Check if dropped on any plank drop zone
        let droppedOnPlank = false;
        for (let i = 0; i < this.bridgePlanks.length; i++) {
            const plank = this.bridgePlanks[i];
            if (plank.isRestored) continue;
            
            const dropZone = plank.dropZone;
            const zoneX = dropZone.x;
            const zoneY = dropZone.y;
            const zoneWidth = dropZone.width;
            const zoneHeight = dropZone.height;
            
            if (cardX >= zoneX - zoneWidth / 2 && cardX <= zoneX + zoneWidth / 2 &&
                cardY >= zoneY - zoneHeight / 2 && cardY <= zoneY + zoneHeight / 2) {
                
                droppedOnPlank = true;
                this.checkAnswer(card, plank.index);
                break;
            }
        }
        
        if (!droppedOnPlank) {
            // Return card to original position
            this.returnCard(card);
        }
    }

    checkAnswer(card, plankIndex) {
        if (this.checkingAnswer) return;
        this.checkingAnswer = true;
        
        const answerIndex = card.getData('answerIndex');
        const isCorrect = answerIndex === this.currentQuestion.correct;
        
        if (isCorrect) {
            this.handleCorrectAnswer(card, plankIndex);
        } else {
            this.handleWrongAnswer(card);
        }
        
        this.time.delayedCall(100, () => {
            this.checkingAnswer = false;
        });
    }

    handleCorrectAnswer(card, plankIndex) {
        // Hide card
        this.tweens.add({
            targets: card,
            alpha: 0,
            scale: 0,
            duration: 300,
            onComplete: () => {
                card.destroy();
            }
        });
        
        // Remove from array
        const index = this.answerCards.indexOf(card);
        if (index > -1) {
            this.answerCards.splice(index, 1);
        }
        
        // Restore plank with answer value displayed
        const answerValue = parseInt(card.getData('answerText'));
        this.restorePlank(plankIndex, answerValue);
        
        // Create bunny on the restored plank (randomly positioned)
        this.createBunnyOnPlank(plankIndex);
        
        // Success feedback
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        const successText = this.add.text(width / 2, height * 0.25, 'Xuất sắc! Một tấm ván nữa đã được khôi phục! ⭐', {
            fontSize: '28px',
            fill: '#FFD700',
            fontFamily: 'Comic Sans MS, Arial',
            fontStyle: 'bold',
            stroke: '#FFFFFF',
            strokeThickness: 3
        }).setOrigin(0.5);
        successText.setDepth(200);
        
        // Wise Owl feedback
        if (this.wiseOwl) {
            this.wiseOwl.showDialogue("Làm tốt lắm, Bé Thỏ! Một tấm ván nữa đã được khôi phục. Tiếp tục nhé!", 3000);
        }
        
        // Next question after delay
        this.time.delayedCall(2500, () => {
            successText.destroy();
            if (this.planksRestored < this.totalPlanks) {
                this.generateNewQuestion();
            }
        });
    }

    handleWrongAnswer(card) {
        // Find the plank that was targeted (if any)
        const cardX = card.x;
        const cardY = card.y;
        let targetPlank = null;
        
        for (let i = 0; i < this.bridgePlanks.length; i++) {
            const plank = this.bridgePlanks[i];
            if (plank.isRestored) continue;
            
            const dropZone = plank.dropZone;
            const zoneX = dropZone.x;
            const zoneY = dropZone.y;
            const zoneWidth = dropZone.width;
            const zoneHeight = dropZone.height;
            
            if (cardX >= zoneX - zoneWidth / 2 && cardX <= zoneX + zoneWidth / 2 &&
                cardY >= zoneY - zoneHeight / 2 && cardY <= zoneY + zoneHeight / 2) {
                targetPlank = plank;
                break;
            }
        }
        
        // Shake the targeted plank (subtle denial effect)
        if (targetPlank && targetPlank.container) {
            const originalY = targetPlank.container.y;
            this.tweens.add({
                targets: targetPlank.container,
                x: targetPlank.container.x - 3,
                duration: 50,
                yoyo: true,
                repeat: 3,
                onComplete: () => {
                    targetPlank.container.x = targetPlank.x + targetPlank.width / 2;
                }
            });
            
            // Dim effect on plank
            if (targetPlank.graphics) {
                this.tweens.add({
                    targets: targetPlank.graphics,
                    alpha: 0.4,
                    duration: 300,
                    yoyo: true,
                    repeat: 1
                });
            }
        }
        
        // Shake card animation
        const originalX = card.getData('originalX');
        const originalY = card.getData('originalY');
        
        this.tweens.add({
            targets: card,
            x: card.x - 8,
            duration: 50,
            yoyo: true,
            repeat: 4,
            onComplete: () => {
                this.returnCard(card);
            }
        });
        
        // Gentle sparkle denial effect
        if (targetPlank) {
            const sparkX = targetPlank.x + targetPlank.width / 2;
            const sparkY = targetPlank.y + targetPlank.height / 2;
            this.createDenialSparkles(sparkX, sparkY);
        }
        
        // Wrong answer feedback
        const width = this.cameras.main.width;
        const hintText = this.add.text(width / 2, this.cameras.main.height * 0.25, 'Ồ! Chưa đúng. Hãy đếm cẩn thận và chọn lại nhé! 💡', {
            fontSize: '24px',
            fill: '#FF8C00',
            fontFamily: 'Comic Sans MS, Arial',
            fontStyle: 'bold',
            stroke: '#FFFFFF',
            strokeThickness: 2
        }).setOrigin(0.5);
        hintText.setDepth(200);
        
        // Wise Owl feedback
        if (this.wiseOwl) {
            this.wiseOwl.showDialogue("Ồ! Chưa đúng. Hãy đếm cẩn thận và chọn lại nhé!", 3000);
        }
        
        this.time.delayedCall(2000, () => {
            hintText.destroy();
        });
    }

    returnCard(card) {
        const originalX = card.getData('originalX');
        const originalY = card.getData('originalY');
        const glow = card.list[0]; // Glow is first in container
        
        // Reset glow
        this.tweens.add({
            targets: glow,
            alpha: 0.3,
            scaleX: 1,
            scaleY: 1,
            duration: 300
        });
        
        // Return card to position
        this.tweens.add({
            targets: card,
            x: originalX,
            y: originalY,
            scaleX: 1,
            scaleY: 1,
            duration: 400,
            ease: 'Back.easeOut',
            onComplete: () => {
                card.setDepth(150);
                this.draggedCard = null;
                
                // Restart floating animation
                this.tweens.add({
                    targets: card,
                    y: originalY - 3,
                    duration: 2000,
                    yoyo: true,
                    repeat: -1,
                    ease: 'Sine.easeInOut'
                });
            }
        });
    }

    createSparkles(x, y) {
        for (let i = 0; i < 15; i++) {
            const sparkle = this.add.graphics();
            sparkle.fillStyle(0xFFD700, 1);
            sparkle.fillCircle(0, 0, 4);
            sparkle.x = x;
            sparkle.y = y;
            sparkle.setDepth(200);
            
            const angle = Phaser.Math.Between(0, 360);
            const distance = Phaser.Math.Between(30, 80);
            const targetX = x + Math.cos(Phaser.Math.DegToRad(angle)) * distance;
            const targetY = y + Math.sin(Phaser.Math.DegToRad(angle)) * distance;
            
            this.tweens.add({
                targets: sparkle,
                x: targetX,
                y: targetY,
                alpha: 0,
                scale: 0,
                duration: 600,
                ease: 'Power2',
                onComplete: () => {
                    sparkle.destroy();
                }
            });
        }
    }

    createMagicalSparkles(x, y) {
        // Enhanced sparkle effect for correct answers
        const colors = [0xFFD700, 0xFF69B4, 0x87CEEB, 0x90EE90, 0x9370DB];
        for (let i = 0; i < 25; i++) {
            const sparkle = this.add.graphics();
            const color = colors[Phaser.Math.Between(0, colors.length - 1)];
            
            // Outer glow
            sparkle.fillStyle(color, 0.6);
            sparkle.fillCircle(0, 0, 6);
            // Inner bright
            sparkle.fillStyle(0xFFFFFF, 1);
            sparkle.fillCircle(0, 0, 3);
            
            sparkle.x = x;
            sparkle.y = y;
            sparkle.setDepth(200);
            
            const angle = Phaser.Math.Between(0, 360);
            const distance = Phaser.Math.Between(40, 100);
            const targetX = x + Math.cos(Phaser.Math.DegToRad(angle)) * distance;
            const targetY = y + Math.sin(Phaser.Math.DegToRad(angle)) * distance;
            
            this.tweens.add({
                targets: sparkle,
                x: targetX,
                y: targetY,
                alpha: 0,
                scale: 0,
                rotation: 360,
                duration: 800,
                ease: 'Power2',
                onComplete: () => {
                    sparkle.destroy();
                }
            });
        }
    }

    createDenialSparkles(x, y) {
        // Subtle denial effect for wrong answers
        for (let i = 0; i < 8; i++) {
            const sparkle = this.add.graphics();
            sparkle.fillStyle(0xFF8C00, 0.7);
            sparkle.fillCircle(0, 0, 3);
            sparkle.x = x;
            sparkle.y = y;
            sparkle.setDepth(200);
            
            const angle = Phaser.Math.Between(0, 360);
            const distance = Phaser.Math.Between(20, 40);
            const targetX = x + Math.cos(Phaser.Math.DegToRad(angle)) * distance;
            const targetY = y + Math.sin(Phaser.Math.DegToRad(angle)) * distance;
            
            this.tweens.add({
                targets: sparkle,
                x: targetX,
                y: targetY,
                alpha: 0,
                scale: 0,
                duration: 400,
                ease: 'Power2',
                onComplete: () => {
                    sparkle.destroy();
                }
            });
        }
    }

    createAmbientCreatures() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // Generate butterflies (soft fluttering around bridge)
        if (typeof generateButterflies === 'function' && typeof createMenuButterfly === 'function') {
            const butterflyDataList = generateButterflies(this, 5);
            butterflyDataList.forEach(data => {
                const butterfly = createMenuButterfly(this, data);
                if (butterfly) {
                    // Position butterflies around bridge area
                    butterfly.x = Phaser.Math.Between(width * 0.1, width * 0.9);
                    butterfly.y = Phaser.Math.Between(height * 0.3, height * 0.7);
                    this.butterflies.push(butterfly);
                }
            });
        }
        
        // Generate fireflies (glowing around bridge and tiles)
        if (typeof generateFireflies === 'function' && typeof createMenuFirefly === 'function') {
            const fireflyDataList = generateFireflies(this, 6);
            fireflyDataList.forEach(data => {
                const firefly = createMenuFirefly(this, data);
                if (firefly) {
                    // Position fireflies around bridge and answer tiles area
                    firefly.x = Phaser.Math.Between(width * 0.1, width * 0.9);
                    firefly.y = Phaser.Math.Between(height * 0.2, height * 0.6);
                    this.fireflies.push(firefly);
                }
            });
        }
        
        // Generate magic particles (drifting around bridge and tiles)
        if (typeof generateMagicParticles === 'function' && typeof createMenuMagicParticle === 'function') {
            const particleDataList = generateMagicParticles(this, 8);
            particleDataList.forEach(data => {
                const particle = createMenuMagicParticle(this, data);
                if (particle) {
                    // Position particles around bridge area
                    particle.x = Phaser.Math.Between(width * 0.15, width * 0.85);
                    particle.y = Phaser.Math.Between(height * 0.3, height * 0.7);
                    this.magicParticles.push(particle);
                }
            });
        }
    }

    update() {
        // Update ambient creatures
        if (this.butterflies && this.butterflies.length > 0) {
            this.butterflies.forEach(butterfly => {
                const behaviorSystem = butterfly.getData('behaviorSystem');
                if (behaviorSystem && typeof behaviorSystem.update === 'function') {
                    behaviorSystem.update(this.butterflies);
                }
            });
        }
        
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
        
        // Hide question UI
        this.clearQuestionUI();
        
        // Victory celebration
        const victoryText = this.add.text(width / 2, height / 2, 'Hoàn thành! 🎉\nBạn đã khôi phục tất cả 10 tấm ván!', {
            fontSize: '40px',
            fill: '#FFD700',
            fontFamily: 'Comic Sans MS, Arial',
            fontStyle: 'bold',
            align: 'center',
            stroke: '#FFFFFF',
            strokeThickness: 4
        }).setOrigin(0.5);
        victoryText.setDepth(200);
        
        // Enhanced magical sparkles everywhere
        for (let i = 0; i < 50; i++) {
            const x = Phaser.Math.Between(0, width);
            const y = Phaser.Math.Between(0, height);
            this.createMagicalSparkles(x, y);
        }
        
        // Show reward: Trang sách số 1
        this.time.delayedCall(2000, () => {
            victoryText.destroy();
            this.showReward();
        });
    }

    showReward() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // Reward panel
        const rewardBg = this.add.graphics();
        rewardBg.fillStyle(0x000000, 0.7);
        rewardBg.fillRect(0, 0, width, height);
        rewardBg.setDepth(250);
        
        const panelBg = this.add.graphics();
        panelBg.fillStyle(0xFFD700, 0.95);
        panelBg.fillRoundedRect(0, 0, width * 0.7, height * 0.5, 20);
        panelBg.lineStyle(5, 0xFFFFFF, 1);
        panelBg.strokeRoundedRect(0, 0, width * 0.7, height * 0.5, 20);
        panelBg.generateTexture('rewardPanel', width * 0.7, height * 0.5);
        panelBg.destroy();
        
        const panel = this.add.image(width / 2, height / 2, 'rewardPanel');
        panel.setDepth(251);
        
        // Reward text
        const rewardTitle = this.add.text(width / 2, height * 0.35, 'Trang sách số 1', {
            fontSize: '48px',
            fill: '#8B4513',
            fontFamily: 'Comic Sans MS, Arial',
            fontStyle: 'bold',
            stroke: '#FFFFFF',
            strokeThickness: 3
        }).setOrigin(0.5);
        rewardTitle.setDepth(252);
        
        const rewardSubtitle = this.add.text(width / 2, height * 0.45, 'Sức Mạnh Của Những Con Số', {
            fontSize: '32px',
            fill: '#8B4513',
            fontFamily: 'Comic Sans MS, Arial',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        rewardSubtitle.setDepth(252);
        
        // Decorative star
        const star = this.add.graphics();
        star.fillStyle(0xFFD700, 1);
        star.fillStar(width / 2, height * 0.55, 30, 5, 0);
        star.setDepth(252);
        
        // Continue button
        const continueBtn = this.add.graphics();
        continueBtn.fillStyle(0x8B4513, 1);
        continueBtn.fillRoundedRect(0, 0, 200, 60, 10);
        continueBtn.lineStyle(3, 0xFFD700, 1);
        continueBtn.strokeRoundedRect(0, 0, 200, 60, 10);
        continueBtn.generateTexture('continueBtn', 200, 60);
        continueBtn.destroy();
        
        const btn = this.add.image(width / 2, height * 0.7, 'continueBtn')
            .setInteractive({ useHandCursor: true })
            .setDepth(252);
        
        const btnText = this.add.text(width / 2, height * 0.7, 'Tiếp tục', {
            fontSize: '24px',
            fill: '#FFFFFF',
            fontFamily: 'Comic Sans MS, Arial',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        btnText.setDepth(253);
        
        btn.on('pointerdown', () => {
            this.scene.stop('UIScene');
            this.scene.start('MenuScene');
        });
        
        // Wise Owl final message
        if (this.wiseOwl) {
            this.time.delayedCall(500, () => {
                this.wiseOwl.showDialogue("Tuyệt vời! Bạn đã học được sức mạnh của những con số!", 4000);
            });
        }
    }

    shutdown() {
        // Cleanup
        if (this.wiseOwl) {
            this.wiseOwl.destroy();
        }
        
        this.butterflies.forEach(butterfly => {
            const behaviorSystem = butterfly.getData('behaviorSystem');
            if (behaviorSystem && typeof behaviorSystem.destroy === 'function') {
                behaviorSystem.destroy();
            }
        });
        
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
        
        this.clearQuestionUI();
    }
}
