/**
 * puzzle.js — Rừng Diệu Kỳ (Forest Adventure): theme data for Bunny Subtraction.
 * Visual identity: magical forest — deep greens, mushrooms, fireflies, butterflies.
 */
const ForestAdventurePuzzle = {
    version: 1,
    operation: 'subtract',

    // Objects shown in questions (some "fly away" during subtraction)
    objectPool: ['🍄', '🌰', '🦋', '✨', '🌸', '🐞'],

    palette: {
        skyTop: 0x1b5e20, skyBottom: 0x66bb6a,
        hill1: 0x2e7d32, hill2: 0x388e3c,
        ground: 0x33691e,
        accent: 0xaed581,
        panel: 0x1b5e20,
    },

    decor: ['🌳', '🍄', '🌿', '🦋', '🌼'],

    particleColors: [0xaed581, 0xfff176, 0x80deea, 0xffcc80, 0xffffff],

    praise: ['Giỏi quá!', 'Thật phiêu lưu!', 'Tuyệt vời!', 'Siêu thám hiểm!'],
};
