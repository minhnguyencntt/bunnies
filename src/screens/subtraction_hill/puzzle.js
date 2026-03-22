/**
 * puzzle.js — Đồi Phép Trừ: dữ liệu theme (đồ mất, audio keys, events).
 * Load trước `screen.js` trong index.html (cùng pattern Counting Forest / Mirror City).
 */
const SubtractionHillPuzzle = {
    version: 1,

    lostItemPool: [
        { id: 'toy', emoji: '🧸', labelVi: 'Thú bông' },
        { id: 'book', emoji: '📘', labelVi: 'Sách nhỏ' },
        { id: 'hat', emoji: '🎩', labelVi: 'Mũ' },
        { id: 'candy', emoji: '🍬', labelVi: 'Kẹo' },
        { id: 'lantern', emoji: '🏮', labelVi: 'Đèn lồng' },
        { id: 'ball', emoji: '⚽', labelVi: 'Quả bóng' },
        { id: 'flower', emoji: '🌼', labelVi: 'Hoa' },
        { id: 'star', emoji: '⭐', labelVi: 'Ngôi sao' },
        { id: 'apple', emoji: '🍎', labelVi: 'Táo' },
        { id: 'boat', emoji: '⛵', labelVi: 'Thuyền giấy' }
    ],

    shuffle(arr) {
        const a = arr.slice();
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    },

    /**
     * Random subset of lost items for one play-through (one item per puzzle).
     * @param {number} count — usually equals total puzzles
     * @returns {Array<{id, emoji, labelVi}>}
     */
    getLostItemsForLevel(count) {
        const n = Math.min(Math.max(1, count), this.lostItemPool.length);
        return this.shuffle(this.lostItemPool).slice(0, n);
    },

    /** Phaser `this.load.audio` keys — khớp `screen.js` preload */
    audio: {
        bgm: 'bgm_subtraction_hill',
        intro1: 'voice_intro_1',
        intro2: 'voice_intro_2',
        intro3: 'voice_intro_3',
        correctVoice: 'voice_correct',
        wrongVoice: 'voice_wrong',
        completeVoice: 'voice_complete'
    },

    events: {
        correct: 'SubtractionHillScreen:CorrectAnswer',
        wrong: 'SubtractionHillScreen:WrongAnswer',
        itemCollected: 'SubtractionHillScreen:ItemCollected',
        levelComplete: 'SubtractionHillScreen:LevelComplete'
    }
};
