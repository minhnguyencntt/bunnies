/**
 * AwardEngine.js — deterministic award evaluation.
 * Every award has a clear requirement children can understand and aim for.
 */
const AwardEngine = {
    /**
     * Evaluate all awards (game-specific + global) against the finished session
     * and the ALREADY-UPDATED profile.
     * @returns {Array} newly unlocked award definitions
     */
    evaluate(gameDef, session, profile) {
        const unlocked = [];
        const gameProfile = SaveEngine.gameProfile(profile, gameDef.gameId);
        const candidates = [
            ...gameDef.awards.map(a => ({ ...a, gameId: gameDef.gameId })),
            ...GameConfig.GLOBAL_AWARDS.map(a => ({ ...a, gameId: null })),
        ];

        for (const award of candidates) {
            const owned = award.gameId
                ? gameProfile.awards.includes(award.id)
                : profile.globalAwards.includes(award.id);
            if (owned) continue;
            if (this.checkCondition(award.condition, session, profile, gameDef)) {
                unlocked.push(award);
            }
        }
        return unlocked;
    },

    checkCondition(cond, session, profile, gameDef) {
        const gp = SaveEngine.gameProfile(profile, gameDef.gameId);
        switch (cond.type) {
            case 'complete_any_level':
                return true; // session completed by definition
            case 'complete_level':
                return session.level === cond.level;
            case 'streak':
                return session.metrics.bestStreak >= cond.count;
            case 'perfect_round':
                return session.metrics.perfectRounds > 0;
            case 'perfect_session':
                return session.metrics.mistakes === 0;
            case 'three_stars':
                return session.stars >= 3 && session.level === cond.level;
            case 'no_hint':
                return session.metrics.hintsUsed === 0;
            case 'fast_finish':
                return session.parTimeMs > 0 && session.metrics.durationMs <= session.parTimeMs * session.roundsTotal;
            case 'total_plays':
                return profile.stats.totalPlays >= cond.count;
            case 'total_stars':
                return profile.stats.totalStars >= cond.count;
            case 'all_games':
                return GameConfig.allGames().every(g => (profile.games[g.gameId]?.plays || 0) > 0);
            case 'all_masters':
                return GameConfig.allGames().every(g => (profile.games[g.gameId]?.levels?.[3]?.stars || 0) >= 3);
            default:
                return false;
        }
    },

    /** Apply award ownership + rewards to the profile. Returns gained XP/gems. */
    grant(profile, awards) {
        let xp = 0;
        let gems = 0;
        for (const a of awards) {
            if (a.gameId) {
                SaveEngine.gameProfile(profile, a.gameId).awards.push(a.id);
            } else {
                profile.globalAwards.push(a.id);
            }
            xp += a.reward?.xp || 0;
            gems += a.reward?.gems || 0;
        }
        return { xp, gems };
    },
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AwardEngine };
}
