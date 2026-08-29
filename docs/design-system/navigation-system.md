# Navigation System

## Flow

```
World Map (MenuScreen)  ← Home
   ↓ tap city (name + ▶ Chơi always visible)
Level Select            ← Back
   ↓ tap Chơi
Gameplay                ← Back
   ↓ session complete
Result
   Back → Level Select
   Home → World Map
   Chơi lại / Màn tiếp / Chọn màn
```

Side journeys: Album (Back → Map) · Settings overlay (Close).

## Rules (ADR-005)

- Use `NavSystem.go / back / home / mount`. Do not `scene.start` by hand.
- `go` pushes the current screen; **Back** pops (browser-like). Home clears the stack.
- Top-left is always the vector **Back** control.
- Home is an explicit vector house when it is not the same as Back.
- Navigation is instant. Never gated by speech, voice, music, or animation.
- World-map first tap starts Level Select. No hover-to-activate.
- Play buttons (level cards and city “▶ Chơi”) receive the tap themselves.
- No access locking.

## Implementation

- `src/core/design/NavSystem.js`
- Chrome: `NavSystem.mount(scene, { onBack, onHome })` — `onBack` defaults to `NavSystem.back`
- Icons: `IconSystem` via `UISystem.navButton` / `iconButton`
