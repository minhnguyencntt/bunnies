# SKILL: Navigation

## Purpose

Add/change navigation without surprising the player.

## Rules (ADR-005)

- Use `NavSystem` — never `scene.start` / `scene.stop` for screen changes.
- **Top-left = Back** (vector chevron) → previous screen.
  gameplay → Level Select → Map. Result Back = Level Select.
- **Home** is explicit (vector house) when it differs from Back.
- Instant. Never wait for speech, audio, or animation.
- World map: first tap plays. Always-visible name + “▶ Chơi”. Centered hit-area.
- Every screen has a visible exit.

## Flow

```
MenuScreen (Home)
  ← Back — LevelSelectScreen
        ← Back — Gameplay (pause: Chọn màn = Back, Về nhà = Home)
              → ResultScreen (Back = Level Select, Home = Map)
MenuScreen → Album (Back) · Settings (Close)
```

## Validation

- [ ] Top-left Back returns to the previous screen (never starts a game)
- [ ] Home returns to the world map
- [ ] Result Back lands on Level Select, not the map
- [ ] Map city first tap opens Level Select
- [ ] Play / Chơi is the actual tappable control
- [ ] Navigation does not wait for speech
