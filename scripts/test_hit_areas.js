/**
 * test_hit_areas.js — UISystem.enableHit must match the visual control.
 * Phaser adds displayOrigin before Contains(); geometry must live in that space.
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
Phaser.Geom.Rectangle.Contains = (rect, x, y) => (
    x >= rect.x && x <= rect.x + rect.width && y >= rect.y && y <= rect.y + rect.height
);
Phaser.Geom.Circle.Contains = (c, x, y) => {
    const dx = x - c.x;
    const dy = y - c.y;
    return dx * dx + dy * dy <= c.radius * c.radius;
};
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
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        displayOriginX: 0,
        displayOriginY: 0,
        input: null,
        removeInteractive() { this.input = null; },
        setSize(w, h) {
            this.width = w;
            this.height = h;
            this.displayOriginX = w / 2;
            this.displayOriginY = h / 2;
        },
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

/** Phaser.Input.InputManager.pointWithinHitArea */
function phaserHits(obj, worldX, worldY) {
    const lx = worldX - obj.x + (Number(obj.displayOriginX) || 0);
    const ly = worldY - obj.y + (Number(obj.displayOriginY) || 0);
    return obj._contains(obj._area, lx, ly, obj);
}

// Rect: visual 96×96 at (200, 300) — every corner + center must hit
{
    const o = mockObj();
    o.x = 200;
    o.y = 300;
    enableHit(o, 96, 96);
    assert(o.input.customHitArea === true, 'customHitArea must be set');
    assert(o._area.width === 96 && o._area.height === 96, 'rect size equals visual');
    assert(o._area.x === 0 && o._area.y === 0, 'rect sits at displayOrigin so Phaser Contains matches');
    assert(phaserHits(o, 200, 300), 'center');
    assert(phaserHits(o, 200 - 47, 300 - 47), 'top-left of visual');
    assert(phaserHits(o, 200 + 47, 300 + 47), 'bottom-right of visual');
    assert(phaserHits(o, 200 + 47, 300), 'right edge');
    assert(phaserHits(o, 200, 300 + 47), 'bottom edge');
    assert(!phaserHits(o, 200 + 49, 300), 'just outside right');
    assert(!phaserHits(o, 200, 300 + 49), 'just outside bottom');
}

// Circle for icons / swatches
{
    const o = mockObj();
    o.x = 100;
    o.y = 80;
    enableHit(o, 48, 48, { circle: true });
    assert(o._area.radius === 24, 'circle radius = diameter/2');
    assert(o._area.x === 24 && o._area.y === 24, 'circle center at displayOrigin');
    assert(phaserHits(o, 100, 80), 'circle center');
    assert(phaserHits(o, 100 + 16, 80), 'inside radius');
    assert(!phaserHits(o, 100 + 25, 80), 'outside radius');
}

// Ellipse for oval coloring regions
{
    const o = mockObj();
    enableHit(o, 80, 40, { ellipse: true });
    assert(o._area.width === 80 && o._area.height === 40, 'ellipse size');
    assert(o._area.x === 40 && o._area.y === 20, 'ellipse center at displayOrigin');
}

// Pad expands, capped at 8
{
    const o = mockObj();
    enableHit(o, 40, 40, { pad: 20 });
    assert(o._area.width === 56, 'pad capped at 8 → 40+16');
}

// Neighbor overlap: answer buttons size=96 gap=22
{
    const size = 96;
    const gap = 22;
    const a = mockObj();
    const b = mockObj();
    a.x = 100;
    a.y = 200;
    b.x = a.x + size + gap;
    b.y = 200;
    enableHit(a, size, size);
    enableHit(b, size, size);
    assert(phaserHits(b, b.x, b.y), 'center of B hits B');
    assert(!phaserHits(a, b.x, b.y), 'center of B must not hit A');
    assert(phaserHits(a, a.x + 47, a.y), 'A right edge still belongs to A');
    assert(!phaserHits(a, a.x + 49, a.y), 'gap between A and B is empty');
}

// draggable: register with Phaser InputPlugin._draggable via setDraggable
{
    const o = mockObj();
    let registered = null;
    o.scene = { input: { setDraggable(obj) { registered = obj; obj.input.draggable = true; } } };
    enableHit(o, 80, 80, { circle: true, draggable: true });
    assert(registered === o, 'setDraggable must be called when scene.input exists');
    assert(o.input.draggable === true, 'input.draggable after setDraggable');
}
{
    const o = mockObj();
    enableHit(o, 80, 80, { draggable: true });
    assert(o.input.draggable === true, 'input.draggable when no scene');
}

// Wrappers still exist
assert(typeof UISystem.enableHit === 'function', 'UISystem.enableHit');
assert(typeof UISystem.setCenteredInput === 'function', 'setCenteredInput wrapper');
assert(typeof UISystem.setOriginCenteredInput === 'function', 'setOriginCenteredInput wrapper');

console.log('PASS hit areas');
