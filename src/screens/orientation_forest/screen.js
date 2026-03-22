/**
 * screen.js — OrientationForestScreen (Khu Rừng Định Hướng).
 *
 * Visual-first: vật (cluePool) xuất hiện ở vị trí tương đối so với Sóc →
 * trẻ chọn mũi tên đúng hướng. Không phụ thuộc text, voice là kênh chính.
 */
class OrientationForestScreen extends Phaser.Scene {
    constructor() {
        super({ key: 'OrientationForestScreen' });
        this.totalPuzzles = 6;
        this.currentRound = 0;
        this.solvedCount = 0;
        this.checkingAnswer = false;
        this.currentProblem = null;
        this.levelBGM = null;
        this.currentVoice = null;
        this.roundRoot = null;
        this.squirrelCharacter = null;
        this.squirrel = null;
        this.squirrelBubble = null;
        this.signProgressSlots = [];
        this.signProgressTitle = null;
        this.questionHistory = [];
        this.collectedDirections = [];
        this.collectedClues = [];
        this.butterflies = [];
        this.fireflies = [];
        this.magicParticles = [];
        this.theme = typeof OrientationForestPuzzle !== 'undefined' ? OrientationForestPuzzle : null;
        this.usesArtBackground = false;
        this.dialogueIndex = 0;
        this.levelBgVideo = null;
        this._clueObj = null;
        this._clueRing = null;
        this._squirrelPlatform = null;
    }

    preload() {
        const bg = this.theme?.background;
        if (typeof ScreenLevelBackground !== 'undefined' && bg) {
            ScreenLevelBackground.registerLevelBackground(this, bg, {
                bgmKey: 'bgm_orientation_forest',
                bgmUrl: 'screens/orientation_forest/assets/audio/bgm/bgm.wav',
            });
        } else {
            this.load.image('orientation_forest_bg', 'screens/orientation_forest/assets/backgrounds/bg.png');
            this.load.audio('bgm_orientation_forest', 'screens/orientation_forest/assets/audio/bgm/bgm.wav');
        }
        this.load.audio('voice_intro_1', 'screens/orientation_forest/assets/audio/voice/intro_1.mp3');
        this.load.audio('voice_intro_2', 'screens/orientation_forest/assets/audio/voice/intro_2.mp3');
        this.load.audio('voice_intro_3', 'screens/orientation_forest/assets/audio/voice/intro_3.mp3');
        this.load.audio('voice_correct', 'screens/orientation_forest/assets/audio/voice/correct_answer.mp3');
        this.load.audio('voice_wrong', 'screens/orientation_forest/assets/audio/voice/wrong_answer.mp3');
        this.load.audio('voice_complete', 'screens/orientation_forest/assets/audio/voice/level_complete.mp3');
    }

    create() {
        const w = this.cameras.main.width;
        const h = this.cameras.main.height;
        this.sound.stopAll();
        this.playLevelBGM();
        this.createBackground(w, h);
        this.createSignProgressRow(w, h);
        this.createSquirrel(w, h);
        this.createAmbientCreatures(w, h);
        this.scene.launch('UIScreen');
        this.time.delayedCall(400, () => this.showIntroductionDialogue());
    }

    /* ─── Layout ─── */

    L() {
        const w = this.cameras.main.width;
        const h = this.cameras.main.height;
        const hudH = 80;
        const play = h - hudH;
        return {
            w, h, hudH,
            squirrelX: Math.round(w * 0.50),
            squirrelY: Math.round(hudH + play * 0.32),
            clueOffset: Phaser.Math.Clamp(Math.round(Math.min(w, play) * 0.19), 100, 170),
            btnY: Math.round(hudH + play * 0.68),
            btnSize: Phaser.Math.Clamp(Math.round(Math.min(w, play) * 0.115), 68, 100),
            btnGap: Phaser.Math.Clamp(Math.round(w * 0.025), 14, 30),
            progressY: Math.round(hudH + play * 0.87),
        };
    }

    /* ─── Background ─── */

    createBackground(w, h) {
        const bg = this.theme?.background;
        let mode = 'none';
        if (typeof ScreenLevelBackground !== 'undefined' && bg) {
            mode = ScreenLevelBackground.createLayer(this, w, h, bg, { depth: 0, videoRef: 'levelBgVideo' });
        } else if (this.textures.exists('orientation_forest_bg')) {
            this.add.image(w / 2, h / 2, 'orientation_forest_bg').setDisplaySize(w, h).setDepth(0);
            mode = 'image';
        }
        this.usesArtBackground = mode === 'image' || mode === 'video';
        if (mode === 'none') {
            const g = this.add.graphics().setDepth(0);
            g.fillGradientStyle(0x90ee90, 0x98fb98, 0x228b22, 0x2e8b57, 1);
            g.fillRect(0, 0, w, h * 0.55);
            g.fillStyle(0x6b8e23);
            g.fillRect(0, h * 0.55, w, h * 0.45);
        }
    }

    /* ─── Squirrel (centered for visual puzzle) ─── */

    createSquirrel(w, h) {
        if (typeof SquirrelCharacter === 'undefined') return;
        const l = this.L();
        this.squirrelCharacter = new SquirrelCharacter(this);
        this.squirrel = this.squirrelCharacter.create({
            width: w, height: h, usesArtBackground: this.usesArtBackground,
        });
        this.tweens.killTweensOf(this.squirrel);
        this.squirrel.setPosition(l.squirrelX, l.squirrelY);
        this.squirrelCharacter.startIdleMotion();

        this._squirrelPlatform = this.add.graphics().setDepth(24);
        this._squirrelPlatform.fillStyle(0xffffff, 0.18);
        this._squirrelPlatform.fillCircle(l.squirrelX, l.squirrelY + 18, 34);
        this._squirrelPlatform.lineStyle(2, 0xffffff, 0.28);
        this._squirrelPlatform.strokeCircle(l.squirrelX, l.squirrelY + 18, 34);
    }

    /* ─── Speech bubble (minimal text — voice is primary) ─── */

    showSquirrelBubble(text, durationMs) {
        if (this.squirrelBubble) { this.squirrelBubble.destroy(); this.squirrelBubble = null; }
        if (!this.squirrel?.scene) return;
        const w = this.cameras.main.width;
        const bx = Phaser.Math.Clamp(this.squirrel.x + 70, 130, w - 130);
        const by = this.squirrel.y - 95;
        const wrap = Math.min(400, w * 0.52);

        const t = this.add.text(bx, by, text, {
            fontSize: '22px', fontFamily: 'Comic Sans MS, Arial', color: '#2d4a1c', fontStyle: 'bold',
            align: 'center', wordWrap: { width: wrap }, backgroundColor: '#f5ffe8', padding: { x: 14, y: 10 },
        }).setOrigin(0.5).setDepth(60);

        this.squirrelBubble = t;
        t.setAlpha(0);
        this.tweens.add({ targets: t, alpha: 1, y: by - 6, duration: 250, ease: 'Back.easeOut' });
        this.time.delayedCall(durationMs || 3500, () => {
            if (!t.active) return;
            this.tweens.add({
                targets: t, alpha: 0, y: by - 18, duration: 300,
                onComplete: () => { t.destroy(); if (this.squirrelBubble === t) this.squirrelBubble = null; },
            });
        });
    }

    /* ─── Progress row (visual — emoji slots) ─── */

    createSignProgressRow(w, h) {
        const l = this.L();
        const count = this.totalPuzzles;
        const slotR = 32;
        const gap = 10;
        const totalW = count * slotR * 2 + (count - 1) * gap;
        const startX = (w - totalW) / 2 + slotR;

        this.signProgressSlots = [];
        for (let i = 0; i < count; i++) {
            const x = startX + i * (slotR * 2 + gap);
            const slot = this.add.container(x, l.progressY).setDepth(21);
            const bg = this.add.graphics();
            bg.fillStyle(0xffffff, 0.32);
            bg.lineStyle(3, 0x228b22, 0.85);
            bg.strokeCircle(0, 0, slotR);
            bg.fillCircle(0, 0, slotR);
            const label = this.add.text(0, 0, '·', { fontSize: '28px', color: '#bbb' }).setOrigin(0.5);
            slot.add([bg, label]);
            this.signProgressSlots.push({ container: slot, label, filled: false });
        }

        this.signProgressTitle = this.add.text(w / 2, l.progressY - 44,
            `🪧 ${this.solvedCount} / ${count}`, {
                fontSize: '20px', fontFamily: 'Comic Sans MS, Arial', fontStyle: 'bold',
                color: '#fffef0', stroke: '#1a3d14', strokeThickness: 3,
            }).setOrigin(0.5).setDepth(22);
    }

    updateSignProgressTitle() {
        if (this.signProgressTitle) {
            this.signProgressTitle.setText(`🪧 ${this.solvedCount} / ${this.totalPuzzles}`);
        }
    }

    fillSignProgressSlot(index, emoji) {
        const slot = this.signProgressSlots[index];
        if (!slot || slot.filled) return;
        slot.filled = true;
        slot.label.setText(emoji).setFontSize(36).setScale(0.2);
        this.tweens.add({
            targets: slot.label, scale: 1.05, duration: 350, ease: 'Back.easeOut', yoyo: true,
            onComplete: () => this.tweens.add({ targets: slot.label, scale: 1, duration: 100 }),
        });
    }

    /* ─── Round logic ─── */

    choiceCountForRound() {
        if (this.currentRound <= 1) return 2;
        if (this.currentRound <= 3) return 3;
        return 4;
    }

    clearRoundUI() {
        if (this.roundRoot) { this.roundRoot.destroy(true); this.roundRoot = null; }
        this._clueObj = null;
        this._clueRing = null;
    }

    clueOffset(dirId) {
        const d = this.L().clueOffset;
        switch (dirId) {
            case 'left': return { dx: -d, dy: 0 };
            case 'right': return { dx: d, dy: 0 };
            case 'forward': return { dx: 0, dy: -d * 0.85 };
            case 'back': return { dx: 0, dy: d * 0.75 };
            default: return { dx: 0, dy: -d };
        }
    }

    startRound() {
        if (this.currentRound >= this.totalPuzzles) { this.completeLevel(); return; }
        this.clearRoundUI();
        const numChoices = this.choiceCountForRound();
        const fallback = { clueEmoji: '🌳', correctId: 'left',
            choices: (this.theme?.directionPool || OrientationForestPuzzle.directionPool).slice(0, numChoices) };
        const prob = this.theme?.buildRound
            ? this.theme.buildRound(numChoices, this.questionHistory)
            : fallback;
        this.currentProblem = prob;

        const l = this.L();
        const root = this.add.container(0, 0).setDepth(50);
        this.roundRoot = root;

        this.buildVisualClue(root, prob, l);
        this.buildArrowButtons(root, prob, l);
    }

    /** Hiển thị vật clue tại vị trí tương đối so với Sóc + vòng sáng. */
    buildVisualClue(root, prob, l) {
        if (!this.squirrel) return;
        const cx = this.squirrel.x;
        const cy = this.squirrel.y;
        const { dx, dy } = this.clueOffset(prob.correctId);
        const clueX = cx + dx;
        const clueY = cy + dy;

        const ring = this.add.graphics().setDepth(49);
        ring.fillStyle(0xfff8dc, 0.22);
        ring.fillCircle(clueX, clueY, 46);
        ring.lineStyle(3, 0xffd700, 0.7);
        ring.strokeCircle(clueX, clueY, 46);
        root.add(ring);
        this._clueRing = ring;

        this.tweens.add({
            targets: ring, alpha: 0.45, duration: 900, yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
        });

        const emoji = this.add.text(clueX, clueY, prob.clueEmoji, {
            fontSize: '50px', fontFamily: 'Arial',
        }).setOrigin(0.5).setDepth(51);
        root.add(emoji);
        this._clueObj = emoji;

        emoji.setScale(0);
        this.tweens.add({
            targets: emoji, scale: 1, duration: 420, ease: 'Back.easeOut',
        });

        this.tweens.add({
            targets: emoji, y: clueY - 5, duration: 1600,
            yoyo: true, repeat: -1, ease: 'Sine.easeInOut', delay: 450,
        });
    }

    /** Nút mũi tên tròn lớn — không label chữ. */
    buildArrowButtons(root, prob, l) {
        const { btnY, btnSize, btnGap } = l;
        const n = prob.choices.length;
        const totalW = n * btnSize + (n - 1) * btnGap;
        let sx = l.w / 2 - totalW / 2 + btnSize / 2;

        const palettes = [
            { fill: 0x98d98e, border: 0x228b22 },
            { fill: 0xb0e0e6, border: 0x4682b4 },
            { fill: 0xf0e68c, border: 0xdaa520 },
            { fill: 0xffb6c1, border: 0xdb7093 },
        ];

        prob.choices.forEach((dir, i) => {
            const pal = palettes[i % palettes.length];
            const r = btnSize / 2;
            const g = this.add.graphics();
            g.fillStyle(pal.fill, 1);
            g.fillCircle(0, 0, r);
            g.lineStyle(4, pal.border, 1);
            g.strokeCircle(0, 0, r);

            const arrow = this.add.text(0, 0, dir.icon, {
                fontSize: Math.round(btnSize * 0.48) + 'px',
                fontFamily: 'Arial', fontStyle: 'bold', color: '#1a1a1a',
            }).setOrigin(0.5);

            const btn = this.add.container(sx, btnY).setSize(btnSize, btnSize).setDepth(51);
            btn.add([g, arrow]);
            btn.setInteractive({ useHandCursor: true });
            btn.setData('directionId', dir.id);
            btn.setData('btnGraphics', g);
            btn.setData('btnLabel', arrow);

            btn.on('pointerover', () => { if (!this.checkingAnswer) this.tweens.add({ targets: btn, scale: 1.12, duration: 100 }); });
            btn.on('pointerout', () => this.tweens.add({ targets: btn, scale: 1, duration: 100 }));
            btn.on('pointerdown', () => {
                if (this.checkingAnswer) return;
                this.onDirectionTap(dir.id, btn);
            });

            this.tweens.add({
                targets: btn, y: btnY - 3, duration: 1850 + i * 70,
                yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
            });
            root.add(btn);
            sx += btnSize + btnGap;
        });
    }

    /* ─── Answer handling ─── */

    onDirectionTap(directionId, btn) {
        if (this.checkingAnswer || !this.currentProblem) return;
        if (directionId === this.currentProblem.correctId) this.onCorrectAnswer();
        else this.onWrongAnswer(directionId, btn);
    }

    onCorrectAnswer() {
        this.checkingAnswer = true;
        this.emitThemeEvent(this.theme?.events?.correct);
        this.playVoice('voice_correct');

        const prob = this.currentProblem;
        const dir = this.theme?.byId ? this.theme.byId(prob.correctId) : { icon: '↑' };
        if (this.squirrelCharacter) {
            this.squirrelCharacter.turnTo(prob.correctId);
            this.time.delayedCall(200, () => this.squirrelCharacter.hopJoy());
        }

        this.flyClueToSquirrel(prob.clueEmoji || '⭐');
        const idx = this.solvedCount;
        this.time.delayedCall(400, () => {
            this.fillSignProgressSlot(idx, prob.clueEmoji || dir.icon);
            this.updateSignProgressTitle();
        });

        const emojiBubbles = ['👍 ✨', '🎉 🎉', '⭐ ✅', '💪 🌟'];
        this.showSquirrelBubble(emojiBubbles[this.solvedCount % emojiBubbles.length], 2200);

        this.collectedDirections.push(prob.correctId);
        this.collectedClues.push(prob.clueEmoji || '⭐');
        this.emitThemeEvent(this.theme?.events?.directionCollected);

        this.solvedCount++;
        this.currentRound++;
        this.time.delayedCall(2200, () => { this.checkingAnswer = false; this.startRound(); });
    }

    onWrongAnswer(wrongId, btn) {
        this.checkingAnswer = true;
        this.emitThemeEvent(this.theme?.events?.wrong);
        this.playVoice('voice_wrong');
        this.showSquirrelBubble('🤔 ❌', 2400);
        if (this.squirrelCharacter) this.squirrelCharacter.turnWrong(wrongId);

        if (btn?.active) {
            const ox = btn.x;
            this.tweens.add({ targets: btn, x: ox - 8, duration: 55, yoyo: true, repeat: 5, onComplete: () => btn.setX(ox) });
            const g = btn.getData('btnGraphics');
            const arrow = btn.getData('btnLabel');
            [g, arrow].forEach(o => {
                if (o) {
                    this.tweens.add({ targets: o, alpha: 0.35, duration: 180 });
                    this.time.delayedCall(900, () => { if (o?.scene) this.tweens.add({ targets: o, alpha: 1, duration: 250 }); });
                }
            });
        }

        if (this._clueObj?.active) {
            this.tweens.add({
                targets: this._clueObj, scale: 1.35, duration: 200,
                yoyo: true, repeat: 2, ease: 'Sine.easeInOut',
            });
        }
        if (this._clueRing?.active) {
            this._clueRing.setAlpha(1);
            this.tweens.add({
                targets: this._clueRing, alpha: 0.5, duration: 250,
                yoyo: true, repeat: 3,
            });
        }

        this.time.delayedCall(600, () => { this.checkingAnswer = false; });
    }

    /** Clue emoji bay từ vị trí hiện tại đến Sóc. */
    flyClueToSquirrel(emoji) {
        if (!this.squirrel) return;
        const from = this._clueObj;
        const fx = from?.x || this.cameras.main.width / 2;
        const fy = from?.y || this.L().squirrelY - 80;

        const item = this.add.text(fx, fy, emoji, { fontSize: '52px', fontFamily: 'Arial' })
            .setOrigin(0.5).setDepth(200);
        item.setScale(0.4);
        this.tweens.add({
            targets: item, scale: 1.2, duration: 200, ease: 'Back.easeOut',
            onComplete: () => {
                this.tweens.add({
                    targets: item, x: this.squirrel.x, y: this.squirrel.y - 18,
                    scale: 0.85, alpha: 0.7, duration: 600, ease: 'Cubic.easeInOut',
                    onComplete: () => item.destroy(),
                });
            },
        });
    }

    /* ─── Level complete ─── */

    completeLevel() {
        this.clearRoundUI();
        this.checkingAnswer = true;
        this.emitThemeEvent(this.theme?.events?.levelComplete);

        if (typeof ScreenLevelBackground !== 'undefined') {
            ScreenLevelBackground.fadeOutBackgroundMedia(this, {
                soundProp: 'levelBGM', videoProp: 'levelBgVideo', duration: 450,
            });
        } else if (this.levelBGM) {
            this.tweens.add({
                targets: this.levelBGM, volume: 0, duration: 450,
                onComplete: () => { if (this.levelBGM) { this.levelBGM.stop(); this.levelBGM.destroy(); this.levelBGM = null; } },
            });
        }
        this.time.delayedCall(500, () => this.runForestCompleteSequence());
    }

    drawLitPath(w, h) {
        const pathG = this.add.graphics().setDepth(15);
        const y0 = h * 0.72;
        const x0 = this.squirrel ? this.squirrel.x : w * 0.5;
        const xm = w * 0.6;
        const x1 = w * 0.8;
        pathG.lineStyle(14, 0xffd700, 0.55);
        pathG.beginPath();
        pathG.moveTo(x0, y0);
        pathG.lineTo(xm, y0 - 28);
        pathG.lineTo(x1, y0 - 12);
        pathG.strokePath();
        pathG.setAlpha(0);
        this.tweens.add({ targets: pathG, alpha: 1, duration: 700, ease: 'Sine.easeOut' });
        return pathG;
    }

    buildFriendsGroup(x, y) {
        const grp = this.add.container(x, y).setDepth(33).setAlpha(0);
        const makeRabbit = (ox, tint) => {
            const c = this.add.container(ox, 0);
            const body = this.add.graphics();
            body.fillStyle(tint, 1);
            body.fillEllipse(0, 6, 28, 22);
            const head = this.add.graphics();
            head.fillStyle(tint, 1);
            head.fillCircle(0, -8, 14);
            const earL = this.add.graphics();
            earL.fillStyle(tint, 1);
            earL.fillTriangle(-6, -18, -10, -32, -2, -22);
            const earR = this.add.graphics();
            earR.fillStyle(tint, 1);
            earR.fillTriangle(6, -18, 10, -32, 2, -22);
            c.add([body, head, earL, earR]);
            return c;
        };
        grp.add([makeRabbit(-36, 0xe8c4c4), makeRabbit(28, 0xd4a574)]);
        grp.setScale(0.85);
        return grp;
    }

    runForestCompleteSequence() {
        const w = this.cameras.main.width;
        const h = this.cameras.main.height;

        this.createSparkles(w / 2, h / 2, 18);
        this.drawLitPath(w, h);

        const friends = this.buildFriendsGroup(w * 0.8, h * 0.62);
        this.tweens.add({ targets: friends, alpha: 1, duration: 600, delay: 400, ease: 'Quad.easeOut' });

        if (this.squirrel) {
            this.tweens.killTweensOf(this.squirrel);
            if (this.squirrelCharacter) this.squirrelCharacter.turnTo('forward');
            this.tweens.add({
                targets: this.squirrel, x: w * 0.62, y: h * 0.6, duration: 1200, ease: 'Cubic.easeInOut', delay: 500,
                onComplete: () => {
                    this.createSparkles(this.squirrel.x, this.squirrel.y - 20, 12);
                    this.squirrelCharacter?.hopJoy();
                },
            });
        }

        this.playVoice('voice_complete');
        this.showSquirrelBubble('🎉 ❤️ ✨', 4000);
        this.time.delayedCall(3800, () => this.showRewardPanel());
    }

    /* ─── Reward panel (emoji-heavy, minimal text) ─── */

    showRewardPanel() {
        const w = this.cameras.main.width;
        const h = this.cameras.main.height;

        const overlay = this.add.graphics().setDepth(250);
        overlay.fillStyle(0x000000, 0.55);
        overlay.fillRect(0, 0, w, h);

        const pw = Math.min(w * 0.62, 520);
        const ph = Math.min(h * 0.52, 380);
        const px = (w - pw) / 2;
        const py = (h - ph) / 2;

        const panel = this.add.graphics().setDepth(251);
        panel.fillStyle(0xf5fff0, 0.97);
        panel.fillRoundedRect(px, py, pw, ph, 20);
        panel.lineStyle(4, 0x228b22, 1);
        panel.strokeRoundedRect(px, py, pw, ph, 20);

        this.add.text(w / 2, py + ph * 0.14, '🌳 ⭐ 🎉', {
            fontSize: '38px', fontFamily: 'Arial',
        }).setOrigin(0.5).setDepth(252);

        const clueIcons = this.collectedClues.join('  ') || '🌳 🍄 🌸 🦋 ⭐ 🎈';
        this.add.text(w / 2, py + ph * 0.38, clueIcons, {
            fontSize: '38px', fontFamily: 'Arial',
        }).setOrigin(0.5).setDepth(252);

        const arrows = this.collectedDirections.map(id => (this.theme?.byId(id)?.icon) || '?').join('  ');
        this.add.text(w / 2, py + ph * 0.56, arrows || '← → ↑ ↓', {
            fontSize: '30px', fontFamily: 'Arial', color: '#3a6b3a',
        }).setOrigin(0.5).setDepth(252);

        const btnW = 200;
        const btnH = 54;
        const btnY = py + ph * 0.8;
        const btnBg = this.add.graphics().setDepth(252);
        btnBg.fillStyle(0x2d5016);
        btnBg.fillRoundedRect(w / 2 - btnW / 2, btnY - btnH / 2, btnW, btnH, 12);
        btnBg.lineStyle(3, 0x9acd32);
        btnBg.strokeRoundedRect(w / 2 - btnW / 2, btnY - btnH / 2, btnW, btnH, 12);

        this.add.zone(w / 2, btnY, btnW, btnH).setInteractive({ useHandCursor: true }).setDepth(253)
            .on('pointerdown', () => {
                this.sound.stopAll();
                this.scene.stop('UIScreen');
                this.scene.start('MenuScreen');
            });

        this.add.text(w / 2, btnY, '▶', {
            fontSize: '28px', fontFamily: 'Arial', fontStyle: 'bold', color: '#c8f7c5',
        }).setOrigin(0.5).setDepth(253);
    }

    /* ─── Intro (voice is primary — bubbles use emoji) ─── */

    showIntroductionDialogue() {
        const dialogues = [
            { text: '😱 🐿️ ❓', voiceKey: 'voice_intro_1', duration: 5000 },
            { text: '🪧 ← → ↑ ↓ ❌', voiceKey: 'voice_intro_2', duration: 5000 },
            { text: '👆 🐿️ ✨', voiceKey: 'voice_intro_3', duration: 5000 },
        ];
        this.dialogueIndex = 0;
        this.showDialogueSequenceWithVoice(dialogues, () => this.startRound());
    }

    showDialogueSequenceWithVoice(dialogues, onComplete) {
        if (this.dialogueIndex >= dialogues.length) {
            this.dialogueIndex = 0;
            if (onComplete) onComplete();
            return;
        }
        const d = dialogues[this.dialogueIndex];
        this.showSquirrelBubble(d.text, d.duration);
        this.playVoice(d.voiceKey);
        this.dialogueIndex++;
        this.time.delayedCall(d.duration + 500, () => this.showDialogueSequenceWithVoice(dialogues, onComplete));
    }

    /* ─── Audio ─── */

    playLevelBGM() {
        if (typeof ScreenLevelBackground !== 'undefined' && ScreenLevelBackground.hasLoadedVideo(this)) return;
        if (this.cache.audio.exists('bgm_orientation_forest') && window.gameData?.musicEnabled !== false) {
            this.levelBGM = this.sound.add('bgm_orientation_forest', { volume: 0.42, loop: true });
            this.levelBGM.play();
        }
    }

    playVoice(key) {
        if (this.currentVoice) { this.currentVoice.stop(); this.currentVoice = null; }
        if (this.cache.audio.exists(key)) {
            this.currentVoice = this.sound.add(key, { volume: 0.4 });
            this.currentVoice.play();
        }
    }

    emitThemeEvent(name) {
        if (this.events && name) this.events.emit(name);
    }

    /* ─── Ambient ─── */

    createSparkles(x, y, count) {
        const colors = [0xffd700, 0x98fb98, 0x87ceeb, 0xff69b4, 0xfffacd];
        for (let i = 0; i < count; i++) {
            const s = this.add.graphics().setDepth(200);
            s.fillStyle(colors[Phaser.Math.Between(0, colors.length - 1)], 0.85);
            s.fillCircle(0, 0, Phaser.Math.Between(2, 5));
            s.setPosition(x, y);
            const a = Phaser.Math.DegToRad(Phaser.Math.Between(0, 360));
            const d = Phaser.Math.Between(28, 78);
            this.tweens.add({
                targets: s, x: x + Math.cos(a) * d, y: y + Math.sin(a) * d,
                alpha: 0, scale: 0, duration: 600, onComplete: () => s.destroy(),
            });
        }
    }

    createAmbientCreatures(w, h) {
        if (typeof generateButterflies === 'function' && typeof createMenuButterfly === 'function') {
            generateButterflies(this, 3).forEach(data => {
                const b = createMenuButterfly(this, data);
                if (b) { b.x = Phaser.Math.Between(w * 0.12, w * 0.88); b.y = Phaser.Math.Between(h * 0.18, h * 0.52); this.butterflies.push(b); }
            });
        }
        if (typeof generateFireflies === 'function' && typeof createMenuFirefly === 'function') {
            generateFireflies(this, 4).forEach(data => {
                const f = createMenuFirefly(this, data);
                if (f) { f.x = Phaser.Math.Between(w * 0.08, w * 0.92); f.y = Phaser.Math.Between(h * 0.22, h * 0.62); this.fireflies.push(f); }
            });
        }
        if (typeof generateMagicParticles === 'function' && typeof createMenuMagicParticle === 'function') {
            generateMagicParticles(this, 5).forEach(data => {
                const p = createMenuMagicParticle(this, data);
                if (p) { p.x = Phaser.Math.Between(w * 0.1, w * 0.9); p.y = Phaser.Math.Between(h * 0.28, h * 0.68); this.magicParticles.push(p); }
            });
        }
    }

    update() {
        const tick = (g) => g.forEach(o => { const bs = o.getData('behaviorSystem'); if (bs?.update) bs.update(g); });
        tick(this.butterflies);
        tick(this.fireflies);
        tick(this.magicParticles);
    }

    shutdown() {
        this.sound.stopAll();
        if (this.currentVoice) { this.currentVoice.stop(); this.currentVoice = null; }
        if (typeof ScreenLevelBackground !== 'undefined') {
            ScreenLevelBackground.destroyVideo(this, 'levelBgVideo');
        }
        if (this.levelBGM) { this.levelBGM.stop(); this.levelBGM = null; }
        this.clearRoundUI();
    }
}
