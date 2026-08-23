# SKILL: Navigation

## Purpose

Add/change navigation without surprising the player.

## Rules (ADR-005)

- **Top-left = BACK (◀)** — returns to the previous screen in the flow:
  gameplay → level select → world map. Never starts another game/world.
- **Home** is explicit: 🗺 Bản đồ in the pause menu and result screen.
- Use `UISystem.navButton` (26px, elevated, high contrast) for nav controls.
- Navigation is instant — never waits for speech, audio, or animation.
- Every screen has a visible exit.

## Flow reference

```
MenuScreen (world map)
  ←◀— LevelSelectScreen
        ←◀— GameShell gameplay (⏸ pause → 🗺 Bản đồ = Home)
              → ResultScreen (🔄 Chơi lại · ▶ Màn tiếp · 🗺 Bản đồ)
MenuScreen → StickerAlbumScreen (◀ back) · AudioSettingsScreen (overlay ✔)
```

## Validation

- [ ] Top-left control is ◀ and goes to the previous screen
- [ ] Visible over the world background (contrast check)
- [ ] Tap → immediate transition (no speech/audio/animation gate)
- [ ] Play buttons are directly tappable (never title-only interaction)
