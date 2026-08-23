/**
 * ResultScreen — award screen shown after every session.
 * The child must see what they earned: stars, awards, NEW STICKERS, and a
 * spoken line ("Sticker mới: …"). Rewards are visible immediately.
 */
class ResultScreen extends Phaser.Scene {
    constructor() {
        super({ key: 'ResultScreen' });
    }

    init(data) {
        this.rewards = data.rewards || {};
        this.gameId = data.gameId;
        this.level = data.level;
    }

    create() {
        const r = this.normalize(this.rewards);
        this.rewards = r;
        const w = this.cameras.main.width;
        const h = this.cameras.main.height;

        try {
            AudioEngine.attachScene(this);
            const areaAudio = AudioConfig.AREA_AUDIO.result;
            if (areaAudio) MusicEngine.playTheme(this, areaAudio.theme.key, areaAudio.theme.url, { volume: areaAudio.theme.volume });
        } catch (e) { console.warn('Result audio', e); }

        this.add.graphics().fillStyle(0x1a0f2e, 0.78).fillRect(0, 0, w, h);

        NavSystem.mount(this, {
            onBack: () => this.go('levels'),
            onHome: () => this.go('map'),
            depth: 950,
        });

        const pw = Math.min(640, w * 0.9);
        const ph = Math.min(640, h * 0.92);
        UISystem.panel(this, w / 2, h / 2, pw, ph, { borderWidth: 5 });

        const cx = w / 2;
        let y = h / 2 - ph / 2 + 42;

        this.add.text(cx, y, r.stars >= 3 ? '🎉  TUYỆT VỜI!' : '🎉  GIỎI LẮM!', {
            fontSize: '32px', fontFamily: DesignTokens.typography.fontFamily, fontStyle: 'bold',
            color: '#e65100',
        }).setOrigin(0.5);
        y += 40;

        this.add.text(cx, y, `Đúng ${r.metrics.correctAnswers}/${r.levelCfg.rounds} câu   ·   Điểm ${r.score}`, {
            fontSize: '18px', fontFamily: DesignTokens.typography.fontFamily, fontStyle: 'bold',
            color: DesignTokens.css.ink,
        }).setOrigin(0.5);
        y += 36;

        const starRow = this.add.container(cx, y);
        for (let i = 0; i < 3; i++) {
            const s = this.add.text((i - 1) * 58, 0, i < r.stars ? '⭐' : '☆', { fontSize: '46px' }).setOrigin(0.5);
            starRow.add(s);
            if (i < r.stars) this.time.delayedCall(80 * i, () => AudioEngine.emit('StarEarned', { index: i }));
        }
        y += 48;

        this.add.text(cx, y, `+${r.xp} XP    💎 +${r.gems} Đá Tri Thức`, {
            fontSize: '18px', fontFamily: DesignTokens.typography.fontFamily, fontStyle: 'bold',
            color: DesignTokens.css.ink,
        }).setOrigin(0.5);
        y += 34;

        // ── Award stage (always visible) ──
        this.add.text(cx, y, 'Phần thưởng của bạn', {
            fontSize: '20px', fontFamily: DesignTokens.typography.fontFamily, fontStyle: 'bold',
            color: DesignTokens.css.primary,
        }).setOrigin(0.5);
        y += 28;

        const cards = [];
        r.stickers.forEach((s) => cards.push({ kind: 'sticker', icon: s.icon, name: s.name, tag: 'Sticker mới' }));
        r.awards.forEach((a) => cards.push({ kind: 'award', icon: a.icon, name: a.name, tag: 'Huy hiệu mới' }));

        if (!cards.length) {
            const nxt = StickerEngine.nextHint(SaveEngine.load(), this.gameId);
            cards.push({
                kind: 'hint',
                icon: nxt ? nxt.icon : '⭐',
                name: nxt ? nxt.name : 'Sao vàng',
                tag: nxt ? `Chơi tiếp để mở` : 'Phần thưởng',
            });
        }

        const shown = cards.slice(0, 4);
        const cardW = Math.min(168, (pw - 48) / shown.length - 10);
        const cardH = 168;
        const gap = 16;
        const total = shown.length * cardW + (shown.length - 1) * gap;
        shown.forEach((item, i) => {
            const x = cx - total / 2 + cardW / 2 + i * (cardW + gap);
            this.rewardCard(x, y + cardH / 2, cardW, cardH, item);
        });
        y += cardH + 36;

        const speech = this.announceLine(r);
        const bubble = UISystem.speechBubble(this, cx, y + 8, speech, {
            maxWidth: pw - 80, fontSize: 18,
        });
        try { VoiceEngine.speakRaw(speech); } catch (e) { /* ignore */ }
        if (r.stickers.length) AudioEngine.emit('StickerUnlocked', { rarity: r.stickers[0].rarity });
        else if (r.awards.length) AudioEngine.emit('AwardUnlocked');

        const btnY = h / 2 + ph / 2 - 44;
        const profile = SaveEngine.load();
        const hasNext = this.level < 3 && ProgressionEngine.isLevelUnlocked(profile, this.gameId, this.level + 1);
        const buttons = [
            { label: 'Chơi lại', color: 0x42a5f5, cb: () => this.go('replay') },
        ];
        if (hasNext) buttons.push({ label: `Màn ${this.level + 1}`, color: 0x2bb673, cb: () => this.go('next') });
        buttons.push({ label: 'Chọn màn', color: DesignTokens.colors.primary, cb: () => this.go('levels') });

        const bw = 150;
        const bgap = 14;
        const tw = buttons.length * bw + (buttons.length - 1) * bgap;
        buttons.forEach((b, i) => {
            const bx = cx - tw / 2 + bw / 2 + i * (bw + bgap);
            UISystem.primaryButton(this, bx, btnY, b.label, b.cb, { width: bw, height: 50, color: b.color, fontSize: 18 });
        });

        void bubble;
    }

    normalize(raw) {
        const r = raw || {};
        const levelCfg = r.levelCfg || GameConfig.getLevel(this.gameId, this.level) || { rounds: 1 };
        return {
            stars: r.stars || 0,
            score: r.score || 0,
            xp: r.xp || 0,
            gems: r.gems || 0,
            awards: Array.isArray(r.awards) ? r.awards : [],
            stickers: Array.isArray(r.stickers) ? r.stickers : [],
            metrics: r.metrics || { correctAnswers: 0 },
            levelCfg,
            knowledgeLevel: r.knowledgeLevel || { level: 1, intoLevel: 0, needed: 100 },
            leveledUp: !!r.leveledUp,
            worldProgress: r.worldProgress || { percent: 0, stars: 0, maxStars: 54 },
        };
    }

    announceLine(r) {
        const bits = [];
        if (r.stickers.length) {
            bits.push(`Sticker mới: ${r.stickers.map((s) => s.name).join(', ')}`);
        }
        if (r.awards.length) {
            bits.push(`Huy hiệu mới: ${r.awards.map((a) => a.name).join(', ')}`);
        }
        if (bits.length) return bits.join('. ') + '!';
        return 'Giỏi lắm! Phần thưởng đã vào album của bạn!';
    }

    rewardCard(x, y, cw, ch, item) {
        const c = this.add.container(x, y);
        const g = this.add.graphics();
        g.fillStyle(DesignTokens.shadow.color, 0.18);
        g.fillRoundedRect(-cw / 2, -ch / 2 + 5, cw, ch, 18);
        g.fillStyle(DesignTokens.colors.surface, 1);
        g.fillRoundedRect(-cw / 2, -ch / 2, cw, ch, 18);
        g.lineStyle(4, item.kind === 'sticker' ? 0xe65100 : DesignTokens.colors.accent, 1);
        g.strokeRoundedRect(-cw / 2, -ch / 2, cw, ch, 18);
        c.add(g);
        c.add(this.add.text(0, -ch / 2 + 22, item.tag, {
            fontSize: '14px', fontFamily: DesignTokens.typography.fontFamily, fontStyle: 'bold',
            color: item.kind === 'sticker' ? '#e65100' : DesignTokens.css.primary,
        }).setOrigin(0.5));
        c.add(this.add.text(0, 4, item.icon || '🎁', { fontSize: '52px' }).setOrigin(0.5));
        c.add(this.add.text(0, ch / 2 - 28, item.name, {
            fontSize: '15px', fontFamily: DesignTokens.typography.fontFamily, fontStyle: 'bold',
            color: DesignTokens.css.ink, align: 'center', wordWrap: { width: cw - 16 },
        }).setOrigin(0.5));
        c.setScale(0.86);
        this.tweens.add({ targets: c, scale: 1, duration: 320, ease: 'Back.easeOut' });
        return c;
    }

    go(action) {
        const gameDef = GameConfig.get(this.gameId);
        const sceneKey = gameDef ? gameDef.sceneKey : null;
        if (sceneKey) this.scene.stop(sceneKey);
        if (action === 'replay' && sceneKey) {
            NavSystem.go(this, sceneKey, { gameId: this.gameId, level: this.level });
        } else if (action === 'next' && sceneKey) {
            NavSystem.go(this, sceneKey, { gameId: this.gameId, level: this.level + 1 });
        } else if (action === 'levels') {
            NavSystem.backToLevels(this, this.gameId);
        } else {
            NavSystem.home(this);
        }
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ResultScreen };
}
