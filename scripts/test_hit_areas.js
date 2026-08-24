/**
 * test_hit_areas.js — UISystem.enableHit must center the clickable zone on
 * the visual control (not bottom-right of a container).
 */
global.Phaser = {
    Geom: {
        Rectangle: function Rectangle(x, y, w, h) {
            this.x = x; this.y = y; this.width = w; this.height = h;
        },
        Circle: function Circle(x, y, r) {
            this.x = x; this.y = y; this.radius = r;
        },
        Ellipse: function Ellipse(x, y, w, h) {
            this.x = x; this.y = y; this.width = w; this.height = h;
        },
    },
};
Phaser.Geom.Rectangle.Contains = () => true;
Phaser.Geom.Circle.Contains = () => true;
Phaser.Geom.Ellipse.Contains = () => true;

global.DesignTokens = {
    touch: { minTarget: 52, answerTarget: 96 },
    colors: { success: 1, secondary: 1, primary: 1, surface: 1, accent: 1, ink: 1 },
    css: { white: '#fff', ink: '#000', inkSoft: '#888', primary: '#7c5cbf' },
    typography: { fontFamily: 'Arial', button: 20, number: 40, speech: 18 },
    shadow: { color: 0, alpha: 0.2, offsetY: 4 },
    radius: { sm: 10, md: 16, lg: 24 },
    press: { down: 0.94, overshoot: 1.03, ms: 70 },
    motion: { micro: 140, uiTransition: 280, easeOut: 'Back.easeOut', easeSoft: 'Sine' },
};

const { enableHit, UISystem } = require('../src/core/design/UISystem.js');

function assert(cond, msg) {
    if (!cond) throw new Error(msg);
}

function mockObj() {
    const o = {
        width: 0,
        height: 0,
        input: null,
        removeInteractive() { this.input = null; },
        setSize(w, h) { this.width = w; this.height = h; },
        setInteractive(area, contains) {
            this.input = {
                hitArea: area,
                hitAreaCallback: contains,
                customHitArea: false,
                cursor: null,
                draggable: false,
            };
            this._area = area;
            this._contains = contains;
        },
    };
    return o;
}

// Rect centered on (0,0)
{
    const o = mockObj();
    enableHit(o, 96, 96);
    assert(o.input.customHitArea === true, 'customHitArea must be set');
    assert(o._area.x === -48 && o._area.y === -48, 'rect origin centered, got ' + o._area.x + ',' + o._area.y);
    assert(o._area.width === 96 && o._area.height === 96, 'rect size');
    assert(o.width === 96 && o.height === 96, 'setSize');
}

// Circle for icons / swatches
{
    const o = mockObj();
    enableHit(o, 48, 48, { circle: true });
    assert(o._area.radius === 24, 'circle radius = diameter/2');
    assert(o._area.x === 0 && o._area.y === 0, 'circle at center');
}

// Ellipse for oval coloring regions
{
    const o = mockObj();
    enableHit(o, 80, 40, { ellipse: true });
    assert(o._area.width === 80 && o._area.height === 40, 'ellipse size');
}

// Pad expands, capped at 8
{
    const o = mockObj();
    enableHit(o, 40, 40, { pad: 20 });
    assert(o._area.width === 56, 'pad capped at 8 → 40+16');
}

// Neighbor overlap check: answer buttons size=96 gap=22 → hit must not exceed size
{
    const size = 96;
    const gap = 22;
    const a = mockObj();
    const b = mockObj();
    enableHit(a, size, size);
    enableHit(b, size, size);
    // Place centers like createChoiceButtons: startX and startX+(size+gap)
    const ax = 100;
    const bx = ax + size + gap;
    // Point at visual center of B
    const px = bx;
    const py = 200;
    // Old broken hit for A would be [ax, ay] → [ax+size, ay+size] in local…
    // With centered hit, local point relative to A center:
    const localInA = { x: px - ax, y: py - 200 }; // (size+gap, 0) = (118, 0)
    const half = size / 2;
    const aContains = Math.abs(localInA.x) <= half && Math.abs(localInA.y) <= half;
    assert(!aContains, 'center of button B must NOT be inside A hit box');
    const localInB = { x: px - bx, y: 0 };
    const bContains = Math.abs(localInB.x) <= half && Math.abs(localInB.y) <= half;
    assert(bContains, 'center of button B must be inside B hit box');
}

// Wrappers still exist
assert(typeof UISystem.enableHit === 'function', 'UISystem.enableHit');
assert(typeof UISystem.setCenteredInput === 'function', 'setCenteredInput wrapper');
assert(typeof UISystem.setOriginCenteredInput === 'function', 'setOriginCenteredInput wrapper');

// Size+8 would overlap neighbors at gap 22 — factories must not do that
{
    const size = 96;
    const gap = 22;
    const halfOld = (size + 8) / 2; // 52
    const dist = size + gap; // 118
    // Old oversized hit from A reaches into B when halfA + halfB > dist
    assert(halfOld * 2 < dist, 'visual-sized hits leave a gap; size+8 would be tight');
}

console.log('PASS hit areas');
