/**
 * AmbienceEngine.js — procedural environmental ambience (Web Audio).
 * Makes each Knowledge World area feel alive while staying subtle.
 *
 *   forest  — gentle wind, bird chirps, magical sparkle pings
 *   mystery — low night wind, soft chimes, distant creaks
 *   candy   — soft breeze, sugary sparkle pings, bubble pops
 *
 * All sources route through the ambient channel (own volume setting,
 * ducked under voice). No audio assets required.
 */
const AmbienceEngine = {
    profile: null,
    _wind: null,
    _scheduler: null,

    get ctx() { return AudioEngine.ctx; },
    get out() { return AudioEngine.channels.ambient; },

    start(profile) {
        this.stop(800);
        if (!this.ctx || !this.out || AudioEngine.settings?.soundEnabled === false) return;
        this.profile = profile;
        if (!profile) return;

        this._startWind(profile === 'mystery'
            ? { freq: 220, gain: 0.05, lfoHz: 0.07 }
            : profile === 'candy'
                ? { freq: 520, gain: 0.03, lfoHz: 0.14 }
                : { freq: 420, gain: 0.04, lfoHz: 0.11 });

        this._scheduler = setInterval(() => this._randomEvent(), 900);
    },

    stop(fadeMs = 500) {
        if (this._scheduler) { clearInterval(this._scheduler); this._scheduler = null; }
        if (this._wind && this.ctx) {
            const t = this.ctx.currentTime;
            this._wind.gain.gain.setTargetAtTime(0, t, fadeMs / 300);
            const src = this._wind.src;
            setTimeout(() => { try { src.stop(); } catch (e) { /* ignore */ } }, fadeMs + 200);
            this._wind = null;
        }
        this.profile = null;
    },

    _startWind({ freq, gain, lfoHz }) {
        const len = this.ctx.sampleRate * 2;
        const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
        const d = buf.getChannelData(0);
        for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
        const src = this.ctx.createBufferSource();
        src.buffer = buf;
        src.loop = true;
        const f = this.ctx.createBiquadFilter();
        f.type = 'lowpass';
        f.frequency.value = freq;
        const g = this.ctx.createGain();
        g.gain.value = 0;
        g.gain.setTargetAtTime(gain, this.ctx.currentTime, 1.2);
        // Slow swell LFO so the wind breathes
        const lfo = this.ctx.createOscillator();
        lfo.frequency.value = lfoHz;
        const lfoGain = this.ctx.createGain();
        lfoGain.gain.value = gain * 0.5;
        lfo.connect(lfoGain).connect(g.gain);
        src.connect(f).connect(g).connect(this.out);
        src.start();
        lfo.start();
        this._wind = { src, gain: g, lfo };
    },

    _randomEvent() {
        if (!this.profile || !this.ctx) return;
        const r = Math.random();
        if (this.profile === 'forest') {
            if (r < 0.3) this._birdChirp();
            else if (r < 0.42) this._sparklePing();
        } else if (this.profile === 'mystery') {
            if (r < 0.18) this._chime();
            else if (r < 0.26) this._creak();
        } else if (this.profile === 'candy') {
            if (r < 0.3) this._sparklePing();
            else if (r < 0.4) this._bubblePop();
        }
    },

    _bubblePop() {
        const t = this.ctx.currentTime;
        const o = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        o.type = 'sine';
        o.frequency.setValueAtTime(500 + Math.random() * 300, t);
        o.frequency.exponentialRampToValueAtTime(1100 + Math.random() * 400, t + 0.08);
        g.gain.setValueAtTime(0.03, t);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.1);
        o.connect(g).connect(this.out);
        o.start(t); o.stop(t + 0.12);
    },

    _birdChirp() {
        const t = this.ctx.currentTime;
        const n = 2 + Math.floor(Math.random() * 3);
        for (let i = 0; i < n; i++) {
            const o = this.ctx.createOscillator();
            const g = this.ctx.createGain();
            const f0 = 2200 + Math.random() * 1400;
            const t0 = t + i * (0.12 + Math.random() * 0.06);
            o.frequency.setValueAtTime(f0, t0);
            o.frequency.exponentialRampToValueAtTime(f0 * 1.4, t0 + 0.05);
            o.frequency.exponentialRampToValueAtTime(f0 * 0.9, t0 + 0.1);
            g.gain.setValueAtTime(0, t0);
            g.gain.linearRampToValueAtTime(0.035, t0 + 0.015);
            g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.12);
            o.connect(g).connect(this.out);
            o.start(t0); o.stop(t0 + 0.15);
        }
    },

    _sparklePing() {
        const t = this.ctx.currentTime;
        const o = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        o.type = 'sine';
        o.frequency.value = 2400 + Math.random() * 1800;
        g.gain.setValueAtTime(0.02, t);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.7);
        o.connect(g).connect(this.out);
        o.start(t); o.stop(t + 0.75);
    },

    _chime() {
        const t = this.ctx.currentTime;
        [0, 0.35].forEach((dt, i) => {
            const o = this.ctx.createOscillator();
            const g = this.ctx.createGain();
            o.type = 'sine';
            o.frequency.value = [1319, 1568][i];
            g.gain.setValueAtTime(0.025, t + dt);
            g.gain.exponentialRampToValueAtTime(0.0001, t + dt + 1.1);
            o.connect(g).connect(this.out);
            o.start(t + dt); o.stop(t + dt + 1.2);
        });
    },

    _creak() {
        const t = this.ctx.currentTime;
        const o = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        o.type = 'sawtooth';
        o.frequency.setValueAtTime(90, t);
        o.frequency.linearRampToValueAtTime(70, t + 0.4);
        const f = this.ctx.createBiquadFilter();
        f.type = 'lowpass'; f.frequency.value = 300;
        g.gain.setValueAtTime(0.015, t);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.45);
        o.connect(f).connect(g).connect(this.out);
        o.start(t); o.stop(t + 0.5);
    },
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AmbienceEngine };
}
