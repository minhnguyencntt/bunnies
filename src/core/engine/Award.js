/**
 * Award — first-class collectible (sticker or badge).
 *
 * Every award has identity, metadata, visual artwork, presentation state,
 * and a persistence check. ResultScreen and the album render this object.
 * Games never invent reward cards from raw ids or emoji strings.
 */
const AwardType = {
    STICKER: 'sticker',
    BADGE: 'badge',
};

const AwardState = {
    LOCKED: 'LOCKED',
    REVEALED: 'REVEALED',
    OWNED: 'OWNED',
    PENDING: 'PENDING',
};

const Award = {
    TYPE: AwardType,
    STATE: AwardState,

    rarityStyle(rarity) {
        const table = (typeof GameConfig !== 'undefined' && GameConfig.RARITY_STYLE) || {};
        return table[rarity] || table.common || { label: 'Thường', color: '#8bc34a', glow: 0x8bc34a };
    },

    artworkFor(def) {
        const id = def && def.id ? String(def.id) : '';
        const icon = (def && def.icon) || '🎁';
        const bunny = icon === '🐰' || id.includes('bunny');
        return {
            kind: bunny ? 'sprite' : 'glyph',
            glyph: icon,
            spriteKey: bunny ? 'spr_bunny_happy' : null,
            palette: this.rarityStyle(def && def.rarity),
        };
    },

    typeLabel(type) {
        if (type === AwardType.STICKER) return 'STICKER';
        if (type === AwardType.BADGE) return 'HUY HIỆU';
        return 'PHẦN THƯỞNG';
    },

    newLabel(type) {
        if (type === AwardType.STICKER) return 'Sticker mới';
        if (type === AwardType.BADGE) return 'Huy hiệu mới';
        return 'Phần thưởng mới';
    },

    lookup(id) {
        if (!id || typeof GameConfig === 'undefined') return null;
        const sticker = GameConfig.allStickers().find((s) => s.id === id);
        if (sticker) return { def: sticker, type: AwardType.STICKER };
        const badge = GameConfig.allAwards().find((a) => a.id === id);
        if (badge) return { def: badge, type: AwardType.BADGE };
        return null;
    },

    hydrate(def, extra = {}) {
        const src = def || {};
        const found = src.id && !extra.type ? this.lookup(src.id) : null;
        const type = extra.type || (found && found.type) || AwardType.BADGE;
        const teaser = !!extra.teaser;
        const persistOk = extra.persistOk !== false;
        const isNew = !!extra.isNew && persistOk && !teaser;
        const owned = teaser ? false : !!(extra.owned && persistOk) || isNew;
        let state = AwardState.LOCKED;
        if (teaser) state = AwardState.LOCKED;
        else if (extra.isNew && !persistOk) state = AwardState.PENDING;
        else if (isNew) state = AwardState.REVEALED;
        else if (owned) state = AwardState.OWNED;

        const artwork = this.artworkFor(src);
        const rarity = src.rarity || 'common';
        const presentation = { isNew, owned, teaser, persistOk, state };

        return {
            id: src.id,
            type,
            name: src.name || '',
            description: src.description || src.hint || '',
            hint: src.hint || src.description || '',
            rarity,
            rarityStyle: this.rarityStyle(rarity),
            gameId: src.gameId !== undefined ? src.gameId : extra.gameId,
            gameName: src.gameName || extra.gameName || '',
            icon: src.icon,
            artwork,
            presentation,
            persisted: owned && persistOk && !teaser,
            isNew,
            owned,
            teaser,
            state,
        };
    },

    fromCatalog(id, extra = {}) {
        const found = this.lookup(id);
        if (!found) return null;
        return this.hydrate(found.def, Object.assign({ type: found.type }, extra));
    },

    verifyOwned(award, profile) {
        if (!award || !award.id || !profile) return false;
        if (award.type === AwardType.STICKER) {
            return ((profile.games[award.gameId] || {}).stickers || []).includes(award.id);
        }
        if (award.gameId) {
            return ((profile.games[award.gameId] || {}).awards || []).includes(award.id);
        }
        return (profile.globalAwards || []).includes(award.id);
    },

    fromSave(profile) {
        if (typeof GameConfig === 'undefined' || !profile) return [];
        const stickers = GameConfig.allStickers().map((s) => this.hydrate(s, {
            type: AwardType.STICKER,
            owned: ((profile.games[s.gameId] || {}).stickers || []).includes(s.id),
            persistOk: true,
            gameId: s.gameId,
            gameName: s.gameName,
        }));
        const badges = GameConfig.allAwards().map((a) => this.hydrate(a, {
            type: AwardType.BADGE,
            owned: a.gameId
                ? ((profile.games[a.gameId] || {}).awards || []).includes(a.id)
                : (profile.globalAwards || []).includes(a.id),
            persistOk: true,
            gameId: a.gameId,
            gameName: a.gameName,
        }));
        return stickers.concat(badges);
    },

    pickHero(items) {
        const list = items || [];
        if (!list.length) return null;
        const rank = { legendary: 4, epic: 3, rare: 2, common: 1 };
        const fresh = list.filter((a) => a.isNew && !a.teaser);
        const pool = fresh.length ? fresh : list;
        return pool.slice().sort((a, b) => (rank[b.rarity] || 0) - (rank[a.rarity] || 0))[0];
    },
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Award, AwardType, AwardState };
}
