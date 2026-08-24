/**
 * AdaptiveDifficultyEngine.js — adjusts difficulty WITHIN the current level.
 * Watches rolling accuracy, streaks, mistakes and hint usage, then nudges
 * parameters up or down one gentle tier. Never jumps more than one tier.
 */
class AdaptiveDifficultyEngine {
    constructor(baseDifficulty) {
        this.base = Object.assign({}, baseDifficulty);
        this.tier = 0; // -2 … +2
    }

    /** Call after each evaluated answer. */
    update(analytics) {
        const recent = analytics.recentAccuracy(3);
        const consecutiveMistakes = analytics.consecutiveMistakes();
        const totalAnswers = analytics.answers.length;

        if (totalAnswers >= 3 && recent >= 1 && analytics.hintsUsed === 0 && this.tier < 2) {
            this.tier++;
        } else if ((consecutiveMistakes >= 2 || (totalAnswers >= 3 && recent <= 0.34)) && this.tier > -2) {
            this.tier--;
        }
    }

    /** Current effective difficulty config for the next round. */
    current() {
        const d = Object.assign({}, this.base);
        const t = this.tier;
        if (d.mathRange > 0) d.mathRange = Math.max(3, d.mathRange + t * 2);
        if (d.choiceCount > 0) d.choiceCount = Phaser.Math.Clamp(d.choiceCount + (t > 0 ? 1 : t < 0 ? -1 : 0), 2, 4);
        if (d.timeLimit > 0) d.timeLimit = Math.round(d.timeLimit * (1 - t * 0.12));
        if (d.sequenceLength > 0) d.sequenceLength = Math.max(2, d.sequenceLength + t);
        if (d.objectCount > 0) d.objectCount = Math.max(3, d.objectCount + t);
        if (d.paletteSize > 0) d.paletteSize = Phaser.Math.Clamp(d.paletteSize + t, 2, 7);
        if (t < 0) d.hintLevel = Math.min(3, d.hintLevel + 1); // struggling → richer hints
        return d;
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AdaptiveDifficultyEngine };
}
