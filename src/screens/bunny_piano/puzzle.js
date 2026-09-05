/**
 * puzzle.js — Vườn Nhạc Bunnine: theme + copy tiếng Việt + màu phím.
 */
const BunnyPianoPuzzle = {
    version: 3,
    copy: {
        intro: {
            1: 'Bunnine chơi giai điệu trước. Nhìn nốt trên khuông nhạc, rồi bấm phím piano nhé!',
            2: 'Đọc nốt trên khuông nhạc rồi tìm phím piano tương ứng nhé!',
            3: 'Theo cả khuông nhạc. Nhìn nốt đang sáng rồi bấm phím đó nhé!',
        },
        hints: {
            1: 'Nhìn nốt đang sáng trên khuông nhạc, rồi bấm phím piano.',
            2: 'Nốt cao hơn nằm phía trên khuông nhạc.',
            3: 'Đọc vị trí nốt trên khuông, rồi tìm phím.',
        },
        goal: '🎵 Giai điệu',
        listen: 'Nghe Bunnine chơi nào!',
        yourTurn: 'Đến lượt bạn! Nhìn nốt trên khuông nhạc.',
        songPractice: 'Học bài hát',
        freePlay: 'Piano tự do',
        backMelody: 'Về giai điệu',
        memoryOn: 'Bunny nhớ?',
        memoryOff: 'Hiện nốt',
        listenAgain: 'Nghe lại',
        showMe: 'Chỉ giúp',
        practicePart: 'Đoạn này',
        speedSlow: '🐢 Chậm',
        speedNormal: '▶ Vừa',
        speedFast: '🚀 Nhanh',
        wrong: 'Gần đúng rồi! Thử lại nốt này nhé.',
    },
    keys: [
        { id: 'C', label: 'C', color: 0xff8a80 },
        { id: 'D', label: 'D', color: 0xffcc80 },
        { id: 'E', label: 'E', color: 0xfff176 },
        { id: 'F', label: 'F', color: 0xaed581 },
        { id: 'G', label: 'G', color: 0x80deea },
        { id: 'A', label: 'A', color: 0x90caf9 },
        { id: 'B', label: 'B', color: 0xce93d8 },
        { id: 'C5', label: 'C', color: 0xf48fb1 },
    ],
    themes: {
        garden: {
            skyTop: 0x81d4fa, skyBottom: 0xf8bbd0, grass: 0x9ccc65,
            hill1: 0xaed581, hill2: 0xf48fb1, canopy: 0x43a047, sun: 0xffecb3,
            deco: ['🌸', '🌷', '🦋', '♪'],
            particleColors: [0xff80ab, 0xfff59d, 0x81d4fa, 0xffffff],
        },
        meadow: {
            skyTop: 0xfff8e1, skyBottom: 0xc5e1a5, grass: 0xaed581,
            hill1: 0xc5e1a5, hill2: 0xffcc80, canopy: 0x689f38, sun: 0xffee58,
            deco: ['🌼', '🌻', '♪', '☁️'],
            particleColors: [0xfff176, 0xffcc80, 0xaed581, 0xffffff],
        },
        magic: {
            skyTop: 0xb39ddb, skyBottom: 0xffecb3, grass: 0x81c784,
            hill1: 0xce93d8, hill2: 0x80deea, canopy: 0x7e57c2, sun: 0xfff59d,
            deco: ['✨', '🌙', '♪', '🧚'],
            particleColors: [0xce93d8, 0xfff59d, 0x80deea, 0xffffff],
        },
    },
    themeOf(id) {
        return this.themes[id] || this.themes.garden;
    },
    worldForLevel(level) {
        return this.themeOf({ 1: 'garden', 2: 'meadow', 3: 'magic' }[level] || 'garden');
    },
    keyOf(id) {
        return this.keys.find((k) => k.id === id) || this.keys[0];
    },
};

if (typeof module !== 'undefined') module.exports = { BunnyPianoPuzzle };
