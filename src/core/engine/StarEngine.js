/**
 * StarEngine.js — maps a session score to a 1–3 star rating.
 * Completing the game always earns ⭐; ⭐⭐ and ⭐⭐⭐ require real performance.
 */
const StarEngine = {
    starsForScore(score, thresholds) {
        const t = thresholds || [40, 75];
        if (score >= t[1]) return 3;
        if (score >= t[0]) return 2;
        return 1;
    },

    /** Progress (0..1) toward the next star threshold — for the HUD meter. */
    progressToNextStar(score, thresholds) {
        const t = thresholds || [40, 75];
        if (score >= t[1]) return 1;
        if (score >= t[0]) return (score - t[0]) / (t[1] - t[0]);
        return score / t[0];
    },
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { StarEngine };
}
