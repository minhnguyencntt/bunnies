/**
 * UISystem.js — the Bunnies component library.
 * One visual language for every screen: buttons, cards, panels, bars, bubbles.
 * All components use DesignTokens and the global press physics.
 *
 * Never hand-style a one-off button/card — extend these factories instead.
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

const UISystem = {
    T: () => DesignTokens,

    /**
     * Button interaction: IDLE → PRESSED → TRIGGERED → ACTION.
     * Pressed scale is applied immediately (no tween). Action fires on
     * pointerdown. Bounce is async and never gates the callback.
     */
    bindTap(scene, obj, onTap, opts = {}) {
        obj._btnState = 'IDLE';
        const down = DesignTokens.press.down;
        const over = DesignTokens.press.overshoot;
        const ms = DesignTokens.press.ms;

        obj.on('pointerdown', () => {
            if (obj._btnState === 'TRIGGERED' || obj._btnState === 'ACTION') return;
            obj._btnState = 'PRESSED';
            scene.tweens.killTweensOf(obj);
            obj.setScale(down);
            if (opts.sfx !== false) {
                try { if (typeof AudioEngine !== 'undefined') AudioEngine.emit('UITap'); } catch (e) { /* ignore */ }
            }
            obj._btnState = 'TRIGGERED';
            obj._btnState = 'ACTION';
            try { onTap(obj); } catch (e) { console.error('UISystem tap', e); }
            if (obj.active) {
                scene.tweens.killTweensOf(obj);
                scene.tweens.chain({
                    targets: obj,
                    tweens: [
                        { scale: over, duration: ms },
                        { scale: 1, duration: ms },
                    ],
                });
            }
        });
        obj.on('pointerup', () => {
            if (obj._btnState === 'ACTION' || obj._btnState === 'TRIGGERED') obj._btnState = 'IDLE';
        });
        obj.on('pointerout', () => {
            if (obj._btnState === 'PRESSED' || obj._btnState === 'HOVER') {
                obj._btnState = 'IDLE';
                scene.tweens.killTweensOf(obj);
                obj.setScale(1);
            }
        });
        obj.on('pointerover', () => {
            if (obj._btnState === 'IDLE') {
                obj._btnState = 'HOVER';
                obj.setScale(1.04);
            }
        });
        return obj;
    },

    /** Decorative bounce only — never call this before dispatching an action. */
    press(scene, obj) {
        const p = DesignTokens.press;
        scene.tweens.killTweensOf(obj);
        scene.tweens.chain({
            targets: obj,
            tweens: [
                { scale: p.down, duration: p.ms },
                { scale: p.overshoot, duration: p.ms },
                { scale: 1, duration: p.ms },
            ],
        });
    },

    _btnBase(scene, x, y, w, h, fill, border) {
        const c = scene.add.container(x, y);
        const g = scene.add.graphics();
        // soft drop shadow
        g.fillStyle(DesignTokens.shadow.color, DesignTokens.shadow.alpha);
        g.fillRoundedRect(-w / 2, -h / 2 + DesignTokens.shadow.offsetY, w, h, h / 2);
        // body with subtle vertical gradient (soft-toy depth)
        g.fillGradientStyle(fill, fill, Phaser.Display.Color.IntegerToColor(fill).darken(12).color, Phaser.Display.Color.IntegerToColor(fill).darken(12).color, 1);
        g.fillRoundedRect(-w / 2, -h / 2, w, h, h / 2);
        g.lineStyle(3, border ?? 0xffffff, 0.9);
        g.strokeRoundedRect(-w / 2, -h / 2, w, h, h / 2);
        // top gloss highlight
        g.fillStyle(0xffffff, 0.22);
        g.fillRoundedRect(-w / 2 + 6, -h / 2 + 4, w - 12, h * 0.38, h / 4);
        c.add(g);
        return c;
    },

    /** Primary action: Start / Continue / Play / Confirm / Next. */
    primaryButton(scene, x, y, label, onTap, opts = {}) {
        const w = opts.width || 220;
        const h = opts.height || 56;
        const c = this._btnBase(scene, x, y, w, h, opts.color ?? DesignTokens.colors.success);
        c.add(scene.add.text(0, 0, label, {
            fontSize: (opts.fontSize || DesignTokens.typography.button) + 'px',
            fontFamily: DesignTokens.typography.fontFamily, fontStyle: 'bold',
            color: DesignTokens.css.white, stroke: '#00000044', strokeThickness: 2,
        }).setOrigin(0.5));
        setCenteredInput(c, w, h);
        this.bindTap(scene, c, () => onTap(c));
        return c;
    },

    /** The one Play / Chơi control — vivid green, never look disabled. */
    playButton(scene, x, y, label, onTap, opts = {}) {
        return this.primaryButton(scene, x, y, label || 'Chơi', onTap, {
            width: opts.width || 168,
            height: opts.height || 54,
            fontSize: opts.fontSize || 22,
            color: 0x2bb673,
            ...opts,
        });
    },

    /** Secondary action: Back / Settings / optional. */
    secondaryButton(scene, x, y, label, onTap, opts = {}) {
        const w = opts.width || 180;
        const h = opts.height || 52;
        const c = this._btnBase(scene, x, y, w, h, DesignTokens.colors.secondary);
        c.add(scene.add.text(0, 0, label, {
            fontSize: (opts.fontSize || DesignTokens.typography.button) + 'px',
            fontFamily: DesignTokens.typography.fontFamily, fontStyle: 'bold',
            color: DesignTokens.css.white, stroke: '#00000044', strokeThickness: 2,
        }).setOrigin(0.5));
        setCenteredInput(c, w, h);
        this.bindTap(scene, c, () => onTap(c));
        return c;
    },

    /** Soft storybook info chip (score, stars, level). */
    chip(scene, x, y, label, opts = {}) {
        const h = opts.height || 40;
        const pad = opts.pad ?? 18;
        const t = scene.add.text(0, 0, label, {
            fontSize: (opts.fontSize || 16) + 'px',
            fontFamily: DesignTokens.typography.fontFamily, fontStyle: 'bold',
            color: opts.textColor || DesignTokens.css.ink,
        }).setOrigin(0.5);
        const w = Math.max(opts.minWidth || 72, t.width + pad * 2);
        const c = scene.add.container(x, y);
        const g = scene.add.graphics();
        g.fillStyle(DesignTokens.shadow.color, 0.18);
        g.fillRoundedRect(-w / 2, -h / 2 + 3, w, h, h / 2);
        g.fillStyle(opts.fill ?? DesignTokens.colors.surface, opts.alpha ?? 0.96);
        g.fillRoundedRect(-w / 2, -h / 2, w, h, h / 2);
        g.lineStyle(2, opts.border ?? DesignTokens.colors.accent, 0.85);
        g.strokeRoundedRect(-w / 2, -h / 2, w, h, h / 2);
        c.add(g);
        c.add(t);
        c.listText = t;
        c.setLabel = (s) => {
            t.setText(s);
            const nw = Math.max(opts.minWidth || 72, t.width + pad * 2);
            g.clear();
            g.fillStyle(DesignTokens.shadow.color, 0.18);
            g.fillRoundedRect(-nw / 2, -h / 2 + 3, nw, h, h / 2);
            g.fillStyle(opts.fill ?? DesignTokens.colors.surface, opts.alpha ?? 0.96);
            g.fillRoundedRect(-nw / 2, -h / 2, nw, h, h / 2);
            g.lineStyle(2, opts.border ?? DesignTokens.colors.accent, 0.85);
            g.strokeRoundedRect(-nw / 2, -h / 2, nw, h, h / 2);
        };
        return c;
    },

    /** Icon button: sound / settings / close / home / pause / hint. */
    iconButton(scene, x, y, icon, onTap, opts = {}) {
        const r = opts.radius || 24;
        const c = scene.add.container(x, y);
        const g = scene.add.graphics();
        g.fillStyle(DesignTokens.shadow.color, DesignTokens.shadow.alpha);
        g.fillCircle(0, 4, r);
        g.fillStyle(opts.color ?? DesignTokens.colors.secondary, 1);
        g.fillCircle(0, 0, r);
        g.fillStyle(0xffffff, 0.28);
        g.fillEllipse(-r * 0.22, -r * 0.38, r * 1.05, r * 0.5);
        g.lineStyle(3, 0xffffff, 0.95);
        g.strokeCircle(0, 0, r);
        c.add(g);
        const glyphSize = opts.iconSize || Math.round(r * 0.85);
        if (typeof IconSystem !== 'undefined' && typeof icon === 'string' && !/[\u0080-\uFFFF]/.test(icon) && icon.length < 16) {
            c.add(IconSystem.make(scene, icon, glyphSize, 0xffffff));
        } else {
            c.add(scene.add.text(0, 0, icon, { fontSize: (opts.fontSize || 20) + 'px' }).setOrigin(0.5));
        }
        setCenteredInput(c, Math.max(r * 2, DesignTokens.touch.minTarget), Math.max(r * 2, DesignTokens.touch.minTarget));
        this.bindTap(scene, c, () => onTap(c));
        return c;
    },

    /**
     * Navigation button (Back/Home) — top-left standard. Bigger, elevated,
     * high-contrast cream disc so it stays visible over every world.
     */
    navButton(scene, x, y, icon, onTap, opts = {}) {
        return this.iconButton(scene, x, y, icon, onTap, {
            radius: 28,
            iconSize: 22,
            color: opts.color ?? DesignTokens.colors.primary,
            ...opts,
        });
    },

    /** Big gameplay answer button (numbers must be extra readable). */
    answerButton(scene, x, y, label, onTap, opts = {}) {
        const size = opts.size || DesignTokens.touch.answerTarget;
        const palette = opts.palette || [
            { fill: 0xf8bbd0, border: 0xf48fb1 },
            { fill: 0xb9f6ca, border: 0x69d99a },
            { fill: 0xb3e5fc, border: 0x64b5f6 },
            { fill: 0xfff9c4, border: 0xffd54f },
        ];
        const pal = palette[(opts.index || 0) % palette.length];
        const c = scene.add.container(x, y);
        const g = scene.add.graphics();
        g.fillStyle(DesignTokens.shadow.color, DesignTokens.shadow.alpha);
        g.fillRoundedRect(-size / 2, -size / 2 + 5, size, size, DesignTokens.radius.md);
        g.fillGradientStyle(pal.fill, pal.fill,
            Phaser.Display.Color.IntegerToColor(pal.fill).darken(10).color,
            Phaser.Display.Color.IntegerToColor(pal.fill).darken(10).color, 1);
        g.fillRoundedRect(-size / 2, -size / 2, size, size, DesignTokens.radius.md);
        g.lineStyle(4, pal.border, 1);
        g.strokeRoundedRect(-size / 2, -size / 2, size, size, DesignTokens.radius.md);
        g.fillStyle(0xffffff, 0.3);
        g.fillRoundedRect(-size / 2 + 8, -size / 2 + 6, size - 16, size * 0.34, DesignTokens.radius.sm);
        c.add(g);
        c.add(scene.add.text(0, 2, String(label), {
            fontSize: (opts.fontSize || DesignTokens.typography.number) + 'px',
            fontFamily: DesignTokens.typography.fontFamily, fontStyle: 'bold',
            color: DesignTokens.css.white, stroke: '#00000066', strokeThickness: 4,
        }).setOrigin(0.5));
        setCenteredInput(c, size + 8, size + 8);
        this.bindTap(scene, c, () => onTap(c), { sfx: false });
        return c;
    },

    /** Storybook card / panel with soft shadow. */
    panel(scene, cx, cy, w, h, opts = {}) {
        const g = scene.add.graphics();
        g.fillStyle(DesignTokens.shadow.color, DesignTokens.shadow.alpha);
        g.fillRoundedRect(cx - w / 2, cy - h / 2 + 6, w, h, opts.radius ?? DesignTokens.radius.lg);
        g.fillStyle(opts.fill ?? DesignTokens.colors.surface, opts.alpha ?? 1);
        g.fillRoundedRect(cx - w / 2, cy - h / 2, w, h, opts.radius ?? DesignTokens.radius.lg);
        g.lineStyle(opts.borderWidth ?? 4, opts.border ?? DesignTokens.colors.accent, 1);
        g.strokeRoundedRect(cx - w / 2, cy - h / 2, w, h, opts.radius ?? DesignTokens.radius.lg);
        return g;
    },

    /** Soft progress bar (XP, world progress). Returns { fill(ratio) }. */
    progressBar(scene, cx, cy, w, opts = {}) {
        const h = opts.height || 16;
        const bg = scene.add.graphics();
        bg.fillStyle(0x000000, 0.18);
        bg.fillRoundedRect(cx - w / 2, cy - h / 2, w, h, h / 2);
        const fillG = scene.add.graphics();
        const color = opts.color ?? DesignTokens.colors.xp;
        const draw = (ratio) => {
            fillG.clear();
            const r = Phaser.Math.Clamp(ratio, 0, 1);
            if (r <= 0) return;
            fillG.fillGradientStyle(color, color,
                Phaser.Display.Color.IntegerToColor(color).darken(15).color,
                Phaser.Display.Color.IntegerToColor(color).darken(15).color, 1);
            fillG.fillRoundedRect(cx - w / 2, cy - h / 2, Math.max(h, w * r), h, h / 2);
        };
        draw(opts.value ?? 0);
        return {
            fill: draw,
            animateTo: (ratio, ms = 600) => {
                const start = { v: 0 };
                scene.tweens.addCounter({
                    from: 0, to: 1, duration: ms,
                    onUpdate: (tw) => draw(tw.getValue() * ratio),
                });
                return start;
            },
        };
    },

    /** Speech bubble — consistent across all characters. */
    speechBubble(scene, x, y, text, opts = {}) {
        const c = scene.add.container(x, y);
        const t = scene.add.text(0, 0, text, {
            fontSize: (opts.fontSize || DesignTokens.typography.speech) + 'px',
            fontFamily: DesignTokens.typography.fontFamily, fontStyle: 'bold',
            color: DesignTokens.css.ink, align: opts.align || 'center',
            wordWrap: { width: opts.maxWidth || 340 },
        }).setOrigin(0.5);
        const pad = 14;
        const bw = t.width + pad * 2;
        const bh = t.height + pad * 2;
        const g = scene.add.graphics();
        g.fillStyle(DesignTokens.shadow.color, 0.15);
        g.fillRoundedRect(-bw / 2, -bh / 2 + 4, bw, bh, 18);
        g.fillStyle(DesignTokens.colors.surface, 1);
        g.fillRoundedRect(-bw / 2, -bh / 2, bw, bh, 18);
        g.lineStyle(3, DesignTokens.colors.accent, 0.85);
        g.strokeRoundedRect(-bw / 2, -bh / 2, bw, bh, 18);
        // tail
        g.fillStyle(DesignTokens.colors.surface, 1);
        g.fillTriangle(-12, bh / 2 - 2, 12, bh / 2 - 2, 0, bh / 2 + 16);
        c.add([g, t]);
        return c;
    },
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { UISystem };
}
