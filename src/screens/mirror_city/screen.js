/**
 * screen.js — Thành Phố Gương (Mirror City). Educational goal: OBSERVATION /
 * visual discrimination (find the difference). Redesigned on the Game Engine.
 *
 *   Màn 1 · Tấm Gương Nhỏ  — 1 obvious difference, big objects, no timer
 *   Màn 2 · Phòng Gương Lớn — 3 differences, more objects, light timer, combo
 *   Màn 3 · Đại Sảnh Gương  — 5 subtle differences (color/position/orientation/
 *                             pattern/quantity), time challenge
 *
 * Scene pairs are generated procedurally: a themed set of elements is mirrored,
 * then K elements are mutated by a difference type. Tap the difference on
 * either panel to score it.
 */

const MC_THEMES = [
    { id: 'garden', sky: 0xb3e5fc, ground: 0xa5d6a7, pool: ['🌷', '🦋', '🐝', '🍄', '🌳', '☀️', '🐌'] },
    { id: 'pond', sky: 0xb2ebf2, ground: 0x80deea, pool: ['🦆', '🐟', '🐸', '🪷', '⛵', '🌊', '🐢'] },
    { id: 'sky', sky: 0xd1c4e9, ground: 0xb39ddb, pool: ['☁️', '🎈', '⭐', '🌙', '🪁', '🌈', '🕊️'] },
    { id: 'park', sky: 0xc8e6c9, ground: 0x9ccc65, pool: ['🐿️', '🐦', '🌸', '🎠', '🛝', '🌳', '🐕'] },
];

const MC_VARIANTS = {
    color: { '🌷': '🌹', '🐟': '🐠', '🦆': '🐥', '🍎': '🍏', '⭐': '🌟', '🎈': '🎀', '🌸': '🌺', '🐦': '🐧', '☁️': '⛅', '🐢': '🐊' },
    shape: { '⭐': '✨', '🍄': '🌰', '🌳': '🌵', '🪷': '🌸', '🎈': '🪁', '🐝': '🦋', '⛵': '🚤', '🌙': '☀️', '🐌': '🐜', '🛝': '🎠' },
};
const MC_DIRECTIONAL = ['🐟', '🦆', '🐥', '🐢', '🐌', '🕊️', '🐦', '🐧', '🐿️', '🐕', '🐸', '🐝', '🦋', '🐊', '🐜'];

class MirrorCityScreen extends GameShell {
    constructor() {
        super('MirrorCityScreen');
        this.gameId = 'mirror_city';
        this.roundObjects = [];
        this.foundCount = 0;
        this.diffTargets = [];
        this.currentMutations = new Map();
        this.pips = null;
    }

    onPreload() {
        this.load.image('mc_bg', 'screens/mirror_city/assets/backgrounds/bg.png');
        this.preloadCommonAudio('mirror_city');
    }

    buildWorld(w, h) {
        if (this.textures.exists('mc_bg')) {
            this.add.image(w / 2, h / 2, 'mc_bg').setDisplaySize(w, h).setDepth(0);
        } else {
            const g = this.add.graphics().setDepth(0);
            g.fillGradientStyle(0x4a148c, 0x4a148c, 0x7b1fa2, 0x7b1fa2, 1);
            g.fillRect(0, 0, w, h);
        }
        this.startLevelBGM('bgm_mirror_city', 'screens/mirror_city/assets/audio/bgm/bgm.mp3');
    }

    introText() {
        return {
            1: 'Tấm gương thần bị lỗi rồi! Tìm 1 điểm khác nhau giữa hai bức tranh nhé!',
            2: 'Nhiều tấm gương bị lỗi hơn! Tìm đủ 3 điểm khác nhau trong mỗi bức tranh!',
            3: 'Đại Sảnh Gương thử thách thám tử giỏi nhất! 5 điểm khác RẤT nhỏ đang chờ bạn!',
        }[this.level];
    }

    presentRound(index, diff) {
        this.clearRound();
        this.foundCount = 0;
        this.diffTargets = [];

        const theme = Phaser.Utils.Array.GetRandom(MC_THEMES);
        const elements = this.generateElements(theme, diff.objectCount);
        this.currentMutations = this.pickMutations(elements, diff.differencesPerRound, diff.subtlety);

        this.renderPanels(theme, elements);
        this.createProgressPips(this.currentMutations.size);
        this.companionSay(`Tìm ${this.currentMutations.size} điểm khác nhau nhé! 🔍`, 3000);
    }

    track(obj) { this.roundObjects.push(obj); return obj; }

    clearRound() {
        this.roundObjects.forEach(o => { if (o?.active) o.destroy(true); });
        this.roundObjects = [];
        this.pips = null;
    }

    // ─── Scene generation ─────────────────────────────────────

    generateElements(theme, objectCount) {
        const pool = Phaser.Utils.Array.Shuffle([...theme.pool]);
        const elements = [];
        const groupEmoji = pool[0];
        const gx = Phaser.Math.FloatBetween(0.2, 0.8);
        const gy = Phaser.Math.FloatBetween(0.25, 0.7);
        for (let i = 0; i < 3; i++) {
            elements.push({
                id: `g${i}`, group: 'group', emoji: groupEmoji,
                rx: Phaser.Math.Clamp(gx + (i - 1) * 0.14, 0.08, 0.92),
                ry: Phaser.Math.Clamp(gy + (i % 2) * 0.1, 0.12, 0.88),
                scale: 1,
            });
        }
        const singles = Math.max(2, objectCount - 3);
        for (let i = 0; i < singles; i++) {
            elements.push({
                id: `s${i}`, group: null, emoji: pool[(i + 1) % pool.length],
                rx: Phaser.Math.FloatBetween(0.1, 0.9),
                ry: Phaser.Math.FloatBetween(0.15, 0.85),
                scale: Phaser.Math.FloatBetween(0.9, 1.15),
            });
        }
        return elements;
    }

    pickMutations(elements, count, subtlety) {
        const typesBySubtlety = {
            1: ['count', 'presence', 'color'],
            2: ['count', 'presence', 'color', 'size', 'shape'],
            3: ['color', 'size', 'shape', 'direction', 'position', 'rotation', 'presence', 'count'],
        };
        const allowed = typesBySubtlety[subtlety] || typesBySubtlety[1];
        const mutations = new Map(); // diffKey → type
        const targets = Phaser.Utils.Array.Shuffle(['group', ...elements.filter(e => !e.group).map(e => e.id)]);
        let picked = 0;
        for (const t of targets) {
            if (picked >= count) break;
            const isGroup = t === 'group';
            const el = isGroup ? null : elements.find(e => e.id === t);
            const valid = allowed.filter(ty => {
                if (isGroup) return ty === 'count';
                if (ty === 'count') return false;
                if (ty === 'color') return !!MC_VARIANTS.color[el.emoji];
                if (ty === 'shape') return !!MC_VARIANTS.shape[el.emoji];
                if (ty === 'direction') return MC_DIRECTIONAL.includes(el.emoji);
                return true; // presence, size, position, rotation
            });
            if (!valid.length) continue;
            mutations.set(t, Phaser.Utils.Array.GetRandom(valid));
            picked++;
        }
        return mutations;
    }

    mutatedProps(el, mutationType) {
        const p = { emoji: el.emoji, rx: el.rx, ry: el.ry, scale: el.scale, flip: false, angle: 0, hidden: false };
        switch (mutationType) {
            case 'presence': p.hidden = true; break;
            case 'color': p.emoji = MC_VARIANTS.color[el.emoji] || el.emoji; break;
            case 'shape': p.emoji = MC_VARIANTS.shape[el.emoji] || el.emoji; break;
            case 'size': p.scale = el.scale * 0.62; break;
            case 'direction': p.flip = true; break;
            case 'position':
                p.rx = Phaser.Math.Clamp(el.rx + 0.16, 0.08, 0.92);
                p.ry = Phaser.Math.Clamp(el.ry - 0.12, 0.1, 0.9);
                break;
            case 'rotation': p.angle = 35; break;
        }
        return p;
    }

    // ─── Rendering ────────────────────────────────────────────

    renderPanels(theme, elements) {
        const w = this.cameras.main.width;
        const h = this.cameras.main.height;
        const panelW = w * 0.42;
        const panelH = h * 0.6;
        const panelY = h * 0.47;
        const baseSize = Math.min(panelW, panelH) * 0.16;

        [[w * 0.27, false], [w * 0.73, true]].forEach(([px, isRight]) => {
            const frame = this.track(this.add.graphics().setDepth(40));
            frame.fillStyle(theme.sky, 1);
            frame.fillRoundedRect(px - panelW / 2, panelY - panelH / 2, panelW, panelH, 18);
            frame.fillStyle(theme.ground, 1);
            frame.fillRoundedRect(px - panelW / 2, panelY + panelH * 0.12, panelW, panelH * 0.38 - 2, { tl: 0, tr: 0, bl: 18, br: 18 });
            frame.lineStyle(5, 0xffd700, 1);
            frame.strokeRoundedRect(px - panelW / 2, panelY - panelH / 2, panelW, panelH, 18);

            this.track(this.add.text(px, panelY - panelH / 2 - 22, isRight ? '🪞 Gương' : '🖼 Tranh', {
                fontSize: '20px', fontFamily: 'Comic Sans MS, Arial', fontStyle: 'bold',
                color: '#ffd700', stroke: '#000', strokeThickness: 3,
            }).setOrigin(0.5).setDepth(45));

            elements.forEach(el => {
                const diffKey = el.group ? 'group' : el.id;
                const mutationType = isRight ? this.currentMutations.get(diffKey) : null;
                const hideForCount = isRight && el.group && mutationType === 'count' && el.id === 'g2';
                const props = this.mutatedProps(el, el.group ? null : mutationType);
                if (props.hidden || hideForCount) {
                    if (isRight) this.addHotspot(px, panelY, panelW, panelH, el, baseSize, diffKey);
                    return;
                }
                const ex = px - panelW / 2 + props.rx * panelW;
                const ey = panelY - panelH / 2 + props.ry * panelH;
                const t = this.track(this.add.text(ex, ey, props.emoji, {
                    fontSize: `${Math.round(baseSize * props.scale)}px`,
                }).setOrigin(0.5).setDepth(50));
                if (props.flip) t.setFlipX(true);
                if (props.angle) t.setAngle(props.angle);
                t.setData('diffKey', diffKey);
                t.setInteractive({ useHandCursor: true });
                t.on('pointerdown', () => this.tapElement(t, ex, ey));
            });
        });
    }

    addHotspot(px, panelY, panelW, panelH, el, baseSize, diffKey) {
        const ex = px - panelW / 2 + el.rx * panelW;
        const ey = panelY - panelH / 2 + el.ry * panelH;
        const z = this.track(this.add.zone(ex, ey, baseSize * 1.5, baseSize * 1.5).setDepth(49));
        z.setInteractive({ useHandCursor: true });
        z.setData('diffKey', diffKey);
        z.on('pointerdown', () => this.tapElement(z, ex, ey));
    }

    createProgressPips(total) {
        const w = this.cameras.main.width;
        this.pips = [];
        const pipRow = this.track(this.add.container(w / 2, 104).setDepth(150));
        const bg = this.add.graphics();
        bg.fillStyle(0x000000, 0.45);
        bg.fillRoundedRect(-total * 26 - 16, -22, total * 52 + 32, 44, 22);
        pipRow.add(bg);
        for (let i = 0; i < total; i++) {
            const p = this.add.text((i - (total - 1) / 2) * 52, 0, '⭕', { fontSize: '26px' }).setOrigin(0.5);
            pipRow.add(p);
            this.pips.push(p);
        }
    }

    // ─── Taps ─────────────────────────────────────────────────

    tapElement(obj, x, y) {
        if (!this.acceptingInput || this.isPaused || this.sessionOver) return;
        const key = obj.getData('diffKey');
        if (this.diffTargets.includes(key)) return;

        if (this.currentMutations.has(key)) {
            this.diffTargets.push(key);
            this.foundCount++;
            this.markFound(x, y);
            if (this.pips?.[this.foundCount - 1]) this.pips[this.foundCount - 1].setText('✅');
            if (this.foundCount >= this.currentMutations.size) {
                this.answerCorrect(x, y);
            } else {
                this.companionReact('happy');
                this.companionSay(Phaser.Utils.Array.GetRandom(['Đúng rồi! 🎉', 'Tìm tiếp nào! 👀', 'Mắt tinh quá! ✨']), 1500);
            }
        } else {
            this.recordFumble();
            this.companionReact('sad');
            const puff = this.track(this.add.text(x, y, '💭', { fontSize: '30px' }).setOrigin(0.5).setDepth(300));
            this.tweens.add({ targets: puff, y: y - 30, alpha: 0, duration: 700, onComplete: () => puff.destroy() });
        }
    }

    markFound(x, y) {
        const ring = this.track(this.add.graphics().setDepth(200));
        ring.lineStyle(4, 0xffd700, 1);
        ring.strokeCircle(0, 0, 34);
        ring.setPosition(x, y);
        ring.setScale(0.3);
        this.tweens.add({ targets: ring, scale: 1, duration: 300, ease: 'Back.easeOut' });
        this.spawnSparkles(x, y, 10);
    }

    showHintVisual(hint) {
        if (hint.style === 'conceptual') return;
        const remaining = this.roundObjects.filter(o =>
            o.getData && this.currentMutations.has(o.getData('diffKey')) &&
            !this.diffTargets.includes(o.getData('diffKey')));
        const target = remaining[0];
        if (!target) return;
        const ring = this.add.graphics().setDepth(290);
        ring.lineStyle(5, 0xffeb3b, 0.95);
        ring.strokeCircle(0, 0, hint.style === 'direct' ? 40 : 70);
        ring.setPosition(target.x, target.y);
        this.tweens.add({ targets: ring, alpha: 0, scale: 1.4, duration: 1600, onComplete: () => ring.destroy() });
    }
}
