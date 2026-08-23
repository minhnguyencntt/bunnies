# Master Audit & Gap Analysis (2026-08-23)

Audit of the running game (code + headless-browser inspection as source of truth).

| Requirement | Status | Evidence | Action |
|---|---|---|---|
| 3D storybook visual system | PARTIAL | DesignTokens+UISystem exist; new worlds have painted backgrounds; 4 original games use older art | Keep art; unify UI everywhere (done via UISystem) |
| Global button system | PARTIAL | UISystem exists; level-card "▶ Chơi" was display-only | Play button now directly tappable |
| Global icon system | PARTIAL | Emoji icons everywhere but no semantic map | `DesignTokens.icons` semantic icon map |
| Navigation system | PARTIAL | Top-left was 🏠 Home in gameplay, 🗺 elsewhere | Standardized: top-left = ◀ Back; Home explicit in pause |
| Back behavior | MISSING | No Back semantic (went straight to menu) | Back = previous screen (game→level select→map) |
| Home behavior | PARTIAL | Home only in game HUD | Home lives in pause menu + result screen (🗺 Bản đồ) |
| Top-left nav visibility | PARTIAL | 21px radius, low contrast | 26px elevated high-contrast nav button |
| Non-blocking speech | DONE | ADR-002; skippable intro; crash-isolated audio | — |
| Modern background music | PARTIAL | Layered engine used pure sines → MIDI-ish | Engine upgraded (warmth: detune, harmonics, lowpass); all themes regenerated |
| Multi-layer audio | DONE | Music+ambience+SFX+voice+reward layers | — |
| Character system | DONE | Emotion map in GameShell; big bunny in math games | — |
| Motion system | DONE | DesignTokens.motion + press physics | — |
| Reward system | DONE | Full pipeline + result screen | — |
| Addition game | DONE | 2 games (Counting Forest + Candy Garden), visual | — |
| Subtraction game | DONE | 2 games (Subtraction Hill + Forest Adventure), visual | — |
| 3-answer system | DONE | VisualMathScreen: exactly 3, plausible distractors | — |
| Level locking removal | BROKEN | Sequential level locks + world lock existed | Removed: Discover→Tap→Play; stars remain as rewards |
| AGENTS.md / SKILL.md | DONE | Root + src + docs + skills tree | Updated for nav/icons/locks |
| Full-game migration | PARTIAL | Shared screens on UISystem; game scenes use shell | Verified via E2E |
| QA/regression | DONE | 18-session E2E harness | Re-run after refactor |
