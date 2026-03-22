/**
 * SquirrelCharacter — Sóc con (Khu Rừng Định Hướng). Vector Graphics + idle / turn / hopJoy.
 */
class SquirrelCharacter {
    /**
     * @param {Phaser.Scene} scene
     */
    constructor(scene) {
        this.scene = scene;
        /** @type {Phaser.GameObjects.Container | null} */
        this.container = null;
        /** @type {'left' | 'right' | 'forward' | 'back' | string} */
        this.facing = 'forward';
    }

    /**
     * Góc nhìn (độ): phía trước = lên màn hình.
     */
    static angleForDirection(id) {
        switch (id) {
            case 'left': return -180;
            case 'right': return 0;
            case 'forward': return -90;
            case 'back': return 90;
            default: return -90;
        }
    }

    /**
     * @param {{ width: number, height: number, usesArtBackground?: boolean, depth?: number }} layout
     * @returns {Phaser.GameObjects.Container}
     */
    create(layout) {
        const { width, height, usesArtBackground = false, depth = 26 } = layout;
        const sx = usesArtBackground ? width * 0.16 : width * 0.22;
        const sy = usesArtBackground ? height * 0.68 : height * 0.64;
        this.container = SquirrelCharacter.buildContainer(this.scene, sx, sy, { depth });
        this.facing = 'forward';
        this.container.setAngle(SquirrelCharacter.angleForDirection('forward'));
        this.startIdleMotion();
        return this.container;
    }

    /**
     * @param {Phaser.Scene} scene
     * @param {number} x
     * @param {number} y
     * @param {{ depth?: number }} [opts]
     * @returns {Phaser.GameObjects.Container}
     */
    static buildContainer(scene, x, y, opts = {}) {
        const depth = opts.depth ?? 26;
        const sq = scene.add.container(x, y);
        const tail = scene.add.graphics();
        tail.fillStyle(0x8b5a2b, 1);
        tail.fillEllipse(-22, 10, 26, 16);
        tail.fillStyle(0xa0522d, 0.9);
        tail.fillEllipse(-20, 8, 18, 12);
        const body = scene.add.graphics();
        body.fillStyle(0xc68642, 1);
        body.fillEllipse(0, 6, 36, 28);
        body.fillStyle(0xe8c9a0, 1);
        body.fillEllipse(8, 10, 18, 14);
        body.fillStyle(0x1a1a1a, 1);
        body.fillCircle(14, 6, 2.5);
        body.fillCircle(20, 6, 2.5);
        body.fillStyle(0xffa07a, 1);
        body.fillEllipse(22, 9, 6, 4);
        const earL = scene.add.graphics();
        earL.fillStyle(0xb87333, 1);
        earL.fillTriangle(-8, -12, -14, -26, -2, -20);
        earL.fillStyle(0xffe4c4, 0.85);
        earL.fillTriangle(-9, -14, -12, -22, -3, -19);
        const earR = scene.add.graphics();
        earR.fillStyle(0xb87333, 1);
        earR.fillTriangle(8, -12, 14, -26, 2, -20);
        earR.fillStyle(0xffe4c4, 0.85);
        earR.fillTriangle(9, -14, 12, -22, 3, -19);
        sq.add([tail, body, earL, earR]);
        sq.setDepth(depth);
        sq.setScale(1.08);
        sq.setAlpha(0.96);
        return sq;
    }

    startIdleMotion() {
        if (!this.container) return;
        this.scene.tweens.add({
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
        this.scene.tweens.killTweensOf(this.container);
        const target = SquirrelCharacter.angleForDirection(directionId);
        this.scene.tweens.add({
            targets: this.container,
            angle: target,
            duration: 280,
            ease: 'Cubic.easeOut',
            onComplete: () => this.startIdleMotion()
        });
    }

    /**
     * Quay nhẹ sai hướng rồi trở lại hướng đang đối thoại.
     * @param {'left' | 'right' | 'forward' | 'back' | string} wrongGuessId
     */
    turnWrong(wrongGuessId) {
        if (!this.container) return;
        this.scene.tweens.killTweensOf(this.container);
        const base = SquirrelCharacter.angleForDirection(this.facing);
        const wrong = SquirrelCharacter.angleForDirection(wrongGuessId);
        const bump = wrong + (wrong > base ? -22 : 22);
        this.scene.tweens.add({
            targets: this.container,
            angle: bump,
            duration: 120,
            yoyo: true,
            repeat: 2,
            ease: 'Sine.easeInOut',
            onComplete: () => {
                this.scene.tweens.add({
                    targets: this.container,
                    angle: base,
                    duration: 200,
                    ease: 'Quad.easeOut',
                    onComplete: () => this.startIdleMotion()
                });
            }
        });
    }

    hopJoy() {
        if (!this.container) return;
        this.scene.tweens.killTweensOf(this.container);
        this.scene.tweens.add({
            targets: this.container,
            angle: { from: this.container.angle, to: this.container.angle + 10 },
            y: this.container.y - 20,
            duration: 200,
            yoyo: true,
            repeat: 3,
            ease: 'Sine.easeInOut',
            onComplete: () => this.startIdleMotion()
        });
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SquirrelCharacter };
}
