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

All use `DesignTokens` and the global press physics (`1.0→0.94→1.03→1.0`).

## Rules

- Never hand-draw a one-off button/card — extend UISystem.
- Hit areas: containers need `setCenteredInput` (UISystem does it for you).
- Touch targets ≥ 46px (icon) / ≥ 96px (answers).
- Every tap: press animation + `AudioEngine.emit('UITap')` (built into factories).
- Disabled/locked states: gray + 🔒 + explain how to unlock.

## Anti-patterns

- `NewButton` / `GameButton` duplicates — forbidden.
- Local color/font/duration constants — use tokens.
- Buttons that don't respond visibly to taps.

## Validation

- [ ] Tokens only (no hardcoded colors/sizes)
- [ ] Press feedback on every tappable
- [ ] Works on phone-sized screens (safe spacing, no overlap)
