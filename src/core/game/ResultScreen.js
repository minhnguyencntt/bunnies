/**
 * ResultScreen — shared Award Screen for every game.
 *
 * Consumes AwardResult. The earned Award is the visual hero.
 * Next actions are visible immediately. Speech / sparkles never gate input.
 */
class ResultScreen extends Phaser.Scene {
    constructor() {
        super({ key: 'ResultScreen' });
    }

    init(data) {
        this.gameId = data.gameId;
        this.level = data.level;
        this.completion = data.completion || CompletionEngine.fromRewards({
            ...(data.rewards || {}),
            gameId: data.gameId || (data.rewards && data.rewards.gameId),
            level: data.level || (data.rewards && data.rewards.level) || 1,
        }, { persistOk: true });
    }

    create() {
        NavSystem.ready(this);
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

        const pw = Math.min(720, w * 0.92);
        const ph = Math.min(680, h * 0.94);
        UISystem.panel(this, w / 2, h / 2, pw, ph, { borderWidth: 5 });

        const cx = w / 2;
        const top = h / 2 - ph / 2;
        const bottom = h / 2 + ph / 2;
        const items = r.rewards || [];
        const hero = r.hero || Award.pickHero(items);
        const extras = items.filter((a) => a !== hero).slice(0, 2);

        this.add.text(cx, top + 22, `${r.gameName} · Màn ${r.level}`, {
            fontSize: '15px', fontFamily: DesignTokens.typography.fontFamily, fontStyle: 'bold',
            color: DesignTokens.css.inkSoft,
        }).setOrigin(0.5);

        const secondaryY = bottom - 34;
        const primaryY = secondaryY - 56;
        const promptY = primaryY - 34;
        const celebrateY = promptY - 26;
        const valuesY = celebrateY - 26;
        const stageBottom = valuesY - 18;
        const stageTop = top + 40;
        const stageMid = (stageTop + stageBottom) / 2;
        const sideBySide = extras.length > 0 && pw >= 620;

        if (hero) {
            UISystem.awardCard(this, cx, stageMid, hero, { size: 'hero' });
        } else {
            this.drawValuesHero(cx, stageMid, r);
        }

        if (extras.length) {
            if (sideBySide) {
                const xs = extras.length === 1 ? [cx + 210] : [cx - 210, cx + 210];
                extras.forEach((item, i) => {
                    UISystem.awardCard(this, xs[i], stageMid, item, { size: 'support' });
                });
            } else {
                const cardW = 120;
                const gap = 14;
                const total = extras.length * cardW + (extras.length - 1) * gap;
                extras.forEach((item, i) => {
                    const x = cx - total / 2 + cardW / 2 + i * (cardW + gap);
                    UISystem.awardCard(this, x, stageBottom - 8, item, { size: 'support' });
                });
            }
        }

        this.drawRewardValues(cx, valuesY, r);
        this.add.text(cx, celebrateY, r.celebration || (r.persistOk ? 'Giỏi lắm!' : 'Chưa lưu được phần thưởng.'), {
            fontSize: '17px', fontFamily: DesignTokens.typography.fontFamily, fontStyle: 'bold',
            color: r.persistOk ? DesignTokens.css.ink : DesignTokens.css.error,
        }).setOrigin(0.5);

        this.add.text(cx, promptY, 'Bạn muốn làm gì tiếp?', {
            fontSize: '17px', fontFamily: DesignTokens.typography.fontFamily, fontStyle: 'bold',
            color: DesignTokens.css.ink,
        }).setOrigin(0.5);
        this.drawActions(cx, primaryY, r);

        this.spawnBunny(w, h);
        this.announce(r);
        try { RewardPresentationEngine.celebrate(this, r); } catch (e) { /* ignore */ }
    }

    drawRewardValues(cx, y, r) {
        const starGlyphs = [0, 1, 2].map((i) => (i < r.starsEarned ? '⭐' : '☆')).join('');
        this.add.text(cx, y, `${starGlyphs}   +${r.xpEarned} XP   ·   💎 +${r.coinsEarned}   ·   Đúng ${r.correctAnswers}/${r.totalQuestions}`, {
            fontSize: '16px', fontFamily: DesignTokens.typography.fontFamily, fontStyle: 'bold',
            color: DesignTokens.css.ink,
        }).setOrigin(0.5);
    }

    drawValuesHero(cx, y, r) {
        const starGlyphs = [0, 1, 2].map((i) => (i < r.starsEarned ? '⭐' : '☆')).join('');
        this.add.text(cx, y - 24, starGlyphs, {
            fontSize: '42px', fontFamily: DesignTokens.typography.fontFamily,
        }).setOrigin(0.5);
        this.add.text(cx, y + 22, `+${r.xpEarned} XP`, {
            fontSize: '26px', fontFamily: DesignTokens.typography.fontFamily, fontStyle: 'bold',
            color: DesignTokens.css.primary,
        }).setOrigin(0.5);
        this.add.text(cx, y + 52, r.persistOk ? 'Phần thưởng của bạn' : 'Chưa lưu được phần thưởng.', {
            fontSize: '16px', fontFamily: DesignTokens.typography.fontFamily, fontStyle: 'bold',
            color: r.persistOk ? DesignTokens.css.inkSoft : DesignTokens.css.error,
        }).setOrigin(0.5);
    }

    drawActions(cx, y, r) {
        const actions = (r.availableNextActions || []).filter((a) => a.enabled !== false);
        const primary = actions.find((a) => a.isPrimary || a.primary) || actions[0];
        const secondary = actions.filter((a) => a !== primary);
        if (primary) {
            UISystem.primaryButton(this, cx, y, primary.label, () => this.go(primary.id), {
                width: 280, height: 52, fontSize: 20, color: DesignTokens.colors.success,
            });
        }
        if (secondary.length) {
            const bw = 142;
            const gap = 10;
            const tw = secondary.length * bw + (secondary.length - 1) * gap;
            secondary.forEach((a, i) => {
                const x = cx - tw / 2 + bw / 2 + i * (bw + gap);
                UISystem.secondaryButton(this, x, y + 56, a.label, () => this.go(a.id), {
                    width: bw, height: 42, fontSize: 15,
                });
            });
        }
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
        const stickers = fresh.filter((x) => x.type === Award.TYPE.STICKER);
        const badges = fresh.filter((x) => x.type === Award.TYPE.BADGE);
        if (stickers.length) bits.push(`Sticker mới: ${stickers.map((s) => s.name).join(', ')}`);
        if (badges.length) bits.push(`Huy hiệu mới: ${badges.map((a) => a.name).join(', ')}`);
        if (!r.persistOk) bits.push('Chưa lưu được phần thưởng');
        const speech = bits.length ? bits.join('. ') + '!' : (r.celebration || `Bạn hoàn thành ${r.gameName}!`);
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
