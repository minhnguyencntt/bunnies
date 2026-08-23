# Unified Navigation & Calm Screens — Report (2026-08-23)

## A. Previous Work Status

```text
DONE (verified, still true):
- Game Engine (13 engines), 3-level system, reward pipeline
- Multi-layer audio, warm BGM, non-blocking VoiceEngine
- Addition / subtraction visual math + 3-answer system
- No access locking (Discover → Tap → Play)
- Knowledge tree (AGENTS / skills / ADRs)

BROKEN (previous report marked DONE — second audit found otherwise):
- Navigation: hover-first map (first tap ≠ play on touch)
- Marker hit-areas offset to the bottom-right of the icon
- Hopping bunnies stole taps from southern cities
- Result / Pause “Bản đồ” skipped Level Select
- MenuScreen reused stale cityMarkers after Back (dead taps)
- Game HUD: dark full-width bar + 50-char title overlapping equations

FIXED this pass:
- All of the above
```

## B. Global Systems

- `NavSystem` — only leave/back/home path
- `IconSystem` — vector Back / Home / Pause / Hint / Settings / Close / Play
- `UISystem.chip` + `playButton` — storybook chrome
- `DesignTokens.layout` — HUD / equation / answer safe zones

## C. Screens Migrated

Menu (world map) · LevelSelect · GameShell HUD + pause (all 6 games) ·
Result · Album · Settings · VisualMath + Counting Forest / Subtraction Hill /
Mirror City equation Y.

## D. Legacy Removed

- Hover dim overlay + hover speech on the map
- Offset marker hit-areas
- Interactive hopping bunnies
- Dark full-width game HUD
- Result/Pause dump-to-map
- Mixed emoji nav glyphs for Back/Home/Pause/Hint/Settings

## E. Navigation

```
Map  --tap city / ▶ Chơi-->  Level Select  --Chơi-->  Game  -->  Result
 ↑ Back                         ↑ Back                  ↑ Back = Level Select
 Home = Map                     Home (pause/result) = Map
```

Top-left is always Back. Home is an explicit house when it is not the same
as Back. Leave never waits for speech, music, or animation.

## F. Audio

Unchanged layered system. Map hover speech removed so speech cannot gate
the first tap.

## G. Gameplay

Unchanged visual addition/subtraction. Layout Y uses `DesignTokens.layout`
so the equation no longer sits under the HUD.

## H. Testing

```text
Total screens audited: menu, 6× level select, 6× gameplay, result, album, settings
Total games: 6   Total worlds: 6
Navigation flows: city first-tap, Back×2, Home from game, Result → Level Select
Playable cities start + Back: 6/6
Candy Garden L1 played to Result, Back → Level Select
Page errors: 0
Defects found this pass: 7   Defects fixed: 7
Remaining: world-map cities still sit on a busy painted map (art, not UI)
```

## I. Knowledge System

```text
AGENTS.md: root + src + design-system (NavSystem / IconSystem)
SKILL.md: skills/ui/navigation.md, skills/ui/icon-system.md
ADR-005: amended (hover-gate, hit-areas, Result stack)
CHANGELOG: 2026-08-23 unified navigation entry
Audit: docs/knowledge/MASTER_AUDIT.md
```
