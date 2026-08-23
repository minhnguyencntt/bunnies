# SKILL: Animation

## Purpose

Animate anything consistently with the global motion language.

## Reusable pieces

- `DesignTokens.motion` — durations (micro 140 / ui 280 / character 300–550 /
  reward 600–900 / world 700) and easings.
- `UISystem.press` — tactile button press.
- `GameShell.companionReact(emotion)` — Bunnine emotion system
  (happy/excited/celebrate/think/curious).
- `GameShell.spawnSparkles(x,y,n)`, `RewardFX.correctAnswer(scene,x,y)`.
- Result screen reveal: steps at ~220ms beats, synced with audio events.

## Rules

- Animation = feedback/hierarchy/emotion. Never make the user wait.
- Navigation and input never wait for animation.
- Idle loops: slow (≥1.4s), subtle. Kill idle tweens on dragstart.
- Reward moments: exciting but < 3s total.
- Character reactions follow the emotion map — no new one-off reaction systems.

## Validation

- [ ] Durations/easings from tokens
- [ ] No blocked interaction during animation
- [ ] 60 FPS (no per-frame object allocation)
