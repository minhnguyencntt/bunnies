# Difficulty System

## Dimensions (per level, in GameConfig)

`complexity, objectCount, choiceCount, timeLimit, memoryLoad, distractionLevel,
hintLevel, interactionSteps, questionComplexity, visualComplexity,
sequenceLength, mathRange, errorTolerance` (+ game-specific extras such as
`paletteSize` for color-matching games).

Level design targets (constraints, not UI labels):

| | Màn 1 🌱 (3–5) | Màn 2 ⚔️ (6–10) | Màn 3 👑 (10–15) |
|---|---|---|---|
| Timer | none | light (25–30s) | tighter (20–30s) |
| mathRange | ≤ 5 | ≤ 8–10 | ≤ 20 |
| Choices | 0–3 | 3–4 | 4 |
| Hints | direct visual | partial | conceptual |
| Steps | 1 | 2 | 3+ |

## Adaptive difficulty (within a level)

`AdaptiveDifficultyEngine`: tier −2…+2. Tier up after 3 consecutive correct with
no hints; tier down after 2 consecutive mistakes or low rolling accuracy.
Adjusts mathRange/objectCount/timeLimit/sequenceLength and enriches hints when
struggling. One tier at a time — never sudden frustration.

## Star calibration

Thresholds per level (`scoring.starThresholds`, default [40, 75]; L3 [45, 78]).
3⭐ must be achievable by the target age playing well — verify by playtesting
with the E2E harness.
