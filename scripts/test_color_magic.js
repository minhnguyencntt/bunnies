global.Phaser = { Math: { Clamp: (v, lo, hi) => Math.min(hi, Math.max(lo, v)) } };

const store = {};
global.localStorage = {
    getItem: (k) => (k in store ? store[k] : null),
    setItem: (k, v) => { store[k] = String(v); },
    removeItem: (k) => { delete store[k]; },
    get length() { return Object.keys(store).length; },
    key(i) { return Object.keys(store)[i]; },
};

const { ColorMagicPuzzle: P } = require('../src/screens/color_magic/puzzle.js');
const { GameConfig } = require('../src/core/engine/GameConfig.js');
const { AnalyticsEngine } = require('../src/core/engine/AnalyticsEngine.js');
const { ScoringEngine } = require('../src/core/engine/ScoringEngine.js');
const { AdaptiveDifficultyEngine } = require('../src/core/engine/AdaptiveDifficultyEngine.js');
const { SaveEngine } = require('../src/core/engine/SaveEngine.js');
const { Award } = require('../src/core/engine/Award.js');
const { AwardEngine } = require('../src/core/engine/AwardEngine.js');
const { StickerEngine } = require('../src/core/engine/StickerEngine.js');
const { StarEngine } = require('../src/core/engine/StarEngine.js');
const { XPEngine } = require('../src/core/engine/XPEngine.js');
const { ProgressionEngine } = require('../src/core/engine/ProgressionEngine.js');
const { RewardEngine } = require('../src/core/engine/RewardEngine.js');
const { AwardResult } = require('../src/core/engine/AwardResult.js');
const { NextActionResolver } = require('../src/core/engine/NextActionResolver.js');
const { AwardGenerator } = require('../src/core/engine/AwardGenerator.js');
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
global.AwardGenerator = AwardGenerator;

function assert(cond, msg) {
    if (!cond) throw new Error(msg);
}

function seqRand(seed) {
    let s = seed;
    return () => {
        s = (s * 16807) % 2147483647;
        return (s - 1) / 2147483646;
    };
}

const def = GameConfig.get('color_magic');
assert(def && def.sceneKey === 'ColorMagicScreen', 'game registered');
assert(def.stickers.length === 6, '6 stickers');
assert(def.awards.length === 3, '3 awards');
assert(GameConfig.nextLevel('color_magic', 1) === 2, 'next level 2');
assert(GameConfig.nextLevel('color_magic', 3) == null, 'no level 4');

assert(P.ARTWORKS.length >= 20, 'enough artworks');
const themes = {};
P.ARTWORKS.forEach((a) => { themes[a.theme] = true; });
['rainbow_garden', 'candy_land', 'ocean', 'fairy_tale', 'space'].forEach((t) => {
    assert(themes[t], 'missing theme ' + t);
});

P.ARTWORKS.forEach((a) => {
    assert(a.regions.length >= 2, a.id + ' too few regions');
    assert(a.patterns.length >= 1, a.id + ' no patterns');
    a.patterns.forEach((pat, i) => {
        a.regions.forEach((r) => {
            assert(P.COLORS[pat[r.id]], `${a.id} pattern ${i} missing valid color for ${r.id}`);
        });
    });
});

const easy = GameConfig.getLevel('color_magic', 1).difficulty;
const med = GameConfig.getLevel('color_magic', 2).difficulty;
const hard = GameConfig.getLevel('color_magic', 3).difficulty;
assert(easy.objectCount <= 3 && easy.paletteSize <= 3 && easy.timeLimit === 0, 'easy dims');
assert(med.objectCount >= 4 && med.paletteSize >= 4 && med.timeLimit > 0, 'medium dims');
assert(hard.objectCount >= 7 && hard.paletteSize >= 5 && hard.memoryLoad >= 3, 'hard dims');

function sample(diff, n, seed) {
    const out = [];
    const rand = seqRand(seed);
    const exclude = [];
    for (let i = 0; i < n; i++) {
        const ch = P.generateChallenge(diff, { random: rand, excludeIds: exclude });
        exclude.push(ch.artworkId);
        if (exclude.length > 8) exclude.shift();
        out.push(ch);
    }
    return out;
}

sample(easy, 12, 3).forEach((ch) => {
    assert(ch.regionCount >= 2 && ch.regionCount <= 3, 'easy regions ' + ch.regionCount);
    assert(ch.colorCount >= 2 && ch.colorCount <= 3, 'easy colors ' + ch.colorCount);
    assert(ch.referenceMode === 'full', 'easy reference');
    assert(ch.peekMs === 0, 'easy no peek');
});
sample(med, 12, 11).forEach((ch) => {
    assert(ch.regionCount >= 4 && ch.regionCount <= 6, 'medium regions ' + ch.regionCount);
    assert(ch.colorCount >= 3 && ch.colorCount <= 5, 'medium colors ' + ch.colorCount);
    assert(ch.referenceMode === 'compact', 'medium reference');
});
sample(hard, 12, 21).forEach((ch) => {
    assert(ch.regionCount >= 7 && ch.regionCount <= 10, 'hard regions ' + ch.regionCount + ' ' + ch.artworkId);
    assert(ch.colorCount >= 5 && ch.colorCount <= 7, 'hard colors ' + ch.colorCount);
    assert(ch.referenceMode === 'peek', 'hard peek');
    assert(ch.peekMs > 0, 'hard peek ms');
});

const bunny = P.generateChallenge({ objectCount: 3, paletteSize: 3, memoryLoad: 1 }, {
    random: () => 0,
    excludeIds: P.ARTWORKS.filter((a) => a.id !== 'bunny').map((a) => a.id),
});
assert(bunny.artworkId === 'bunny', 'forced bunny');
bunny.regions.forEach((r) => {
    const art = P.artwork('bunny');
    const allowed = art.patterns.some((p) => p[r.id] === r.colorId);
    assert(allowed, 'invented color ' + r.id + ' ' + r.colorId);
});

assert(P.pointInShape({ type: 'circle', x: 0, y: 0, r: 10 }, 0, 0), 'circle hit');
assert(!P.pointInShape({ type: 'circle', x: 0, y: 0, r: 10 }, 20, 0), 'circle miss');
assert(P.pointInShape({ type: 'circle', x: 0, y: 0, r: 10 }, 14, 0, 5), 'circle pad');
assert(P.pointInShape({ type: 'ellipse', x: 0, y: 0, w: 20, h: 10 }, 0, 0), 'ellipse hit');
assert(P.pointInShape({ type: 'roundrect', x: 0, y: 0, w: 20, h: 10 }, 5, 2), 'rect hit');

const ch = P.generateChallenge(easy, { random: seqRand(99) });
const session = P.createSession(ch);
assert(!P.isComplete(session.fills, ch), 'start incomplete');
assert(P.remaining(session.fills, ch).length === ch.regions.length, 'all remaining');

const first = ch.regions[0];
const wrongColor = ch.palette.find((id) => id !== first.colorId) || 'red';
let r = P.applyColor(session, first.id, wrongColor === first.colorId ? 'blue' : wrongColor);
assert(r.kind === 'wrong', 'wrong color');
assert(session.fills[first.id] !== first.colorId, 'wrong must not fill');
assert(!session.completed, 'not complete after wrong');

r = P.applyColor(session, first.id, first.colorId);
assert(r.kind === 'correct', 'correct fill');
assert(session.fills[first.id] === first.colorId, 'fill persisted');

r = P.applyColor(session, first.id, first.colorId);
assert(r.kind === 'already', 'already filled');

ch.regions.forEach((reg) => {
    P.applyColor(session, reg.id, reg.colorId);
});
assert(P.isComplete(session.fills, ch), 'complete');
assert(session.completed, 'session flag');
r = P.applyColor(session, first.id, first.colorId);
assert(r.kind === 'locked', 'duplicate complete locked');

const hit = P.hitRegion(ch, first.shape.x, first.shape.y, 1);
assert(hit && hit.id, 'hit region');
assert(P.hitRegion(ch, first.shape.x + 8, first.shape.y, 1, { pad: 12 }), 'padded hit');
assert(P.hitRegion(ch, first.shape.x + 20, first.shape.y, 1, { maxDist: 24 }), 'nearest hit');

const nested = {
    regions: [
        { id: 'candy', shape: { type: 'circle', x: 0, y: -24, r: 42 } },
        { id: 'stick', shape: { type: 'roundrect', x: 0, y: 48, w: 12, h: 70 } },
        { id: 'swirl', shape: { type: 'circle', x: -8, y: -28, r: 12 } },
    ],
};
assert(P.hitRegion(nested, -8, -28, 1).id === 'swirl', 'nested swirl in front of candy');
assert(P.hitRegion(nested, 20, -24, 1).id === 'candy', 'outer candy still hittable');
assert(P.hitRegion(nested, -8, -28, 1, { pad: 0 }).id === 'swirl', 'exact swirl no pad');
// Point just outside swirl but inside candy → candy (pad must not steal swirl's exclusivity)
assert(P.hitRegion(nested, 20, -24, 1, { pad: 0, maxDist: 0 }).id === 'candy', 'exact candy');
assert(P.hitRegion(nested, 80, 80, 1, { pad: 0, maxDist: 0 }) == null, 'miss outside shapes');

const adaptive = new AdaptiveDifficultyEngine(hard);
adaptive.tier = 2;
const bumped = adaptive.current();
assert(bumped.objectCount >= hard.objectCount, 'adaptive regions');
assert(bumped.paletteSize >= hard.paletteSize, 'adaptive palette');
assert(bumped.paletteSize <= 7, 'palette cap');

const acc = new AnalyticsEngine('color_magic', 1);
acc.beginRound();
acc.recordAnswer(true);
acc.recordAnswer(false);
acc.recordAnswer(true);
acc.finishRound();
const metrics = acc.getMetrics();
assert(metrics.accuracy > 0.5 && metrics.accuracy < 1, 'accuracy');
assert(metrics.mistakes === 1, 'mistakes');
const score = ScoringEngine.computeSessionScore(
    metrics, GameConfig.getLevel('color_magic', 1).scoring, 1, 15000,
);
assert(score.score > 0 && score.score <= 100, 'score range ' + score.score);

Object.keys(store).forEach((k) => delete store[k]);
CompletionEngine.reset();
const playA = new AnalyticsEngine('color_magic', 1);
for (let i = 0; i < def.levels[1].rounds; i++) {
    playA.beginRound();
    playA.recordAnswer(true);
    playA.finishRound();
}
const firstAward = CompletionEngine.completeGame({
    gameId: 'color_magic', level: 1, analytics: playA, parTimeMs: 15000,
});
assert(firstAward.persistOk, 'award persist');
assert(firstAward.recommendedNextAction, 'next action');
const dup = CompletionEngine.completeGame({
    gameId: 'color_magic', level: 1, analytics: playA, parTimeMs: 15000,
});
assert(dup === firstAward, 'duplicate completion ignored');

console.log('PASS color magic', P.ARTWORKS.length, 'artworks');
