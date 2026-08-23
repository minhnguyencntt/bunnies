/**
 * IntroHelper — phần giới thiệu ngắn (mục tiêu 5–10s) cho các màn chơi.
 * - 1 câu thoại ngắn + voice phát nhanh (voiceRate)
 * - Nút "Bỏ qua" để vào chơi ngay
 *
 * IntroHelper.play(scene, {
 *   text: '...',                    // câu thoại hiển thị
 *   voiceKey: 'voice_intro_1',      // audio key đã preload (có thể null)
 *   voiceRate: 1.5,                 // tốc độ đọc
 *   showText: (text, ms) => {},     // hiển thị qua nhân vật (owl/fox/squirrel)
 *   onComplete: () => {},           // bắt đầu gameplay
 *   minMs: 3000, maxMs: 8000,
 * });
 */
const IntroHelper = {
    play(scene, opts) {
        const {
            text,
            voiceKey = null,
            voiceRate = 1.5,
            showText = null,
            onComplete = null,
            minMs = 3000,
            maxMs = 8000,
        } = opts || {};

        const w = scene.cameras.main.width;
        const h = scene.cameras.main.height;

        let finished = false;
        let voice = null;
        let timer = null;
        let skipBtn = null;

        // Thời lượng = độ dài voice / tốc độ, kẹp trong [minMs, maxMs]
        let duration = maxMs;
        if (voiceKey && scene.cache.audio.exists(voiceKey)) {
            const entry = scene.cache.audio.get(voiceKey);
            const seconds = (entry && entry.data && entry.data.duration) || (entry && entry.duration) || 0;
            if (seconds > 0) {
                duration = (seconds / voiceRate) * 1000 + 600;
            }
        }
        duration = Phaser.Math.Clamp(duration, minMs, maxMs);

        const finish = () => {
            if (finished) return;
            finished = true;
            if (timer) { timer.remove(false); timer = null; }
            if (voice) {
                try { voice.stop(); } catch (e) { /* ignore */ }
                if (scene.currentVoice === voice) scene.currentVoice = null;
                voice = null;
            }
            if (skipBtn) { skipBtn.destroy(true); skipBtn = null; }
            if (onComplete) onComplete();
        };

        // Hiển thị câu thoại
        if (showText && text) showText(text, duration);

        // Phát voice nhanh hơn bình thường
        if (voiceKey && scene.cache.audio.exists(voiceKey)) {
            if (scene.currentVoice) {
                try { scene.currentVoice.stop(); } catch (e) { /* ignore */ }
            }
            voice = scene.sound.add(voiceKey, { volume: 0.5, rate: voiceRate });
            scene.currentVoice = voice;
            voice.play();
        }

        // Nút "Chơi ngay" — to, rõ ràng, có glow nhấp nháy để trẻ biết có thể vào chơi
        skipBtn = scene.add.container(w - 120, h - 52).setDepth(900);
        const btnBg = scene.add.graphics();
        btnBg.fillStyle(0x66BB6A, 1);
        btnBg.fillRoundedRect(-95, -30, 190, 60, 30);
        btnBg.lineStyle(4, 0xFFFFFF, 0.95);
        btnBg.strokeRoundedRect(-95, -30, 190, 60, 30);
        skipBtn.add(btnBg);
        const glow = scene.add.graphics();
        glow.lineStyle(6, 0xFFF59D, 0.8);
        glow.strokeRoundedRect(-99, -34, 198, 68, 34);
        skipBtn.add(glow);
        scene.tweens.add({ targets: glow, alpha: 0.25, duration: 700, yoyo: true, repeat: -1 });
        skipBtn.add(scene.add.text(0, 0, 'Chơi ngay ▶', {
            fontSize: '24px', fontFamily: 'Comic Sans MS, Arial', fontStyle: 'bold',
            color: '#FFFFFF', stroke: '#2E7D32', strokeThickness: 3,
        }).setOrigin(0.5));
        skipBtn.setSize(190, 60);
        skipBtn.setInteractive(new Phaser.Geom.Rectangle(-95, -30, 190, 60), Phaser.Geom.Rectangle.Contains);
        skipBtn.input.cursor = 'pointer';
        skipBtn.on('pointerdown', finish);
        skipBtn.on('pointerover', () => skipBtn.setScale(1.08));
        skipBtn.on('pointerout', () => skipBtn.setScale(1));

        // Nảy vào
        skipBtn.setScale(0);
        scene.tweens.add({ targets: skipBtn, scale: 1, duration: 300, ease: 'Back.easeOut' });

        timer = scene.time.delayedCall(duration, finish);

        return { skip: finish };
    },
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { IntroHelper };
}
