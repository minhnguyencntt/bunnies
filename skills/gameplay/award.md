# SKILL: Awards (first-class collectibles)

## Purpose

Stickers and badges are the same domain object: `Award`. The Award Screen
and the album render that object. Games never invent reward cards from ids
or emoji strings.

## Object contract

Every Award has:

| Field | Role |
|---|---|
| `id`, `type` (`sticker` / `badge`) | identity |
| `name` / `title`, `description`, `hint`, `rarity`, `gameId` | metadata |
| `artwork` `{ kind, glyph, spriteKey, palette }` | visual asset |
| `presentation` `{ isNew, owned, teaser, persistOk, state }` | presentation |
| `persisted` | SaveEngine actually has it |

States: `LOCKED` · `REVEALED` (just earned + saved) · `OWNED` · `PENDING` (earned, save failed).

## How to grant / present

```
Game → GameCompletionResult
  → AwardGenerator.generate()     persist + hydrate Award[]
  → AwardResult                   structured hero + XP/stars/coins + next actions
  → NextActionResolver            CONTINUE / PLAY_AGAIN / CHOOSE_GAME / HOME
  → RewardPresentationEngine.celebrate()  fire-and-forget
  → ResultScreen                  shared Award Screen
```

`Award.pickHero(rewards)` chooses the card that owns the screen.
`UISystem.awardCard(scene, x, y, award, { size: 'hero'|'support'|'album' })`
is the only renderer.

Never mark `isNew` or say "đã lưu vào album" unless `Award.verifyOwned` / `persistOk`.

## AwardResult fields

`awardId`, `type`, `title`, `description`, `artwork`, `icon`, `xp`, `stars`,
`coins`, `quantity`, `isNew`, `metadata`, plus session fields (`hero`,
`rewards`, `availableNextActions`).

## UI

- Completion: hero Award is the visual center. Stats are a compact strip under it.
- Album: same `Award` objects from `StickerEngine.albumData` / `Award.fromSave`.
- New collectible types extend `Award.artworkFor` + `UISystem.awardCard`. Do not
  add a second card component.
