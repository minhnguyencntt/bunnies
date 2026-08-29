# ADR-005: Navigation semantics & no-lock policy

## Status

Accepted (2026-08-23) · Amended (2026-08-29 — history stack)

## Context

A first pass swapped the HUD glyph to ◀ and removed locks, but navigation
was still broken for children:

- World-map hover fired speech + a full-screen dim before play (mobile first
  tap ≠ play).
- Marker hit-areas were offset to the bottom-right of the icon.
- Hopping bunnies stole taps from southern cities.
- Result / Pause “Bản đồ” skipped Level Select, so the child had to hunt the
  city again to pick the next level.
- Each screen invented its own Back/Home callbacks.

## Decision

1. **One `NavSystem`** owns leave/back/home. Leave is immediate (speech, music,
   and animation never gate a tap). `go` pushes a history entry; `back` pops
   it (browser-like). Home clears the stack. Result / settings overlays are
   not pushed — Result Back still lands on Level Select.
2. **Top-left = BACK** (vector chevron). Back is the previous screen on the
   stack: gameplay → Level Select → world map (or Map if the game was opened
   without Level Select).
3. **Home is explicit** (vector house). Home = `MenuScreen`. Shown when it
   differs from Back (gameplay pause, result chrome).
4. **World map: first tap plays.** No hover-speech, no dim overlay. City name
   and a “▶ Chơi” label are always visible. Hit-area is centered
   (`setCenteredInput`). Decorative bunnies are not interactive.
5. **No access locking** (unchanged): Discover → Tap → Play.
6. Icons for nav/HUD actions are **vector `IconSystem` drawings**, not mixed
   emoji.

## Consequences

- Predictable stack: a child can always go Back to the last meaningful screen
  or Home to the map.
- Map cities behave like Play buttons.
- Stars remain rewards, never gates.
