/**
 * MenuScene - Màn hình menu chính
 */
class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    create() {
        console.log('MenuScene: create() called');
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Background gradient
        const bg = this.add.graphics();
        bg.fillGradientStyle(0x90EE90, 0x90EE90, 0x4A90E2, 0x4A90E2, 1);
        bg.fillRect(0, 0, width, height);

        // Title
        const title = this.add.text(width / 2, height / 4, 'Bé Thỏ và\nRừng Tri Thức', {
            fontSize: '48px',
            fill: '#FFD700',
            fontFamily: 'Arial',
            fontStyle: 'bold',
            align: 'center',
            stroke: '#FFFFFF',
            strokeThickness: 4
        }).setOrigin(0.5);

        // Sparkle effect cho title
        this.tweens.add({
            targets: title,
            scaleX: 1.1,
            scaleY: 1.1,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Start Button - use texture if available
        let startBtn;
        if (this.textures.exists('btn_primary')) {
            startBtn = this.add.image(width / 2, height / 2, 'btn_primary')
                .setInteractive({ useHandCursor: true });
        } else {
            startBtn = this.add.rectangle(width / 2, height / 2, 320, 90, 0xFFD700)
                .setInteractive({ useHandCursor: true });
        }
        
        startBtn.on('pointerdown', () => {
            this.scene.start('Level1Scene');
        })
        .on('pointerover', () => {
            startBtn.setScale(1.1);
            if (!this.textures.exists('btn_primary')) {
                startBtn.setFillStyle(0xFF8C00);
            } else {
                startBtn.setTint(0xFF8C00);
            }
        })
        .on('pointerout', () => {
            startBtn.setScale(1);
            if (!this.textures.exists('btn_primary')) {
                startBtn.setFillStyle(0xFFD700);
            } else {
                startBtn.clearTint();
            }
        });

        // Start Button Text
        const startText = this.add.text(width / 2, height / 2, '🎮 BẮT ĐẦU', {
            fontSize: '32px',
            fill: '#FFFFFF',
            fontFamily: 'Arial',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);

        // Help Button
        const helpBtn = this.add.rectangle(width / 2, height / 2 + 120, 320, 90, 0x4A90E2)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                this.showHelp();
            })
            .on('pointerover', () => {
                helpBtn.setScale(1.1);
            })
            .on('pointerout', () => {
                helpBtn.setScale(1);
            });

        const helpText = this.add.text(width / 2, height / 2 + 120, '📚 HƯỚNG DẪN', {
            fontSize: '32px',
            fill: '#FFFFFF',
            fontFamily: 'Arial',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Decorative elements
        this.addStars();
    }

    addStars() {
        // Thêm các ngôi sao trang trí
        for (let i = 0; i < 10; i++) {
            const x = Phaser.Math.Between(50, 750);
            const y = Phaser.Math.Between(50, 550);
            const star = this.add.text(x, y, '⭐', {
                fontSize: '24px'
            });

            this.tweens.add({
                targets: star,
                alpha: 0.3,
                duration: 1000 + Math.random() * 1000,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        }
    }

    showHelp() {
        // Hiển thị hướng dẫn (có thể tạo scene riêng hoặc overlay)
        alert('Hướng dẫn:\n\n1. Kéo thẻ đáp án vào ô trả lời\n2. Trả lời đúng để sửa cầu\n3. Hoàn thành tất cả câu hỏi để vượt qua level!');
    }
}

