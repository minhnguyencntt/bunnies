/**
 * CompletionEngine — one completion flow for every Knowledge World game.
 *
 *   PLAYING → LAST_ANSWER → COMPLETED → CALCULATING_REWARD
 *     → REWARD_REVEAL → REWARD_PRESENTED → NEXT_ACTION
 *
 * Games call completeGame() with session facts only.
 * AwardGenerator + NextActionResolver own reward and next steps.
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
     * Finalize gameplay, persist rewards, open the shared award UI.
     * Safe to call once: a second tap is ignored.
     */
    completeGame(opts) {
        if (this._tx) return this.result;
        this._tx = true;
        this.state = CompletionState.COMPLETED;
        this.state = CompletionState.CALCULATING_REWARD;

        const result = AwardGenerator.generate(opts);
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
        const result = AwardGenerator.fromRaw(raw, extra);
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
        const action = NextActionResolver.find(r.availableNextActions, actionId)
            || { id: actionId, type: actionId };

        if (action.id === 'retry_persist' || action.type === NextActionResolver.TYPE.RETRY_PERSIST) {
            const next = AwardGenerator.retry(r);
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

        GameConfig.allGames().forEach((g) => {
            try {
                if (g.sceneKey && scene.scene.isActive(g.sceneKey)) scene.scene.stop(g.sceneKey);
            } catch (e) { /* ignore */ }
        });

        const dest = action.destination;
        if (dest && dest.sceneKey) {
            NavSystem.go(scene, dest.sceneKey, dest.data || {});
            return;
        }
        if (dest && (dest.scene === 'LevelSelectScreen' || dest.scene === NavSystem.LEVELS)) {
            NavSystem.backToLevels(scene, (dest.data && dest.data.gameId) || r.gameId);
            return;
        }
        if (dest && (dest.scene === 'MenuScreen' || dest.scene === NavSystem.HOME)) {
            NavSystem.home(scene);
            return;
        }

        const gameId = r.gameId || (scene && scene.gameId);
        const level = r.level || (scene && scene.level);
        const sceneKey = r.sceneKey || (GameConfig.get(gameId) || {}).sceneKey;

        if ((action.id === 'continue' || action.type === NextActionResolver.TYPE.CONTINUE_LEVEL) && sceneKey) {
            const nextLevel = GameConfig.nextLevel(gameId, level) || (level + 1);
            NavSystem.go(scene, sceneKey, { gameId, level: nextLevel });
            return;
        }
        if ((action.id === 'replay' || action.type === NextActionResolver.TYPE.PLAY_AGAIN) && sceneKey) {
            NavSystem.go(scene, sceneKey, { gameId, level });
            return;
        }
        if (action.id === 'levels' || action.type === NextActionResolver.TYPE.CHOOSE_GAME) {
            NavSystem.backToLevels(scene, gameId);
            return;
        }
        NavSystem.home(scene);
    },
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CompletionEngine, CompletionState };
}
