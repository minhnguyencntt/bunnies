/**
 * VisualMathScreen.js — shared gameplay for visual multiple-choice math games.
 *
 * Round flow (learning-first, no test feeling):
 *   1. SHOW    — objects appear in two groups (add) or one group (subtract)
 *   2. ANIMATE — groups combine / objects fly away, synchronized with counting voice
 *   3. ASK     — equation appears + exactly 3 large answer buttons
 *   4. ANSWER  — correct: celebration; wrong: gentle retry; 2nd wrong: guided
 *                explanation (objects counted aloud, correct answer highlighted)
 *
 * Subclasses provide a `theme` (puzzle.js) with operation 'add'|'subtract',
 * objectPool, palette, decor, particleColors.
 */
class VisualMathScreen extends GameShell {
    constructor(key) {
        super(key);
        this.theme = null; // set by subclass
        this.roundObjects = [];
        this.wrongThisRound = 0;
        this.guided = false;
        this.choiceButtons = [];
    }

    track(obj) { this.roundObjects.push(obj); return obj; }

    clearRound() {
        this.roundObjects.forEach(o => { if (o?.active) o.destroy(true); });
        this.roundObjects = [];
        this.choiceButtons = [];
        this.wrongThisRound = 0;
        this.guided = false;
    }

    // ─── Question generation (dynamic, never hardcoded) ───────

    generateQuestion(diff) {
        const range = diff.mathRange;
        let a;
        let b;
        if (this.theme.operation === 'add') {
            const minA = this.level === 1 ? 1 : this.level === 2 ? 2 : 3;
            a = Phaser.Math.Between(minA, Math.max(minA, range - 2));
            b = Phaser.Math.Between(1, Math.max(1, range - a));
            return { a, b, answer: a + b, op: '+', opText: '+' };
        }
        // subtract: result always ≥ 1 (visual counting stays concrete)
        a = Phaser.Math.Between(Math.min(3, range), range);
        b = Phaser.Math.Between(1, a - 1);
        return { a, b, answer: a - b, op: '-', opText: '−' };
    }

    /** Exactly 3 choices; plausible distractors (±1, ±2); position randomized. */
    generateChoices(answer) {
        const candidates = [answer - 2, answer - 1, answer + 1, answer + 2]
            .filter(v => v >= 0 && v !== answer);
        const wrongs = Phaser.Utils.Array.Shuffle(candidates).slice(0, 2);
        while (wrongs.length < 2) wrongs.push(answer + 3 + wrongs.length);
        return Phaser.Utils.Array.Shuffle([answer, ...wrongs]);
    }

    // ─── Round presentation ───────────────────────────────────

    presentRound(index, diff) {
        this.clearRound();
        const q = this.generateQuestion(diff);
        this.expected = q; // debug/test hook
        this.currentQuestion = q;
        this.playQuestionSequence(q, diff);
    }

    playQuestionSequence(q, diff) {
        const w = this.cameras.main.width;
        const h = this.cameras.main.height;
        const emoji = Phaser.Utils.Array.GetRandom(this.theme.objectPool);
        const objSize = Math.min(64, Math.round(w * 0.055));

        // Phase 1+2: show objects, then animate combine / removal
        if (q.op === 'add') {
            this.spawnGroup(q.a, w * 0.3, h * 0.42, emoji, objSize, 0);
            this.spawnGroup(q.b, w * 0.7, h * 0.42, emoji, objSize, 0);
            // Combine: both groups glide to the center
            this.time.delayedCall(1200, () => {
                this.roundObjects.filter(o => o.getData?.('mathObj')).forEach((o, i) => {
                    const row = Math.floor(i / 7);
                    const col = i % 7;
                    this.tweens.add({
                        targets: o,
                        x: w / 2 + (col - (Math.min(q.answer, 7) - 1) / 2) * (objSize + 8),
                        y: h * 0.42 + row * (objSize + 6),
                        duration: 600, ease: 'Back.easeOut',
                    });
                });
            });
        } else {
            this.spawnGroup(q.a, w / 2, h * 0.42, emoji, objSize, 0);
            // Remove: last b objects fly away with a soft whoosh
            this.time.delayedCall(1200, () => {
                const objs = this.roundObjects.filter(o => o.getData?.('mathObj'));
                for (let i = 0; i < q.b; i++) {
                    const o = objs[objs.length - 1 - i];
                    if (!o) continue;
                    AudioEngine.emit('ObjectDragged');
                    this.tweens.add({
                        targets: o, y: o.y - 120, alpha: 0, angle: 40, scale: 0.5,
                        duration: 650, delay: i * 200, ease: 'Sine.easeIn',
                        onComplete: () => o.setVisible(false),
                    });
                }
            });
        }

        // Phase 3: equation + choices after the animation
        const askDelay = q.op === 'add' ? 2100 : 2100 + q.b * 200;
        this.time.delayedCall(askDelay, () => {
            if (this.sessionOver) return;
            this.showEquation(q);
            this.showChoices(q);
        });
    }

    spawnGroup(count, cx, cy, emoji, size, depth) {
        const perRow = Math.min(count, 7);
        for (let i = 0; i < count; i++) {
            const row = Math.floor(i / 7);
            const col = i % 7;
            const x = cx + (col - (perRow - 1) / 2) * (size + 8);
            const y = cy + row * (size + 6);
            const o = this.track(this.add.text(x, y, emoji, { fontSize: `${size}px` })
                .setOrigin(0.5).setDepth(120 + depth).setScale(0));
            o.setData('mathObj', true);
            o.setData('counted', false);
            this.tweens.add({ targets: o, scale: 1, duration: 300, delay: 150 + i * 90, ease: 'Back.easeOut' });
        }
    }

    showEquation(q) {
        const w = this.cameras.main.width;
        const panel = this.track(this.add.container(w / 2, DesignTokens.layout.equationY).setDepth(150));
        const bg = this.add.graphics();
        bg.fillStyle(this.theme.palette.panel, 0.92);
        bg.fillRoundedRect(-170, -32, 340, 64, 18);
        bg.lineStyle(3, 0xffd700, 0.9);
        bg.strokeRoundedRect(-170, -32, 340, 64, 18);
        panel.add(bg);
        panel.add(this.add.text(0, 0, `${q.a} ${q.opText} ${q.b} = ?`, {
            fontSize: '34px', fontFamily: 'Comic Sans MS, Arial', fontStyle: 'bold',
            color: '#fff', stroke: '#000', strokeThickness: 2,
        }).setOrigin(0.5));
        panel.setScale(0);
        this.tweens.add({ targets: panel, scale: 1, duration: 350, ease: 'Back.easeOut' });
        AudioEngine.emit('UIPop');
    }

    showChoices(q) {
        const h = this.cameras.main.height;
        const choices = this.generateChoices(q.answer);
        const buttons = this.createChoiceButtons(
            choices.map(v => ({ label: v, value: v })),
            h * DesignTokens.layout.answerY,
            (opt, btn) => this.onAnswerPick(opt, btn),
            { size: 96, fontSize: 40 }
        );
        buttons.forEach(b => this.track(b));
        this.choiceButtons = buttons;
    }

    // ─── Answers ──────────────────────────────────────────────

    onAnswerPick(opt, btn) {
        if (this.guided) return; // guided mode: only the highlighted button responds
        if (opt.value === this.currentQuestion.answer) {
            this.celebrateCorrect(btn);
        } else {
            this.wrongThisRound++;
            this.shake(btn);
            this.answerWrong(btn.x, btn.y);
            if (this.wrongThisRound >= 2) {
                this.time.delayedCall(900, () => this.guidedExplanation());
            }
        }
    }

    celebrateCorrect(btn) {
        // Objects glow + bunny celebrates (jump & spin)
        this.roundObjects.filter(o => o.getData?.('mathObj') && o.visible).forEach((o, i) => {
            this.tweens.add({ targets: o, scale: 1.25, duration: 200, delay: i * 40, yoyo: true });
        });
        this.bunnyCelebrate();
        this.answerCorrect(btn.x, btn.y);
    }

    /** Learning moment: count the objects aloud, then highlight the answer. */
    guidedExplanation() {
        if (this.guided || this.sessionOver) return;
        this.guided = true;
        const q = this.currentQuestion;
        const objs = this.roundObjects.filter(o => o.getData?.('mathObj') && o.visible);

        this.companionSay('Mình đếm cùng nhau nhé! 👆', 2500);
        objs.forEach((o, i) => {
            this.time.delayedCall(600 + i * 550, () => {
                if (this.sessionOver) return;
                o.setScale(1.35);
                o.setTint(0xfff176);
                VoiceEngine.count(i + 1);
                this.spawnSparkles(o.x, o.y, 3);
            });
        });
        this.time.delayedCall(600 + objs.length * 550 + 400, () => {
            if (this.sessionOver) return;
            this.companionSay(`Vậy đáp án là ${q.answer}! Chạm vào nhé!`, 2800);
            const correctBtn = this.choiceButtons.find(b => {
                const label = b.list.find(c => c.type === 'Text');
                return label && label.text === String(q.answer);
            });
            if (correctBtn) {
                this.tweens.add({ targets: correctBtn, scale: 1.15, duration: 400, yoyo: true, repeat: 3 });
                correctBtn.removeAllListeners();
                correctBtn.on('pointerdown', () => {
                    this.spawnSparkles(correctBtn.x, correctBtn.y, 10);
                    this.companionSay('Đúng rồi! Giỏi lắm! 🌟', 2000);
                    AudioEngine.emit('CorrectAnswer');
                    this.time.delayedCall(1200, () => this.advanceRound());
                });
            } else {
                this.time.delayedCall(1200, () => this.advanceRound());
            }
        });
    }

    // ─── Bunny character ──────────────────────────────────────

    createBigBunny(x, y, size) {
        const key = this.textures.exists('spr_bunny_idle') ? 'spr_bunny_idle' : null;
        if (!key) return null;
        this.bigBunny = this.add.image(x, y, key).setDepth(90);
        const tex = this.bigBunny.texture.getSourceImage();
        this.bigBunny.setScale(size / tex.height);
        this.bigBunnyBaseY = y;
        this.tweens.add({ targets: this.bigBunny, y: y - 6, duration: 1500, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
        return this.bigBunny;
    }

    bunnyCelebrate() {
        if (!this.bigBunny) return;
        if (this.textures.exists('spr_bunny_happy')) this.bigBunny.setTexture('spr_bunny_happy');
        this.tweens.killTweensOf(this.bigBunny);
        this.tweens.add({
            targets: this.bigBunny, y: this.bigBunnyBaseY - 40, angle: 360,
            duration: 550, ease: 'Power2',
            onComplete: () => {
                this.bigBunny.angle = 0;
                this.tweens.add({
                    targets: this.bigBunny, y: this.bigBunnyBaseY - 6,
                    duration: 1500, yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
                });
            },
        });
        this.time.delayedCall(1500, () => {
            if (this.bigBunny && this.textures.exists('spr_bunny_idle')) this.bigBunny.setTexture('spr_bunny_idle');
        });
    }

    bunnyThink() {
        if (!this.bigBunny) return;
        this.tweens.add({ targets: this.bigBunny, angle: 12, duration: 300, yoyo: true });
    }

    // ─── World dressing (shared, palette-driven) ──────────────

    buildThemedWorld(w, h) {
        const p = this.theme.palette;
        // Painted storybook background when available (generated art);
        // procedural gradient world as fallback
        const bgKey = `${this.gameId}_bg`;
        if (this.textures.exists(bgKey)) {
            this.add.image(w / 2, h / 2, bgKey).setDisplaySize(w, h).setDepth(0);
        } else {
            this.buildProceduralWorld(w, h, p);
        }
        this.addWorldLife(w, h);
        this.createBigBunny(Math.round(w * 0.12), Math.round(h * 0.68), 130);
    }

    buildProceduralWorld(w, h, p) {
        const g = this.add.graphics().setDepth(0);
        g.fillGradientStyle(p.skyTop, p.skyTop, p.skyBottom, p.skyBottom, 1);
        g.fillRect(0, 0, w, h);
        // Rolling hills
        g.fillStyle(p.hill1, 0.9);
        g.fillEllipse(w * 0.25, h * 1.05, w * 0.7, h * 0.5);
        g.fillStyle(p.hill2, 0.9);
        g.fillEllipse(w * 0.8, h * 1.1, w * 0.75, h * 0.55);
    }

    /** Living background: swaying decor + floating particles (subtle). */
    addWorldLife(w, h) {
        this.theme.decor.forEach((emoji, i) => {
            const x = (w * (0.12 + i * 0.19)) % (w * 0.95);
            const y = h * (0.62 + (i % 2) * 0.14);
            const d = this.add.text(x, y, emoji, { fontSize: '44px' }).setDepth(5).setAlpha(0.9);
            this.tweens.add({ targets: d, y: y - 6, duration: 1800 + i * 200, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
        });
        for (let i = 0; i < 14; i++) {
            const px = Phaser.Math.Between(30, w - 30);
            const py = Phaser.Math.Between(80, h - 100);
            const s = this.add.graphics().setDepth(6);
            s.fillStyle(this.theme.particleColors[i % this.theme.particleColors.length], 0.7);
            s.fillCircle(0, 0, Phaser.Math.Between(2, 4));
            s.setPosition(px, py);
            this.tweens.add({
                targets: s, y: py - Phaser.Math.Between(20, 50), alpha: 0.2,
                duration: Phaser.Math.Between(2000, 4000), yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
            });
        }
    }

    showHintVisual(hint) {
        if (hint.style === 'conceptual') return;
        // Highlight the object area (direct) — the visual model IS the hint
        const w = this.cameras.main.width;
        const h = this.cameras.main.height;
        const ring = this.add.graphics().setDepth(300);
        ring.lineStyle(5, 0xffd700, 0.9);
        ring.strokeRoundedRect(w * 0.15, h * 0.28, w * 0.7, h * 0.35, 24);
        this.tweens.add({ targets: ring, alpha: 0, duration: 1800, onComplete: () => ring.destroy() });
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { VisualMathScreen };
}
