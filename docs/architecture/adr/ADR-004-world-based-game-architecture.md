# ADR-004: World-based, data-driven game architecture

## Status

Accepted (2026-08-22)

## Context

The original codebase had 4 independent quiz screens with duplicated logic and
no progression. The product needs unlimited future worlds/games without
reinventing UI/engine each time.

## Decision

- Games are **configuration** (`GameConfig.js`: levels, difficulty, scoring,
  rewards, hints, awards, stickers) + a scene class extending `GameShell`
  (or a shared base like `VisualMathScreen` for visual 3-choice math).
- 13 engines (Level, Difficulty, Adaptive, Scoring, Star, Award, Sticker,
  Reward, XP, Progression, Hint, Analytics, Save) shared by all games.
- Worlds belong to one Knowledge World map with visible progression.

## Consequences

- New games are mostly config + theme; engine behavior is uniform and tested.
- Cross-game systems (album, awards, world map) work for free per game.
- Engine changes affect all games — changes need the full E2E regression.
