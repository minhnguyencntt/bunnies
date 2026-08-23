/**
 * HintEngine.js — difficulty-scaled hints.
 * Level 1: direct visual guidance. Level 2: partial guidance. Level 3: conceptual hints.
 * Hints cost a few score points but never remove rewards — the goal is learning.
 */
const HintEngine = {
    styleForLevel(levelCfg) {
        const h = levelCfg?.difficulty?.hintLevel ?? 2;
        if (h >= 3) return 'direct';
        if (h === 2) return 'partial';
        return 'conceptual';
    },

    /**
     * @param {Object} levelCfg — level config (has .hints array)
     * @param {number} hintsUsedSoFar — rotates through the hint list
     * @returns {{ text:string, style:'direct'|'partial'|'conceptual' }}
     */
    getHint(levelCfg, hintsUsedSoFar) {
        const list = levelCfg?.hints?.length ? levelCfg.hints : ['Hãy thử lại nhé!'];
        const text = list[Math.min(hintsUsedSoFar, list.length - 1)];
        return { text, style: this.styleForLevel(levelCfg) };
    },
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { HintEngine };
}
