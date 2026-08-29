# SKILL: UI Components (buttons, cards, panels, bars, bubbles)

## Purpose

Build any UI element with the one Bunnies visual language.

## Reusable components (`src/core/design/UISystem.js`)

| Factory | Use |
|---|---|
| `primaryButton` | Start / Continue / Play / Confirm / Next |
| `secondaryButton` | Back / Settings / optional actions |
| `iconButton` | sound / settings / close / home / pause / hint |
| `answerButton` | gameplay multiple-choice answers (big numbers) |
| `panel` | storybook cards/dialogs (cream, gold border, soft shadow) |
| `progressBar` | XP / world progress (animated fill) |
| `speechBubble` | all character speech (consistent tail + cream card) |
| `awardCard` | first-class Award collectible (`hero` / `support` / `album`) |
| `colorSwatch` | large color token (palette; circle hit + name ring) |
| `enableHit` | clickable = visual (rect / circle / ellipse; Phaser displayOrigin-aware) |

All use `DesignTokens` and `UISystem.bindTap`:
IDLE → PRESSED (immediate scale) → TRIGGERED → ACTION.
The bounce tween is async and never delays the callback. Hover must not
override a pressed button. Navigation duplicates are ignored by `NavSystem.begin`.

## Rules

- Never hand-draw a one-off button/card — extend UISystem.
- Hit areas: use `UISystem.enableHit` so the clickable box equals the drawing
  (Phaser adds `displayOrigin` before Contains — do not hand-place geometry).
  Never raw `setInteractive()` alone.
- Touch targets ≥ 46px (icon) / ≥ 96px (answers).
- Every tap: immediate press + `AudioEngine.emit('UITap')` (built into factories).
- Never debounce taps with `sleep` / `delayedCall`. Use action transactions.
- Disabled/locked states: gray + 🔒 + explain how to unlock.

## Anti-patterns

- `NewButton` / `GameButton` duplicates — forbidden.
- Local color/font/duration constants — use tokens.
- Buttons that don't respond visibly to taps.

## Validation

- [ ] Tokens only (no hardcoded colors/sizes)
- [ ] Press feedback on every tappable
- [ ] Works on phone-sized screens (safe spacing, no overlap)
