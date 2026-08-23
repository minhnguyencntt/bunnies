/**
 * SaveEngine.js — Save/Progress Engine.
 * Persists the child's Knowledge World profile in localStorage (offline-safe).
 */
const SaveEngine = {
    KEY: 'bunnies_knowledge_world_v1',

    defaultProfile() {
        return {
            version: 1,
            xp: 0,
            gems: 0,
            games: {}, // gameId → { plays, levels: {1:{stars,bestScore,plays}}, stickers:[], awards:[] }
            globalAwards: [],
            stats: { totalPlays: 0, totalStars: 0, totalScore: 0 },
            createdAt: Date.now(),
        };
    },

    load() {
        try {
            const raw = localStorage.getItem(this.KEY);
            if (!raw) return this.defaultProfile();
            const p = JSON.parse(raw);
            return Object.assign(this.defaultProfile(), p);
        } catch (e) {
            console.warn('SaveEngine: load failed, using fresh profile', e);
            return this.defaultProfile();
        }
    },

    save(profile) {
        try {
            localStorage.setItem(this.KEY, JSON.stringify(profile));
        } catch (e) {
            console.warn('SaveEngine: save failed', e);
        }
    },

    gameProfile(profile, gameId) {
        if (!profile.games[gameId]) {
            profile.games[gameId] = {
                plays: 0,
                levels: { 1: { stars: 0, bestScore: 0, plays: 0 }, 2: { stars: 0, bestScore: 0, plays: 0 }, 3: { stars: 0, bestScore: 0, plays: 0 } },
                stickers: [],
                awards: [],
            };
        }
        return profile.games[gameId];
    },

    /** Wipe progress so the child can play from the beginning. */
    reset(opts = {}) {
        const keepAudio = opts.keepAudio !== false;
        let audio = null;
        if (keepAudio) {
            try { audio = this.load().audioSettings || null; } catch (e) { audio = null; }
        }
        try {
            localStorage.removeItem(this.KEY);
            const extra = [];
            for (let i = 0; i < localStorage.length; i++) {
                const k = localStorage.key(i);
                if (k && (k.startsWith('bunnies_') || k.startsWith('bunnine_'))) extra.push(k);
            }
            extra.forEach((k) => localStorage.removeItem(k));
        } catch (e) { /* ignore */ }
        if (audio) {
            const fresh = this.defaultProfile();
            fresh.audioSettings = audio;
            this.save(fresh);
        }
    },
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SaveEngine };
}
