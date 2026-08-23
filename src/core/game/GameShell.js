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
/**
 * Containers have no origin, so their default input hitArea sits bottom-right
 * of the visual center. This helper gives any container a centered hitArea.
 */
function setCenteredInput(obj, width, height, opts = {}) {
    obj.setSize(width, height);
    obj.setInteractive(Object.assign({
        hitArea: new Phaser.Geom.Rectangle(-width / 2, -height / 2, width, height),
        hitAreaCallback: Phaser.Geom.Rectangle.Contains,
        useHandCursor: true,
    }, opts));
    return obj;
}

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

    /** Preload the level's instruction voice line (generated library). */
    preloadCommonAudio(folder) {
        this.load.audio(`voice_instr_${this.gameId}_${this.level}`,
            `screens/${folder}/assets/audio/voice/level_${this.level}.mp3`);
    }

    startLevelBGM(key, url) {
        if (typeof MusicEngine !== 'undefined') {
            MusicEngine.playTheme(this, key, url, { volume: 0.35 });
        }
    }

    create() {
        this.gameDef = GameConfig.get(this.gameId);
        this.levelCfg = GameConfig.getLevel(this.gameId, this.level);
        this.analytics = new AnalyticsEngine(this.gameId, this.level);
        this.adaptive = new AdaptiveDifficultyEngine(this.levelCfg.difficulty);

        this.sound.stopAll();
        // Audio system: attach scene, load settings, register event wiring
        AudioEngine.attachScene(this);
        AudioEngine.loadSettings();
        AudioEvents.register();

        const w = this.cameras.main.width;
        const h = this.cameras.main.height;
        this.buildWorld(w, h);
        this.createCompanion(w, h);
        this.createHUD(w, h);
        if (this.onSessionStart) this.onSessionStart(w, h);

        // Area theme + environmental ambience from the game's AudioConfig
        const audioCfg = AudioConfig.gameAudio(this.gameId);
        if (audioCfg) {
            MusicEngine.playTheme(this, audioCfg.theme.key, audioCfg.theme.url, { volume: audioCfg.theme.volume });
            if (audioCfg.ambience) AmbienceEngine.start(audioCfg.ambience);
        }

        this.time.delayedCall(400, () => this.playIntro());
    }

    // ─── Intro ────────────────────────────────────────────────

    introText() { return 'Cùng chơi với Bunnine nhé!'; }
    introVoiceKey() { return `${this.gameId}_intro`; }

    playIntro() {
        const begin = () => this.startRound(0);
        AudioEngine.emit('GameStarted', { gameId: this.gameId, level: this.level });
        if (typeof IntroHelper !== 'undefined') {
            IntroHelper.play(this, {
                text: this.introText(),
                voiceKey: null, // voice handled by VoiceEngine (GameStarted event)
                showText: (t, ms) => this.companionSay(t, ms),
                onComplete: begin,
                minMs: 2000,
                maxMs: 4500,
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
        this._timeWarned = false;
        AudioEngine.emit('RoundStarted');
        if (index === this.levelCfg.rounds - 1) AudioEngine.emit('NearCompletion');
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
        AudioEngine.emit('CorrectAnswer');
        this.refreshLiveScore();
        this.time.delayedCall(opts.delayMs ?? 1600, () => this.advanceRound());
    }

    answerWrong(x, y, opts = {}) {
        if (this.sessionOver) return;
        this.analytics.recordAnswer(false);
        this.adaptive.update(this.analytics);
        this.companionReact('think'); // curious + encouraging, never sad judgment
        AudioEngine.emit('IncorrectAnswer');
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
        AudioEngine.emit('ObjectMisTap');
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
        AmbienceEngine.stop();
        AudioEngine.emit('GameCompleted');
        AudioEngine.emit('BunnyReaction');
        const w = this.cameras.main.width;
        const h = this.cameras.main.height;
        for (let i = 0; i < 12; i++) {
            this.time.delayedCall(i * 70, () => this.spawnSparkles(
                Phaser.Math.Between(80, w - 80), Phaser.Math.Between(90, h - 80), 7));
        }
        this.time.delayedCall(1400, () => {
            try {
                this.scene.pause();
                this.scene.launch('ResultScreen', { rewards, gameId: this.gameId, level: this.level });
            } catch (e) {
                console.error('ResultScreen launch failed — returning to menu', e);
                this.exitToMenu();
            }
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
                if (!this._timeWarned && this.roundTimeLeft <= 5 && this.roundTimeLeft > 0) {
                    this._timeWarned = true;
                    AudioEngine.emit('TimeWarning');
                }
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
        const L = DesignTokens.layout;
        const y = L.chromeY;

        NavSystem.mount(this, {
            onBack: () => this.goBack(),
            depth: 402,
        });

        this.titleChip = UISystem.chip(this, 200, y, this.shortTitle(), {
            minWidth: 168, height: 42, fontSize: 16,
        });
        this.titleChip.setDepth(401);
        this.hudTitle = this.titleChip.listText;

        this.scoreChip = UISystem.chip(this, w - 318, y, '0', {
            minWidth: 72, height: 42, fontSize: 16, fill: 0xfff3d6,
        });
        this.scoreChip.setDepth(401);
        this.scoreText = this.scoreChip.listText;

        this.starChip = UISystem.chip(this, w - 210, y, '☆☆☆', {
            minWidth: 88, height: 42, fontSize: 18,
        });
        this.starChip.setDepth(401);
        this.starMeter = this.starChip.listText;

        this.hudButton(w - 118, y, 'hint', () => this.useHint());
        this.hudButton(w - 48, y, 'pause', () => this.showPause());

        this.timerBarWidth = Math.min(280, w * 0.28);
        this.timerBarFill = this.add.graphics().setDepth(400);
        this.timerBarFill.setPosition(w / 2, L.hudH - 4);

        this.comboText = this.add.text(w / 2, L.hudH + 14, '', {
            fontSize: '16px', fontFamily: DesignTokens.typography.fontFamily, fontStyle: 'bold',
            color: DesignTokens.css.warning, stroke: '#00000055', strokeThickness: 2,
        }).setOrigin(0.5).setDepth(401);
    }

    shortTitle() {
        if (!this.gameDef || !this.levelCfg) return '';
        const q = this.levelCfg.rounds
            ? ` · ${Math.min(this.roundIndex + 1, this.levelCfg.rounds)}/${this.levelCfg.rounds}`
            : '';
        return `${this.gameDef.icon}  Màn ${this.level}${q}`;
    }

    hudButton(x, y, icon, onTap) {
        const c = UISystem.iconButton(this, x, y, icon, onTap, { radius: 24, iconSize: 18 });
        c.setDepth(402);
        return c;
    }

    updateRoundLabel() {
        if (!this.titleChip || !this.gameDef) return;
        this.titleChip.setLabel(this.shortTitle());
    }

    refreshLiveScore() {
        const est = ScoringEngine.computeSessionScore(
            this.analytics.getMetrics(), this.levelCfg.scoring, this.levelCfg.rounds, this.getParTimeMs());
        const target = est.score;
        this.tweens.addCounter({
            from: this.displayScore, to: target, duration: 400,
            onUpdate: (tw) => {
                this.displayScore = Math.round(tw.getValue());
                if (this.scoreChip) this.scoreChip.setLabel(`${this.displayScore}`);
                else if (this.scoreText) this.scoreText.setText(`${this.displayScore}`);
            },
        });
        if (this.starChip || this.starMeter) {
            const th = this.levelCfg.scoring.starThresholds;
            const stars = StarEngine.starsForScore(target, th);
            const label = '⭐'.repeat(stars) + '☆'.repeat(3 - stars);
            if (this.starChip) this.starChip.setLabel(label);
            else this.starMeter.setText(label);
        }
        if (this.comboText) {
            const streak = this.analytics.currentStreak;
            this.comboText.setText(streak >= 3 ? `🔥 Combo x${streak}!` : '');
            if (streak >= 3 && streak !== this._lastComboStreak) {
                AudioEngine.emit('ComboStarted', { streak });
                this.companionReact('excited');
            }
            this._lastComboStreak = streak;
        }
    }

    // ─── Hints ────────────────────────────────────────────────

    useHint() {
        if (this.sessionOver || this.isPaused || !this.acceptingInput) return;
        const hint = HintEngine.getHint(this.levelCfg, this.analytics.hintsUsed);
        this.analytics.recordHint();
        AudioEngine.emit('HintRequested');
        AudioEngine.track('hintUsed');
        this.companionReact('curious');
        this.companionSay(`💡 ${hint.text}`, 3500);
        this.refreshLiveScore();
        if (this.showHintVisual) this.showHintVisual(hint);
    }

    // ─── Pause / exit ─────────────────────────────────────────

    showPause() {
        if (this.isPaused || this.sessionOver) return;
        this.isPaused = true;
        AudioEngine.emit('Paused');
        const w = this.cameras.main.width;
        const h = this.cameras.main.height;
        const o = this.add.container(0, 0).setDepth(800);

        const dim = this.add.graphics();
        dim.fillStyle(0x000000, 0.6);
        dim.fillRect(0, 0, w, h);
        o.add(dim);

        const pw = Math.min(420, w * 0.7);
        const ph = 420;
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
            const b = UISystem.primaryButton(this, w / 2, y, label, cb, { width: 240, height: 52, color });
            o.add(b);
        };

        mkBtn(h / 2 - 70, 'Chơi tiếp', DesignTokens.colors.success, () => this.hidePause());
        mkBtn(h / 2, 'Chơi lại', DesignTokens.colors.secondary, () => {
            this.hidePause();
            this.scene.restart({ gameId: this.gameId, level: this.level });
        });
        mkBtn(h / 2 + 70, 'Chọn màn', DesignTokens.colors.primary, () => this.goBack());
        mkBtn(h / 2 + 140, 'Về nhà', 0x7c5cbf, () => this.exitToMenu());

        o.setAlpha(0);
        this.tweens.add({ targets: o, alpha: 1, duration: 200 });
        this.pauseOverlay = o;
    }

    hidePause() {
        this.isPaused = false;
        if (this.pauseOverlay) { this.pauseOverlay.destroy(true); this.pauseOverlay = null; }
    }

    /** Back = previous screen (level select of this game). Never Home. */
    goBack() {
        this.hidePause();
        NavSystem.backToLevels(this, this.gameId);
    }

    exitToMenu() {
        this.hidePause();
        NavSystem.home(this);
    }

    // ─── Bunnine companion ────────────────────────────────────

    createCompanion(w, h) {
        const x = Math.round(w * DesignTokens.layout.companionX);
        const y = Math.round(h * DesignTokens.layout.companionY + 80);
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

    /**
     * Character emotion system: gameplay events map to Bunnine's emotional
     * states. Never negative — wrong answers get curiosity + encouragement.
     */
    companionReact(kind) {
        if (!this.companion) return;
        const EMOTIONS = {
            happy: { tex: 'spr_bunny_happy', jumps: 2 },       // correct answer
            excited: { tex: 'spr_bunny_happy', jumps: 4 },     // streak / new reward
            celebrate: { tex: 'spr_bunny_hop', jumps: 5 },     // level complete
            sad: { tex: 'spr_bunny_sad', jumps: 0 },           // gentle empathy (brief)
            think: { tex: 'spr_bunny_idle', tilt: 12 },        // wrong answer → thinking
            curious: { tex: 'spr_bunny_idle', tilt: -10 },     // hint / discovery
            idle: { tex: 'spr_bunny_idle' },
        };
        const emo = EMOTIONS[kind] || EMOTIONS.idle;
        if (this.textures.exists(emo.tex)) this.companion.setTexture(emo.tex);
        this.tweens.killTweensOf(this.companion);
        if (emo.jumps) {
            this.tweens.add({
                targets: this.companion, y: this.companionBaseY - 26,
                duration: 220, yoyo: true, repeat: emo.jumps, ease: 'Power2',
                onComplete: () => this.companionIdle(),
            });
        } else if (emo.tilt) {
            this.tweens.add({
                targets: this.companion, angle: emo.tilt, duration: 280,
                yoyo: true, hold: 500,
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
        const c = UISystem.speechBubble(this, bx, by, text, { maxWidth: Math.min(360, w * 0.42), align: 'left' });
        c.setDepth(700);
        c.setAlpha(0);
        this.tweens.add({ targets: c, alpha: 1, y: by - 6, duration: DesignTokens.motion.uiTransition, ease: DesignTokens.motion.easeOut });
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
        const buttons = [];
        options.forEach((opt, i) => {
            const cx = startX + i * (size + gap);
            const c = UISystem.answerButton(this, cx, y, opt.label, (btn) => {
                if (!this.acceptingInput || this.isPaused) return;
                onPick(opt, btn);
            }, { size, fontSize: opts.fontSize || DesignTokens.typography.number, index: i });
            c.setDepth(300);
            c.setScale(0);
            this.tweens.add({ targets: c, scale: 1, duration: DesignTokens.motion.uiTransition, delay: i * 90, ease: DesignTokens.motion.easeOut });
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
        VoiceEngine.stopCurrent();
        AmbienceEngine.stop();
        MusicEngine.stopTheme(300);
        this.sound.stopAll();
        if (this.levelBGM) { this.levelBGM.stop(); this.levelBGM = null; }
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GameShell };
}
