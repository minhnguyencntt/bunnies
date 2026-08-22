/**
 * MusicEngine.js — dynamic background music.
 *
 * Base themes are the per-area BGM files (each world has its own identity).
 * On top of the base theme, synthesized intensity layers react to gameplay:
 *
 *   low         → calm exploration (base theme only)
 *   medium      → active gameplay (+ soft pulse layer)
 *   high        → challenge / time pressure (+ pulse + gentle arpeggio)
 *   celebration → victory / reward (stinger flourish, then settle)
 *
 * Transitions are smoothed; layers route through the music channel so
 * volume settings and voice ducking apply automatically.
 */
const MusicEngine = {
    current: null,        // Phaser sound playing the base theme
    currentKey: null,
    baseVolume: 0.4,
    intensity: 'low',
    _scheduler: null,
    _layerGains: {},
    _beat: 0,

    get ctx() { return AudioEngine.ctx; },

    /** Play a looping theme file through Phaser (lazy-loads if needed). */
    playTheme(scene, key, url, { volume = 0.4, fadeMs = 600 } = {}) {
        if (this.currentKey === key && this.current) { return; }
        this.stopTheme(fadeMs / 2);
        this.baseVolume = volume;
        const start = () => {
            if (!scene.cache.audio.exists(key)) return;
            this.current = scene.sound.add(key, { loop: true, volume: 0 });
            this.current.play();
            this.currentKey = key;
            scene.tweens.add({
                targets: this.current, volume: this._targetVolume(), duration: fadeMs,
            });
        };
        if (scene.cache.audio.exists(key)) { start(); return; }
        scene.load.audio(key, url);
        scene.load.once('complete', start);
        scene.load.start();
    },

    _targetVolume() {
        const s = AudioEngine.settings || AudioEngine.DEFAULT_SETTINGS;
        return s.musicEnabled ? this.baseVolume * s.music : 0;
    },

    /** Called by AudioEngine when settings change or ducking toggles. */
    syncVolume(duckMult) {
        if (!this.current) return;
        const v = this._targetVolume() * (duckMult ?? 1);
        const scene = AudioEngine.scene;
        if (scene) scene.tweens.add({ targets: this.current, volume: v, duration: 250 });
        else this.current.volume = v;
    },

    stopTheme(fadeMs = 400) {
        if (!this.current) return;
        const snd = this.current;
        this.current = null;
        this.currentKey = null;
        const scene = AudioEngine.scene;
        if (scene) {
            scene.tweens.add({ targets: snd, volume: 0, duration: fadeMs, onComplete: () => snd.stop() });
        } else {
            snd.stop();
        }
        this.setIntensity('low');
    },

    // ─── Intensity layers (synthesized) ───────────────────────

    setIntensity(level) {
        if (this.intensity === level) return;
        this.intensity = level;
        if (!this.ctx) return;
        if (level === 'celebration') {
            this._celebrate();
            level = 'low'; // settle after the flourish
        }
        this._ensureScheduler(level !== 'low');
        const t = this.ctx.currentTime;
        const pulse = level === 'medium' ? 0.5 : level === 'high' ? 0.9 : 0;
        const arp = level === 'high' ? 0.5 : 0;
        this._layerGains.pulse?.gain.setTargetAtTime(pulse, t, 0.6);
        this._layerGains.arp?.gain.setTargetAtTime(arp, t, 0.8);
    },

    _ensureScheduler(on) {
        if (!this.ctx) return;
        if (!this._layerGains.pulse) {
            ['pulse', 'arp'].forEach(name => {
                const g = this.ctx.createGain();
                g.gain.value = 0;
                g.connect(AudioEngine.channels.music);
                this._layerGains[name] = g;
            });
        }
        if (on && !this._scheduler) {
            this._beat = 0;
            this._scheduler = setInterval(() => this._tick(), 125); // 8th notes @ 120bpm
        } else if (!on && this._scheduler) {
            // keep layers alive briefly for smooth fade, then stop scheduling
            setTimeout(() => {
                if (this.intensity === 'low' && this._scheduler) {
                    clearInterval(this._scheduler);
                    this._scheduler = null;
                }
            }, 1500);
        }
    },

    _tick() {
        if (!this.ctx) return;
        const b = this._beat++;
        const pulse = this._layerGains.pulse;
        const arp = this._layerGains.arp;
        // Soft heartbeat pulse on beats
        if (b % 4 === 0) this._kick(pulse);
        if (b % 4 === 2) this._tickHat(pulse);
        // Gentle pentatonic arpeggio (varies each bar to avoid fatigue)
        const scale = [523, 587, 659, 784, 880];
        const idx = (b * 2 + Math.floor(b / 8)) % scale.length;
        this._pluck(arp, scale[idx]);
    },

    _kick(gainNode) {
        const t = this.ctx.currentTime;
        const o = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        o.type = 'sine';
        o.frequency.setValueAtTime(140, t);
        o.frequency.exponentialRampToValueAtTime(55, t + 0.12);
        g.gain.setValueAtTime(0.25, t);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
        o.connect(g).connect(gainNode);
        o.start(t); o.stop(t + 0.2);
    },

    _tickHat(gainNode) {
        const t = this.ctx.currentTime;
        const len = Math.floor(this.ctx.sampleRate * 0.05);
        const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
        const d = buf.getChannelData(0);
        for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
        const src = this.ctx.createBufferSource();
        src.buffer = buf;
        const f = this.ctx.createBiquadFilter();
        f.type = 'highpass'; f.frequency.value = 6000;
        const g = this.ctx.createGain();
        g.gain.value = 0.06;
        src.connect(f).connect(g).connect(gainNode);
        src.start(t);
    },

    _pluck(gainNode, freq) {
        const t = this.ctx.currentTime;
        const o = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        o.type = 'triangle';
        o.frequency.value = freq * (Math.random() < 0.2 ? 2 : 1); // occasional octave variation
        g.gain.setValueAtTime(0.0001, t);
        g.gain.linearRampToValueAtTime(0.07, t + 0.01);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
        o.connect(g).connect(gainNode);
        o.start(t); o.stop(t + 0.25);
    },

    _celebrate() {
        if (!this.ctx) return;
        const arp = this._layerGains.arp;
        this._ensureScheduler(true);
        const t = this.ctx.currentTime;
        arp.gain.cancelScheduledValues(t);
        arp.gain.setValueAtTime(0.9, t);
        arp.gain.setTargetAtTime(0, t + 1.2, 0.8);
        this.intensity = 'low';
    },
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MusicEngine };
}
