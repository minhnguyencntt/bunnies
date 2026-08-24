/**
 * screen.js — Phép Màu Sắc (Color Magic). Educational goal: color matching /
 * visual memory. Child observes a colored reference, then fills line-art
 * regions from a palette until the picture matches.
 *
 * Runs on GameShell: HUD, timer, hints, scoring, CompletionEngine → awards.
 */
class ColorMagicScreen extends GameShell {
    constructor() {
        super('ColorMagicScreen');
        this.gameId = 'color_magic';
        this.theme = typeof ColorMagicPuzzle !== 'undefined' ? ColorMagicPuzzle : null;
        this.roundObjects = [];
        this.recentArtIds = [];
        this.session = null;
        this.swatches = [];
        this.painting = false;
    }

    onPreload() {
        this.load.image('color_magic_bg', 'screens/color_magic/assets/backgrounds/bg.png');
    }

    buildWorld(w, h) {
        if (this.textures.exists('color_magic_bg')) {
            this.add.image(w / 2, h / 2, 'color_magic_bg').setDisplaySize(w, h).setDepth(0);
        } else {
            const p = this.theme.palette;
            const g = this.add.graphics().setDepth(0);
            g.fillGradientStyle(p.skyTop, p.skyTop, p.skyBottom, p.skyBottom, 1);
            g.fillRect(0, 0, w, h);
            g.fillStyle(p.hill1, 0.92);
            g.fillEllipse(w * 0.25, h * 1.05, w * 0.7, h * 0.5);
            g.fillStyle(p.hill2, 0.9);
            g.fillEllipse(w * 0.8, h * 1.1, w * 0.75, h * 0.55);
        }
        this.addWorldLife(w, h);
    }

    addWorldLife(w, h) {
        const spots = [
            { e: '🌸', x: 0.07, y: 0.20 },
            { e: '⭐', x: 0.93, y: 0.16 },
            { e: '🌈', x: 0.50, y: 0.13 },
            { e: '✨', x: 0.90, y: 0.58 },
            { e: '🦋', x: 0.08, y: 0.56 },
        ];
        spots.forEach((s, i) => {
            const x = w * s.x;
            const y = h * s.y;
            const d = this.add.text(x, y, s.e, { fontSize: '40px' }).setDepth(5).setAlpha(0.88).setOrigin(0.5);
            this.tweens.add({
                targets: d, y: y - 7, duration: 1800 + i * 160,
                yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
            });
        });
        const colors = this.theme.particleColors;
        for (let i = 0; i < 16; i++) {
            const px = Phaser.Math.Between(24, w - 24);
            const py = Phaser.Math.Between(70, h - 90);
            const spark = this.add.graphics().setDepth(6);
            spark.fillStyle(colors[i % colors.length], 0.75);
            spark.fillCircle(0, 0, Phaser.Math.Between(2, 4));
            spark.setPosition(px, py);
            this.tweens.add({
                targets: spark, y: py - Phaser.Math.Between(18, 44), alpha: 0.2,
                duration: Phaser.Math.Between(1800, 3600), yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
            });
        }
    }

    introText() {
        return this.theme.copy.intro[this.level] || this.theme.copy.intro[1];
    }

    onSessionStart() {
        if (this.input.keyboard) {
            this.input.keyboard.on('keydown', (ev) => this.onKey(ev));
        }
    }

    onKey(ev) {
        if (!this.acceptingInput || this.sessionOver || !this.session) return;
        const n = parseInt(ev.key, 10);
        if (n >= 1 && n <= (this.session.challenge.palette || []).length) {
            this.selectColor(this.session.challenge.palette[n - 1]);
        }
    }

    track(obj) { this.roundObjects.push(obj); return obj; }

    clearRound() {
        if (this.peekTween) { this.peekTween.remove(false); this.peekTween = null; }
        this.roundObjects.forEach((o) => { if (o && o.active) o.destroy(true); });
        this.roundObjects = [];
        this.swatches = [];
        this.targetGfx = null;
        this.refGfx = null;
        this.progressLabel = null;
        this.pips = [];
        this.painting = false;
    }

    presentRound(index, diff) {
        this.clearRound();
        const P = this.theme;
        const challenge = P.generateChallenge(diff, { excludeIds: this.recentArtIds });
        this.recentArtIds.push(challenge.artworkId);
        if (this.recentArtIds.length > 6) this.recentArtIds.shift();
        this.session = P.createSession(challenge);
        this.analytics.recordExploration(0, challenge.regionCount);

        const w = this.cameras.main.width;
        const h = this.cameras.main.height;
        const L = DesignTokens.layout;
        const playTop = L.contentTop + 28;
        const playBottom = h * L.answerY - 58;
        const playH = playBottom - playTop;
        const copy = P.copy;

        const targetW = Math.min(460, w * 0.42);
        const targetH = Math.min(playH, h * 0.52);
        const refW = challenge.referenceMode === 'full' ? Math.min(320, w * 0.28) : Math.min(220, w * 0.2);
        const refH = challenge.referenceMode === 'full' ? targetH : Math.min(200, playH * 0.55);
        const gap = 28;
        const pairW = refW + gap + targetW;
        const pairLeft = Math.max(90, (w - pairW) / 2 + 20);
        this.refCX = pairLeft + refW / 2;
        this.refCY = playTop + playH * 0.48;
        this.targetCX = pairLeft + refW + gap + targetW / 2;
        this.targetCY = this.refCY;
        this.targetW = targetW;
        this.targetH = targetH;
        this.refW = refW;
        this.refH = refH;

        this.track(this.add.text(this.refCX, this.refCY - refH / 2 - 18, copy.matchThis, {
            fontSize: DesignTokens.typography.caption + 'px',
            fontFamily: DesignTokens.typography.fontFamily, fontStyle: 'bold',
            color: DesignTokens.css.ink,
        }).setOrigin(0.5).setDepth(40));
        this.track(this.add.text(this.targetCX, this.targetCY - targetH / 2 - 18, copy.colorHere, {
            fontSize: DesignTokens.typography.caption + 'px',
            fontFamily: DesignTokens.typography.fontFamily, fontStyle: 'bold',
            color: DesignTokens.css.ink,
        }).setOrigin(0.5).setDepth(40));

        const refPanel = this.track(UISystem.panel(this, this.refCX, this.refCY, refW, refH, {
            fill: DesignTokens.colors.surface, border: DesignTokens.colors.accent,
        }));
        refPanel.setDepth(30);
        const tgtPanel = this.track(UISystem.panel(this, this.targetCX, this.targetCY, targetW, targetH, {
            fill: 0xffffff, border: DesignTokens.colors.primary,
        }));
        tgtPanel.setDepth(30);

        this.refScale = this.fitScale(challenge, refW - 36, refH - 36);
        this.targetScale = this.fitScale(challenge, targetW - 40, targetH - 40);
        const bounds = this.theme.artworkBounds(challenge.regions);
        this.refDrawX = this.refCX - bounds.cx * this.refScale;
        this.refDrawY = this.refCY - bounds.cy * this.refScale;
        this.targetDrawX = this.targetCX - bounds.cx * this.targetScale;
        this.targetDrawY = this.targetCY - bounds.cy * this.targetScale;

        this.refGfx = this.track(this.add.graphics().setDepth(45));
        this.targetGfx = this.track(this.add.graphics().setDepth(46));
        this.paintReference();
        this.paintTarget();

        const zone = this.track(this.add.zone(this.targetCX, this.targetCY, targetW, targetH).setOrigin(0.5).setDepth(79));
        UISystem.enableHit(zone, targetW, targetH);
        zone.on('pointerdown', (pointer) => this.onTargetTap(pointer));
        this.buildRegionHits();

        this.buildPalette(w, h, diff);
        this.buildProgress(w, h);

        this.companionSay(`${challenge.glyph} ${challenge.title}`, 2200);
        AudioEngine.emit('Discovery');

        if (challenge.referenceMode === 'peek') {
            this.startPeek(refW, refH, targetW, targetH, playTop, playH);
        }

        if (!this.session.selectedColorId && challenge.palette[0]) {
            this.selectColor(challenge.palette[0], { silent: true });
        }
    }

    fitScale(challenge, boxW, boxH) {
        const b = this.theme.artworkBounds(challenge.regions);
        return Math.min(boxW / b.w, boxH / b.h, 2.2);
    }

    startPeek(refW, refH, targetW, targetH, playTop, playH) {
        const w = this.cameras.main.width;
        const bigW = Math.min(380, w * 0.36);
        const bigH = Math.min(playH * 0.72, targetH + 20);
        const bigX = w / 2;
        const bigY = playTop + playH * 0.42;
        const overlay = this.track(this.add.graphics().setDepth(120));
        overlay.fillStyle(DesignTokens.colors.overlay, 0.28);
        overlay.fillRect(0, 0, w, this.cameras.main.height);
        const peekPanel = this.track(UISystem.panel(this, bigX, bigY, bigW, bigH, {
            fill: DesignTokens.colors.surface, border: DesignTokens.colors.accent,
        }));
        peekPanel.setDepth(121);
        const peekGfx = this.track(this.add.graphics().setDepth(122));
        const peekScale = this.fitScale(this.session.challenge, bigW - 40, bigH - 40);
        const bounds = this.theme.artworkBounds(this.session.challenge.regions);
        this.drawArtwork(
            peekGfx, this.session.challenge, null,
            bigX - bounds.cx * peekScale, bigY - bounds.cy * peekScale, peekScale, false,
        );
        this.peekTween = this.time.delayedCall(this.session.challenge.peekMs || 2200, () => {
            [overlay, peekPanel, peekGfx].forEach((o) => { if (o && o.active) o.destroy(true); });
            this.paintReference();
        });
    }

    drawArtwork(g, challenge, fills, cx, cy, scale, lineArt) {
        g.clear();
        const stroke = {
            width: Math.max(2.5, 3.2 * Math.min(scale, 1.6)),
            color: DesignTokens.colors.ink,
            alpha: 0.92,
        };
        const regs = challenge.regions.slice().sort((a, b) => (b.weight || 1) - (a.weight || 1));
        regs.forEach((r) => {
            const sh = this.theme.transformShape(r.shape, cx, cy, scale);
            const chosen = fills && fills[r.id];
            const colorId = lineArt ? chosen : r.colorId;
            const fill = colorId
                ? this.theme.color(colorId).fill
                : DesignTokens.colors.surface;
            this.theme.drawShape(g, sh, fill, 1, stroke);
        });
    }

    paintReference() {
        if (!this.refGfx || !this.session) return;
        this.drawArtwork(
            this.refGfx, this.session.challenge, null,
            this.refDrawX, this.refDrawY, this.refScale, false,
        );
    }

    paintTarget() {
        if (!this.targetGfx || !this.session) return;
        this.drawArtwork(
            this.targetGfx, this.session.challenge, this.session.fills,
            this.targetDrawX, this.targetDrawY, this.targetScale, true,
        );
    }

    buildRegionHits() {
        const ch = this.session.challenge;
        // Largest first (low depth), smallest last (high depth) so nested parts
        // like a lollipop swirl sit above the candy circle and receive taps.
        const ranked = this.theme.regionsFrontFirst(ch.regions).reverse();
        ranked.forEach((r, i) => {
            const sh = this.theme.transformShape(r.shape, this.targetDrawX, this.targetDrawY, this.targetScale);
            // Hit must match the visible shape exactly — no minTarget / +pad
            // inflation (that steals taps from nested regions).
            let hitW;
            let hitH;
            let hitOpts = {};
            if (sh.type === 'circle') {
                hitW = sh.r * 2;
                hitH = sh.r * 2;
                hitOpts = { circle: true };
            } else if (sh.type === 'ellipse') {
                hitW = sh.w;
                hitH = sh.h;
                hitOpts = { ellipse: true };
            } else {
                hitW = sh.w;
                hitH = sh.h;
            }
            const z = this.track(this.add.zone(sh.x, sh.y, hitW, hitH).setOrigin(0.5).setDepth(80 + i));
            UISystem.enableHit(z, hitW, hitH, hitOpts);
            z.on('pointerdown', (pointer) => this.onTargetTap(pointer));
        });
    }

    pointerWorld(pointer) {
        const cam = this.cameras && this.cameras.main;
        if (cam && cam.getWorldPoint) {
            return cam.getWorldPoint(pointer.x, pointer.y);
        }
        return { x: pointer.worldX, y: pointer.worldY };
    }

    buildPalette(w, h, diff) {
        const ids = this.session.challenge.palette;
        const y = h * DesignTokens.layout.answerY + 8;
        const size = Math.max(DesignTokens.touch.minTarget, ids.length > 5 ? 54 : 62);
        const gap = size + 18;
        const total = gap * (ids.length - 1);
        const x0 = w / 2 - total / 2;
        const showName = (diff.hintLevel || 1) >= 3;
        ids.forEach((id, i) => {
            const def = this.theme.color(id);
            const sw = this.track(UISystem.colorSwatch(this, x0 + i * gap, y, def, () => {
                this.selectColor(id);
            }, { size, showName }));
            sw.setDepth(90);
            sw.setData('colorId', id);
            this.swatches.push(sw);
        });
    }

    buildProgress(w, h) {
        const copy = this.theme.copy;
        const y = h * DesignTokens.layout.answerY - 42;
        this.progressLabel = this.track(this.add.text(w / 2, y, '', {
            fontSize: '16px', fontFamily: DesignTokens.typography.fontFamily, fontStyle: 'bold',
            color: DesignTokens.css.ink,
        }).setOrigin(0.5).setDepth(50));
        this.pips = [];
        const n = this.session.challenge.regions.length;
        const pipY = y - 18;
        const gap = 16;
        const x0 = w / 2 - ((n - 1) * gap) / 2;
        for (let i = 0; i < n; i++) {
            const pip = this.track(this.add.graphics().setDepth(50));
            pip.setPosition(x0 + i * gap, pipY);
            this.pips.push(pip);
        }
        this.refreshProgress();
    }

    refreshProgress() {
        const ch = this.session && this.session.challenge;
        if (!ch || !this.progressLabel) return;
        const done = ch.regions.filter((r) => this.session.fills[r.id] === r.colorId).length;
        this.progressLabel.setText(this.theme.copy.progress(done, ch.regions.length));
        this.pips.forEach((pip, i) => {
            pip.clear();
            const filled = i < done;
            pip.fillStyle(filled ? DesignTokens.colors.success : DesignTokens.colors.surfaceSoft, 1);
            pip.fillCircle(0, 0, 6);
            pip.lineStyle(2, DesignTokens.colors.ink, 0.35);
            pip.strokeCircle(0, 0, 6);
        });
    }

    selectColor(colorId, opts = {}) {
        if (!this.session || this.sessionOver) return;
        this.session.selectedColorId = colorId;
        this.swatches.forEach((sw) => {
            this.tweens.killTweensOf(sw);
            UISystem.setSwatchSelected(sw, sw.getData('colorId') === colorId);
        });
        if (!opts.silent) AudioEngine.emit('ObjectTapped');
        const def = this.theme.color(colorId);
        if (!opts.silent && typeof VoiceEngine !== 'undefined') {
            VoiceEngine.play('color_' + colorId) || VoiceEngine.speakRaw(def.name);
        }
    }

    onTargetTap(pointer) {
        if (!this.acceptingInput || this.sessionOver || this.painting || !this.session) return;
        if (!this.session.selectedColorId) {
            this.companionSay(this.theme.copy.lookAgain, 1800);
            return;
        }
        const world = this.pointerWorld(pointer);
        const lx = world.x - this.targetDrawX;
        const ly = world.y - this.targetDrawY;
        const region = this.theme.hitRegion(this.session.challenge, lx, ly, this.targetScale, {
            pad: 0, maxDist: 0,
        });
        if (!region) {
            this.recordFumble();
            return;
        }
        this.tryPaintRegion(region.id, world.x, world.y);
    }

    tryPaintRegion(regionId, fx, fy) {
        if (!this.session || this.sessionOver || this.painting) return null;
        const colorId = this.session.selectedColorId;
        if (!colorId) return null;
        const result = this.theme.applyColor(this.session, regionId, colorId);
        const x = fx != null ? fx : this.targetCX;
        const y = fy != null ? fy : this.targetCY;
        if (result.kind === 'already' || result.kind === 'locked' || result.kind === 'miss') return result;
        if (result.kind === 'wrong') {
            this.flashWrong(result.region, colorId);
            this.answerWrong(x, y, { message: this.theme.hintFor(result.region) });
            this.analytics.recordRetry();
            return result;
        }
        this.paintTarget();
        this.refreshProgress();
        this.analytics.recordExploration(1, 0);
        this.popRegion(result.region);
        if (result.complete) {
            this.answerCorrect(x, y);
        } else {
            this.companionReact('happy');
            AudioEngine.emit('ObjectCollected');
            this.refreshLiveScore();
        }
        return result;
    }

    flashWrong(region, colorId) {
        if (!region || !this.targetGfx) return;
        const sh = this.theme.transformShape(region.shape, this.targetDrawX, this.targetDrawY, this.targetScale);
        const g = this.add.graphics().setDepth(70);
        this.theme.drawShape(g, sh, this.theme.color(colorId).fill, 0.55, {
            width: 4, color: DesignTokens.colors.warning, alpha: 1,
        });
        this.tweens.add({
            targets: g, alpha: 0, duration: DesignTokens.motion.micro + 80,
            onComplete: () => g.destroy(),
        });
    }

    popRegion(region) {
        if (!region) return;
        const sh = this.theme.transformShape(region.shape, this.targetDrawX, this.targetDrawY, this.targetScale);
        const spark = this.add.graphics().setDepth(75);
        spark.fillStyle(DesignTokens.colors.accent, 0.9);
        spark.fillCircle(sh.x, sh.y, 6);
        this.tweens.add({
            targets: spark, scaleX: 2.4, scaleY: 2.4, alpha: 0,
            duration: DesignTokens.motion.micro + 40, ease: 'Cubic.easeOut',
            onComplete: () => spark.destroy(),
        });
    }

    showHintVisual(hint) {
        if (!this.session) return;
        const left = this.theme.remaining(this.session.fills, this.session.challenge);
        const region = left[0];
        const style = hint && hint.style;
        if (region && this.refGfx && style !== 'conceptual') {
            const sh = this.theme.transformShape(region.shape, this.refDrawX, this.refDrawY, this.refScale);
            const ring = this.add.graphics().setDepth(200);
            ring.lineStyle(5, DesignTokens.colors.accent, 0.95);
            ring.strokeCircle(sh.x, sh.y, Math.max(18, (sh.r || sh.w / 2 || 20) + 8));
            this.tweens.add({ targets: ring, alpha: 0, duration: 1600, onComplete: () => ring.destroy() });
            if (style === 'direct') {
                const col = this.theme.color(region.colorId);
                this.selectColor(region.colorId);
                this.companionSay(this.theme.copy.tryColor(col.name), 2800);
            }
        }
        if (this.targetGfx) {
            const w = this.targetW, h = this.targetH;
            const box = this.add.graphics().setDepth(199);
            box.lineStyle(4, DesignTokens.colors.accent, 0.85);
            box.strokeRoundedRect(this.targetCX - w / 2, this.targetCY - h / 2, w, h, 18);
            this.tweens.add({ targets: box, alpha: 0, duration: 1400, onComplete: () => box.destroy() });
        }
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ColorMagicScreen };
}
