/**
 * IconSystem — one drawn icon language for every screen.
 * Filled, rounded, same optical weight. Never mix random emoji libraries
 * for navigation / HUD actions. Crisp at any DPI (vector Graphics).
 */
const IconSystem = {
    /** Draw a named icon centered at (0,0) into a Phaser Graphics. */
    draw(g, name, size, color = 0xffffff) {
        const s = size;
        g.fillStyle(color, 1);
        g.lineStyle(Math.max(2, s * 0.12), color, 1);
        switch (name) {
            case 'back':
                g.fillTriangle(-s * 0.28, 0, s * 0.22, -s * 0.34, s * 0.22, s * 0.34);
                break;
            case 'home':
                g.fillTriangle(0, -s * 0.38, -s * 0.36, -s * 0.02, s * 0.36, -s * 0.02);
                g.fillRoundedRect(-s * 0.26, -s * 0.06, s * 0.52, s * 0.4, 3);
                g.fillStyle(color, 1);
                g.fillRect(-s * 0.08, s * 0.08, s * 0.16, s * 0.26);
                break;
            case 'pause':
                g.fillRoundedRect(-s * 0.22, -s * 0.28, s * 0.16, s * 0.56, 3);
                g.fillRoundedRect(s * 0.06, -s * 0.28, s * 0.16, s * 0.56, 3);
                break;
            case 'play':
                g.fillTriangle(-s * 0.18, -s * 0.3, -s * 0.18, s * 0.3, s * 0.32, 0);
                break;
            case 'hint':
                g.fillCircle(0, -s * 0.04, s * 0.28);
                g.fillStyle(0x4a3728, 1);
                g.fillRoundedRect(-s * 0.05, -s * 0.18, s * 0.1, s * 0.2, 2);
                g.fillCircle(0, s * 0.12, s * 0.055);
                break;
            case 'settings':
                g.fillRoundedRect(-s * 0.28, -s * 0.22, s * 0.16, s * 0.44, 3);
                g.fillRoundedRect(-s * 0.06, -s * 0.22, s * 0.16, s * 0.44, 3);
                g.fillRoundedRect(s * 0.16, -s * 0.22, s * 0.16, s * 0.44, 3);
                g.fillCircle(-s * 0.2, -s * 0.08, s * 0.09);
                g.fillCircle(0.02 * s, s * 0.08, s * 0.09);
                g.fillCircle(s * 0.24, -s * 0.1, s * 0.09);
                break;
            case 'close':
                g.lineStyle(Math.max(3, s * 0.14), color, 1);
                g.beginPath();
                g.moveTo(-s * 0.22, -s * 0.22);
                g.lineTo(s * 0.22, s * 0.22);
                g.moveTo(s * 0.22, -s * 0.22);
                g.lineTo(-s * 0.22, s * 0.22);
                g.strokePath();
                break;
            case 'album':
                g.fillRoundedRect(-s * 0.28, -s * 0.24, s * 0.56, s * 0.48, 5);
                g.fillStyle(0xffffff, 0.35);
                g.fillRoundedRect(-s * 0.16, -s * 0.12, s * 0.32, s * 0.12, 3);
                break;
            case 'map':
                g.fillTriangle(-s * 0.02, s * 0.34, -s * 0.22, -s * 0.08, s * 0.18, -s * 0.08);
                g.fillCircle(0, -s * 0.14, s * 0.2);
                break;
            case 'reset':
                g.lineStyle(Math.max(3, s * 0.14), color, 1);
                g.beginPath();
                g.arc(0, 0, s * 0.28, Phaser.Math.DegToRad(40), Phaser.Math.DegToRad(300));
                g.strokePath();
                g.fillStyle(color, 1);
                g.fillTriangle(s * 0.22, -s * 0.22, s * 0.38, -s * 0.04, s * 0.08, -s * 0.02);
                break;
            case 'sound':
                g.fillTriangle(-s * 0.22, 0, -s * 0.02, -s * 0.2, -s * 0.02, s * 0.2);
                g.fillRect(-s * 0.22, -s * 0.1, s * 0.16, s * 0.2);
                g.lineStyle(Math.max(2, s * 0.08), color, 1);
                g.strokeCircle(s * 0.06, 0, s * 0.14);
                break;
            default:
                g.fillCircle(0, 0, s * 0.18);
        }
        return g;
    },

    /** Graphics object already positioned at (0,0) inside a button. */
    make(scene, name, size, color) {
        const g = scene.add.graphics();
        this.draw(g, name, size, color);
        return g;
    },
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { IconSystem };
}
