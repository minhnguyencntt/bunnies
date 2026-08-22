/**
 * XPEngine.js — XP & Knowledge Level progression.
 * Higher levels give more base XP (difficulty-aware) without punishing
 * children who stay at their comfortable level.
 */
const XPEngine = {
    xpForLevel(knowledgeLevel) {
        return 100 + (knowledgeLevel - 1) * 80; // XP needed to go from level N → N+1
    },

    knowledgeLevelForXP(xp) {
        let level = 1;
        let remaining = xp;
        while (remaining >= this.xpForLevel(level) && level < 50) {
            remaining -= this.xpForLevel(level);
            level++;
        }
        return { level, intoLevel: remaining, needed: this.xpForLevel(level) };
    },

    /**
     * @param {Object} rewardCfg — level.rewards { baseXP, threeStarXP, perfectXP, noHintXP }
     * @param {Object} session — { stars, mistakes, hintsUsed }
     */
    computeXP(rewardCfg, session) {
        const parts = [{ label: 'Hoàn thành', amount: rewardCfg.baseXP }];
        if (session.stars >= 3) parts.push({ label: '3 sao', amount: rewardCfg.threeStarXP });
        if (session.mistakes === 0) parts.push({ label: 'Hoàn hảo', amount: rewardCfg.perfectXP });
        if (session.hintsUsed === 0) parts.push({ label: 'Không gợi ý', amount: rewardCfg.noHintXP });
        return {
            total: parts.reduce((s, p) => s + p.amount, 0),
            parts,
        };
    },
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { XPEngine };
}
