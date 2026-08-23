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

        // Header
        this.add.text(w / 2, 70, `${gameDef.icon} ${gameDef.name}`, {
            fontSize: '38px', fontFamily: 'Comic Sans MS, Arial', fontStyle: 'bold',
            color: '#FFD700', stroke: '#000', strokeThickness: 3,
        }).setOrigin(0.5);
        this.add.text(w / 2, 112, gameDef.educationalGoal, {
            fontSize: '17px', fontFamily: 'Comic Sans MS, Arial', color: '#fff',
            stroke: '#000', strokeThickness: 2,
        }).setOrigin(0.5);

        // Level cards
        const cardW = Math.min(300, w * 0.26);
        const cardH = Math.min(340, h * 0.52);
        const gap = 30;
        const totalW = 3 * cardW + 2 * gap;
        const y = h / 2 + 20;

        for (let level = 1; level <= 3; level++) {
            const x = w / 2 - totalW / 2 + cardW / 2 + (level - 1) * (cardW + gap);
            this.createLevelCard(x, y, cardW, cardH, gameDef, gp, level, profile);
        }

        // Top-left = BACK to the world map (previous screen)
        UISystem.navButton(this, 60, 50, DesignTokens.icons.back, () => {
            AudioEngine.emit('Transition');
            this.scene.start('MenuScreen');
        }).setDepth(10);
    }

    createLevelCard(x, y, cw, ch, gameDef, gp, level, profile) {
        const cfg = gameDef.levels[level];
        const lp = gp.levels[level];
        const unlocked = true; // no access locking — Discover → Tap → Play

        const c = this.add.container(x, y);
        const bg = this.add.graphics();
        bg.fillStyle(unlocked ? 0xfff8dc : 0x9e9e9e, unlocked ? 1 : 0.85);
        bg.fillRoundedRect(-cw / 2, -ch / 2, cw, ch, 22);
        bg.lineStyle(4, unlocked ? 0xffd700 : 0x757575, 1);
        bg.strokeRoundedRect(-cw / 2, -ch / 2, cw, ch, 22);
        c.add(bg);

        c.add(this.add.text(0, -ch / 2 + 34, `Màn ${level}`, {
            fontSize: '26px', fontFamily: 'Comic Sans MS, Arial', fontStyle: 'bold',
            color: unlocked ? '#5c3a1e' : '#616161',
        }).setOrigin(0.5));

        c.add(this.add.text(0, -ch / 2 + 68, `${cfg.label.icon} ${cfg.label.rank}`, {
            fontSize: '18px', fontFamily: 'Comic Sans MS, Arial', fontStyle: 'bold',
            color: unlocked ? '#8e24aa' : '#616161',
        }).setOrigin(0.5));

        c.add(this.add.text(0, -ch / 2 + 104, cfg.title, {
            fontSize: '17px', fontFamily: 'Comic Sans MS, Arial', color: unlocked ? '#4e342e' : '#757575',
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
            AudioEngine.emit('Transition');
            this.scene.start(gameDef.sceneKey, { gameId: this.gameId, level });
        };
        const playBtn = UISystem.primaryButton(this, 0, ch / 2 - 43, '▶ Chơi', startLevel, { width: 140, height: 46 });
        c.add(playBtn);

        setCenteredInput(c, cw, ch);
        c.on('pointerover', () => c.setScale(1.04));
        c.on('pointerout', () => c.setScale(1));
        c.on('pointerdown', startLevel);
        c.setScale(0);
        this.tweens.add({ targets: c, scale: 1, duration: 300, delay: level * 120, ease: 'Back.easeOut' });
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { LevelSelectScreen };
}
