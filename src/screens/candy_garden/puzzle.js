/**
 * puzzle.js — Vườn Kẹo Ngọt (Candy Garden): theme data for Bunny Addition.
 * Visual identity: pastel candy world — pink sky, candy hills, lollipops.
 */
const CandyGardenPuzzle = {
    version: 1,
    operation: 'add',

    // Objects shown in questions (big, cute, countable)
    objectPool: ['🍬', '🍭', '🍓', '🧁', '🍩', '⭐'],

    // World palette
    palette: {
        skyTop: 0xffc1e3, skyBottom: 0xfff3e0,
        hill1: 0xf8bbd0, hill2: 0xf48fb1,
        ground: 0xffe0ec,
        accent: 0xff69b4,
        panel: 0xad1457,
    },

    // Decorative emojis scattered in the world
    decor: ['🍭', '🧁', '🍬', '🎀', '🌈'],

    particleColors: [0xff69b4, 0xffd700, 0xff9ff3, 0xfeca57, 0xffffff],

    praise: ['Siêu Bunnine!', 'Ngọt quá!', 'Tuyệt vời!', 'Giỏi quá!'],
};
