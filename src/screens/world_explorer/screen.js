/**
 * screen.js — Bunny Khám Phá Thế Giới. Cờ → nước → thủ đô → khám phá.
 * Pre-reader friendly (3–10): mọi câu hỏi + đáp án được đọc to tự động
 * (không chặn chạm), nút 🔊 đọc lại, màn 1 chọn bằng thẻ cờ hình lớn.
 * Background: magical travel adventure nhiều lớp (globe, đường bay, khinh
 * khí cầu, landmark, mây, đồi) vẽ bằng Graphics theo storybook style.
 */
class WorldExplorerScreen extends GameShell {
    constructor() {
        super('WorldExplorerScreen');
        this.gameId = 'world_explorer';
        this.theme = typeof WorldExplorerPuzzle !== 'undefined' ? WorldExplorerPuzzle : null;
        this.roundObjects = [];
        this.sessionSeed = 1;
        this.country = null;
        this.phase = 'flag';
        this.wrongs = 0;
        this.choiceBtns = [];
        this.progress = null;
        this.globeChip = null;
        this.atlas = null;
        this.locked = false;
        this.narrTimers = [];
        this.narration = null;
    }

    init(data) {
        super.init(data);
        this.roundObjects = [];
        this.choiceBtns = [];
        this.country = null;
        this.phase = 'flag';
        this.wrongs = 0;
        this.globeChip = null;
        this.atlas = null;
        this.locked = false;
        this.flagView = null;
        this.biomeLayer = null;
        this.fact = null;
        this.narrTimers = [];
        this.narration = null;
    }

    onPreload() {
        this.preloadCommonAudio('world_explorer');
    }

    introText() {
        return (this.theme && this.theme.copy.intro[this.level]) || 'Cùng Bunny bay khám phá thế giới nào!';
    }

    onSessionStart() {
        this.sessionSeed = (Date.now() % 100000) + this.level * 97;
        this.progress = WorldExplorerEngine.loadProgress();
        this.paintGlobeChip();
        this.analytics.recordExploration(0, 3);
    }

    // ─── Voice cho bé chưa biết đọc (không bao giờ chặn tương tác) ───

    voiceOn() {
        if (typeof AudioEngine === 'undefined') return false;
        const s = AudioEngine.settings || AudioEngine.DEFAULT_SETTINGS || {};
        return s.soundEnabled !== false && (s.voice == null || s.voice > 0.02);
    }

    speak(text) {
        if (!text || !this.voiceOn() || typeof VoiceEngine === 'undefined') return;
        VoiceEngine.speakRaw(text, { voice: 'narrator' });
    }

    estimateMs(text) {
        return Math.max(1200, Math.min(4500, 900 + String(text || '').length * 62));
    }

    pulse(btn) {
        this.tweens.add({
            targets: btn, scaleX: 1.07, scaleY: 1.07,
            duration: 240, yoyo: true, ease: 'Sine.easeInOut',
        });
    }

    /** lines: string | { text, btn } — đọc tuần tự, chạm là dừng ngay. */
    narrateLines(lines) {
        this.stopNarration();
        this.narration = lines;
        if (!this.voiceOn()) return;
        let delay = 350;
        (lines || []).forEach((ln) => {
            const item = typeof ln === 'string' ? { text: ln } : ln;
            if (!item.text) return;
            const timer = this.time.delayedCall(delay, () => {
                if (item.btn && item.btn.active) this.pulse(item.btn);
                this.speak(item.text);
            });
            this.narrTimers.push(timer);
            delay += this.estimateMs(item.text);
        });
    }

    stopNarration() {
        (this.narrTimers || []).forEach((t) => { if (t && t.remove) t.remove(); });
        this.narrTimers = [];
        if (typeof VoiceEngine !== 'undefined') VoiceEngine.stopCurrent();
    }

    replayNarration() {
        if (this.narration) this.narrateLines(this.narration);
    }

    narrateQuestion(prompt, choices) {
        const lines = [{ text: prompt }];
        (choices || []).forEach((ch, i) => lines.push({ text: ch.label, btn: this.choiceBtns[i] }));
        this.narrateLines(lines);
    }

    showHintVisual() {
        const btn = this.choiceBtns.find((b) => b.getData && b.getData('correct'));
        if (!btn) return;
        this.tweens.add({
            targets: btn, scaleX: 1.08, scaleY: 1.08,
            duration: 280, yoyo: true, repeat: 2, ease: 'Sine.easeInOut',
        });
    }

    // ─── Background: magical travel adventure ─────────────────────

    buildWorld(w, h) {
        const g = this.add.graphics().setDepth(0);
        g.fillGradientStyle(0x5bb3ec, 0x7ec8f7, 0xdff3ff, 0xfdf0d5, 1);
        g.fillRect(0, 0, w, h);

        const sunX = w * 0.88;
        const sunY = h * 0.12;
        g.fillStyle(0xfff176, 0.16);
        g.fillCircle(sunX, sunY, 78);
        g.fillStyle(0xfff176, 0.30);
        g.fillCircle(sunX, sunY, 54);
        g.fillStyle(0xffee58, 0.95);
        g.fillCircle(sunX, sunY, 34);
        g.fillStyle(0xffffff, 0.5);
        g.fillCircle(sunX - 10, sunY - 10, 12);

        const hills = this.add.graphics().setDepth(1);
        hills.fillStyle(0xa5d6a7, 0.55);
        hills.fillEllipse(w * 0.22, h * 1.04, w * 0.95, h * 0.44);
        hills.fillStyle(0x81c784, 0.55);
        hills.fillEllipse(w * 0.82, h * 1.08, w * 0.95, h * 0.42);

        this.paintGlobe(w, h);
        this.paintLandmarks(w, h);
        this.paintFlightPath(w, h);
        this.paintBalloon(w * 0.13, h * 0.20);

        this.addCloud(w * 0.20, h * 0.12, 1.2, 0.95, 2, 26000);
        this.addCloud(w * 0.55, h * 0.07, 0.9, 0.9, 2, 20000);
        this.addCloud(w * 0.80, h * 0.26, 1.0, 0.85, 6, 18000);
        this.addCloud(w * 0.34, h * 0.32, 0.7, 0.7, 6, 15000);

        this.addGulls(w, h);

        this.floatEmoji('⭐', w * 0.22, h * 0.42, 12, -16, 4200);
        this.floatEmoji('✨', w * 0.70, h * 0.38, -10, 14, 3800);
        this.floatEmoji('⭐', w * 0.46, h * 0.18, 8, -12, 4600);

        const colors = [0xffffff, 0xfff59d, 0x80deea];
        for (let i = 0; i < 12; i++) {
            const px = Phaser.Math.Between(24, w - 24);
            const py = Phaser.Math.Between(70, h * 0.5);
            const spark = this.add.graphics().setDepth(4);
            spark.fillStyle(colors[i % colors.length], 0.7);
            spark.fillCircle(0, 0, Phaser.Math.Between(2, 4));
            spark.setPosition(px, py);
            this.tweens.add({
                targets: spark, y: py - 20, alpha: 0.2,
                duration: 2000 + i * 90, yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
            });
        }
    }

    /** Quả địa cầu lớn nhô lên từ dưới — Bunny đang bay trên bầu trời thế giới. */
    paintGlobe(w, h) {
        const R = Math.min(w * 0.32, 300);
        const globe = this.add.container(w * 0.5, h * 1.04).setDepth(3);
        const g = this.add.graphics();
        g.fillStyle(0xffffff, 0.16);
        g.fillCircle(0, 0, R + 30);
        g.fillGradientStyle(0x8fd8f8, 0x8fd8f8, 0x3d9be0, 0x3d9be0, 1);
        g.fillCircle(0, 0, R);
        g.fillStyle(0x7cc46f, 0.95);
        g.fillEllipse(-R * 0.38, -R * 0.34, R * 0.52, R * 0.34);
        g.fillCircle(-R * 0.52, -R * 0.12, R * 0.14);
        g.fillEllipse(R * 0.28, -R * 0.22, R * 0.44, R * 0.30);
        g.fillStyle(0x5fae63, 0.95);
        g.fillCircle(R * 0.46, -R * 0.42, R * 0.10);
        g.fillEllipse(-R * 0.10, R * 0.28, R * 0.42, R * 0.26);
        g.fillCircle(R * 0.42, R * 0.30, R * 0.10);
        g.fillCircle(R * 0.56, R * 0.16, R * 0.07);
        g.fillCircle(-R * 0.62, R * 0.22, R * 0.06);
        g.lineStyle(7, 0xffffff, 0.40);
        g.beginPath();
        g.arc(-R * 0.2, -R * 0.55, R * 0.30, Math.PI * 0.15, Math.PI * 0.85);
        g.strokePath();
        g.beginPath();
        g.arc(R * 0.3, -R * 0.05, R * 0.24, Math.PI * 1.1, Math.PI * 1.9);
        g.strokePath();
        g.lineStyle(14, 0x1565c0, 0.18);
        g.beginPath();
        g.arc(0, 0, R - 10, Math.PI * 0.25, Math.PI * 0.75);
        g.strokePath();
        g.lineStyle(5, 0xffffff, 0.85);
        g.strokeCircle(0, 0, R);
        globe.add(g);
        for (let i = 0; i < 6; i++) {
            const a = Math.PI * (1.15 + i * 0.14);
            const sx = Math.cos(a) * (R + 18);
            const sy = Math.sin(a) * (R + 18);
            const star = this.add.text(sx, sy, '✦', { fontSize: '16px', color: '#ffffff' }).setOrigin(0.5);
            globe.add(star);
            this.tweens.add({
                targets: star, alpha: 0.25, scale: 0.7,
                duration: 1200 + i * 180, yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
            });
        }
        this.tweens.add({
            targets: globe, angle: 2.5, duration: 9000, yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
        });
        this.globe = globe;
    }

    /** Hàng landmark nhỏ trên chân trời — cảm giác vòng quanh thế giới. */
    paintLandmarks(w, h) {
        const marks = [
            ['🏯', 0.17, 0.795, 40], ['🗼', 0.28, 0.765, 46],
            ['🎡', 0.72, 0.770, 44], ['🗽', 0.84, 0.795, 46], ['🕌', 0.93, 0.760, 40],
        ];
        marks.forEach(([emoji, rx, ry, size], i) => {
            const t = this.add.text(w * rx, h * ry, emoji, { fontSize: `${size}px` })
                .setOrigin(0.5, 1).setDepth(3).setAlpha(0.9);
            this.tweens.add({
                targets: t, y: h * ry - 6, duration: 2400 + i * 260,
                yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
            });
        });
    }

    /** Đường bay nét đứt + máy bay nhỏ bay vòng qua bầu trời. */
    paintFlightPath(w, h) {
        const curve = new Phaser.Curves.QuadraticBezier(
            new Phaser.Math.Vector2(-80, h * 0.34),
            new Phaser.Math.Vector2(w * 0.45, h * 0.02),
            new Phaser.Math.Vector2(w + 80, h * 0.18),
        );
        const dots = this.add.graphics().setDepth(4);
        dots.fillStyle(0xffffff, 0.55);
        for (let i = 0; i <= 46; i++) {
            const p = curve.getPoint(i / 46);
            dots.fillCircle(p.x, p.y, 3.2);
        }
        const plane = this.add.text(-80, h * 0.34, '✈️', { fontSize: '30px' }).setOrigin(0.5).setDepth(7);
        const state = { t: 0 };
        this.tweens.add({
            targets: state, t: 1, duration: 18000, repeat: -1,
            onUpdate: () => {
                const p = curve.getPoint(state.t);
                plane.setPosition(p.x, p.y);
                const tan = curve.getTangent(state.t);
                plane.setRotation(tan.angle() * 0.25);
                plane.setAlpha(state.t < 0.04 ? state.t / 0.04 : (state.t > 0.96 ? (1 - state.t) / 0.04 : 1));
            },
        });
    }

    /** Khinh khí cầu chở Bunny — nhân vật đồng hành của chuyến phiêu lưu. */
    paintBalloon(x, y) {
        const c = this.add.container(x, y).setDepth(5);
        const balloon = this.add.text(0, 0, '🎈', { fontSize: '46px' }).setOrigin(0.5);
        const string = this.add.graphics();
        string.lineStyle(2, 0x8d6e63, 0.8);
        string.lineBetween(0, 22, 0, 36);
        const bunny = this.add.text(0, 42, '🐰', { fontSize: '22px' }).setOrigin(0.5);
        c.add([balloon, string, bunny]);
        this.tweens.add({
            targets: c, y: y - 14, duration: 3200, yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
        });
        this.tweens.add({
            targets: c, x: x + 42, duration: 17000, yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
        });
    }

    addGulls(w, h) {
        [[0.30, 0.16], [0.37, 0.20], [0.62, 0.13]].forEach(([rx, ry], i) => {
            const gull = this.add.graphics().setDepth(4);
            gull.lineStyle(3, 0x607d8b, 0.7);
            gull.beginPath();
            gull.arc(-7, 0, 7, Math.PI * 1.12, Math.PI * 1.88);
            gull.strokePath();
            gull.beginPath();
            gull.arc(7, 0, 7, Math.PI * 1.12, Math.PI * 1.88);
            gull.strokePath();
            gull.setPosition(w * rx, h * ry);
            this.tweens.add({
                targets: gull, x: w * rx + 56, y: h * ry - 10,
                duration: 9000 + i * 1400, yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
            });
        });
    }

    addCloud(x, y, s, alpha, depth, dur) {
        const c = this.add.container(x, y).setDepth(depth).setAlpha(alpha);
        const g = this.add.graphics();
        g.fillStyle(0xd7e9f7, 0.9);
        g.fillEllipse(0, 12 * s, 84 * s, 20 * s);
        g.fillStyle(0xffffff, 1);
        g.fillEllipse(0, 0, 92 * s, 34 * s);
        g.fillEllipse(-30 * s, 6 * s, 52 * s, 26 * s);
        g.fillEllipse(32 * s, 5 * s, 46 * s, 24 * s);
        g.fillEllipse(-2 * s, -12 * s, 56 * s, 30 * s);
        c.add(g);
        this.tweens.add({
            targets: c, x: x + 70 * s, duration: dur || 16000,
            yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
        });
    }

    floatEmoji(glyph, x, y, dx, dy, ms) {
        const t = this.add.text(x, y, glyph, { fontSize: '26px' }).setDepth(6).setOrigin(0.5);
        this.tweens.add({
            targets: t, x: x + dx, y: y + dy, duration: ms,
            yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
        });
    }

    paintGlobeChip() {
        const w = this.cameras.main.width;
        const stats = WorldExplorerEngine.worldStats(this.progress);
        const label = `🌎  ${stats.discovered} / ${stats.total}`;
        if (this.globeChip && this.globeChip.active && this.globeChip.listText) {
            this.globeChip.setLabel(label);
            return;
        }
        this.globeChip = UISystem.chip(this, w / 2, DesignTokens.layout.chromeY, label, {
            minWidth: 140, height: 42, fontSize: 16, fill: 0xe3f2fd,
        });
        this.globeChip.setDepth(401);
        UISystem.enableHit(this.globeChip, 150, 46);
        UISystem.bindTap(this, this.globeChip, () => this.toggleAtlas());
    }

    // ─── Round flow ───────────────────────────────────────────────

    track(obj) { this.roundObjects.push(obj); return obj; }

    clearRound() {
        this.roundObjects.forEach((o) => { if (o && o.active) o.destroy(true); });
        this.roundObjects = [];
        this.choiceBtns = [];
        this.locked = false;
        this.wrongs = 0;
        this.flagView = null;
        this.biomeLayer = null;
        this.stopNarration();
        this.narration = null;
    }

    presentRound(index) {
        this.clearRound();
        const hist = (this.progress && this.progress.recent) || [];
        const seed = this.sessionSeed + index * 19 + this.level * 5;
        const picked = WorldExplorerEngine.pick({
            difficulty: this.level, history: hist, progress: this.progress, seed,
        });
        if (!picked.country) return;
        this.country = picked.country;
        this.progress = WorldExplorerEngine.pushRecent(this.progress, this.country.id);
        WorldExplorerEngine.saveProgress(this.progress);
        this.phase = 'flag';
        this.showFlagPhase();
    }

    showFlagPhase() {
        this.clearPlay();
        this.companionReact('curious');
        const q = WorldExplorerEngine.flagQuestion(this.country, this.sessionSeed + this.roundIndex * 3);
        this.drawFlag(this.country.flag, 1);
        this.drawPrompt(q.prompt);
        const choices = q.choices.map((c) => ({
            id: c.id, label: c.name || c.label, flag: c.flag || '', correct: c.id === this.country.id,
        }));
        if (this.level === 1) {
            this.drawFlagCards(choices, (choice) => this.onFlag(choice));
        } else {
            this.drawChoices(choices, (choice) => this.onFlag(choice));
        }
        this.narrateQuestion(q.prompt, choices);
    }

    onFlag(choice) {
        if (this.locked) return;
        this.stopNarration();
        if (choice.correct) {
            this.progress = WorldExplorerEngine.recordSkill(this.progress, this.country.id, 'flag', true);
            this.progress = WorldExplorerEngine.recordSkill(this.progress, this.country.id, 'country', true);
            WorldExplorerEngine.saveProgress(this.progress);
            this.paintGlobeChip();
            this.celebrate(choice.label);
            this.afterCorrect(() => {
                if (this.level === 1) this.showDiscovery();
                else this.showCapitalPhase();
            });
        } else {
            this.miss();
        }
    }

    showCapitalPhase() {
        this.clearPlay();
        const q = WorldExplorerEngine.capitalQuestion(this.country, this.sessionSeed + 40 + this.roundIndex);
        this.drawFlag(this.country.flag, 0.72);
        this.drawPrompt(`${this.country.flag}  ${this.country.name}\n${q.prompt}`);
        const choices = q.choices.map((c) => ({
            id: c.id || c.label, label: c.label || c, correct: (c.label || c) === this.country.capital,
        }));
        this.drawChoices(choices, (choice) => this.onCapital(choice));
        this.narrateQuestion(q.prompt, choices);
    }

    onCapital(choice) {
        if (this.locked) return;
        this.stopNarration();
        if (choice.correct) {
            this.progress = WorldExplorerEngine.recordSkill(this.progress, this.country.id, 'capital', true);
            WorldExplorerEngine.saveProgress(this.progress);
            this.celebrate(choice.label);
            this.afterCorrect(() => {
                if (this.level === 3) this.showContinentPhase();
                else this.showDiscovery();
            });
        } else {
            this.miss();
        }
    }

    showContinentPhase() {
        this.clearPlay();
        const q = WorldExplorerEngine.continentQuestion(this.country, this.sessionSeed + 70);
        this.drawFlag(this.country.flag, 0.7);
        this.drawPrompt(q.prompt);
        const choices = q.choices.map((c) => ({
            id: c.id || c.label, label: c.label || c, correct: (c.label || c) === q.correct,
        }));
        this.drawChoices(choices, (choice) => {
            if (this.locked) return;
            this.stopNarration();
            if (choice.correct) {
                this.celebrate(choice.label);
                this.afterCorrect(() => this.showDiscovery());
            } else this.miss();
        });
        this.narrateQuestion(q.prompt, choices);
    }

    showDiscovery() {
        this.clearPlay();
        this.paintBiome();
        const seen = WorldExplorerEngine.countryState(this.progress, this.country.id).factsSeen;
        const fact = WorldExplorerEngine.pickFact(this.country, seen, this.sessionSeed + 90 + this.roundIndex, this.level);
        this.fact = fact;
        if (fact) {
            this.progress = WorldExplorerEngine.rememberFact(this.progress, this.country.id, fact.id);
            this.progress = WorldExplorerEngine.recordSkill(this.progress, this.country.id, 'fact', true);
        }
        if (this.level === 1) {
            this.progress = WorldExplorerEngine.recordSkill(this.progress, this.country.id, 'capital', true);
        }
        WorldExplorerEngine.saveProgress(this.progress);
        this.companionReact('excited');
        AudioEngine.emit('StickerEarned');
        const w = this.cameras.main.width;
        const h = this.cameras.main.height;
        const heading = WorldExplorerEngine.pickTemplate('discover', this.sessionSeed + 11, this.country);
        const icons = (this.theme && this.theme.factIcons) || {};
        this.drawFlag(this.country.flag, 0.8);

        const panelW = Math.min(w * 0.78, 600);
        const panelH = 216;
        const panelY = h * 0.56;
        const panel = this.track(UISystem.panel(this, w / 2, panelY, panelW, panelH, {
            fill: 0xfffaf0, border: 0xffd166,
        }));
        panel.setDepth(75);

        const name = this.track(this.add.text(w / 2, panelY - 70, `${this.country.flag}  ${this.country.name}`, {
            fontSize: '32px', fontFamily: DesignTokens.typography.fontFamily, fontStyle: 'bold',
            color: DesignTokens.css.ink, align: 'center',
        }).setOrigin(0.5).setDepth(80));
        this.track(this.add.text(w / 2, panelY - 28, `🏙️  ${(this.theme && this.theme.copy.capitalLabel) || 'Thủ đô'}: ${this.country.capital}`, {
            fontSize: '21px', fontFamily: DesignTokens.typography.fontFamily, fontStyle: 'bold',
            color: DesignTokens.css.inkSoft,
        }).setOrigin(0.5).setDepth(80));
        const icon = fact ? (icons[fact.category] || '🌸') : '🌸';
        this.track(this.add.text(w / 2, panelY + 10, `${icon}  ${heading}`, {
            fontSize: '18px', fontFamily: DesignTokens.typography.fontFamily, fontStyle: 'bold',
            color: '#7c5cbf',
        }).setOrigin(0.5).setDepth(80));
        if (fact) {
            this.track(this.add.text(w / 2, panelY + 58, fact.vi, {
                fontSize: '20px', fontFamily: DesignTokens.typography.fontFamily,
                color: DesignTokens.css.ink, align: 'center', wordWrap: { width: panelW - 80 },
            }).setOrigin(0.5).setDepth(80));
        }
        const replay = this.track(UISystem.iconButton(this, w * 0.88, DesignTokens.layout.contentTop + 50,
            '🔊', () => this.replayNarration(), { radius: 22, color: 0x4fc3f7 }));
        replay.setDepth(90);
        this.sparkle(name.x, name.y);
        const go = this.track(UISystem.primaryButton(this, w / 2, h * 0.86,
            (this.theme && this.theme.copy.continue) || 'Tiếp tục khám phá',
            () => {
                if (this.level === 1) this.finishCountry();
                else this.showKnowledgePhase();
            },
            { width: 320, height: 56, fontSize: 20 }));
        go.setDepth(90);

        const lines = [
            `${this.country.name}!`,
            `Thủ đô của ${this.country.name} là ${this.country.capital}.`,
        ];
        if (fact) lines.push(fact.vi);
        this.narrateLines(lines);
    }

    showKnowledgePhase() {
        this.clearPlay();
        const q = WorldExplorerEngine.knowledgeQuestion(
            this.country, this.fact, this.sessionSeed + 110 + this.roundIndex, this.level,
        );
        this.drawFlag(this.country.flag, 0.62);
        this.drawPrompt(`${this.country.flag}  ${this.country.name}\n${q.prompt}`);
        const choices = q.choices.map((c) => {
            const label = typeof c === 'string' ? c : (c.label || c);
            return { id: label, label, correct: label === q.correct };
        });
        this.drawChoices(choices, (choice) => {
            if (this.locked) return;
            this.stopNarration();
            if (choice.correct) {
                this.celebrate(choice.label);
                this.afterCorrect(() => this.finishCountry());
            } else this.miss();
        });
        this.narrateQuestion(q.prompt, choices);
    }

    finishCountry() {
        this.stopNarration();
        const stats = WorldExplorerEngine.worldStats(this.progress);
        this.analytics.exploreCount = stats.discovered;
        this.analytics.recordExploration(1, 1);
        this.paintGlobeChip();
        const p = this.cellBurst();
        this.answerCorrect(p.x, p.y);
    }

    miss() {
        this.wrongs += 1;
        this.stopNarration();
        this.answerWrong(undefined, undefined, {
            message: (this.theme && this.theme.copy.retry) || 'Gần đúng rồi! Thử lại nhé!',
        });
        this.acceptingInput = true;
        if (this.wrongs >= 2) this.showHintVisual();
    }

    celebrate(label) {
        this.locked = true;
        this.companionReact('happy');
        const flag = this.flagView;
        if (flag) {
            this.tweens.add({
                targets: flag, scaleX: (flag.scaleX || 1) * 1.12, scaleY: (flag.scaleY || 1) * 1.12,
                duration: 220, yoyo: true, ease: 'Back.easeOut',
            });
        }
        this.sparkle(this.cameras.main.width / 2, 210);
        if (label) {
            this.companionSay(label, 1200);
            this.speak(`${label}!`);
        }
    }

    afterCorrect(fn) {
        this.time.delayedCall(280, () => {
            this.locked = false;
            this.wrongs = 0;
            fn();
        });
    }

    clearPlay() {
        this.roundObjects.forEach((o) => { if (o && o.active) o.destroy(true); });
        this.roundObjects = [];
        this.choiceBtns = [];
        this.locked = false;
        this.stopNarration();
        this.narration = null;
    }

    // ─── UI pieces ────────────────────────────────────────────────

    drawFlag(flag, scale) {
        const w = this.cameras.main.width;
        const y = DesignTokens.layout.contentTop + 28;
        const t = this.track(this.add.text(w / 2, y + 36, flag, {
            fontSize: `${Math.round(108 * (scale || 1))}px`,
        }).setOrigin(0.5).setDepth(70));
        t.setScale(1);
        this.tweens.add({
            targets: t, y: t.y - 6, duration: 1400, yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
        });
        this.flagView = t;
        return t;
    }

    drawPrompt(text) {
        const w = this.cameras.main.width;
        const y = DesignTokens.layout.contentTop + 158;
        this.track(this.add.text(w / 2, y, text, {
            fontSize: '24px', fontFamily: DesignTokens.typography.fontFamily, fontStyle: 'bold',
            color: DesignTokens.css.ink, align: 'center', wordWrap: { width: w * 0.66 },
        }).setOrigin(0.5).setDepth(80));
        const replay = UISystem.iconButton(this, w * 0.86, y, '🔊',
            () => this.replayNarration(), { radius: 22, color: 0x4fc3f7 });
        replay.setDepth(90);
        this.track(replay);
    }

    drawChoices(choices, onPick) {
        const w = this.cameras.main.width;
        const h = this.cameras.main.height;
        const bw = Math.min(300, w * 0.36);
        const bh = 68;
        const gapX = bw + 24;
        const gapY = 84;
        const ox = w / 2;
        const oy = h * 0.56;
        const spots = [
            { x: ox - gapX / 2, y: oy },
            { x: ox + gapX / 2, y: oy },
            { x: ox - gapX / 2, y: oy + gapY },
            { x: ox + gapX / 2, y: oy + gapY },
        ];
        choices.slice(0, 4).forEach((choice, i) => {
            const pos = spots[i];
            const btn = this.track(UISystem.primaryButton(this, pos.x, pos.y, choice.label, () => {
                if (!this.acceptingInput) return;
                onPick(choice);
            }, {
                width: bw, height: bh, fontSize: choice.label.length > 16 ? 16 : 21,
                color: choice.correct && this.wrongs >= 2 ? 0x81c784 : 0x7c5cbf,
            }));
            btn.setDepth(90);
            btn.setData('correct', !!choice.correct);
            this.choiceBtns.push(btn);
        });
    }

    /** Màn 1 (3–5 tuổi): chọn bằng thẻ cờ hình lớn — không cần biết đọc. */
    drawFlagCards(choices, onPick) {
        const w = this.cameras.main.width;
        const h = this.cameras.main.height;
        const cw = Math.min(190, w * 0.32);
        const ch = 110;
        const gapX = cw + Math.max(20, w * 0.03);
        const gapY = ch + 18;
        const ox = w / 2;
        const oy = h * 0.55;
        const spots = [
            { x: ox - gapX / 2, y: oy },
            { x: ox + gapX / 2, y: oy },
            { x: ox - gapX / 2, y: oy + gapY },
            { x: ox + gapX / 2, y: oy + gapY },
        ];
        choices.slice(0, 4).forEach((choice, i) => {
            const pos = spots[i];
            const c = this.add.container(pos.x, pos.y).setDepth(90);
            const g = this.add.graphics();
            g.fillStyle(DesignTokens.shadow.color, 0.18);
            g.fillRoundedRect(-cw / 2, -ch / 2 + 4, cw, ch, 22);
            g.fillStyle(0xfffaf0, 0.98);
            g.fillRoundedRect(-cw / 2, -ch / 2, cw, ch, 22);
            g.lineStyle(3, 0xffd166, 0.9);
            g.strokeRoundedRect(-cw / 2, -ch / 2, cw, ch, 22);
            c.add(g);
            c.add(this.add.text(0, -ch / 2 + 36, choice.flag, { fontSize: '44px' }).setOrigin(0.5));
            c.add(this.add.text(0, ch / 2 - 26, choice.label, {
                fontSize: choice.label.length > 14 ? '13px' : '15px',
                fontFamily: DesignTokens.typography.fontFamily, fontStyle: 'bold',
                color: DesignTokens.css.ink, align: 'center', wordWrap: { width: cw - 20 },
            }).setOrigin(0.5));
            UISystem.enableHit(c, cw, ch);
            UISystem.bindTap(this, c, () => {
                if (!this.acceptingInput) return;
                onPick(choice);
            });
            c.setData('correct', !!choice.correct);
            this.track(c);
            this.choiceBtns.push(c);
        });
    }

    /** Cảnh khám phá theo biome — phủ toàn màn hình, thay thế world scene. */
    paintBiome() {
        if (this.biomeLayer && this.biomeLayer.active) this.biomeLayer.destroy();
        const w = this.cameras.main.width;
        const h = this.cameras.main.height;
        const B = this.theme ? this.theme.biomeOf(this.country) : null;
        if (!B) return;
        const layer = this.add.container(0, 0).setDepth(8);
        const g = this.add.graphics();
        g.fillGradientStyle(B.skyTop, B.skyTop, B.skyBottom, B.skyBottom, 0.96);
        g.fillRect(0, 0, w, h);
        g.fillStyle(0xffffff, 0.22);
        g.fillCircle(w * 0.85, h * 0.14, 62);
        g.fillStyle(B.land, 0.9);
        g.fillEllipse(w * 0.5, h * 1.08, w * 1.5, h * 0.52);
        g.fillStyle(B.land2, 0.9);
        g.fillEllipse(w * 0.14, h * 1.03, w * 0.7, h * 0.38);
        g.fillEllipse(w * 0.88, h * 1.04, w * 0.66, h * 0.36);
        layer.add(g);
        const deco = B.deco || [];
        if (deco[0]) {
            const big = this.add.text(w / 2, h * 0.22, deco[0], { fontSize: '92px' })
                .setOrigin(0.5).setAlpha(0.28);
            layer.add(big);
            this.tweens.add({
                targets: big, scale: 1.08, duration: 2600, yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
            });
        }
        const spots = [
            [0.10, 0.34], [0.24, 0.27], [0.76, 0.28], [0.90, 0.35], [0.15, 0.62], [0.85, 0.62],
        ];
        spots.forEach(([rx, ry], i) => {
            const emoji = deco[i % deco.length];
            if (!emoji) return;
            const t = this.add.text(w * rx, h * ry, emoji, { fontSize: '34px' }).setOrigin(0.5);
            layer.add(t);
            this.tweens.add({
                targets: t, y: h * ry - 9, duration: 1700 + i * 130,
                yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
            });
        });
        this.biomeLayer = layer;
        this.track({ destroy: () => { if (layer.active) layer.destroy(true); } });
    }

    sparkle(x, y) {
        if (typeof RewardFX !== 'undefined' && RewardFX.correctAnswer) {
            RewardFX.correctAnswer(this, x, y, { addStar: false, flash: false });
        }
    }

    cellBurst() {
        return { x: this.cameras.main.width / 2, y: this.cameras.main.height * 0.4 };
    }

    toggleAtlas() {
        if (this.atlas) { this.closeAtlas(); return; }
        const w = this.cameras.main.width;
        const h = this.cameras.main.height;
        const stats = WorldExplorerEngine.worldStats(this.progress);
        const names = (this.theme && this.theme.continentNames) || {};
        const emojis = (this.theme && this.theme.continentEmoji) || {};
        const o = this.add.container(0, 0).setDepth(860);
        const dim = this.add.graphics();
        dim.fillStyle(0x1a0f2e, 0.45);
        dim.fillRect(0, 0, w, h);
        o.add(dim);
        const panel = this.add.graphics();
        panel.fillStyle(0xfff8e7, 0.97);
        panel.fillRoundedRect(w * 0.14, 64, w * 0.72, h - 120, 28);
        panel.lineStyle(3, 0xffd166, 0.85);
        panel.strokeRoundedRect(w * 0.14, 64, w * 0.72, h - 120, 28);
        o.add(panel);
        const title = this.add.text(w / 2, 100, `🧭  ${(this.theme && this.theme.copy.atlasTitle) || 'THẾ GIỚI'}`, {
            fontSize: '28px', fontFamily: DesignTokens.typography.fontFamily, fontStyle: 'bold',
            color: DesignTokens.css.ink,
        }).setOrigin(0.5);
        o.add(title);
        const total = this.add.text(w / 2, 138, `${stats.discovered} / ${stats.total} quốc gia`, {
            fontSize: '18px', fontFamily: DesignTokens.typography.fontFamily, color: DesignTokens.css.inkSoft,
        }).setOrigin(0.5);
        o.add(total);
        const keys = ['asia', 'europe', 'africa', 'north_america', 'south_america', 'oceania'];
        keys.forEach((k, i) => {
            const line = `${emojis[k] || '🌍'}  ${names[k] || k}    ${stats.continentDiscovered[k] || 0} / ${stats.continentTotals[k] || 0}`;
            const t = this.add.text(w / 2, 190 + i * 42, line, {
                fontSize: '20px', fontFamily: DesignTokens.typography.fontFamily, fontStyle: 'bold',
                color: DesignTokens.css.ink,
            }).setOrigin(0.5);
            o.add(t);
        });
        const close = UISystem.secondaryButton(this, w / 2, h - 70,
            (this.theme && this.theme.copy.atlasClose) || 'Đóng',
            () => this.closeAtlas(), { width: 180, height: 48 });
        close.setDepth(861);
        o.add(close);
        UISystem.enableHit(dim, w, h);
        dim.setInteractive(new Phaser.Geom.Rectangle(0, 0, w, h), Phaser.Geom.Rectangle.Contains);
        dim.on('pointerdown', () => this.closeAtlas());
        this.atlas = o;
    }

    closeAtlas() {
        if (!this.atlas) return;
        this.atlas.destroy(true);
        this.atlas = null;
    }

    autoSolveRound() {
        if (!this.country) return;
        const finish = () => this.finishCountry();
        if (this.phase === 'done') return finish();
        this.progress = WorldExplorerEngine.recordSkill(this.progress, this.country.id, 'flag', true);
        this.progress = WorldExplorerEngine.recordSkill(this.progress, this.country.id, 'country', true);
        this.progress = WorldExplorerEngine.recordSkill(this.progress, this.country.id, 'capital', true);
        this.progress = WorldExplorerEngine.recordSkill(this.progress, this.country.id, 'fact', true);
        WorldExplorerEngine.saveProgress(this.progress);
        finish();
    }
}

if (typeof module !== 'undefined') module.exports = { WorldExplorerScreen };
