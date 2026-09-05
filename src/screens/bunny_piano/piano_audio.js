/**
 * piano_audio.js — warm toy-piano tones (Web Audio). Game-local; ducks BGM.
 */
const PIANO_FREQ = {
    C: 261.63, D: 293.66, E: 329.63, F: 349.23,
    G: 392.00, A: 440.00, B: 493.88, C5: 523.25,
};

const BunnyPianoAudio = {
    play(note) {
        const freq = PIANO_FREQ[note];
        if (!freq) return false;
        if (typeof AudioEngine === 'undefined' || AudioEngine.settings?.soundEnabled === false) return false;
        const ctx = AudioEngine.ctx;
        const out = AudioEngine.channels && AudioEngine.channels.sfx;
        if (!ctx || !out) return false;
        if (typeof AudioEngine.duck === 'function') AudioEngine.duck(0.55);
        const t0 = ctx.currentTime;
        const osc = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'triangle';
        osc2.type = 'sine';
        osc.frequency.setValueAtTime(freq, t0);
        osc2.frequency.setValueAtTime(freq * 2, t0);
        g.gain.setValueAtTime(0, t0);
        g.gain.linearRampToValueAtTime(0.22, t0 + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.55);
        osc.connect(g);
        osc2.connect(g);
        g.connect(out);
        osc.start(t0);
        osc2.start(t0);
        osc.stop(t0 + 0.6);
        osc2.stop(t0 + 0.6);
        return true;
    },
};

if (typeof module !== 'undefined') module.exports = { BunnyPianoAudio, PIANO_FREQ };
