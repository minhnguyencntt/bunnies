const store = {};
global.localStorage = {
    getItem: (k) => (k in store ? store[k] : null),
    setItem: (k, v) => { store[k] = String(v); },
    removeItem: (k) => { delete store[k]; },
    get length() { return Object.keys(store).length; },
    key(i) { return Object.keys(store)[i]; },
};

const { GameConfig } = require('../src/core/engine/GameConfig.js');
const { SaveEngine } = require('../src/core/engine/SaveEngine.js');
const { AwardEngine } = require('../src/core/engine/AwardEngine.js');
const { StickerEngine } = require('../src/core/engine/StickerEngine.js');
global.GameConfig = GameConfig;
global.SaveEngine = SaveEngine;

function session(gameId, level, plays) {
    return {
        gameId, level, score: 80, stars: 3,
        metrics: { correctAnswers: 5, mistakes: 0, hintsUsed: 0, bestStreak: 5, perfectRounds: 5, durationMs: 8000 },
        roundsTotal: 5, parTimeMs: 15000,
    };
}

for (const g of GameConfig.allGames()) {
    Object.keys(store).forEach((k) => delete store[k]);
    const profile = SaveEngine.defaultProfile();
    SaveEngine.gameProfile(profile, g.gameId).plays = 1;
    profile.stats.totalPlays = 1;
    const s = session(g.gameId, 1, 1);
    const awards = AwardEngine.evaluate(g, s, profile);
    const stickers = StickerEngine.evaluate(g, s, profile);
    if (!awards.length) throw new Error(`${g.gameId}: no awards on first finish`);
    if (!stickers.length) throw new Error(`${g.gameId}: no stickers on first finish`);
    const line = [];
    if (stickers.length) line.push(`Sticker mới: ${stickers.map((x) => x.name).join(', ')}`);
    if (awards.length) line.push(`Huy hiệu mới: ${awards.map((x) => x.name).join(', ')}`);
    if (!/Sticker mới/.test(line.join('. '))) throw new Error(`${g.gameId}: missing sticker announce`);
    console.log('ok', g.gameId, '|', line.join('. '));
}
console.log('PASS first-level award + sticker announce');
