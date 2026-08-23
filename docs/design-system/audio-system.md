# Audio System

Full reference: `docs/AUDIO_DESIGN.md`. Code: `src/core/audio/`.

## Layers & priority

Voice > critical feedback > reward > character > SFX > ambient > music.
Voice ducks music (−75%) and ambience (−60%) automatically.

## Rules

- Gameplay code emits semantic events only: `AudioEngine.emit('CorrectAnswer')`.
  Never call `scene.sound` / SFX / voice directly from gameplay.
- Audio is an enhancement layer — **never a gameplay dependency**. Handlers are
  crash-isolated; gameplay continues muted or unloaded.
- Anti-fatigue: per-category voice cooldowns, SFX pitch variations, no constant
  chatter. Character reactions ≥ 9s apart.
- Child-safe: no buzzers, no harsh error sounds; wrong answers get warm,
  gentle correction.
- Voice lines: add to `AudioConfig.VOICE_LIBRARY` (vi + en text), then
  `python3 scripts/generate_voice_library.py`. Never hardcode audio paths.
- Settings: master/music/sfx/voice/ambient sliders + toggles, persisted in profile.

## Per-world

Each world has its own theme (BGM file) + ambience profile (`forest` / `mystery`
/ `candy`) in `AudioConfig.GAME_AUDIO`. Global feedback sounds stay identical
across worlds (recognizable language).
