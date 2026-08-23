# docs/gameplay/AGENTS.md

Gameplay architecture rules. Engine code: `src/core/engine/` + `src/core/game/`.

## The loop

Explore → Interact → Solve → Feedback → Score → CompletionEngine → Reward → Next Action.
Never Question → Multiple Choice → Answer → Next Question without a game world
around it.

## Every game MUST

- Keep its original name and educational goal.
- Have exactly 3 levels (🌱 Nhà Thám Hiểm / ⚔️ Nhà Phiêu Lưu / 👑 Bậc Thầy) —
  age bands 3–5 / 6–10 / 10–15 are design constraints, never UI labels.
- Be defined in `GameConfig.js` (difficulty, scoring, rewards, hints, awards,
  stickers) — data-driven, not hardcoded.
- Extend `GameShell` (or a shared base like `VisualMathScreen`).
- Emit audio events; give Bunnine an active role; support hints; be replayable.

## Reference patterns

- `gameplay-patterns.md` — round flow, guided retry, visual math
- `reward-system.md` — Score→Stars→XP→Awards→Stickers→Gems→World
  (`Award` object + `UISystem.awardCard` on ResultScreen and album)
- `progression.md` — level/world unlocks, map progression
- `difficulty-system.md` — difficulty dimensions + adaptive tiers
