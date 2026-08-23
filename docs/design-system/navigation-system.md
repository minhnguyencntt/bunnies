# Navigation System

## Flow

```
World Map (MenuScreen)
   ↓ tap city (🔒 if world locked — tap explains how to unlock)
Level Select (LevelSelectScreen) — Màn 1/2/3 cards, stars, best score
   ↓
Gameplay (GameShell subclass) — intro is skippable ("Chơi ngay ▶")
   ↓ session complete
Result Screen (ResultScreen) — 🔄 Chơi lại · ▶ Màn tiếp · 🗺 Bản đồ
```

Side journeys: 🎟 Sticker Album, ⚙️ Audio Settings (overlay, non-blocking).

## Rules

- **Navigation is instant.** Never gated by speech, voice, music, or animation.
- Every screen has a visible exit (🏠 / 🗺 / back).
- Intros are always skippable; gameplay input works the moment the round shows.
- Scene transitions: stop sounds via engine helpers (`MusicEngine.stopTheme`,
  `AmbienceEngine.stop`, `VoiceEngine.stopCurrent`) — see `GameShell.shutdown`.
- Locked content explains how to unlock (never a dead end).
