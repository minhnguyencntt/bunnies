/**
 * StickerAlbumScreen.js — "Album Sticker Của Tớ".
 * Renders the same Award objects that ResultScreen presents after a level.
 */
class StickerAlbumScreen extends Phaser.Scene {
    constructor() {
        super({ key: 'StickerAlbumScreen' });
    }

    create() {
        NavSystem.ready(this);
        const w = this.cameras.main.width;
        const h = this.cameras.main.height;
        const profile = SaveEngine.load();
        const albums = StickerEngine.albumData(profile);
        const totals = StickerEngine.totals(profile);

        AudioEngine.attachScene(this);
        AudioEngine.loadSettings();
        AudioEvents.register();
        const albumAudio = AudioConfig.AREA_AUDIO.album;
        MusicEngine.playTheme(this, albumAudio.theme.key, albumAudio.theme.url, { volume: albumAudio.theme.volume });

        if (this.textures.exists('menu_bg')) {
            this.add.image(w / 2, h / 2, 'menu_bg').setDisplaySize(w, h).setAlpha(0.3);
        } else {
            this.cameras.main.setBackgroundColor(0x2b1a4a);
        }
        this.add.graphics().fillStyle(0x1a0f2e, 0.6).fillRect(0, 0, w, h);

        this.add.text(w / 2, 46, '🎟 Album Sticker Của Tớ', {
            fontSize: '34px', fontFamily: DesignTokens.typography.fontFamily, fontStyle: 'bold',
            color: '#FFD700', stroke: '#000', strokeThickness: 3,
        }).setOrigin(0.5);
        this.add.text(w / 2, 84, `Đã sưu tầm: ${totals.owned}/${totals.total} sticker`, {
            fontSize: '18px', fontFamily: DesignTokens.typography.fontFamily, fontStyle: 'bold', color: '#fff',
            stroke: '#000', strokeThickness: 2,
        }).setOrigin(0.5);

        const rowH = (h - 150) / albums.length;
        albums.forEach((album, gi) => {
            const y = 130 + rowH * gi + rowH / 2;
            this.createAlbumRow(w, y, rowH, album);
        });

        NavSystem.mount(this, {
            onBack: () => NavSystem.home(this),
            depth: 20,
        });

        this.hintBubble = null;
    }

    createAlbumRow(w, y, rowH, album) {
        const leftX = 30;
        this.add.text(leftX, y - 14, `${album.icon} ${album.gameName}`, {
            fontSize: '19px', fontFamily: DesignTokens.typography.fontFamily, fontStyle: 'bold',
            color: '#FFD700', stroke: '#000', strokeThickness: 2,
        }).setOrigin(0, 0.5);
        this.add.text(leftX, y + 12, album.world.name, {
            fontSize: '13px', fontFamily: DesignTokens.typography.fontFamily, color: '#ce93d8',
        }).setOrigin(0, 0.5);

        const slotSize = Math.min(64, rowH * 0.52);
        const gap = 14;
        const gridX = leftX + 230;
        album.stickers.forEach((award, i) => {
            const x = gridX + i * (slotSize + gap) + slotSize / 2;
            UISystem.awardCard(this, x, y, award, {
                size: 'album',
                slot: slotSize,
                reveal: false,
                onTap: () => {
                    AudioEngine.emit(award.owned ? 'UIPop' : 'Locked');
                    this.showAwardInfo(x, y, award);
                },
            });
        });
    }

    showAwardInfo(x, y, award) {
        if (this.hintBubble) { this.hintBubble.destroy(true); this.hintBubble = null; }
        const w = this.cameras.main.width;
        const glyph = (award.artwork && award.artwork.glyph) || award.icon;
        const text = award.owned
            ? `${glyph} ${award.name} — ${award.rarityStyle.label}\nĐã sưu tầm!`
            : `🔒 ${award.name}\nCách mở: ${award.hint}`;
        const bx = Phaser.Math.Clamp(x, 180, w - 180);
        const by = y - 84;
        const c = this.add.container(bx, by).setDepth(900);
        const t = this.add.text(0, 0, text, {
            fontSize: '16px', fontFamily: DesignTokens.typography.fontFamily, fontStyle: 'bold',
            color: '#4a3728', align: 'center', wordWrap: { width: 280 },
            backgroundColor: '#fff8e7', padding: { x: 14, y: 10 },
        }).setOrigin(0.5);
        c.add(t);
        c.setScale(0);
        this.tweens.add({ targets: c, scale: 1, duration: 250, ease: 'Back.easeOut' });
        this.hintBubble = c;
        this.time.delayedCall(2800, () => {
            if (!c.active) return;
            this.tweens.add({ targets: c, alpha: 0, duration: 250, onComplete: () => c.destroy(true) });
            if (this.hintBubble === c) this.hintBubble = null;
        });
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { StickerAlbumScreen };
}
