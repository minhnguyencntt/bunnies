/**
 * ResultScreen.js — celebration & reward overlay shown after every session.
 * Priority order: Celebration → Score → Stars → Rewards → Progress → Next action.
 * Launched on top of the paused game scene by GameShell.finishSession().
 */
class ResultScreen extends Phaser.Scene {
    constructor() {
        super({ key: 'ResultScreen' });
    }

    init(data) {
        this.rewards = data.rewards;
        this.gameId = data.gameId;
        this.level = data.level;
    }

    create() {
        const r = this.rewards;
        const w = this.cameras.main.width;
        const h = this.cameras.main.height;

        AudioEngine.attachScene(this);
        const areaAudio = AudioConfig.AREA_AUDIO.result;
        MusicEngine.playTheme(this, areaAudio.theme.key, areaAudio.theme.url, { volume: areaAudio.theme.volume });

        this.add.graphics().fillStyle(0x1a0f2e, 0.72).fillRect(0, 0, w, h);

        const pw = Math.min(560, w * 0.82);
        const ph = Math.min(600, h * 0.9);
        const px = w / 2 - pw / 2;
        const py = h / 2 - ph / 2;

        const panel = this.add.graphics();
        panel.fillStyle(0xfff8dc, 1);
        panel.fillRoundedRect(px, py, pw, ph, 26);
        panel.lineStyle(5, 0xffd700, 1);
        panel.strokeRoundedRect(px, py, pw, ph, 26);
        panel.setScale(0.9).setAlpha(0);
        this.tweens.add({ targets: panel, scale: 1, alpha: 1, duration: 350, ease: 'Back.easeOut' });

        let y = py + 46;
        const center = w / 2;
        const steps = [];

        // 1. Celebration
        const title = this.add.text(center, y, r.stars >= 3 ? '🎉 TUYỆT VỜI!' : '🎉 GIỎI LẮM!', {
            fontSize: '36px', fontFamily: 'Comic Sans MS, Arial', fontStyle: 'bold',
            color: '#e65100', stroke: '#ffd700', strokeThickness: 2,
        }).setOrigin(0.5).setScale(0);
        steps.push(() => this.tweens.add({ targets: title, scale: 1, duration: 400, ease: 'Back.easeOut' }));
        y += 52;

        // Solved count (child-friendly "how many did I get")
        const solved = this.add.text(center, y, `✅ Đúng ${r.metrics.correctAnswers}/${r.levelCfg.rounds} câu`, {
            fontSize: '18px', fontFamily: 'Comic Sans MS, Arial', fontStyle: 'bold', color: '#33691e',
        }).setOrigin(0.5).setAlpha(0);
        steps.push(() => this.tweens.add({ targets: solved, alpha: 1, duration: 250 }));
        y += 30;

        // 2. Score count-up
        const scoreText = this.add.text(center, y, 'Điểm: 0', {
            fontSize: '30px', fontFamily: 'Comic Sans MS, Arial', fontStyle: 'bold', color: '#5c3a1e',
        }).setOrigin(0.5).setAlpha(0);
        steps.push(() => {
            scoreText.setAlpha(1);
            let lastTick = 0;
            this.tweens.addCounter({
                from: 0, to: r.score, duration: 900,
                onUpdate: (tw) => {
                    scoreText.setText(`Điểm: ${Math.round(tw.getValue())}`);
                    const now = Date.now();
                    if (now - lastTick > 90) { lastTick = now; AudioEngine.emit('ScoreTick'); }
                },
            });
        });
        y += 40;

        if (r.isNewBest) {
            const best = this.add.text(center, y, '🏅 Kỷ lục mới!', {
                fontSize: '18px', fontFamily: 'Comic Sans MS, Arial', fontStyle: 'bold', color: '#c62828',
            }).setOrigin(0.5).setAlpha(0);
            steps.push(() => this.tweens.add({ targets: best, alpha: 1, duration: 250 }));
            y += 28;
        }

        // 3. Stars
        const starRow = this.add.container(center, y + 8);
        const starObjs = [];
        for (let i = 0; i < 3; i++) {
            const s = this.add.text((i - 1) * 64, 0, i < r.stars ? '⭐' : '☆', {
                fontSize: '52px',
            }).setOrigin(0.5).setScale(0);
            starObjs.push(s);
            starRow.add(s);
        }
        steps.push(() => {
            starObjs.forEach((s, i) => {
                this.time.delayedCall(i * 280, () => {
                    this.tweens.add({ targets: s, scale: 1, duration: 350, ease: 'Back.easeOut' });
                    if (i < r.stars) {
                        this.spawnStarBurst(center + (i - 1) * 64, y + 8);
                        AudioEngine.emit('StarEarned', { index: i }); // synced with each star pop
                        if (i === 2) this.time.delayedCall(300, () => AudioEngine.emit('ThreeStars'));
                    }
                });
            });
        });
        y += 78;

        // 4. XP bar + gems
        const kl = r.knowledgeLevel;
        const barW = pw * 0.7;
        const xpLabel = this.add.text(center, y, `+${r.xp} XP · Cấp ${kl.level}`, {
            fontSize: '20px', fontFamily: 'Comic Sans MS, Arial', fontStyle: 'bold', color: '#33691e',
        }).setOrigin(0.5).setAlpha(0);
        const barBg = this.add.graphics();
        barBg.fillStyle(0x000000, 0.15);
        barBg.fillRoundedRect(center - barW / 2, y + 16, barW, 16, 8);
        const barFill = this.add.graphics();
        steps.push(() => {
            xpLabel.setAlpha(1);
            AudioEngine.emit('XPGranted');
            const ratio = Phaser.Math.Clamp(kl.intoLevel / kl.needed, 0, 1);
            this.tweens.addCounter({
                from: 0, to: ratio, duration: 800,
                onUpdate: (tw) => {
                    barFill.clear();
                    barFill.fillGradientStyle(0x8bc34a, 0x8bc34a, 0x558b2f, 0x558b2f, 1);
                    barFill.fillRoundedRect(center - barW / 2, y + 16, Math.max(10, barW * tw.getValue()), 16, 8);
                },
            });
        });
        y += 46;

        if (r.leveledUp) {
            const lu = this.add.text(center, y, `🆙 Lên cấp ${kl.level}!`, {
                fontSize: '20px', fontFamily: 'Comic Sans MS, Arial', fontStyle: 'bold', color: '#6a1b9a',
            }).setOrigin(0.5).setAlpha(0);
            steps.push(() => {
                lu.setScale(0.6);
                this.tweens.add({ targets: lu, alpha: 1, scale: 1, duration: 350, ease: 'Back.easeOut' });
                AudioEngine.emit('LevelUp');
            });
            y += 30;
        }

        const gems = this.add.text(center, y, `💎 +${r.gems} Đá Tri Thức`, {
            fontSize: '20px', fontFamily: 'Comic Sans MS, Arial', fontStyle: 'bold', color: '#0277bd',
        }).setOrigin(0.5).setAlpha(0);
        steps.push(() => this.tweens.add({ targets: gems, alpha: 1, duration: 250 }));
        y += 36;

        // 5. Awards
        if (r.awards.length) {
            const a = r.awards[0];
            const awardText = this.add.text(center, y, `🏆 Huy hiệu mới: ${a.icon} ${a.name}`, {
                fontSize: '19px', fontFamily: 'Comic Sans MS, Arial', fontStyle: 'bold', color: '#8e24aa',
            }).setOrigin(0.5).setScale(0);
            steps.push(() => {
                this.tweens.add({ targets: awardText, scale: 1, duration: 350, ease: 'Back.easeOut' });
                AudioEngine.emit('AwardUnlocked');
            });
            y += 32;
            if (r.awards.length > 1) {
                const more = this.add.text(center, y, `+${r.awards.length - 1} huy hiệu nữa!`, {
                    fontSize: '15px', fontFamily: 'Comic Sans MS, Arial', color: '#8e24aa',
                }).setOrigin(0.5).setAlpha(0);
                steps.push(() => this.tweens.add({ targets: more, alpha: 1, duration: 250 }));
                y += 24;
            }
        }

        // 6. Stickers
        if (r.stickers.length) {
            const row = this.add.container(center, y + 6);
            const label = this.add.text(0, -22, '🎟 Sticker mới!', {
                fontSize: '17px', fontFamily: 'Comic Sans MS, Arial', fontStyle: 'bold', color: '#e65100',
            }).setOrigin(0.5);
            row.add(label);
            r.stickers.slice(0, 4).forEach((s, i) => {
                const t = this.add.text((i - (Math.min(r.stickers.length, 4) - 1) / 2) * 56, 14, s.icon, {
                    fontSize: '38px',
                }).setOrigin(0.5).setScale(0);
                row.add(t);
                steps.push(() => this.time.delayedCall(120 * i, () => {
                    this.tweens.add({ targets: t, scale: 1, duration: 350, ease: 'Back.easeOut' });
                    AudioEngine.emit('StickerUnlocked', { rarity: s.rarity });
                }));
            });
            y += 62;
        }

        // 7. World progress
        const wp = r.worldProgress;
        const prog = this.add.text(center, y, `🗺 Thế Giới Tri Thức: ${wp.percent}% · ⭐ ${wp.stars}/${wp.maxStars}`, {
            fontSize: '16px', fontFamily: 'Comic Sans MS, Arial', fontStyle: 'bold', color: '#4e342e',
        }).setOrigin(0.5).setAlpha(0);
        steps.push(() => this.tweens.add({ targets: prog, alpha: 1, duration: 250 }));

        // 8. Buttons
        const btnY = py + ph - 46;
        const profile = SaveEngine.load();
        const hasNext = this.level < 3 && ProgressionEngine.isLevelUnlocked(profile, this.gameId, this.level + 1);
        const buttons = [
            { label: '🔄 Chơi lại', color: 0x42a5f5, cb: () => this.go('replay') },
        ];
        if (hasNext) buttons.push({ label: `▶ Màn ${this.level + 1}`, color: 0x66bb6a, cb: () => this.go('next') });
        buttons.push({ label: '🗺 Bản đồ', color: 0xab47bc, cb: () => this.go('map') });

        const bw = 150;
        const gap = 18;
        const totalW = buttons.length * bw + (buttons.length - 1) * gap;
        buttons.forEach((b, i) => {
            const bx = w / 2 - totalW / 2 + bw / 2 + i * (bw + gap);
            const bg = this.add.graphics();
            bg.fillStyle(b.color, 1);
            bg.fillRoundedRect(bx - bw / 2, btnY - 26, bw, 52, 26);
            bg.lineStyle(3, 0xffffff, 0.9);
            bg.strokeRoundedRect(bx - bw / 2, btnY - 26, bw, 52, 26);
            this.add.text(bx, btnY, b.label, {
                fontSize: '19px', fontFamily: 'Comic Sans MS, Arial', fontStyle: 'bold', color: '#fff',
                stroke: '#00000055', strokeThickness: 2,
            }).setOrigin(0.5);
            this.add.zone(bx, btnY, bw, 52).setInteractive({ useHandCursor: true })
                .on('pointerdown', b.cb);
        });

        // Play the reveal sequence (snappy: ~220ms per beat)
        steps.forEach((fn, i) => this.time.delayedCall(300 + i * 220, fn));
    }

    spawnStarBurst(x, y) {
        for (let i = 0; i < 8; i++) {
            const s = this.add.text(x, y, '✨', { fontSize: '16px' }).setOrigin(0.5);
            const a = Phaser.Math.DegToRad(i * 45);
            this.tweens.add({
                targets: s, x: x + Math.cos(a) * 46, y: y + Math.sin(a) * 46,
                alpha: 0, duration: 500, onComplete: () => s.destroy(),
            });
        }
    }

    go(action) {
        const gameDef = GameConfig.get(this.gameId);
        const sceneKey = gameDef.sceneKey;
        AudioEngine.emit('Transition');
        MusicEngine.stopTheme(250);
        this.sound.stopAll();
        this.scene.stop();
        this.scene.stop(sceneKey);
        if (action === 'replay') {
            this.scene.start(sceneKey, { gameId: this.gameId, level: this.level });
        } else if (action === 'next') {
            this.scene.start(sceneKey, { gameId: this.gameId, level: this.level + 1 });
        } else {
            this.scene.start('MenuScreen');
        }
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ResultScreen };
}
