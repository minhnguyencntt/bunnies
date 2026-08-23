/**
 * RewardPresentationEngine — persist + present rewards for every game.
 *
 * Persistence happens first. The UI never claims "added to album" unless
 * SaveEngine actually has the new items. Reveal animation is fire-and-forget.
 */
const RewardType = {
    XP: 'xp',
    STARS: 'stars',
    COINS: 'coins',
    STICKER: 'sticker',
    BADGE: 'badge',
    CHARACTER: 'character',
    WORLD: 'world',
};

const RewardPresentationEngine = {
    TYPE: RewardType,

    prepare(gameId) {
        return typeof GameConfig !== 'undefined' ? GameConfig.get(gameId) : null;
    },

    persist(opts) {
        const { gameId, level, analytics, parTimeMs } = opts;
        try {
            const raw = RewardEngine.finishSession(gameId, level, analytics, parTimeMs);
            const persistOk = this.verify(raw);
            return { persistOk, raw, error: persistOk ? null : 'verify_failed' };
        } catch (e) {
            console.error('Reward persist failed', e);
            return { persistOk: false, raw: this.emptyRaw(gameId, level, analytics), error: String(e && e.message || e) };
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
        const gameDef = GameConfig.get(gameId);
        const levelCfg = GameConfig.getLevel(gameId, level) || { rounds: 1 };
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
        const gameDef = raw.gameDef || GameConfig.get(raw.gameId);
        const levelCfg = raw.levelCfg || GameConfig.getLevel(raw.gameId, raw.level) || { rounds: 1 };
        const metrics = raw.metrics || { correctAnswers: 0 };
        const persistOk = extra.persistOk !== false;
        const items = this.buildItems(raw, persistOk);
        const nav = this.nextActions(raw.gameId, raw.level, persistOk);
        return {
            gameId: raw.gameId,
            level: raw.level,
            gameName: gameDef ? gameDef.name : '',
            gameIcon: gameDef ? gameDef.icon : '⭐',
            sceneKey: gameDef ? gameDef.sceneKey : null,
            score: raw.score || 0,
            correctAnswers: metrics.correctAnswers || 0,
            totalQuestions: levelCfg.rounds || 0,
            xpEarned: raw.xp || 0,
            starsEarned: raw.stars || 0,
            coinsEarned: raw.gems || 0,
            rewards: items,
            isNewReward: items.some((i) => i.isNew),
            persistOk,
            persistError: extra.error || null,
            availableNextActions: nav.actions,
            recommendedNextAction: nav.recommended,
            raw,
            knowledgeLevel: raw.knowledgeLevel,
            leveledUp: !!raw.leveledUp,
        };
    },

    present(opts) {
        const persisted = this.persist(opts);
        return this.assemble(persisted.raw, persisted);
    },

    fromRewards(raw, extra = {}) {
        return this.assemble(raw, { persistOk: extra.persistOk !== false, error: extra.error || null });
    },

    retry(result) {
        if (!result || result.persistOk) return result;
        const analytics = result._analytics;
        if (!analytics) return result;
        const next = this.present({
            gameId: result.gameId,
            level: result.level,
            analytics,
            parTimeMs: result._parTimeMs || 15000,
        });
        Object.assign(result, next);
        return result;
    },

    buildItems(raw, persistOk) {
        const gameName = (raw.gameDef || (typeof GameConfig !== 'undefined' && GameConfig.get(raw.gameId)) || {}).name || '';
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
            const nxt = StickerEngine.nextHint(SaveEngine.load(), raw.gameId);
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

    typeLabel(type) {
        if (type === Award.TYPE.STICKER || type === RewardType.STICKER) return Award.typeLabel(Award.TYPE.STICKER);
        if (type === Award.TYPE.BADGE || type === RewardType.BADGE) return Award.typeLabel(Award.TYPE.BADGE);
        if (type === RewardType.XP) return 'XP';
        if (type === RewardType.STARS) return 'SAO';
        if (type === RewardType.COINS) return 'ĐÁ TRI THỨC';
        return 'PHẦN THƯỞNG';
    },

    nextActions(gameId, level, persistOk) {
        const hasContinue = level < 3;
        const actions = [];
        if (!persistOk) {
            actions.push({ id: 'retry_persist', label: 'THỬ LẠI', primary: true });
        }
        if (hasContinue) {
            actions.push({ id: 'continue', label: 'TIẾP TỤC', hint: `Màn ${level + 1}`, primary: persistOk });
        }
        actions.push({ id: 'replay', label: 'CHƠI LẠI', primary: false });
        actions.push({
            id: 'levels',
            label: 'CHỌN MÀN',
            primary: persistOk && !hasContinue,
        });
        actions.push({ id: 'home', label: 'VỀ NHÀ', primary: false });
        return {
            actions,
            recommended: !persistOk ? 'retry_persist' : (hasContinue ? 'continue' : 'levels'),
        };
    },

    celebrate(scene, result) {
        try { AudioEngine.emit('GameCompleted'); } catch (e) { /* ignore */ }
        try { AudioEngine.emit('BunnyReaction'); } catch (e) { /* ignore */ }
        if (result && result.isNewReward && result.persistOk) {
            const first = (result.rewards || []).find((r) => r.isNew);
            try {
                if (first && first.type === RewardType.STICKER) {
                    AudioEngine.emit('StickerUnlocked', { rarity: first.rarity });
                } else {
                    AudioEngine.emit('AwardUnlocked');
                }
            } catch (e) { /* ignore */ }
        }
        if (!scene || !scene.add) return;
        const w = scene.cameras.main.width;
        const h = scene.cameras.main.height;
        for (let i = 0; i < 10; i++) {
            const x = Phaser.Math.Between(80, w - 80);
            const y = Phaser.Math.Between(80, h - 80);
            const s = scene.add.graphics().setDepth(40);
            s.fillStyle([0xffd700, 0xff69b4, 0x87ceeb, 0x90ee90][i % 4], 0.85);
            s.fillCircle(0, 0, Phaser.Math.Between(3, 6));
            s.setPosition(x, y);
            scene.tweens.add({
                targets: s, y: y - 50, alpha: 0, scale: 0,
                duration: 700, delay: i * 40, onComplete: () => s.destroy(),
            });
        }
    },
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { RewardPresentationEngine, RewardType };
}
