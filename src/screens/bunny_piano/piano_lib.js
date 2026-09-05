/**
 * piano_lib.js — 50 prepared staff melodies for Vườn Nhạc Bunnine.
 * 20 màn 1 (C–G, 2–4 nốt đen) · 20 màn 2 (C–A, 4–8) · 10 màn 3 (C–C5, 6–12).
 */
const NOTES = ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'C5'];

function BP(id, difficulty, notes, tempo, theme, extra) {
    const row = { id, difficulty, notes, tempo, theme: theme || 'garden' };
    if (extra && extra.durs) row.durs = extra.durs;
    return row;
}

const BUNNY_PIANO_RAW = [
    // ── Màn 1 · C–G, quarters, 2–4 ──
    BP('bp-01', 1, ['C', 'D'], 76, 'garden'),
    BP('bp-02', 1, ['C', 'E'], 76, 'garden'),
    BP('bp-03', 1, ['E', 'G'], 80, 'meadow'),
    BP('bp-04', 1, ['G', 'E'], 80, 'garden'),
    BP('bp-05', 1, ['C', 'G'], 76, 'garden'),
    BP('bp-06', 1, ['F', 'E'], 80, 'meadow'),
    BP('bp-07', 1, ['C', 'D', 'E'], 80, 'garden'),
    BP('bp-08', 1, ['E', 'D', 'C'], 80, 'garden'),
    BP('bp-09', 1, ['C', 'E', 'G'], 84, 'meadow'),
    BP('bp-10', 1, ['G', 'E', 'C'], 84, 'garden'),
    BP('bp-11', 1, ['D', 'F', 'E'], 84, 'magic'),
    BP('bp-12', 1, ['C', 'D', 'E', 'G'], 84, 'garden'),
    BP('bp-13', 1, ['G', 'F', 'E', 'C'], 84, 'garden'),
    BP('bp-14', 1, ['C', 'E', 'D', 'C'], 88, 'meadow'),
    BP('bp-15', 1, ['E', 'G', 'E', 'C'], 88, 'garden'),
    BP('bp-16', 1, ['C', 'D', 'F', 'E'], 84, 'meadow'),
    BP('bp-17', 1, ['C', 'C', 'E', 'G'], 80, 'garden'),
    BP('bp-18', 1, ['G', 'E', 'D', 'C'], 88, 'magic'),
    BP('bp-19', 1, ['D', 'E', 'F', 'G'], 84, 'meadow'),
    BP('bp-20', 1, ['C', 'F', 'E', 'C'], 80, 'garden'),

    // ── Màn 2 · C–A, 4–8, quarters + eighths/half/rests ──
    BP('bp-21', 2, ['C', 'D', 'E', 'F'], 84, 'garden'),
    BP('bp-22', 2, ['C', 'D', 'E', 'F', 'G'], 88, 'garden'),
    BP('bp-23', 2, ['G', 'F', 'E', 'D'], 84, 'meadow'),
    BP('bp-24', 2, ['C', 'E', 'G', 'A'], 88, 'garden'),
    BP('bp-25', 2, ['A', 'G', 'E', 'C'], 88, 'garden'),
    BP('bp-26', 2, ['C', 'D', 'E', 'D', 'C'], 84, 'meadow', { durs: ['q', 'q', 'h', 'q', 'q'] }),
    BP('bp-27', 2, ['C', 'E', 'G', 'E', 'C'], 88, 'garden', { durs: ['q', 'e', 'e', 'q', 'h'] }),
    BP('bp-28', 2, ['E', 'D', 'C', 'D', 'E'], 88, 'magic'),
    BP('bp-29', 2, ['C', 'D', 'G', 'E', 'D'], 92, 'garden'),
    BP('bp-30', 2, ['F', 'E', 'D', 'C', 'A'], 88, 'meadow'),
    BP('bp-31', 2, ['C', 'E', 'R', 'G', 'E'], 88, 'garden', { durs: ['q', 'q', 'qr', 'q', 'q'] }),
    BP('bp-32', 2, ['G', 'E', 'C', 'D', 'E', 'A'], 92, 'meadow'),
    BP('bp-33', 2, ['C', 'D', 'E', 'G', 'E', 'D'], 92, 'magic', { durs: ['q', 'q', 'e', 'e', 'q', 'q'] }),
    BP('bp-34', 2, ['A', 'G', 'F', 'E', 'D', 'C'], 88, 'garden'),
    BP('bp-35', 2, ['C', 'G', 'E', 'A', 'G'], 92, 'meadow', { durs: ['q', 'h', 'q', 'q', 'q'] }),
    BP('bp-36', 2, ['D', 'F', 'A', 'F', 'D'], 88, 'garden'),
    BP('bp-37', 2, ['C', 'D', 'C', 'E', 'G', 'A'], 92, 'garden'),
    BP('bp-38', 2, ['E', 'G', 'A', 'G', 'E', 'C'], 96, 'meadow', { durs: ['e', 'e', 'q', 'q', 'q', 'h'] }),
    BP('bp-39', 2, ['C', 'E', 'F', 'G', 'A', 'G', 'E'], 96, 'magic'),
    BP('bp-40', 2, ['G', 'F', 'E', 'R', 'D', 'C', 'D'], 96, 'garden', { durs: ['q', 'q', 'q', 'qr', 'q', 'q', 'q'] }),

    // ── Màn 3 · C–C5, 6–12, mixed rhythm ──
    BP('bp-41', 3, ['C', 'E', 'G', 'G', 'A', 'G', 'E', 'C'], 96, 'magic'),
    BP('bp-42', 3, ['C', 'D', 'E', 'C', 'D', 'E', 'G', 'E', 'D', 'C'], 100, 'garden', {
        durs: ['q', 'q', 'q', 'e', 'e', 'q', 'q', 'q', 'q', 'h'],
    }),
    BP('bp-43', 3, ['E', 'D', 'C', 'R', 'D', 'E', 'D', 'C'], 96, 'meadow', {
        durs: ['q', 'q', 'q', 'qr', 'q', 'q', 'q', 'h'],
    }),
    BP('bp-44', 3, ['C', 'C', 'E', 'E', 'G', 'G', 'A', 'G'], 100, 'garden', {
        durs: ['e', 'e', 'e', 'e', 'q', 'q', 'q', 'h'],
    }),
    BP('bp-45', 3, ['G', 'E', 'C', 'D', 'E', 'G', 'C5'], 104, 'magic'),
    BP('bp-46', 3, ['C', 'E', 'D', 'G', 'E', 'C', 'D', 'A'], 100, 'garden'),
    BP('bp-47', 3, ['D', 'F', 'A', 'G', 'E', 'C', 'E', 'G', 'A'], 104, 'meadow', {
        durs: ['q', 'q', 'h', 'q', 'q', 'q', 'e', 'e', 'q'],
    }),
    BP('bp-48', 3, ['C', 'D', 'E', 'G', 'A', 'B', 'A', 'G', 'E', 'C'], 104, 'garden'),
    BP('bp-49', 3, ['E', 'G', 'C5', 'B', 'A', 'G', 'E', 'D', 'C'], 108, 'magic', {
        durs: ['q', 'e', 'e', 'q', 'q', 'q', 'q', 'q', 'h'],
    }),
    BP('bp-50', 3, ['C', 'E', 'G', 'A', 'B', 'C5', 'B', 'A', 'G', 'E', 'C'], 108, 'magic'),
];

const BunnyPianoLib = {
    NOTES,
    RAW: BUNNY_PIANO_RAW,
    all() { return BUNNY_PIANO_RAW.slice(); },
};

if (typeof module !== 'undefined') module.exports = { BunnyPianoLib, BUNNY_PIANO_RAW, NOTES };
