/**
 * NavSystem — ONE navigation language for the entire Bunnies game.
 *
 * Back  = previous screen in the flow (never starts another game/world).
 * Home  = MenuScreen (world map). Exposed explicitly when it differs from Back.
 * Leave is always immediate: speech / music / animation never gate a tap.
 *
 * Flow:
 *   MenuScreen (Home)
 *     → LevelSelectScreen  ← Back
 *         → Gameplay       ← Back
 *             → ResultScreen
 *               Back → LevelSelect   Home → Menu
 *     → StickerAlbumScreen ← Back
 *     → AudioSettingsScreen (overlay, Back = close)
 */
const NavSystem = {
    HOME: 'MenuScreen',
    LEVELS: 'LevelSelectScreen',

    /** New/reused scene is idle — Phaser reuses scene instances. */
    ready(scene) {
        if (scene) scene._navTx = false;
        return scene;
    },

    /**
     * Claim a one-shot navigation on this scene. Duplicate taps are ignored
     * without sleeping — the first action already started.
     */
    begin(scene) {
        if (!scene || scene._navTx) return false;
        scene._navTx = true;
        return true;
    },

    /** Instant scene change. Never awaits audio or tweens. */
    go(scene, target, data) {
        if (!this.begin(scene)) return false;
        try { if (typeof AudioEngine !== 'undefined') AudioEngine.emit('Transition'); } catch (e) { /* ignore */ }
        try { if (typeof VoiceEngine !== 'undefined') VoiceEngine.stopCurrent(); } catch (e) { /* ignore */ }
        try { if (typeof AmbienceEngine !== 'undefined') AmbienceEngine.stop(); } catch (e) { /* ignore */ }
        try { if (typeof MusicEngine !== 'undefined') MusicEngine.stopTheme(180); } catch (e) { /* ignore */ }
        try { scene.sound.stopAll(); } catch (e) { /* ignore */ }

        if (scene.scene.isActive('ResultScreen') && scene.scene.key !== 'ResultScreen') {
            scene.scene.stop('ResultScreen');
        }
        if (scene.scene.isActive('AudioSettingsScreen') && scene.scene.key !== 'AudioSettingsScreen') {
            scene.scene.stop('AudioSettingsScreen');
        }

        if (target === '__close__') {
            scene.scene.stop();
            return true;
        }
        scene.scene.start(target, data || {});
        const dest = scene.game && scene.game.scene && scene.game.scene.getScene(target);
        if (dest && dest !== scene) this.ready(dest);
        return true;
    },

    backToLevels(scene, gameId) {
        this.go(scene, this.LEVELS, { gameId });
    },

    home(scene) {
        this.go(scene, this.HOME);
    },

    closeOverlay(scene) {
        this.go(scene, '__close__');
    },

    /**
     * Standard chrome: top-left Back (always), optional explicit Home.
     * Returns { back, home } buttons.
     */
    mount(scene, opts = {}) {
        this.ready(scene);
        const L = DesignTokens.layout;
        const y = opts.y ?? L.chromeY;
        const back = UISystem.navButton(scene, opts.backX ?? L.backX, y, 'back', () => {
            if (opts.onBack) opts.onBack();
        });
        back.setDepth(opts.depth ?? 900);
        let home = null;
        if (opts.onHome) {
            home = UISystem.navButton(scene, opts.homeX ?? (scene.cameras.main.width - L.backX), y, 'home', () => {
                opts.onHome();
            }, { color: DesignTokens.colors.secondary });
            home.setDepth(opts.depth ?? 900);
        }
        return { back, home };
    },
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { NavSystem };
}
