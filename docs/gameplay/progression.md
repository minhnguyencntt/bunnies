# Progression

## Unlocks

- Levels within a game: sequential — finish Màn N (≥1⭐) to open Màn N+1.
- Worlds: `unlockRequires` in GameConfig (e.g. Rừng Diệu Kỳ needs Vườn Kẹo Ngọt
  Màn 1). Locked map markers show 🔒 + how-to-unlock hint.
- `ProgressionEngine.isLevelUnlocked / isGameUnlocked / unlockHint`.

## Visibility

- Map markers: ⭐n/9 per game + 🥉 (3+) / 🥈 (6+) / 🥇 (9⭐) tiers.
- Menu HUD: 🎓 Knowledge Level + XP bar, ⭐ total, 💎 gems, next-goal banner.
- Sticker Album: per-game collections, owned vs 🔒 (with unlock hint).

## Persistence

`SaveEngine` → localStorage `bunnies_knowledge_world_v1`. Profile: xp, gems,
per-game levels (stars/bestScore/plays), stickers, awards, stats, audioSettings.
Extend the profile shape additively; never break old saves.
