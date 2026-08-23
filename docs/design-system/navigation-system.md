# Navigation System

## Flow

```
World Map (MenuScreen)
   ↓ tap city
Level Select (LevelSelectScreen) — Màn 1/2/3 cards, stars, best score, tappable ▶ Chơi
   ↓
Gameplay (GameShell subclass) — intro is skippable ("Chơi ngay ▶")
   ↓ session complete
Result Screen (ResultScreen) — 🔄 Chơi lại · ▶ Màn tiếp · 🗺 Bản đồ
```

Side journeys: 🎟 Sticker Album, ⚙️ Audio Settings (overlay, non-blocking).

## Rules (ADR-005)

- **Top-left = ◀ BACK** to the previous screen (gameplay → level select → map).
  Home is explicit: 🗺 Bản đồ in pause menu / result screen.
- Nav controls: `UISystem.navButton` — 26px, elevated, high contrast.
- **Navigation is instant.** Never gated by speech, voice, music, or animation.
- Intros are always skippable; gameplay input works the moment the round shows.
- **No access locking** — every game/level is always playable.
- Scene transitions: stop sounds via engine helpers (`MusicEngine.stopTheme`,
  `AmbienceEngine.stop`, `VoiceEngine.stopCurrent`) — see `GameShell.shutdown`.
