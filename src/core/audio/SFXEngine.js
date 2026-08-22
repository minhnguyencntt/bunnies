/**
 * SFXEngine.js — fully synthesized gameplay SFX (Web Audio, zero assets).
 * Child-friendly: soft attacks, warm timbres, no harsh buzzers.
 * Every sound has subtle pitch/pattern variations to avoid fatigue.
 */
const SFXEngine = {
    get ctx() { return AudioEngine.ctx; },
    get out() { return AudioEngine.channels.sfx; },

    _ready() { return this.ctx && this.out && (AudioEngine.settings?.soundEnabled !== false); },

    /** One enveloped oscillator tone. */
    tone({ freq = 440, to = null, dur = 0.15, type = 'sine', gain = 0.2, when = 0, attack = 0.008 }) {
        if (!this._ready()) return;
        const t0 = this.ctx.currentTime + when;
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, t0);
        if (to) osc.frequency.exponentialRampToValueAtTime(to, t0 + dur);
        g.gain.setValueAtTime(0, t0);
        g.gain.linearRampToValueAtTime(gain, t0 + attack);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
        osc.connect(g).connect(this.out);
        osc.start(t0);
        osc.stop(t0 + dur + 0.05);
    },

    /** Filtered noise burst (whoosh, wind, puff). */
    noise({ dur = 0.25, freq = 1200, q = 1, gain = 0.12, when = 0, type = 'bandpass' }) {
        if (!this._ready()) return;
        const t0 = this.ctx.currentTime + when;
        const len = Math.max(1, Math.floor(this.ctx.sampleRate * dur));
        const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
        const data = buf.getChannelData(0);
        for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
        const src = this.ctx.createBufferSource();
        src.buffer = buf;
        const f = this.ctx.createBiquadFilter();
        f.type = type;
        f.frequency.value = freq;
        f.Q.value = q;
        const g = this.ctx.createGain();
        g.gain.setValueAtTime(gain, t0);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
        src.connect(f).connect(g).connect(this.out);
        src.start(t0);
    },

    /** Short melodic figure from semitone offsets relative to a root. */
    figure(root, semitones, { step = 0.09, dur = 0.18, type = 'triangle', gain = 0.16, when = 0 }) {
        semitones.forEach((s, i) => {
            this.tone({
                freq: root * Math.pow(2, s / 12), dur, type, gain,
                when: when + i * step,
            });
        });
    },

    _jitter(v, pct = 0.04) { return v * (1 + (Math.random() * 2 - 1) * pct); },

    // ─── UI ───────────────────────────────────────────────────
    tap() { this.tone({ freq: this._jitter(660), dur: 0.07, type: 'triangle', gain: 0.12 }); },
    pop() { this.tone({ freq: this._jitter(500), to: 750, dur: 0.09, type: 'sine', gain: 0.14 }); },
    drag() { this.noise({ dur: 0.12, freq: 2400, gain: 0.04 }); },
    whoosh() { this.noise({ dur: 0.35, freq: 900, q: 0.7, gain: 0.1 }); },
    pause() { this.figure(440, [0, -5], { step: 0.1, dur: 0.14, type: 'sine', gain: 0.1 }); },
    locked() { this.tone({ freq: 220, dur: 0.12, type: 'sine', gain: 0.1 }); this.tone({ freq: 180, dur: 0.16, type: 'sine', gain: 0.08, when: 0.09 }); },

    // ─── Gameplay ─────────────────────────────────────────────
    pickup() {
        this.tone({ freq: this._jitter(880), to: 1320, dur: 0.1, type: 'sine', gain: 0.13 });
        this.tone({ freq: 1760, dur: 0.08, type: 'sine', gain: 0.05, when: 0.06 });
    },
    drop() { this.tone({ freq: this._jitter(700), to: 500, dur: 0.09, type: 'sine', gain: 0.09 }); },
    match() { this.figure(523, [0, 4, 7], { step: 0.07, dur: 0.14, gain: 0.13 }); },
    discovery() { // found a difference — distinct "aha"
        this.tone({ freq: 1047, dur: 0.1, type: 'triangle', gain: 0.14 });
        this.tone({ freq: 1568, dur: 0.22, type: 'triangle', gain: 0.12, when: 0.08 });
    },
    solve() { this.figure(523, [0, 4, 7, 12], { step: 0.08, dur: 0.2, gain: 0.15 }); },
    sequenceStep(i) { this.tone({ freq: 620 * Math.pow(2, i / 12), dur: 0.12, type: 'triangle', gain: 0.12 }); },

    correct() { // bright confirmation, small musical progression
        const roots = [523, 587, 659];
        this.figure(roots[Math.floor(Math.random() * roots.length)], [0, 4, 7], { step: 0.06, dur: 0.16, gain: 0.15 });
        this.tone({ freq: 2093, dur: 0.3, type: 'sine', gain: 0.05, when: 0.16 });
    },
    wrong() { // gentle correction — warm, descending softly, never a buzzer
        this.tone({ freq: 392, to: 330, dur: 0.25, type: 'sine', gain: 0.09 });
        this.tone({ freq: 523, dur: 0.18, type: 'triangle', gain: 0.05, when: 0.12 });
    },
    fumble() { this.noise({ dur: 0.15, freq: 700, gain: 0.05 }); this.tone({ freq: 300, to: 260, dur: 0.12, type: 'sine', gain: 0.05 }); },

    hint() { // recognizable magical chime
        this.figure(1319, [0, 7, 12], { step: 0.11, dur: 0.3, type: 'sine', gain: 0.08 });
    },
    combo(streak = 3) {
        const n = Math.min(streak, 6);
        this.figure(659, [0, 3, 5, 7, 9, 12].slice(0, n), { step: 0.05, dur: 0.12, gain: 0.12 });
    },
    timerWarning() { this.tone({ freq: 880, dur: 0.09, type: 'sine', gain: 0.07 }); },

    // ─── Rewards ──────────────────────────────────────────────
    scoreTick() { this.tone({ freq: this._jitter(1200, 0.02), dur: 0.04, type: 'square', gain: 0.03 }); },
    star(index = 0) { // ascending sparkle per star — sync with star pop animation
        const base = [784, 880, 1047][Math.min(index, 2)];
        this.figure(base, [0, 7], { step: 0.06, dur: 0.25, type: 'triangle', gain: 0.14 });
        this.noise({ dur: 0.2, freq: 6000, gain: 0.03 });
    },
    threeStars() {
        this.figure(523, [0, 4, 7, 12, 16], { step: 0.09, dur: 0.3, gain: 0.15 });
        this.noise({ dur: 0.5, freq: 7000, gain: 0.04, when: 0.3 });
    },
    xp() { this.figure(1568, [0, 5, 9], { step: 0.05, dur: 0.12, type: 'sine', gain: 0.06 }); },
    award() { // short achievement fanfare
        this.figure(523, [0, 4, 7, 12], { step: 0.1, dur: 0.28, type: 'triangle', gain: 0.16 });
        this.figure(1047, [0, 7], { step: 0.1, dur: 0.35, type: 'sine', gain: 0.1, when: 0.4 });
    },
    sticker(rarity = 'common') { // collectible reveal; rarer = a touch more magical
        this.figure(1047, [0, 5, 9], { step: 0.07, dur: 0.2, type: 'triangle', gain: 0.13 });
        if (rarity === 'rare' || rarity === 'epic') this.figure(1568, [0, 4, 7], { step: 0.07, dur: 0.22, type: 'sine', gain: 0.09, when: 0.2 });
        if (rarity === 'legendary') this.figure(2093, [0, 3, 7, 12], { step: 0.08, dur: 0.3, type: 'sine', gain: 0.09, when: 0.35 });
    },
    levelUp() {
        this.figure(392, [0, 5, 7, 12, 19], { step: 0.1, dur: 0.3, type: 'triangle', gain: 0.15 });
    },
    victory() { // completion stinger
        this.figure(523, [0, 4, 7, 12, 7, 12, 16], { step: 0.11, dur: 0.3, type: 'triangle', gain: 0.16 });
        this.noise({ dur: 0.6, freq: 6500, gain: 0.04, when: 0.5 });
    },
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SFXEngine };
}
