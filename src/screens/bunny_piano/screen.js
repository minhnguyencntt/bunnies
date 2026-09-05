/**
 * screen.js — Vườn Nhạc Bunnine. Nghe → đọc khuông nhạc → bấm phím.
 */
class BunnyPianoScreen extends GameShell {
    constructor() {
        super('BunnyPianoScreen');
        this.gameId = 'bunny_piano';
        this.theme = typeof BunnyPianoPuzzle !== 'undefined' ? BunnyPianoPuzzle : null;
        this.roundObjects = [];
        this.keys = {};
        this.sessionSeed = 1;
        this.challenge = null;
        this.step = 0;
        this.phase = 'demo';
        this.freePlay = false;
        this.songMode = false;
        this.songSpeed = 'normal';
        this.memoryOn = false;
        this.hiddenTail = 0;
        this.demoEvents = [];
        this.staffSlots = [];
        this.listenIndex = -1;
    }

    onPreload() {
        this.preloadCommonAudio('bunny_piano');
    }

    introText() {
        return (this.theme && this.theme.copy.intro[this.level]) || 'Nhìn nốt trên khuông nhạc, rồi bấm phím piano nhé!';
    }

    buildWorld(w, h) {
        const T = (this.theme && this.theme.worldForLevel(this.level)) || {
            skyTop: 0x81d4fa, skyBottom: 0xf8bbd0, grass: 0x9ccc65,
            hill1: 0xaed581, hill2: 0xf48fb1, canopy: 0x43a047, sun: 0xffecb3,
            deco: ['🌸', '♪'], particleColors: [0xffffff, 0xfff59d],
        };
        const g = this.add.graphics().setDepth(0);
        g.fillGradientStyle(T.skyTop, T.skyTop, T.skyBottom, T.skyBottom, 1);
        g.fillRect(0, 0, w, h);
        g.fillStyle(T.sun, 0.4);
        g.fillCircle(w * 0.86, h * 0.16, 56);
        g.fillStyle(T.sun, 0.95);
        g.fillCircle(w * 0.86, h * 0.16, 28);
        g.fillStyle(T.hill1, 0.9);
        g.fillEllipse(w * 0.22, h * 0.92, w * 0.7, h * 0.42);
        g.fillStyle(T.hill2, 0.88);
        g.fillEllipse(w * 0.82, h * 0.94, w * 0.65, h * 0.4);
        g.fillStyle(T.grass, 0.95);
        g.fillEllipse(w * 0.5, h * 1.08, w * 1.15, h * 0.46);
        (T.deco || ['🌸']).forEach((e, i) => {
            const x = w * (0.08 + (i % 4) * 0.28);
            const y = h * (0.14 + (i % 2) * 0.04);
            const t = this.add.text(x, y, e, { fontSize: '28px' }).setDepth(5).setOrigin(0.5);
            this.tweens.add({
                targets: t, y: y - 8, duration: 1700 + i * 160, yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
            });
        });
        const colors = T.particleColors || [0xffffff];
        for (let i = 0; i < 10; i++) {
            const px = Phaser.Math.Between(30, w - 30);
            const py = Phaser.Math.Between(80, h * 0.45);
            const spark = this.add.graphics().setDepth(4);
            spark.fillStyle(colors[i % colors.length], 0.65);
            spark.fillCircle(0, 0, 3);
            spark.setPosition(px, py);
            this.tweens.add({
                targets: spark, y: py - 22, alpha: 0.15,
                duration: 2200 + i * 80, yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
            });
        }
        this.placeHero(w, h);
    }

    placeHero(w, h) {
        const x = 86;
        const y = h * 0.34;
        const key = this.textures.exists('spr_bunny_idle') ? 'spr_bunny_idle' : null;
        if (key) {
            this.hero = this.add.image(x, y, key).setDepth(40);
            const tex = this.hero.texture.getSourceImage();
            this.hero.setScale(96 / tex.height);
        } else {
            this.hero = this.add.text(x, y, '🐰', { fontSize: '64px' }).setOrigin(0.5).setDepth(40);
        }
        this.heroBaseY = y;
        this.tweens.add({
            targets: this.hero, y: y - 6, duration: 1500, yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
        });
    }

    heroPose(kind) {
        if (!this.hero) return;
        if (kind === 'play' && this.textures.exists('spr_bunny_hop')) this.hero.setTexture('spr_bunny_hop');
        if (kind === 'happy' && this.textures.exists('spr_bunny_happy')) this.hero.setTexture('spr_bunny_happy');
        if (kind === 'idle' && this.textures.exists('spr_bunny_idle')) this.hero.setTexture('spr_bunny_idle');
        this.tweens.killTweensOf(this.hero);
        const y = this.heroBaseY;
        if (kind === 'happy' || kind === 'play') {
            this.tweens.add({
                targets: this.hero, y: y - 18, duration: 180, yoyo: true, ease: 'Power2',
                onComplete: () => {
                    if (this.textures.exists('spr_bunny_idle')) this.hero.setTexture('spr_bunny_idle');
                    this.tweens.add({
                        targets: this.hero, y: y - 6, duration: 1500, yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
                    });
                },
            });
        } else if (kind === 'think') {
            this.tweens.add({
                targets: this.hero, angle: 10, duration: 220, yoyo: true,
                onComplete: () => {
                    this.hero.angle = 0;
                    this.tweens.add({
                        targets: this.hero, y: y - 6, duration: 1500, yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
                    });
                },
            });
        } else {
            this.tweens.add({
                targets: this.hero, y: y - 6, duration: 1500, yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
            });
        }
    }

    onSessionStart() {
        this.sessionSeed = (Date.now() % 100000) + this.level * 41;
        const w = this.cameras.main.width;
        const h = this.cameras.main.height;
        this.buildKeyboard(w, h);
        this.goalChip = UISystem.chip(this, w / 2, DesignTokens.layout.equationY, (this.theme && this.theme.copy.goal) || '🎵 Giai điệu', {
            minWidth: 160, height: 42, fontSize: 22,
        });
        this.goalChip.setDepth(150);
        const copy = this.theme && this.theme.copy;
        const bx = w - 118;
        this.songBtn = UISystem.secondaryButton(this, bx, 178, (copy && copy.songPractice) || 'Học bài hát', () => this.toggleSongMode(), {
            width: 168, height: 40, fontSize: 14,
        });
        this.freeBtn = UISystem.secondaryButton(this, bx, 224, (copy && copy.freePlay) || 'Piano tự do', () => this.toggleFreePlay(), {
            width: 168, height: 40, fontSize: 14,
        });
        this.memoryBtn = UISystem.secondaryButton(this, bx, 270, (copy && copy.memoryOn) || 'Bunny nhớ?', () => this.toggleMemory(), {
            width: 168, height: 40, fontSize: 14,
        });
        this.listenBtn = UISystem.secondaryButton(this, bx, 316, (copy && copy.listenAgain) || 'Nghe lại', () => this.listenAgain(), {
            width: 168, height: 40, fontSize: 14,
        });
        this.speedBtn = UISystem.secondaryButton(this, bx, 362, (copy && copy.speedNormal) || '▶ Vừa', () => this.cycleSpeed(), {
            width: 168, height: 40, fontSize: 14,
        });
        this.showMeBtn = UISystem.secondaryButton(this, bx, 408, (copy && copy.showMe) || 'Chỉ giúp', () => this.showMe(), {
            width: 168, height: 40, fontSize: 14,
        });
        this.partBtn = UISystem.secondaryButton(this, bx, 454, (copy && copy.practicePart) || 'Đoạn này', () => this.practicePart(), {
            width: 168, height: 40, fontSize: 14,
        });
        [this.songBtn, this.freeBtn, this.memoryBtn, this.listenBtn, this.speedBtn, this.showMeBtn, this.partBtn]
            .forEach((b) => b && b.setDepth(160));
        this.syncModeButtons();
    }

    setBtnLabel(btn, text) {
        const label = btn && btn.list && btn.list.find((n) => n.setText && n.text != null);
        if (label) label.setText(text);
    }

    histKey() {
        return this.songMode
            ? `bunnies_bunny_piano_songs_${this.level}`
            : `bunnies_bunny_piano_recent_${this.level}`;
    }

    loadHistory() {
        try {
            const raw = localStorage.getItem(this.histKey());
            const arr = raw ? JSON.parse(raw) : [];
            return Array.isArray(arr) ? arr : [];
        } catch (e) { return []; }
    }

    saveHistory(list) {
        try { localStorage.setItem(this.histKey(), JSON.stringify(list || [])); } catch (e) { /* ignore */ }
    }

    buildKeyboard(w, h) {
        const keys = (this.theme && this.theme.keys) || [];
        const n = keys.length || 8;
        const marginL = 168;
        const marginR = 36;
        const gap = 6;
        const kw = Math.floor((w - marginL - marginR - gap * (n - 1)) / n);
        const kh = Math.max(118, Math.floor(h * 0.22));
        const ox = marginL + kw / 2;
        const ky = h - kh / 2 - 16;
        this.hitY = ky - kh / 2;
        this.keyW = kw;
        this.keyH = kh;
        keys.forEach((def, i) => {
            const x = ox + i * (kw + gap);
            const c = this.add.container(x, ky).setDepth(80);
            const g = this.add.graphics();
            g.fillStyle(0x000000, 0.16);
            g.fillRoundedRect(-kw / 2, -kh / 2 + 5, kw, kh, 16);
            g.fillStyle(def.color, 1);
            g.fillRoundedRect(-kw / 2, -kh / 2, kw, kh, 16);
            g.lineStyle(3, 0xffffff, 0.45);
            g.strokeRoundedRect(-kw / 2, -kh / 2, kw, kh, 16);
            c.add(g);
            const label = this.add.text(0, kh * 0.30, def.label, {
                fontSize: '22px', fontFamily: DesignTokens.typography.fontFamily,
                color: DesignTokens.css.ink,
            }).setOrigin(0.5).setAlpha(0.5);
            c.add(label);
            UISystem.enableHit(c, kw, kh);
            UISystem.bindTap(this, c, () => this.onKeyTap(def.id), { sfx: false });
            this.keys[def.id] = { c, g, def, label, x, y: ky };
        });
    }

    paintKey(id, lit, weak) {
        const k = this.keys[id];
        if (!k) return;
        k.g.clear();
        const kw = this.keyW;
        const kh = this.keyH;
        k.g.fillStyle(0x000000, 0.16);
        k.g.fillRoundedRect(-kw / 2, -kh / 2 + 5, kw, kh, 16);
        k.g.fillStyle(k.def.color, 1);
        k.g.fillRoundedRect(-kw / 2, -kh / 2, kw, kh, 16);
        if (lit) {
            k.g.lineStyle(weak ? 4 : 5, 0xfff59d, weak ? 0.65 : 0.85);
        } else {
            k.g.lineStyle(3, 0xffffff, 0.45);
        }
        k.g.strokeRoundedRect(-kw / 2, -kh / 2, kw, kh, 16);
    }

    glowKey(id, ms, opts) {
        this.clearGlow();
        const weak = !!(opts && opts.weak);
        this.paintKey(id, true, weak);
        const k = this.keys[id];
        if (k) {
            this.tweens.add({ targets: k.c, scaleX: 1.03, scaleY: 0.97, duration: 80, yoyo: true });
        }
        if (ms) this.time.delayedCall(ms, () => this.paintKey(id, false));
    }

    clearGlow() {
        Object.keys(this.keys).forEach((id) => this.paintKey(id, false));
    }

    playTone(note) {
        if (typeof BunnyPianoAudio !== 'undefined') BunnyPianoAudio.play(note);
        AudioEngine.emit('ObjectTapped');
    }

    track(obj) { this.roundObjects.push(obj); return obj; }

    cancelDemo() {
        this.demoEvents.forEach((ev) => { if (ev && ev.remove) ev.remove(false); });
        this.demoEvents = [];
    }

    scheduleDemo(delay, fn) {
        const ev = this.time.delayedCall(delay, fn);
        this.demoEvents.push(ev);
        return ev;
    }

    clearRound() {
        this.cancelDemo();
        this.roundObjects.forEach((o) => { if (o && o.active) o.destroy(true); });
        this.roundObjects = [];
        this.clearGlow();
        this.step = 0;
        this.phase = 'demo';
        this.listenIndex = -1;
        this.hiddenTail = 0;
        this.staffSlots = [];
        if (this.staff && this.staff.active) this.staff.destroy(true);
        this.staff = null;
        if (this.statusChip && this.statusChip.active) this.statusChip.destroy(true);
        this.statusChip = null;
        if (this.progressChip && this.progressChip.active) this.progressChip.destroy(true);
        this.progressChip = null;
    }

    presentRound(index) {
        this.clearRound();
        if (this.freePlay) return;
        const picked = this.pickPiece(index);
        if (!picked || !picked.challenge) return;
        this.saveHistory(picked.history);
        this.challenge = picked.challenge;
        this.step = 0;
        this.refreshGoal();
        this.drawStaff();
        this.setStatus((this.theme && this.theme.copy.listen) || 'Nghe Bunnine chơi nào!');
        this.heroPose('idle');
        this.playListen({ restoreStep: false });
    }

    pickPiece(index) {
        const hist = this.loadHistory();
        const seed = this.sessionSeed + index * 19 + this.level * 5 + (this.songMode ? 700 : 0);
        if (this.songMode) {
            const raw = typeof BunnyPianoSongs !== 'undefined' ? BunnyPianoSongs.all() : [];
            const loaded = BunnyPianoEngine.loadSongs(raw);
            return BunnyPianoEngine.pick(loaded.playable, { difficulty: this.level, history: hist, seed });
        }
        const lib = typeof BunnyPianoLib !== 'undefined' ? BunnyPianoLib.all() : [];
        const loaded = BunnyPianoEngine.loadLibrary(lib);
        return BunnyPianoEngine.pick(loaded.playable, { difficulty: this.level, history: hist, seed });
    }

    refreshGoal() {
        if (!this.goalChip) return;
        const copy = this.theme && this.theme.copy;
        const title = (this.songMode && this.challenge && this.challenge.title)
            || (copy && copy.goal)
            || '🎵 Giai điệu';
        const label = this.goalChip.list && this.goalChip.list.find((n) => n.setText && n.text != null);
        if (label) label.setText(title);
    }

    setStatus(text) {
        const w = this.cameras.main.width;
        if (this.statusChip && this.statusChip.active) this.statusChip.destroy(true);
        this.statusChip = UISystem.chip(this, w / 2, DesignTokens.layout.equationY + 48, text, {
            minWidth: 200, height: 36, fontSize: 16,
        });
        this.statusChip.setDepth(150);
        this.track(this.statusChip);
    }

    staffState() {
        return {
            phase: this.phase,
            step: this.step,
            listenIndex: this.listenIndex,
            memoryOn: this.memoryOn,
            hiddenTail: this.hiddenTail,
        };
    }

    drawStaff() {
        if (!this.challenge || typeof BunnyPianoStaff === 'undefined') return;
        const w = this.cameras.main.width;
        if (!this.staff || !this.staff.active) {
            this.staff = this.add.container(176, this.hitY - 150).setDepth(85);
            this.track(this.staff);
        }
        const total = this.challenge.events.length;
        const cursor = this.phase === 'demo' ? Math.max(0, this.listenIndex) : this.step;
        const page = this.songMode ? BunnyPianoEngine.pageWindow(cursor, total, 10) : { from: 0, limit: total, page: 0, pages: 1 };
        const bars = BunnyPianoEngine.barAfterIndices(this.challenge.events, 4);
        const drawn = BunnyPianoStaff.draw(this, this.staff, this.challenge, this.staffState(), {
            width: w - 360,
            from: page.from,
            limit: page.limit,
            showTime: this.songMode,
            bars,
        });
        this.staffSlots = {};
        (drawn.slots || []).forEach((s) => { this.staffSlots[s.i] = s; });
        this.staffPage = page;
        this.refreshProgress();
    }

    staffSlot(idx) {
        return this.staffSlots && this.staffSlots[idx];
    }

    refreshProgress() {
        if (!this.songMode || !this.challenge) {
            if (this.progressChip && this.progressChip.active) this.progressChip.destroy(true);
            this.progressChip = null;
            return;
        }
        const playable = this.challenge.events.filter((e) => !e.rest).length;
        const done = this.challenge.events.slice(0, this.step).filter((e) => !e.rest).length;
        const page = this.staffPage || { page: 0, pages: 1 };
        const text = `${done}/${playable}  ·  ${page.page + 1}/${page.pages}`;
        const w = this.cameras.main.width;
        if (this.progressChip && this.progressChip.active) this.progressChip.destroy(true);
        this.progressChip = UISystem.chip(this, w / 2, DesignTokens.layout.equationY + 86, text, {
            minWidth: 140, height: 30, fontSize: 14,
        });
        this.progressChip.setDepth(150);
        this.track(this.progressChip);
    }

    updateStaff() {
        this.drawStaff();
        const idx = this.phase === 'demo' ? this.listenIndex : this.step;
        const slot = this.staffSlot(idx);
        if (slot && slot.g) {
            this.tweens.add({
                targets: slot.g, scaleX: 1.08, scaleY: 1.08, duration: 150, yoyo: true, ease: 'Sine.easeOut',
            });
        }
    }

    drawBeam(note) {
        const idx = this.phase === 'demo' ? this.listenIndex : this.step;
        const slot = this.staffSlot(idx);
        const k = this.keys[note];
        if (!slot || !k || !this.staff) return;
        const g = this.add.graphics().setDepth(88);
        g.lineStyle(2.4, k.def.color, 0.55);
        g.lineBetween(this.staff.x + slot.x, this.staff.y + slot.y, k.x, k.y - this.keyH / 2);
        this.tweens.add({
            targets: g, alpha: 0, duration: 380, onComplete: () => { if (g.active) g.destroy(); },
        });
        this.track(g);
    }

    applyMemoryHides() {
        if (!this.challenge) {
            this.hiddenTail = 0;
            return;
        }
        this.hiddenTail = this.memoryOn
            ? BunnyPianoEngine.memoryHideCount(this.level, this.challenge.events.length)
            : 0;
    }

    playListen(opts) {
        if (!this.challenge || this.freePlay || this.sessionOver) return;
        const restoreStep = !!(opts && opts.restoreStep);
        const saved = restoreStep ? this.step : 0;
        this.cancelDemo();
        this.phase = 'demo';
        this.waiting = false;
        this.listenIndex = -1;
        if (!restoreStep) this.step = 0;
        this.updateStaff();
        this.setStatus((this.theme && this.theme.copy.listen) || 'Nghe Bunnine chơi nào!');
        const events = this.challenge.events;
        const factor = BunnyPianoEngine.speedFactor(this.songSpeed);
        let t = 360;
        events.forEach((ev, i) => {
            const hold = Math.round(BunnyPianoEngine.eventMs(this.challenge.tempo, ev.dur) * factor);
            this.scheduleDemo(t, () => {
                if (this.sessionOver || this.freePlay) return;
                this.listenIndex = i;
                this.updateStaff();
                if (!ev.rest && ev.pitch) {
                    this.glowKey(ev.pitch, Math.min(hold * 0.75, 700), { weak: true });
                    this.playTone(ev.pitch);
                    this.drawBeam(ev.pitch);
                    this.heroPose('play');
                }
            });
            t += hold;
        });
        this.scheduleDemo(t + 220, () => {
            if (this.sessionOver || this.freePlay) return;
            this.step = BunnyPianoEngine.nextPlayable(this.challenge, saved);
            this.listenIndex = -1;
            this.beginFollow();
        });
    }

    beginFollow() {
        this.phase = 'play';
        this.step = BunnyPianoEngine.nextPlayable(this.challenge, this.step);
        if (this.step >= this.challenge.events.length) {
            this.finishMelody();
            return;
        }
        this.waiting = true;
        this.applyMemoryHides();
        this.clearGlow();
        this.updateStaff();
        this.setStatus((this.theme && this.theme.copy.yourTurn) || 'Đến lượt bạn! Nhìn nốt trên khuông nhạc.');
        this.applyPlayGlow({ first: true });
    }

    applyPlayGlow(opts) {
        const note = this.challenge && BunnyPianoEngine.expectedNote(this.challenge, this.step);
        if (!note || this.phase !== 'play') return;
        const first = !!(opts && opts.first);
        const hint = !!(opts && opts.hint);
        if (hint) {
            this.glowKey(note, 1400, { weak: true });
            return;
        }
        if (this.level === 1) this.glowKey(note, 320, { weak: true });
        else if (this.level === 2 && first) this.glowKey(note, 260, { weak: true });
    }

    listenAgain() {
        if (this.freePlay || !this.challenge || this.sessionOver) return;
        if (this.phase === 'demo') return;
        this.playListen({ restoreStep: this.songMode ? false : true });
    }

    showMe() {
        if (this.freePlay || !this.challenge || this.phase !== 'play') return;
        const note = BunnyPianoEngine.expectedNote(this.challenge, this.step);
        if (!note) return;
        this.applyPlayGlow({ hint: true });
        this.playTone(note);
        this.heroPose('play');
    }

    practicePart() {
        if (this.freePlay || !this.challenge || this.sessionOver) return;
        const back = Math.max(0, this.step - 4);
        this.step = BunnyPianoEngine.nextPlayable(this.challenge, back);
        this.updateStaff();
        this.applyPlayGlow({ first: true });
    }

    cycleSpeed() {
        const order = ['slow', 'normal', 'fast'];
        const i = order.indexOf(this.songSpeed);
        this.songSpeed = order[(i + 1) % order.length];
        this.syncModeButtons();
        if (this.phase === 'demo') this.playListen({ restoreStep: false });
    }

    syncModeButtons() {
        const copy = this.theme && this.theme.copy;
        this.setBtnLabel(this.songBtn, this.songMode ? (copy && copy.backMelody) : (copy && copy.songPractice));
        this.setBtnLabel(this.freeBtn, this.freePlay ? (copy && copy.backMelody) : (copy && copy.freePlay));
        const speedLabel = this.songSpeed === 'slow'
            ? (copy && copy.speedSlow)
            : this.songSpeed === 'fast'
                ? (copy && copy.speedFast)
                : (copy && copy.speedNormal);
        this.setBtnLabel(this.speedBtn, speedLabel || '▶ Vừa');
        const songExtras = this.songMode && !this.freePlay;
        if (this.speedBtn) this.speedBtn.setVisible(songExtras);
        if (this.showMeBtn) this.showMeBtn.setVisible(songExtras);
        if (this.partBtn) this.partBtn.setVisible(songExtras);
        if (this.memoryBtn) this.memoryBtn.setVisible(!this.songMode && !this.freePlay);
    }

    toggleSongMode() {
        if (this.freePlay) this.toggleFreePlay();
        this.songMode = !this.songMode;
        this.syncModeButtons();
        this.presentRound(this.roundIndex);
    }

    onKeyTap(id) {
        if (this.isPaused || this.sessionOver) return;
        this.pressKey(id);
        this.playTone(id);
        this.heroPose('play');
        if (this.freePlay) {
            this.companionReact('happy');
            return;
        }
        if (!this.acceptingInput || !this.waiting || this.phase !== 'play' || !this.challenge) return;
        const expect = BunnyPianoEngine.expectedNote(this.challenge, this.step);
        if (id === expect) this.onCorrectNote();
        else this.onWrongNote();
    }

    pressKey(id) {
        const k = this.keys[id];
        if (!k) return;
        this.tweens.add({ targets: k.c, scaleY: 0.92, scaleX: 1.02, duration: 70, yoyo: true });
    }

    onCorrectNote() {
        this.step += 1;
        this.step = BunnyPianoEngine.nextPlayable(this.challenge, this.step);
        this.updateStaff();
        this.heroPose('happy');
        this.companionReact('happy');
        AudioEngine.emit('Discovery');
        if (this.step >= this.challenge.events.length) {
            this.finishMelody();
            return;
        }
        this.applyPlayGlow({});
    }

    finishMelody() {
        this.waiting = false;
        const p = this.hero || this.cameras.main;
        this.answerCorrect((this.hero && this.hero.x) || p.x, (this.hero && this.hero.y) || 240);
    }

    onWrongNote() {
        this.recordFumble();
        this.heroPose('think');
        this.companionReact('think');
        this.companionSay((this.theme && this.theme.copy.wrong) || 'Gần đúng rồi! Thử lại nốt này nhé.', 1800);
        this.updateStaff();
        if (this.level === 1) this.applyPlayGlow({});
    }

    toggleFreePlay() {
        this.freePlay = !this.freePlay;
        if (this.freePlay) this.songMode = false;
        const copy = this.theme && this.theme.copy;
        this.syncModeButtons();
        this.cancelDemo();
        this.clearGlow();
        if (this.freePlay) {
            this.waiting = false;
            this.phase = 'free';
            this.setStatus((copy && copy.freePlay) || 'Piano tự do');
            this.heroPose('idle');
            if (this.staff) this.staff.setVisible(false);
            if (this.progressChip) this.progressChip.setVisible(false);
        } else {
            if (this.staff) this.staff.setVisible(true);
            this.presentRound(this.roundIndex);
        }
    }

    toggleMemory() {
        if (this.freePlay) return;
        this.memoryOn = !this.memoryOn;
        const copy = this.theme && this.theme.copy;
        this.setBtnLabel(this.memoryBtn, this.memoryOn ? (copy && copy.memoryOff) : (copy && copy.memoryOn));
        if (this.phase === 'play') this.applyMemoryHides();
        else this.hiddenTail = 0;
        this.updateStaff();
    }

    showHintVisual() {
        this.applyPlayGlow({ hint: true });
    }

    autoPlayMelody() {
        if (!this.challenge) return;
        this.cancelDemo();
        this.waiting = false;
        const p = this.hero || { x: 640, y: 300 };
        this.answerCorrect(p.x, p.y);
    }
}

if (typeof module !== 'undefined') module.exports = { BunnyPianoScreen };
