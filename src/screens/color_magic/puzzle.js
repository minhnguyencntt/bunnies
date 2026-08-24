/**
 * puzzle.js — Phép Màu Sắc (Color Magic): color-by-pattern content + generator.
 * Gameplay reads only this module. New artwork = new entry in ARTWORKS.
 */
function cmClamp(v, lo, hi) {
    return Math.min(hi, Math.max(lo, v));
}

function cmPick(list, rand) {
    if (!list || !list.length) return null;
    return list[Math.floor(rand() * list.length)];
}

function cmShuffle(list, rand) {
    const a = list.slice();
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(rand() * (i + 1));
        const t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
}

const E = (x, y, w, h) => ({ type: 'ellipse', x, y, w, h });
const C = (x, y, r) => ({ type: 'circle', x, y, r });
const R = (x, y, w, h, radius) => ({ type: 'roundrect', x, y, w, h, radius: radius || 14 });

const ColorMagicPuzzle = {
    version: 1,
    operation: 'color_match',

    palette: {
        skyTop: 0xffe082, skyBottom: 0xe1bee7,
        hill1: 0x81d4fa, hill2: 0xf8bbd0,
        ground: 0xfff8e1,
        accent: 0x7c5cbf,
        panel: 0x5c3a8c,
    },
    decor: ['🌸', '🌈', '⭐', '🧁', '🐠'],
    particleColors: [0xff6b6b, 0xffd166, 0x66bb6a, 0x42a5f5, 0xab47bc, 0xff80ab],

    copy: {
        matchThis: 'TÔ NHƯ HÌNH NÀY',
        colorHere: 'TÔ Ở ĐÂY',
        intro: {
            1: 'Nhìn hình mẫu, chọn màu, rồi tô cho giống nhé!',
            2: 'Tô từng phần cho giống hình mẫu. Nhìn kỹ màu từng chỗ!',
            3: 'Nhớ màu trên hình mẫu, rồi tô cho giống. Bạn làm được!',
        },
        lookAgain: 'Nhìn lại hình mẫu nhé!',
        almost: 'Gần đúng rồi! Thử màu khác nào.',
        tryColor: (name) => `Thử màu ${name} nhé!`,
        checkPart: (label) => `Xem lại phần ${label} trên hình mẫu.`,
        progress: (done, total) => `${done} / ${total}`,
        colorWord: 'màu',
    },

    COLORS: {
        red:    { id: 'red',    fill: 0xe53935, name: 'Đỏ',     nameEn: 'Red',    glyph: '🔴' },
        orange: { id: 'orange', fill: 0xfb8c00, name: 'Cam',    nameEn: 'Orange', glyph: '🟠' },
        yellow: { id: 'yellow', fill: 0xfdd835, name: 'Vàng',   nameEn: 'Yellow', glyph: '🟡' },
        green:  { id: 'green',  fill: 0x43a047, name: 'Xanh lá', nameEn: 'Green', glyph: '🟢' },
        blue:   { id: 'blue',   fill: 0x1e88e5, name: 'Xanh dương', nameEn: 'Blue', glyph: '🔵' },
        purple: { id: 'purple', fill: 0x8e24aa, name: 'Tím',    nameEn: 'Purple', glyph: '🟣' },
        pink:   { id: 'pink',   fill: 0xec407a, name: 'Hồng',   nameEn: 'Pink',   glyph: '💗' },
    },

    COLOR_ORDER: ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink'],

    THEMES: {
        rainbow_garden: { id: 'rainbow_garden', name: 'Vườn Cầu Vồng' },
        candy_land: { id: 'candy_land', name: 'Xứ Kẹo' },
        ocean: { id: 'ocean', name: 'Đại Dương' },
        fairy_tale: { id: 'fairy_tale', name: 'Cổ Tích' },
        space: { id: 'space', name: 'Vũ Trụ' },
    },

    ARTWORKS: [],

    color(id) {
        return this.COLORS[id] || this.COLORS.pink;
    },

    artwork(id) {
        return this.ARTWORKS.find((a) => a.id === id) || null;
    },

    pointInShape(shape, px, py, pad) {
        if (!shape) return false;
        const p = pad || 0;
        if (shape.type === 'circle') {
            const dx = px - shape.x;
            const dy = py - shape.y;
            const r = shape.r + p;
            return dx * dx + dy * dy <= r * r;
        }
        if (shape.type === 'ellipse') {
            const rx = shape.w / 2 + p;
            const ry = shape.h / 2 + p;
            if (rx <= 0 || ry <= 0) return false;
            const dx = (px - shape.x) / rx;
            const dy = (py - shape.y) / ry;
            return dx * dx + dy * dy <= 1;
        }
        const hw = shape.w / 2 + p;
        const hh = shape.h / 2 + p;
        return px >= shape.x - hw && px <= shape.x + hw && py >= shape.y - hh && py <= shape.y + hh;
    },

    shapeArea(shape) {
        if (!shape) return 0;
        if (shape.type === 'circle') return Math.PI * shape.r * shape.r;
        if (shape.type === 'ellipse') return Math.PI * (shape.w / 2) * (shape.h / 2);
        return (shape.w || 0) * (shape.h || 0);
    },

    /** Small nested parts (swirl on lollipop, spots, holes) sit in front. */
    regionsFrontFirst(regions) {
        return (regions || []).slice().sort((a, b) => this.shapeArea(a.shape) - this.shapeArea(b.shape));
    },

    uniqueColors(mapping) {
        return Object.keys(mapping || {}).reduce((acc, key) => {
            const c = mapping[key];
            if (c && acc.indexOf(c) < 0) acc.push(c);
            return acc;
        }, []);
    },

    transformShape(shape, cx, cy, scale) {
        if (!shape) return null;
        const s = scale || 1;
        if (shape.type === 'circle') {
            return { type: 'circle', x: cx + shape.x * s, y: cy + shape.y * s, r: shape.r * s };
        }
        if (shape.type === 'ellipse') {
            return { type: 'ellipse', x: cx + shape.x * s, y: cy + shape.y * s, w: shape.w * s, h: shape.h * s };
        }
        return {
            type: 'roundrect',
            x: cx + shape.x * s,
            y: cy + shape.y * s,
            w: shape.w * s,
            h: shape.h * s,
            radius: (shape.radius || 14) * s,
        };
    },

    artworkBounds(regions) {
        const list = regions || [];
        if (!list.length) return { w: 40, h: 40, cx: 0, cy: 0 };
        let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
        list.forEach((r) => {
            const s = r.shape;
            if (!s) return;
            const hw = s.type === 'circle' ? s.r : s.w / 2;
            const hh = s.type === 'circle' ? s.r : s.h / 2;
            minX = Math.min(minX, s.x - hw);
            maxX = Math.max(maxX, s.x + hw);
            minY = Math.min(minY, s.y - hh);
            maxY = Math.max(maxY, s.y + hh);
        });
        return {
            w: Math.max(40, maxX - minX),
            h: Math.max(40, maxY - minY),
            cx: (minX + maxX) / 2,
            cy: (minY + maxY) / 2,
        };
    },

    referenceMode(diff) {
        const mem = (diff && diff.memoryLoad) || 1;
        if (mem >= 3) return 'peek';
        if (mem >= 2) return 'compact';
        return 'full';
    },

    peekMs(diff) {
        return this.referenceMode(diff) === 'peek' ? 2200 : 0;
    },

    regionCount(diff) {
        return cmClamp((diff && diff.objectCount) || 3, 2, 10);
    },

    paletteCount(diff) {
        if (diff && diff.paletteSize > 0) return cmClamp(diff.paletteSize, 2, 7);
        if (diff && diff.choiceCount > 0) return cmClamp(diff.choiceCount, 2, 7);
        return 3;
    },

    createSession(challenge) {
        return {
            challenge,
            fills: {},
            completed: false,
            selectedColorId: null,
        };
    },

    /**
     * Apply a color to a region. Idempotent once the challenge is complete.
     */
    applyColor(session, regionId, colorId) {
        if (!session || !session.challenge) return { kind: 'locked' };
        if (session.completed) return { kind: 'locked' };
        const region = session.challenge.regions.find((r) => r.id === regionId);
        if (!region) return { kind: 'miss' };
        if (session.fills[regionId] === region.colorId) return { kind: 'already', region };
        if (colorId === region.colorId) {
            session.fills[regionId] = colorId;
            const complete = this.isComplete(session.fills, session.challenge);
            if (complete) session.completed = true;
            return { kind: 'correct', complete, region };
        }
        return { kind: 'wrong', region };
    },

    hitRegion(challenge, lx, ly, scale, opts) {
        const s = scale || 1;
        const px = lx / s;
        const py = ly / s;
        const pad = ((opts && opts.pad) || 0) / s;
        const list = this.regionsFrontFirst(challenge.regions);
        for (let i = 0; i < list.length; i++) {
            if (this.pointInShape(list[i].shape, px, py, pad)) return list[i];
        }
        const maxDist = ((opts && opts.maxDist) || 0) / s;
        if (maxDist <= 0) return null;
        let best = null;
        let bestD = maxDist;
        list.forEach((r) => {
            const dx = px - r.shape.x;
            const dy = py - r.shape.y;
            const d = Math.sqrt(dx * dx + dy * dy);
            if (d < bestD) { bestD = d; best = r; }
        });
        return best;
    },

    /**
     * Build a playable challenge from artwork templates + valid patterns.
     * Never invent colors that the template does not allow.
     */
    generateChallenge(diff, opts) {
        const rand = (opts && opts.random) || Math.random;
        const exclude = (opts && opts.excludeIds) || [];
        const needRegions = this.regionCount(diff);
        const needColors = this.paletteCount(diff);
        const mode = this.referenceMode(diff);

        const eligible = (list, minR) => list.filter((a) => a.regions.length >= minR);
        const unused = this.ARTWORKS.filter((a) => exclude.indexOf(a.id) < 0);
        const source = unused.length ? unused : this.ARTWORKS.slice();
        const richest = source.reduce((m, a) => Math.max(m, a.regions.length), 0);
        let pool = eligible(source, Math.min(needRegions, richest));
        if (!pool.length) pool = source.slice();
        const art = cmPick(pool, rand);
        const pattern = cmPick(art.patterns, rand) || art.patterns[0];

        const byWeight = art.regions.slice().sort((a, b) => (b.weight || 1) - (a.weight || 1));
        const required = byWeight.filter((r) => r.required);
        const optional = byWeight.filter((r) => !r.required);
        const takeN = cmClamp(needRegions, 2, art.regions.length);
        const picked = required.concat(optional).slice(0, takeN);
        const take = art.regions.filter((r) => picked.indexOf(r) >= 0);

        const regions = take.map((r) => ({
            id: r.id,
            label: r.label,
            labelEn: r.labelEn,
            weight: r.weight || 1,
            shape: r.shape,
            colorId: pattern[r.id] || art.patterns[0][r.id],
        }));

        let palette = this.uniqueColors(regions.reduce((m, r) => {
            m[r.id] = r.colorId;
            return m;
        }, {}));
        const allIds = this.COLOR_ORDER;
        while (palette.length < needColors) {
            const next = allIds.find((id) => palette.indexOf(id) < 0);
            if (!next) break;
            palette.push(next);
        }
        palette = cmShuffle(palette, rand);

        return {
            artworkId: art.id,
            theme: art.theme,
            title: art.title,
            titleEn: art.titleEn,
            glyph: art.glyph,
            regions,
            palette,
            referenceMode: mode,
            regionCount: regions.length,
            colorCount: palette.length,
            peekMs: this.peekMs(diff),
        };
    },

    isComplete(fills, challenge) {
        if (!challenge || !challenge.regions) return false;
        return challenge.regions.every((r) => fills[r.id] === r.colorId);
    },

    remaining(fills, challenge) {
        return (challenge.regions || []).filter((r) => fills[r.id] !== r.colorId);
    },

    hintFor(region, copy) {
        const c = copy || this.copy;
        if (!region) return c.lookAgain;
        const col = this.color(region.colorId);
        if (region.label) return c.checkPart(region.label);
        return c.tryColor(col.name);
    },

    drawShape(g, shape, fill, alpha, stroke) {
        if (!g || !shape) return;
        const a = alpha == null ? 1 : alpha;
        if (fill != null) g.fillStyle(fill, a);
        if (shape.type === 'circle') {
            if (fill != null) g.fillCircle(shape.x, shape.y, shape.r);
            if (stroke) {
                g.lineStyle(stroke.width || 3, stroke.color || 0x4a3728, stroke.alpha == null ? 0.95 : stroke.alpha);
                g.strokeCircle(shape.x, shape.y, shape.r);
            }
            return;
        }
        if (shape.type === 'ellipse') {
            if (fill != null) g.fillEllipse(shape.x, shape.y, shape.w, shape.h);
            if (stroke) {
                g.lineStyle(stroke.width || 3, stroke.color || 0x4a3728, stroke.alpha == null ? 0.95 : stroke.alpha);
                g.strokeEllipse(shape.x, shape.y, shape.w, shape.h);
            }
            return;
        }
        const rad = shape.radius || 12;
        if (fill != null) g.fillRoundedRect(shape.x - shape.w / 2, shape.y - shape.h / 2, shape.w, shape.h, rad);
        if (stroke) {
            g.lineStyle(stroke.width || 3, stroke.color || 0x4a3728, stroke.alpha == null ? 0.95 : stroke.alpha);
            g.strokeRoundedRect(shape.x - shape.w / 2, shape.y - shape.h / 2, shape.w, shape.h, rad);
        }
    },
};

function art(def) {
    ColorMagicPuzzle.ARTWORKS.push(def);
    return def;
}

art({
    id: 'bunny', theme: 'rainbow_garden', title: 'Thỏ Bunnine', titleEn: 'Bunny', glyph: '🐰',
    regions: [
        { id: 'earL', label: 'tai', labelEn: 'ear', weight: 2, shape: E(-28, -52, 24, 54) },
        { id: 'earR', label: 'tai', labelEn: 'ear', weight: 2, shape: E(28, -52, 24, 54) },
        { id: 'body', label: 'thân', labelEn: 'body', weight: 5, required: true, shape: E(0, 18, 78, 96) },
        { id: 'belly', label: 'bụng', labelEn: 'belly', weight: 3, shape: E(0, 30, 42, 50) },
        { id: 'flower', label: 'hoa', labelEn: 'flower', weight: 2, shape: C(40, 8, 12) },
        { id: 'cheek', label: 'má', labelEn: 'cheek', weight: 1, shape: C(-18, 8, 8) },
        { id: 'paw', label: 'chân', labelEn: 'paw', weight: 2, shape: E(0, 62, 50, 18) },
    ],
    patterns: [
        { earL: 'pink', earR: 'pink', body: 'pink', belly: 'yellow', flower: 'yellow', cheek: 'red', paw: 'pink' },
        { earL: 'pink', earR: 'pink', body: 'purple', belly: 'pink', flower: 'red', cheek: 'orange', paw: 'purple' },
        { earL: 'blue', earR: 'blue', body: 'blue', belly: 'yellow', flower: 'orange', cheek: 'pink', paw: 'blue' },
    ],
});

art({
    id: 'flower', theme: 'rainbow_garden', title: 'Bông Hoa', titleEn: 'Flower', glyph: '🌸',
    regions: [
        { id: 'petals', label: 'cánh hoa', labelEn: 'petals', weight: 4, required: true, shape: C(0, -8, 48) },
        { id: 'center', label: 'nhụy', labelEn: 'center', weight: 3, shape: C(0, -8, 16) },
        { id: 'stem', label: 'thân', labelEn: 'stem', weight: 2, shape: R(0, 52, 14, 56, 8) },
        { id: 'leaf', label: 'lá', labelEn: 'leaf', weight: 2, shape: E(28, 44, 36, 18) },
    ],
    patterns: [
        { petals: 'pink', center: 'yellow', stem: 'green', leaf: 'green' },
        { petals: 'red', center: 'yellow', stem: 'green', leaf: 'green' },
        { petals: 'purple', center: 'orange', stem: 'green', leaf: 'green' },
    ],
});

art({
    id: 'butterfly', theme: 'rainbow_garden', title: 'Bướm', titleEn: 'Butterfly', glyph: '🦋',
    regions: [
        { id: 'wingL', label: 'cánh', labelEn: 'wing', weight: 4, required: true, shape: E(-32, 0, 52, 70) },
        { id: 'wingR', label: 'cánh', labelEn: 'wing', weight: 4, required: true, shape: E(32, 0, 52, 70) },
        { id: 'body', label: 'thân', labelEn: 'body', weight: 3, shape: E(0, 4, 16, 64) },
        { id: 'dots', label: 'chấm', labelEn: 'dots', weight: 1, shape: C(-32, -8, 8) },
    ],
    patterns: [
        { wingL: 'blue', wingR: 'blue', body: 'yellow', dots: 'orange' },
        { wingL: 'pink', wingR: 'pink', body: 'purple', dots: 'yellow' },
        { wingL: 'green', wingR: 'green', body: 'orange', dots: 'red' },
    ],
});

art({
    id: 'mushroom', theme: 'rainbow_garden', title: 'Nấm', titleEn: 'Mushroom', glyph: '🍄',
    regions: [
        { id: 'cap', label: 'mũ', labelEn: 'cap', weight: 5, required: true, shape: E(0, -18, 96, 56) },
        { id: 'spots', label: 'đốm', labelEn: 'spots', weight: 2, shape: C(-16, -22, 10) },
        { id: 'stem', label: 'thân', labelEn: 'stem', weight: 3, shape: R(0, 36, 36, 70, 16) },
    ],
    patterns: [
        { cap: 'red', spots: 'yellow', stem: 'orange' },
        { cap: 'pink', spots: 'yellow', stem: 'yellow' },
        { cap: 'purple', spots: 'pink', stem: 'blue' },
    ],
});

art({
    id: 'tree', theme: 'rainbow_garden', title: 'Cây', titleEn: 'Tree', glyph: '🌳',
    regions: [
        { id: 'crown', label: 'tán', labelEn: 'crown', weight: 5, required: true, shape: C(0, -18, 54) },
        { id: 'trunk', label: 'thân', labelEn: 'trunk', weight: 3, shape: R(0, 58, 28, 64, 10) },
        { id: 'fruit', label: 'quả', labelEn: 'fruit', weight: 2, shape: C(22, -8, 10) },
    ],
    patterns: [
        { crown: 'green', trunk: 'orange', fruit: 'red' },
        { crown: 'green', trunk: 'orange', fruit: 'yellow' },
        { crown: 'yellow', trunk: 'orange', fruit: 'pink' },
    ],
});

art({
    id: 'rainbow', theme: 'rainbow_garden', title: 'Cầu Vồng', titleEn: 'Rainbow', glyph: '🌈',
    regions: [
        { id: 'arch1', label: 'vòng ngoài', labelEn: 'outer', weight: 4, required: true, shape: E(0, 10, 140, 90) },
        { id: 'arch2', label: 'vòng giữa', labelEn: 'middle', weight: 3, shape: E(0, 18, 100, 64) },
        { id: 'arch3', label: 'vòng trong', labelEn: 'inner', weight: 2, shape: E(0, 26, 60, 40) },
    ],
    patterns: [
        { arch1: 'red', arch2: 'yellow', arch3: 'blue' },
        { arch1: 'pink', arch2: 'green', arch3: 'purple' },
        { arch1: 'orange', arch2: 'blue', arch3: 'yellow' },
    ],
});

art({
    id: 'cupcake', theme: 'candy_land', title: 'Bánh Cupcake', titleEn: 'Cupcake', glyph: '🧁',
    regions: [
        { id: 'frosting', label: 'kem', labelEn: 'frosting', weight: 4, required: true, shape: E(0, -28, 80, 48) },
        { id: 'cake', label: 'bánh', labelEn: 'cake', weight: 3, shape: R(0, 18, 70, 40, 8) },
        { id: 'wrapper', label: 'giấy', labelEn: 'wrapper', weight: 3, shape: R(0, 52, 78, 36, 8) },
        { id: 'cherry', label: 'cherry', labelEn: 'cherry', weight: 2, shape: C(0, -52, 10) },
    ],
    patterns: [
        { frosting: 'pink', cake: 'yellow', wrapper: 'orange', cherry: 'red' },
        { frosting: 'purple', cake: 'yellow', wrapper: 'pink', cherry: 'red' },
        { frosting: 'blue', cake: 'yellow', wrapper: 'green', cherry: 'pink' },
    ],
});

art({
    id: 'lollipop', theme: 'candy_land', title: 'Kẹo Mút', titleEn: 'Lollipop', glyph: '🍭',
    regions: [
        { id: 'candy', label: 'kẹo', labelEn: 'candy', weight: 5, required: true, shape: C(0, -24, 42) },
        { id: 'stick', label: 'que', labelEn: 'stick', weight: 3, shape: R(0, 48, 12, 70, 6) },
        { id: 'swirl', label: 'xoáy', labelEn: 'swirl', weight: 2, shape: C(-8, -28, 12) },
    ],
    patterns: [
        { candy: 'pink', stick: 'yellow', swirl: 'red' },
        { candy: 'purple', stick: 'orange', swirl: 'yellow' },
        { candy: 'blue', stick: 'green', swirl: 'pink' },
    ],
});

art({
    id: 'ice_cream', theme: 'candy_land', title: 'Kem', titleEn: 'Ice Cream', glyph: '🍦',
    regions: [
        { id: 'scoop1', label: 'viên trên', labelEn: 'top scoop', weight: 4, required: true, shape: C(0, -40, 28) },
        { id: 'scoop2', label: 'viên dưới', labelEn: 'bottom scoop', weight: 4, required: true, shape: C(0, -8, 32) },
        { id: 'cone', label: 'ốc quế', labelEn: 'cone', weight: 3, shape: E(0, 48, 48, 64) },
    ],
    patterns: [
        { scoop1: 'pink', scoop2: 'yellow', cone: 'orange' },
        { scoop1: 'green', scoop2: 'pink', cone: 'orange' },
        { scoop1: 'purple', scoop2: 'blue', cone: 'yellow' },
    ],
});

art({
    id: 'donut', theme: 'candy_land', title: 'Bánh Donut', titleEn: 'Donut', glyph: '🍩',
    regions: [
        { id: 'dough', label: 'bánh', labelEn: 'dough', weight: 5, required: true, shape: C(0, 0, 52) },
        { id: 'icing', label: 'sốt', labelEn: 'icing', weight: 4, shape: C(0, 0, 36) },
        { id: 'hole', label: 'lỗ', labelEn: 'hole', weight: 1, shape: C(0, 0, 14) },
    ],
    patterns: [
        { dough: 'orange', icing: 'pink', hole: 'yellow' },
        { dough: 'yellow', icing: 'purple', hole: 'blue' },
        { dough: 'orange', icing: 'green', hole: 'pink' },
    ],
});

art({
    id: 'candy', theme: 'candy_land', title: 'Kẹo Bọc', titleEn: 'Candy', glyph: '🍬',
    regions: [
        { id: 'wrapL', label: 'giấy trái', labelEn: 'left wrap', weight: 2, shape: E(-48, 0, 36, 28) },
        { id: 'center', label: 'kẹo', labelEn: 'candy', weight: 5, required: true, shape: E(0, 0, 56, 40) },
        { id: 'wrapR', label: 'giấy phải', labelEn: 'right wrap', weight: 2, shape: E(48, 0, 36, 28) },
    ],
    patterns: [
        { wrapL: 'yellow', center: 'red', wrapR: 'yellow' },
        { wrapL: 'pink', center: 'purple', wrapR: 'pink' },
        { wrapL: 'blue', center: 'green', wrapR: 'blue' },
    ],
});

art({
    id: 'fish', theme: 'ocean', title: 'Cá', titleEn: 'Fish', glyph: '🐠',
    regions: [
        { id: 'body', label: 'thân', labelEn: 'body', weight: 5, required: true, shape: E(0, 0, 90, 54) },
        { id: 'belly', label: 'bụng', labelEn: 'belly', weight: 3, shape: E(-4, 10, 58, 22) },
        { id: 'fin', label: 'vây', labelEn: 'fin', weight: 2, shape: E(4, -28, 28, 18) },
        { id: 'fin2', label: 'vây dưới', labelEn: 'lower fin', weight: 2, shape: E(8, 28, 26, 14) },
        { id: 'tail', label: 'đuôi', labelEn: 'tail', weight: 3, shape: E(58, 0, 32, 36) },
        { id: 'stripe', label: 'sọc', labelEn: 'stripe', weight: 2, shape: E(6, 0, 18, 36) },
        { id: 'eye', label: 'mắt', labelEn: 'eye', weight: 1, shape: C(-28, -4, 7) },
    ],
    patterns: [
        { body: 'orange', belly: 'yellow', fin: 'yellow', fin2: 'red', tail: 'red', stripe: 'pink', eye: 'blue' },
        { body: 'blue', belly: 'green', fin: 'green', fin2: 'purple', tail: 'purple', stripe: 'yellow', eye: 'yellow' },
        { body: 'pink', belly: 'yellow', fin: 'orange', fin2: 'red', tail: 'yellow', stripe: 'purple', eye: 'blue' },
    ],
});

art({
    id: 'turtle', theme: 'ocean', title: 'Rùa', titleEn: 'Turtle', glyph: '🐢',
    regions: [
        { id: 'shell', label: 'mai', labelEn: 'shell', weight: 5, required: true, shape: E(0, 4, 88, 64) },
        { id: 'spots', label: 'đốm', labelEn: 'spots', weight: 2, shape: C(-12, 0, 10) },
        { id: 'head', label: 'đầu', labelEn: 'head', weight: 3, shape: E(-58, 0, 32, 28) },
        { id: 'flipper', label: 'chân chèo', labelEn: 'flipper', weight: 2, shape: E(20, 40, 36, 16) },
    ],
    patterns: [
        { shell: 'green', spots: 'yellow', head: 'green', flipper: 'green' },
        { shell: 'blue', spots: 'orange', head: 'green', flipper: 'blue' },
        { shell: 'purple', spots: 'pink', head: 'green', flipper: 'yellow' },
    ],
});

art({
    id: 'octopus', theme: 'ocean', title: 'Bạch Tuộc', titleEn: 'Octopus', glyph: '🐙',
    regions: [
        { id: 'head', label: 'đầu', labelEn: 'head', weight: 5, required: true, shape: E(0, -18, 80, 64) },
        { id: 'belly', label: 'bụng', labelEn: 'belly', weight: 3, shape: E(0, 4, 46, 28) },
        { id: 'tentL', label: 'tua', labelEn: 'tentacle', weight: 3, shape: E(-28, 40, 24, 56) },
        { id: 'tentR', label: 'tua', labelEn: 'tentacle', weight: 3, shape: E(28, 40, 24, 56) },
        { id: 'tentL2', label: 'tua', labelEn: 'tentacle', weight: 2, shape: E(-48, 28, 18, 44) },
        { id: 'tentR2', label: 'tua', labelEn: 'tentacle', weight: 2, shape: E(48, 28, 18, 44) },
        { id: 'spots', label: 'đốm', labelEn: 'spots', weight: 2, shape: C(-16, -20, 8) },
        { id: 'eye', label: 'mắt', labelEn: 'eye', weight: 1, shape: C(10, -22, 7) },
    ],
    patterns: [
        { head: 'pink', belly: 'yellow', tentL: 'pink', tentR: 'pink', tentL2: 'red', tentR2: 'red', spots: 'yellow', eye: 'blue' },
        { head: 'purple', belly: 'pink', tentL: 'blue', tentR: 'blue', tentL2: 'purple', tentR2: 'purple', spots: 'pink', eye: 'yellow' },
        { head: 'orange', belly: 'yellow', tentL: 'red', tentR: 'red', tentL2: 'orange', tentR2: 'orange', spots: 'yellow', eye: 'blue' },
    ],
});

art({
    id: 'whale', theme: 'ocean', title: 'Cá Voi', titleEn: 'Whale', glyph: '🐋',
    regions: [
        { id: 'body', label: 'thân', labelEn: 'body', weight: 5, required: true, shape: E(0, 8, 120, 56) },
        { id: 'belly', label: 'bụng', labelEn: 'belly', weight: 3, shape: E(4, 22, 80, 24) },
        { id: 'spout', label: 'cột nước', labelEn: 'spout', weight: 2, shape: E(-8, -40, 16, 36) },
    ],
    patterns: [
        { body: 'blue', belly: 'yellow', spout: 'blue' },
        { body: 'purple', belly: 'pink', spout: 'blue' },
        { body: 'green', belly: 'yellow', spout: 'blue' },
    ],
});

art({
    id: 'submarine', theme: 'ocean', title: 'Tàu Ngầm', titleEn: 'Submarine', glyph: '🚤',
    regions: [
        { id: 'hull', label: 'thân tàu', labelEn: 'hull', weight: 5, required: true, shape: E(0, 10, 120, 48) },
        { id: 'window', label: 'cửa sổ', labelEn: 'window', weight: 3, shape: C(-16, 8, 12) },
        { id: 'scope', label: 'ống nhòm', labelEn: 'periscope', weight: 2, shape: R(12, -28, 12, 36, 6) },
    ],
    patterns: [
        { hull: 'yellow', window: 'blue', scope: 'red' },
        { hull: 'orange', window: 'green', scope: 'purple' },
        { hull: 'pink', window: 'blue', scope: 'yellow' },
    ],
});

art({
    id: 'castle', theme: 'fairy_tale', title: 'Lâu Đài', titleEn: 'Castle', glyph: '🏰',
    regions: [
        { id: 'walls', label: 'tường', labelEn: 'walls', weight: 5, required: true, shape: R(0, 20, 100, 70, 8) },
        { id: 'towerL', label: 'tháp', labelEn: 'tower', weight: 3, shape: R(-48, -8, 28, 70, 8) },
        { id: 'towerR', label: 'tháp', labelEn: 'tower', weight: 3, shape: R(48, -8, 28, 70, 8) },
        { id: 'roof', label: 'nóc', labelEn: 'roof', weight: 3, shape: E(0, -28, 70, 40) },
        { id: 'door', label: 'cửa', labelEn: 'door', weight: 2, shape: R(0, 36, 24, 36, 10) },
        { id: 'window', label: 'cửa sổ', labelEn: 'window', weight: 2, shape: C(-22, 8, 8) },
        { id: 'flag', label: 'cờ', labelEn: 'flag', weight: 2, shape: E(28, -52, 24, 16) },
    ],
    patterns: [
        { walls: 'pink', towerL: 'pink', towerR: 'pink', roof: 'purple', door: 'orange', window: 'yellow', flag: 'red' },
        { walls: 'yellow', towerL: 'orange', towerR: 'orange', roof: 'blue', door: 'red', window: 'blue', flag: 'green' },
        { walls: 'blue', towerL: 'purple', towerR: 'purple', roof: 'pink', door: 'yellow', window: 'green', flag: 'orange' },
    ],
});

art({
    id: 'unicorn', theme: 'fairy_tale', title: 'Kỳ Lân', titleEn: 'Unicorn', glyph: '🦄',
    regions: [
        { id: 'body', label: 'thân', labelEn: 'body', weight: 5, required: true, shape: E(4, 12, 88, 56) },
        { id: 'mane', label: 'bờm', labelEn: 'mane', weight: 3, shape: E(-20, -28, 36, 40) },
        { id: 'tail', label: 'đuôi', labelEn: 'tail', weight: 3, shape: E(52, 8, 28, 48) },
        { id: 'horn', label: 'sừng', labelEn: 'horn', weight: 2, shape: E(-8, -56, 14, 32) },
        { id: 'hoof', label: 'móng', labelEn: 'hoof', weight: 2, shape: E(-20, 44, 22, 16) },
        { id: 'flower', label: 'hoa', labelEn: 'flower', weight: 1, shape: C(28, -8, 8) },
        { id: 'eye', label: 'mắt', labelEn: 'eye', weight: 1, shape: C(-28, -4, 6) },
    ],
    patterns: [
        { body: 'pink', mane: 'purple', tail: 'purple', horn: 'yellow', hoof: 'orange', flower: 'red', eye: 'blue' },
        { body: 'yellow', mane: 'pink', tail: 'pink', horn: 'orange', hoof: 'orange', flower: 'purple', eye: 'blue' },
        { body: 'blue', mane: 'green', tail: 'green', horn: 'yellow', hoof: 'purple', flower: 'pink', eye: 'yellow' },
    ],
});

art({
    id: 'dragon', theme: 'fairy_tale', title: 'Rồng', titleEn: 'Dragon', glyph: '🐉',
    regions: [
        { id: 'body', label: 'thân', labelEn: 'body', weight: 5, required: true, shape: E(0, 8, 96, 58) },
        { id: 'wing', label: 'cánh', labelEn: 'wing', weight: 3, shape: E(24, -28, 64, 36) },
        { id: 'belly', label: 'bụng', labelEn: 'belly', weight: 2, shape: E(0, 20, 50, 28) },
        { id: 'tail', label: 'đuôi', labelEn: 'tail', weight: 3, shape: E(58, 28, 40, 24) },
        { id: 'horn', label: 'sừng', labelEn: 'horn', weight: 2, shape: E(-28, -28, 16, 28) },
        { id: 'spots', label: 'đốm', labelEn: 'spots', weight: 1, shape: C(-12, 0, 8) },
        { id: 'eye', label: 'mắt', labelEn: 'eye', weight: 1, shape: C(-32, -4, 6) },
    ],
    patterns: [
        { body: 'green', wing: 'yellow', belly: 'orange', tail: 'green', horn: 'red', spots: 'yellow', eye: 'blue' },
        { body: 'red', wing: 'orange', belly: 'yellow', tail: 'red', horn: 'orange', spots: 'yellow', eye: 'blue' },
        { body: 'purple', wing: 'pink', belly: 'blue', tail: 'purple', horn: 'yellow', spots: 'pink', eye: 'yellow' },
    ],
});

art({
    id: 'wand', theme: 'fairy_tale', title: 'Đũa Thần', titleEn: 'Magic Wand', glyph: '🪄',
    regions: [
        { id: 'star', label: 'sao', labelEn: 'star', weight: 5, required: true, shape: C(0, -36, 22) },
        { id: 'shaft', label: 'cán', labelEn: 'shaft', weight: 3, shape: R(0, 24, 14, 80, 7) },
    ],
    patterns: [
        { star: 'yellow', shaft: 'purple' },
        { star: 'pink', shaft: 'blue' },
        { star: 'orange', shaft: 'green' },
    ],
});

art({
    id: 'princess', theme: 'fairy_tale', title: 'Công Chúa', titleEn: 'Princess', glyph: '👸',
    regions: [
        { id: 'dress', label: 'váy', labelEn: 'dress', weight: 5, required: true, shape: E(0, 28, 80, 80) },
        { id: 'sash', label: 'nơ', labelEn: 'sash', weight: 2, shape: E(0, 8, 70, 16) },
        { id: 'hair', label: 'tóc', labelEn: 'hair', weight: 3, shape: E(0, -36, 56, 40) },
        { id: 'crown', label: 'vương miện', labelEn: 'crown', weight: 2, shape: E(0, -58, 36, 18) },
        { id: 'sleeveL', label: 'tay', labelEn: 'sleeve', weight: 2, shape: E(-40, 8, 24, 28) },
        { id: 'sleeveR', label: 'tay', labelEn: 'sleeve', weight: 2, shape: E(40, 8, 24, 28) },
        { id: 'shoe', label: 'giày', labelEn: 'shoe', weight: 1, shape: E(-12, 64, 22, 12) },
    ],
    patterns: [
        { dress: 'pink', sash: 'purple', hair: 'yellow', crown: 'yellow', sleeveL: 'pink', sleeveR: 'pink', shoe: 'red' },
        { dress: 'purple', sash: 'pink', hair: 'orange', crown: 'yellow', sleeveL: 'purple', sleeveR: 'purple', shoe: 'blue' },
        { dress: 'blue', sash: 'yellow', hair: 'pink', crown: 'yellow', sleeveL: 'blue', sleeveR: 'blue', shoe: 'orange' },
    ],
});

art({
    id: 'rocket', theme: 'space', title: 'Tên Lửa', titleEn: 'Rocket', glyph: '🚀',
    regions: [
        { id: 'nose', label: 'mũi', labelEn: 'nose', weight: 3, shape: E(0, -58, 28, 28) },
        { id: 'body', label: 'thân', labelEn: 'body', weight: 5, required: true, shape: E(0, -8, 44, 100) },
        { id: 'stripe', label: 'sọc', labelEn: 'stripe', weight: 2, shape: R(0, 8, 44, 16, 6) },
        { id: 'window', label: 'cửa sổ', labelEn: 'window', weight: 2, shape: C(0, -24, 12) },
        { id: 'finL', label: 'cánh', labelEn: 'fin', weight: 3, shape: E(-28, 28, 28, 24) },
        { id: 'fin', label: 'cánh', labelEn: 'fin', weight: 3, shape: E(28, 28, 28, 24) },
        { id: 'flame', label: 'lửa', labelEn: 'flame', weight: 2, shape: E(0, 58, 24, 28) },
    ],
    patterns: [
        { nose: 'yellow', body: 'red', stripe: 'yellow', window: 'blue', finL: 'yellow', fin: 'yellow', flame: 'orange' },
        { nose: 'red', body: 'blue', stripe: 'red', window: 'yellow', finL: 'red', fin: 'red', flame: 'orange' },
        { nose: 'pink', body: 'purple', stripe: 'pink', window: 'green', finL: 'pink', fin: 'pink', flame: 'yellow' },
    ],
});

art({
    id: 'planet', theme: 'space', title: 'Hành Tinh', titleEn: 'Planet', glyph: '🪐',
    regions: [
        { id: 'globe', label: 'cầu', labelEn: 'globe', weight: 5, required: true, shape: C(0, 0, 44) },
        { id: 'ring', label: 'vành', labelEn: 'ring', weight: 3, shape: E(0, 8, 120, 24) },
        { id: 'spot', label: 'đốm', labelEn: 'spot', weight: 2, shape: C(-12, -8, 10) },
        { id: 'spot2', label: 'đốm', labelEn: 'spot', weight: 2, shape: C(14, 10, 8) },
        { id: 'cap', label: 'cực', labelEn: 'cap', weight: 2, shape: E(0, -28, 32, 16) },
        { id: 'band', label: 'vành đai', labelEn: 'band', weight: 2, shape: E(0, 4, 80, 12) },
        { id: 'moonlet', label: 'mặt trăng nhỏ', labelEn: 'moon', weight: 1, shape: C(52, -28, 10) },
    ],
    patterns: [
        { globe: 'orange', ring: 'yellow', spot: 'red', spot2: 'pink', cap: 'yellow', band: 'red', moonlet: 'blue' },
        { globe: 'blue', ring: 'purple', spot: 'green', spot2: 'yellow', cap: 'purple', band: 'green', moonlet: 'pink' },
        { globe: 'pink', ring: 'yellow', spot: 'purple', spot2: 'orange', cap: 'yellow', band: 'purple', moonlet: 'blue' },
    ],
});

art({
    id: 'moon', theme: 'space', title: 'Mặt Trăng', titleEn: 'Moon', glyph: '🌙',
    regions: [
        { id: 'disc', label: 'mặt', labelEn: 'disc', weight: 5, required: true, shape: C(0, 0, 48) },
        { id: 'crater', label: 'hố', labelEn: 'crater', weight: 3, shape: C(-12, -8, 12) },
    ],
    patterns: [
        { disc: 'yellow', crater: 'orange' },
        { disc: 'yellow', crater: 'purple' },
        { disc: 'blue', crater: 'pink' },
    ],
});

art({
    id: 'astronaut', theme: 'space', title: 'Phi Hành Gia', titleEn: 'Astronaut', glyph: '🧑‍🚀',
    regions: [
        { id: 'suit', label: 'áo', labelEn: 'suit', weight: 5, required: true, shape: E(0, 20, 70, 80) },
        { id: 'visor', label: 'mũ', labelEn: 'visor', weight: 3, shape: C(0, -36, 24) },
        { id: 'ring', label: 'viền mũ', labelEn: 'helmet', weight: 4, shape: C(0, -36, 30) },
        { id: 'pack', label: 'ba lô', labelEn: 'pack', weight: 2, shape: R(36, 16, 22, 36, 8) },
        { id: 'badge', label: 'huy hiệu', labelEn: 'badge', weight: 1, shape: C(-16, 8, 8) },
        { id: 'boot', label: 'giày', labelEn: 'boot', weight: 2, shape: E(-12, 62, 24, 14) },
        { id: 'arm', label: 'tay', labelEn: 'arm', weight: 2, shape: E(-40, 16, 22, 28) },
    ],
    patterns: [
        { suit: 'yellow', visor: 'blue', ring: 'orange', pack: 'orange', badge: 'red', boot: 'orange', arm: 'yellow' },
        { suit: 'pink', visor: 'purple', ring: 'blue', pack: 'blue', badge: 'yellow', boot: 'purple', arm: 'pink' },
        { suit: 'green', visor: 'yellow', ring: 'red', pack: 'red', badge: 'blue', boot: 'orange', arm: 'green' },
    ],
});

art({
    id: 'alien', theme: 'space', title: 'Người Ngoài Hành Tinh', titleEn: 'Alien', glyph: '👽',
    regions: [
        { id: 'head', label: 'đầu', labelEn: 'head', weight: 5, required: true, shape: E(0, -20, 70, 56) },
        { id: 'body', label: 'thân', labelEn: 'body', weight: 3, shape: E(0, 36, 48, 52) },
        { id: 'antenna', label: 'râu', labelEn: 'antenna', weight: 2, shape: C(-16, -52, 8) },
    ],
    patterns: [
        { head: 'green', body: 'green', antenna: 'yellow' },
        { head: 'purple', body: 'blue', antenna: 'pink' },
        { head: 'green', body: 'orange', antenna: 'red' },
    ],
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ColorMagicPuzzle };
}
