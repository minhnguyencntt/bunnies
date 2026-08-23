# SKILL: Audio (music, SFX, voice, ambience)

## Purpose

Add or change any sound in Bunnies.

## Architecture

Gameplay emits semantic events (`AudioEngine.emit('CorrectAnswer')`) →
`AudioEvents.js` maps to SFX/Voice/Music reactions → channels with priority +
ducking (`AudioEngine`). Never call sound APIs directly from gameplay.

## Common tasks

### New voice line

1. Add to `AudioConfig.VOICE_LIBRARY` (`vi` + `en` text; `voice: narrator|bunnine`;
   `game`+`level` for instructions).
2. Run `python3 scripts/generate_voice_library.py` (regenerates manifest + mp3s).
3. Reference by line id or category — never by file path.

### New SFX

Add a synthesized function to `SFXEngine` (Web Audio, soft attack, warm timbre,
pitch jitter for variation) and wire it in `AudioEvents.js`. No asset files needed.

### New world music

Add a preset to a `scripts/bgm/*.json` (chords + melody patterns) →
`python3 scripts/generate_audio.py bgm <preset>` → convert wav→mp3 (ffmpeg) →
register in `AudioConfig.GAME_AUDIO`.

### Ambience

`AmbienceEngine` profiles: `forest` / `mystery` / `candy`. Add a profile with
subtle random events (keep gain ≤ 0.05).

## Rules

- Audio never blocks gameplay; handlers crash-isolated; works muted.
- Voice cooldowns per category; character chatter ≥ 9s apart.
- Wrong answers: warm gentle tones — never buzzers.
- Volumes via settings channels (master/music/sfx/voice/ambient).

## Validation

- [ ] Events used (no direct sound calls in gameplay)
- [ ] Voice line has vi+en text and a generated file
- [ ] No console errors with audio on/off; game playable muted
