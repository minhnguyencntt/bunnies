/**
 * puzzle.js — Bunny Khám Phá Thế Giới: theme + lời tiếng Việt.
 */
const WorldExplorerPuzzle = {
    version: 1,
    copy: {
        intro: {
            1: 'Cùng Bunny bay đi! Nhìn quốc kỳ, rồi tìm tên đất nước nhé!',
            2: 'Tìm tên nước, rồi tìm thủ đô. Bunny đang đợi bạn trên máy bay!',
            3: 'Khám phá châu lục, thủ đô và một điều thú vị cùng Bunny nào!',
        },
        continue: 'Tiếp tục khám phá',
        atlasTitle: 'THẾ GIỚI',
        atlasClose: 'Đóng',
        capitalLabel: 'Thủ đô',
        discovered: 'đã được khám phá!',
        retry: 'Gần đúng rồi! Nhìn kỹ lá cờ rồi chọn lại nhé.',
    },
    continentNames: {
        asia: 'Châu Á',
        europe: 'Châu Âu',
        africa: 'Châu Phi',
        north_america: 'Bắc Mỹ',
        south_america: 'Nam Mỹ',
        oceania: 'Châu Đại Dương',
    },
    continentEmoji: {
        asia: '🌏',
        europe: '🏰',
        africa: '🦁',
        north_america: '🗽',
        south_america: '🦜',
        oceania: '🏝️',
    },
    factIcons: {
        geography: '🌍',
        capital: '🏙️',
        culture: '🎏',
        food: '🍜',
        nature: '🌸',
        animals: '🐼',
        landmarks: '🗼',
        language: '🗣️',
        history: '🏛️',
        technology: '🚄',
        fun: '⭐',
    },
    biomes: {
        tropical: {
            skyTop: 0x4fc3f7, skyBottom: 0xfff59d, land: 0x66bb6a, land2: 0x43a047,
            deco: ['🌴', '🌺', '🦜', '🍌'], particle: [0xfff176, 0x81c784],
        },
        rainforest: {
            skyTop: 0x26a69a, skyBottom: 0xc5e1a5, land: 0x2e7d32, land2: 0x558b2f,
            deco: ['🌿', '🦋', '🦜', '🌳'], particle: [0xa5d6a7, 0xfff59d],
        },
        desert: {
            skyTop: 0x4fc3f7, skyBottom: 0xffcc80, land: 0xffcc80, land2: 0xffb74d,
            deco: ['🌵', '☀️', '🐪', '🏜️'], particle: [0xffe082, 0xffffff],
        },
        mountain: {
            skyTop: 0x90caf9, skyBottom: 0xe3f2fd, land: 0x8d6e63, land2: 0xb0bec5,
            deco: ['🏔️', '🌲', '🦅', '❄️'], particle: [0xffffff, 0xbbdefb],
        },
        arctic: {
            skyTop: 0x1a237e, skyBottom: 0x81d4fa, land: 0xe3f2fd, land2: 0xb3e5fc,
            deco: ['🐧', '❄️', '🦭', '🌌'], particle: [0xffffff, 0x80deea],
        },
        temperate: {
            skyTop: 0x81d4fa, skyBottom: 0xfff9c4, land: 0x81c784, land2: 0xaed581,
            deco: ['🌼', '🌳', '🦢', '🏡'], particle: [0xfff59d, 0xffffff],
        },
        island: {
            skyTop: 0x4dd0e1, skyBottom: 0xfff59d, land: 0x26c6da, land2: 0x66bb6a,
            deco: ['🏖️', '🐚', '🐠', '⛵'], particle: [0x80deea, 0xffffff],
        },
        city: {
            skyTop: 0x90caf9, skyBottom: 0xffe0b2, land: 0x90a4ae, land2: 0x78909c,
            deco: ['🏙️', '🎈', '✈️', '✨'], particle: [0xfff59d, 0xffffff],
        },
    },
    world: {
        skyTop: 0x4fc3f7, skyBottom: 0xffe082, ocean: 0x4dd0e1,
        deco: ['✈️', '🎈', '☁️', '⭐'],
        particleColors: [0xffffff, 0xfff59d, 0x80deea],
    },
    biomeOf(country) {
        const key = (country && country.landscape) || 'temperate';
        return this.biomes[key] || this.biomes.temperate;
    },
    worldForLevel() {
        return this.world;
    },
};

if (typeof module !== 'undefined') module.exports = { WorldExplorerPuzzle };
