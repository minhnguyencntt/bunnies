/**
 * StickerAlbumScreen.js — "Album Sticker Của Tớ".
 * Every game's collection: owned stickers in full color, locked stickers
 * show how to earn them. Part of long-term world progression.
 */
class StickerAlbumScreen extends Phaser.Scene {
    constructor() {
        super({ key: 'StickerAlbumScreen' });
    }

    create() {
        const w = this.cameras.main.width;
        const h = this.cameras.main.height;
        const profile = SaveEngine.load();
        const albums = StickerEngine.albumData(profile);
        const totals = StickerEngine.totals(profile);

        if (this.textures.exists('menu_bg')) {
            this.add.image(w / 2, h / 2, 'menu_bg').setDisplaySize(w, h).setAlpha(0.3);
        } else {
            this.cameras.main.setBackgroundColor(0x2b1a4a);
        }
        this.add.graphics().fillStyle(0x1a0f2e, 0.6).fillRect(0, 0, w, h);

        this.add.text(w / 2, 46, '🎟 Album Sticker Của Tớ', {
            fontSize: '34px', fontFamily: 'Comic Sans MS, Arial', fontStyle: 'bold',
            color: '#FFD700', stroke: '#000', strokeThickness: 3,
        }).setOrigin(0.5);
        this.add.text(w / 2, 84, `Đã sưu tầm: ${totals.owned}/${totals.total} sticker`, {
            fontSize: '18px', fontFamily: 'Comic Sans MS, Arial', fontStyle: 'bold', color: '#fff',
            stroke: '#000', strokeThickness: 2,
        }).setOrigin(0.5);

        const rowH = (h - 150) / albums.length;
        albums.forEach((album, gi) => {
            const y = 130 + rowH * gi + rowH / 2;
            this.createAlbumRow(w, y, rowH, album);
        });

        // Back
        const back = this.add.container(56, 46).setDepth(10);
        const bg = this.add.graphics();
        bg.fillStyle(0x4a90e2, 1);
        bg.fillCircle(0, 0, 26);
        bg.lineStyle(3, 0xffffff, 0.8);
        bg.strokeCircle(0, 0, 26);
        back.add(bg);
        back.add(this.add.text(0, 0, '🗺', { fontSize: '22px' }).setOrigin(0.5));
        back.setSize(56, 56);
        back.setInteractive({ useHandCursor: true });
        back.on('pointerdown', () => { this.sound.stopAll(); this.scene.start('MenuScreen'); });
        back.on('pointerover', () => back.setScale(1.12));
        back.on('pointerout', () => back.setScale(1));

        // Hint bubble (created on demand)
        this.hintBubble = null;
    }

    createAlbumRow(w, y, rowH, album) {
        const leftX = 30;
        this.add.text(leftX, y - 14, `${album.icon} ${album.gameName}`, {
            fontSize: '19px', fontFamily: 'Comic Sans MS, Arial', fontStyle: 'bold',
            color: '#FFD700', stroke: '#000', strokeThickness: 2,
        }).setOrigin(0, 0.5);
        this.add.text(leftX, y + 12, album.world.name, {
            fontSize: '13px', fontFamily: 'Comic Sans MS, Arial', color: '#ce93d8',
        }).setOrigin(0, 0.5);

        const slotSize = Math.min(64, rowH * 0.52);
        const gap = 14;
        const gridX = leftX + 230;
        album.stickers.forEach((s, i) => {
            const x = gridX + i * (slotSize + gap) + slotSize / 2;
            this.createStickerSlot(x, y, slotSize, s);
        });
    }

    createStickerSlot(x, y, size, sticker) {
        const c = this.add.container(x, y);
        const rs = sticker.rarityStyle;
        const bg = this.add.graphics();
        bg.fillStyle(sticker.owned ? 0xfff8dc : 0x37474f, sticker.owned ? 1 : 0.9);
        bg.fillRoundedRect(-size / 2, -size / 2, size, size, 12);
        bg.lineStyle(3, sticker.owned ? rs.glow : 0x546e7a, 1);
        bg.strokeRoundedRect(-size / 2, -size / 2, size, size, 12);
        c.add(bg);

        c.add(this.add.text(0, -6, sticker.owned ? sticker.icon : '🔒', {
            fontSize: `${Math.round(size * 0.42)}px`,
        }).setOrigin(0.5));
        c.add(this.add.text(0, size / 2 - 10, sticker.owned ? sticker.name : '???', {
            fontSize: '10px', fontFamily: 'Comic Sans MS, Arial', fontStyle: 'bold',
            color: sticker.owned ? rs.color : '#90a4ae',
        }).setOrigin(0.5));

        c.setSize(size, size);
        c.setInteractive({ useHandCursor: true });
        c.on('pointerdown', () => this.showStickerInfo(x, y, sticker));
        if (sticker.owned) {
            this.tweens.add({ targets: c, scale: 1.06, duration: 1200, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
        }
    }

    showStickerInfo(x, y, sticker) {
        if (this.hintBubble) { this.hintBubble.destroy(true); this.hintBubble = null; }
        const w = this.cameras.main.width;
        const text = sticker.owned
            ? `${sticker.icon} ${sticker.name} — ${sticker.rarityStyle.label}\nĐã sưu tầm!`
            : `🔒 ${sticker.name}\nCách mở: ${sticker.hint}`;
        const bx = Phaser.Math.Clamp(x, 180, w - 180);
        const by = y - 84;
        const c = this.add.container(bx, by).setDepth(900);
        const t = this.add.text(0, 0, text, {
            fontSize: '16px', fontFamily: 'Comic Sans MS, Arial', fontStyle: 'bold',
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
