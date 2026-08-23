/**
 * ScoringEngine.js — unified, child-friendly session scoring (0–100).
 *
 * Score = Accuracy + Speed + Combo + Exploration + Perfect-run + Difficulty bonus
 *         − Hint penalty (small; hints never remove the reward).
 */
const ScoringEngine = {
    /**
     * @param {Object} metrics — from AnalyticsEngine.getMetrics()
     * @param {Object} cfg — level.scoring config
     * @param {number} rounds — configured round count
     * @param {number} parTimeMs — target ms per answer for speed bonus
     * @returns {{ score:number, breakdown:Object }}
     */
    computeSessionScore(metrics, cfg, rounds, parTimeMs) {
        const c = Object.assign({
            accuracyWeight: 55, speedWeight: 15, comboWeight: 10,
            explorationWeight: 5, perfectBonus: 10, difficultyBonus: 0,
            hintPenalty: 3, starThresholds: [40, 75],
        }, cfg || {});

        // Every error (wrong answer, mis-tap, timeout) counts exactly once
        const attempts = Math.max(1, metrics.correctAnswers + metrics.mistakes);
        const accuracy = c.accuracyWeight * (metrics.correctAnswers / attempts);

        let speed = 0;
        if (c.speedWeight > 0 && parTimeMs > 0 && metrics.correctAnswers > 0) {
            const ratio = Phaser.Math.Clamp(parTimeMs / Math.max(1, metrics.avgTimeMs), 0, 1);
            speed = c.speedWeight * ratio;
        }

        const combo = c.comboWeight > 0 && rounds > 0
            ? c.comboWeight * Phaser.Math.Clamp(metrics.bestStreak / rounds, 0, 1)
            : 0;

        const exploration = c.explorationWeight > 0 && metrics.explorationTotal > 0
            ? c.explorationWeight * (metrics.explorationFound / metrics.explorationTotal)
            : (c.explorationWeight > 0 ? c.explorationWeight : 0); // nothing to explore → full marks

        const perfect = metrics.mistakes === 0 ? c.perfectBonus : 0;
        const hintPenalty = Math.min(metrics.hintsUsed * c.hintPenalty, 15);

        const raw = accuracy + speed + combo + exploration + perfect + c.difficultyBonus - hintPenalty;
        const score = Math.round(Phaser.Math.Clamp(raw, 0, 100));

        return {
            score,
            breakdown: {
                accuracy: Math.round(accuracy),
                speed: Math.round(speed),
                combo: Math.round(combo),
                exploration: Math.round(exploration),
                perfect,
                difficultyBonus: c.difficultyBonus,
                hintPenalty,
            },
        };
    },
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ScoringEngine };
}
