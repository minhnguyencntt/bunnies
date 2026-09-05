# docs/worlds/AGENTS.md

World rules. Each world = one folder in `src/screens/<world>/` + a GameConfig
entry + map city + audio profile.

## World checklist (new world)

- [ ] `GameConfig.js` entry: name, world region, educational goal, 3 levels,
      awards, stickers (6), hints per level
- [ ] `screens/<world>/puzzle.js` theme (palette, object pool, decor, particles)
- [ ] `screens/<world>/screen.js` scene class (extends GameShell/VisualMathScreen)
- [ ] Background art `assets/backgrounds/bg.png` (16:9 storybook style) + fallback
- [ ] BGM `assets/audio/bgm/bgm.mp3` (scripts/generate_audio.py bgm preset)
- [ ] Voice `assets/audio/voice/level_1..3.mp3` (add lines to VOICE_LIBRARY, run
      `scripts/generate_voice_library.py`)
- [ ] `AudioConfig.GAME_AUDIO` entry (theme + ambience profile)
- [ ] Map city in `world_map_data.js` (visible, screenKey)
- [ ] Register in `index.html`, `game.js`, `sw.js`
- [ ] E2E: all 3 levels complete to Result Screen, zero console errors

Existing worlds: see `candy-garden.md`, `magical-forest.md`, `color-magic.md`,
`bunny-maze.md`, `bunny-piano.md`
(newest reference implementations) and the four original games in `docs/GAME_REDESIGN.md`.
