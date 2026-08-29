# Knowledge Changelog

Meaningful architectural/design decisions only — not trivial code changes.

## 2026-08-29 (clickable = visual + history Back)

### Changed
- `UISystem.enableHit` offsets hit geometry by Phaser `displayOrigin` so the
  clickable box equals the drawing (Container origin is width/2 after setSize)
- Tappable controls appear at full size (no scale-0 intro that shrinks the hit)
- `NavSystem` keeps a history stack: `go` pushes, `back` pops, `home` clears.
  Overlays (Result, settings) are not pushed

### Reason
Hit tests used a box at (-w/2,-h/2). Phaser then adds displayOrigin, so only
the top-left of buttons / back / city markers / color regions received taps.
Back was hardcoded per screen and skipped the real previous screen.

## 2026-08-24 (centered hit areas for all controls)

### Changed
- `UISystem.enableHit` is the one hit-area API: positional `setInteractive` +
  `customHitArea` so Container clicks match the drawing (not bottom-right)
- Factories use visual-sized hits (circle for icons/swatches; no size+8 on
  answer buttons); GameShell/Menu/LevelSelect/AudioSettings/gameplay zones
  all route through it; `input.setTopOnly(true)` on main scenes

### Reason
Neighbor buttons (e.g. answer "4" next to "5") stole hover/tap at the visual
center because Phaser default container hits sit bottom-right of the art.

## 2026-08-24 (Color Magic — color by pattern)

### Changed
- New native game `color_magic` / `ColorMagicScreen` on GameShell
- Challenges come from artwork templates + valid color patterns in
  `screens/color_magic/puzzle.js` (new art does not touch gameplay)
- Difficulty uses existing dimensions: `objectCount` (regions), `paletteSize`
  (colors), `memoryLoad` (full / compact / peek reference), timer, hints
- Completion still goes through CompletionEngine → AwardGenerator → ResultScreen

### Reason
Color matching is a core early-learning loop (observe → remember → match) and
must live in the same engine as the other Knowledge World games, not as a
separate coloring toy.

## 2026-08-24 (opt-in reload for a new game version)

### Changed
- Shell version lives in `index.html` + `version.json` + `sw.js` `CACHE_VERSION`
- HTML banner **Có phiên bản mới!** / **Tải lại** / **Để sau** when JS, JSON,
  or a waiting service worker is ahead of the running shell
- **Tải lại** unregisters the SW, deletes Cache Storage, then reloads
- `version.json` is network-only so stale cache cannot hide a new build

### Reason
PWA cache-first left children on old JS after a deploy (orange award screen).
Reload is a child tap, never an automatic refresh mid-play.

## 2026-08-24 (award screen not covered by last-answer flash)

### Changed
- Last correct answer skips `Camera.flash`; CompletionEngine resets FX, hides the
  paused game scene, and `bringToTop('ResultScreen')`

### Reason
`RewardFX.correctAnswer` flashed (255, 235, 170) then `scene.pause()` froze that
overlay. Game scenes render after ResultScreen, so the child saw a solid orange
canvas instead of the award UI.

## 2026-08-24 (world map visible after boot)

### Changed
- MenuScreen reuses `boot_bg` instead of uploading the same world-map JPEG again
- Ambient creature sheets are generated once (`make.graphics({ add: false })`)
- HTML `#loading` overlay hides when Boot/Menu actually create, not only on a timer
- Phaser Scale.FIT owns canvas size (no CSS `width/height: 100%` fight)

### Reason
MenuScreen finished creating markers with no JS error, but the canvas showed a
flat peach sky (the map JPEG / loading overlay). Duplicate GPU texture work
plus the HTML overlay covering Scale.FIT letterboxing hid the world map.

## 2026-08-23 (unified Award Engine)

### Changed
- Completion is one pipeline for every game: `AwardGenerator` → `AwardResult`
  → `NextActionResolver` → shared ResultScreen
- `AwardResult` is the structured award (id, type, title, artwork, XP, stars,
  coins, isNew) that persist and display share
- `NextActionResolver` owns Continue / Play again / Choose game / Home.
  Continue exists only when `GameConfig.nextLevel` returns a level
- ResultScreen is award-first: artwork → title → values → next actions.
  Celebration never gates the primary button

### Reason
Reward and next-step logic lived across engines with a hardcoded `level < 3`
continue check. New games must inherit the same award + next-action contract
without a per-game result screen.

## 2026-08-23 (award as first-class object)

### Changed
- `Award` is the collectible domain object (sticker + badge): identity,
  metadata, artwork, presentation state, persistence
- `RewardPresentationEngine` hydrates Awards; `Award.pickHero` chooses the
  completion-screen hero
- `UISystem.awardCard` is the only collectible renderer (`hero` / `support` /
  `album`)
- ResultScreen is an award-hero screen, not a generic celebration dump
- Album reads the same Award objects from SaveEngine
- Origin-centered hit areas (`UISystem.setOriginCenteredInput`) so Text/Image
  tap targets match the visible glyph

### Reason
The award screen was orange headline + text. The child must see the thing they
earned, and that same object must live in the album.

## 2026-08-23 (completion engine & instant interaction)

### Changed
- `CompletionEngine` owns the session-end state machine for every game
- `RewardPresentationEngine` persists first, then presents real reward art
- Shared `ResultScreen` always shows achievement, result, reward, one primary next action
- Last correct answer opens completion immediately (removed 1600ms + 450ms waits)
- `UISystem.bindTap` press state is immediate; hover no longer fights the press tween
- `NavSystem` uses an action transaction instead of debounce sleep

### Reason
Completion felt cut off (last question → bunny hop, no reward, no next step).
Buttons sometimes missed or delayed because press tweens and hover scaled the
same object. These are engine problems, not per-screen bugs.

## 2026-08-23 (unified navigation & calm HUD)

### Changed
- `NavSystem` is the only way to leave a screen (Back ≠ Home)
- Result / Pause Back returns to Level Select (no more dump-on-map)
- World map: first tap plays; hover speech + dim overlay removed
- Marker hit-areas centered; decorative bunnies no longer steal taps
- Vector `IconSystem` for nav/HUD actions
- Game HUD is floating storybook chips (no dark full-width bar)
- Shared `DesignTokens.layout` so equation / HUD / answers do not collide

### Reason
Second full audit: previous “◀ Back” pass did not fix mobile tap-to-play,
hit-areas, or the Result→Map skip. Screens felt chaotic.

## 2026-08-23 (master refactor)

### Changed
- Navigation standardized: top-left = ◀ Back everywhere; Home explicit (ADR-005)
- All game/level access locks removed — Discover → Tap → Play (ADR-005)
- Level-card Play button is directly tappable
- BGM engine upgraded (detuned chorus, harmonics, soft lowpass, gentler
  attacks) — MIDI-like pure sines removed; all 10 themes regenerated
- Semantic icon map (`DesignTokens.icons`)

### Reason
Master-spec compliance: full-game consistency, zero access friction, modern
warm audio.

## 2026-08-23

### Added
- Global design system: `DesignTokens` + `UISystem` (ADR-001)
- Knowledge system: AGENTS.md hierarchy + skills tree + ADRs
- Two worlds: Vườn Kẹo Ngọt (addition), Rừng Diệu Kỳ (subtraction) with
  cross-world unlocks; `VisualMathScreen` reusable pattern + guided retry
- Generated storybook backgrounds for the new worlds

### Changed
- Speech/audio is fully non-blocking (ADR-002); audio handlers crash-isolated
- Motion unified under tokens (ADR-003)
- Intro: 4.5s max + prominent "Chơi ngay ▶" skip

### Reason
Premium consistent UX, zero gameplay blockers, faster future world development.

## 2026-08-22

### Added
- Knowledge World Game Engine (13 engines, data-driven) — ADR-004
- 3-level system for all games; Score→Stars→Awards→Stickers→XP→Gems→World
- Complete audio system: events, ducking, cooldowns, voice library (edge-tts),
  synthesized SFX, dynamic music intensity, procedural ambience

### Changed
- All 4 original games redesigned from quizzes into gameplay-driven adventures

### Reason
Make learning feel like play; one reusable architecture for all future games.
