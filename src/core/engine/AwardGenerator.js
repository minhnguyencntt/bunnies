/**
 * AwardGenerator — GameCompletionResult → AwardResult for every game.
 *
 * Games only supply session facts (gameId, level, analytics).
 * This engine owns persist, structured award data, and next-action input.
 */
const AwardGenerator = {
    generate(opts) {
        const persisted = this.persist(opts);
        return this.assemble(persisted.raw, persisted);
    },

    fromRaw(raw, extra = {}) {
        return this.assemble(raw, {
            persistOk: extra.persistOk !== false,
            error: extra.error || extra.persistError || null,
        });
    },

    persist(opts) {
        const { gameId, level, analytics, parTimeMs } = opts || {};
        try {
            const raw = RewardEngine.finishSession(gameId, level, analytics, parTimeMs);
            const persistOk = this.verify(raw);
            return { persistOk, raw, error: persistOk ? null : 'verify_failed' };
        } catch (e) {
            console.error('Award persist failed', e);
            return {
                persistOk: false,
                raw: this.emptyRaw(gameId, level, analytics),
                error: String((e && e.message) || e),
            };
        }
    },

    verify(raw) {
        if (!raw || !raw.gameId) return false;
        try {
            const profile = SaveEngine.load();
            const gp = profile.games[raw.gameId];
            if (!gp) return false;
            const levelProf = gp.levels[raw.level];
            if (!levelProf) return false;
            if ((levelProf.bestScore || 0) < (raw.score || 0)) return false;
            if ((levelProf.stars || 0) < (raw.stars || 0)) return false;
            const gameName = (raw.gameDef || GameConfig.get(raw.gameId) || {}).name || '';
            for (const s of raw.stickers || []) {
                const award = Award.hydrate(s, {
                    type: Award.TYPE.STICKER, persistOk: true, owned: true,
                    gameId: s.gameId || raw.gameId, gameName: s.gameName || gameName,
                });
                if (!Award.verifyOwned(award, profile)) return false;
            }
            for (const a of raw.awards || []) {
                const award = Award.hydrate(a, {
                    type: Award.TYPE.BADGE, persistOk: true, owned: true,
                    gameId: a.gameId !== undefined ? a.gameId : raw.gameId,
                    gameName: a.gameName || gameName,
                });
                if (!Award.verifyOwned(award, profile)) return false;
            }
            return true;
        } catch (e) {
            return false;
        }
    },

    emptyRaw(gameId, level, analytics) {
        const gameDef = typeof GameConfig !== 'undefined' ? GameConfig.get(gameId) : null;
        const levelCfg = typeof GameConfig !== 'undefined'
            ? (GameConfig.getLevel(gameId, level) || { rounds: 1 })
            : { rounds: 1 };
        const metrics = analytics && analytics.getMetrics
            ? analytics.getMetrics()
            : { correctAnswers: 0 };
        return {
            gameId, level, gameDef, levelCfg,
            score: 0, stars: 0, isNewBest: false, prevBest: 0,
            xp: 0, gems: 0, awards: [], stickers: [],
            knowledgeLevel: { level: 1, intoLevel: 0, needed: 100 },
            leveledUp: false,
            worldProgress: { percent: 0, stars: 0, maxStars: 54 },
            metrics,
        };
    },

    assemble(raw, extra = {}) {
        const persistOk = extra.persistOk !== false;
        const rewards = this.buildItems(raw, persistOk);
        const hero = Award.pickHero(rewards);
        const gameDef = raw.gameDef
            || (typeof GameConfig !== 'undefined' && GameConfig.get(raw.gameId))
            || {};
        const nav = NextActionResolver.resolve({
            gameId: raw.gameId,
            level: raw.level,
            persistOk,
            sceneKey: gameDef.sceneKey || null,
        });
        return AwardResult.create({
            raw,
            hero,
            rewards,
            persistOk,
            persistError: extra.error || extra.persistError || null,
            nav,
        });
    },

    buildItems(raw, persistOk) {
        const gameName = (raw.gameDef
            || (typeof GameConfig !== 'undefined' && GameConfig.get(raw.gameId))
            || {}).name || '';
        const items = [];
        (raw.stickers || []).forEach((s) => {
            items.push(Award.hydrate(s, {
                type: Award.TYPE.STICKER,
                isNew: true,
                owned: persistOk,
                persistOk,
                gameId: s.gameId || raw.gameId,
                gameName: s.gameName || gameName,
            }));
        });
        (raw.awards || []).forEach((a) => {
            items.push(Award.hydrate(a, {
                type: Award.TYPE.BADGE,
                isNew: true,
                owned: persistOk,
                persistOk,
                gameId: a.gameId !== undefined ? a.gameId : raw.gameId,
                gameName: a.gameName || gameName,
            }));
        });
        if (!items.length) {
            const nxt = typeof StickerEngine !== 'undefined'
                ? StickerEngine.nextHint(SaveEngine.load(), raw.gameId)
                : null;
            if (nxt) {
                items.push(Award.hydrate(nxt, {
                    type: Award.TYPE.STICKER,
                    teaser: true,
                    owned: false,
                    persistOk,
                    gameId: raw.gameId,
                    gameName,
                }));
            }
        }
        return items;
    },

    retry(result) {
        if (!result || result.persistOk) return result;
        const analytics = result._analytics;
        if (!analytics) return result;
        const next = this.generate({
            gameId: result.gameId,
            level: result.level,
            analytics,
            parTimeMs: result._parTimeMs || 15000,
        });
        Object.assign(result, next);
        return result;
    },
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AwardGenerator };
}
