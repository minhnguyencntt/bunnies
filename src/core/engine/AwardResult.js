/**
 * AwardResult — structured completion award for every game.
 *
 * This is the object that is persisted, displayed, and used to resolve
 * next actions. Games never invent a parallel reward shape.
 */
const AwardResult = {
    create(input) {
        const raw = input.raw || {};
        const rewards = input.rewards || [];
        const hero = input.hero || Award.pickHero(rewards);
        const persistOk = input.persistOk !== false;
        const nav = input.nav || { actions: [], recommended: null };
        const gameDef = raw.gameDef
            || (typeof GameConfig !== 'undefined' && GameConfig.get(raw.gameId))
            || {};
        const levelCfg = raw.levelCfg
            || (typeof GameConfig !== 'undefined' && GameConfig.getLevel(raw.gameId, raw.level))
            || { rounds: 0 };
        const metrics = raw.metrics || {};
        const title = hero ? (hero.title || hero.name || '') : '';

        return {
            awardId: hero ? hero.id : null,
            type: hero ? hero.type : null,
            title,
            description: hero ? (hero.description || hero.hint || '') : '',
            artwork: hero ? hero.artwork : null,
            icon: hero ? hero.icon : null,
            xp: raw.xp || 0,
            stars: raw.stars || 0,
            coins: raw.gems || 0,
            quantity: 1,
            isNew: !!(hero && hero.isNew),
            metadata: {
                score: raw.score || 0,
                rarity: hero && hero.rarity,
                gameId: raw.gameId,
                level: raw.level,
                knowledgeLevel: raw.knowledgeLevel || null,
                leveledUp: !!raw.leveledUp,
            },
            hero,
            rewards,
            isNewReward: rewards.some((i) => i.isNew),
            persistOk,
            persistError: input.persistError || input.error || null,
            gameId: raw.gameId,
            level: raw.level,
            gameName: gameDef.name || '',
            gameIcon: gameDef.icon || '⭐',
            sceneKey: gameDef.sceneKey || null,
            score: raw.score || 0,
            correctAnswers: metrics.correctAnswers || 0,
            totalQuestions: levelCfg.rounds || 0,
            xpEarned: raw.xp || 0,
            starsEarned: raw.stars || 0,
            coinsEarned: raw.gems || 0,
            availableNextActions: nav.actions,
            recommendedNextAction: nav.recommended,
            raw,
            knowledgeLevel: raw.knowledgeLevel,
            leveledUp: !!raw.leveledUp,
            celebration: this.celebrationMessage(hero, persistOk, gameDef.name || ''),
        };
    },

    celebrationMessage(hero, persistOk, gameName) {
        if (!persistOk) return 'Chưa lưu được phần thưởng.';
        if (hero && hero.isNew && hero.title) return `Bạn nhận ${hero.title}!`;
        if (hero && hero.isNew && hero.name) return `Bạn nhận ${hero.name}!`;
        if (gameName) return `Bạn hoàn thành ${gameName}!`;
        return 'Giỏi lắm!';
    },
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AwardResult };
}
