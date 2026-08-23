# docs/design-system/AGENTS.md

The Bunnies design system is code, not just docs:
`DesignTokens.js` + `IconSystem.js` + `UISystem.js` + `NavSystem.js`.

## MUST

- Use `DesignTokens` for every color/spacing/radius/font/duration.
- Use `UISystem` factories for buttons, cards, panels, bars, bubbles, chips.
- Use `NavSystem` for every screen change. Use `IconSystem` for nav/HUD icons.
- Press physics on every tappable: `1.0 → 0.94 → 1.03 → 1.0` (~210ms total).
- Touch targets ≥ 46px; answer buttons ≥ 96px; numbers use `typography.number`.
- Soft shadows + top gloss on buttons/cards (soft-toy depth).
- Text color is warm ink `#4A3728` on cream `#FFF8E7`; never pure black on white.

## MUST NOT

- No pixel art, no retro/8-bit UI, no harsh red error states (use soft coral).
- No per-screen one-off styles. Extend the system instead.
- No rainbow chaos: world accents differ, global language stays constant.

See: `visual-system.md`, `motion-system.md`, `audio-system.md`,
`character-system.md`, `navigation-system.md`.
