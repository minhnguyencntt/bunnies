/**
 * screen.js — SubtractionHillScreen (Đồi Phép Trừ). Load sau `puzzle.js` (SubtractionHillPuzzle).
 * Gameplay: 6 phép trừ a−b (0–10), chọn đáp án, cáo nhặt đồ, reunion mẹ. Xem story.md.
 */
class SubtractionHillScreen extends Phaser.Scene {
    constructor() {
        super({ key: 'SubtractionHillScreen' });
        this.totalPuzzles = 6;
        this.currentRound = 0;
        this.solvedCount = 0;
        this.comboStreak = 0;
        this.checkingAnswer = false;
        this.currentProblem = null;
        this.levelBGM = null;
        this.currentVoice = null;
        this.roundRoot = null;
        this.hintText = null;
        this.youngFoxCharacter = null;
        this.youngFox = null;
        this.foxBubble = null;
        this.motherFox = null;
        this.itemProgressSlots = [];
        this.itemProgressTitle = null;
        this.lostItemsQueue = [];
        this.problemHistory = [];
        this.butterflies = [];
        this.fireflies = [];
        this.magicParticles = [];
        this.theme = typeof SubtractionHillPuzzle !== 'undefined' ? SubtractionHillPuzzle : null;
        this.usesArtBackground = false;
        this.levelBgVideo = null;
    }

    preload() {
        const bg = this.theme?.background;
        if (typeof ScreenLevelBackground !== 'undefined' && bg) {
            ScreenLevelBackground.registerLevelBackground(this, bg, {
                bgmKey: 'bgm_subtraction_hill',
                bgmUrl: 'screens/subtraction_hill/assets/audio/bgm/bgm.wav',
            });
        } else {
            this.load.image('subtraction_hill_bg', 'screens/subtraction_hill/assets/backgrounds/bg.png');
            this.load.audio('bgm_subtraction_hill', 'screens/subtraction_hill/assets/audio/bgm/bgm.wav');
        }
        this.load.audio('voice_intro_1', 'screens/subtraction_hill/assets/audio/voice/intro_1.mp3');
        this.load.audio('voice_intro_2', 'screens/subtraction_hill/assets/audio/voice/intro_2.mp3');
        this.load.audio('voice_intro_3', 'screens/subtraction_hill/assets/audio/voice/intro_3.mp3');
        this.load.audio('voice_correct', 'screens/subtraction_hill/assets/audio/voice/correct_answer.mp3');
        this.load.audio('voice_wrong', 'screens/subtraction_hill/assets/audio/voice/wrong_answer.mp3');
        this.load.audio('voice_complete', 'screens/subtraction_hill/assets/audio/voice/level_complete.mp3');
    }

    create() {
        const w = this.cameras.main.width;
        const h = this.cameras.main.height;
        this.sound.stopAll();
        this.playLevelBGM();
        this.createBackground(w, h);
        this.pickLostItemsForRun();
        this.createItemProgressRow(w, h);
        this.createYoungFox(w, h);
        this.createAmbientCreatures(w, h);
        this.scene.launch('UIScreen');
        this.time.delayedCall(400, () => this.showIntroductionDialogue());
    }

    // ════════════════════════════════════════
    //  Layout
    // ════════════════════════════════════════

    L() {
        const w = this.cameras.main.width;
        const h = this.cameras.main.height;
        const hudH = 80;
        return {
            w, h, hudH,
            equationY: hudH + 90,
            btnY: hudH + 210,
            btnW: Phaser.Math.Clamp(Math.round(w * 0.075), 72, 100),
            btnH: 68,
            btnGap: Phaser.Math.Clamp(Math.round(w * 0.02), 14, 24),
            progressY: hudH + 320,
            foxX: Math.round(w * 0.13),
            foxY: Math.round(h * 0.72),
        };
    }

    // ════════════════════════════════════════
    //  Background
    // ════════════════════════════════════════

    createBackground(w, h) {
        const bg = this.theme?.background;
        let mode = 'none';
        if (typeof ScreenLevelBackground !== 'undefined' && bg) {
            mode = ScreenLevelBackground.createLayer(this, w, h, bg, { depth: 0, videoRef: 'levelBgVideo' });
        } else if (this.textures.exists('subtraction_hill_bg')) {
            this.add.image(w / 2, h / 2, 'subtraction_hill_bg').setDisplaySize(w, h).setDepth(0);
            mode = 'image';
        }
        this.usesArtBackground = mode === 'image' || mode === 'video';
        if (mode === 'none') {
            const g = this.add.graphics().setDepth(0);
            g.fillGradientStyle(0x87CEEB, 0x87CEEB, 0xFFA07A, 0xFFA07A, 1);
            g.fillRect(0, 0, w, h * 0.6);
            g.fillStyle(0x7CCD7C);
            g.fillRect(0, h * 0.6, w, h * 0.4);
        }
    }

    // ════════════════════════════════════════
    //  Young Fox (from core)
    // ════════════════════════════════════════

    createYoungFox(w, h) {
        if (typeof YoungFoxCharacter !== 'undefined') {
            this.youngFoxCharacter = new YoungFoxCharacter(this);
            this.youngFox = this.youngFoxCharacter.create({
                width: w, height: h, usesArtBackground: this.usesArtBackground,
            });
        }
    }

    // ════════════════════════════════════════
    //  Fox bubble (dialogue text near fox)
    // ════════════════════════════════════════

    showFoxBubble(text, durationMs) {
        if (this.foxBubble) { this.foxBubble.destroy(); this.foxBubble = null; }
        if (!this.youngFox?.scene) return;
        const w = this.cameras.main.width;
        const bx = Phaser.Math.Clamp(this.youngFox.x + 60, 120, w - 120);
        const by = this.youngFox.y - 85;
        const wrap = Math.min(380, w * 0.5);

        const t = this.add.text(bx, by, text, {
            fontSize: '17px', fontFamily: 'Comic Sans MS, Arial', color: '#4a3728', fontStyle: 'bold',
            align: 'center', wordWrap: { width: wrap }, backgroundColor: '#fff8e7', padding: { x: 12, y: 8 },
        }).setOrigin(0.5).setDepth(60);

        this.foxBubble = t;
        t.setAlpha(0);
        this.tweens.add({ targets: t, alpha: 1, y: by - 6, duration: 250, ease: 'Back.easeOut' });
        this.time.delayedCall(durationMs || 3500, () => {
            if (!t.active) return;
            this.tweens.add({
                targets: t, alpha: 0, y: by - 18, duration: 300,
                onComplete: () => { t.destroy(); if (this.foxBubble === t) this.foxBubble = null; },
            });
        });
    }

    // ════════════════════════════════════════
    //  Item progress row
    // ════════════════════════════════════════

    pickLostItemsForRun() {
        const n = this.totalPuzzles;
        if (this.theme?.getLostItemsForLevel) {
            this.lostItemsQueue = this.theme.getLostItemsForLevel(n);
        } else {
            const pool = [
                { id: 'toy', emoji: '🧸', labelVi: 'Thú bông' },
                { id: 'book', emoji: '📘', labelVi: 'Sách nhỏ' },
                { id: 'candy', emoji: '🍬', labelVi: 'Kẹo' },
                { id: 'star', emoji: '⭐', labelVi: 'Ngôi sao' },
                { id: 'hat', emoji: '🎩', labelVi: 'Mũ' },
                { id: 'ball', emoji: '⚽', labelVi: 'Quả bóng' },
            ];
            this.lostItemsQueue = Phaser.Utils.Array.Shuffle(pool.slice()).slice(0, n);
        }
    }

    createItemProgressRow(w, h) {
        const l = this.L();
        const count = this.totalPuzzles;
        const slotR = 38;
        const gap = 14;
        const totalW = count * slotR * 2 + (count - 1) * gap;
        const startX = (w - totalW) / 2 + slotR;

        this.itemProgressSlots = [];
        for (let i = 0; i < count; i++) {
            const x = startX + i * (slotR * 2 + gap);
            const slot = this.add.container(x, l.progressY).setDepth(21);
            const bg = this.add.graphics();
            bg.fillStyle(0xffffff, 0.35);
            bg.lineStyle(3, 0xffb347, 0.9);
            bg.strokeCircle(0, 0, slotR);
            bg.fillCircle(0, 0, slotR);
            const label = this.add.text(0, 0, '·', { fontSize: '34px', color: '#ccc' }).setOrigin(0.5);
            slot.add([bg, label]);
            this.itemProgressSlots.push({ container: slot, label, filled: false });
        }

        this.itemProgressTitle = this.add.text(w / 2, l.progressY - 50, `Đã tìm: 0 / ${count} món đồ`, {
            fontSize: '20px', fontFamily: 'Comic Sans MS, Arial', color: '#fff8dc', fontStyle: 'bold',
            stroke: '#5c3d1e', strokeThickness: 3,
        }).setOrigin(0.5).setDepth(22);
    }

    updateItemProgressTitle() {
        if (this.itemProgressTitle) this.itemProgressTitle.setText(`Đã tìm: ${this.solvedCount} / ${this.totalPuzzles} món đồ`);
    }

    fillItemProgressSlot(index, emoji) {
        const slot = this.itemProgressSlots[index];
        if (!slot || slot.filled) return;
        slot.filled = true;
        slot.label.setText(emoji).setScale(0.2);
        this.tweens.add({ targets: slot.label, scale: 1.1, duration: 350, ease: 'Back.easeOut', yoyo: true,
            onComplete: () => this.tweens.add({ targets: slot.label, scale: 1, duration: 100 }),
        });
    }

    // ════════════════════════════════════════
    //  Problem generation
    // ════════════════════════════════════════

    maxMinuendForRound() {
        return Math.min(10, 3 + Math.ceil(((this.currentRound + 1) / this.totalPuzzles) * 7));
    }

    choiceCountForRound() {
        if (this.currentRound <= 1) return 2;
        if (this.currentRound <= 3) return 3;
        return 4;
    }

    generateProblem() {
        const maxA = this.maxMinuendForRound();
        const numChoices = this.choiceCountForRound();
        const numWrong = numChoices - 1;

        let a = 0, b = 0, correct = 0, found = false;
        for (let attempt = 0; attempt < 60 && !found; attempt++) {
            if (attempt > 45) this.problemHistory.splice(0, Math.ceil(this.problemHistory.length / 2));
            a = Phaser.Math.Between(0, maxA);
            b = a === 0 ? 0 : Phaser.Math.Between(0, a);
            correct = a - b;
            const key = `${a}-${b}`;
            if (!this.problemHistory.includes(key)) found = true;
        }
        this.problemHistory.push(`${a}-${b}`);
        if (this.problemHistory.length > 10) this.problemHistory.shift();

        const wrong = [];
        const tryW = v => { const n = Phaser.Math.Clamp(v, 0, 10); if (n !== correct && !wrong.includes(n) && wrong.length < numWrong) wrong.push(n); };
        tryW(correct - 1); tryW(correct + 1); tryW(correct - 2); tryW(correct + 2);
        tryW(a); tryW(b); tryW(0); tryW(10);
        let guard = 0;
        while (wrong.length < numWrong && guard++ < 40) tryW(Phaser.Math.Between(0, 10));

        return { a, b, correct, choices: Phaser.Utils.Array.Shuffle([correct, ...wrong]) };
    }

    // ════════════════════════════════════════
    //  Round UI — equation + answer buttons
    // ════════════════════════════════════════

    clearRoundUI() {
        if (this.roundRoot) { this.roundRoot.destroy(true); this.roundRoot = null; }
        if (this.hintText) { this.hintText.destroy(); this.hintText = null; }
    }

    startRound() {
        if (this.currentRound >= this.totalPuzzles) { this.completeLevel(); return; }
        this.clearRoundUI();
        const prob = this.generateProblem();
        this.currentProblem = prob;

        const l = this.L();
        const root = this.add.container(0, 0).setDepth(50);
        this.roundRoot = root;

        // Equation sign (wooden board)
        const boardW = Math.min(l.w * 0.6, 480);
        const boardH = 90;
        const board = this.add.graphics();
        board.fillStyle(0x8b4513, 0.94);
        board.fillRoundedRect(-boardW / 2, -boardH / 2, boardW, boardH, 16);
        board.lineStyle(4, 0xd2691e, 1);
        board.strokeRoundedRect(-boardW / 2, -boardH / 2, boardW, boardH, 16);
        board.lineStyle(2, 0xffd700, 0.5);
        board.strokeRoundedRect(-boardW / 2 + 5, -boardH / 2 + 5, boardW - 10, boardH - 10, 12);

        const eqText = this.add.text(0, 0, `${prob.a} − ${prob.b} = ?`, {
            fontSize: '40px', fontFamily: 'Comic Sans MS, Arial', fontStyle: 'bold',
            color: '#fff8dc', stroke: '#4a3728', strokeThickness: 4,
        }).setOrigin(0.5);

        const sign = this.add.container(l.w / 2, l.equationY);
        sign.add([board, eqText]);
        root.add(sign);

        // Answer buttons
        const { btnW, btnH, btnGap, btnY } = l;
        const n = prob.choices.length;
        const totalW = n * btnW + (n - 1) * btnGap;
        let sx = l.w / 2 - totalW / 2 + btnW / 2;

        const palettes = [
            { fill: 0xFFB6C1, border: 0xFF69B4 },
            { fill: 0x90EE90, border: 0x32CD32 },
            { fill: 0x87CEEB, border: 0x4682B4 },
            { fill: 0xFFE4B5, border: 0xFFA500 },
        ];

        prob.choices.forEach((val, i) => {
            const pal = palettes[i % palettes.length];
            const g = this.add.graphics();
            g.fillStyle(pal.fill, 1);
            g.fillRoundedRect(-btnW / 2, -btnH / 2, btnW, btnH, 14);
            g.lineStyle(3, pal.border, 1);
            g.strokeRoundedRect(-btnW / 2, -btnH / 2, btnW, btnH, 14);

            const txt = this.add.text(0, 0, String(val), {
                fontSize: Math.min(36, btnW * 0.42) + 'px', fontFamily: 'Comic Sans MS, Arial',
                fontStyle: 'bold', color: '#fff', stroke: '#333', strokeThickness: 3,
            }).setOrigin(0.5);

            const btn = this.add.container(sx, btnY).setSize(btnW, btnH).setDepth(51);
            btn.add([g, txt]);
            btn.setInteractive({ useHandCursor: true });
            btn.setData('answerValue', val);
            btn.setData('btnGraphics', g);
            btn.setData('btnLabel', txt);

            btn.on('pointerover', () => { if (!this.checkingAnswer) this.tweens.add({ targets: btn, scale: 1.06, duration: 100 }); });
            btn.on('pointerout', () => this.tweens.add({ targets: btn, scale: 1, duration: 100 }));
            btn.on('pointerdown', () => {
                if (this.checkingAnswer) return;
                this.onChoiceTap(val, btn);
            });

            this.tweens.add({ targets: btn, y: btnY - 3, duration: 1900 + i * 80, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
            root.add(btn);
            sx += btnW + btnGap;
        });
    }

    onChoiceTap(value, btn) {
        if (this.checkingAnswer || !this.currentProblem) return;
        if (value === this.currentProblem.correct) this.onCorrectAnswer(btn);
        else this.onWrongAnswer(btn);
    }

    // ════════════════════════════════════════
    //  Correct / wrong
    // ════════════════════════════════════════

    onCorrectAnswer() {
        this.checkingAnswer = true;
        this.comboStreak++;
        this.emitThemeEvent(this.theme?.events?.correct || 'SubtractionHillScreen:CorrectAnswer');
        this.playCorrectAnswerSfx();

        const itemIndex = this.solvedCount;
        const itemDef = this.lostItemsQueue[itemIndex];
        const emoji = itemDef ? itemDef.emoji : '✨';

        this.flyLostItemToFox(emoji, this.cameras.main.width / 2, this.L().equationY);
        this.time.delayedCall(400, () => { this.fillItemProgressSlot(itemIndex, emoji); this.updateItemProgressTitle(); });

        const itemName = itemDef?.labelVi || 'Đồ';
        const cheers = [`Tìm thấy ${itemName} rồi!`, `${itemName} đây rồi! Cảm ơn bạn!`, `Hay quá! Nhặt được ${itemName}!`, `${itemName} đã về với cáo con!`];
        this.showFoxBubble(cheers[itemIndex % cheers.length], 2500);
        if (this.youngFoxCharacter) this.youngFoxCharacter.hopJoy();

        this.solvedCount++;
        this.currentRound++;

        const ratio = this.solvedCount / this.totalPuzzles;
        if (ratio >= 0.99 && this.youngFoxCharacter) this.youngFoxCharacter.setEmotion('joy');
        else if (ratio >= 0.45 && this.youngFoxCharacter) this.youngFoxCharacter.setEmotion('hopeful');

        this.emitThemeEvent(this.theme?.events?.itemCollected || 'SubtractionHillScreen:ItemCollected');

        this.time.delayedCall(2200, () => { this.checkingAnswer = false; this.startRound(); });
    }

    onWrongAnswer(btn) {
        this.checkingAnswer = true;
        this.comboStreak = 0;
        this.emitThemeEvent(this.theme?.events?.wrong || 'SubtractionHillScreen:WrongAnswer');
        this.playVoice('voice_wrong');
        this.showFoxBubble('Chưa đúng rồi… Thử lại nhé!', 3200);

        if (btn?.active) {
            const ox = btn.x;
            this.tweens.add({ targets: btn, x: ox - 8, duration: 55, yoyo: true, repeat: 5, onComplete: () => btn.setX(ox) });
            const g = btn.getData('btnGraphics');
            const txt = btn.getData('btnLabel');
            if (g) { this.tweens.add({ targets: g, alpha: 0.4, duration: 180 }); this.time.delayedCall(900, () => { if (g?.scene) this.tweens.add({ targets: g, alpha: 1, duration: 250 }); }); }
            if (txt) { this.tweens.add({ targets: txt, alpha: 0.45, duration: 180 }); this.time.delayedCall(900, () => { if (txt?.scene) this.tweens.add({ targets: txt, alpha: 1, duration: 250 }); }); }
        }

        const { a, b } = this.currentProblem;
        if (this.hintText) this.hintText.destroy();
        this.hintText = this.add.text(this.cameras.main.width / 2, this.L().btnY + 65,
            `💡 Gợi ý: ${a} bớt ${b} còn mấy?`, {
                fontSize: '17px', fontFamily: 'Comic Sans MS, Arial', color: '#fff', fontStyle: 'bold',
                stroke: '#5c3d1e', strokeThickness: 3,
            }).setOrigin(0.5).setDepth(52).setAlpha(0);
        this.tweens.add({ targets: this.hintText, alpha: 1, duration: 400 });

        this.time.delayedCall(600, () => { this.checkingAnswer = false; });
    }

    flyLostItemToFox(emoji, fromX, fromY) {
        if (!this.youngFox) return;
        const item = this.add.text(fromX, fromY, emoji, { fontSize: '52px' }).setOrigin(0.5).setDepth(200);
        item.setScale(0.3);
        this.tweens.add({
            targets: item, scale: 1.1, duration: 200, ease: 'Back.easeOut',
            onComplete: () => {
                this.tweens.add({
                    targets: item, x: this.youngFox.x, y: this.youngFox.y - 15, scale: 0.8, alpha: 0.8,
                    duration: 650, ease: 'Cubic.easeInOut', onComplete: () => item.destroy(),
                });
            },
        });
    }

    // ════════════════════════════════════════
    //  Level complete + reunion
    // ════════════════════════════════════════

    completeLevel() {
        this.clearRoundUI();
        this.checkingAnswer = true;
        this.emitThemeEvent(this.theme?.events?.levelComplete || 'SubtractionHillScreen:LevelComplete');

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
        this.time.delayedCall(500, () => this.runReunionSequence());
    }

    buildMotherFoxContainer(x, y) {
        const mom = this.add.container(x, y);
        const tail = this.add.graphics(); tail.fillStyle(0xb85c1c); tail.fillEllipse(-32, 16, 28, 18);
        const body = this.add.graphics();
        body.fillStyle(0xd2691e); body.fillEllipse(0, 8, 56, 44);
        body.fillStyle(0xfff5e6); body.fillEllipse(16, 12, 22, 16);
        body.fillStyle(0x1a1a1a); body.fillCircle(22, 10, 3); body.fillCircle(30, 10, 3);
        body.fillStyle(0xc04040); body.fillRoundedRect(10, 22, 28, 6, 3);
        const earL = this.add.graphics();
        earL.fillStyle(0xc05621); earL.fillTriangle(-10, -14, -22, -38, -4, -28);
        earL.fillStyle(0xffe4e1, 0.9); earL.fillTriangle(-12, -16, -20, -32, -5, -28);
        const earR = this.add.graphics();
        earR.fillStyle(0xc05621); earR.fillTriangle(10, -14, 22, -38, 4, -28);
        earR.fillStyle(0xffe4e1, 0.9); earR.fillTriangle(12, -16, 20, -32, 5, -28);
        const scarf = this.add.graphics(); scarf.fillStyle(0xff6b81); scarf.fillRoundedRect(-22, 18, 44, 12, 5);
        mom.add([tail, body, scarf, earL, earR]);
        mom.setDepth(34);
        return mom;
    }

    runReunionSequence() {
        const w = this.cameras.main.width;
        const h = this.cameras.main.height;

        this.createSparkles(w / 2, h / 2, 20);

        this.motherFox = this.buildMotherFoxContainer(w * 0.72, h * 0.58);
        this.motherFox.setAlpha(0).setScale(0.7);
        this.tweens.add({ targets: this.motherFox, alpha: 1, scale: 1, duration: 650, ease: 'Back.easeOut', delay: 200 });

        if (this.youngFox) {
            this.tweens.killTweensOf(this.youngFox);
            this.tweens.add({
                targets: this.youngFox, x: w * 0.56, y: h * 0.56, duration: 1100, ease: 'Cubic.easeInOut', delay: 400,
                onComplete: () => {
                    this.createSparkles(this.youngFox.x, this.youngFox.y - 20, 12);
                    if (this.youngFoxCharacter) this.youngFoxCharacter.setEmotion('joy');
                },
            });
        }

        this.playVoice('voice_complete');
        this.showFoxBubble('Mẹ ơi! Con tìm được hết đồ rồi!', 3200);
        this.time.delayedCall(3200, () => this.showRewardPanel());
    }

    showRewardPanel() {
        const w = this.cameras.main.width;
        const h = this.cameras.main.height;

        const overlay = this.add.graphics().setDepth(250);
        overlay.fillStyle(0x000000, 0.55);
        overlay.fillRect(0, 0, w, h);

        const pw = Math.min(w * 0.6, 500);
        const ph = Math.min(h * 0.48, 340);
        const px = (w - pw) / 2;
        const py = (h - ph) / 2;

        const panel = this.add.graphics().setDepth(251);
        panel.fillStyle(0xFFF8DC, 0.96);
        panel.fillRoundedRect(px, py, pw, ph, 20);
        panel.lineStyle(4, 0xFFD700, 1);
        panel.strokeRoundedRect(px, py, pw, ph, 20);

        this.add.text(w / 2, py + ph * 0.18, '🦊 Đồi Phép Trừ — Hoàn thành!', {
            fontSize: '28px', fontFamily: 'Comic Sans MS, Arial', fontStyle: 'bold', color: '#5C3A1E',
        }).setOrigin(0.5).setDepth(252);

        this.add.text(w / 2, py + ph * 0.36, 'Cáo con đã tìm đủ đồ và gặp lại mẹ!', {
            fontSize: '20px', fontFamily: 'Comic Sans MS, Arial', color: '#8B4513',
        }).setOrigin(0.5).setDepth(252);

        const itemLabels = this.lostItemsQueue.map(it => `${it.emoji} ${it.labelVi || ''}`).join('  ');
        this.add.text(w / 2, py + ph * 0.52, itemLabels, {
            fontSize: '22px', fontFamily: 'Comic Sans MS, Arial', color: '#5C3A1E',
            wordWrap: { width: pw - 40 }, align: 'center',
        }).setOrigin(0.5).setDepth(252);

        const btnW = 200;
        const btnH = 54;
        const btnY = py + ph * 0.8;
        const btnBg = this.add.graphics().setDepth(252);
        btnBg.fillStyle(0x5C3A1E);
        btnBg.fillRoundedRect(w / 2 - btnW / 2, btnY - btnH / 2, btnW, btnH, 12);
        btnBg.lineStyle(3, 0xFFD700);
        btnBg.strokeRoundedRect(w / 2 - btnW / 2, btnY - btnH / 2, btnW, btnH, 12);

        this.add.zone(w / 2, btnY, btnW, btnH).setInteractive({ useHandCursor: true }).setDepth(253)
            .on('pointerdown', () => {
                this.sound.stopAll();
                this.scene.stop('UIScreen');
                this.scene.start('MenuScreen');
            });

        this.add.text(w / 2, btnY, 'Tiếp tục', {
            fontSize: '22px', fontFamily: 'Comic Sans MS, Arial', fontStyle: 'bold', color: '#FFD700',
        }).setOrigin(0.5).setDepth(253);
    }

    // ════════════════════════════════════════
    //  Introduction dialogue (fox bubbles + voice, cùng cấu trúc counting_forest / mirror_city)
    // ════════════════════════════════════════

    showIntroductionDialogue() {
        const dialogues = [
            { text: 'Hu hu… Cáo con làm rơi đồ đạc khắp Đồi Phép Trừ! Bạn có thể giúp tìm lại không?', voiceKey: 'voice_intro_1', duration: 5500 },
            { text: 'Mỗi câu trừ đúng sẽ gọi một món đồ bị thất lạc bay về chỗ cáo con.', voiceKey: 'voice_intro_2', duration: 5000 },
            { text: 'Chỉ có số từ 0 đến 10 thôi — tìm hết đồ, cáo con sẽ được gặp mẹ!', voiceKey: 'voice_intro_3', duration: 5500 },
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
        this.showFoxBubble(d.text, d.duration);
        this.playVoice(d.voiceKey);
        this.dialogueIndex++;
        this.time.delayedCall(d.duration + 500, () => this.showDialogueSequenceWithVoice(dialogues, onComplete));
    }

    // ════════════════════════════════════════
    //  Audio
    // ════════════════════════════════════════

    playLevelBGM() {
        if (typeof ScreenLevelBackground !== 'undefined' && ScreenLevelBackground.hasLoadedVideo(this)) return;
        if (this.cache.audio.exists('bgm_subtraction_hill') && window.gameData?.musicEnabled !== false) {
            this.levelBGM = this.sound.add('bgm_subtraction_hill', { volume: 0.44, loop: true });
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

    playCorrectAnswerSfx() {
        if (window.gameData?.soundEnabled === false) return;
        this.playVoice('voice_correct');
    }

    emitThemeEvent(name) {
        if (this.events && name) this.events.emit(name);
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
                targets: s, x: x + Math.cos(a) * d, y: y + Math.sin(a) * d,
                alpha: 0, scale: 0, duration: 600, onComplete: () => s.destroy(),
            });
        }
    }

    createAmbientCreatures(w, h) {
        if (typeof generateButterflies === 'function' && typeof createMenuButterfly === 'function') {
            generateButterflies(this, 3).forEach(data => {
                const b = createMenuButterfly(this, data);
                if (b) { b.x = Phaser.Math.Between(w * 0.15, w * 0.85); b.y = Phaser.Math.Between(h * 0.2, h * 0.55); this.butterflies.push(b); }
            });
        }
        if (typeof generateFireflies === 'function' && typeof createMenuFirefly === 'function') {
            generateFireflies(this, 4).forEach(data => {
                const f = createMenuFirefly(this, data);
                if (f) { f.x = Phaser.Math.Between(w * 0.1, w * 0.9); f.y = Phaser.Math.Between(h * 0.25, h * 0.65); this.fireflies.push(f); }
            });
        }
        if (typeof generateMagicParticles === 'function' && typeof createMenuMagicParticle === 'function') {
            generateMagicParticles(this, 5).forEach(data => {
                const p = createMenuMagicParticle(this, data);
                if (p) { p.x = Phaser.Math.Between(w * 0.12, w * 0.88); p.y = Phaser.Math.Between(h * 0.3, h * 0.7); this.magicParticles.push(p); }
            });
        }
    }

    // ════════════════════════════════════════
    //  Lifecycle
    // ════════════════════════════════════════

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
