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

        // Nút "Chơi ngay" — to, rõ ràng, glow nhấp nháy (design-system primary button)
        skipBtn = UISystem.primaryButton(scene, w - 120, h - 52, 'Chơi ngay ▶', finish, {
            width: 190, height: 60, fontSize: 24, color: DesignTokens.colors.success,
        });
        skipBtn.setDepth(900);
        const glow = scene.add.graphics();
        glow.lineStyle(6, 0xFFF59D, 0.8);
        glow.strokeRoundedRect(-99, -34, 198, 68, 34);
        skipBtn.add(glow);
        scene.tweens.add({ targets: glow, alpha: 0.25, duration: 700, yoyo: true, repeat: -1 });
        scene.tweens.add({
            targets: skipBtn, scale: 1.06, duration: 140, yoyo: true, ease: 'Sine.easeOut',
        });

        timer = scene.time.delayedCall(duration, finish);

        return { skip: finish };
    },
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { IntroHelper };
}
