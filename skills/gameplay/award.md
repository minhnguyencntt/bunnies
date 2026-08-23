# SKILL: Awards (first-class collectibles)

## Purpose

Stickers and badges are the same domain object: `Award`. ResultScreen and
the album render that object. Games never invent reward cards from ids or
emoji strings.

## Object contract

Every Award has:

| Field | Role |
|---|---|
| `id`, `type` (`sticker` / `badge`) | identity |
| `name`, `description`, `hint`, `rarity`, `gameId` | metadata |
| `artwork` `{ kind, glyph, spriteKey, palette }` | visual asset |
| `presentation` `{ isNew, owned, teaser, persistOk, state }` | presentation |
| `persisted` | SaveEngine actually has it |

States: `LOCKED` · `REVEALED` (just earned + saved) · `OWNED` · `PENDING` (earned, save failed).

## How to grant / present

```
RewardEngine.finishSession()        → raw sticker/award defs
Award.hydrate(def, { type, isNew, persistOk, owned })
RewardPresentationEngine.present()  → completion.rewards: Award[]
Award.pickHero(rewards)             → the card that owns the screen
UISystem.awardCard(scene, x, y, award, { size: 'hero'|'support'|'album' })
```

Never mark `isNew` or say "đã lưu vào album" unless `Award.verifyOwned` / `persistOk`.

## UI

- Completion: hero Award is the visual center. Stats are a compact strip.
- Album: same `Award` objects from `StickerEngine.albumData` / `Award.fromSave`.
- New collectible types extend `Award.artworkFor` + `UISystem.awardCard`. Do not
  add a second card component.
