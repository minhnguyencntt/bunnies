/**
 * Level1Scene - Level 1: Cầu Toán Học
 * Gameplay: Kéo thẻ đáp án vào ô trả lời
 */
class Level1Scene extends Phaser.Scene {
    constructor() {
        super({ key: 'Level1Scene' });
        this.currentQuestion = 0;
        this.questions = [
            { question: '2 + 3 = ?', answers: ['4', '5', '6'], correct: 1 },
            { question: '5 - 2 = ?', answers: ['2', '3', '4'], correct: 1 },
            { question: '1 + 4 = ?', answers: ['4', '5', '6'], correct: 1 }
        ];
        this.draggedCard = null;
        this.checkingAnswer = false;
        this.dropZone = null;
        this.dropZoneX = undefined;
        this.dropZoneY = undefined;
        this.dropZoneSize = undefined;
        this.dropZoneCorrectIndex = undefined;
    }

    create() {
        console.log('Level1Scene: create() called');
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Background
        this.createBackground();

        // UI Scene overlay
        this.scene.launch('UIScene');

        // Bé Thỏ (placeholder - sẽ thay bằng sprite thật)
        this.createBunny();

        // Cầu gãy
        this.createBridge();

        // Load câu hỏi đầu tiên
        this.loadQuestion(0);
        console.log('Level1Scene: Initialized successfully');
    }

    createBackground() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Sky gradient
        const sky = this.add.graphics();
        sky.fillGradientStyle(0x87CEEB, 0x87CEEB, 0xFFB6C1, 0xFFB6C1, 1);
        sky.fillRect(0, 0, width, height * 0.6);

        // Ground
        const ground = this.add.graphics();
        ground.fillStyle(0x90EE90, 1);
        ground.fillRect(0, height * 0.6, width, height * 0.4);

        // Decorative trees (simple shapes)
        for (let i = 0; i < 5; i++) {
            const x = (width / 6) * (i + 1);
            const tree = this.add.graphics();
            tree.fillStyle(0x228B22, 1);
            tree.fillCircle(x, height * 0.5, 30);
            tree.fillStyle(0x8B4513, 1);
            tree.fillRect(x - 5, height * 0.5, 10, 40);
        }
    }

    createBunny() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Sử dụng bunny sprite từ BootScene
        if (this.textures.exists('bunny_sprite')) {
            this.bunny = this.add.image(width * 0.2, height * 0.7, 'bunny_sprite');
        } else {
            // Fallback nếu chưa có sprite
            this.bunny = this.add.graphics();
            this.bunny.fillStyle(0xFFFFFF, 1);
            this.bunny.fillCircle(0, 0, 30);
            this.bunny.fillStyle(0xFFB6C1, 1);
            this.bunny.fillEllipse(-15, -10, 10, 20);
            this.bunny.fillEllipse(15, -10, 10, 20);
            this.bunny.fillStyle(0x4A90E2, 1);
            this.bunny.fillCircle(-8, 5, 5);
            this.bunny.fillCircle(8, 5, 5);
            this.bunny.fillStyle(0xFF69B4, 1);
            this.bunny.fillTriangle(0, 10, -3, 15, 3, 15);
            this.bunny.x = width * 0.2;
            this.bunny.y = height * 0.7;
        }

        // Idle animation (bounce)
        this.tweens.add({
            targets: this.bunny,
            y: height * 0.7 - 10,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    createBridge() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Cầu gãy với thiết kế đẹp hơn
        this.bridge = this.add.graphics();
        const bridgeX = width * 0.3;
        const bridgeY = height * 0.65;
        const bridgeWidth = width * 0.4;
        const bridgeHeight = 25;
        
        // Shadow
        this.bridge.fillStyle(0x000000, 0.3);
        this.bridge.fillRoundedRect(bridgeX + 3, bridgeY + 3, bridgeWidth, bridgeHeight, 5);
        
        // Main bridge (brown wood)
        this.bridge.fillStyle(0x8B4513, 1);
        this.bridge.fillRoundedRect(bridgeX, bridgeY, bridgeWidth, bridgeHeight, 5);
        
        // Wood planks
        this.bridge.lineStyle(2, 0x654321, 1);
        for (let i = 0; i < 5; i++) {
            const plankX = bridgeX + (bridgeWidth / 5) * i;
            this.bridge.beginPath();
            this.bridge.moveTo(plankX, bridgeY);
            this.bridge.lineTo(plankX, bridgeY + bridgeHeight);
            this.bridge.strokePath();
        }
        
        // Gap in the middle (broken part)
        const gapX = bridgeX + bridgeWidth * 0.48;
        const gapWidth = bridgeWidth * 0.04;
        this.bridge.fillStyle(0x000000, 0.7);
        this.bridge.fillRect(gapX, bridgeY - 5, gapWidth, bridgeHeight + 10);
        
        // Bridge supports
        this.bridge.fillStyle(0x654321, 1);
        this.bridge.fillRect(bridgeX - 5, bridgeY + bridgeHeight, 10, 30);
        this.bridge.fillRect(bridgeX + bridgeWidth - 5, bridgeY + bridgeHeight, 10, 30);

        this.bridgeFixed = false;
    }

    loadQuestion(questionIndex) {
        if (questionIndex >= this.questions.length) {
            this.completeLevel();
            return;
        }

        this.currentQuestion = questionIndex;
        const question = this.questions[questionIndex];

        // Clear previous question elements
        if (this.questionPanel) {
            this.questionPanel.destroy();
            this.questionPanel = null;
        }
        if (this.questionText) {
            this.questionText.destroy();
            this.questionText = null;
        }
        if (this.answerCards) {
            this.answerCards.forEach(card => {
                if (card && !card.destroyed) card.destroy();
            });
            this.answerCards = [];
        }
        if (this.dropZone) {
            this.dropZone.destroy();
            this.dropZone = null;
        }

        // Question Panel
        this.createQuestionPanel(question.question);

        // Answer Cards
        this.createAnswerCards(question.answers);

        // Drop Zone
        this.createDropZone(question.correct);
    }

    createQuestionPanel(questionText) {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Panel background
        const panelBg = this.add.graphics();
        panelBg.fillStyle(0x8B4513, 0.8);
        panelBg.fillRoundedRect(0, 0, width * 0.9, 150, 20);
        panelBg.lineStyle(5, 0xFFD700, 1);
        panelBg.strokeRoundedRect(0, 0, width * 0.9, 150, 20);
        panelBg.generateTexture('questionPanel', width * 0.9, 150);
        panelBg.destroy();

        this.questionPanel = this.add.image(width / 2, height * 0.15, 'questionPanel');

        // Question text
        this.questionText = this.add.text(width / 2, height * 0.15, `Câu hỏi: ${questionText}`, {
            fontSize: '32px',
            fill: '#FFFFFF',
            fontFamily: 'Arial',
            fontStyle: 'bold',
            align: 'center',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);
    }

    createAnswerCards(answers) {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        this.answerCards = [];

        const cardWidth = 120;
        const cardHeight = 120;
        const spacing = 20;
        const totalWidth = (cardWidth + spacing) * answers.length - spacing;
        const startX = (width - totalWidth) / 2;

        answers.forEach((answer, index) => {
            // Card background với shadow và gradient
            const cardBg = this.add.graphics();
            const colors = [0xFFB6C1, 0x90EE90, 0x87CEEB];
            const darkColors = [0xFF91A4, 0x7ACC7A, 0x6BB6E2];
            
            // Shadow
            cardBg.fillStyle(0x000000, 0.3);
            cardBg.fillRoundedRect(3, 3, cardWidth, cardHeight, 15);
            
            // Card gradient
            cardBg.fillGradientStyle(colors[index], colors[index], darkColors[index], darkColors[index], 1);
            cardBg.fillRoundedRect(0, 0, cardWidth, cardHeight, 15);
            
            // Border
            cardBg.lineStyle(4, 0xFFFFFF, 1);
            cardBg.strokeRoundedRect(0, 0, cardWidth, cardHeight, 15);
            
            // Inner highlight
            cardBg.lineStyle(2, 0xFFFFFF, 0.5);
            cardBg.strokeRoundedRect(5, 5, cardWidth - 10, cardHeight - 10, 10);
            
            cardBg.generateTexture(`card_${index}`, cardWidth, cardHeight);
            cardBg.destroy();

            const cardX = startX + index * (cardWidth + spacing) + cardWidth / 2;
            const cardY = height * 0.4;
            
            // Create container để text di chuyển cùng card
            const cardContainer = this.add.container(cardX, cardY);
            
            const card = this.add.image(0, 0, `card_${index}`);
            cardContainer.add(card);

            // Answer text
            const answerText = this.add.text(0, 0, answer, {
                fontSize: '48px',
                fill: '#FFFFFF',
                fontFamily: 'Arial',
                fontStyle: 'bold',
                stroke: '#000000',
                strokeThickness: 3
            }).setOrigin(0.5);
            cardContainer.add(answerText);

            // Make container draggable
            cardContainer.setSize(cardWidth, cardHeight);
            cardContainer.setInteractive({ 
                draggable: true,
                useHandCursor: true
            });
            
            cardContainer.setData('answerIndex', index);
            cardContainer.setData('answerText', answer);
            cardContainer.setData('originalX', cardX);
            cardContainer.setData('originalY', cardY);

            cardContainer.on('dragstart', (pointer, dragX, dragY) => {
                this.draggedCard = cardContainer;
                card.setTint(0xCCCCCC);
                cardContainer.setScale(1.2);
                cardContainer.setDepth(1000); // Bring to front
            });

            cardContainer.on('drag', (pointer, dragX, dragY) => {
                cardContainer.x = dragX;
                cardContainer.y = dragY;
            });

            cardContainer.on('dragend', () => {
                // Check if drop zone exists
                if (!this.dropZone || typeof this.dropZoneX === 'undefined') {
                    // Drop zone not ready, return card
                    const originalX = cardContainer.getData('originalX');
                    const originalY = cardContainer.getData('originalY');
                    this.tweens.add({
                        targets: cardContainer,
                        x: originalX,
                        y: originalY,
                        duration: 300,
                        ease: 'Back.easeOut',
                        onComplete: () => {
                            card.clearTint();
                            cardContainer.setScale(1);
                            cardContainer.setDepth(0);
                            this.draggedCard = null;
                        }
                    });
                    return;
                }
                
                // Check if card is over drop zone
                const cardX = cardContainer.x;
                const cardY = cardContainer.y;
                const distanceX = Math.abs(cardX - this.dropZoneX);
                const distanceY = Math.abs(cardY - this.dropZoneY);
                
                if (distanceX < this.dropZoneSize/2 && distanceY < this.dropZoneSize/2) {
                    // Card is over drop zone - check answer
                    this.checkAnswer(cardContainer, this.dropZoneCorrectIndex);
                } else {
                    // Card was not dropped on drop zone, return to position
                    const originalX = cardContainer.getData('originalX');
                    const originalY = cardContainer.getData('originalY');
                    this.tweens.add({
                        targets: cardContainer,
                        x: originalX,
                        y: originalY,
                        duration: 300,
                        ease: 'Back.easeOut',
                        onComplete: () => {
                            card.clearTint();
                            cardContainer.setScale(1);
                            cardContainer.setDepth(0);
                            this.draggedCard = null;
                        }
                    });
                }
            });

            this.answerCards.push(cardContainer);
        });
    }

    createDropZone(correctIndex) {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Drop zone background đẹp hơn
        const dropBg = this.add.graphics();
        const dropSize = 200;
        
        // Outer glow
        dropBg.fillStyle(0x4A90E2, 0.3);
        dropBg.fillCircle(dropSize/2, dropSize/2, dropSize/2 + 10);
        
        // Main zone
        dropBg.fillStyle(0x4A90E2, 0.5);
        dropBg.fillRoundedRect(0, 0, dropSize, dropSize, 20);
        
        // Dashed border
        dropBg.lineStyle(5, 0xFFD700, 1);
        // Draw dashed border manually
        const dashLength = 10;
        const gapLength = 5;
        for (let i = 0; i < dropSize * 4; i += dashLength + gapLength) {
            const pos = i % (dropSize * 4);
            if (pos < dropSize) {
                dropBg.moveTo(pos, 0);
                dropBg.lineTo(Math.min(pos + dashLength, dropSize), 0);
            } else if (pos < dropSize * 2) {
                const p = pos - dropSize;
                dropBg.moveTo(dropSize, p);
                dropBg.lineTo(dropSize, Math.min(p + dashLength, dropSize));
            } else if (pos < dropSize * 3) {
                const p = pos - dropSize * 2;
                dropBg.moveTo(dropSize - p, dropSize);
                dropBg.lineTo(Math.max(dropSize - p - dashLength, 0), dropSize);
            } else {
                const p = pos - dropSize * 3;
                dropBg.moveTo(0, dropSize - p);
                dropBg.lineTo(0, Math.max(dropSize - p - dashLength, 0));
            }
        }
        dropBg.strokePath();
        
        dropBg.generateTexture('dropZone', dropSize, dropSize);
        dropBg.destroy();

        this.dropZone = this.add.image(width / 2, height * 0.7, 'dropZone')
            .setInteractive({ useHandCursor: false });

        // Glow animation
        this.tweens.add({
            targets: this.dropZone,
            alpha: 0.7,
            scale: 1.1,
            duration: 800,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Drop event
        this.dropZone.setData('correctIndex', correctIndex);
        this.dropZone.setData('isDropZone', true);

        // Store drop zone position and size for manual checking
        this.dropZoneX = width / 2;
        this.dropZoneY = height * 0.7;
        this.dropZoneSize = 200;
        this.dropZoneCorrectIndex = correctIndex;
    }

    checkAnswer(card, correctIndex) {
        // Prevent multiple checks
        if (this.checkingAnswer) return;
        this.checkingAnswer = true;
        
        const answerIndex = card.getData('answerIndex');

        if (answerIndex === correctIndex) {
            // Correct answer - mark as checked
            this.draggedCard = null;
            this.handleCorrectAnswer();
        } else {
            // Wrong answer
            this.draggedCard = null;
            this.handleWrongAnswer(card);
        }
        
        // Reset checking flag after a delay
        this.time.delayedCall(100, () => {
            this.checkingAnswer = false;
        });
    }

    handleCorrectAnswer() {
        // Hide dragged card
        if (this.draggedCard) {
            // Remove from answerCards array
            const index = this.answerCards.indexOf(this.draggedCard);
            if (index > -1) {
                this.answerCards.splice(index, 1);
            }
            
            this.tweens.add({
                targets: this.draggedCard,
                alpha: 0,
                scale: 0,
                duration: 300,
                onComplete: () => {
                    this.draggedCard.destroy();
                    this.draggedCard = null;
                }
            });
        }

        // Success message
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        const successText = this.add.text(width / 2, height / 2, 'Xuất sắc! Con giỏi quá! ⭐', {
            fontSize: '36px',
            fill: '#FFD700',
            fontFamily: 'Arial',
            fontStyle: 'bold',
            stroke: '#FFFFFF',
            strokeThickness: 4
        }).setOrigin(0.5);

        // Sparkle particles
        if (this.dropZone) {
            this.createSparkles(this.dropZone.x, this.dropZone.y);
        } else {
            // Fallback to drop zone position
            const width = this.cameras.main.width;
            const height = this.cameras.main.height;
            this.createSparkles(width / 2, height * 0.7);
        }

        // Bé Thỏ celebrate
        this.celebrateBunny();

        // Repair bridge
        this.repairBridge();

        // Next question after delay
        this.time.delayedCall(2000, () => {
            successText.destroy();
            this.loadQuestion(this.currentQuestion + 1);
        });
    }

    handleWrongAnswer(card) {
        // Shake animation
        const originalX = card.getData('originalX') || card.x;
        const originalY = card.getData('originalY') || card.y;
        
        this.tweens.add({
            targets: card,
            x: card.x - 10,
            duration: 50,
            yoyo: true,
            repeat: 5,
            onComplete: () => {
                // Return card to original position
                this.tweens.add({
                    targets: card,
                    x: originalX,
                    y: originalY,
                    duration: 300,
                    ease: 'Back.easeOut'
                });
            }
        });

        // Hint message
        const width = this.cameras.main.width;
        const hintText = this.add.text(width / 2, this.cameras.main.height * 0.25, 'Hãy thử lại nhé! 💡', {
            fontSize: '28px',
            fill: '#FF8C00',
            fontFamily: 'Arial',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.time.delayedCall(2000, () => {
            hintText.destroy();
        });
    }

    createSparkles(x, y) {
        for (let i = 0; i < 20; i++) {
            const sparkle = this.add.graphics();
            sparkle.fillStyle(0xFFD700, 1);
            sparkle.fillCircle(0, 0, 5);
            sparkle.x = x;
            sparkle.y = y;

            const angle = Phaser.Math.Between(0, 360);
            const distance = Phaser.Math.Between(50, 150);
            const targetX = x + Math.cos(Phaser.Math.DegToRad(angle)) * distance;
            const targetY = y + Math.sin(Phaser.Math.DegToRad(angle)) * distance;

            this.tweens.add({
                targets: sparkle,
                x: targetX,
                y: targetY,
                alpha: 0,
                scale: 0,
                duration: 800,
                ease: 'Power2',
                onComplete: () => {
                    sparkle.destroy();
                }
            });
        }
    }

    celebrateBunny() {
        // Bé Thỏ nhảy cẫng
        this.tweens.add({
            targets: this.bunny,
            y: this.bunny.y - 50,
            duration: 300,
            yoyo: true,
            repeat: 2,
            ease: 'Bounce.easeOut'
        });

        // Scale animation
        this.tweens.add({
            targets: this.bunny,
            scaleX: 1.3,
            scaleY: 1.3,
            duration: 200,
            yoyo: true,
            ease: 'Back.easeOut'
        });
    }

    repairBridge() {
        if (this.bridgeFixed) return;

        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Sửa phần gãy với animation
        const bridgeX = width * 0.3;
        const bridgeY = height * 0.65;
        const bridgeWidth = width * 0.4;
        const bridgeHeight = 25;
        
        // Clear và vẽ lại cầu hoàn chỉnh
        this.bridge.clear();
        
        // Shadow
        this.bridge.fillStyle(0x000000, 0.3);
        this.bridge.fillRoundedRect(bridgeX + 3, bridgeY + 3, bridgeWidth, bridgeHeight, 5);
        
        // Main bridge (brown wood)
        this.bridge.fillStyle(0x8B4513, 1);
        this.bridge.fillRoundedRect(bridgeX, bridgeY, bridgeWidth, bridgeHeight, 5);
        
        // Wood planks
        this.bridge.lineStyle(2, 0x654321, 1);
        for (let i = 0; i < 5; i++) {
            const plankX = bridgeX + (bridgeWidth / 5) * i;
            this.bridge.beginPath();
            this.bridge.moveTo(plankX, bridgeY);
            this.bridge.lineTo(plankX, bridgeY + bridgeHeight);
            this.bridge.strokePath();
        }
        
        // Glow effect (golden magic)
        this.bridge.fillStyle(0xFFD700, 0.3);
        this.bridge.fillRoundedRect(bridgeX, bridgeY, bridgeWidth, bridgeHeight, 5);
        
        // Bridge supports
        this.bridge.fillStyle(0x654321, 1);
        this.bridge.fillRect(bridgeX - 5, bridgeY + bridgeHeight, 10, 30);
        this.bridge.fillRect(bridgeX + bridgeWidth - 5, bridgeY + bridgeHeight, 10, 30);

        this.bridgeFixed = true;

        // Sparkle effect trên cầu
        for (let i = 0; i < 30; i++) {
            const x = Phaser.Math.Between(bridgeX, bridgeX + bridgeWidth);
            const y = bridgeY;
            this.createSparkles(x, y);
        }
    }

    completeLevel() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Victory message
        const victoryText = this.add.text(width / 2, height / 2, 'Hoàn thành Level 1! 🎉\nCon đã sửa xong cầu rồi!', {
            fontSize: '40px',
            fill: '#FFD700',
            fontFamily: 'Arial',
            fontStyle: 'bold',
            align: 'center',
            stroke: '#FFFFFF',
            strokeThickness: 4
        }).setOrigin(0.5);

        // More sparkles
        for (let i = 0; i < 50; i++) {
            const x = Phaser.Math.Between(0, width);
            const y = Phaser.Math.Between(0, height);
            this.createSparkles(x, y);
        }

        // Return to menu after delay
        this.time.delayedCall(3000, () => {
            this.scene.stop('UIScene');
            this.scene.start('MenuScene');
        });
    }
}

