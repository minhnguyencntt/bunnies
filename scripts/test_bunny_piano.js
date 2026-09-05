/**
 * test_bunny_piano.js — 50 staff challenges + pitch map.
 */
const { BunnyPianoLib } = require('../src/screens/bunny_piano/piano_lib.js');
const { BunnyPianoEngine } = require('../src/screens/bunny_piano/piano_engine.js');
const { BunnyPianoStaff } = require('../src/screens/bunny_piano/piano_staff.js');

function assert(cond, msg) {
    if (!cond) throw new Error(msg);
}

const gap = BunnyPianoStaff.LINE_GAP;
assert(BunnyPianoStaff.staffY('E', gap) === 4 * gap, 'E is bottom staff line');
assert(BunnyPianoStaff.staffY('G', gap) === 3 * gap, 'G is line 2');
assert(BunnyPianoStaff.staffY('C5', gap) === 1.5 * gap, 'C5 is space 3');
assert(BunnyPianoStaff.staffY('C', gap) === 5 * gap, 'C is ledger below');
assert(BunnyPianoStaff.staffY('C', gap) > BunnyPianoStaff.staffY('E', gap), 'C below E');
assert(BunnyPianoStaff.durBeats('e') === 0.5, 'eighth beat');
assert(BunnyPianoStaff.durBeats('h') === 2, 'half beat');
assert(BunnyPianoStaff.isRest('qr'), 'quarter rest');

const evs = BunnyPianoStaff.normalizeEvents(['C', 'R', 'E'], ['q', 'qr', 'h']);
assert(evs[1].rest && evs[0].pitch === 'C' && evs[2].dur === 'h', 'normalize');

const raw = BunnyPianoLib.all();
assert(raw.length === 50, `expected 50 raw, got ${raw.length}`);
assert(raw.filter((c) => c.difficulty === 1).length === 20, '20 level-1');
assert(raw.filter((c) => c.difficulty === 2).length === 20, '20 level-2');
assert(raw.filter((c) => c.difficulty === 3).length === 10, '10 level-3');

const ids = new Set(raw.map((c) => c.id));
assert(ids.size === 50, 'ids must be unique');

const { playable, rejected } = BunnyPianoEngine.loadLibrary(raw);
if (rejected.length) {
    console.error(rejected);
    throw new Error(`rejected ${rejected.length} challenges`);
}
assert(playable.length === 50, `playable ${playable.length}`);

const sigs = playable.map((c) => c.events.map((e) => (e.rest ? e.dur : `${e.pitch}:${e.dur}`)).join(','));
assert(new Set(sigs).size === 50, 'melodies must be unique');

const l1 = playable.filter((c) => c.difficulty === 1);
const l2 = playable.filter((c) => c.difficulty === 2);
const l3 = playable.filter((c) => c.difficulty === 3);
assert(l1.every((c) => c.notes.length >= 2 && c.notes.length <= 4), 'L1 len');
assert(l2.every((c) => c.notes.length >= 4 && c.notes.length <= 8), 'L2 len');
assert(l3.every((c) => c.notes.length >= 6 && c.notes.length <= 12), 'L3 len');
assert(l1.every((c) => c.notes.every((n) => BunnyPianoEngine.L1_NOTES.indexOf(n) !== -1)), 'L1 pool');
assert(l2.every((c) => c.notes.every((n) => BunnyPianoEngine.L2_NOTES.indexOf(n) !== -1)), 'L2 pool');
assert(playable.every((c) => c.notes.every((n) => BunnyPianoEngine.ALLOWED.indexOf(n) !== -1)), 'allowed notes');
assert(l1.every((c) => c.durs.every((d) => d === 'q')), 'L1 quarters');
assert(l1.some((c) => c.notes.indexOf('G') !== -1), 'L1 uses G');
assert(l2.some((c) => c.events.some((e) => e.rest)), 'L2 has a rest');
assert(l3.some((c) => c.notes.indexOf('C5') !== -1), 'L3 uses C5');

const restCh = playable.find((c) => c.events.some((e) => e.rest));
const restAt = restCh.events.findIndex((e) => e.rest);
assert(BunnyPianoEngine.expectedNote(restCh, restAt) === null, 'rest has no expected pitch');
assert(BunnyPianoEngine.nextPlayable(restCh, restAt) > restAt, 'skip rest');

const seen = new Set();
let history = [];
for (let i = 0; i < 20; i++) {
    const r = BunnyPianoEngine.pick(playable, { difficulty: 1, history, seed: 1000 + i });
    history = r.history;
    assert(r.challenge && r.challenge.difficulty === 1, 'pick L1');
    if (i < 19) assert(!seen.has(r.challenge.id), `repeat ${r.challenge.id} at ${i}`);
    seen.add(r.challenge.id);
}
assert(seen.size === 20, 'exhausted L1 pool before reset');

const a = BunnyPianoEngine.pick(playable, { difficulty: 2, history: [], seed: 42 });
const b = BunnyPianoEngine.pick(playable, { difficulty: 2, history: [], seed: 42 });
assert(a.challenge.id === b.challenge.id, 'same seed → same challenge');
assert(BunnyPianoEngine.expectedNote(a.challenge, 0) === a.challenge.events[0].pitch, 'expected 0');
assert(BunnyPianoEngine.expectedNote(a.challenge, 99) === null, 'expected oob');
assert(BunnyPianoEngine.memoryHideCount(1, 4) === 1, 'hide L1');
assert(BunnyPianoEngine.eventMs(120, 'q') === 500, 'eventMs quarter 120bpm');

const { BunnyPianoSongs } = require('../src/screens/bunny_piano/piano_songs.js');
const songsRaw = BunnyPianoSongs.all();
assert(songsRaw.length === 50, `expected 50 songs, got ${songsRaw.length}`);
assert(songsRaw.filter((c) => c.difficulty === 1).length === 20, '20 song L1');
assert(songsRaw.filter((c) => c.difficulty === 2).length === 20, '20 song L2');
assert(songsRaw.filter((c) => c.difficulty === 3).length === 10, '10 song L3');
assert(new Set(songsRaw.map((c) => c.id)).size === 50, 'song ids unique');
assert(new Set(songsRaw.map((c) => c.title)).size === 50, 'song titles unique');

const songs = BunnyPianoEngine.loadSongs(songsRaw);
if (songs.rejected.length) {
    console.error(songs.rejected);
    throw new Error(`rejected ${songs.rejected.length} songs`);
}
assert(songs.playable.length === 50, '50 playable songs');
assert(songs.playable.every((c) => c.title && c.timeSignature && c.kind === 'song'), 'song fields');
assert(songs.playable.every((c) => c.events.length >= 4), 'songs have events');

const songSeen = new Set();
let songHist = [];
for (let i = 0; i < 20; i++) {
    const r = BunnyPianoEngine.pick(songs.playable, { difficulty: 1, history: songHist, seed: 2000 + i });
    songHist = r.history;
    if (i < 19) assert(!songSeen.has(r.challenge.id), `song repeat ${r.challenge.id}`);
    songSeen.add(r.challenge.id);
}
assert(songSeen.size === 20, 'exhausted song L1');

const win = BunnyPianoEngine.pageWindow(12, 42, 10);
assert(win.page === 1 && win.from === 10 && win.pages === 5, 'page window');
const bars = BunnyPianoEngine.barAfterIndices(songs.playable[0].events, 4);
assert(bars.length >= 1, 'bar lines');
assert(BunnyPianoEngine.speedFactor('slow') > 1, 'slow');
assert(BunnyPianoEngine.speedFactor('fast') < 1, 'fast');

console.log('PASS bunny piano library');
