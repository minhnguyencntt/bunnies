# ADR-005: Navigation semantics & no-lock policy

## Status

Accepted (2026-08-23)

## Context

Navigation was inconsistent (🏠 Home top-left in gameplay, 🗺 elsewhere; faint
21px targets), level cards had a display-only Play button, and levels/worlds
were access-locked behind progression — inappropriate friction for children.

## Decision

1. **Top-left = BACK (◀)** everywhere: gameplay → its level select → world map.
   Home (🗺 Bản đồ) is explicit in the pause menu and result screen.
2. Nav controls use `UISystem.navButton`: 26px radius, elevated, high-contrast
   primary color — visible over every world background.
3. **No access locking**: `ProgressionEngine.isLevelUnlocked/isGameUnlocked`
   always return true. Progression drives rewards, recommendations (next-goal
   banner), and celebration — never access. Discover → Tap → Play.
4. The level-card **Play button is itself tappable** (not just the card).

## Consequences

- Predictable navigation; no confusing lock states; zero access frustration.
- Stars/levels remain as achievement markers (⭐n/9, 🥉🥈🥇), not gates.
