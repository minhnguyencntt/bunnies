/**
 * ProgressionEngine.js — Knowledge World progression.
 * Turns profile stats into visible world-map progress: per-city stars,
 * decoration tiers, overall completion and the next thing to aim for.
 */
const ProgressionEngine = {
    MAX_STARS_PER_GAME: 9, // 3 levels × 3 stars

    cityState(profile, gameId) {
        const gp = profile.games[gameId];
        const stars = gp ? [1, 2, 3].reduce((s, l) => s + (gp.levels[l]?.stars || 0), 0) : 0;
        const completedLevels = gp ? [1, 2, 3].filter(l => (gp.levels[l]?.stars || 0) > 0).length : 0;
        let tier = 'none';
        if (stars >= 9) tier = 'gold';
        else if (stars >= 6) tier = 'silver';
        else if (stars >= 3) tier = 'bronze';
        return { stars, completedLevels, tier, plays: gp?.plays || 0 };
    },

    isLevelUnlocked(profile, gameId, level) {
        if (!this.isGameUnlocked(profile, gameId)) return false;
        if (level <= 1) return true;
        const gp = profile.games[gameId];
        if (!gp) return false;
        return (gp.levels[level - 1]?.stars || 0) > 0;
    },

    /** Cross-game unlocks: a game may require progress in another game first. */
    isGameUnlocked(profile, gameId) {
        const def = GameConfig.get(gameId);
        if (!def?.unlockRequires) return true;
        const req = def.unlockRequires;
        const gp = profile.games[req.gameId];
        return !!gp && (gp.levels[req.level]?.stars || 0) > 0;
    },

    unlockHint(gameId) {
        const def = GameConfig.get(gameId);
        if (!def?.unlockRequires) return '';
        const req = GameConfig.get(def.unlockRequires.gameId);
        return `Hoàn thành Màn 1 ở ${req?.name || 'game trước'} để mở!`;
    },

    worldProgress(profile) {
        const games = GameConfig.allGames();
        const maxStars = games.length * this.MAX_STARS_PER_GAME;
        const stars = games.reduce((sum, g) => sum + this.cityState(profile, g.gameId).stars, 0);
        const stickerTotals = StickerEngine.totals(profile);
        return {
            stars,
            maxStars,
            percent: maxStars ? Math.round((stars / maxStars) * 100) : 0,
            stickers: stickerTotals,
            knowledgeLevel: XPEngine.knowledgeLevelForXP(profile.xp),
            gems: profile.gems,
        };
    },

    /** Child-friendly suggestion for what to do next (shown on the map). */
    nextGoal(profile) {
        for (const g of GameConfig.allGames()) {
            if (!this.isGameUnlocked(profile, g.gameId)) continue;
            const gp = profile.games[g.gameId];
            if (!gp || gp.plays === 0) {
                return { icon: g.icon, text: `Khám phá ${g.name}!` };
            }
            for (let l = 1; l <= 3; l++) {
                const stars = gp.levels[l]?.stars || 0;
                if (stars === 0 && this.isLevelUnlocked(profile, g.gameId, l)) {
                    return { icon: g.icon, text: `Thử Màn ${l} ở ${g.name}!` };
                }
                if (stars > 0 && stars < 3) {
                    return { icon: '⭐', text: `Kiếm 3 sao Màn ${l} ở ${g.name}!` };
                }
            }
        }
        return { icon: '🏆', text: 'Bạn đã chinh phục Thế Giới Tri Thức!' };
    },
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ProgressionEngine };
}
