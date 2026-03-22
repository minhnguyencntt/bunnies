/**
 * Nền màn "city": cấu hình trong puzzle.js → `background`.
 *
 * `type`:
 * - `image` — chỉ load ảnh (png/jpg…) + BGM wav (mặc định cho hầu hết màn city trong project)
 * - `video` — ưu tiên video (mp4), lỗi → ảnh + BGM; không probe HEAD
 * - `auto` — giống `video` (queue ảnh + mp4 cạnh ảnh); không probe HEAD vì preload không được async
 *
 * @example
 * // Gọi đồng bộ trong preload() — Phaser 3 không chờ Promise từ preload.
 * ScreenLevelBackground.registerLevelBackground(this, puzzle.background, {
 *   bgmKey: 'bgm_xxx', bgmUrl: 'screens/.../bgm.wav',
 * });
 * ScreenLevelBackground.createLayer(this, w, h, puzzle.background, { videoRef: 'levelBgVideo' });
 */
const ScreenLevelBackground = {
    bgMp4Beside(imageUrl) {
        if (!imageUrl || typeof imageUrl !== 'string') return '';
        const slash = imageUrl.lastIndexOf('/');
        const dir = slash >= 0 ? imageUrl.slice(0, slash + 1) : '';
        return `${dir}bg.mp4`;
    },

    /**
     * @param {Phaser.Scene} scene
     * @param {{ type?: string, imageKey: string, imageUrl: string, videoKey?: string, videoUrl?: string }} bg
     * @param {{ bgmKey?: string, bgmUrl?: string }} [audio]
     */
    registerLevelBackground(scene, bg, audio = {}) {
        const { bgmKey, bgmUrl } = audio;
        if (!bg?.imageKey || !bg?.imageUrl) {
            console.warn('ScreenLevelBackground: thiếu background.imageKey / imageUrl');
            return;
        }

        const type = (bg.type || 'auto').toLowerCase();
        const imageKey = bg.imageKey;
        const imageUrl = bg.imageUrl;
        const videoKey = bg.videoKey || `${imageKey}_video`;
        const videoUrl = bg.videoUrl || this.bgMp4Beside(imageUrl);
        scene._levelBgVideoKey = videoKey;

        const queueImageAndBgm = () => {
            scene._levelBgUsesVideo = false;
            if (!scene.textures.exists(imageKey)) {
                scene.load.image(imageKey, imageUrl);
            }
            if (bgmKey && bgmUrl && !scene.cache.audio.exists(bgmKey)) {
                scene.load.audio(bgmKey, bgmUrl);
            }
            if (!scene.load.isLoading()) {
                scene.load.start();
            }
        };

        if (type === 'image' || !videoUrl) {
            scene._levelBgUsesVideo = false;
            scene.load.image(imageKey, imageUrl);
            if (bgmKey && bgmUrl) scene.load.audio(bgmKey, bgmUrl);
            return;
        }

        scene._levelBgUsesVideo = true;
        // Luôn queue ảnh cùng video: Video Game Object chỉ có texture sau khi play/RVFC;
        // nếu setDisplaySize lỗi và ta xóa cache, vẫn còn png để hiển thị (tránh nền gradient).
        if (!scene.textures.exists(imageKey)) {
            scene.load.image(imageKey, imageUrl);
        }

        const evFileLoad = (typeof Phaser !== 'undefined' && Phaser.Loader?.Events?.FILE_LOAD)
            ? Phaser.Loader.Events.FILE_LOAD
            : 'fileload';

        const onFileLoad = (file) => {
            if (!file || file.key !== videoKey) return;
            if (file.type && String(file.type).toLowerCase() !== 'video') return;
            scene.load.off(evFileLoad, onFileLoad);
            scene.load.off('loaderror', onLoadError);
            scene._levelBgUsesVideo = true;
        };

        const onLoadError = (file) => {
            if (!file || file.key !== videoKey) return;
            scene.load.off('loaderror', onLoadError);
            scene.load.off(evFileLoad, onFileLoad);
            try {
                if (scene.cache?.video?.exists(videoKey)) {
                    scene.cache.video.remove(videoKey);
                }
            } catch (_) { /* ignore */ }
            queueImageAndBgm();
        };

        scene.load.on(evFileLoad, onFileLoad);
        scene.load.on('loaderror', onLoadError);
        scene.load.video(videoKey, videoUrl);
    },

    hasLoadedVideo(scene) {
        const k = scene._levelBgVideoKey;
        return !!(k && scene.cache?.video?.exists(k));
    },

    /**
     * @param {Phaser.Scene} scene
     * @param {{ imageKey: string, videoKey?: string }} bg — videoKey mặc định từ imageKey
     * @param {{ depth?: number, videoRef?: string }} [opts]
     */
    createLayer(scene, width, height, bg, opts = {}) {
        if (!bg?.imageKey) return 'none';
        const videoKey = bg.videoKey || `${bg.imageKey}_video`;
        const imageKey = bg.imageKey;
        const depth = opts.depth ?? 0;
        const videoRef = opts.videoRef ?? 'levelBgVideo';
        const musicOn = typeof window !== 'undefined' && window.gameData?.musicEnabled !== false;

        if (scene.cache?.video?.exists(videoKey)) {
            let v;
            try {
                v = scene.add.video(width / 2, height / 2, videoKey);
            } catch (_) {
                v = null;
            }
            if (v) {
                v.setDepth(depth);
                if (typeof v.setLoop === 'function') v.setLoop(true);
                if (typeof v.setMute === 'function') v.setMute(!musicOn);
                const fit = () => {
                    try {
                        v.setDisplaySize(width, height);
                    } catch (_) { /* texture có thể chưa sẵn sàng */ }
                };
                const evCreated = (typeof Phaser !== 'undefined' && Phaser.GameObjects?.Events?.VIDEO_CREATED)
                    ? Phaser.GameObjects.Events.VIDEO_CREATED
                    : 'created';
                v.once(evCreated, fit);
                v.play(true);
                fit();
                scene.time?.delayedCall(32, fit);
                scene[videoRef] = v;
                scene._levelBgUsesVideo = true;
                return 'video';
            }
            try { scene.cache.video.remove(videoKey); } catch (_) { /* ignore */ }
            scene[videoRef] = null;
        }

        scene._levelBgUsesVideo = false;
        if (scene.textures.exists(imageKey)) {
            scene.add.image(width / 2, height / 2, imageKey).setDisplaySize(width, height).setDepth(depth);
            scene[videoRef] = null;
            return 'image';
        }
        scene[videoRef] = null;
        return 'none';
    },

    destroyVideo(scene, videoRef = 'levelBgVideo') {
        const v = scene[videoRef];
        if (!v) return;
        try {
            if (typeof v.stop === 'function') v.stop();
        } catch (_) { /* ignore */ }
        try {
            v.destroy();
        } catch (_) { /* ignore */ }
        scene[videoRef] = null;
    },

    fadeOutBackgroundMedia(scene, opts = {}) {
        const soundProp = opts.soundProp ?? 'levelBGM';
        const videoProp = opts.videoProp ?? 'levelBgVideo';
        const duration = opts.duration ?? 450;
        const bgm = scene[soundProp];
        if (bgm) {
            scene.tweens.add({
                targets: bgm,
                volume: 0,
                duration,
                onComplete: () => {
                    const s = scene[soundProp];
                    if (s) {
                        s.stop();
                        if (typeof s.destroy === 'function') s.destroy();
                        scene[soundProp] = null;
                    }
                },
            });
            return;
        }
        const vid = scene[videoProp];
        if (vid && typeof vid.getVolume === 'function' && typeof vid.setVolume === 'function') {
            const from = vid.getVolume();
            scene.tweens.addCounter({
                from,
                to: 0,
                duration,
                onUpdate: (tw) => {
                    const v = scene[videoProp];
                    if (v?.setVolume) v.setVolume(tw.getValue());
                },
                onComplete: () => {
                    const v = scene[videoProp];
                    if (v && typeof v.stop === 'function') {
                        try { v.stop(); } catch (_) { /* ignore */ }
                    }
                },
            });
        }
    },
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ScreenLevelBackground };
}
