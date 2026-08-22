/**
 * screen.js — Khu Rừng Định Hướng (Orientation Forest).
 * Educational goal: SPATIAL ORIENTATION (trái/phải/trước/sau) + sequence memory.
 * Redesigned on the Knowledge World Game Engine (GameShell).
 *
 *   Màn 1 · Trái Hay Phải     — object appears left/right of Sóc, 2 big arrows
 *   Màn 2 · Bốn Hướng         — object at one of 4 positions, 4 arrows, light timer
 *   Màn 3 · Dẫn Đường Cho Sóc — watch a direction sequence, repeat it to guide Sóc
 */
class OrientationForestScreen extends GameShell {
    constructor() {
        super('OrientationForestScreen');
        this.gameId = 'orientation_forest';
        this.roundObjects = [];
        this.sequence = [];
        this.sequenceProgress = 0;
        this.squirrelPos = { x: 0, y: 0 };
    }

    onPreload() {
        this.load.image('of_bg', 'screens/orientation_forest/assets/backgrounds/bg.jpg');
        this.preloadCommonAudio('orientation_forest');
    }

    buildWorld(w, h) {
        if (this.textures.exists('of_bg')) {
            this.add.image(w / 2, h / 2, 'of_bg').setDisplaySize(w, h).setDepth(0);
        } else {
            const g = this.add.graphics().setDepth(0);
            g.fillGradientStyle(0x90ee90, 0x98fb98, 0x228b22, 0x2e8b57, 1);
            g.fillRect(0, 0, w, h * 0.55);
            g.fillStyle(0x6b8e23);
            g.fillRect(0, h * 0.55, w, h * 0.45);
        }
        // Sóc the squirrel — the character the child helps
        const sx = w / 2;
        const sy = h * 0.42;
        this.squirrelPos = { x: sx, y: sy };
        const key = this.textures.exists('spr_squirrel_front') ? 'spr_squirrel_front' : null;
        if (key) {
            this.squirrel = this.add.image(sx, sy, key).setDepth(80);
            const tex = this.squirrel.texture.getSourceImage();
            this.squirrel.setScale(110 / tex.height);
            this.tweens.add({ targets: this.squirrel, y: sy - 5, duration: 1400, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
        }
        this.startLevelBGM('bgm_orientation_forest', 'screens/orientation_forest/assets/audio/bgm/bgm.mp3');
    }

    introText() {
        return {
            1: 'Sóc bị lạc rồi! Nhìn xem vật ở bên TRÁI hay bên PHẢI của Sóc nhé!',
            2: 'Sóc cần biết hướng đi! Vật ở TRÁI, PHẢI, TRƯỚC hay SAU Sóc nhỉ?',
            3: 'Hãy ghi nhớ các mũi tên rồi dẫn Sóc đi theo đúng trình tự để tìm hạt dẻ!',
        }[this.level];
    }

    presentRound(index, diff) {
        this.clearRound();
        if (this.level === 3) this.presentSequence(diff);
        else this.presentDirection(diff);
    }

    track(obj) { this.roundObjects.push(obj); return obj; }

    clearRound() {
        this.roundObjects.forEach(o => { if (o?.active) o.destroy(true); });
        this.roundObjects = [];
        this.sequenceProgress = 0;
    }

    directions(count) {
        const all = [
            { id: 'left', icon: '⬅️', label: 'Bên trái', dx: -1, dy: 0 },
            { id: 'right', icon: '➡️', label: 'Bên phải', dx: 1, dy: 0 },
            { id: 'forward', icon: '⬆️', label: 'Phía trước', dx: 0, dy: -1 },
            { id: 'back', icon: '⬇️', label: 'Phía sau', dx: 0, dy: 1 },
        ];
        return count <= 2 ? all.slice(0, 2) : all;
    }

    // ════════════════════════════════════════
    //  Màn 1 & 2 — choose the direction of the clue object
    // ════════════════════════════════════════

    presentDirection(diff) {
        const w = this.cameras.main.width;
        const h = this.cameras.main.height;
        const dirs = this.directions(diff.choiceCount);
        const correct = Phaser.Utils.Array.GetRandom(dirs);
        this.expected = correct.id; // debug/test hook
        const clues = (typeof OrientationForestPuzzle !== 'undefined' && OrientationForestPuzzle.cluePool)
            ? OrientationForestPuzzle.cluePool
            : [{ emoji: '🌳', name: 'cây' }];
        const clue = Phaser.Utils.Array.GetRandom(clues);

        // Place clue relative to Sóc
        const offset = Math.min(w, h) * 0.24;
        const cx = this.squirrelPos.x + correct.dx * offset;
        const cy = this.squirrelPos.y + correct.dy * offset;
        const clueObj = this.track(this.add.text(cx, cy, clue.emoji, { fontSize: '56px' })
            .setOrigin(0.5).setDepth(90).setScale(0));
        this.tweens.add({ targets: clueObj, scale: 1, duration: 400, ease: 'Back.easeOut' });
        this.tweens.add({ targets: clueObj, y: cy - 6, duration: 1100, yoyo: true, repeat: -1, delay: 400 });

        const ring = this.track(this.add.graphics().setDepth(85));
        ring.lineStyle(3, 0xffd700, 0.7);
        ring.strokeCircle(cx, cy, 44);
        this.tweens.add({ targets: ring, alpha: 0.3, duration: 800, yoyo: true, repeat: -1 });

        this.companionSay(`${clue.emoji} đang ở hướng nào của Sóc?`, 2800);

        // Arrow buttons
        const btnY = h * 0.82;
        const options = Phaser.Utils.Array.Shuffle([...dirs]);
        const buttons = this.createChoiceButtons(
            options.map(d => ({ label: d.icon, value: d.id, dir: d })),
            btnY,
            (opt, btn) => {
                if (opt.value === correct.id) {
                    this.hopSquirrel(correct, () => this.answerCorrect(btn.x, btn.y));
                } else {
                    this.shake(btn);
                    this.answerWrong(btn.x, btn.y);
                }
            },
            { size: Phaser.Math.Clamp(Math.round(w * 0.075), 76, 104), fontSize: 40 }
        );
        buttons.forEach(b => this.track(b));
    }

    hopSquirrel(dir, done) {
        if (!this.squirrel) { done(); return; }
        const hop = 36;
        this.tweens.add({
            targets: this.squirrel,
            x: this.squirrelPos.x + dir.dx * hop,
            y: this.squirrelPos.y + dir.dy * hop - 18,
            duration: 220, yoyo: true, ease: 'Power2',
            onComplete: done,
        });
    }

    // ════════════════════════════════════════
    //  Màn 3 — Dẫn Đường Cho Sóc (sequence memory)
    // ════════════════════════════════════════

    presentSequence(diff) {
        const w = this.cameras.main.width;
        const h = this.cameras.main.height;
        const len = Math.max(2, diff.sequenceLength);
        const dirs = this.directions(4);
        this.sequence = [];
        for (let i = 0; i < len; i++) this.sequence.push(Phaser.Utils.Array.GetRandom(dirs));
        this.sequenceProgress = 0;

        // Goal acorn
        this.track(this.add.text(w / 2, h * 0.2, '🌰', { fontSize: '44px' }).setOrigin(0.5).setDepth(90));
        this.track(this.add.text(w / 2, h * 0.2 + 36, 'Dẫn Sóc tới hạt dẻ!', {
            fontSize: '17px', fontFamily: 'Comic Sans MS, Arial', fontStyle: 'bold',
            color: '#ffd700', stroke: '#000', strokeThickness: 2,
        }).setOrigin(0.5).setDepth(90));

        // Sequence display row (icons appear one by one, then hide)
        const rowY = h * 0.3;
        const icons = this.sequence.map((d, i) => {
            const x = w / 2 + (i - (len - 1) / 2) * 64;
            return this.track(this.add.text(x, rowY, '❓', { fontSize: '34px' }).setOrigin(0.5).setDepth(120));
        });

        this.acceptingInput = false;
        this.companionSay('Nhìn kỹ và ghi nhớ các mũi tên nhé! 👀', 2500);
        icons.forEach((icon, i) => {
            this.time.delayedCall(900 + i * 750, () => {
                if (this.sessionOver) return;
                icon.setText(this.sequence[i].icon);
                this.tweens.add({ targets: icon, scale: 1.35, duration: 280, yoyo: true });
            });
        });
        const revealMs = 900 + len * 750 + 500;
        this.time.delayedCall(revealMs, () => {
            if (this.sessionOver) return;
            icons.forEach(icon => icon.setText('❓'));
            this.acceptingInput = true;
            this.companionSay('Bây giờ bấm lại đúng thứ tự nào! 🐿️', 2500);
            this.startRoundTimer(diff.timeLimit); // timer starts after the reveal
        });

        // Arrow pad
        const btnY = h * 0.78;
        const buttons = this.createChoiceButtons(
            dirs.map(d => ({ label: d.icon, value: d.id, dir: d })),
            btnY,
            (opt, btn) => this.tapSequenceArrow(opt, btn, icons),
            { size: Phaser.Math.Clamp(Math.round(w * 0.07), 72, 96), fontSize: 38 }
        );
        buttons.forEach(b => this.track(b));
    }

    tapSequenceArrow(opt, btn, icons) {
        const expected = this.sequence[this.sequenceProgress];
        if (opt.value === expected.id) {
            icons[this.sequenceProgress].setText(opt.label);
            this.sequenceProgress++;
            this.hopSquirrel(opt.dir, () => {});
            this.spawnSparkles(btn.x, btn.y, 4);
            if (this.sequenceProgress >= this.sequence.length) {
                this.answerCorrect(this.squirrelPos.x, this.squirrelPos.y - 60);
            }
        } else {
            this.answerWrong(btn.x, btn.y, { message: 'Sai mất rồi! Xem lại trình tự nhé! 🔁' });
            // Gentle: replay the sequence once, progress resets
            this.sequenceProgress = 0;
            icons.forEach(icon => icon.setText('❓'));
            this.acceptingInput = false;
            this.clearRoundTimer();
            this.sequence.forEach((d, i) => {
                this.time.delayedCall(1200 + i * 700, () => {
                    if (this.sessionOver) return;
                    icons[i].setText(d.icon);
                    this.tweens.add({ targets: icons[i], scale: 1.3, duration: 260, yoyo: true });
                });
            });
            this.time.delayedCall(1200 + this.sequence.length * 700 + 400, () => {
                if (this.sessionOver) return;
                icons.forEach(icon => icon.setText('❓'));
                this.acceptingInput = true;
                this.startRoundTimer(this.adaptive.current().timeLimit);
            });
        }
    }

    showHintVisual(hint) {
        if (hint.style === 'conceptual') return;
        // Flash the next needed arrow (direct) or the squirrel (partial)
        const target = this.level === 3 && this.sequence[this.sequenceProgress]
            ? this.sequence[this.sequenceProgress]
            : null;
        if (target && hint.style === 'direct') {
            this.companionSay(`💡 Mũi tên tiếp theo: ${target.icon} ${target.label}`, 2500);
        }
    }
}
