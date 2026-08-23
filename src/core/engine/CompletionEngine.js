/**
 * CompletionEngine — one completion flow for every Knowledge World game.
 *
 *   PLAYING → LAST_ANSWER → COMPLETED → CALCULATING_REWARD
 *     → REWARD_REVEAL → REWARD_PRESENTED → NEXT_ACTION
 *
 * Games call completeGame(). They must not invent their own result UI.
 */
const CompletionState = {
    PLAYING: 'PLAYING',
    LAST_ANSWER: 'LAST_ANSWER',
    COMPLETED: 'COMPLETED',
    CALCULATING_REWARD: 'CALCULATING_REWARD',
    REWARD_REVEAL: 'REWARD_REVEAL',
    REWARD_PRESENTED: 'REWARD_PRESENTED',
    NEXT_ACTION: 'NEXT_ACTION',
    PERSIST_FAILED: 'PERSIST_FAILED',
};

const CompletionEngine = {
    STATE: CompletionState,
    state: CompletionState.PLAYING,
    result: null,
    _tx: false,

    reset() {
        this.state = CompletionState.PLAYING;
        this.result = null;
        this._tx = false;
    },

    notifyLastAnswer() {
        if (this.state === CompletionState.PLAYING) {
            this.state = CompletionState.LAST_ANSWER;
        }
    },

    /**
     * Finalize gameplay, persist rewards, open the shared completion UI.
     * Safe to call once: a second tap is ignored.
     */
    completeGame(opts) {
        if (this._tx) return this.result;
        this._tx = true;
        this.state = CompletionState.COMPLETED;
        this.state = CompletionState.CALCULATING_REWARD;

        RewardPresentationEngine.prepare(opts.gameId);
        const result = RewardPresentationEngine.present(opts);
        result._analytics = opts.analytics;
        result._parTimeMs = opts.parTimeMs;
        this.result = result;

        this.state = result.persistOk
            ? CompletionState.REWARD_REVEAL
            : CompletionState.PERSIST_FAILED;
        if (result.persistOk) this.state = CompletionState.REWARD_PRESENTED;
        this.state = CompletionState.NEXT_ACTION;

        if (opts.scene) this.presentUI(opts.scene, result);
        return result;
    },

    fromRewards(raw, extra) {
        const result = RewardPresentationEngine.fromRewards(raw, extra);
        this.result = result;
        this.state = result.persistOk ? CompletionState.NEXT_ACTION : CompletionState.PERSIST_FAILED;
        return result;
    },

    presentUI(scene, result) {
        try { RewardPresentationEngine.celebrate(scene, result); } catch (e) { /* ignore */ }
        try {
            if (scene.companionReact) scene.companionReact('celebrate');
        } catch (e) { /* ignore */ }
        try { if (typeof AmbienceEngine !== 'undefined') AmbienceEngine.stop(); } catch (e) { /* ignore */ }

        try {
            if (scene.scene.isActive('ResultScreen')) return;
            scene.scene.pause();
            scene.scene.launch('ResultScreen', {
                completion: result,
                rewards: result.raw,
                gameId: result.gameId,
                level: result.level,
            });
        } catch (e) {
            console.error('ResultScreen launch failed', e);
            try { NavSystem.home(scene); } catch (err) { /* ignore */ }
        }
    },

    executeAction(scene, actionId, result) {
        const r = result || this.result || {};
        const gameId = r.gameId;
        const level = r.level;
        const sceneKey = r.sceneKey || (GameConfig.get(gameId) || {}).sceneKey;

        if (actionId === 'retry_persist') {
            const next = RewardPresentationEngine.retry(r);
            this.result = next;
            this.state = next.persistOk ? CompletionState.NEXT_ACTION : CompletionState.PERSIST_FAILED;
            scene.scene.restart({
                completion: next,
                rewards: next.raw,
                gameId: next.gameId,
                level: next.level,
            });
            return;
        }

        if (sceneKey && scene.scene.isActive(sceneKey)) {
            scene.scene.stop(sceneKey);
        }

        if (actionId === 'continue' && sceneKey) {
            NavSystem.go(scene, sceneKey, { gameId, level: level + 1 });
            return;
        }
        if (actionId === 'replay' && sceneKey) {
            NavSystem.go(scene, sceneKey, { gameId, level });
            return;
        }
        if (actionId === 'levels') {
            NavSystem.backToLevels(scene, gameId);
            return;
        }
        NavSystem.home(scene);
    },
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CompletionEngine, CompletionState };
}
