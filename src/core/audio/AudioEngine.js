/**
 * AudioEngine.js — central audio bus for Knowledge World.
 *
 * Channels (master → music / sfx / voice / ambient), volume settings persisted
 * in the profile, priority-aware playback, automatic voice ducking, and an
 * event-driven API: AudioEngine.emit('CorrectAnswer') → SFX + voice + music.
 *
 * Synthesized audio (SFX, ambience, music layers) runs on the Phaser WebAudio
 * context through per-channel GainNodes; file-based audio (BGM, voice mp3)
 * plays through Phaser's sound manager with volumes driven by the same
 * channel settings.
 */
const AudioEngine = {
    PRIORITY: { VOICE: 1, FEEDBACK: 2, REWARD: 3, CHARACTER: 4, SFX: 5, AMBIENT: 6, MUSIC: 7 },

    ctx: null,
    channels: {},      // name → GainNode
    scene: null,       // currently attached Phaser scene (for loading/playing files)
    settings: null,
    _listeners: {},
    _duckTimer: null,
    _lastCategoryAt: {},

    DEFAULT_SETTINGS: {
        master: 0.9, music: 0.7, sfx: 0.9, voice: 1.0, ambient: 0.55,
        soundEnabled: true, musicEnabled: true,
    },

    /** Attach the active scene; safe to call on every scene create(). */
    attachScene(scene) {
        this.scene = scene;
        if (!this.ctx && scene.sound?.context) {
            this.ctx = scene.sound.context;
            ['master', 'music', 'sfx', 'voice', 'ambient'].forEach(name => {
                const g = this.ctx.createGain();
                g.connect(name === 'master' ? this.ctx.destination : this.channels.master);
                this.channels[name] = g;
            });
            this.applySettings();
        }
    },

    loadSettings() {
        const profile = (typeof SaveEngine !== 'undefined') ? SaveEngine.load() : {};
        this.settings = Object.assign({}, this.DEFAULT_SETTINGS, profile.audioSettings || {});
        return this.settings;
    },

    saveSettings() {
        if (typeof SaveEngine === 'undefined') return;
        const profile = SaveEngine.load();
        profile.audioSettings = this.settings;
        SaveEngine.save(profile);
    },

    applySettings() {
        if (!this.ctx) return;
        const s = this.settings || this.DEFAULT_SETTINGS;
        const t = this.ctx.currentTime;
        const master = s.soundEnabled ? s.master : 0;
        this.channels.master.gain.setTargetAtTime(master, t, 0.05);
        this.channels.music.gain.setTargetAtTime(s.musicEnabled ? s.music : 0, t, 0.05);
        this.channels.sfx.gain.setTargetAtTime(s.sfx, t, 0.05);
        this.channels.voice.gain.setTargetAtTime(s.voice, t, 0.05);
        this.channels.ambient.gain.setTargetAtTime(s.ambient, t, 0.05);
        if (typeof MusicEngine !== 'undefined') MusicEngine.syncVolume();
    },

    setVolume(channel, value) {
        this.settings[channel] = value;
        this.applySettings();
        this.saveSettings();
    },

    toggleSound() {
        this.settings.soundEnabled = !this.settings.soundEnabled;
        this.applySettings();
        this.saveSettings();
        return this.settings.soundEnabled;
    },

    toggleMusic() {
        this.settings.musicEnabled = !this.settings.musicEnabled;
        this.applySettings();
        this.saveSettings();
        return this.settings.musicEnabled;
    },

    /** Duck music + ambient while voice/important feedback plays. */
    duck(seconds = 1.5) {
        if (!this.ctx) return;
        const t = this.ctx.currentTime;
        const s = this.settings || this.DEFAULT_SETTINGS;
        this.channels.music.gain.cancelScheduledValues(t);
        this.channels.ambient.gain.cancelScheduledValues(t);
        this.channels.music.gain.setTargetAtTime(s.music * 0.25, t, 0.08);
        this.channels.ambient.gain.setTargetAtTime(s.ambient * 0.4, t, 0.08);
        if (typeof MusicEngine !== 'undefined') MusicEngine.syncVolume(0.25);
        clearTimeout(this._duckTimer);
        this._duckTimer = setTimeout(() => {
            if (!this.ctx) return;
            const tt = this.ctx.currentTime;
            this.channels.music.gain.setTargetAtTime(s.musicEnabled ? s.music : 0, tt, 0.4);
            this.channels.ambient.gain.setTargetAtTime(s.ambient, tt, 0.4);
            if (typeof MusicEngine !== 'undefined') MusicEngine.syncVolume();
        }, seconds * 1000);
    },

    // ─── Events ───────────────────────────────────────────────

    on(event, handler) {
        (this._listeners[event] = this._listeners[event] || []).push(handler);
    },

    /**
     * Emit a gameplay audio event. Handlers registered by SFX/Voice/Music
     * engines react; category cooldowns prevent audio fatigue.
     */
    emit(event, data = {}) {
        const handlers = this._listeners[event];
        if (handlers) handlers.forEach(fn => fn(data));
    },

    /** Category rate-limit: returns true if the category may sound now. */
    categoryReady(category, cooldownMs) {
        const last = this._lastCategoryAt[category] || 0;
        if (Date.now() - last < cooldownMs) return false;
        this._lastCategoryAt[category] = Date.now();
        return true;
    },

    /** Track lightweight, local-only audio analytics signals. */
    track(signal) {
        if (typeof SaveEngine === 'undefined') return;
        const profile = SaveEngine.load();
        profile.stats.audio = profile.stats.audio || {};
        profile.stats.audio[signal] = (profile.stats.audio[signal] || 0) + 1;
        SaveEngine.save(profile);
    },
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AudioEngine };
}
