/**
 * screen.js — Khu Rừng Đếm Số (Counting Forest). Educational goal: ADDITION.
 * Redesigned on the Knowledge World Game Engine (GameShell).
 *
 *   Màn 1 · Thu Hoạch Táo   — drag & combine two apple groups into Bunnine's basket
 *   Màn 2 · Đường Pha Lê    — pick the path whose sign equals a + b, Bunnine runs it
 *   Màn 3 · Nhiệm Vụ Pha Lê — multi-step story problems (a − b + c) with animation
 */
class CountingForestScreen extends GameShell {
    constructor() {
        super('CountingForestScreen');
        this.gameId = 'counting_forest';
        this.roundObjects = [];
        this.collected = 0;
        this.roundTarget = 0;
    }

    onPreload() {
        this.load.image('cf_bg', 'screens/counting_forest/assets/backgrounds/bg.jpg');
        this.preloadCommonAudio('counting_forest');
    }

    buildWorld(w, h) {
        if (this.textures.exists('cf_bg')) {
            this.add.image(w / 2, h / 2, 'cf_bg').setDisplaySize(w, h).setDepth(0);
        } else {
            const g = this.add.graphics().setDepth(0);
            g.fillGradientStyle(0x87ceeb, 0x87ceeb, 0xffe4b5, 0xffe4b5, 1);
            g.fillRect(0, 0, w, h * 0.65);
            g.fillStyle(0x228b22);
            g.fillRect(0, h * 0.65, w, h * 0.35);
        }
    }

    introText() {
        return {
            1: 'Bunnine đói rồi! Kéo táo vào giỏ giúp Bunnine — đếm xem tất cả có bao nhiêu quả nhé!',
            2: 'Bunnine cần tìm con đường pha lê đúng! Cộng hai số rồi chọn biển số đúng nhé!',
            3: 'Bunnine đang thu thập pha lê! Hãy theo dõi câu chuyện và tính xem cuối cùng có bao nhiêu viên!',
        }[this.level];
    }

    presentRound(index, diff) {
        this.clearRound();
        if (this.level === 1) this.presentAppleHarvest(diff);
        else if (this.level === 2) this.presentCrystalPaths(diff);
        else this.presentCrystalQuest(diff);
    }

    track(obj) { this.roundObjects.push(obj); return obj; }

    clearRound() {
        this.roundObjects.forEach(o => { if (o?.active) o.destroy(true); });
        this.roundObjects = [];
        this.collected = 0;
    }

    // ════════════════════════════════════════
    //  Màn 1 — Thu Hoạch Táo (drag & combine, a+b ≤ 5)
    // ════════════════════════════════════════

    presentAppleHarvest(diff) {
        const w = this.cameras.main.width;
        const h = this.cameras.main.height;
        const max = diff.mathRange;
        const a = Phaser.Math.Between(1, max - 1);
        const b = Phaser.Math.Between(1, max - a);
        this.roundTarget = a + b;
        this.analytics.recordExploration(0, this.roundTarget);

        // Visual equation: 🍎🍎 + 🍎 = ?
        const eq = this.track(this.add.container(w / 2, DesignTokens.layout.equationY).setDepth(150));
        const eqBg = this.add.graphics();
        eqBg.fillStyle(0x5c3a1e, 0.9);
        eqBg.fillRoundedRect(-190, -26, 380, 52, 16);
        eqBg.lineStyle(3, 0xffd700, 0.8);
        eqBg.strokeRoundedRect(-190, -26, 380, 52, 16);
        eq.add(eqBg);
        eq.add(this.add.text(0, 0, `${'🍎'.repeat(a)} + ${'🍎'.repeat(b)} = ?`, {
            fontSize: '26px', fontFamily: 'Comic Sans MS, Arial', fontStyle: 'bold', color: '#fff',
        }).setOrigin(0.5));
        this.equationText = eq.list[1];

        // Basket with Bunnine
        const basketX = w / 2;
        const basketY = h * 0.8;
        const basket = this.track(this.add.container(basketX, basketY).setDepth(60));
        const bg = this.add.graphics();
        bg.fillStyle(0x8d6e63, 1);
        bg.fillRoundedRect(-110, -40, 220, 80, 18);
        bg.lineStyle(4, 0x5d4037, 1);
        bg.strokeRoundedRect(-110, -40, 220, 80, 18);
        basket.add(bg);
        this.basketCounter = this.add.text(0, 0, '0', {
            fontSize: '40px', fontFamily: 'Comic Sans MS, Arial', fontStyle: 'bold',
            color: '#ffd700', stroke: '#000', strokeThickness: 3,
        }).setOrigin(0.5);
        basket.add(this.basketCounter);
        this.basketZone = { x: basketX, y: basketY, hw: 130, hh: 70 };

        // Two apple groups on trees
        this.spawnAppleGroup(a, w * 0.22, h * 0.42, 0xc62828);
        this.spawnAppleGroup(b, w * 0.78, h * 0.42, 0xd84315);
        this.companionSay(`Kéo ${a} quả bên trái và ${b} quả bên phải vào giỏ nào!`, 3500);
    }

    spawnAppleGroup(count, cx, cy, color) {
        const apples = [];
        for (let i = 0; i < count; i++) {
            const ox = cx + (i - (count - 1) / 2) * 64;
            const oy = cy + (i % 2) * 20 - 10;
            const apple = this.track(this.add.container(ox, oy).setDepth(120));
            const g = this.add.graphics();
            g.fillStyle(color, 1);
            g.fillCircle(0, 0, 26);
            g.fillStyle(0xffffff, 0.35);
            g.fillCircle(-8, -8, 8);
            g.fillStyle(0x33691e, 1);
            g.fillEllipse(6, -26, 14, 8);
            apple.add(g);
            apple.setSize(56, 56);
            // Containers have no origin: default hitArea would sit bottom-right of
            // the visual apple. Use an explicit centered, generous touch target.
            apple.setInteractive({
                hitArea: new Phaser.Geom.Circle(0, 0, 40),
                hitAreaCallback: Phaser.Geom.Circle.Contains,
                draggable: true,
                useHandCursor: true,
            });
            apple.setData('ox', ox);
            apple.setData('oy', oy);
            apple.setData('collected', false);

            apple.on('dragstart', () => {
                this.tweens.killTweensOf(apple); // idle bob must not fight the drag
                apple.setScale(1.15).setDepth(250);
                AudioEngine.emit('ObjectDragged');
            });
            apple.on('drag', (_p, dx, dy) => { apple.x = dx; apple.y = dy; });
            apple.on('dragend', () => this.handleAppleDrop(apple));
            this.tweens.add({ targets: apple, y: oy - 4, duration: 1500 + i * 130, yoyo: true, repeat: -1 });
            apples.push(apple);
        }
        return apples;
    }

    handleAppleDrop(apple) {
        if (apple.getData('collected')) return;
        const z = this.basketZone;
        const inside = Math.abs(apple.x - z.x) < z.hw && Math.abs(apple.y - z.y) < z.hh;
        if (!inside) {
            this.recordFumble();
            this.tweens.add({
                targets: apple, x: apple.getData('ox'), y: apple.getData('oy'), scale: 1,
                duration: 350, ease: 'Back.easeOut',
                onComplete: () => apple.setDepth(120),
            });
            return;
        }
        apple.setData('collected', true);
        apple.removeAllListeners();
        this.collected++;
        this.analytics.recordExploration(1, 0);
        AudioEngine.emit('ObjectCollected', { count: this.collected });
        this.tweens.add({
            targets: apple, x: z.x, y: z.y - 10, scale: 0.4, duration: 300,
            onComplete: () => {
                apple.setDepth(59);
                this.basketCounter.setText(String(this.collected));
                this.tweens.add({ targets: this.basketCounter, scale: 1.4, duration: 150, yoyo: true });
                this.spawnSparkles(z.x, z.y - 30, 5);
                if (this.collected >= this.roundTarget) {
                    this.finishAppleRound();
                }
            },
        });
    }

    finishAppleRound() {
        // Reveal the equation the child just built: a + b = total
        const eq = this.equationText.text;
        this.equationText.setText(eq.replace('?', String(this.roundTarget)));
        this.answerCorrect(this.basketZone.x, this.basketZone.y - 60);
    }

    // ════════════════════════════════════════
    //  Màn 2 — Đường Pha Lê (choose the path, a+b ≤ 10)
    // ════════════════════════════════════════

    presentCrystalPaths(diff) {
        const w = this.cameras.main.width;
        const h = this.cameras.main.height;
        const max = diff.mathRange;
        const a = Phaser.Math.Between(2, max - 2);
        const b = Phaser.Math.Between(2, max - a);
        const correct = a + b;
        this.expected = correct; // debug/test hook
        const choiceCount = diff.choiceCount;

        // Problem panel
        const panel = this.track(this.add.container(w / 2, 112).setDepth(150));
        const pbg = this.add.graphics();
        pbg.fillStyle(0x5c3a1e, 0.92);
        pbg.fillRoundedRect(-160, -30, 320, 60, 16);
        pbg.lineStyle(3, 0xffd700, 0.8);
        pbg.strokeRoundedRect(-160, -30, 320, 60, 16);
        panel.add(pbg);
        panel.add(this.add.text(0, 0, `${a} + ${b} = ?`, {
            fontSize: '32px', fontFamily: 'Comic Sans MS, Arial', fontStyle: 'bold', color: '#fff',
            stroke: '#000', strokeThickness: 2,
        }).setOrigin(0.5));

        // Distractors near the answer
        const wrongs = new Set();
        while (wrongs.size < choiceCount - 1) {
            const v = Phaser.Math.Between(Math.max(2, correct - 4), Math.min(max, correct + 4));
            if (v !== correct) wrongs.add(v);
        }
        const options = Phaser.Utils.Array.Shuffle([correct, ...wrongs]);

        // Paths: vertical lanes with a sign at the bottom
        const laneW = Math.min(220, w * 0.2);
        const gap = 30;
        const totalW = options.length * laneW + (options.length - 1) * gap;
        const startX = (w - totalW) / 2 + laneW / 2;
        const bunnyY = h * 0.82;

        this.actor = this.track(this.add.image(w / 2, bunnyY,
            this.textures.exists('spr_bunny_hop') ? 'spr_bunny_hop' : 'spr_bunny_idle').setDepth(100));
        const tex = this.actor.texture.getSourceImage();
        this.actor.setScale(90 / tex.height);

        options.forEach((val, i) => {
            const cx = startX + i * (laneW + gap);
            // Path
            const path = this.add.graphics();
            path.fillStyle(0xd7ccc8, 0.55);
            path.fillRoundedRect(cx - laneW / 2 + 20, h * 0.3, laneW - 40, bunnyY - h * 0.3 - 30, 20);
            this.track(path).setDepth(40);
            // Crystals along path
            for (let k = 0; k < 3; k++) {
                const cy = h * 0.36 + k * ((bunnyY - h * 0.42) / 2.4);
                const gem = this.track(this.add.text(cx, cy, '💎', { fontSize: '30px' }).setOrigin(0.5).setDepth(50));
                this.tweens.add({ targets: gem, y: cy - 5, duration: 1200 + k * 200, yoyo: true, repeat: -1 });
            }
            // Sign
            const sign = this.track(this.add.container(cx, h * 0.24).setDepth(150));
            const sbg = this.add.graphics();
            sbg.fillStyle(0x8d6e63, 1);
            sbg.fillRoundedRect(-52, -30, 104, 60, 12);
            sbg.lineStyle(4, 0x5d4037, 1);
            sbg.strokeRoundedRect(-52, -30, 104, 60, 12);
            sign.add(sbg);
            sign.add(this.add.text(0, 0, String(val), {
                fontSize: '32px', fontFamily: 'Comic Sans MS, Arial', fontStyle: 'bold',
                color: '#ffd700', stroke: '#000', strokeThickness: 3,
            }).setOrigin(0.5));
            setCenteredInput(sign, 116, 72);
            sign.on('pointerdown', () => {
                if (!this.acceptingInput || this.isPaused) return;
                if (val === correct) {
                    this.runPath(cx, bunnyY);
                } else {
                    this.shake(sign);
                    this.answerWrong(cx, h * 0.24);
                }
            });
            sign.setScale(0);
            this.tweens.add({ targets: sign, scale: 1, duration: 300, delay: i * 100, ease: 'Back.easeOut' });
        });
    }

    runPath(cx, bunnyY) {
        this.acceptingInput = false;
        const h = this.cameras.main.height;
        this.tweens.add({
            targets: this.actor, x: cx, duration: 350, ease: 'Power2',
            onComplete: () => {
                this.tweens.add({
                    targets: this.actor, y: h * 0.34, duration: 900, ease: 'Sine.easeInOut',
                    onUpdate: () => {
                        this.spawnSparkles(this.actor.x, this.actor.y + 20, 1);
                    },
                    onComplete: () => this.answerCorrect(cx, h * 0.3),
                });
            },
        });
    }

    // ════════════════════════════════════════
    //  Màn 3 — Nhiệm Vụ Pha Lê (story: a − b + c ≤ 20)
    // ════════════════════════════════════════

    presentCrystalQuest(diff) {
        const w = this.cameras.main.width;
        const h = this.cameras.main.height;
        const max = diff.mathRange;
        const a = Phaser.Math.Between(8, Math.min(15, max));
        const b = Phaser.Math.Between(2, a - 2);
        const c = Phaser.Math.Between(2, Math.min(9, max - (a - b)));
        const correct = a - b + c;
        this.expected = correct; // debug/test hook

        // Story panel
        const panel = this.track(this.add.container(w / 2, 116).setDepth(150));
        const pbg = this.add.graphics();
        pbg.fillStyle(0x4a148c, 0.9);
        pbg.fillRoundedRect(-330, -44, 660, 88, 18);
        pbg.lineStyle(3, 0xffd700, 0.8);
        pbg.strokeRoundedRect(-330, -44, 660, 88, 18);
        panel.add(pbg);
        panel.add(this.add.text(0, 0,
            `Bunnine có ${a} 💎 · dùng ${b} 💎 · tìm thêm ${c} 💎\nHỏi Bunnine còn bao nhiêu 💎?`, {
            fontSize: '22px', fontFamily: 'Comic Sans MS, Arial', fontStyle: 'bold', color: '#fff',
            align: 'center', stroke: '#000', strokeThickness: 2,
        }).setOrigin(0.5));

        // Animated crystal stage: a appear → b fly away → c fly in
        const stageY = h * 0.42;
        const gems = [];
        const perRow = Math.min(a, 10);
        for (let i = 0; i < a; i++) {
            const gx = w / 2 + (i - (perRow - 1) / 2) * 44 - (i >= 10 ? 0 : 0);
            const gy = stageY + Math.floor(i / 10) * 44;
            const gem = this.track(this.add.text(gx, gy, '💎', { fontSize: '30px' }).setOrigin(0.5).setDepth(120).setScale(0));
            gems.push(gem);
            this.tweens.add({ targets: gem, scale: 1, duration: 200, delay: 200 + i * 70, ease: 'Back.easeOut' });
        }
        const t1 = 300 + a * 70 + 500;
        for (let i = 0; i < b; i++) {
            const gem = gems[a - 1 - i];
            this.tweens.add({
                targets: gem, y: gem.y - 90, alpha: 0, duration: 500, delay: t1 + i * 160,
            });
        }
        const t2 = t1 + b * 160 + 400;
        for (let i = 0; i < c; i++) {
            const gx = w / 2 + (i - (c - 1) / 2) * 44;
            const gem = this.track(this.add.text(gx, stageY + 110, '✨', { fontSize: '30px' }).setOrigin(0.5).setDepth(120).setAlpha(0));
            this.tweens.add({ targets: gem, alpha: 1, y: stageY + 96, duration: 400, delay: t2 + i * 160 });
        }

        // Choices appear after the story animation
        const wrongs = new Set();
        while (wrongs.size < diff.choiceCount - 1) {
            const v = Phaser.Math.Between(Math.max(1, correct - 5), correct + 5);
            if (v !== correct) wrongs.add(v);
        }
        const options = Phaser.Utils.Array.Shuffle([correct, ...wrongs])
            .map(v => ({ label: v, value: v }));

        this.time.delayedCall(Math.min(t2 + c * 160 + 300, 6000), () => {
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
        if (this.level === 2 && hint.style === 'direct') return; // L2 partial: text only
        if (this.level === 1 && hint.style === 'direct' && this.basketZone) {
            const z = this.basketZone;
            const ring = this.add.graphics().setDepth(300);
            ring.lineStyle(5, 0xffd700, 0.9);
            ring.strokeRoundedRect(z.x - z.hw, z.y - z.hh, z.hw * 2, z.hh * 2, 20);
            this.tweens.add({ targets: ring, alpha: 0, duration: 1800, onComplete: () => ring.destroy() });
        }
    }
}
