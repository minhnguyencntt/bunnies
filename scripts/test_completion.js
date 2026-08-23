global.Phaser = { Math: { Clamp: (v, lo, hi) => Math.min(hi, Math.max(lo, v)) } };

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
const { AnalyticsEngine } = require('../src/core/engine/AnalyticsEngine.js');
const { ScoringEngine } = require('../src/core/engine/ScoringEngine.js');
const { StarEngine } = require('../src/core/engine/StarEngine.js');
const { XPEngine } = require('../src/core/engine/XPEngine.js');
const { Award } = require('../src/core/engine/Award.js');
const { AwardEngine } = require('../src/core/engine/AwardEngine.js');
const { StickerEngine } = require('../src/core/engine/StickerEngine.js');
const { ProgressionEngine } = require('../src/core/engine/ProgressionEngine.js');
const { RewardEngine } = require('../src/core/engine/RewardEngine.js');
const { AwardResult } = require('../src/core/engine/AwardResult.js');
const { NextActionResolver, NextActionType } = require('../src/core/engine/NextActionResolver.js');
const { AwardGenerator } = require('../src/core/engine/AwardGenerator.js');
const { RewardPresentationEngine } = require('../src/core/engine/RewardPresentationEngine.js');
const { CompletionEngine } = require('../src/core/engine/CompletionEngine.js');

global.GameConfig = GameConfig;
global.SaveEngine = SaveEngine;
global.ScoringEngine = ScoringEngine;
global.StarEngine = StarEngine;
global.XPEngine = XPEngine;
global.Award = Award;
global.AwardEngine = AwardEngine;
global.StickerEngine = StickerEngine;
global.ProgressionEngine = ProgressionEngine;
global.RewardEngine = RewardEngine;
global.AwardResult = AwardResult;
global.NextActionResolver = NextActionResolver;
global.NextActionType = NextActionType;
global.AwardGenerator = AwardGenerator;
global.RewardPresentationEngine = RewardPresentationEngine;
global.CompletionEngine = CompletionEngine;

function play(gameId, level, rounds) {
    const a = new AnalyticsEngine(gameId, level);
    const n = rounds || GameConfig.getLevel(gameId, level).rounds;
    for (let i = 0; i < n; i++) {
        a.beginRound();
        a.recordAnswer(true);
        a.finishRound();
    }
    return a;
}

function resetStore() {
    Object.keys(store).forEach((k) => delete store[k]);
    CompletionEngine.reset();
}

for (const g of GameConfig.allGames()) {
    resetStore();
    const result = CompletionEngine.completeGame({
        gameId: g.gameId,
        level: 1,
        analytics: play(g.gameId, 1),
        parTimeMs: 15000,
    });
    if (!result.persistOk) throw new Error(`${g.gameId}: persist failed`);
    if (!result.gameName) throw new Error(`${g.gameId}: missing game name`);
    if (!result.rewards.some((r) => r.type === 'sticker' && r.isNew)) {
        throw new Error(`${g.gameId}: no new sticker artwork`);
    }
    if (!result.rewards.every((r) => r.name && r.icon && r.id && r.artwork && r.presentation)) {
        throw new Error(`${g.gameId}: reward is not a first-class Award`);
    }
    const hero = result.hero || Award.pickHero(result.rewards);
    if (!hero || !hero.artwork.glyph) throw new Error(`${g.gameId}: missing hero artwork`);
    if (!result.awardId || !result.title || !result.artwork) {
        throw new Error(`${g.gameId}: AwardResult missing structured fields`);
    }
    if (result.xpEarned <= 0) throw new Error(`${g.gameId}: no XP`);
    if (result.starsEarned <= 0) throw new Error(`${g.gameId}: no stars`);
    if (result.recommendedNextAction !== 'continue') {
        throw new Error(`${g.gameId}: L1 should recommend continue`);
    }
    const primary = result.availableNextActions.filter((a) => a.isPrimary || a.primary);
    if (primary.length !== 1 || primary[0].id !== 'continue' || primary[0].type !== NextActionType.CONTINUE_LEVEL) {
        throw new Error(`${g.gameId}: one primary CONTINUE_LEVEL`);
    }
    if (!primary[0].destination || primary[0].destination.data.level !== 2) {
        throw new Error(`${g.gameId}: continue must open level 2`);
    }
    const ids = result.availableNextActions.map((a) => a.id);
    const types = result.availableNextActions.map((a) => a.type);
    if (!ids.includes('replay') || !ids.includes('levels') || !ids.includes('home')) {
        throw new Error(`${g.gameId}: missing next actions`);
    }
    if (!types.includes(NextActionType.PLAY_AGAIN) || !types.includes(NextActionType.CHOOSE_GAME) || !types.includes(NextActionType.HOME)) {
        throw new Error(`${g.gameId}: missing next-action types`);
    }
    if (ids.includes('continue') === false) throw new Error(`${g.gameId}: L1 missing continue`);
    const again = CompletionEngine.completeGame({
        gameId: g.gameId, level: 1, analytics: play(g.gameId, 1), parTimeMs: 15000,
    });
    if (again !== result) throw new Error(`${g.gameId}: duplicate completeGame not ignored`);
    console.log('ok', g.gameId, result.rewards.filter((r) => r.isNew).map((r) => r.name).join(', '));
}

resetStore();
const l3 = CompletionEngine.completeGame({
    gameId: 'candy_garden',
    level: 3,
    analytics: play('candy_garden', 3),
    parTimeMs: 15000,
});
if (l3.recommendedNextAction !== 'levels') throw new Error('L3 should recommend other games');
if (l3.availableNextActions.find((a) => a.id === 'continue' || a.type === NextActionType.CONTINUE_LEVEL)) {
    throw new Error('L3 must not show CONTINUE');
}
if (!l3.availableNextActions.find((a) => (a.isPrimary || a.primary) && a.id === 'levels' && a.type === NextActionType.CHOOSE_GAME)) {
    throw new Error('L3 primary should be CHOOSE_GAME');
}
if (!GameConfig.hasLevel('candy_garden', 3) || GameConfig.nextLevel('candy_garden', 3) != null) {
    throw new Error('GameConfig.nextLevel must be null on the last level');
}

resetStore();
const failed = RewardPresentationEngine.fromRewards({
    gameId: 'candy_garden', level: 1, score: 10, stars: 1, xp: 10, gems: 2,
    awards: [], stickers: [], metrics: { correctAnswers: 1 },
    gameDef: GameConfig.get('candy_garden'),
    levelCfg: GameConfig.getLevel('candy_garden', 1),
}, { persistOk: false, error: 'test' });
if (failed.persistOk) throw new Error('failed persist marked ok');
if (failed.recommendedNextAction !== 'retry_persist') throw new Error('failed persist needs retry');
if (failed.rewards.some((r) => r.isNew)) throw new Error('must not mark unsaved rewards as new');

console.log('PASS completion engine');
