/**
 * AnalyticsEngine.js — per-session gameplay metrics.
 * Tracks accuracy, speed, mistakes, hints, retries, streaks, exploration.
 * Feeds the Scoring, Adaptive-Difficulty and Reward engines.
 */
class AnalyticsEngine {
    constructor(gameId, level) {
        this.gameId = gameId;
        this.level = level;
        this.startedAt = Date.now();
        this.answers = []; // { correct, timeMs, roundIndex }
        this.hintsUsed = 0;
        this.retries = 0;
        this.mistakes = 0;      // wrong answers + fumbles + timeouts
        this.explorationFound = 0;
        this.explorationTotal = 0;
        this.currentStreak = 0;
        this.bestStreak = 0;
        this.roundsCompleted = 0;
        this.perfectRounds = 0; // rounds finished with no mistake inside
        this._roundStart = 0;
        this._roundHadMistake = false;
    }

    beginRound() {
        this._roundStart = Date.now();
        this._roundHadMistake = false;
    }

    recordAnswer(correct) {
        const timeMs = this._roundStart ? Date.now() - this._roundStart : 0;
        this.answers.push({ correct: !!correct, timeMs, roundIndex: this.roundsCompleted });
        if (correct) {
            this.currentStreak++;
            this.bestStreak = Math.max(this.bestStreak, this.currentStreak);
        } else {
            this.currentStreak = 0;
            this.mistakes++;
            this._roundHadMistake = true;
        }
    }

    recordMistake() { // non-answer mistake (mis-tap, fumble, timeout)
        this.mistakes++;
        this._roundHadMistake = true;
        this.currentStreak = 0;
    }

    recordHint() { this.hintsUsed++; }
    recordRetry() { this.retries++; }
    recordExploration(found, total) {
        this.explorationFound += found;
        this.explorationTotal += total;
    }

    finishRound() {
        this.roundsCompleted++;
        if (!this._roundHadMistake) this.perfectRounds++;
    }

    recentAccuracy(n = 3) {
        const recent = this.answers.slice(-n);
        if (!recent.length) return 1;
        return recent.filter(a => a.correct).length / recent.length;
    }

    consecutiveMistakes() {
        let n = 0;
        for (let i = this.answers.length - 1; i >= 0; i--) {
            if (this.answers[i].correct) break;
            n++;
        }
        return n;
    }

    getMetrics() {
        const total = this.answers.length;
        const correct = this.answers.filter(a => a.correct).length;
        const times = this.answers.filter(a => a.correct).map(a => a.timeMs);
        const avgTimeMs = times.length ? times.reduce((s, t) => s + t, 0) / times.length : 0;
        return {
            gameId: this.gameId,
            level: this.level,
            totalAnswers: total,
            correctAnswers: correct,
            accuracy: total ? correct / total : 1,
            avgTimeMs,
            mistakes: this.mistakes,
            hintsUsed: this.hintsUsed,
            retries: this.retries,
            bestStreak: this.bestStreak,
            roundsCompleted: this.roundsCompleted,
            perfectRounds: this.perfectRounds,
            explorationFound: this.explorationFound,
            explorationTotal: this.explorationTotal,
            durationMs: Date.now() - this.startedAt,
        };
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AnalyticsEngine };
}
