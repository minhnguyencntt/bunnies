/**
 * piano_staff.js — treble-staff pitch map + Phaser notation draw.
 * Node-testable helpers. No letter names on the staff.
 */
const STEPS = { C: 0, D: 1, E: 2, F: 3, G: 4, A: 5, B: 6, C5: 7 };
const DUR_BEATS = { q: 1, e: 0.5, h: 2, w: 4, qr: 1, er: 0.5, hr: 2 };
const RESTS = { qr: 1, er: 1, hr: 1 };
const INK = 0x4a3728;
const LINE_GAP = 14;

function stepOf(pitch) {
    return STEPS[pitch];
}

function isRest(dur) {
    return !!RESTS[dur];
}

function durBeats(dur) {
    return DUR_BEATS[dur] || 1;
}

function staffY(pitch, lineGap) {
    const gap = lineGap || LINE_GAP;
    const step = STEPS[pitch];
    if (step == null) return null;
    const bottomLineY = 4 * gap;
    return bottomLineY - (step - 2) * (gap / 2);
}

function normalizeEvents(notes, durs) {
    return (notes || []).map((n, i) => {
        const dur = (durs && durs[i]) || 'q';
        const rest = n === 'R' || isRest(dur);
        return { pitch: rest ? null : n, dur, rest: !!rest };
    });
}

function layout(challenge, opts) {
    const gap = (opts && opts.lineGap) || LINE_GAP;
    const all = challenge.events || normalizeEvents(challenge.notes, challenge.durs);
    const from = Math.max(0, (opts && opts.from) || 0);
    const limit = (opts && opts.limit) || all.length;
    const events = all.slice(from, from + limit);
    const n = Math.max(1, events.length);
    const slotW = Math.min(56, Math.max(36, Math.floor(((opts && opts.width) || 720) / n)));
    const showTime = !!(opts && opts.showTime);
    const clefW = showTime ? 62 : 42;
    const padL = clefW + 16;
    const slots = events.map((ev, i) => ({
        i: from + i,
        x: padL + i * slotW + slotW / 2,
        y: ev.rest ? 2 * gap : staffY(ev.pitch, gap),
        pitch: ev.pitch,
        dur: ev.dur,
        rest: ev.rest,
    }));
    return {
        lineGap: gap,
        slotW,
        clefW,
        from,
        width: padL + n * slotW + 16,
        height: 5 * gap + 28,
        events: slots,
        total: all.length,
    };
}

function drawClef(g, x, yTop, gap) {
    const gLine = yTop + 3 * gap;
    g.lineStyle(3.2, INK, 1);
    g.beginPath();
    g.moveTo(x + 18, yTop - 8);
    g.lineTo(x + 10, yTop + gap * 4 + 16);
    g.strokePath();
    g.lineStyle(3.4, INK, 1);
    g.beginPath();
    g.arc(x + 16, gLine, gap * 0.95, Math.PI * 0.15, Math.PI * 1.85, false);
    g.strokePath();
    g.beginPath();
    g.arc(x + 12, yTop + gap * 1.1, gap * 0.72, Math.PI * 0.2, Math.PI * 1.6, false);
    g.strokePath();
    g.fillStyle(INK, 1);
    g.fillCircle(x + 8, yTop + gap * 4 + 14, 3.2);
}

function drawNotehead(g, x, y, hollow, color, alpha) {
    if (hollow) {
        g.lineStyle(2.4, color, alpha);
        g.strokeEllipse(x, y, 18, 13);
    } else {
        g.fillStyle(color, alpha);
        g.fillEllipse(x, y, 18, 13);
    }
}

function drawStem(g, x, y, up, color, alpha) {
    const h = 28;
    g.lineStyle(2.2, color, alpha);
    if (up) g.lineBetween(x + 8, y, x + 8, y - h);
    else g.lineBetween(x - 8, y, x - 8, y + h);
}

function drawFlag(g, x, y, up, color, alpha) {
    g.lineStyle(2.2, color, alpha);
    const sx = up ? x + 8 : x - 8;
    const sy = up ? y - 28 : y + 28;
    g.beginPath();
    g.moveTo(sx, sy);
    if (up) {
        g.lineTo(sx + 12, sy + 8);
        g.lineTo(sx + 4, sy + 16);
    } else {
        g.lineTo(sx - 12, sy - 8);
        g.lineTo(sx - 4, sy - 16);
    }
    g.strokePath();
}

function drawRest(g, x, yMid, dur, color, alpha) {
    g.fillStyle(color, alpha);
    if (dur === 'hr') {
        g.fillRect(x - 8, yMid - 10, 16, 6);
    } else if (dur === 'er') {
        g.fillCircle(x, yMid - 6, 3);
        g.lineStyle(2.2, color, alpha);
        g.lineBetween(x + 2, yMid - 6, x - 4, yMid + 12);
    } else {
        g.fillRect(x - 3, yMid - 16, 6, 28);
        g.fillRect(x - 7, yMid - 4, 14, 6);
    }
}

function drawLedger(g, x, y, color, alpha) {
    g.lineStyle(2, color, alpha);
    g.lineBetween(x - 14, y, x + 14, y);
}

function noteState(i, state) {
    const listen = state && state.listenIndex;
    const step = state && state.step;
    const phase = (state && state.phase) || 'play';
    if (phase === 'demo') {
        if (listen === i) return 'current';
        if (listen > i) return 'done';
        return 'upcoming';
    }
    if (i < step) return 'done';
    if (i === step) return 'current';
    return 'upcoming';
}

function hidden(i, state, n) {
    if (!state || !state.memoryOn || state.phase === 'demo') return false;
    const tail = state.hiddenTail || 0;
    return i >= n - tail && i >= (state.step || 0);
}

function drawTimeSig(scene, container, x, yTop, gap) {
    const top = scene.add.text(x, yTop + gap * 0.7, '4', {
        fontSize: '16px', fontStyle: 'bold', color: '#4A3728',
    }).setOrigin(0.5);
    const bot = scene.add.text(x, yTop + gap * 2.7, '4', {
        fontSize: '16px', fontStyle: 'bold', color: '#4A3728',
    }).setOrigin(0.5);
    container.add(top);
    container.add(bot);
}

function draw(scene, container, challenge, state, opts) {
    if (!scene || !container || !challenge) return { slots: [] };
    container.removeAll(true);
    const w = (opts && opts.width) || 720;
    const showTime = !!(opts && opts.showTime);
    const lay = layout(challenge, {
        width: w - 80, lineGap: LINE_GAP,
        from: opts && opts.from, limit: opts && opts.limit,
        showTime,
    });
    const gap = lay.lineGap;
    const yTop = 8;
    const ink = INK;
    const staff = scene.add.graphics();
    staff.lineStyle(2, ink, 0.7);
    for (let i = 0; i < 5; i++) {
        const y = yTop + i * gap;
        staff.lineBetween(8, y, lay.width - 8, y);
    }
    drawClef(staff, 10, yTop, gap);
    const bars = (opts && opts.bars) || [];
    staff.lineStyle(1.6, ink, 0.45);
    lay.events.forEach((ev) => {
        if (bars.indexOf(ev.i) === -1) return;
        const bx = ev.x + (lay.slotW / 2) - 2;
        staff.lineBetween(bx, yTop, bx, yTop + 4 * gap);
    });
    container.add(staff);
    if (showTime) drawTimeSig(scene, container, 48, yTop, gap);
    const slots = [];
    lay.events.forEach((ev) => {
        const st = noteState(ev.i, state);
        const hide = hidden(ev.i, state, lay.total);
        const alpha = st === 'done' ? 0.35 : 1;
        const color = st === 'current' ? 0xc9a227 : ink;
        const noteG = scene.add.graphics();
        const x = ev.x;
        const y = yTop + ev.y;
        if (ev.rest) {
            if (!hide) drawRest(noteG, x, yTop + 2 * gap, ev.dur, color, alpha);
        } else if (!hide) {
            if (ev.pitch === 'C') drawLedger(noteG, x, y, ink, alpha);
            const hollow = ev.dur === 'h' || ev.dur === 'w';
            drawNotehead(noteG, x, y, hollow, color, alpha);
            if (ev.dur !== 'w') {
                const up = (STEPS[ev.pitch] || 0) < 6;
                drawStem(noteG, x, y, up, color, alpha);
                if (ev.dur === 'e') drawFlag(noteG, x, y, up, color, alpha);
            }
            if (st === 'current') {
                noteG.lineStyle(3, 0xfff59d, 0.95);
                noteG.strokeCircle(x, y, 16);
            }
        }
        container.add(noteG);
        slots.push({ i: ev.i, x, y, pitch: ev.pitch, rest: ev.rest, g: noteG });
    });
    return { slots, layout: lay };
}

const BunnyPianoStaff = {
    STEPS,
    LINE_GAP,
    INK,
    stepOf,
    staffY,
    isRest,
    durBeats,
    normalizeEvents,
    layout,
    draw,
};

if (typeof module !== 'undefined') module.exports = { BunnyPianoStaff };
