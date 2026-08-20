/**
 * RewardFX — hiệu ứng ăn mừng khi trả lời đúng.
 * Mục tiêu: tạo cảm giác "sung sướng" cho trẻ — flash vàng, vòng sáng lan,
 * mưa hoa giấy emoji, lời khen bật lên, và ngôi sao bay về bộ đếm ⭐ trên HUD.
 *
 * RewardFX.correctAnswer(scene, x, y, { addStar: true });
 */
const RewardFX = {
    PRAISES: ['Giỏi quá!', 'Tuyệt vời!', 'Xuất sắc!', 'Đúng rồi!', 'Siêu đỉnh!', 'Hay quá!'],
    CONFETTI: ['🎉', '⭐', '✨', '💖', '🌟', '🎊', '💛', '💜'],

    correctAnswer(scene, x, y, opts = {}) {
        const { addStar = true } = opts;
        const w = scene.cameras.main.width;
        const DEPTH = 600;

        // Flash vàng nhẹ toàn màn
        scene.cameras.main.flash(160, 255, 235, 170, false);

        // Hai vòng sáng lan ra từ điểm đúng
        for (let i = 0; i < 2; i++) {
            const ring = scene.add.graphics().setDepth(DEPTH);
            ring.lineStyle(6 - i * 2, i === 0 ? 0xFFD700 : 0xFFFFFF, 0.9);
            ring.strokeCircle(0, 0, 26);
            ring.setPosition(x, y);
            scene.tweens.add({
                targets: ring,
                scaleX: 4.5 + i * 1.5,
                scaleY: 4.5 + i * 1.5,
                alpha: 0,
                duration: 550 + i * 200,
                ease: 'Cubic.easeOut',
                onComplete: () => ring.destroy(),
            });
        }

        // Mưa hạt sáng bắn tứ phía
        const colors = [0xFFD700, 0xFF69B4, 0x87CEEB, 0x90EE90, 0x9370DB, 0xFFA500];
        for (let i = 0; i < 22; i++) {
            const p = scene.add.graphics().setDepth(DEPTH);
            p.fillStyle(colors[i % colors.length], 0.95);
            p.fillCircle(0, 0, Phaser.Math.Between(3, 7));
            p.fillStyle(0xFFFFFF, 0.9);
            p.fillCircle(0, 0, 2);
            p.setPosition(x, y);
            const a = Phaser.Math.DegToRad(Phaser.Math.Between(0, 360));
            const d = Phaser.Math.Between(60, 170);
            scene.tweens.add({
                targets: p,
                x: x + Math.cos(a) * d,
                y: y + Math.sin(a) * d + 40,
                alpha: 0,
                scale: 0.2,
                duration: Phaser.Math.Between(600, 1000),
                ease: 'Power2',
                onComplete: () => p.destroy(),
            });
        }

        // Hoa giấy emoji rơi từ trên xuống
        for (let i = 0; i < 10; i++) {
            const emoji = this.CONFETTI[Phaser.Math.Between(0, this.CONFETTI.length - 1)];
            const cx = Phaser.Math.Between(Math.round(w * 0.15), Math.round(w * 0.85));
            const c = scene.add.text(cx, -30, emoji, { fontSize: '30px' })
                .setOrigin(0.5).setDepth(DEPTH + 1);
            scene.tweens.add({
                targets: c,
                y: Phaser.Math.Between(Math.round(y * 0.4), Math.round(y + 80)),
                x: cx + Phaser.Math.Between(-40, 40),
                angle: Phaser.Math.Between(-160, 160),
                alpha: 0,
                duration: Phaser.Math.Between(900, 1400),
                delay: i * 40,
                ease: 'Sine.easeIn',
                onComplete: () => c.destroy(),
            });
        }

        // Lời khen bật lên
        const praise = this.PRAISES[Phaser.Math.Between(0, this.PRAISES.length - 1)];
        const praiseText = scene.add.text(x, Math.max(70, y - 80), `${praise} 🌟`, {
            fontSize: '38px', fontFamily: 'Comic Sans MS, Arial', fontStyle: 'bold',
            color: '#FFD700', stroke: '#FFFFFF', strokeThickness: 6,
            shadow: { offsetX: 2, offsetY: 3, color: '#B03060', blur: 4, fill: true },
        }).setOrigin(0.5).setDepth(DEPTH + 2).setScale(0);
        scene.tweens.add({
            targets: praiseText,
            scale: 1.15,
            duration: 320,
            ease: 'Back.easeOut',
            onComplete: () => {
                scene.tweens.add({
                    targets: praiseText,
                    y: praiseText.y - 36,
                    alpha: 0,
                    scale: 1,
                    duration: 800,
                    delay: 500,
                    ease: 'Power2',
                    onComplete: () => praiseText.destroy(),
                });
            },
        });

        // Ngôi sao lớn bật ra rồi bay về bộ đếm ⭐ trên HUD
        if (addStar) {
            if (window.gameData) {
                window.gameData.stars = (window.gameData.stars || 0) + 1;
            }
            const star = scene.add.text(x, y, '⭐', { fontSize: '64px' })
                .setOrigin(0.5).setDepth(DEPTH + 3).setScale(0);
            scene.tweens.add({
                targets: star,
                scale: 1.4,
                duration: 300,
                ease: 'Back.easeOut',
                onComplete: () => {
                    scene.tweens.add({
                        targets: star,
                        x: w - 80,
                        y: 30,
                        scale: 0.5,
                        duration: 650,
                        ease: 'Cubic.easeInOut',
                        onComplete: () => {
                            // Nảy nhẹ khi chạm bộ đếm
                            const pop = scene.add.text(w - 80, 30, '✨', { fontSize: '28px' })
                                .setOrigin(0.5).setDepth(DEPTH + 3);
                            scene.tweens.add({
                                targets: pop,
                                scale: 1.8,
                                alpha: 0,
                                duration: 350,
                                onComplete: () => pop.destroy(),
                            });
                            star.destroy();
                        },
                    });
                },
            });
        }
    },
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { RewardFX };
}
