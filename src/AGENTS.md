# src/AGENTS.md

Applies to all game source code.

## Load order (index.html is the manifest)

`lib/phaser.min.js` → characters → `core/ui` + `core/effects` → `core/design`
→ `core/audio` → `core/engine` → `core/game` → `screens/*` (puzzle.js before
screen.js) → `GameFlowConfig.js` → `game.js`. New files must be added to
`index.html` AND `sw.js` (precache) — bump `CACHE_VERSION` in `sw.js`,
`window.BUNNIES_VERSION` in `index.html`, and `version.json` together.
A HTML banner offers **Tải lại** when the shell/JS/SW versions diverge
(stale PWA cache). Do not auto-reload — the child taps the button.

## Conventions

- Plain JS classes/globals (no modules, no build step). Export via
  `if (typeof module !== 'undefined') module.exports = …` for Node tests.
- Scene classes extend `GameShell` (or `VisualMathScreen`); register in
  `game.js` scene list.
- Game data lives in `puzzle.js` (theme) and `GameConfig.js` (rules) —
  never hardcode in the scene.
- All UI via `UISystem` + `DesignTokens` + `IconSystem`; all navigation via
  `NavSystem`; all sound via `AudioEngine.emit`; all rewards via AwardGenerator
  / RewardEngine.
- Vietnamese UI text; keep strings short and child-friendly.
- Always use `UISystem.enableHit` for hit areas (Phaser adds displayOrigin).
- Kill idle tweens on `dragstart` (idle motion must never fight drags).
