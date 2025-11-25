/**
 * UIScene - UI overlay cho gameplay
 */
class UIScene extends Phaser.Scene {
    constructor() {
        super({ key: 'UIScene' });
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Set this scene to not block input from other scenes
        this.input.setTopOnly(false);

        // Top HUD bar
        this.createHUD();

        // Home button
        this.createHomeButton();
    }

    createHUD() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // HUD background
        const hudBg = this.add.graphics();
        hudBg.fillStyle(0x000000, 0.3);
        hudBg.fillRect(0, 0, width, 80);
        hudBg.generateTexture('hudBg', width, 80);
        hudBg.destroy();

        this.add.image(width / 2, 40, 'hudBg');

        // Level title
        const levelText = this.add.text(120, 40, 'Level 1: Cầu Toán Học', {
            fontSize: '24px',
            fill: '#FFD700',
            fontFamily: 'Arial',
            fontStyle: 'bold'
        }).setOrigin(0, 0.5);

        // Star counter
        const starIcon = this.add.text(width - 100, 40, '⭐ 0', {
            fontSize: '24px',
            fill: '#FFFFFF',
            fontFamily: 'Arial',
            fontStyle: 'bold'
        }).setOrigin(0.5);
    }

    createHomeButton() {
        const width = this.cameras.main.width;

        // Home button
        const homeBtn = this.add.circle(50, 40, 24, 0x4A90E2)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                this.scene.stop();
                this.scene.start('MenuScene');
            })
            .on('pointerover', () => {
                homeBtn.setScale(1.2);
                homeBtn.setFillStyle(0x90EE90);
            })
            .on('pointerout', () => {
                homeBtn.setScale(1);
                homeBtn.setFillStyle(0x4A90E2);
            });

        const homeIcon = this.add.text(50, 40, '🏠', {
            fontSize: '20px'
        }).setOrigin(0.5);
    }
}

