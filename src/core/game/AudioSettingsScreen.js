/**
 * AudioSettingsScreen.js — simple, child-friendly audio settings.
 * Master / Music / SFX / Voice / Ambient sliders + Sound & Music toggles.
 * Persisted in the profile via AudioEngine. Launched as an overlay.
 */
class AudioSettingsScreen extends Phaser.Scene {
    constructor() {
        super({ key: 'AudioSettingsScreen' });
    }

    create() {
        const w = this.cameras.main.width;
        const h = this.cameras.main.height;
        AudioEngine.attachScene(this);
        AudioEngine.loadSettings();

        this.add.graphics().fillStyle(0x1a0f2e, 0.75).fillRect(0, 0, w, h);

        const pw = Math.min(520, w * 0.85);
        const ph = Math.min(560, h * 0.88);
        const px = w / 2 - pw / 2;
        const py = h / 2 - ph / 2;

        const panel = this.add.graphics();
        panel.fillStyle(0xfff8dc, 1);
        panel.fillRoundedRect(px, py, pw, ph, 24);
        panel.lineStyle(5, 0xffd700, 1);
        panel.strokeRoundedRect(px, py, pw, ph, 24);

        this.add.text(w / 2, py + 42, '🔊 Cài Đặt Âm Thanh', {
            fontSize: '28px', fontFamily: 'Comic Sans MS, Arial', fontStyle: 'bold', color: '#5c3a1e',
        }).setOrigin(0.5);

        const s = AudioEngine.settings;
        const rows = [
            ['🎚 Âm lượng chung', 'master'],
            ['🎵 Nhạc nền', 'music'],
            ['✨ Hiệu ứng', 'sfx'],
            ['🗣 Giọng nói', 'voice'],
            ['🍃 Âm thanh môi trường', 'ambient'],
        ];
        rows.forEach(([label, channel], i) => {
            this.createSlider(w / 2, py + 100 + i * 62, pw * 0.72, label, channel, s[channel]);
        });

        // Toggles
        const ty = py + 100 + rows.length * 62 + 20;
        this.createToggle(w / 2 - 110, ty, '🔊 Âm thanh', s.soundEnabled, () => AudioEngine.toggleSound());
        this.createToggle(w / 2 + 110, ty, '🎵 Nhạc', s.musicEnabled, () => AudioEngine.toggleMusic());

        // Close
        const btnY = py + ph - 40;
        UISystem.primaryButton(this, w / 2, btnY, '✔ Xong', () => this.scene.stop(), { width: 180, height: 48 });
    }

    createSlider(cx, y, width, label, channel, value) {
        this.add.text(cx - width / 2, y - 16, label, {
            fontSize: '16px', fontFamily: 'Comic Sans MS, Arial', fontStyle: 'bold', color: '#5c3a1e',
        }).setOrigin(0, 0.5);

        const track = this.add.graphics();
        track.fillStyle(0x000000, 0.15);
        track.fillRoundedRect(cx - width / 2, y + 6, width, 10, 5);

        const fill = this.add.graphics();
        const handle = this.add.circle(cx - width / 2 + width * value, y + 11, 14, 0xffd700)
            .setStrokeStyle(3, 0xffffff);

        const drawFill = (v) => {
            fill.clear();
            fill.fillStyle(0x8bc34a, 1);
            fill.fillRoundedRect(cx - width / 2, y + 6, Math.max(12, width * v), 10, 5);
        };
        drawFill(value);

        const zone = this.add.zone(cx, y + 11, width + 30, 40).setInteractive({ useHandCursor: true });
        const setFromPointer = (p) => {
            const v = Phaser.Math.Clamp((p.x - (cx - width / 2)) / width, 0, 1);
            handle.x = cx - width / 2 + width * v;
            drawFill(v);
            AudioEngine.setVolume(channel, Math.round(v * 100) / 100);
        };
        zone.on('pointerdown', (p) => { AudioEngine.emit('UITap'); setFromPointer(p); });
        zone.on('pointermove', (p) => { if (p.isDown) setFromPointer(p); });
    }

    createToggle(x, y, label, initial, onToggle) {
        let on = initial;
        const bg = this.add.graphics();
        const draw = () => {
            bg.clear();
            bg.fillStyle(on ? 0x66bb6a : 0x9e9e9e, 1);
            bg.fillRoundedRect(x - 95, y - 24, 190, 48, 24);
            bg.lineStyle(3, 0xffffff, 0.9);
            bg.strokeRoundedRect(x - 95, y - 24, 190, 48, 24);
        };
        draw();
        const text = this.add.text(x, y, `${label}: ${on ? 'Bật' : 'Tắt'}`, {
            fontSize: '18px', fontFamily: 'Comic Sans MS, Arial', fontStyle: 'bold', color: '#fff',
        }).setOrigin(0.5);
        this.add.zone(x, y, 190, 48).setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                on = onToggle();
                text.setText(`${label}: ${on ? 'Bật' : 'Tắt'}`);
                draw();
                AudioEngine.emit('UITap');
                AudioEngine.track(on ? 'unmuted' : 'muted');
            });
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AudioSettingsScreen };
}
