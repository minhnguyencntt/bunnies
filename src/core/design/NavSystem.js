/**
 * NavSystem — ONE navigation language for the entire Bunnies game.
 *
 * Back  = previous screen on the history stack (browser-like push / pop).
 * Home  = MenuScreen (world map). Clears the stack. Shown when it differs from Back.
 * Leave is always immediate: speech / music / animation never gate a tap.
 *
 * Flow (typical):
 *   MenuScreen (Home)
 *     → LevelSelectScreen  ← Back
 *         → Gameplay       ← Back
 *             → ResultScreen (launched; not pushed)
 *               Back → LevelSelect   Home → Menu
 *     → StickerAlbumScreen ← Back
 *     → AudioSettingsScreen (overlay, close = stop, no stack)
 */
const NavSystem = {
    HOME: 'MenuScreen',
    LEVELS: 'LevelSelectScreen',
    _stack: [],
    _TRANSIENT: {
        BootScreen: true,
        ResultScreen: true,
        AudioSettingsScreen: true,
    },

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

    history() {
        return this._stack.slice();
    },

    resetHistory() {
        this._stack.length = 0;
    },

    _capture(scene) {
        const data = {};
        if (!scene) return data;
        if (scene.gameId != null) data.gameId = scene.gameId;
        if (scene.level != null) data.level = scene.level;
        return data;
    },

    _pushFrom(scene) {
        if (!scene || !scene.scene) return;
        const key = scene.scene.key;
        if (!key || this._TRANSIENT[key]) return;
        const data = this._capture(scene);
        const top = this._stack[this._stack.length - 1];
        if (top && top.key === key && top.data.gameId === data.gameId && top.data.level === data.level) {
            return;
        }
        this._stack.push({ key, data });
    },

    _stopOthers(scene, target) {
        const mgr = scene && scene.scene;
        if (!mgr) return;
        const current = scene.scene.key;
        const stopIf = (key) => {
            if (!key || key === target || key === current) return;
            try {
                if (mgr.isActive(key) || (mgr.isSleeping && mgr.isSleeping(key))) mgr.stop(key);
            } catch (e) { /* ignore */ }
        };
        stopIf('ResultScreen');
        stopIf('AudioSettingsScreen');
        if (typeof GameConfig !== 'undefined' && GameConfig.allGames) {
            GameConfig.allGames().forEach((g) => stopIf(g.sceneKey));
        }
    },

    /**
     * Instant scene change. Pushes the current screen so Back can return.
     * opts.noPush — do not record current (used by back / home / replace).
     */
    go(scene, target, data, opts = {}) {
        if (!this.begin(scene)) return false;
        if (target === this.HOME) this._stack.length = 0;
        else if (!opts.noPush) this._pushFrom(scene);

        try { if (typeof AudioEngine !== 'undefined') AudioEngine.emit('Transition'); } catch (e) { /* ignore */ }
        try { if (typeof VoiceEngine !== 'undefined') VoiceEngine.stopCurrent(); } catch (e) { /* ignore */ }
        try { if (typeof AmbienceEngine !== 'undefined') AmbienceEngine.stop(); } catch (e) { /* ignore */ }
        try { if (typeof MusicEngine !== 'undefined') MusicEngine.stopTheme(180); } catch (e) { /* ignore */ }
        try { scene.sound.stopAll(); } catch (e) { /* ignore */ }

        this._stopOthers(scene, target);

        if (target === '__close__') {
            scene.scene.stop();
            return true;
        }
        scene.scene.start(target, data || {});
        const dest = scene.game && scene.game.scene && scene.game.scene.getScene(target);
        if (dest && dest !== scene) this.ready(dest);
        return true;
    },

    /**
     * Pop history and return to the previous screen.
     * fallback is used when the stack is empty (e.g. a game opened without Level Select).
     */
    back(scene, fallback) {
        if (scene && scene._navTx) return false;
        const prev = this._stack[this._stack.length - 1];
        if (!prev) {
            if (fallback && fallback.key) {
                return this.go(scene, fallback.key, fallback.data || {}, { noPush: true });
            }
            if (scene && scene.scene && scene.scene.key === this.HOME) return false;
            return this.home(scene);
        }
        const ok = this.go(scene, prev.key, prev.data, { noPush: true });
        if (ok) this._stack.pop();
        return ok;
    },

    backToLevels(scene, gameId) {
        if (scene && scene._navTx) return false;
        let found = null;
        const discarded = [];
        while (this._stack.length) {
            const top = this._stack[this._stack.length - 1];
            if (top.key === this.HOME) break;
            const e = this._stack.pop();
            if (e.key === this.LEVELS) {
                found = e;
                break;
            }
            discarded.push(e);
        }
        const id = gameId || (found && found.data && found.data.gameId);
        const ok = this.go(scene, this.LEVELS, id != null ? { gameId: id } : {}, { noPush: true });
        if (!ok) {
            if (found) this._stack.push(found);
            while (discarded.length) this._stack.push(discarded.pop());
        }
        return ok;
    },

    home(scene) {
        this._stack.length = 0;
        return this.go(scene, this.HOME, {}, { noPush: true });
    },

    closeOverlay(scene) {
        this.go(scene, '__close__', {}, { noPush: true });
    },

    /**
     * Standard chrome: top-left Back (always), optional explicit Home.
     * Back defaults to the history stack. Returns { back, home } buttons.
     */
    mount(scene, opts = {}) {
        this.ready(scene);
        const L = DesignTokens.layout;
        const y = opts.y ?? L.chromeY;
        const back = UISystem.navButton(scene, opts.backX ?? L.backX, y, 'back', () => {
            if (opts.onBack) opts.onBack();
            else this.back(scene);
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
