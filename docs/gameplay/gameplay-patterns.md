# Gameplay Patterns

## Round lifecycle (GameShell)

`startRound(i)` → `presentRound(i, diff)` (subclass) → child interacts →
`answerCorrect(x,y)` / `answerWrong(x,y)` / `recordFumble()` → `advanceRound()`
→ after N rounds `finishSession()` → RewardEngine → ResultScreen.

Rules:
- `acceptingInput` gates input; the shell manages timers, combo, hints, pause.
- Wrong answers: gentle shake + encouragement + free retry. Never advance
  with a "fail" feeling.
- Fumbles (mis-taps, bad drops) count as mistakes, not wrong answers.

## Guided retry (VisualMathScreen)

After 2 wrong answers in one round: count objects aloud (voice 1-2-3… synced
with highlights), then highlight the correct choice; tapping it advances.
Learning happens without punishment.

## Visual math (VisualMathScreen)

For addition/subtraction games: show concrete objects, animate the operation
(groups combine / objects fly away), then equation + exactly 3 large choices.
Distractors are plausible (±1, ±2), position randomized. Subtraction results
stay ≥ 1 (concrete counting).

## Question generation

Dynamic per difficulty config (`mathRange` etc.) — never hardcoded lists.
Adaptive engine nudges parameters ±2 tiers within the level from rolling
accuracy, streaks, mistakes, hint usage.
