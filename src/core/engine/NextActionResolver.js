/**
 * NextActionResolver — one next-step engine for every completion screen.
 *
 * Games never hardcode Continue / Choose Game / Home. This resolver reads
 * AwardResult + GameConfig and returns structured NextAction objects.
 */
const NextActionType = {
    CONTINUE_LEVEL: 'CONTINUE_LEVEL',
    PLAY_AGAIN: 'PLAY_AGAIN',
    CHOOSE_GAME: 'CHOOSE_GAME',
    HOME: 'HOME',
    RETRY_PERSIST: 'RETRY_PERSIST',
};

const NextActionResolver = {
    TYPE: NextActionType,

    resolve(ctx) {
        const gameId = ctx.gameId;
        const level = ctx.level;
        const persistOk = ctx.persistOk !== false;
        const sceneKey = ctx.sceneKey
            || (typeof GameConfig !== 'undefined' && (GameConfig.get(gameId) || {}).sceneKey)
            || null;
        const nextLevel = (typeof GameConfig !== 'undefined' && GameConfig.nextLevel)
            ? GameConfig.nextLevel(gameId, level)
            : (level < 3 ? level + 1 : null);

        const actions = [];
        if (!persistOk) {
            actions.push(this.action({
                type: NextActionType.RETRY_PERSIST,
                id: 'retry_persist',
                label: 'THỬ LẠI',
                destination: null,
                priority: 0,
                isPrimary: true,
            }));
        }
        if (nextLevel != null && sceneKey) {
            actions.push(this.action({
                type: NextActionType.CONTINUE_LEVEL,
                id: 'continue',
                label: 'TIẾP TỤC',
                hint: `Màn ${nextLevel}`,
                destination: { sceneKey, data: { gameId, level: nextLevel } },
                priority: 1,
                isPrimary: persistOk,
            }));
        }
        if (sceneKey) {
            actions.push(this.action({
                type: NextActionType.PLAY_AGAIN,
                id: 'replay',
                label: 'CHƠI LẠI',
                destination: { sceneKey, data: { gameId, level } },
                priority: 2,
                isPrimary: false,
            }));
        }
        const choosePrimary = persistOk && nextLevel == null;
        actions.push(this.action({
            type: NextActionType.CHOOSE_GAME,
            id: 'levels',
            label: 'CHỌN MÀN',
            destination: { scene: 'LevelSelectScreen', data: { gameId } },
            priority: choosePrimary ? 1 : 3,
            isPrimary: choosePrimary,
        }));
        actions.push(this.action({
            type: NextActionType.HOME,
            id: 'home',
            label: 'VỀ NHÀ',
            destination: { scene: 'MenuScreen' },
            priority: 4,
            isPrimary: false,
        }));

        return {
            actions,
            recommended: !persistOk
                ? 'retry_persist'
                : (nextLevel != null ? 'continue' : 'levels'),
        };
    },

    action(spec) {
        return {
            type: spec.type,
            id: spec.id,
            label: spec.label,
            hint: spec.hint || '',
            destination: spec.destination || null,
            priority: spec.priority,
            isPrimary: !!spec.isPrimary,
            primary: !!spec.isPrimary,
            enabled: spec.enabled !== false,
        };
    },

    find(actions, key) {
        const list = actions || [];
        return list.find((a) => a.id === key || a.type === key) || null;
    },
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { NextActionResolver, NextActionType };
}
