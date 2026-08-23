/**
 * screen.js — Đồi Phép Trừ (Subtraction Hill). Educational goal: SUBTRACTION.
 * Redesigned on the Knowledge World Game Engine (GameShell).
 *
 *   Màn 1 · Táo Lăn Đồi      — items roll away; collect & count what remains
 *   Màn 2 · Giỏ Quà Của Cáo  — pack b items into the basket, then tell the remainder
 *   Màn 3 · Hành Trình Của Cáo — multi-step story problems (a − b ± c)
 */
class SubtractionHillScreen extends GameShell {
    constructor() {
        super('SubtractionHillScreen');
        this.gameId = 'subtraction_hill';
        this.roundObjects = [];
        this.collected = 0;
        this.roundTarget = 0;
        this.packNeeded = 0;
        this.packed = 0;
        this.phase = 'collect';
    }

    onPreload() {
        this.load.image('sh_bg', 'screens/subtraction_hill/assets/backgrounds/bg.jpg');
        this.preloadCommonAudio('subtraction_hill');
    }

    buildWorld(w, h) {
        if (this.textures.exists('sh_bg')) {
            this.add.image(w / 2, h / 2, 'sh_bg').setDisplaySize(w, h).setDepth(0);
        } else {
            const g = this.add.graphics().setDepth(0);
            g.fillGradientStyle(0x87ceeb, 0x87ceeb, 0xffa07a, 0xffa07a, 1);
            g.fillRect(0, 0, w, h * 0.6);
            g.fillStyle(0x7ccd7c);
            g.fillRect(0, h * 0.6, w, h * 0.4);
        }
        // Fox friend watches from the side
        if (this.textures.exists('spr_fox_idle')) {
            const fox = this.add.image(this.cameras.main.width - 90, this.cameras.main.height - 80, 'spr_fox_idle').setDepth(60);
            const tex = fox.texture.getSourceImage();
            fox.setScale(100 / tex.height);
            this.tweens.add({ targets: fox, y: fox.y - 5, duration: 1500, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
        }
    }

    introText() {
        return {
            1: 'Ối! Đồ của Cáo Con lăn xuống đồi mất rồi! Nhặt những món còn lại bỏ vào giỏ giúp Cáo nhé!',
            2: 'Cáo Con cần xếp đồ vào giỏ! Xếp đúng số lượng, rồi đếm xem còn lại bao nhiêu nhé!',
            3: 'Cáo Con đi xa thật xa! Hãy theo dõi hành trình và tính xem cuối cùng còn bao nhiêu món đồ!',
        }[this.level];
    }

    presentRound(index, diff) {
        this.clearRound();
        if (this.level === 1) this.presentRollingItems(diff);
        else if (this.level === 2) this.presentPacking(diff);
        else this.presentJourney(diff);
    }

    track(obj) { this.roundObjects.push(obj); return obj; }

    clearRound() {
        this.roundObjects.forEach(o => { if (o?.active) o.destroy(true); });
        this.roundObjects = [];
        this.collected = 0;
        this.packed = 0;
        this.phase = 'collect';
    }

    pickItem() {
        const pool = (typeof SubtractionHillPuzzle !== 'undefined' && SubtractionHillPuzzle.lostItemPool)
            ? SubtractionHillPuzzle.lostItemPool
            : [{ emoji: '🍎', labelVi: 'Táo' }];
        return Phaser.Utils.Array.GetRandom(pool);
    }

    // ════════════════════════════════════════
    //  Màn 1 — Táo Lăn Đồi (a − b, collect the remainder)
    // ════════════════════════════════════════

    presentRollingItems(diff) {
        const w = this.cameras.main.width;
        const h = this.cameras.main.height;
        const max = diff.mathRange;
        const a = Phaser.Math.Between(4, Math.max(4, max));
        const b = Phaser.Math.Between(1, a - 2); // always ≥ 2 items remain to count
        const remaining = a - b;
        this.roundTarget = remaining;
        const item = this.pickItem();
        this.analytics.recordExploration(0, remaining);

        this.storyText = this.track(this.add.text(w / 2, DesignTokens.layout.equationY,
            `Cáo có ${a} ${item.emoji} — ${b} món lăn đi rồi! Còn lại: ?`, {
            fontSize: '24px', fontFamily: 'Comic Sans MS, Arial', fontStyle: 'bold', color: '#fff',
            stroke: '#000', strokeThickness: 3, backgroundColor: '#5c3a1ecc', padding: { x: 16, y: 8 },
        }).setOrigin(0.5).setDepth(150));

        // Basket
        const basketY = h * 0.82;
        const basket = this.track(this.add.container(w / 2, basketY).setDepth(60));
        const bg = this.add.graphics();
        bg.fillStyle(0x8d6e63, 1);
        bg.fillRoundedRect(-100, -36, 200, 72, 18);
        bg.lineStyle(4, 0x5d4037, 1);
        bg.strokeRoundedRect(-100, -36, 200, 72, 18);
        basket.add(bg);
        this.basketCounter = this.add.text(0, 0, '🧺 0', {
            fontSize: '32px', fontFamily: 'Comic Sans MS, Arial', fontStyle: 'bold',
            color: '#ffd700', stroke: '#000', strokeThickness: 3,
        }).setOrigin(0.5);
        basket.add(this.basketCounter);

        // Items in a row; the last b roll away
        const rowY = h * 0.42;
        const spacing = Math.min(90, (w * 0.7) / a);
        for (let i = 0; i < a; i++) {
            const ix = w / 2 + (i - (a - 1) / 2) * spacing;
            const it = this.track(this.add.text(ix, rowY, item.emoji, { fontSize: '52px' })
                .setOrigin(0.5).setDepth(120).setScale(0));
            this.tweens.add({ targets: it, scale: 1, duration: 250, delay: 200 + i * 100, ease: 'Back.easeOut' });

            if (i >= remaining) {
                // Rolls away down the hill
                this.tweens.add({
                    targets: it, x: w + 80, y: rowY + 140, angle: 540, alpha: 0.15,
                    duration: 1100, delay: 400 + a * 100 + (i - remaining) * 260, ease: 'Sine.easeIn',
                    onComplete: () => it.setVisible(false),
                });
            } else {
                // Remains — tappable to collect
                this.time.delayedCall(600 + a * 100 + b * 260, () => {
                    if (!it.active || this.sessionOver) return;
                    // Generous padded hit area around the emoji for small fingers
                    it.setInteractive({
                        hitArea: new Phaser.Geom.Rectangle(-14, -14, it.width + 28, it.height + 28),
                        hitAreaCallback: Phaser.Geom.Rectangle.Contains,
                        useHandCursor: true,
                    });
                    it.on('pointerdown', () => this.collectItem(it));
                    this.tweens.add({ targets: it, y: rowY - 8, duration: 900, yoyo: true, repeat: -1 });
                });
            }
        }
    }

    collectItem(it) {
        if (!this.acceptingInput || this.isPaused || this.sessionOver) return;
        if (it.getData('collected')) return;
        it.setData('collected', true);
        it.removeAllListeners();
        this.tweens.killTweensOf(it);
        this.collected++;
        this.analytics.recordExploration(1, 0);
        AudioEngine.emit('ObjectCollected', { count: this.collected });
        const w = this.cameras.main.width;
        const h = this.cameras.main.height;
        this.tweens.add({
            targets: it, x: w / 2, y: h * 0.82 - 20, scale: 0.5, duration: 350,
            onComplete: () => {
                it.setDepth(59);
                this.basketCounter.setText(`🧺 ${this.collected}`);
                this.tweens.add({ targets: this.basketCounter, scale: 1.35, duration: 140, yoyo: true });
                this.spawnSparkles(w / 2, h * 0.82 - 40, 5);
                if (this.collected >= this.roundTarget) {
                    this.storyText.setText(this.storyText.text.replace('?', String(this.roundTarget)));
                    this.answerCorrect(w / 2, h * 0.82 - 60);
                }
            },
        });
    }

    // ════════════════════════════════════════
    //  Màn 2 — Giỏ Quà Của Cáo (pack b, then answer remainder)
    // ════════════════════════════════════════

    presentPacking(diff) {
        const w = this.cameras.main.width;
        const h = this.cameras.main.height;
        const max = diff.mathRange;
        const a = Phaser.Math.Between(4, max);
        const b = Phaser.Math.Between(2, a - 2);
        const remaining = a - b;
        this.packNeeded = b;
        this.roundTarget = remaining;
        const item = this.pickItem();

        this.storyText = this.track(this.add.text(w / 2, DesignTokens.layout.equationY,
            `Có ${a} ${item.emoji} — xếp ${b} vào giỏ. Còn lại mấy ${item.emoji}?`, {
            fontSize: '23px', fontFamily: 'Comic Sans MS, Arial', fontStyle: 'bold', color: '#fff',
            stroke: '#000', strokeThickness: 3, backgroundColor: '#5c3a1ecc', padding: { x: 16, y: 8 },
        }).setOrigin(0.5).setDepth(150));

        // Basket (drop zone)
        const basketY = h * 0.8;
        const basket = this.track(this.add.container(w / 2, basketY).setDepth(60));
        const bg = this.add.graphics();
        bg.fillStyle(0x8d6e63, 1);
        bg.fillRoundedRect(-110, -38, 220, 76, 18);
        bg.lineStyle(4, 0x5d4037, 1);
        bg.strokeRoundedRect(-110, -38, 220, 76, 18);
        basket.add(bg);
        this.basketCounter = this.add.text(0, 0, `🧺 0/${b}`, {
            fontSize: '30px', fontFamily: 'Comic Sans MS, Arial', fontStyle: 'bold',
            color: '#ffd700', stroke: '#000', strokeThickness: 3,
        }).setOrigin(0.5);
        basket.add(this.basketCounter);
        this.basketZone = { x: w / 2, y: basketY, hw: 125, hh: 60 };

        // Draggable items
        const rowY = h * 0.4;
        const spacing = Math.min(86, (w * 0.72) / a);
        for (let i = 0; i < a; i++) {
            const ix = w / 2 + (i - (a - 1) / 2) * spacing;
            const it = this.track(this.add.text(ix, rowY, item.emoji, { fontSize: '48px' })
                .setOrigin(0.5).setDepth(120));
            it.setSize(56, 56);
            it.setInteractive({
                hitArea: new Phaser.Geom.Rectangle(-12, -12, it.width + 24, it.height + 24),
                hitAreaCallback: Phaser.Geom.Rectangle.Contains,
                draggable: true,
                useHandCursor: true,
            });
            it.setData('ox', ix);
            it.setData('oy', rowY);
            it.setData('packed', false);
            it.on('dragstart', () => {
                this.tweens.killTweensOf(it); // idle bob must not fight the drag
                it.setDepth(250).setScale(1.15);
                AudioEngine.emit('ObjectDragged');
            });
            it.on('drag', (_p, dx, dy) => { it.x = dx; it.y = dy; });
            it.on('dragend', () => this.handlePackDrop(it));
            this.tweens.add({ targets: it, y: rowY - 5, duration: 1300 + i * 90, yoyo: true, repeat: -1 });
        }
    }

    handlePackDrop(it) {
        if (!this.acceptingInput || this.isPaused || this.sessionOver) return;
        if (it.getData('packed')) return;
        const z = this.basketZone;
        const inside = Math.abs(it.x - z.x) < z.hw && Math.abs(it.y - z.y) < z.hh;
        if (!inside) {
            this.tweens.add({
                targets: it, x: it.getData('ox'), y: it.getData('oy'), scale: 1,
                duration: 300, ease: 'Back.easeOut', onComplete: () => it.setDepth(120),
            });
            return;
        }
        if (this.packed >= this.packNeeded) { // basket full — put it back gently
            this.companionSay('Giỏ đủ rồi! Đếm phần còn lại nào!', 2000);
            this.tweens.add({
                targets: it, x: it.getData('ox'), y: it.getData('oy'), scale: 1,
                duration: 300, ease: 'Back.easeOut', onComplete: () => it.setDepth(120),
            });
            return;
        }
        it.setData('packed', true);
        it.removeAllListeners();
        this.tweens.killTweensOf(it);
        this.packed++;
        this.tweens.add({
            targets: it, x: z.x + (this.packed - (this.packNeeded + 1) / 2) * 34, y: z.y - 8, scale: 0.55, duration: 300,
            onComplete: () => {
                it.setDepth(59);
                this.basketCounter.setText(`🧺 ${this.packed}/${this.packNeeded}`);
                this.spawnSparkles(z.x, z.y - 34, 4);
                if (this.packed >= this.packNeeded) this.askRemainder();
            },
        });
    }

    askRemainder() {
        const w = this.cameras.main.width;
        const h = this.cameras.main.height;
        this.phase = 'answer';
        this.companionSay('Giỏ đủ rồi! Còn lại bao nhiêu món ngoài kia?', 2800);

        const correct = this.roundTarget;
        this.expected = correct; // debug/test hook
        const wrongs = new Set();
        while (wrongs.size < 2) {
            const v = Phaser.Math.Between(Math.max(1, correct - 3), correct + 3);
            if (v !== correct) wrongs.add(v);
        }
        const options = Phaser.Utils.Array.Shuffle([correct, ...wrongs]).map(v => ({ label: v, value: v }));
        const buttons = this.createChoiceButtons(options, h * 0.56, (opt, btn) => {
            if (opt.value === correct) {
                this.answerCorrect(btn.x, btn.y);
            } else {
                this.shake(btn);
                this.answerWrong(btn.x, btn.y);
            }
        });
        buttons.forEach(b => this.track(b));
    }

    // ════════════════════════════════════════
    //  Màn 3 — Hành Trình Của Cáo (a − b ± c ≤ 20)
    // ════════════════════════════════════════

    presentJourney(diff) {
        const w = this.cameras.main.width;
        const h = this.cameras.main.height;
        const max = diff.mathRange;
        const a = Phaser.Math.Between(9, Math.min(16, max));
        const b = Phaser.Math.Between(2, a - 3);
        const useAdd = Math.random() < 0.35;
        const c = useAdd
            ? Phaser.Math.Between(2, Math.min(8, max - (a - b)))
            : Phaser.Math.Between(1, a - b - 1);
        const correct = useAdd ? a - b + c : a - b - c;
        this.expected = correct; // debug/test hook
        const item = this.pickItem();
        const third = useAdd ? `được thêm ${c}` : `cho đi tiếp ${c}`;

        const panel = this.track(this.add.container(w / 2, 116).setDepth(150));
        const pbg = this.add.graphics();
        pbg.fillStyle(0x1b5e20, 0.9);
        pbg.fillRoundedRect(-340, -44, 680, 88, 18);
        pbg.lineStyle(3, 0xffd700, 0.8);
        pbg.strokeRoundedRect(-340, -44, 680, 88, 18);
        panel.add(pbg);
        panel.add(this.add.text(0, 0,
            `Cáo có ${a} ${item.emoji} · cho bạn ${b} · ${third} ${item.emoji}\nHỏi Cáo còn bao nhiêu ${item.emoji}?`, {
            fontSize: '21px', fontFamily: 'Comic Sans MS, Arial', fontStyle: 'bold', color: '#fff',
            align: 'center', stroke: '#000', strokeThickness: 2,
        }).setOrigin(0.5));

        // Animated item row
        const stageY = h * 0.4;
        const items = [];
        const perRow = Math.min(a, 10);
        for (let i = 0; i < a; i++) {
            const ix = w / 2 + (i - (perRow - 1) / 2) * 42;
            const iy = stageY + Math.floor(i / 10) * 42;
            const it = this.track(this.add.text(ix, iy, item.emoji, { fontSize: '28px' })
                .setOrigin(0.5).setDepth(120).setScale(0));
            items.push(it);
            this.tweens.add({ targets: it, scale: 1, duration: 180, delay: 200 + i * 60, ease: 'Back.easeOut' });
        }
        const t1 = 300 + a * 60 + 500;
        for (let i = 0; i < b; i++) {
            const it = items[a - 1 - i];
            this.tweens.add({ targets: it, x: it.x + 120, alpha: 0, duration: 450, delay: t1 + i * 150 });
        }
        const t2 = t1 + b * 150 + 400;
        if (useAdd) {
            for (let i = 0; i < c; i++) {
                const it = this.track(this.add.text(w / 2 + (i - (c - 1) / 2) * 42, stageY + 100, item.emoji, { fontSize: '28px' })
                    .setOrigin(0.5).setDepth(120).setAlpha(0));
                this.tweens.add({ targets: it, alpha: 1, y: stageY + 88, duration: 350, delay: t2 + i * 150 });
            }
        } else {
            for (let i = 0; i < c; i++) {
                const it = items[a - b - 1 - i];
                if (it) this.tweens.add({ targets: it, x: it.x - 120, alpha: 0, duration: 450, delay: t2 + i * 150 });
            }
        }

        const wrongs = new Set();
        while (wrongs.size < diff.choiceCount - 1) {
            const v = Phaser.Math.Between(Math.max(0, correct - 5), correct + 5);
            if (v !== correct) wrongs.add(v);
        }
        const options = Phaser.Utils.Array.Shuffle([correct, ...wrongs]).map(v => ({ label: v, value: v }));
        this.time.delayedCall(Math.min(t2 + c * 150 + 300, 6500), () => {
            if (this.sessionOver) return;
            const buttons = this.createChoiceButtons(options, h * 0.72, (opt, btn) => {
                if (opt.value === correct) {
                    this.answerCorrect(btn.x, btn.y);
                } else {
                    this.shake(btn);
                    this.answerWrong(btn.x, btn.y);
                }
            });
            buttons.forEach(b => this.track(b));
        });
    }

    showHintVisual(hint) {
        if (hint.style !== 'direct' || !this.basketZone) return;
        const z = this.basketZone;
        const ring = this.add.graphics().setDepth(300);
        ring.lineStyle(5, 0xffd700, 0.9);
        ring.strokeRoundedRect(z.x - z.hw, z.y - z.hh, z.hw * 2, z.hh * 2, 20);
        this.tweens.add({ targets: ring, alpha: 0, duration: 1800, onComplete: () => ring.destroy() });
    }
}
