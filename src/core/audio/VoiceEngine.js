/**
 * VoiceEngine.js — Instruction Voice Engine.
 *
 * Context-aware, variation-rich, cooldown-limited voice playback.
 * Plays generated mp3 lines (edge-tts, see scripts/voice_library.json);
 * falls back to Web Speech synthesis with localized text when a file is
 * missing; falls back to silence gracefully. Voice always ducks music.
 *
 * Voice personality: warm, friendly, encouraging — Bunnine lines use a
 * younger voice, narrator lines a clear friendly voice (see generation
 * script). Level 1 lines are short and slow; Level 3 lines are concise.
 */
const VoiceEngine = {
    _lastLineByCategory: {},
    _current: null,

    /** Play a category variation (respects cooldown + no immediate repeats). */
    say(category, { force = false } = {}) {
        const cat = AudioConfig.VOICE_CATEGORIES[category];
        if (!cat) return false;
        if (!force && !AudioEngine.categoryReady(`voice_${category}`, cat.cooldownMs)) return false;

        const last = this._lastLineByCategory[category];
        const pool = cat.lines.filter(id => id !== last);
        const lineId = (pool.length ? pool : cat.lines)[Math.floor(Math.random() * (pool.length ? pool.length : cat.lines.length))];
        this._lastLineByCategory[category] = lineId;
        return this.play(lineId);
    },

    /** Play the level-appropriate instruction for a game. */
    sayInstruction(gameId, level) {
        return this.play(AudioConfig.instructionFor(gameId, level));
    },

    /** Educational counting voice, synchronized with visual counting. */
    count(n) {
        if (n < 1 || n > 20) return false;
        if (!AudioEngine.categoryReady('voice_count', 250)) return false;
        return this.play(`count_${n}`, { duckSeconds: 0.6 });
    },

    /**
     * Play one line by id. Lazy-loads the mp3 through the attached scene;
     * falls back to speech synthesis; always ducks music underneath.
     */
    play(lineId, { duckSeconds = null } = {}) {
        const line = AudioConfig.line(lineId);
        if (!line) return false;
        if (AudioEngine.settings?.soundEnabled === false) return false;
        AudioEngine.track('voicePlayed');

        const scene = AudioEngine.scene;
        const key = `voice_${lineId}`;
        const duck = duckSeconds ?? 1.6;

        if (scene) {
            const playFile = () => {
                if (!scene.cache.audio.exists(key)) return false;
                this.stopCurrent();
                AudioEngine.duck(duck);
                this._current = scene.sound.add(key, { volume: this._voiceVolume() });
                this._current.play();
                return true;
            };
            if (scene.cache.audio.exists(key)) return playFile();
            // Lazy-load the generated file; speech-synthesis fallback meanwhile
            const file = this._fileFor(lineId, line);
            scene.load.audio(key, file);
            scene.load.once('complete', () => playFile());
            scene.load.once('loaderror', () => this._speak(line));
            scene.load.start();
            return true;
        }
        return this._speak(line);
    },

    _fileFor(lineId, line) {
        if (line.game && line.level) {
            return `screens/${this._gameFolder(line.game)}/assets/audio/voice/level_${line.level}.mp3`;
        }
        return `core/audio/assets/voice/${lineId}.mp3`;
    },

    _gameFolder(gameId) {
        return (AudioConfig.GAME_AUDIO[gameId] && gameId) || gameId;
    },

    _voiceVolume() {
        const s = AudioEngine.settings || AudioEngine.DEFAULT_SETTINGS;
        return s.voice * 0.9;
    },

    /** Speech-synthesis fallback (also the path for future locales). */
    _speak(line) {
        if (typeof speechSynthesis === 'undefined') return false;
        try {
            this.stopCurrent();
            AudioEngine.duck(1.4);
            const u = new SpeechSynthesisUtterance(line[AudioConfig.locale] || line.vi);
            u.lang = AudioConfig.locale === 'vi' ? 'vi-VN' : 'en-US';
            u.rate = 1.0;
            u.pitch = line.voice === 'bunnine' ? 1.4 : 1.0;
            u.volume = Math.min(1, this._voiceVolume());
            speechSynthesis.speak(u);
            return true;
        } catch (e) {
            return false;
        }
    },

    stopCurrent() {
        if (this._current) {
            try { this._current.stop(); } catch (e) { /* ignore */ }
            this._current = null;
        }
        if (typeof speechSynthesis !== 'undefined') {
            try { speechSynthesis.cancel(); } catch (e) { /* ignore */ }
        }
    },
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { VoiceEngine };
}
