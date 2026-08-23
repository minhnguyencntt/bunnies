# Bunnies — AGENTS.md (root)

> **Before modifying this codebase: discover and read the applicable `AGENTS.md`
> and relevant `skills/**/SKILL.md` files. Search for existing implementations
> before creating components, services, utilities, animations, audio handlers,
> or gameplay systems. Reuse existing patterns. After implementing, update the
> knowledge system when you introduced a reusable pattern, architectural
> decision, or important convention.**

## What is Bunnies?

"Bunnies và thế giới tri thức" (Bunnine & Knowledge World) — a premium offline
HTML5 educational adventure game for children 3–15, built with Phaser 3.
Vietnamese UI/voice. Children learn math, observation and spatial reasoning
through gameplay — never quizzes. PWA, no backend, progress in localStorage.

## Product vision & design philosophy

- **"I'm playing with Bunnies"**, never "I'm doing a math test".
- Learning through play: Explore → Interact → Solve → Feedback → Reward → Progress.
- Child-safe: no harsh failure, no punishment audio/visuals, no gambling mechanics.
- One universe: one design language, one motion language, one character language,
  one audio language — across all current and future worlds.
- Visual direction: **Modern 3D Storybook Adventure + Soft Toy World** — warm,
  soft, rounded, gently lit. No pixel art, no retro/8-bit UI, no flat generic buttons.

## Technology stack

Phaser 3.70 (local `src/lib/phaser.min.js`), plain ES2020 JS (no build step),
global script tags (load order matters — see `src/index.html`), localStorage
persistence, Web Audio API (synthesized SFX/ambience/music layers), edge-tts
for generated vi-VN voice (`scripts/generate_voice_library.py`).

## Repository map

```
src/
├── core/
│   ├── design/    DesignTokens · IconSystem · UISystem · NavSystem
│   ├── engine/    GameConfig.js + 12 engines         ← data-driven game rules
│   ├── game/      GameShell · VisualMathScreen · shared screens
│   ├── audio/     AudioEngine · SFX · Music · Voice · Ambience · Events
│   ├── characters/ Bunny/Owl/Fox/Squirrel sprites + behaviors
│   ├── ui/        IntroHelper (intro + skip)
│   └── effects/   RewardFX (celebrations)
├── screens/       menu (world map) + one folder per game world
└── sw.js          PWA offline cache (bump CACHE_VERSION when assets change)
docs/              design-system · gameplay · worlds · architecture/adr · knowledge
skills/            reusable implementation skills (see skills/README.md)
```

## The pipelines (reuse, never rebuild)

- **New game** = entry in `core/engine/GameConfig.js` + one scene class extending
  `GameShell` (or `VisualMathScreen` for visual 3-choice math). See
  `skills/gameplay/SKILL.md`.
- **UI** = `UISystem` components + `DesignTokens`. Never hand-style buttons/cards.
- **Audio** = `AudioEngine.emit('<Event>')` — never call sound directly.
  See `skills/audio/SKILL.md`.
- **Rewards** = RewardEngine pipeline (Score→Stars→XP→Awards→Stickers→Gems→World).
  Collectibles are `Award` objects. UI uses `UISystem.awardCard` only.
- **Completion** = `CompletionEngine.completeGame()` + `RewardPresentationEngine`
  + shared `ResultScreen` (hero Award + next actions). Never invent per-game
  result/reward UI.
- **Buttons** = `UISystem.bindTap` (IDLE→PRESSED→ACTION). Pressed scale is
  immediate. Navigation uses `NavSystem` action transaction — no debounce sleep.
- **Voice lines** = add to `AudioConfig.VOICE_LIBRARY` → run the generator.

## Hard rules (MUST NOT)

1. Never block gameplay/navigation on speech, audio, or animation.
   Priority: **interaction > gameplay > navigation > animation > speech**.
   Last-answer → completion UI immediately. Next actions are never gated.
2. Never punish the child: no red flashes, buzzers, shame text, or fail screens.
3. Never create duplicate concepts (new button/audio/reward systems).
4. Never hardcode questions, voice text, or audio paths in gameplay logic —
   use GameConfig / AudioConfig.
5. Never add random paid/loot-box mechanics; unlocks are deterministic.
6. **Never lock games/levels behind progression** — Discover → Tap → Play.
   Progression = rewards/recommendations/celebration only (ADR-005).
7. Navigation: use `NavSystem`. Top-left is always Back (previous screen);
   Home is an explicit house when it differs from Back. World-map first tap
   plays — no hover gate. Use `UISystem.navButton` + `IconSystem`.
8. Keep touch targets ≥ 46px; numbers in math gameplay extra large.
9. Keep it offline-capable: register new files in `index.html` and `sw.js`.

## Testing conventions

- `node --check` every changed JS file.
- Engine logic is Node-testable (engines export via `module.exports`); stub
  `Phaser`/`localStorage` as in the repo's test approach.
- Browser E2E with headless Chrome + puppeteer(-core): play real sessions to
  the Result Screen; zero page errors required.

## Performance & accessibility

- 60 FPS on mid-range mobile; lazy-load audio; synthesized SFX over files.
- Every voice instruction needs a visual equivalent (bubble/highlight).
- Works muted. Works on phones/tablets, portrait & landscape (Scale.FIT 1280×720).

## Deeper knowledge

- Design system: `docs/design-system/AGENTS.md`
- Gameplay rules: `docs/gameplay/AGENTS.md`
- Worlds: `docs/worlds/AGENTS.md`
- Skills index: `skills/README.md`
- Decisions: `docs/architecture/adr/` · History: `docs/knowledge/CHANGELOG.md`
