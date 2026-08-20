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

        // Nút bỏ qua — góc phải dưới, dễ chạm
        skipBtn = scene.add.container(w - 92, h - 34).setDepth(900);
        const btnBg = scene.add.graphics();
        btnBg.fillStyle(0x9B7EDE, 0.95);
        btnBg.fillRoundedRect(-78, -24, 156, 48, 24);
        btnBg.lineStyle(3, 0xFFFFFF, 0.95);
        btnBg.strokeRoundedRect(-78, -24, 156, 48, 24);
        skipBtn.add(btnBg);
        skipBtn.add(scene.add.text(0, 0, 'Bỏ qua ⏭', {
            fontSize: '20px', fontFamily: 'Comic Sans MS, Arial', fontStyle: 'bold',
            color: '#FFFFFF', stroke: '#5C3A8C', strokeThickness: 2,
        }).setOrigin(0.5));
        skipBtn.setSize(156, 48);
        skipBtn.setInteractive({ useHandCursor: true });
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
