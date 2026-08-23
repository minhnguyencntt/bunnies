# Knowledge Changelog

Meaningful architectural/design decisions only — not trivial code changes.

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
