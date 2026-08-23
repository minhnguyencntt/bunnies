# Progression

## Unlocks (ADR-005: no access locking)

- **All games and levels are always playable** — Discover → Tap → Play.
  `ProgressionEngine.isLevelUnlocked/isGameUnlocked` always return true.
- Progression is expressed as rewards & guidance only: stars per level,
  best scores, 🥉🥈🥇 map tiers, the next-goal banner, sticker/award unlocks.
- Recommended order still exists (next-goal suggestion), never as a gate.

## Visibility

- Map markers: ⭐n/9 per game + 🥉 (3+) / 🥈 (6+) / 🥇 (9⭐) tiers.
- Menu HUD: 🎓 Knowledge Level + XP bar, ⭐ total, 💎 gems, next-goal banner.
- Sticker Album: per-game collections, owned vs 🔒 (with unlock hint).

## Persistence

`SaveEngine` → localStorage `bunnies_knowledge_world_v1`. Profile: xp, gems,
per-game levels (stars/bestScore/plays), stickers, awards, stats, audioSettings.
Extend the profile shape additively; never break old saves.
