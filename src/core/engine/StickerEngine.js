/**
 * StickerEngine.js — sticker collections & unlock evaluation.
 * Stickers are earned through clear, deterministic achievements — never random.
 */
const StickerEngine = {
    /**
     * @returns {Array} newly unlocked stickers for this session
     */
    evaluate(gameDef, session, profile) {
        const gameProfile = SaveEngine.gameProfile(profile, gameDef.gameId);
        const unlocked = [];
        for (const sticker of gameDef.stickers) {
            if (gameProfile.stickers.includes(sticker.id)) continue;
            if (this.checkCondition(sticker.condition, session, profile, gameDef)) {
                unlocked.push({ ...sticker, gameId: gameDef.gameId, gameName: gameDef.name });
            }
        }
        return unlocked;
    },

    checkCondition(cond, session, profile, gameDef) {
        const gp = SaveEngine.gameProfile(profile, gameDef.gameId);
        switch (cond.type) {
            case 'complete_level':
                return session.level === cond.level; // session completed by definition
            case 'complete_any_level':
                return true;
            case 'three_stars':
                return session.stars >= 3 && session.level === cond.level;
            case 'three_stars_any':
                return session.stars >= 3;
            case 'plays':
                return gp.plays >= cond.count;
            case 'high_score':
                return session.score >= cond.score;
            case 'no_hint':
                return session.metrics.hintsUsed === 0;
            case 'perfect_round':
                return session.metrics.perfectRounds > 0;
            case 'all_levels':
                return [1, 2, 3].every(l => (gp.levels[l]?.stars || 0) > 0);
            default:
                return false;
        }
    },

    grant(profile, gameId, stickers) {
        const gp = SaveEngine.gameProfile(profile, gameId);
        stickers.forEach(s => gp.stickers.push(s.id));
    },

    /** Album view model: every sticker with owned/hint state. */
    albumData(profile) {
        return GameConfig.allGames().map(g => {
            const gp = profile.games[g.gameId];
            const owned = gp ? gp.stickers : [];
            return {
                gameId: g.gameId,
                gameName: g.name,
                icon: g.icon,
                world: GameConfig.KNOWLEDGE_WORLDS[g.world],
                stickers: g.stickers.map(s => Award.hydrate(s, {
                    type: Award.TYPE.STICKER,
                    owned: owned.includes(s.id),
                    persistOk: true,
                    gameId: g.gameId,
                    gameName: g.name,
                })),
            };
        });
    },

    /** Next unearned sticker for this game — used on the award screen. */
    nextHint(profile, gameId) {
        const def = GameConfig.get(gameId);
        if (!def) return null;
        const gp = SaveEngine.gameProfile(profile, gameId);
        return def.stickers.find((s) => !gp.stickers.includes(s.id)) || null;
    },

    totals(profile) {
        const all = GameConfig.allStickers();
        const ownedCount = all.filter(s => (profile.games[s.gameId]?.stickers || []).includes(s.id)).length;
        return { owned: ownedCount, total: all.length };
    },
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { StickerEngine };
}
