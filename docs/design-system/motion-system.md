# Motion System

Durations/easings come from `DesignTokens.motion` — never invent local timings.

| Category | Duration | Use |
|---|---|---|
| micro | 140ms | button/icon press (`UISystem.press`) |
| uiTransition | 280ms | panels, cards, bubbles in/out |
| character | 300–550ms | bunny hops, tilts, spins |
| reward | 600–900ms | star pops, sticker reveals, count-ups |
| world | 500–700ms | scene/world transitions |

Easings: `Back.easeOut` (pop-in), `Sine.easeInOut` (idle/ambient), `Power2` (hops).

## Rules

- Animation communicates feedback/hierarchy/progress/emotion — never decorates
  at the cost of waiting.
- **Navigation never waits for animation.** Transitions are instant; motion
  continues asynchronously.
- Idle/ambient loops: slow (≥1.4s), subtle amplitude.
- Kill idle tweens when an object becomes interactive-dragged.
- Reward sequences: snappy beats (~220ms per beat), total reveal < 3s.
