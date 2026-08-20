/**
 * SquirrelCharacter — Sóc con (Khu Rừng Định Hướng).
 * Vector vẽ tay nhiều lớp: đuôi xoăn bông, má hồng, mắt to long lanh.
 * Quay hướng bằng cách đổi view (trái/phải = nghiêng, trước = quay lưng, sau = quay mặt)
 * thay vì xoay cả thân như kim đồng hồ.
 */
class SquirrelCharacter {
    /**
     * @param {Phaser.Scene} scene
     */
    constructor(scene) {
        this.scene = scene;
        /** @type {Phaser.GameObjects.Container | null} */
        this.container = null;
        /** @type {Record<string, Phaser.GameObjects.Container>} */
        this.views = null;
        /** @type {'left' | 'right' | 'forward' | 'back' | string} */
        this.facing = 'forward';
        this._idleTween = null;
    }

    // Bảng màu lông sóc
    static get COLORS() {
        return {
            fur: 0xC96F2E,       // nâu cam chính
            furDark: 0x9C4F1C,   // viền/đậm
            furLight: 0xE39A55,  // sáng
            cream: 0xF7E3C0,     // bụng/má
            blush: 0xF2A0A8,     // má hồng
            dark: 0x3A2410,      // mắt/mũi
            white: 0xFFFFFF,
        };
    }

    /**
     * @param {{ width: number, height: number, usesArtBackground?: boolean, depth?: number }} layout
     * @returns {Phaser.GameObjects.Container}
     */
    create(layout) {
        const { width, height, usesArtBackground = false, depth = 26 } = layout;
        const sx = usesArtBackground ? width * 0.16 : width * 0.22;
        const sy = usesArtBackground ? height * 0.68 : height * 0.64;

        const sq = this.scene.add.container(sx, sy);
        sq.setDepth(depth);

        this.views = {
            side: SquirrelCharacter.buildSideView(this.scene),
            front: SquirrelCharacter.buildFrontView(this.scene),
            back: SquirrelCharacter.buildBackView(this.scene),
        };
        sq.add([this.views.back, this.views.front, this.views.side]);

        this.container = sq;
        this.facing = 'forward';
        this.applyFacing(false);
        this.startIdleMotion();
        return sq;
    }

    /** View hiển thị theo hướng: left/right = nghiêng, forward = quay lưng, back = quay mặt */
    applyFacing(animate = true) {
        if (!this.container || !this.views) return;
        const f = this.facing;
        this.views.side.setVisible(f === 'left' || f === 'right');
        this.views.front.setVisible(f === 'back');
        this.views.back.setVisible(f === 'forward');
        // View nghiêng mặc định quay phải; trái thì lật ngang
        this.views.side.setScale(f === 'left' ? -1 : 1, 1);

        if (animate) {
            // Nén nhẹ rồi bung — cảm giác sóc nhảy xoay người
            this.scene.tweens.add({
                targets: this.container,
                scaleY: 0.82,
                scaleX: 1.12,
                duration: 110,
                yoyo: true,
                ease: 'Quad.easeOut',
            });
        }
    }

    // ════════════════════════════════════════
    //  Vẽ 3 góc nhìn
    // ════════════════════════════════════════

    /** Nhìn nghiêng (mặc định quay sang phải) */
    static buildSideView(scene) {
        const C = SquirrelCharacter.COLORS;
        const v = scene.add.container(0, 0);

        const g = scene.add.graphics();

        // ── Đuôi bông xoăn vểnh cao phía sau (bên trái)
        g.fillStyle(C.furDark, 1);
        g.fillCircle(-22, -34, 13);   // chóp đuôi
        g.fillCircle(-32, -16, 14);   // lưng đuôi
        g.fillCircle(-30, 4, 11);     // giữa đuôi
        g.fillCircle(-20, 14, 8);     // gốc đuôi
        g.fillStyle(C.fur, 1);
        g.fillCircle(-21, -33, 10);
        g.fillCircle(-30, -16, 11);
        g.fillCircle(-28, 4, 8.5);
        g.fillCircle(-19, 13, 6);
        g.fillStyle(C.furLight, 1);
        g.fillCircle(-19, -31, 5);    // vệt sáng
        g.fillCircle(-28, -16, 5);
        g.fillCircle(-26, 2, 3.5);

        // ── Chân sau (đùi tròn + bàn chân)
        g.fillStyle(C.furDark, 1);
        g.fillEllipse(-4, 12, 20, 18);
        g.fillStyle(C.fur, 1);
        g.fillEllipse(-3, 11, 16, 14);
        g.fillStyle(C.furDark, 1);
        g.fillEllipse(4, 22, 13, 6);
        g.fillStyle(C.fur, 1);
        g.fillEllipse(5, 21, 10, 5);

        // ── Thân ngồi
        g.fillStyle(C.fur, 1);
        g.fillEllipse(2, 4, 28, 28);
        // bụng kem
        g.fillStyle(C.cream, 1);
        g.fillEllipse(9, 8, 13, 16);

        // ── Tay trước ôm hạt dẻ trước ngực
        g.fillStyle(C.fur, 1);
        g.fillEllipse(14, 6, 7, 9);
        // hạt dẻ
        g.fillStyle(0x8B5A2B, 1);
        g.fillEllipse(18.5, 8, 6.5, 7.5);
        g.fillStyle(0x6B3E12, 1);
        g.fillEllipse(18.5, 5, 7.5, 3.8);   // nón hạt
        g.fillCircle(18.5, 2, 1.1);         // cuống

        // ── Đầu (tách rõ khỏi thân)
        g.fillStyle(C.fur, 1);
        g.fillCircle(15, -15, 12);
        // má kem
        g.fillStyle(C.cream, 1);
        g.fillEllipse(22, -10, 10, 7.5);
        // má hồng
        g.fillStyle(C.blush, 0.75);
        g.fillEllipse(21, -7, 4.5, 2.8);
        // mũi
        g.fillStyle(C.dark, 1);
        g.fillCircle(27, -12, 2.2);
        // mắt to long lanh
        g.fillStyle(C.white, 1);
        g.fillCircle(16, -17, 4.4);
        g.fillStyle(C.dark, 1);
        g.fillCircle(17.2, -17, 2.5);
        g.fillStyle(C.white, 1);
        g.fillCircle(18.2, -18.2, 1.1);
        // lông mày
        g.lineStyle(1.6, C.furDark, 0.9);
        g.beginPath();
        g.moveTo(12, -23);
        g.lineTo(19, -24);
        g.strokePath();

        // ── Tai có chùm lông
        g.fillStyle(C.furDark, 1);
        g.fillTriangle(8, -24, 10, -36, 16, -25);
        g.fillStyle(C.fur, 1);
        g.fillTriangle(9, -25, 10.5, -33, 15, -25.5);
        g.fillStyle(C.cream, 0.9);
        g.fillTriangle(10, -26, 11, -31, 14, -26.5);
        g.fillStyle(C.furDark, 1);
        g.fillCircle(10, -35.5, 2.2);  // chùm lông chóp tai

        v.add(g);
        return v;
    }

    /** Quay mặt về phía người xem */
    static buildFrontView(scene) {
        const C = SquirrelCharacter.COLORS;
        const v = scene.add.container(0, 0);
        const g = scene.add.graphics();

        // ── Đuôi bông vểnh sau lưng (nhô lên trên đầu)
        g.fillStyle(C.furDark, 1);
        g.fillCircle(0, -34, 14);
        g.fillCircle(-14, -24, 12);
        g.fillCircle(14, -24, 12);
        g.fillStyle(C.fur, 1);
        g.fillCircle(0, -33, 11);
        g.fillCircle(-13, -23, 9.5);
        g.fillCircle(13, -23, 9.5);
        g.fillStyle(C.furLight, 1);
        g.fillCircle(0, -31, 5.5);

        // ── Chân
        g.fillStyle(C.furDark, 1);
        g.fillEllipse(-10, 21, 11, 7);
        g.fillEllipse(10, 21, 11, 7);
        g.fillStyle(C.fur, 1);
        g.fillEllipse(-10, 20, 9, 6);
        g.fillEllipse(10, 20, 9, 6);

        // ── Thân + bụng
        g.fillStyle(C.fur, 1);
        g.fillEllipse(0, 8, 30, 28);
        g.fillStyle(C.cream, 1);
        g.fillEllipse(0, 11, 19, 18);

        // ── Tay nhỏ hai bên bụng
        g.fillStyle(C.fur, 1);
        g.fillEllipse(-11, 6, 7, 11);
        g.fillEllipse(11, 6, 7, 11);

        // ── Đầu
        g.fillStyle(C.fur, 1);
        g.fillCircle(0, -10, 14);
        // tai + chùm lông
        [-1, 1].forEach((s) => {
            g.fillStyle(C.furDark, 1);
            g.fillTriangle(s * 7, -20, s * 10, -33, s * 15, -21);
            g.fillStyle(C.fur, 1);
            g.fillTriangle(s * 8, -21, s * 10.5, -30, s * 14, -21.5);
            g.fillStyle(C.cream, 0.9);
            g.fillTriangle(s * 9, -22, s * 10.5, -28, s * 13, -22.5);
            g.fillStyle(C.furDark, 1);
            g.fillCircle(s * 10, -32.5, 2.2);
        });
        // má kem
        g.fillStyle(C.cream, 1);
        g.fillEllipse(-6, -4, 9, 7);
        g.fillEllipse(6, -4, 9, 7);
        // má hồng
        g.fillStyle(C.blush, 0.75);
        g.fillEllipse(-9, -2, 4.5, 2.8);
        g.fillEllipse(9, -2, 4.5, 2.8);
        // mắt to long lanh
        [-1, 1].forEach((s) => {
            g.fillStyle(C.white, 1);
            g.fillCircle(s * 6, -12, 4.8);
            g.fillStyle(C.dark, 1);
            g.fillCircle(s * 6, -12, 2.7);
            g.fillStyle(C.white, 1);
            g.fillCircle(s * 6 + 1.1, -13.2, 1.2);
        });
        // mũi + miệng
        g.fillStyle(C.dark, 1);
        g.fillTriangle(-2, -6.5, 2, -6.5, 0, -4);
        g.lineStyle(1.6, C.dark, 0.9);
        g.beginPath();
        g.moveTo(0, -4);
        g.lineTo(0, -2.4);
        g.moveTo(0, -2.4);
        g.lineTo(-2.4, -1);
        g.moveTo(0, -2.4);
        g.lineTo(2.4, -1);
        g.strokePath();
        // răng thỏ/sóc
        g.fillStyle(C.white, 1);
        g.fillRect(-1.6, -2.2, 3.2, 3.2);
        g.lineStyle(0.8, C.dark, 0.6);
        g.lineBetween(0, -2.2, 0, 1);

        v.add(g);
        return v;
    }

    /** Quay lưng lại (đi về phía trước) */
    static buildBackView(scene) {
        const C = SquirrelCharacter.COLORS;
        const v = scene.add.container(0, 0);
        const g = scene.add.graphics();

        // ── Đuôi bông lớn ở giữa (đặc trưng sóc quay lưng)
        g.fillStyle(C.furDark, 1);
        g.fillCircle(0, -30, 15);
        g.fillCircle(-12, -16, 13);
        g.fillCircle(12, -16, 13);
        g.fillCircle(0, -6, 12);
        g.fillStyle(C.fur, 1);
        g.fillCircle(0, -29, 12);
        g.fillCircle(-11, -15, 10.5);
        g.fillCircle(11, -15, 10.5);
        g.fillCircle(0, -6, 9.5);
        g.fillStyle(C.furLight, 1);
        g.fillCircle(0, -27, 6);
        g.fillCircle(-8, -14, 4.5);
        g.fillCircle(8, -14, 4.5);

        // ── Chân
        g.fillStyle(C.furDark, 1);
        g.fillEllipse(-10, 21, 11, 7);
        g.fillEllipse(10, 21, 11, 7);
        g.fillStyle(C.fur, 1);
        g.fillEllipse(-10, 20, 9, 6);
        g.fillEllipse(10, 20, 9, 6);

        // ── Thân (lưng)
        g.fillStyle(C.fur, 1);
        g.fillEllipse(0, 9, 30, 28);
        // vệt lưng sáng
        g.fillStyle(C.furLight, 0.8);
        g.fillEllipse(0, 8, 14, 18);

        // ── Gáy + tai (không thấy mặt)
        g.fillStyle(C.fur, 1);
        g.fillCircle(0, -8, 13);
        [-1, 1].forEach((s) => {
            g.fillStyle(C.furDark, 1);
            g.fillTriangle(s * 7, -18, s * 10, -30, s * 14, -19);
            g.fillStyle(C.fur, 1);
            g.fillTriangle(s * 8, -19, s * 10.5, -27, s * 13, -19.5);
            g.fillStyle(C.furDark, 1);
            g.fillCircle(s * 10, -29.5, 2);
        });

        v.add(g);
        return v;
    }

    // ════════════════════════════════════════
    //  Chuyển động
    // ════════════════════════════════════════

    startIdleMotion() {
        if (!this.container) return;
        if (this._idleTween) this._idleTween.stop();
        this._idleTween = this.scene.tweens.add({
            targets: this.container,
            y: this.container.y - 2,
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    /**
     * @param {'left' | 'right' | 'forward' | 'back' | string} directionId
     */
    turnTo(directionId) {
        this.facing = directionId;
        if (!this.container) return;
        this.applyFacing(true);
    }

    /**
     * Rùng mình khi đoán sai (lắc nhẹ trái/phải, giữ nguyên hướng).
     */
    turnWrong() {
        if (!this.container) return;
        const ox = this.container.x;
        this.scene.tweens.add({
            targets: this.container,
            x: ox - 7,
            duration: 70,
            yoyo: true,
            repeat: 3,
            ease: 'Sine.easeInOut',
            onComplete: () => {
                if (this.container) this.container.x = ox;
            }
        });
    }

    hopJoy() {
        if (!this.container) return;
        this.scene.tweens.killTweensOf(this.container);
        const oy = this.container.y;
        this.scene.tweens.add({
            targets: this.container,
            y: oy - 18,
            scaleY: 1.08,
            scaleX: 0.94,
            duration: 180,
            yoyo: true,
            repeat: 3,
            ease: 'Sine.easeInOut',
            onComplete: () => {
                if (this.container) {
                    this.container.y = oy;
                    this.container.setScale(1);
                }
                this.startIdleMotion();
            }
        });
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SquirrelCharacter };
}
