/**
 * UIScene - UI overlay cho gameplay
 */
class UIScreen extends Phaser.Scene {
    constructor() {
        super({ key: 'UIScreen' });
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

        // HUD background with better styling and transparency
        const hudBg = this.add.graphics();
        // Semi-transparent dark background
        hudBg.fillStyle(0x2C1810, 0.85); // Dark brown with high opacity
        hudBg.fillRect(0, 0, width, 80);
        // Border at bottom to separate from content
        hudBg.lineStyle(3, 0xFFD700, 0.6);
        hudBg.lineBetween(0, 80, width, 80);
        hudBg.generateTexture('hudBg', width, 80);
        hudBg.destroy();

        const hudImage = this.add.image(width / 2, 40, 'hudBg');
        hudImage.setDepth(100); // Ensure it's above background but below question panel

        // Determine current level from active scenes using GameFlowConfig
        let levelTitle = 'Level 1: Cầu Toán Học';
        
        if (typeof GameFlowConfig !== 'undefined') {
            // Check which screen is active and get its info
            const screenOrder = GameFlowConfig.screenOrder || [];
            for (const screenKey of screenOrder) {
                if (this.scene.isActive(screenKey)) {
                    const screenInfo = GameFlowConfig.getScreenInfo(screenKey);
                    const position = GameFlowConfig.getScreenPosition(screenKey);
                    if (screenInfo) {
                        levelTitle = `Màn ${position}: ${screenInfo.subtitle || screenInfo.name}`;
                    }
                    break;
                }
            }
        } else {
            // Fallback without config
            if (this.scene.isActive('Level2Scene')) {
                levelTitle = 'Level 2: Thành Phố Gương';
            }
        }

        // Level title with better positioning and styling
        const levelText = this.add.text(120, 40, levelTitle, {
            fontSize: '24px',
            fill: '#FFD700',
            fontFamily: 'Comic Sans MS, Arial',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 2,
            shadow: {
                offsetX: 1,
                offsetY: 1,
                color: '#000000',
                blur: 2,
                stroke: true,
                fill: true
            }
        }).setOrigin(0, 0.5);
        levelText.setDepth(101);

        // Star counter with better styling
        const starIcon = this.add.text(width - 100, 40, '⭐ 0', {
            fontSize: '24px',
            fill: '#FFFFFF',
            fontFamily: 'Comic Sans MS, Arial',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 2,
            shadow: {
                offsetX: 1,
                offsetY: 1,
                color: '#000000',
                blur: 2,
                stroke: true,
                fill: true
            }
        }).setOrigin(0.5);
        starIcon.setDepth(101);
    }

    createHomeButton() {
        const width = this.cameras.main.width;

        // Home button with proper depth
        const homeBtn = this.add.circle(50, 40, 24, 0x4A90E2)
            .setInteractive({ useHandCursor: true })
            .setDepth(101) // Above HUD background
            .on('pointerdown', () => {
                // Stop any active level scenes
                if (this.scene.isActive('Level1Scene')) {
                    this.scene.stop('Level1Scene');
                }
                if (this.scene.isActive('Level2Scene')) {
                    this.scene.stop('Level2Scene');
                }
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
        homeIcon.setDepth(102); // Above button
    }
}

