/**
 * ResultScreen — shared GameCompletionScreen.
 * Renders CompletionEngine result: achievement, score, visual rewards, next actions.
 * Buttons are available immediately. Speech / sparkles never gate input.
 */
class ResultScreen extends Phaser.Scene {
    constructor() {
        super({ key: 'ResultScreen' });
    }

    init(data) {
        this.gameId = data.gameId;
        this.level = data.level;
        this.completion = data.completion
            || CompletionEngine.fromRewards(data.rewards || {}, { persistOk: true });
    }

    create() {
        const r = this.completion;
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
            onHome: () => this.go('home'),
            depth: 950,
        });

        const pw = Math.min(700, w * 0.92);
        const ph = Math.min(660, h * 0.94);
        UISystem.panel(this, w / 2, h / 2, pw, ph, { borderWidth: 5 });

        const cx = w / 2;
        let y = h / 2 - ph / 2 + 36;

        const headline = r.starsEarned >= 3 ? 'TUYỆT VỜI!' : 'GIỎI LẮM!';
        this.add.text(cx, y, headline, {
            fontSize: '34px', fontFamily: DesignTokens.typography.fontFamily, fontStyle: 'bold',
            color: '#e65100',
        }).setOrigin(0.5);
        y += 36;

        this.add.text(cx, y, `Bạn đã hoàn thành ${r.gameName} · Màn ${r.level}`, {
            fontSize: '18px', fontFamily: DesignTokens.typography.fontFamily, fontStyle: 'bold',
            color: DesignTokens.css.ink,
        }).setOrigin(0.5);
        y += 28;

        this.add.text(cx, y, `Đúng ${r.correctAnswers}/${r.totalQuestions}   ·   Điểm ${r.score}`, {
            fontSize: '17px', fontFamily: DesignTokens.typography.fontFamily, fontStyle: 'bold',
            color: DesignTokens.css.inkSoft,
        }).setOrigin(0.5);
        y += 32;

        const starRow = this.add.container(cx, y);
        for (let i = 0; i < 3; i++) {
            const s = this.add.text((i - 1) * 58, 0, i < r.starsEarned ? '⭐' : '☆', { fontSize: '46px' }).setOrigin(0.5);
            starRow.add(s);
            if (i < r.starsEarned) this.time.delayedCall(80 * i, () => AudioEngine.emit('StarEarned', { index: i }));
        }
        y += 44;

        this.add.text(cx, y, `+${r.xpEarned} XP    ·    💎 +${r.coinsEarned} Đá Tri Thức`, {
            fontSize: '18px', fontFamily: DesignTokens.typography.fontFamily, fontStyle: 'bold',
            color: DesignTokens.css.ink,
        }).setOrigin(0.5);
        y += 30;

        if (!r.persistOk) {
            this.add.text(cx, y, 'Chưa lưu được phần thưởng.', {
                fontSize: '18px', fontFamily: DesignTokens.typography.fontFamily, fontStyle: 'bold',
                color: DesignTokens.css.error,
            }).setOrigin(0.5);
            y += 28;
        } else {
            this.add.text(cx, y, r.isNewReward ? 'Phần thưởng mới của bạn' : 'Phần thưởng của bạn', {
                fontSize: '18px', fontFamily: DesignTokens.typography.fontFamily, fontStyle: 'bold',
                color: DesignTokens.css.primary,
            }).setOrigin(0.5);
            y += 24;
        }

        const cards = (r.rewards || []).slice(0, 4);
        if (cards.length && r.persistOk) {
            const cardW = Math.min(150, (pw - 48) / cards.length - 10);
            const cardH = 150;
            const gap = 14;
            const total = cards.length * cardW + (cards.length - 1) * gap;
            cards.forEach((item, i) => {
                const x = cx - total / 2 + cardW / 2 + i * (cardW + gap);
                this.rewardCard(x, y + cardH / 2, cardW, cardH, item);
            });
            y += 150 + 20;
        } else if (!r.persistOk) {
            y += 8;
        } else {
            y += 8;
        }

        this.add.text(cx, y, 'Bạn muốn làm gì tiếp?', {
            fontSize: '18px', fontFamily: DesignTokens.typography.fontFamily, fontStyle: 'bold',
            color: DesignTokens.css.ink,
        }).setOrigin(0.5);
        y += 36;

        this.drawActions(cx, y, r);

        this.spawnBunny(w, h);
        this.announce(r);
        try { RewardPresentationEngine.celebrate(this, r); } catch (e) { /* ignore */ }
    }

    drawActions(cx, y, r) {
        const actions = r.availableNextActions || [];
        const primary = actions.find((a) => a.primary) || actions[0];
        const secondary = actions.filter((a) => a !== primary);
        if (primary) {
            UISystem.primaryButton(this, cx, y, primary.label, () => this.go(primary.id), {
                width: 280, height: 56, fontSize: 22, color: DesignTokens.colors.success,
            });
            y += 62;
        }
        if (secondary.length) {
            const bw = 148;
            const gap = 12;
            const tw = secondary.length * bw + (secondary.length - 1) * gap;
            secondary.forEach((a, i) => {
                const x = cx - tw / 2 + bw / 2 + i * (bw + gap);
                UISystem.secondaryButton(this, x, y, a.label, () => this.go(a.id), {
                    width: bw, height: 46, fontSize: 16,
                });
            });
        }
    }

    rewardCard(x, y, cw, ch, item) {
        const c = this.add.container(x, y);
        const g = this.add.graphics();
        g.fillStyle(DesignTokens.shadow.color, 0.18);
        g.fillRoundedRect(-cw / 2, -ch / 2 + 5, cw, ch, 18);
        g.fillStyle(DesignTokens.colors.surface, 1);
        g.fillRoundedRect(-cw / 2, -ch / 2, cw, ch, 18);
        g.lineStyle(4, item.isNew ? 0xe65100 : DesignTokens.colors.accent, 1);
        g.strokeRoundedRect(-cw / 2, -ch / 2, cw, ch, 18);
        c.add(g);

        const tag = item.teaser
            ? 'Chơi tiếp để mở'
            : (item.isNew
                ? (item.type === 'sticker' ? 'Sticker mới' : 'Huy hiệu mới')
                : RewardPresentationEngine.typeLabel(item.type));
        c.add(this.add.text(0, -ch / 2 + 18, tag, {
            fontSize: '13px', fontFamily: DesignTokens.typography.fontFamily, fontStyle: 'bold',
            color: item.isNew ? '#e65100' : DesignTokens.css.primary,
        }).setOrigin(0.5));

        const bunnyKey = this.textures.exists('spr_bunny_happy') ? 'spr_bunny_happy' : null;
        const isBunny = bunnyKey && (item.id && String(item.id).includes('bunny') || item.icon === '🐰');
        if (isBunny) {
            const img = this.add.image(0, 8, bunnyKey);
            const src = this.textures.get(bunnyKey).getSourceImage();
            img.setDisplaySize(64, 64 * (src.height / src.width));
            c.add(img);
        } else {
            c.add(this.add.text(0, 6, item.artwork || item.icon || '🎁', { fontSize: '46px' }).setOrigin(0.5));
        }

        c.add(this.add.text(0, ch / 2 - 34, item.name, {
            fontSize: '14px', fontFamily: DesignTokens.typography.fontFamily, fontStyle: 'bold',
            color: DesignTokens.css.ink, align: 'center', wordWrap: { width: cw - 12 },
        }).setOrigin(0.5));
        c.add(this.add.text(0, ch / 2 - 16, RewardPresentationEngine.typeLabel(item.type), {
            fontSize: '11px', fontFamily: DesignTokens.typography.fontFamily, fontStyle: 'bold',
            color: DesignTokens.css.inkSoft,
        }).setOrigin(0.5));

        c.setScale(0.88);
        this.tweens.add({ targets: c, scale: 1, duration: 280, ease: 'Back.easeOut' });
        return c;
    }

    spawnBunny(w, h) {
        const key = this.textures.exists('spr_bunny_hop')
            ? 'spr_bunny_hop'
            : (this.textures.exists('spr_bunny_happy') ? 'spr_bunny_happy' : null);
        if (!key) return;
        const b = this.add.image(86, h - 70, key).setDepth(40);
        const tex = this.textures.get(key).getSourceImage();
        b.setScale(88 / tex.height);
        this.tweens.add({
            targets: b, y: h - 92, duration: 220, yoyo: true, repeat: 3, ease: 'Power2',
        });
    }

    announce(r) {
        const bits = [];
        const fresh = (r.rewards || []).filter((x) => x.isNew && !x.teaser);
        const stickers = fresh.filter((x) => x.type === 'sticker');
        const badges = fresh.filter((x) => x.type === 'badge');
        if (stickers.length) bits.push(`Sticker mới: ${stickers.map((s) => s.name).join(', ')}`);
        if (badges.length) bits.push(`Huy hiệu mới: ${badges.map((a) => a.name).join(', ')}`);
        if (!r.persistOk) bits.push('Chưa lưu được phần thưởng');
        const speech = bits.length ? bits.join('. ') + '!' : `Bạn hoàn thành ${r.gameName}!`;
        try { VoiceEngine.speakRaw(speech); } catch (e) { /* ignore */ }
    }

    go(action) {
        const id = action === 'next' ? 'continue' : action === 'map' ? 'home' : action;
        CompletionEngine.executeAction(this, id, this.completion);
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ResultScreen };
}
