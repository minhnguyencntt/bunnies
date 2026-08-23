/**
 * RewardPresentationEngine — fire-and-forget award presentation.
 *
 * Generation, persist, and next actions live on AwardGenerator /
 * NextActionResolver. This facade keeps older call sites working and
 * owns celebration audio / sparkles only.
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
        return AwardGenerator.persist(opts);
    },

    verify(raw) {
        return AwardGenerator.verify(raw);
    },

    present(opts) {
        return AwardGenerator.generate(opts);
    },

    fromRewards(raw, extra = {}) {
        return AwardGenerator.fromRaw(raw, extra);
    },

    retry(result) {
        return AwardGenerator.retry(result);
    },

    buildItems(raw, persistOk) {
        return AwardGenerator.buildItems(raw, persistOk);
    },

    nextActions(gameId, level, persistOk) {
        const sceneKey = (typeof GameConfig !== 'undefined' && (GameConfig.get(gameId) || {}).sceneKey) || null;
        return NextActionResolver.resolve({ gameId, level, persistOk, sceneKey });
    },

    typeLabel(type) {
        if (type === Award.TYPE.STICKER || type === RewardType.STICKER) return Award.typeLabel(Award.TYPE.STICKER);
        if (type === Award.TYPE.BADGE || type === RewardType.BADGE) return Award.typeLabel(Award.TYPE.BADGE);
        if (type === RewardType.XP) return 'XP';
        if (type === RewardType.STARS) return 'SAO';
        if (type === RewardType.COINS) return 'ĐÁ TRI THỨC';
        return 'PHẦN THƯỞNG';
    },

    celebrate(scene, result) {
        try { AudioEngine.emit('GameCompleted'); } catch (e) { /* ignore */ }
        try { AudioEngine.emit('BunnyReaction'); } catch (e) { /* ignore */ }
        const stars = result && (result.starsEarned || result.stars) || 0;
        if (stars > 0) {
            try { AudioEngine.emit('StarEarned', { index: 0, count: stars }); } catch (e) { /* ignore */ }
        }
        if (result && result.isNewReward && result.persistOk) {
            const first = (result.rewards || []).find((r) => r.isNew);
            try {
                if (first && first.type === Award.TYPE.STICKER) {
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
