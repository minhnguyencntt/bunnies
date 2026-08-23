# SKILL: Visual Multiple-Choice Math Game

## Purpose

Create an addition/subtraction-style game where the child sees concrete objects,
watches the operation animate, then picks from exactly 3 large answers.

## When to use

Any visual math game (addition, subtraction, future multiplication/division).

## Reusable components

- `VisualMathScreen` (`src/core/game/VisualMathScreen.js`) — the whole flow:
  question generation, combine/removal animation, equation panel, 3 answer
  buttons, guided retry, bunny celebrations.
- Theme file (`puzzle.js`): `operation: 'add'|'subtract'`, `objectPool`,
  `palette`, `decor`, `particleColors`, `praise`.
- Reference: `screens/candy_garden/`, `screens/forest_adventure/`.

## Rules

- Exactly 3 choices; correct answer always included; distractors plausible
  (±1, ±2), never ridiculous (2 | 7 | 99); position randomized.
- Subtraction results ≥ 1 (concrete counting for young children).
- Numbers use `DesignTokens.typography.number` (extra large).
- Objects are the lesson: the child can solve before reading the equation.
- 2nd wrong answer → guided explanation (count aloud + highlight correct).

## New game in 3 steps

1. `puzzle.js` theme + 2. thin scene subclass (gameId, introText) +
3. GameConfig entry. Everything else is inherited.

## Validation

- [ ] 3 choices, randomized position, plausible distractors
- [ ] Operation animates visibly before the equation appears
- [ ] Guided retry works (2 wrong → count-aloud → highlight → advance)
- [ ] All 3 levels reach Result Screen with zero console errors
