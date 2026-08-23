/**
 * LevelSelectScreen.js — per-game level selection (Màn 1 / 2 / 3).
 * Shows rank labels (Explorer / Adventurer / Master), earned stars,
 * best score and lock state. Levels unlock sequentially.
 */
class LevelSelectScreen extends Phaser.Scene {
    constructor() {
        super({ key: 'LevelSelectScreen' });
    }

    init(data) {
        this.gameId = data.gameId;
    }

    create() {
        const w = this.cameras.main.width;
        const h = this.cameras.main.height;
        const gameDef = GameConfig.get(this.gameId);
        const profile = SaveEngine.load();
        const gp = SaveEngine.gameProfile(profile, this.gameId);

        AudioEngine.attachScene(this);
        AudioEngine.loadSettings();
        AudioEvents.register();
        const menuAudio = AudioConfig.AREA_AUDIO.menu;
        MusicEngine.playTheme(this, menuAudio.theme.key, menuAudio.theme.url, { volume: menuAudio.theme.volume });

        // Background
        if (this.textures.exists('menu_bg')) {
            this.add.image(w / 2, h / 2, 'menu_bg').setDisplaySize(w, h).setAlpha(0.35);
        } else {
            this.cameras.main.setBackgroundColor(0x2b1a4a);
        }
        this.add.graphics().fillStyle(0x1a0f2e, 0.55).fillRect(0, 0, w, h);

        this.add.text(w / 2, 64, `${gameDef.icon}  ${gameDef.name}`, {
            fontSize: '34px', fontFamily: DesignTokens.typography.fontFamily, fontStyle: 'bold',
            color: DesignTokens.css.surface, stroke: DesignTokens.css.ink, strokeThickness: 4,
        }).setOrigin(0.5);
        this.add.text(w / 2, 104, gameDef.educationalGoal, {
            fontSize: '16px', fontFamily: DesignTokens.typography.fontFamily,
            color: DesignTokens.css.surface,
        }).setOrigin(0.5);

        const cardW = Math.min(300, w * 0.26);
        const cardH = Math.min(340, h * 0.52);
        const gap = 30;
        const totalW = 3 * cardW + 2 * gap;
        const y = h / 2 + 20;

        for (let level = 1; level <= 3; level++) {
            const x = w / 2 - totalW / 2 + cardW / 2 + (level - 1) * (cardW + gap);
            this.createLevelCard(x, y, cardW, cardH, gameDef, gp, level, profile);
        }

        NavSystem.mount(this, {
            onBack: () => NavSystem.home(this),
            depth: 20,
        });
    }

    createLevelCard(x, y, cw, ch, gameDef, gp, level, profile) {
        const cfg = gameDef.levels[level];
        const lp = gp.levels[level];
        const c = this.add.container(x, y);
        const bg = this.add.graphics();
        bg.fillStyle(DesignTokens.colors.surface, 1);
        bg.fillRoundedRect(-cw / 2, -ch / 2, cw, ch, DesignTokens.radius.lg);
        bg.lineStyle(4, DesignTokens.colors.accent, 1);
        bg.strokeRoundedRect(-cw / 2, -ch / 2, cw, ch, DesignTokens.radius.lg);
        c.add(bg);

        c.add(this.add.text(0, -ch / 2 + 34, `Màn ${level}`, {
            fontSize: '26px', fontFamily: DesignTokens.typography.fontFamily, fontStyle: 'bold',
            color: DesignTokens.css.ink,
        }).setOrigin(0.5));

        c.add(this.add.text(0, -ch / 2 + 68, `${cfg.label.icon} ${cfg.label.rank}`, {
            fontSize: '18px', fontFamily: DesignTokens.typography.fontFamily, fontStyle: 'bold',
            color: DesignTokens.css.primary,
        }).setOrigin(0.5));

        c.add(this.add.text(0, -ch / 2 + 104, cfg.title, {
            fontSize: '17px', fontFamily: DesignTokens.typography.fontFamily, color: DesignTokens.css.ink,
            wordWrap: { width: cw - 30 }, align: 'center',
        }).setOrigin(0.5));

        // Stars
        const stars = lp.stars || 0;
        c.add(this.add.text(0, 6, (stars > 0 ? '⭐'.repeat(stars) : '') + '☆'.repeat(3 - stars), {
            fontSize: '34px',
        }).setOrigin(0.5));

        if (lp.bestScore > 0) {
            c.add(this.add.text(0, 40, `Kỷ lục: ${lp.bestScore}`, {
                fontSize: '15px', fontFamily: 'Comic Sans MS, Arial', color: '#6d4c41',
            }).setOrigin(0.5));
        }
        // The PLAY button itself is directly tappable (not just the card)
        const startLevel = () => {
            NavSystem.go(this, gameDef.sceneKey, { gameId: this.gameId, level });
        };
        const playBtn = UISystem.playButton(this, 0, ch / 2 - 43, 'Chơi', startLevel, {
            width: 168, height: 54, fontSize: 22,
        });
        c.add(playBtn);

        setCenteredInput(c, cw, ch);
        c.on('pointerover', () => c.setScale(1.04));
        c.on('pointerout', () => c.setScale(1));
        c.on('pointerdown', startLevel);
        c.setAlpha(0);
        this.tweens.add({
            targets: c, alpha: 1, y: y - 8,
            duration: DesignTokens.motion.uiTransition,
            delay: (level - 1) * 80,
            ease: DesignTokens.motion.easeOut,
        });
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { LevelSelectScreen };
}
