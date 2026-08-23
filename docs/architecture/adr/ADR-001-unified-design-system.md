# ADR-001: Unified Design System (tokens + component library)

## Status

Accepted (2026-08-23)

## Context

Screens were styled ad-hoc: duplicated button code, inconsistent colors,
container hit-area bugs, no shared motion language. The product targets a
"Modern 3D Storybook Adventure + Soft Toy World" identity across all worlds.

## Decision

One design system in code: `src/core/design/DesignTokens.js` (colors,
typography, spacing, radius, shadows, motion) + `src/core/design/UISystem.js`
(primary/secondary/icon/answer buttons, panels, progress bars, speech bubbles).
All screens use these; local one-off styling is forbidden.

## Consequences

- Consistent visuals/behavior everywhere; bugs fixed once (e.g. centered hit
  areas, press physics).
- New screens are faster to build; future worlds inherit the language.
- Changing the brand = editing tokens, not every screen.
