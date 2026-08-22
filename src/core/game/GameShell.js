/**
 * GameShell.js — reusable base scene for every Knowledge World game.
 *
 * Wires the Game Engine into a Phaser scene:
 *   Level Engine (config) · Difficulty + Adaptive Difficulty · Analytics ·
 *   Scoring + Stars (live HUD) · Hint Engine · Pause · Bunnine companion ·
 *   Reward pipeline → Result Screen.
 *
 * Subclass contract:
 *   constructor: super('SceneKey'); this.gameId = '...';
 *   onPreload()            — load assets (call this.preloadCommonAudio(folder))
 *   buildWorld()           — background, characters, decorations
 *   presentRound(i, diff)  — build round UI; end with this.answerCorrect(x,y)
 *                            / this.answerWrong(x,y); shell advances rounds
 * Optional overrides: introText(), introVoiceKey(), parTimeMs,
 *   handleTimeout(), showHintVisual(hint), onSessionStart()
 */
class GameShell extends Phaser.Scene {
    constructor(key) {
        super({ key });
        this.gameId = null;
        this.level = 1;
        this.parTimeMs = 0; // 0 → auto from difficulty
    }

    init(data) {
        this.level = Phaser.Math.Clamp((data && data.level) || 1, 1, 3);
        this.roundIndex = 0;
        this.isPaused = false;
        this.sessionOver = false;
        this.acceptingInput = false;
        this.displayScore = 0;
        this.currentVoice = null;
        this.levelBGM = null;
        this.timerEvent = null;
        this.roundTimeLeft = 0;
        this.pauseOverlay = null;
        this.bubble = null;
    }

    preload() {
        if (this.onPreload) this.onPreload();
    }

    /** Standard voice set with per-game keys (avoids cache collisions). */
    preloadCommonAudio(folder) {
        const g = this.gameId;
        this.load.audio(`${g}_intro`, `screens/${folder}/assets/audio/voice/intro_2.mp3`);
        this.load.audio(`${g}_correct`, `screens/${folder}/assets/audio/voice/correct_answer.mp3`);
        this.load.audio(`${g}_wrong`, `screens/${folder}/assets/audio/voice/wrong_answer.mp3`);
        this.load.audio(`${g}_complete`, `screens/${folder}/assets/audio/voice/level_complete.mp3`);
    }

    startLevelBGM(key, url) {
        const play = () => {
            if (this.cache.audio.exists(key) && window.gameData?.musicEnabled !== false && !this.levelBGM) {
                this.levelBGM = this.sound.add(key, { volume: 0.35, loop: true });
                this.levelBGM.play();
            }
        };
        if (this.cache.audio.exists(key)) { play(); return; }
        this.load.audio(key, url);
        this.load.once('complete', play);
        this.load.start();
    }

    create() {
        this.gameDef = GameConfig.get(this.gameId);
        this.levelCfg = GameConfig.getLevel(this.gameId, this.level);
        this.analytics = new AnalyticsEngine(this.gameId, this.level);
        this.adaptive = new AdaptiveDifficultyEngine(this.levelCfg.difficulty);

        this.sound.stopAll();
        const w = this.cameras.main.width;
        const h = this.cameras.main.height;
        this.buildWorld(w, h);
        this.createCompanion(w, h);
        this.createHUD(w, h);
        if (this.onSessionStart) this.onSessionStart(w, h);

        this.time.delayedCall(400, () => this.playIntro());
    }

    // ─── Intro ────────────────────────────────────────────────

    introText() { return 'Cùng chơi với Bunnine nhé!'; }
    introVoiceKey() { return `${this.gameId}_intro`; }

    playIntro() {
        const begin = () => this.startRound(0);
        if (typeof IntroHelper !== 'undefined') {
            IntroHelper.play(this, {
                text: this.introText(),
                voiceKey: this.cache.audio.exists(this.introVoiceKey()) ? this.introVoiceKey() : null,
                voiceRate: 1.6,
                showText: (t, ms) => this.companionSay(t, ms),
                onComplete: begin,
                minMs: 2500,
                maxMs: 7000,
            });
        } else {
            begin();
        }
    }

    // ─── Round flow ───────────────────────────────────────────

    startRound(index) {
        if (this.sessionOver) return;
        this.roundIndex = index;
        this.analytics.beginRound();
        const diff = this.adaptive.current();
        this.updateRoundLabel();
        this.acceptingInput = true;
        const t = diff.timeLimit > 0 ? diff.timeLimit : 0;
        this.startRoundTimer(t);
        this.presentRound(index, diff);
    }

    answerCorrect(x, y, opts = {}) {
        if (this.sessionOver) return;
        this.acceptingInput = false;
        this.clearRoundTimer();
        this.analytics.recordAnswer(true);
        this.adaptive.update(this.analytics);
        if (typeof RewardFX !== 'undefined') RewardFX.correctAnswer(this, x ?? this.scale.width / 2, y ?? this.scale.height / 2, { addStar: false });
        this.companionReact('happy');
        this.playVoice(`${this.gameId}_correct`);
        this.refreshLiveScore();
        this.time.delayedCall(opts.delayMs ?? 1600, () => this.advanceRound());
    }

    answerWrong(x, y, opts = {}) {
        if (this.sessionOver) return;
        this.analytics.recordAnswer(false);
        this.adaptive.update(this.analytics);
        this.companionReact('sad');
        this.playVoice(`${this.gameId}_wrong`);
        const encourage = Phaser.Utils.Array.GetRandom([
            'Gần đúng rồi! Thử lại nhé!', 'Không sao, thử lại nào!', 'Bunnine tin bạn làm được!',
        ]);
        this.companionSay(opts.message || encourage, 2500);
        this.refreshLiveScore();
        if (opts.fatal) { // round cannot be retried (e.g. timeout-style rounds)
            this.time.delayedCall(1400, () => this.advanceRound());
        }
    }

    recordFumble() { // mis-tap / dropped object — counts as mistake, not an answer
        this.analytics.recordMistake();
        this.refreshLiveScore();
    }

    advanceRound() {
        if (this.sessionOver) return;
        this.analytics.finishRound();
        const next = this.roundIndex + 1;
        if (next >= this.levelCfg.rounds) {
            this.finishSession();
        } else {
            this.startRound(next);
        }
    }

    handleTimeout() { // subclass may override for custom timeout behaviour
        this.companionSay('Hết giờ rồi, không sao! Mình sang câu tiếp theo nhé!', 2500);
        this.time.delayedCall(1200, () => this.advanceRound());
    }

    onRoundTimeout() {
        if (this.sessionOver || !this.acceptingInput) return;
        this.acceptingInput = false;
        this.analytics.recordMistake();
        this.refreshLiveScore();
        this.handleTimeout();
    }

    finishSession() {
        if (this.sessionOver) return;
        this.sessionOver = true;
        this.acceptingInput = false;
        this.clearRoundTimer();

        const par = this.getParTimeMs();
        const rewards = RewardEngine.finishSession(this.gameId, this.level, this.analytics, par);

        this.companionReact('celebrate');
        this.playVoice(`${this.gameId}_complete`);
        const w = this.cameras.main.width;
        const h = this.cameras.main.height;
        for (let i = 0; i < 12; i++) {
            this.time.delayedCall(i * 70, () => this.spawnSparkles(
                Phaser.Math.Between(80, w - 80), Phaser.Math.Between(90, h - 80), 7));
        }
        this.time.delayedCall(1400, () => {
            this.scene.pause();
            this.scene.launch('ResultScreen', { rewards, gameId: this.gameId, level: this.level });
        });
    }

    getParTimeMs() {
        if (this.parTimeMs > 0) return this.parTimeMs;
        const t = this.levelCfg.difficulty.timeLimit;
        return t > 0 ? t * 1000 * 0.6 : 15000;
    }

    // ─── Timer ────────────────────────────────────────────────

    startRoundTimer(seconds) {
        this.clearRoundTimer();
        if (!seconds) { this.updateTimerBar(1, false); return; }
        this.roundTimeTotal = seconds;
        this.roundTimeLeft = seconds;
        this.updateTimerBar(1, true);
        this.timerEvent = this.time.addEvent({
            delay: 100, loop: true,
            callback: () => {
                if (this.isPaused || this.sessionOver) return;
                this.roundTimeLeft -= 0.1;
                this.updateTimerBar(Math.max(0, this.roundTimeLeft / this.roundTimeTotal), true);
                if (this.roundTimeLeft <= 0) {
                    this.clearRoundTimer();
                    this.onRoundTimeout();
                }
            },
        });
    }

    clearRoundTimer() {
        if (this.timerEvent) { this.timerEvent.remove(false); this.timerEvent = null; }
    }

    updateTimerBar(ratio, visible) {
        if (!this.timerBarFill) return;
        this.timerBarFill.clear();
        if (!visible) return;
        const w = this.timerBarWidth;
        const color = ratio > 0.5 ? 0x7fe3c3 : ratio > 0.25 ? 0xffd166 : 0xff8a80;
        this.timerBarFill.fillStyle(0x000000, 0.35);
        this.timerBarFill.fillRoundedRect(-w / 2, -6, w, 12, 6);
        this.timerBarFill.fillStyle(color, 1);
        this.timerBarFill.fillRoundedRect(-w / 2, -6, Math.max(8, w * ratio), 12, 6);
    }

    // ─── HUD ──────────────────────────────────────────────────

    createHUD(w, h) {
        const hudH = 64;
        const g = this.add.graphics().setDepth(400);
        g.fillStyle(0x2c1810, 0.8);
        g.fillRect(0, 0, w, hudH);
        g.lineStyle(2, 0xffd700, 0.5);
        g.lineBetween(0, hudH, w, hudH);

        this.hudButton(40, hudH / 2, '🏠', () => this.confirmExit());

        this.hudTitle = this.add.text(80, hudH / 2, '', {
            fontSize: '19px', fontFamily: 'Comic Sans MS, Arial', fontStyle: 'bold',
            color: '#FFD700', stroke: '#000', strokeThickness: 2,
        }).setOrigin(0, 0.5).setDepth(401);
        this.updateRoundLabel();

        // Score + star meter (right side)
        this.scoreText = this.add.text(w - 260, hudH / 2, 'Điểm 0', {
            fontSize: '20px', fontFamily: 'Comic Sans MS, Arial', fontStyle: 'bold',
            color: '#fff', stroke: '#000', strokeThickness: 2,
        }).setOrigin(0, 0.5).setDepth(401);

        this.starMeterX = w - 130;
        this.starMeter = this.add.text(this.starMeterX, hudH / 2, '☆☆☆', {
            fontSize: '22px', fontFamily: 'Comic Sans MS, Arial',
            color: '#ffd700', stroke: '#000', strokeThickness: 2,
        }).setOrigin(0.5).setDepth(401);

        this.hudButton(w - 40, hudH / 2, '⏸', () => this.showPause());
        this.hudButton(w - 90, hudH / 2, '💡', () => this.useHint());

        // Timer bar under HUD (center)
        this.timerBarWidth = Math.min(360, w * 0.3);
        this.timerBarFill = this.add.graphics().setDepth(400);
        this.timerBarFill.setPosition(w / 2, hudH + 12);

        this.comboText = this.add.text(w / 2, hudH + 34, '', {
            fontSize: '18px', fontFamily: 'Comic Sans MS, Arial', fontStyle: 'bold',
            color: '#ffb300', stroke: '#000', strokeThickness: 3,
        }).setOrigin(0.5).setDepth(401);
    }

    hudButton(x, y, icon, onTap) {
        const c = this.add.container(x, y).setDepth(402);
        const bg = this.add.graphics();
        bg.fillStyle(0x4a90e2, 1);
        bg.fillCircle(0, 0, 21);
        bg.lineStyle(2, 0xffffff, 0.8);
        bg.strokeCircle(0, 0, 21);
        c.add(bg);
        c.add(this.add.text(0, 0, icon, { fontSize: '18px' }).setOrigin(0.5));
        c.setSize(46, 46);
        c.setInteractive({ useHandCursor: true });
        c.on('pointerdown', () => { this.tweens.add({ targets: c, scale: 0.88, duration: 80, yoyo: true }); onTap(); });
        c.on('pointerover', () => c.setScale(1.1));
        c.on('pointerout', () => c.setScale(1));
        return c;
    }

    updateRoundLabel() {
        if (!this.hudTitle || !this.gameDef) return;
        const l = this.levelCfg;
        this.hudTitle.setText(
            `${this.gameDef.icon} ${this.gameDef.name} · Màn ${this.level} ${l.label.icon} ${l.label.rank}` +
            (l.rounds ? `  ·  Câu ${Math.min(this.roundIndex + 1, l.rounds)}/${l.rounds}` : ''));
    }

    refreshLiveScore() {
        const est = ScoringEngine.computeSessionScore(
            this.analytics.getMetrics(), this.levelCfg.scoring, this.levelCfg.rounds, this.getParTimeMs());
        const target = est.score;
        this.tweens.addCounter({
            from: this.displayScore, to: target, duration: 400,
            onUpdate: (tw) => {
                this.displayScore = Math.round(tw.getValue());
                if (this.scoreText) this.scoreText.setText(`Điểm ${this.displayScore}`);
            },
        });
        if (this.starMeter) {
            const th = this.levelCfg.scoring.starThresholds;
            const stars = StarEngine.starsForScore(target, th);
            this.starMeter.setText('⭐'.repeat(stars) + '☆'.repeat(3 - stars));
        }
        if (this.comboText) {
            const streak = this.analytics.currentStreak;
            this.comboText.setText(streak >= 3 ? `🔥 Combo x${streak}!` : '');
        }
    }

    // ─── Hints ────────────────────────────────────────────────

    useHint() {
        if (this.sessionOver || this.isPaused || !this.acceptingInput) return;
        const hint = HintEngine.getHint(this.levelCfg, this.analytics.hintsUsed);
        this.analytics.recordHint();
        this.companionSay(`💡 ${hint.text}`, 3500);
        this.refreshLiveScore();
        if (this.showHintVisual) this.showHintVisual(hint);
    }

    // ─── Pause / exit ─────────────────────────────────────────

    showPause() {
        if (this.isPaused || this.sessionOver) return;
        this.isPaused = true;
        const w = this.cameras.main.width;
        const h = this.cameras.main.height;
        const o = this.add.container(0, 0).setDepth(800);

        const dim = this.add.graphics();
        dim.fillStyle(0x000000, 0.6);
        dim.fillRect(0, 0, w, h);
        o.add(dim);

        const pw = Math.min(420, w * 0.7);
        const ph = 340;
        const panel = this.add.graphics();
        panel.fillStyle(0xfff8dc, 0.98);
        panel.fillRoundedRect(w / 2 - pw / 2, h / 2 - ph / 2, pw, ph, 24);
        panel.lineStyle(4, 0xffd700, 1);
        panel.strokeRoundedRect(w / 2 - pw / 2, h / 2 - ph / 2, pw, ph, 24);
        o.add(panel);

        o.add(this.add.text(w / 2, h / 2 - ph / 2 + 44, '⏸ Tạm Nghỉ', {
            fontSize: '30px', fontFamily: 'Comic Sans MS, Arial', fontStyle: 'bold', color: '#5c3a1e',
        }).setOrigin(0.5));

        const mkBtn = (y, label, color, cb) => {
            const bw = 240;
            const bg = this.add.graphics();
            bg.fillStyle(color, 1);
            bg.fillRoundedRect(w / 2 - bw / 2, y - 26, bw, 52, 26);
            bg.lineStyle(3, 0xffffff, 0.9);
            bg.strokeRoundedRect(w / 2 - bw / 2, y - 26, bw, 52, 26);
            o.add(bg);
            o.add(this.add.text(w / 2, y, label, {
                fontSize: '21px', fontFamily: 'Comic Sans MS, Arial', fontStyle: 'bold', color: '#fff',
                stroke: '#00000055', strokeThickness: 2,
            }).setOrigin(0.5));
            const z = this.add.zone(w / 2, y, bw, 52).setInteractive({ useHandCursor: true });
            z.on('pointerdown', cb);
            o.add(z);
        };

        mkBtn(h / 2 - 40, '▶ Chơi tiếp', 0x66bb6a, () => this.hidePause());
        mkBtn(h / 2 + 30, '🔄 Chơi lại', 0x42a5f5, () => {
            this.hidePause();
            this.scene.restart({ gameId: this.gameId, level: this.level });
        });
        mkBtn(h / 2 + 100, '🗺 Về bản đồ', 0xab47bc, () => this.exitToMenu());

        o.setAlpha(0);
        this.tweens.add({ targets: o, alpha: 1, duration: 200 });
        this.pauseOverlay = o;
    }

    hidePause() {
        this.isPaused = false;
        if (this.pauseOverlay) { this.pauseOverlay.destroy(true); this.pauseOverlay = null; }
    }

    confirmExit() { // home button — reuse pause overlay style
        if (this.sessionOver) { this.exitToMenu(); return; }
        this.showPause();
    }

    exitToMenu() {
        this.hidePause();
        this.sound.stopAll();
        this.scene.stop();
        this.scene.start('MenuScreen');
    }

    // ─── Bunnine companion ────────────────────────────────────

    createCompanion(w, h) {
        const x = 74;
        const y = h - 74;
        const key = this.textures.exists('spr_bunny_idle') ? 'spr_bunny_idle' : null;
        if (!key) { this.companion = null; return; }
        this.companion = this.add.image(x, y, key).setDepth(350);
        const tex = this.textures.get(key).getSourceImage();
        this.companion.setScale(96 / tex.height);
        this.companionBaseY = y;
        this.tweens.add({
            targets: this.companion, y: y - 5, duration: 1400,
            yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
        });
    }

    companionReact(kind) {
        if (!this.companion) return;
        const map = { happy: 'spr_bunny_happy', sad: 'spr_bunny_sad', celebrate: 'spr_bunny_hop', idle: 'spr_bunny_idle' };
        const tex = map[kind] || map.idle;
        if (this.textures.exists(tex)) this.companion.setTexture(tex);
        this.tweens.killTweensOf(this.companion);
        if (kind === 'happy' || kind === 'celebrate') {
            const jumps = kind === 'celebrate' ? 5 : 2;
            this.tweens.add({
                targets: this.companion, y: this.companionBaseY - 26,
                duration: 220, yoyo: true, repeat: jumps, ease: 'Power2',
                onComplete: () => this.companionIdle(),
            });
        } else {
            this.time.delayedCall(1300, () => this.companionIdle());
        }
    }

    companionIdle() {
        if (!this.companion) return;
        if (this.textures.exists('spr_bunny_idle')) this.companion.setTexture('spr_bunny_idle');
        this.tweens.add({
            targets: this.companion, y: this.companionBaseY - 5, duration: 1400,
            yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
        });
    }

    companionSay(text, ms = 3000) {
        if (this.bubble) { this.bubble.destroy(true); this.bubble = null; }
        const w = this.cameras.main.width;
        const h = this.cameras.main.height;
        const bx = 190;
        const by = h - 150;
        const c = this.add.container(bx, by).setDepth(700);
        const t = this.add.text(0, 0, text, {
            fontSize: '18px', fontFamily: 'Comic Sans MS, Arial', color: '#4a3728', fontStyle: 'bold',
            align: 'left', wordWrap: { width: Math.min(360, w * 0.42) },
            backgroundColor: '#fff8e7', padding: { x: 12, y: 8 },
        }).setOrigin(0, 0.5);
        c.add(t);
        c.setAlpha(0);
        this.tweens.add({ targets: c, alpha: 1, y: by - 6, duration: 250, ease: 'Back.easeOut' });
        this.bubble = c;
        this.time.delayedCall(ms, () => {
            if (!c.active) return;
            this.tweens.add({
                targets: c, alpha: 0, duration: 300,
                onComplete: () => { c.destroy(true); if (this.bubble === c) this.bubble = null; },
            });
        });
    }

    // ─── Shared helpers ───────────────────────────────────────

    playVoice(key) {
        if (this.currentVoice) { try { this.currentVoice.stop(); } catch (e) { /* ignore */ } this.currentVoice = null; }
        if (this.cache.audio.exists(key)) {
            this.currentVoice = this.sound.add(key, { volume: 0.4 });
            this.currentVoice.play();
        }
    }

    spawnSparkles(x, y, count) {
        const colors = [0xffd700, 0xff69b4, 0x87ceeb, 0x90ee90, 0x9370db];
        for (let i = 0; i < count; i++) {
            const s = this.add.graphics().setDepth(500);
            s.fillStyle(colors[Phaser.Math.Between(0, colors.length - 1)], 0.85);
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

    /** Big friendly answer-button row used by choice-based rounds. */
    createChoiceButtons(options, y, onPick, opts = {}) {
        const w = this.cameras.main.width;
        const size = opts.size || Phaser.Math.Clamp(Math.round(w * 0.07), 72, 96);
        const gap = opts.gap || 22;
        const totalW = options.length * size + (options.length - 1) * gap;
        const startX = (w - totalW) / 2 + size / 2;
        const palette = [
            { fill: 0xf8bbd0, border: 0xf48fb1 },
            { fill: 0xb9f6ca, border: 0x69d99a },
            { fill: 0xb3e5fc, border: 0x64b5f6 },
            { fill: 0xfff9c4, border: 0xffd54f },
        ];
        const buttons = [];
        options.forEach((opt, i) => {
            const cx = startX + i * (size + gap);
            const pal = palette[i % palette.length];
            const c = this.add.container(cx, y).setDepth(300);
            const bg = this.add.graphics();
            bg.fillStyle(pal.fill, 1);
            bg.fillRoundedRect(-size / 2, -size / 2, size, size, 16);
            bg.lineStyle(4, pal.border, 1);
            bg.strokeRoundedRect(-size / 2, -size / 2, size, size, 16);
            c.add(bg);
            const label = this.add.text(0, 0, String(opt.label), {
                fontSize: (opts.fontSize || Math.min(size * 0.42, 36)) + 'px',
                fontFamily: 'Comic Sans MS, Arial', fontStyle: 'bold',
                color: '#fff', stroke: '#000', strokeThickness: 3,
            }).setOrigin(0.5);
            c.add(label);
            c.setSize(size, size);
            c.setInteractive({ useHandCursor: true });
            c.on('pointerdown', () => {
                if (!this.acceptingInput || this.isPaused) return;
                onPick(opt, c);
            });
            c.setScale(0);
            this.tweens.add({ targets: c, scale: 1, duration: 300, delay: i * 90, ease: 'Back.easeOut' });
            buttons.push(c);
        });
        return buttons;
    }

    shake(obj) {
        const ox = obj.x;
        this.tweens.add({
            targets: obj, x: ox - 7, duration: 55, yoyo: true, repeat: 4,
            onComplete: () => { obj.x = ox; },
        });
    }

    shutdown() {
        this.clearRoundTimer();
        this.sound.stopAll();
        if (this.levelBGM) { this.levelBGM.stop(); this.levelBGM = null; }
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GameShell };
}
