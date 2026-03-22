/**
 * screen.js — CountingForestScreen (Khu rừng đếm số). Load sau `puzzle.js`.
 * Gameplay: phép cộng a+b ≤ 10, kéo thẻ đáp án lên ván cầu, 10 ván. Xem story.md.
 */
class CountingForestScreen extends Phaser.Scene {
    constructor() {
        super({ key: 'CountingForestScreen' });
        this.planksRestored = 0;
        this.totalPlanks = 10;
        this.currentQuestion = null;
        this.checkingAnswer = false;
        this.draggedCard = null;
        this.wiseOwl = null;
        this.bridgePlanks = [];
        this.answerCards = [];
        this.questionGroup = null;
        this.levelBGM = null;
        this.currentVoice = null;
        this.dialogueIndex = 0;
        this.butterflies = [];
        this.fireflies = [];
        this.magicParticles = [];
    }

    preload() {
        this.load.image('counting_forest_bg', 'screens/counting_forest/assets/backgrounds/bg.png');
        this.load.audio('bgm_counting_forest', 'screens/counting_forest/assets/audio/bgm/bgm.wav');
        this.load.audio('voice_intro_1', 'screens/counting_forest/assets/audio/voice/intro_1.mp3');
        this.load.audio('voice_intro_2', 'screens/counting_forest/assets/audio/voice/intro_2.mp3');
        this.load.audio('voice_intro_3', 'screens/counting_forest/assets/audio/voice/intro_3.mp3');
        this.load.audio('voice_correct', 'screens/counting_forest/assets/audio/voice/correct_answer.mp3');
        this.load.audio('voice_wrong', 'screens/counting_forest/assets/audio/voice/wrong_answer.mp3');
        this.load.audio('voice_complete', 'screens/counting_forest/assets/audio/voice/level_complete.mp3');
    }

    create() {
        const w = this.cameras.main.width;
        const h = this.cameras.main.height;
        this.sound.stopAll();
        this.playLevelBGM();
        this.createBackground(w, h);
        this.createBridge(w, h);
        this.createWiseOwl(w, h);
        this.createAmbientCreatures(w, h);
        this.scene.launch('UIScreen');
        this.time.delayedCall(500, () => this.showIntroductionDialogue());
    }

    // ════════════════════════════════════════
    //  Layout — all positions derived from screen size
    // ════════════════════════════════════════

    L() {
        const w = this.cameras.main.width;
        const h = this.cameras.main.height;
        const hudH = 80;
        return {
            w, h, hudH,
            questionY: hudH + 50,
            cardY: hudH + 140,
            cardSize: Phaser.Math.Clamp(Math.round(w * 0.065), 64, 84),
            cardGap: Phaser.Math.Clamp(Math.round(w * 0.025), 16, 32),
            bridgeLeft: Math.round(w * 0.08),
            bridgeRight: Math.round(w * 0.92),
            bridgeY: Math.round(h * 0.7),
            plankH: Phaser.Math.Clamp(Math.round(h * 0.05), 28, 40),
            plankGap: 4,
            owlX: Math.round(w * 0.09),
            owlY: Math.round(h * 0.50),
        };
    }

    // ════════════════════════════════════════
    //  Background
    // ════════════════════════════════════════

    createBackground(w, h) {
        if (this.textures.exists('counting_forest_bg')) {
            this.add.image(w / 2, h / 2, 'counting_forest_bg').setDisplaySize(w, h).setDepth(0);
        } else {
            const g = this.add.graphics().setDepth(0);
            g.fillGradientStyle(0x87CEEB, 0x87CEEB, 0xFFE4B5, 0xFFE4B5, 1);
            g.fillRect(0, 0, w, h * 0.65);
            g.fillStyle(0x228B22);
            g.fillRect(0, h * 0.65, w, h * 0.35);
        }
    }

    // ════════════════════════════════════════
    //  Bridge — 10 planks
    // ════════════════════════════════════════

    createBridge() {
        const l = this.L();
        const totalW = l.bridgeRight - l.bridgeLeft;
        const plankW = (totalW - (this.totalPlanks - 1) * l.plankGap) / this.totalPlanks;

        this.bridgePlanks = [];
        for (let i = 0; i < this.totalPlanks; i++) {
            const x = l.bridgeLeft + i * (plankW + l.plankGap);
            const cx = x + plankW / 2;
            const cy = l.bridgeY;

            const container = this.add.container(cx, cy).setDepth(10);

            const broken = this.add.graphics();
            broken.fillStyle(0x654321, 0.75);
            broken.fillRoundedRect(-plankW / 2, -l.plankH / 2, plankW, l.plankH, 4);
            broken.lineStyle(2, 0x4A4A4A, 0.8);
            broken.strokeRoundedRect(-plankW / 2, -l.plankH / 2, plankW, l.plankH, 4);
            broken.lineStyle(1.5, 0x2A2A2A, 0.6);
            broken.beginPath();
            broken.moveTo(-plankW * 0.2, -l.plankH / 2);
            broken.lineTo(plankW * 0.15, l.plankH / 2);
            broken.strokePath();
            container.add(broken);

            this.tweens.add({
                targets: container, y: cy - 2,
                duration: 2000 + i * 80, yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
            });

            const dropZone = this.add.zone(cx, cy, plankW * 1.4, l.plankH * 2.8).setDepth(9);

            this.bridgePlanks.push({
                index: i, x, cx, cy, w: plankW, h: l.plankH,
                isRestored: false, container, broken, dropZone, highlight: null,
            });
        }
    }

    restorePlank(index, value) {
        const p = this.bridgePlanks[index];
        if (!p || p.isRestored) return;
        p.isRestored = true;
        this.planksRestored++;

        this.tweens.add({ targets: p.broken, alpha: 0, duration: 200, onComplete: () => p.broken.destroy() });

        const restored = this.add.graphics();
        restored.fillGradientStyle(0x9370DB, 0x9370DB, 0x7B52B5, 0x7B52B5, 1);
        restored.fillRoundedRect(-p.w / 2, -p.h / 2, p.w, p.h, 4);
        restored.lineStyle(3, 0xFFD700, 1);
        restored.strokeRoundedRect(-p.w / 2, -p.h / 2, p.w, p.h, 4);
        p.container.add(restored);

        const fs = Math.min(p.w * 0.4, p.h * 0.7, 22);
        p.container.add(
            this.add.text(0, 0, String(value), {
                fontSize: fs + 'px', fontFamily: 'Comic Sans MS, Arial', fontStyle: 'bold',
                color: '#FFD700', stroke: '#000', strokeThickness: 2,
            }).setOrigin(0.5).setDepth(20)
        );

        p.container.setScale(0);
        this.tweens.add({ targets: p.container, scale: 1, duration: 400, ease: 'Back.easeOut' });
        this.createSparkles(p.cx, p.cy, 15);
        this.createBunnyOnPlank(index);

        if (this.planksRestored >= this.totalPlanks) {
            this.time.delayedCall(600, () => this.completeLevel());
        }
    }

    createBunnyOnPlank(index) {
        const p = this.bridgePlanks[index];
        if (!p?.container) return;
        const sz = Math.min(p.w * 0.6, 28);
        let bunny;
        if (typeof BunnyCharacter !== 'undefined' && typeof BUNNY_CHARACTERS !== 'undefined') {
            const keys = Object.keys(BUNNY_CHARACTERS);
            const cfg = BUNNY_CHARACTERS[keys[Phaser.Math.Between(0, keys.length - 1)]];
            const tex = new BunnyCharacter(this, { ...cfg, size: sz }).generateTexture('jumping');
            bunny = this.add.image(0, -p.h * 0.8, tex).setOrigin(0.5);
        } else {
            bunny = this.add.circle(0, -p.h * 0.8, sz / 2, 0xFFFFFF).setOrigin(0.5);
        }
        bunny.setDepth(14);
        p.container.add(bunny);

        const hop = () => {
            if (!bunny.active) return;
            this.tweens.add({
                targets: bunny, y: bunny.y - Phaser.Math.Between(6, 12),
                duration: Phaser.Math.Between(300, 500), yoyo: true, ease: 'Power2',
                onComplete: () => { if (bunny.active) this.time.delayedCall(Phaser.Math.Between(600, 1400), hop); },
            });
        };
        this.time.delayedCall(Phaser.Math.Between(200, 600), hop);
    }

    // ════════════════════════════════════════
    //  Question generation + UI
    // ════════════════════════════════════════

    generateNewQuestion() {
        const a = Phaser.Math.Between(1, 9);
        const b = Phaser.Math.Between(1, 10 - a);
        const correct = a + b;

        const wrongs = new Set();
        while (wrongs.size < 2) {
            const v = Phaser.Math.Between(Math.max(2, correct - 4), Math.min(10, correct + 4));
            if (v !== correct) wrongs.add(v);
        }

        this.currentQuestion = {
            text: `${a} + ${b} = ?`,
            answers: Phaser.Utils.Array.Shuffle([correct, ...wrongs]),
            correctValue: correct,
        };

        this.clearQuestionUI();
        this.showQuestionUI();
    }

    clearQuestionUI() {
        if (this.questionGroup) { this.questionGroup.destroy(true); this.questionGroup = null; }
        this.answerCards.forEach(c => { if (c?.active) c.destroy(true); });
        this.answerCards = [];
    }

    showQuestionUI() {
        const l = this.L();
        const q = this.currentQuestion;

        const panelW = Math.min(l.w * 0.5, 460);
        const panelH = 54;
        this.questionGroup = this.add.container(l.w / 2, l.questionY).setDepth(150);

        const bg = this.add.graphics();
        bg.fillStyle(0x5C3A1E, 0.92);
        bg.fillRoundedRect(-panelW / 2, -panelH / 2, panelW, panelH, 14);
        bg.lineStyle(3, 0xFFD700, 0.8);
        bg.strokeRoundedRect(-panelW / 2, -panelH / 2, panelW, panelH, 14);
        this.questionGroup.add(bg);

        this.questionGroup.add(
            this.add.text(0, 0, q.text, {
                fontSize: '30px', fontFamily: 'Comic Sans MS, Arial', fontStyle: 'bold',
                color: '#fff', stroke: '#000', strokeThickness: 2,
            }).setOrigin(0.5)
        );

        this.createAnswerCards(l, q);
    }

    createAnswerCards(l, q) {
        const cw = l.cardSize;
        const ch = l.cardSize;
        const gap = l.cardGap;
        const n = q.answers.length;
        const totalW = n * cw + (n - 1) * gap;
        const startX = (l.w - totalW) / 2 + cw / 2;

        const palettes = [
            { fill: 0xFFB6C1, border: 0xFF69B4 },
            { fill: 0x90EE90, border: 0x32CD32 },
            { fill: 0x87CEEB, border: 0x4682B4 },
        ];

        q.answers.forEach((val, i) => {
            const cx = startX + i * (cw + gap);
            const cy = l.cardY;
            const pal = palettes[i % palettes.length];

            const card = this.add.container(cx, cy).setSize(cw, ch).setDepth(150);

            const bg = this.add.graphics();
            bg.fillStyle(pal.fill, 1);
            bg.fillRoundedRect(-cw / 2, -ch / 2, cw, ch, 12);
            bg.lineStyle(3, pal.border, 1);
            bg.strokeRoundedRect(-cw / 2, -ch / 2, cw, ch, 12);
            card.add(bg);

            const fs = Math.min(cw * 0.45, 34);
            card.add(
                this.add.text(0, 0, String(val), {
                    fontSize: fs + 'px', fontFamily: 'Comic Sans MS, Arial', fontStyle: 'bold',
                    color: '#fff', stroke: '#000', strokeThickness: 2,
                }).setOrigin(0.5)
            );

            card.setInteractive({ draggable: true, useHandCursor: true });
            card.setData('value', val);
            card.setData('originX', cx);
            card.setData('originY', cy);

            card.on('dragstart', () => {
                this.draggedCard = card;
                this.tweens.killTweensOf(card);
                card.setScale(1.12).setDepth(200);
            });
            card.on('drag', (_ptr, dx, dy) => {
                card.x = dx;
                card.y = dy;
                this.highlightNearestPlank(card);
            });
            card.on('dragend', () => this.handleCardDrop(card));

            this.tweens.add({
                targets: card, y: cy - 3,
                duration: 1800 + i * 120, yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
            });

            this.answerCards.push(card);
        });
    }

    // ════════════════════════════════════════
    //  Drag & drop
    // ════════════════════════════════════════

    highlightNearestPlank(card) {
        this.bridgePlanks.forEach(p => { if (p.highlight) p.highlight.setAlpha(0); });

        let best = null;
        let bestD = Infinity;
        for (const p of this.bridgePlanks) {
            if (p.isRestored) continue;
            const d = Phaser.Math.Distance.Between(card.x, card.y, p.cx, p.cy);
            if (d < bestD && d < p.w * 1.8) { best = p; bestD = d; }
        }
        if (best) {
            if (!best.highlight) {
                const hl = this.add.graphics();
                hl.lineStyle(3, 0xFFD700, 0.85);
                hl.strokeRoundedRect(-best.w / 2 - 4, -best.h / 2 - 4, best.w + 8, best.h + 8, 6);
                best.container.add(hl);
                best.highlight = hl;
            }
            best.highlight.setAlpha(1);
        }
    }

    handleCardDrop(card) {
        this.bridgePlanks.forEach(p => { if (p.highlight) p.highlight.setAlpha(0); });

        if (this.checkingAnswer) { this.returnCard(card); return; }

        for (const p of this.bridgePlanks) {
            if (p.isRestored) continue;
            const dz = p.dropZone;
            const hw = dz.width / 2;
            const hh = dz.height / 2;
            if (card.x >= dz.x - hw && card.x <= dz.x + hw &&
                card.y >= dz.y - hh && card.y <= dz.y + hh) {
                this.checkAnswer(card, p.index);
                return;
            }
        }
        this.returnCard(card);
    }

    checkAnswer(card, plankIndex) {
        this.checkingAnswer = true;
        const val = card.getData('value');
        if (val === this.currentQuestion.correctValue) {
            this.onCorrectAnswer(card, plankIndex, val);
        } else {
            this.onWrongAnswer(card, plankIndex);
        }
    }

    onCorrectAnswer(card, plankIndex, value) {
        this.tweens.add({
            targets: card, alpha: 0, scale: 0, duration: 250,
            onComplete: () => card.destroy(true),
        });
        this.answerCards = this.answerCards.filter(c => c !== card);

        this.restorePlank(plankIndex, value);

        if (this.wiseOwl) {
            this.wiseOwl.cheer();
            this.wiseOwl.showDialogue('Làm tốt lắm, Bé Thỏ! Một tấm ván nữa đã được khôi phục. Tiếp tục nhé!', 4500);
            this.playVoice('voice_correct');
        }

        if (window.gameData) {
            window.gameData.score = (window.gameData.score || 0) + 10;
            window.gameData.stars = (window.gameData.stars || 0) + 1;
        }

        this.time.delayedCall(5000, () => {
            this.checkingAnswer = false;
            if (this.wiseOwl) this.wiseOwl.returnToIdle();
            if (this.planksRestored < this.totalPlanks) this.generateNewQuestion();
        });
    }

    onWrongAnswer(card, plankIndex) {
        const plank = this.bridgePlanks[plankIndex];
        if (plank?.container) {
            const ox = plank.container.x;
            this.tweens.add({
                targets: plank.container, x: ox - 3,
                duration: 50, yoyo: true, repeat: 3,
                onComplete: () => { plank.container.x = ox; },
            });
        }

        const cx = card.x;
        this.tweens.add({
            targets: card, x: cx - 6,
            duration: 50, yoyo: true, repeat: 4,
            onComplete: () => this.returnCard(card),
        });

        if (this.wiseOwl) {
            this.wiseOwl.showSadness();
            this.wiseOwl.showDialogue('Ồ! Chưa đúng. Hãy đếm cẩn thận và chọn lại nhé!', 3500);
            this.playVoice('voice_wrong');
            this.time.delayedCall(4000, () => { if (this.wiseOwl) this.wiseOwl.returnToIdle(); });
        }

        this.time.delayedCall(100, () => { this.checkingAnswer = false; });
    }

    returnCard(card) {
        const ox = card.getData('originX');
        const oy = card.getData('originY');
        this.tweens.killTweensOf(card);
        this.tweens.add({
            targets: card, x: ox, y: oy, scale: 1, duration: 350, ease: 'Back.easeOut',
            onComplete: () => {
                card.setDepth(150);
                this.draggedCard = null;
                this.tweens.add({
                    targets: card, y: oy - 3,
                    duration: 1800, yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
                });
            },
        });
    }

    // ════════════════════════════════════════
    //  Wise Owl
    // ════════════════════════════════════════

    createWiseOwl() {
        const l = this.L();
        if (typeof WiseOwlCharacter !== 'undefined') {
            this.wiseOwl = new WiseOwlCharacter(this, { x: l.owlX, y: l.owlY, size: 90 });
            this.wiseOwl.create();
        }
    }

    // ════════════════════════════════════════
    //  Introduction dialogue (3-part, with voice)
    // ════════════════════════════════════════

    showIntroductionDialogue() {
        const dialogues = [
            { text: 'Chào mừng đến Khu Rừng Đếm Số, Bé Thỏ! Con đường ma thuật này đầy những con số đang chờ bạn khám phá.', voiceKey: 'voice_intro_1', duration: 7000 },
            { text: 'Ồ không! Cây cầu gỗ bị gãy, và bạn không thể băng qua dòng suối. Nhưng đừng lo, mỗi câu trả lời đúng sẽ giúp khôi phục một tấm ván.', voiceKey: 'voice_intro_2', duration: 9000 },
            { text: 'Giải các bài toán cộng bằng cách chọn số đúng. Kéo nó vào chỗ trống trên cầu. Mỗi câu trả lời đúng sẽ khôi phục một tấm ván. Hãy xem bạn có thể khôi phục cả 10 tấm ván không!', voiceKey: 'voice_intro_3', duration: 12000 },
        ];
        this.showDialogueSequenceWithVoice(dialogues, () => this.generateNewQuestion());
    }

    showDialogueSequenceWithVoice(dialogues, onComplete) {
        if (this.dialogueIndex >= dialogues.length) {
            this.dialogueIndex = 0;
            if (onComplete) onComplete();
            return;
        }
        const d = dialogues[this.dialogueIndex];
        if (this.wiseOwl) this.wiseOwl.showDialogue(d.text, d.duration);
        this.playVoice(d.voiceKey);
        this.dialogueIndex++;
        this.time.delayedCall(d.duration + 500, () => this.showDialogueSequenceWithVoice(dialogues, onComplete));
    }

    // ════════════════════════════════════════
    //  Level complete + reward
    // ════════════════════════════════════════

    completeLevel() {
        this.clearQuestionUI();
        const l = this.L();
        for (let i = 0; i < 15; i++) {
            this.time.delayedCall(i * 60, () => {
                this.createSparkles(Phaser.Math.Between(80, l.w - 80), Phaser.Math.Between(80, l.h - 80), 8);
            });
        }
        this.time.delayedCall(1500, () => this.showReward());
    }

    showReward() {
        const l = this.L();
        const w = l.w;
        const h = l.h;

        const overlay = this.add.graphics().setDepth(250);
        overlay.fillStyle(0x000000, 0.6);
        overlay.fillRect(0, 0, w, h);

        const pw = Math.min(w * 0.6, 520);
        const ph = Math.min(h * 0.52, 370);
        const px = (w - pw) / 2;
        const py = (h - ph) / 2;

        const panel = this.add.graphics().setDepth(251);
        panel.fillStyle(0xFFF8DC, 0.96);
        panel.fillRoundedRect(px, py, pw, ph, 20);
        panel.lineStyle(4, 0xFFD700, 1);
        panel.strokeRoundedRect(px, py, pw, ph, 20);

        this.add.text(w / 2, py + ph * 0.18, '📖 Trang sách số 1', {
            fontSize: '34px', fontFamily: 'Comic Sans MS, Arial', fontStyle: 'bold', color: '#5C3A1E',
        }).setOrigin(0.5).setDepth(252);

        this.add.text(w / 2, py + ph * 0.38, 'Sức Mạnh Của Những Con Số', {
            fontSize: '24px', fontFamily: 'Comic Sans MS, Arial', fontStyle: 'bold', color: '#8B4513',
        }).setOrigin(0.5).setDepth(252);

        this.add.text(w / 2, py + ph * 0.55, '⭐', { fontSize: '44px' }).setOrigin(0.5).setDepth(252);

        const btnW = 200;
        const btnH = 54;
        const btnY = py + ph * 0.78;

        const btnBg = this.add.graphics().setDepth(252);
        btnBg.fillStyle(0x5C3A1E, 1);
        btnBg.fillRoundedRect(w / 2 - btnW / 2, btnY - btnH / 2, btnW, btnH, 12);
        btnBg.lineStyle(3, 0xFFD700, 1);
        btnBg.strokeRoundedRect(w / 2 - btnW / 2, btnY - btnH / 2, btnW, btnH, 12);

        const btnZone = this.add.zone(w / 2, btnY, btnW, btnH)
            .setInteractive({ useHandCursor: true }).setDepth(253);
        this.add.text(w / 2, btnY, 'Tiếp tục', {
            fontSize: '22px', fontFamily: 'Comic Sans MS, Arial', fontStyle: 'bold', color: '#FFD700',
        }).setOrigin(0.5).setDepth(253);

        btnZone.on('pointerover', () => btnBg.setAlpha(0.85));
        btnZone.on('pointerout', () => btnBg.setAlpha(1));
        btnZone.on('pointerdown', () => {
            this.sound.stopAll();
            this.scene.stop('UIScreen');
            this.scene.start('MenuScreen');
        });

        if (this.wiseOwl) {
            this.time.delayedCall(400, () => {
                this.wiseOwl.celebrate();
                this.wiseOwl.showDialogue('Tuyệt vời! Bạn đã học được sức mạnh của những con số!', 5000);
                this.playVoice('voice_complete');
            });
        }
    }

    // ════════════════════════════════════════
    //  Audio
    // ════════════════════════════════════════

    playLevelBGM() {
        if (this.cache.audio.exists('bgm_counting_forest') && window.gameData?.musicEnabled !== false) {
            this.levelBGM = this.sound.add('bgm_counting_forest', { volume: 0.4, loop: true });
            this.levelBGM.play();
        }
    }

    stopLevelBGM() {
        if (!this.levelBGM) return;
        this.tweens.add({
            targets: this.levelBGM, volume: 0, duration: 400,
            onComplete: () => { if (this.levelBGM) { this.levelBGM.stop(); this.levelBGM = null; } },
        });
    }

    playVoice(key) {
        if (this.currentVoice) { this.currentVoice.stop(); this.currentVoice = null; }
        if (this.cache.audio.exists(key)) {
            this.currentVoice = this.sound.add(key, { volume: 0.35 });
            this.currentVoice.play();
            return this.currentVoice;
        }
        return null;
    }

    stopVoice() {
        if (this.currentVoice) { this.currentVoice.stop(); this.currentVoice = null; }
    }

    // ════════════════════════════════════════
    //  Effects + ambient
    // ════════════════════════════════════════

    createSparkles(x, y, count) {
        const colors = [0xFFD700, 0xFF69B4, 0x87CEEB, 0x90EE90, 0x9370DB];
        for (let i = 0; i < count; i++) {
            const s = this.add.graphics().setDepth(200);
            s.fillStyle(colors[Phaser.Math.Between(0, colors.length - 1)], 0.8);
            s.fillCircle(0, 0, Phaser.Math.Between(2, 5));
            s.setPosition(x, y);
            const a = Phaser.Math.DegToRad(Phaser.Math.Between(0, 360));
            const d = Phaser.Math.Between(30, 80);
            this.tweens.add({
                targets: s,
                x: x + Math.cos(a) * d, y: y + Math.sin(a) * d,
                alpha: 0, scale: 0, duration: 600,
                onComplete: () => s.destroy(),
            });
        }
    }

    createAmbientCreatures(w, h) {
        if (typeof generateButterflies === 'function' && typeof createMenuButterfly === 'function') {
            generateButterflies(this, 4).forEach(data => {
                const b = createMenuButterfly(this, data);
                if (b) { b.x = Phaser.Math.Between(w * 0.1, w * 0.9); b.y = Phaser.Math.Between(h * 0.3, h * 0.65); this.butterflies.push(b); }
            });
        }
        if (typeof generateFireflies === 'function' && typeof createMenuFirefly === 'function') {
            generateFireflies(this, 5).forEach(data => {
                const f = createMenuFirefly(this, data);
                if (f) { f.x = Phaser.Math.Between(w * 0.1, w * 0.9); f.y = Phaser.Math.Between(h * 0.2, h * 0.6); this.fireflies.push(f); }
            });
        }
        if (typeof generateMagicParticles === 'function' && typeof createMenuMagicParticle === 'function') {
            generateMagicParticles(this, 6).forEach(data => {
                const p = createMenuMagicParticle(this, data);
                if (p) { p.x = Phaser.Math.Between(w * 0.15, w * 0.85); p.y = Phaser.Math.Between(h * 0.3, h * 0.65); this.magicParticles.push(p); }
            });
        }
    }

    // ════════════════════════════════════════
    //  Lifecycle
    // ════════════════════════════════════════

    update() {
        const tick = (group) => group.forEach(o => { const bs = o.getData('behaviorSystem'); if (bs?.update) bs.update(group); });
        tick(this.butterflies);
        tick(this.fireflies);
        tick(this.magicParticles);
    }

    shutdown() {
        this.sound.stopAll();
        this.stopVoice();
        if (this.levelBGM) { this.levelBGM.stop(); this.levelBGM = null; }
        if (this.wiseOwl) this.wiseOwl.destroy();
        this.clearQuestionUI();
    }
}
