/**
 * UIScreen — HUD overlay (top bar, home button, star counter).
 * Launched by game screens via scene.launch('UIScreen').
 */
class UIScreen extends Phaser.Scene {
    constructor() {
        super({ key: 'UIScreen' });
    }

    create() {
        this.input.setTopOnly(false);
        this.createHUD();
        this.createHomeButton();
    }

    createHUD() {
        const w = this.cameras.main.width;
        const hudH = 60;

        const hud = this.add.graphics().setDepth(100);
        hud.fillStyle(0x2C1810, 0.82);
        hud.fillRect(0, 0, w, hudH);
        hud.lineStyle(2, 0xFFD700, 0.5);
        hud.lineBetween(0, hudH, w, hudH);

        let levelTitle = 'Màn chơi';
        if (typeof GameFlowConfig !== 'undefined') {
            const order = GameFlowConfig.screenOrder || [];
            for (const key of order) {
                if (this.scene.isActive(key)) {
                    const info = GameFlowConfig.getScreenInfo(key);
                    const pos = GameFlowConfig.getScreenPosition(key);
                    if (info) levelTitle = `Màn ${pos}: ${info.subtitle || info.name}`;
                    break;
                }
            }
        }

        this.add.text(100, hudH / 2, levelTitle, {
            fontSize: '20px', fontFamily: 'Comic Sans MS, Arial', fontStyle: 'bold',
            color: '#FFD700', stroke: '#000', strokeThickness: 2,
        }).setOrigin(0, 0.5).setDepth(101);

        const starIcon = this.add.text(w - 80, hudH / 2, '⭐ 0', {
            fontSize: '20px', fontFamily: 'Comic Sans MS, Arial', fontStyle: 'bold',
            color: '#fff', stroke: '#000', strokeThickness: 2,
        }).setOrigin(0.5).setDepth(101);

        const syncStars = () => {
            const n = window.gameData?.stars || 0;
            starIcon.setText(`⭐ ${n}`);
        };
        syncStars();
        this.time.addEvent({ delay: 500, loop: true, callback: syncStars });
    }

    createHomeButton() {
        const hudH = 60;
        const btnR = 20;
        const btnX = 40;
        const btnY = hudH / 2;

        const homeBtn = this.add.circle(btnX, btnY, btnR, 0x4A90E2)
            .setInteractive({ useHandCursor: true })
            .setDepth(101)
            .on('pointerdown', () => {
                const keys = typeof GameFlowConfig !== 'undefined' && GameFlowConfig.screenOrder
                    ? GameFlowConfig.screenOrder
                    : ['CountingForestScreen', 'MirrorCityScreen', 'SubtractionHillScreen'];
                keys.forEach(k => { if (this.scene.isActive(k)) this.scene.stop(k); });
                this.sound.stopAll();
                this.scene.stop();
                this.scene.start('MenuScreen');
            })
            .on('pointerover', () => { homeBtn.setScale(1.15).setFillStyle(0x90EE90); })
            .on('pointerout', () => { homeBtn.setScale(1).setFillStyle(0x4A90E2); });

        this.add.text(btnX, btnY, '🏠', { fontSize: '18px' }).setOrigin(0.5).setDepth(102);
    }
}
