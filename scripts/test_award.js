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
const { Award, AwardType, AwardState } = require('../src/core/engine/Award.js');
const { AwardEngine } = require('../src/core/engine/AwardEngine.js');
const { StickerEngine } = require('../src/core/engine/StickerEngine.js');
const { AnalyticsEngine } = require('../src/core/engine/AnalyticsEngine.js');
const { ScoringEngine } = require('../src/core/engine/ScoringEngine.js');
const { StarEngine } = require('../src/core/engine/StarEngine.js');
const { XPEngine } = require('../src/core/engine/XPEngine.js');
const { ProgressionEngine } = require('../src/core/engine/ProgressionEngine.js');
const { RewardEngine } = require('../src/core/engine/RewardEngine.js');
const { RewardPresentationEngine } = require('../src/core/engine/RewardPresentationEngine.js');

global.GameConfig = GameConfig;
global.SaveEngine = SaveEngine;
global.Award = Award;
global.AwardEngine = AwardEngine;
global.StickerEngine = StickerEngine;
global.ScoringEngine = ScoringEngine;
global.StarEngine = StarEngine;
global.XPEngine = XPEngine;
global.ProgressionEngine = ProgressionEngine;
global.RewardEngine = RewardEngine;

function reset() {
    Object.keys(store).forEach((k) => delete store[k]);
}

function play(gameId, level) {
    const a = new AnalyticsEngine(gameId, level);
    const n = GameConfig.getLevel(gameId, level).rounds;
    for (let i = 0; i < n; i++) {
        a.beginRound();
        a.recordAnswer(true);
        a.finishRound();
    }
    return a;
}

const required = ['id', 'type', 'name', 'description', 'hint', 'rarity', 'rarityStyle', 'icon', 'artwork', 'presentation', 'persisted'];
for (const s of GameConfig.allStickers()) {
    const award = Award.hydrate(s, { type: AwardType.STICKER, persistOk: true });
    for (const key of required) {
        if (award[key] == null) throw new Error(`${s.id} missing ${key}`);
    }
    if (!award.artwork.glyph || !award.artwork.kind) throw new Error(`${s.id} artwork incomplete`);
    if (award.presentation.state !== AwardState.LOCKED && award.presentation.state !== AwardState.OWNED) {
        throw new Error(`${s.id} unexpected default state ${award.presentation.state}`);
    }
}
for (const a of GameConfig.allAwards()) {
    const award = Award.fromCatalog(a.id, { persistOk: true });
    if (!award || award.type !== AwardType.BADGE) throw new Error(`${a.id} catalog lookup failed`);
    if (!award.artwork.palette) throw new Error(`${a.id} missing rarity palette`);
}

reset();
const pending = Award.hydrate(GameConfig.allStickers()[0], {
    type: AwardType.STICKER, isNew: true, persistOk: false,
});
if (pending.isNew) throw new Error('unsaved award must not be isNew');
if (pending.state !== AwardState.PENDING) throw new Error('unsaved award must be PENDING');
if (pending.persisted) throw new Error('unsaved award must not be persisted');

const revealed = Award.hydrate(GameConfig.allStickers()[0], {
    type: AwardType.STICKER, isNew: true, owned: true, persistOk: true, gameId: 'candy_garden',
});
if (revealed.state !== AwardState.REVEALED) throw new Error('saved new award must be REVEALED');
if (!revealed.persisted) throw new Error('saved new award must be persisted');

reset();
const result = RewardPresentationEngine.present({
    gameId: 'candy_garden', level: 1, analytics: play('candy_garden', 1), parTimeMs: 15000,
});
if (!result.persistOk) throw new Error('present persist failed');
const hero = Award.pickHero(result.rewards);
if (!hero) throw new Error('no hero award');
if (!hero.id || !hero.artwork.glyph || !hero.presentation) throw new Error('hero is not a first-class Award');
if (!hero.isNew || hero.state !== AwardState.REVEALED) throw new Error('first clear should reveal a new award');
if (!Award.verifyOwned(hero, SaveEngine.load())) throw new Error('hero not in save');

const album = StickerEngine.albumData(SaveEngine.load());
const garden = album.find((a) => a.gameId === 'candy_garden');
const sticker = result.rewards.find((r) => r.type === AwardType.STICKER && r.isNew);
if (!sticker) throw new Error('no new sticker to sync');
const same = garden.stickers.find((s) => s.id === sticker.id);
if (!same || !same.owned || !same.artwork || same.artwork.glyph !== sticker.artwork.glyph) {
    throw new Error('album award identity/artwork mismatch');
}

const saved = Award.fromSave(SaveEngine.load());
if (!saved.some((a) => a.id === hero.id && a.owned && a.persisted)) {
    throw new Error('fromSave missing persisted hero');
}

console.log('PASS award domain', hero.name, hero.type, hero.state);
