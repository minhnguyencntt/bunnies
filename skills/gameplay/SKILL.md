# SKILL: Add a Game / Level

## Purpose

Add a new educational game (or level) to Knowledge World without rebuilding
infrastructure.

## When to use

Any new game world, new game, or new level inside an existing game.

## Inputs

- Educational goal (must be preserved/declared)
- World identity (palette, objects, music, ambience)
- 3-level difficulty intent

## Architecture

```
GameConfig.js entry (data-driven rules)
+ screens/<game>/puzzle.js (theme data)
+ screens/<game>/screen.js (scene class)
→ GameShell provides: HUD, timer, combo, hints, pause, Bunnine companion,
  intro+skip, scoring, stars, rewards, result screen, audio events
```

## Implementation pattern

1. `GameConfig.js`: add game def — `levels[1..3]` with difficulty/scoring/
   rewards/hints, 6 stickers, 3 awards (see existing games as templates).
2. Scene: `class MyGameScreen extends GameShell` implementing:
   - `onPreload()` → `this.preloadCommonAudio('<folder>')` + bg image
   - `buildWorld(w, h)` → themed world (living background)
   - `introText()` → per-level intro strings
   - `presentRound(index, diff)` → build round; call `this.answerCorrect(x,y)` /
     `this.answerWrong(x,y)` / `this.recordFumble()`
   - optional: `showHintVisual(hint)`, `handleTimeout()`
3. Register: `index.html` (puzzle.js then screen.js), `game.js` scene list,
   `sw.js` precache, map city in `world_map_data.js`.
4. Audio: `AudioConfig.GAME_AUDIO` entry; instruction lines in `VOICE_LIBRARY`
   → run `python3 scripts/generate_voice_library.py`; BGM preset →
   `python3 scripts/generate_audio.py bgm <preset>`.

## UX / animation / audio rules

- Exactly follow `docs/gameplay/*` and `docs/design-system/*`.
- 3 levels with meaningfully different difficulty dimensions.
- Never block on speech; intro always skippable; visible exit.
- Emit `AudioEngine` events at every key moment.

## Error handling & performance

- All assets need procedural fallbacks (`textures.exists` checks).
- Lazy-load audio; cap particles; 60 FPS on mid-range mobile.

## Validation checklist

- [ ] 3 levels playable end-to-end to the Result Screen (E2E, zero errors)
- [ ] Rewards granted (stars/XP/stickers/awards) and persisted
- [ ] No access locking (ADR-005); progression shown as rewards/guidance
- [ ] Hints work per level style; wrong answers are gentle
- [ ] `node --check` clean; engine Node tests pass
- [ ] Knowledge updated (world doc, CHANGELOG)
