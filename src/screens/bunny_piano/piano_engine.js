/**
 * piano_engine.js — validate, seeded pick, anti-repeat, next expected note.
 * Node-testable. A challenge that fails validation is never playable.
 */
const ALLOWED = ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'C5'];
const L1_NOTES = ['C', 'D', 'E', 'F', 'G'];
const L2_NOTES = ['C', 'D', 'E', 'F', 'G', 'A'];
const DURS = ['q', 'e', 'h', 'w', 'qr', 'er', 'hr'];
const REST_DURS = ['qr', 'er', 'hr'];

let Staff = null;
if (typeof BunnyPianoStaff !== 'undefined') Staff = BunnyPianoStaff;
else if (typeof require !== 'undefined') {
    try { Staff = require('./piano_staff.js').BunnyPianoStaff; } catch (e) { Staff = null; }
}

function mulberry32(seed) {
    let a = (Number(seed) >>> 0) || 1;
    return function rand() {
        a |= 0;
        a = a + 0x6D2B79F5 | 0;
        let t = Math.imul(a ^ a >>> 15, 1 | a);
        t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
}

function noteIndex(note) {
    return ALLOWED.indexOf(note);
}

function inPool(pitches, pool) {
    return pitches.every((n) => pool.indexOf(n) !== -1);
}

function normalize(raw) {
    const notes = (raw.notes || []).slice();
    const durs = (raw.durs || notes.map(() => 'q')).slice();
    while (durs.length < notes.length) durs.push('q');
    const events = Staff
        ? Staff.normalizeEvents(notes, durs)
        : notes.map((n, i) => {
            const dur = durs[i] || 'q';
            const rest = n === 'R' || REST_DURS.indexOf(dur) !== -1;
            return { pitch: rest ? null : n, dur, rest };
        });
    return { notes, durs, events };
}

function playablePitches(events) {
    return events.filter((e) => !e.rest).map((e) => e.pitch);
}

function validate(raw) {
    const id = raw && raw.id;
    if (!raw || !id) return { ok: false, error: 'missing_id', id };
    const d = raw.difficulty;
    if (d !== 1 && d !== 2 && d !== 3) return { ok: false, error: 'bad_difficulty', id };
    if (!Array.isArray(raw.notes) || !raw.notes.length) return { ok: false, error: 'missing_notes', id };
    const { notes, durs, events } = normalize(raw);
    if (durs.some((x) => DURS.indexOf(x) === -1)) return { ok: false, error: 'bad_dur', id };
    const pitches = playablePitches(events);
    if (!pitches.length) return { ok: false, error: 'no_playable', id };
    if (pitches.some((n) => ALLOWED.indexOf(n) === -1)) return { ok: false, error: 'bad_note', id };
    const len = pitches.length;
    if (d === 1 && (len < 2 || len > 4)) return { ok: false, error: 'l1_len', id };
    if (d === 2 && (len < 4 || len > 8)) return { ok: false, error: 'l2_len', id };
    if (d === 3 && (len < 6 || len > 12)) return { ok: false, error: 'l3_len', id };
    if (d === 1 && !inPool(pitches, L1_NOTES)) return { ok: false, error: 'l1_pool', id };
    if (d === 2 && !inPool(pitches, L2_NOTES)) return { ok: false, error: 'l2_pool', id };
    if (d === 1 && durs.some((x) => x !== 'q')) return { ok: false, error: 'l1_quarters', id };
    const tempo = raw.tempo || (d === 1 ? 80 : d === 2 ? 88 : 100);
    return {
        ok: true,
        challenge: {
            id,
            difficulty: d,
            notes: pitches.slice(),
            durs: durs.slice(),
            events,
            tempo,
            theme: raw.theme || 'garden',
        },
    };
}

function loadLibrary(rawList) {
    const playable = [];
    const rejected = [];
    (rawList || []).forEach((raw) => {
        const result = validate(raw);
        if (result.ok) playable.push(result.challenge);
        else rejected.push({ id: raw.id, error: result.error });
    });
    return { playable, rejected };
}

function pick(playable, opts) {
    const difficulty = opts.difficulty;
    const seed = opts.seed;
    const history = (opts.history || []).slice();
    const pool = playable.filter((c) => c.difficulty === difficulty);
    if (!pool.length) return { challenge: null, history, reset: false };
    let avail = pool.filter((c) => history.indexOf(c.id) === -1);
    let reset = false;
    if (!avail.length) {
        avail = pool.slice();
        history.length = 0;
        reset = true;
    }
    const rand = mulberry32(seed);
    const challenge = avail[Math.floor(rand() * avail.length)];
    history.push(challenge.id);
    return { challenge, history, reset };
}

function expectedNote(challenge, step) {
    if (!challenge || !challenge.events) return null;
    const ev = challenge.events[step];
    if (!ev || ev.rest) return null;
    return ev.pitch;
}

function nextPlayable(challenge, from) {
    if (!challenge || !challenge.events) return from;
    let i = from;
    while (i < challenge.events.length && challenge.events[i].rest) i += 1;
    return i;
}

function beatMs(tempo) {
    return Math.round(60000 / (tempo || 80));
}

function eventMs(tempo, dur) {
    const beats = Staff ? Staff.durBeats(dur) : (DUR_BEATS_FALLBACK[dur] || 1);
    return Math.round(beatMs(tempo) * beats);
}

const DUR_BEATS_FALLBACK = { q: 1, e: 0.5, h: 2, w: 4, qr: 1, er: 0.5, hr: 2 };

function memoryHideCount(level, length) {
    const want = level === 1 ? 1 : level === 2 ? 2 : 3;
    return Math.min(want, Math.max(0, Math.floor(length / 2)));
}

function validateSong(raw) {
    const id = raw && raw.id;
    if (!raw || !id) return { ok: false, error: 'missing_id', id };
    if (!raw.title) return { ok: false, error: 'missing_title', id };
    const d = raw.difficulty;
    if (d !== 1 && d !== 2 && d !== 3) return { ok: false, error: 'bad_difficulty', id };
    if (!Array.isArray(raw.notes) || !raw.notes.length) return { ok: false, error: 'missing_notes', id };
    const { notes, durs, events } = normalize(raw);
    if (durs.some((x) => DURS.indexOf(x) === -1)) return { ok: false, error: 'bad_dur', id };
    const pitches = playablePitches(events);
    if (!pitches.length) return { ok: false, error: 'no_playable', id };
    if (pitches.some((n) => ALLOWED.indexOf(n) === -1)) return { ok: false, error: 'bad_note', id };
    const len = pitches.length;
    if (d === 1 && (len < 4 || len > 20)) return { ok: false, error: 'song_l1_len', id };
    if (d === 2 && (len < 8 || len > 36)) return { ok: false, error: 'song_l2_len', id };
    if (d === 3 && (len < 12 || len > 56)) return { ok: false, error: 'song_l3_len', id };
    if (d === 1 && !inPool(pitches, L1_NOTES)) return { ok: false, error: 'song_l1_pool', id };
    if (d === 2 && !inPool(pitches, L2_NOTES)) return { ok: false, error: 'song_l2_pool', id };
    const tempo = raw.tempo || (d === 1 ? 80 : d === 2 ? 88 : 96);
    return {
        ok: true,
        challenge: {
            id,
            title: raw.title,
            difficulty: d,
            notes: pitches.slice(),
            durs: durs.slice(),
            events,
            tempo,
            timeSignature: raw.timeSignature || '4/4',
            theme: raw.theme || 'garden',
            kind: 'song',
        },
    };
}

function loadSongs(rawList) {
    const playable = [];
    const rejected = [];
    (rawList || []).forEach((raw) => {
        const result = validateSong(raw);
        if (result.ok) playable.push(result.challenge);
        else rejected.push({ id: raw.id, error: result.error });
    });
    return { playable, rejected };
}

function pageWindow(step, total, pageSize) {
    const size = pageSize || 10;
    const n = Math.max(1, total || 1);
    const safe = Math.max(0, Math.min(step || 0, n - 1));
    const page = Math.floor(safe / size);
    const pages = Math.max(1, Math.ceil(n / size));
    return { from: page * size, limit: size, page, pages };
}

function speedFactor(speed) {
    if (speed === 'slow') return 1.55;
    if (speed === 'fast') return 0.7;
    return 1;
}

function barAfterIndices(events, beatsPerBar) {
    const bar = beatsPerBar || 4;
    const out = [];
    let acc = 0;
    (events || []).forEach((ev, i) => {
        acc += Staff ? Staff.durBeats(ev.dur) : (DUR_BEATS_FALLBACK[ev.dur] || 1);
        if (acc >= bar - 0.001) {
            out.push(i);
            acc = acc % bar;
        }
    });
    return out;
}

const BunnyPianoEngine = {
    ALLOWED,
    L1_NOTES,
    L2_NOTES,
    DURS,
    mulberry32,
    noteIndex,
    validate,
    loadLibrary,
    validateSong,
    loadSongs,
    pick,
    expectedNote,
    nextPlayable,
    beatMs,
    eventMs,
    memoryHideCount,
    pageWindow,
    speedFactor,
    barAfterIndices,
};

if (typeof module !== 'undefined') module.exports = { BunnyPianoEngine };
