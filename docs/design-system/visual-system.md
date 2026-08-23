# Visual System — Modern 3D Storybook Adventure + Soft Toy World

## Color

Tokens in `DesignTokens.colors` (+ `.css` hex strings for text):

- Brand: primary purple `#7C5CBF`, secondary sky blue, accent warm gold.
- Semantic: success green, warning amber, error = **soft coral** (never harsh red),
  reward/star gold, XP green, gems cyan.
- Surfaces: warm cream cards, night-purple overlays, warm-brown ink text.
- World accents (`colors.worlds`): math forest green, mystery village purple,
  candy garden pink, forest adventure green-gold. Worlds may accent differently
  but share the global surfaces/semantics.

Hierarchy: one dominant world accent per screen + neutral cream surfaces +
gold reserved for rewards/stars. Avoid excessive rainbow coloring.

## Typography

`DesignTokens.typography`: display 36 · question 34 · **number 40** (educational
numbers are extra large) · button 20 · body 17 · caption 14 · reward 30 · speech 18.
Font stack: Comic Sans MS / Arial Rounded MT Bold. No decorative fonts that hurt
readability.

## Geometry & depth

- Radius: sm 10 / md 16 / lg 24 / pill. Everything rounded — soft-toy feel.
- Depth = soft drop shadow (offsetY 4, alpha 0.22) + subtle vertical gradient +
  top gloss highlight (see `UISystem._btnBase`).
- Layering: background 0 · decor 5-10 · gameplay 40-150 · HUD 400 · bubbles 700 ·
  overlays 800 · skip/close 900.

## Backgrounds

Living, never static: painted storybook art (generated, 16:9) with procedural
fallback + ambient life (swaying decor, floating particles, fireflies).
Keep ambient motion subtle — it must not distract from the learning task.

## Accessibility

- Contrast: white text on colored buttons always has a dark stroke.
- Every audio cue has a visual equivalent; fully playable muted.
- Large targets; no overlapping controls; safe spacing between answer buttons.
