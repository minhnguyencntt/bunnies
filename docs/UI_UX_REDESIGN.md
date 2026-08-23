# Phase 4 — UI/UX Redesign

Visual direction: modern, premium, colorful, playful, child-safe. Large touch
targets, minimal text (voice-first), strong animations, character reactions,
micro-interactions, reward animations. Nothing looks like a school worksheet.

## Screen inventory

| Screen | File | What changed |
|---|---|---|
| Boot / Loading | `screens/boot/BootScreen.js` | Kept: magical loading bar + running Bunnine |
| **Knowledge World Map** | `screens/menu/menu_screen.js` | Added progression HUD (🎓 Knowledge Level + XP bar, ⭐ n/36, 💎 gems), 🎟 Album button, per-city star badges (⭐n/9 + 🥉🥈🥇 tiers), next-goal banner |
| **Level Selection** | `core/game/LevelSelectScreen.js` | New. 3 cards per game: rank (🌱/⚔️/👑), level title, earned stars, best score, lock state with how-to-unlock |
| **Gameplay HUD** | `core/game/GameShell.js` | New unified HUD: 🏠 home · game + level + round label · live score · ⭐ meter · 💡 hint · ⏸ pause · timer bar (timed levels) · 🔥 combo indicator |
| **Pause** | `core/game/GameShell.js` | New overlay: ▶ Chơi tiếp / 🔄 Chơi lại / 🗺 Về bản đồ |
| **Result Screen** | `core/game/ResultScreen.js` | New. Priority order: celebration → score count-up → stars pop-in → XP bar (+level-up) → gems → awards → stickers → world progress → actions (🔄 Chơi lại / ▶ Màn tiếp / 🗺 Bản đồ) |
| **Sticker Album** | `core/game/StickerAlbumScreen.js` | New. "Album Sticker Của Tớ": one row per game collection; owned stickers in color with rarity frames; locked show 🔒 + tap reveals how to earn |
| Award Screen | merged into Result Screen | 🏆 "Huy hiệu mới" reveal with rarity |
| Reward Screen | merged into Result Screen | XP bar, gems, stickers animate in sequence |
| Progress Screen | merged into World Map HUD | level, XP bar, stars, gems, next goal always visible |
| Achievement Screen | merged into Result Screen + Album | awards on result; collections in album |

## Feedback language (child-safe)

- **Correct**: Bunnine cheers, golden flash, particle burst, praise text, score count-up, star meter fills.
- **Incorrect**: gentle shake, soft 💭 puff, Bunnine encouragement ("Gần đúng rồi! Thử lại nhé!"), free retry. Never red screens, harsh sounds, or shame.
- **Hints**: cost a few score points, never remove rewards. L1 direct visual, L2 partial, L3 conceptual.

## Interaction standards

- All custom containers use **centered, padded hit areas** (`setCenteredInput`) — no dead zones on small fingers.
- Drag targets kill idle tweens on `dragstart` so idle motion never fights the drag.
- Buttons: hover/press scale micro-interactions, 46px+ HUD targets, 72–104px choice buttons.
- Every scene: skip-able intro (≤ 7s), pause, one-tap home, offline PWA (service worker precaches engine + framework).
