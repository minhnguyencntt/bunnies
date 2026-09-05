/**
 * puzzle.js — Mê Cung Cà Rốt: theme + lời tiếng Việt.
 */
const BunnyMazePuzzle = {
    version: 1,
    copy: {
        intro: {
            1: 'Bunnine đói cà rốt rồi! Chạm ô đất cạnh Bunnine để dẫn đi nào!',
            2: 'Cổng gỗ chắn đường. Tìm chìa rồi mở cổng giúp Bunnine nhé!',
            3: 'Bạn ốc sên đang dạo chơi. Tránh bạn ấy rồi tìm cà rốt nào!',
        },
        hints: {
            1: 'Đi tiếp ô sáng này nhé!',
            2: 'Tìm chìa trước, rồi mới mở cổng.',
            3: 'Tránh bạn đang dạo, rồi đi ô sáng nào!',
        },
        goal: '🐰  →  🥕',
    },
    themes: {
        forest: {
            skyTop: 0x7ec8e3, skyBottom: 0xffe082, grass: 0x7cb342,
            hill1: 0x66bb6a, hill2: 0x9ccc65, hill3: 0x558b2f,
            sun: 0xfff176, canopy: 0x2e7d32, dirt: 0xc4a574,
            dirtLine: 0x8d6e46, wall: '🌳',
            deco: ['🍄', '🌸', '🌿', '🥕', '🌳'],
            particleColors: [0xfff59d, 0xa5d6a7, 0xffcc80, 0xffffff],
        },
        garden: {
            skyTop: 0x81d4fa, skyBottom: 0xf8bbd0, grass: 0x9ccc65,
            hill1: 0xaed581, hill2: 0xf48fb1, hill3: 0x7cb342,
            sun: 0xffecb3, canopy: 0x43a047, dirt: 0xd7b899,
            dirtLine: 0xa1887f, wall: '🪴',
            deco: ['🌷', '🦋', '🌱', '🥕', '🌼'],
            particleColors: [0xff80ab, 0xfff59d, 0x81d4fa, 0xffffff],
        },
        meadow: {
            skyTop: 0xfff8e1, skyBottom: 0xc5e1a5, grass: 0xaed581,
            hill1: 0xc5e1a5, hill2: 0xffcc80, hill3: 0x9ccc65,
            sun: 0xffee58, canopy: 0x689f38, dirt: 0xcbab7a,
            dirtLine: 0x8d6e63, wall: '🌾',
            deco: ['🌼', '🐞', '☁️', '🥕', '🌻'],
            particleColors: [0xfff176, 0xffcc80, 0xaed581, 0xffffff],
        },
        magic: {
            skyTop: 0x9575cd, skyBottom: 0xffecb3, grass: 0x66bb6a,
            hill1: 0x81c784, hill2: 0xce93d8, hill3: 0x5e35b1,
            sun: 0xfff59d, canopy: 0x6a1b9a, dirt: 0xce93d8,
            dirtLine: 0x7e57c2, wall: '🍄',
            deco: ['✨', '🌙', '🧚', '🥕', '🔮'],
            particleColors: [0xce93d8, 0xfff59d, 0x80deea, 0xffffff],
        },
    },
    worldForLevel(level) {
        return this.themeOf({ 1: 'forest', 2: 'garden', 3: 'magic' }[level] || 'forest');
    },
    friends: ['🐌', '🐸', '🦔'],
    themeOf(id) {
        return this.themes[id] || this.themes.forest;
    },
};

if (typeof module !== 'undefined') module.exports = { BunnyMazePuzzle };
