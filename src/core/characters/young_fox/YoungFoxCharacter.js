/**
 * YoungFoxCharacter — Cáo con (Đồi Phép Trừ và màn khác nếu tái sử dụng).
 * Hình vẽ vector bằng Phaser Graphics trong container; tween idle / emotion / hop do class quản lý.
 */
class YoungFoxCharacter {
    /**
     * @param {Phaser.Scene} scene
     */
    constructor(scene) {
        this.scene = scene;
        /** @type {Phaser.GameObjects.Container | null} */
        this.container = null;
        /** @type {'worried' | 'hopeful' | 'joy' | string} */
        this.emotion = 'worried';
    }

    /**
     * @param {{ width: number, height: number, usesArtBackground?: boolean, depth?: number }} layout
     * @returns {Phaser.GameObjects.Container}
     */
    create(layout) {
        const { width, height, usesArtBackground = false, depth = 26 } = layout;
        const fx = usesArtBackground ? width * 0.14 : width * 0.2;
        const fy = usesArtBackground ? height * 0.62 : height * 0.6;
        this.container = YoungFoxCharacter.buildContainer(this.scene, fx, fy, { depth });
        this.emotion = 'worried';
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
        const fox = scene.add.container(x, y);
        const body = scene.add.graphics();
        body.fillStyle(0xff9f4a, 1);
        body.fillEllipse(0, 4, 40, 32);
        body.fillStyle(0xffffff, 1);
        body.fillEllipse(12, 8, 14, 11);
        body.fillStyle(0x1a1a1a, 1);
        body.fillCircle(16, 6, 2.5);
        body.fillCircle(21, 6, 2.5);
        body.fillStyle(0xff8c00, 1);
        body.fillTriangle(22, 10, 25, 13, 20, 13);
        const earL = scene.add.graphics();
        earL.fillStyle(0xff8c00, 1);
        earL.fillTriangle(-7, -10, -14, -24, -2, -18);
        earL.fillStyle(0xffc0cb, 0.85);
        earL.fillTriangle(-8, -12, -12, -20, -3, -17);
        const earR = scene.add.graphics();
        earR.fillStyle(0xff8c00, 1);
        earR.fillTriangle(7, -10, 14, -24, 2, -18);
        earR.fillStyle(0xffc0cb, 0.85);
        earR.fillTriangle(8, -12, 12, -20, 3, -17);
        const tail = scene.add.graphics();
        tail.fillStyle(0xff8c00, 1);
        tail.fillEllipse(-24, 9, 18, 12);
        fox.add([tail, body, earL, earR]);
        fox.setDepth(depth);
        fox.setScale(1.05);
        fox.setAngle(-6);
        fox.setAlpha(0.94);
        return fox;
    }

    startIdleMotion() {
        if (!this.container) return;
        this.scene.tweens.add({
            targets: this.container,
            y: this.container.y - 3,
            duration: this.emotion === 'worried' ? 2200 : 1600,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    /**
     * @param {'worried' | 'hopeful' | 'joy' | string} emotion
     */
    setEmotion(emotion) {
        this.emotion = emotion;
        if (!this.container) return;
        this.scene.tweens.killTweensOf(this.container);
        this.container.setScale(1.05);
        if (emotion === 'worried') {
            this.container.setAngle(-6);
            this.container.setAlpha(0.92);
        } else if (emotion === 'hopeful') {
            this.container.setAngle(-2);
            this.container.setAlpha(1);
        } else if (emotion === 'joy') {
            this.container.setAngle(0);
            this.container.setAlpha(1);
            this.container.setScale(1.12);
        } else {
            this.container.setAngle(0);
            this.container.setAlpha(1);
        }
        this.startIdleMotion();
    }

    hopJoy() {
        if (!this.container) return;
        this.scene.tweens.killTweensOf(this.container);
        this.scene.tweens.add({
            targets: this.container,
            angle: { from: this.container.angle, to: this.container.angle + 12 },
            y: this.container.y - 22,
            duration: 220,
            yoyo: true,
            repeat: 3,
            ease: 'Sine.easeInOut',
            onComplete: () => this.startIdleMotion()
        });
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { YoungFoxCharacter };
}
