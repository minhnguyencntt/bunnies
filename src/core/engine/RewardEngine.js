/**
 * RewardEngine.js — the unified reward pipeline.
 *
 *   Gameplay → Score → Stars → XP → Awards → Stickers → Gems → World Progression
 *
 * finishSession() computes everything, persists it via SaveEngine and returns
 * a complete bundle for the Result Screen.
 */
const RewardEngine = {
    /**
     * @param {string} gameId
     * @param {number} level — 1..3
     * @param {AnalyticsEngine} analytics
     * @param {number} parTimeMs — target ms per answer (0 = untimed)
     */
    finishSession(gameId, level, analytics, parTimeMs) {
        const gameDef = GameConfig.get(gameId);
        const levelCfg = GameConfig.getLevel(gameId, level);
        const metrics = analytics.getMetrics();

        const { score, breakdown } = ScoringEngine.computeSessionScore(
            metrics, levelCfg.scoring, levelCfg.rounds, parTimeMs);
        const stars = StarEngine.starsForScore(score, levelCfg.scoring.starThresholds);

        const profile = SaveEngine.load();
        const gp = SaveEngine.gameProfile(profile, gameId);
        const levelProfile = gp.levels[level];

        const prevBest = levelProfile.bestScore;
        const isNewBest = score > prevBest;
        gp.plays++;
        levelProfile.plays++;
        levelProfile.stars = Math.max(levelProfile.stars, stars);
        levelProfile.bestScore = Math.max(prevBest, score);
        profile.stats.totalPlays++;
        profile.stats.totalScore += score;
        profile.stats.totalStars = GameConfig.allGames().reduce((sum, g) => {
            const p = profile.games[g.gameId];
            if (!p) return sum;
            return sum + [1, 2, 3].reduce((s, l) => s + (p.levels[l]?.stars || 0), 0);
        }, 0);

        const session = {
            gameId, level, score, stars, metrics,
            roundsTotal: levelCfg.rounds, parTimeMs,
        };

        const xpResult = XPEngine.computeXP(levelCfg.rewards, {
            stars, mistakes: metrics.mistakes, hintsUsed: metrics.hintsUsed,
        });

        const awards = AwardEngine.evaluate(gameDef, session, profile);
        const awardLoot = AwardEngine.grant(profile, awards);

        const stickers = StickerEngine.evaluate(gameDef, session, profile);
        StickerEngine.grant(profile, gameId, stickers);

        const gems = levelCfg.rewards.gems + stars * 2 + (metrics.mistakes === 0 ? 5 : 0) + awardLoot.gems;

        const beforeLevel = XPEngine.knowledgeLevelForXP(profile.xp).level;
        profile.xp += xpResult.total + awardLoot.xp;
        profile.gems += gems;
        const after = XPEngine.knowledgeLevelForXP(profile.xp);

        SaveEngine.save(profile);

        return {
            gameId, level, gameDef, levelCfg,
            score, breakdown, stars, isNewBest, prevBest,
            xp: xpResult.total + awardLoot.xp,
            xpParts: awardLoot.xp > 0
                ? [...xpResult.parts, { label: 'Huy hiệu', amount: awardLoot.xp }]
                : xpResult.parts,
            gems,
            awards,
            stickers,
            knowledgeLevel: after,
            leveledUp: after.level > beforeLevel,
            worldProgress: ProgressionEngine.worldProgress(profile),
            metrics,
        };
    },
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { RewardEngine };
}
