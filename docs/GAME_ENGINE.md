# Phase 3 — Game Engine Architecture

A reusable, **data-driven** engine in `src/core/engine/` + `src/core/game/`.
New educational games are added primarily through **configuration**
(`GameConfig.js`) plus one scene class extending `GameShell`.

```
Game Definition (GameConfig.js)
 ├── GameId / GameName / SceneKey / Icon / Color
 ├── World (Knowledge World region)
 ├── EducationalGoal
 ├── Mechanics[]
 ├── Levels { 1, 2, 3 }
 │    ├── Label (rank, not age)        ← Level Engine
 │    ├── DifficultyConfig             ← Difficulty Engine
 │    ├── ScoringConfig                ← Scoring + Star Engines
 │    ├── RewardConfig (XP/gems)       ← XP + Reward Engines
 │    └── HintConfig                   ← Hint Engine
 ├── AwardConfig[]                     ← Award Engine
 └── StickerConfig[]                   ← Sticker Engine
```

## Engine map

| Engine | File | Responsibility |
|---|---|---|
| Level Engine | `GameConfig.js` (`levels[1..3]`) | 3 levels per game; rank labels (Explorer/Adventurer/Master); sequential unlock rules |
| Difficulty Engine | `GameConfig.js` (`difficulty`) | 15 difficulty dimensions per level (below) |
| Adaptive Difficulty Engine | `AdaptiveDifficultyEngine.js` | Adjusts parameters ±2 tiers *within* the level from live performance |
| Analytics Engine | `AnalyticsEngine.js` | Session metrics: accuracy, time, mistakes, hints, retries, streaks, exploration |
| Scoring Engine | `ScoringEngine.js` | Unified 0–100 score with 7 components |
| Star Engine | `StarEngine.js` | Score → ⭐/⭐⭐/⭐⭐⭐ via per-level thresholds |
| XP Engine | `XPEngine.js` | Difficulty-aware XP + Knowledge Level curve |
| Award Engine | `AwardEngine.js` | Deterministic award evaluation & granting |
| Sticker Engine | `StickerEngine.js` | Sticker collections, unlock rules, album view model |
| Reward Engine | `RewardEngine.js` | The pipeline: Score → Stars → XP → Awards → Stickers → Gems → World Progression |
| Progression Engine | `ProgressionEngine.js` | World-map state: city stars/tiers, level locks, next goal |
| Hint Engine | `HintEngine.js` | Direct (L1) / partial (L2) / conceptual (L3) hints |
| Save/Progress Engine | `SaveEngine.js` | localStorage profile, offline-safe |

## Difficulty configuration (per level)

```js
difficulty: {
    complexity: 1..3,        // overall reasoning complexity
    objectCount: n,          // objects on screen
    choiceCount: n,          // answer choices (0 = interaction-only)
    timeLimit: seconds,      // 0 = no time pressure
    memoryLoad: 1..4,        // items to hold in mind
    distractionLevel: 0..3,  // visual noise
    hintLevel: 1..3,         // 3 = direct … 1 = conceptual
    interactionSteps: 1..4,  // steps per round
    questionComplexity: 1..3,
    visualComplexity: 1..3,
    sequenceLength: n,       // for sequence mechanics
    mathRange: n,            // number ceiling
    errorTolerance: 1..3,
    // game-specific extras, e.g. differencesPerRound, subtlety
}
```

## Scoring configuration (per level)

```js
scoring: {
    accuracyWeight: 55,      // % of score from correct-vs-attempts
    speedWeight: 10..15,     // vs par time
    comboWeight: 0..10,      // best streak / rounds
    explorationWeight: 5..15,// objects found/collected
    perfectBonus: 10,        // zero mistakes
    difficultyBonus: 0/5/10, // higher levels score higher
    hintPenalty: 2..4,       // per hint, capped at 15 — never removes rewards
    starThresholds: [40, 75] // ⭐ completion · ⭐⭐ ≥ t0 · ⭐⭐⭐ ≥ t1
}
```

## Reward configuration (per level)

```js
rewards: {
    baseXP: 50 | 100 | 200,  // difficulty-aware base
    gems: 5 | 8 | 12,        // + 2/star + 5 perfect
    threeStarXP, perfectXP, noHintXP
}
```

## Award definition

```js
{ id, name, icon, rarity: common|rare|epic|legendary, description,
  reward: { xp, gems },
  condition: { type: complete_any_level | streak | perfect_round |
               perfect_session | three_stars | no_hint | fast_finish |
               total_plays | total_stars | all_games | all_masters, ... } }
```

## Sticker definition

```js
{ id, name, icon, rarity, hint /* shown on locked stickers — always knowable */,
  condition: { type: complete_level | three_stars | three_stars_any |
               plays | high_score | no_hint | perfect_round | all_levels, ... } }
```

## Adaptive difficulty (within the current level)

After every answer the engine watches rolling accuracy (last 3), consecutive
mistakes and hint usage:

- 3 consecutive correct + no hints → **tier +1** (max +2): mathRange +2,
  choiceCount +1, timeLimit −12%, sequenceLength +1, objectCount +1.
- 2 consecutive mistakes or accuracy ≤ 1/3 → **tier −1** (min −2): the reverse,
  plus richer hints.

Changes are gradual — one tier at a time — so the game never suddenly turns
frustrating.

## Session & reward pipeline

```
GameShell.startRound(i)
   → presentRound(i, adaptiveDifficulty.current())
   → child plays; AnalyticsEngine records everything
   → answerCorrect()/answerWrong()/recordFumble()
   → live score + star meter update on the HUD
GameShell.finishSession()
   → RewardEngine.finishSession(gameId, level, analytics, parTime)
        score  = ScoringEngine (0–100)
        stars  = StarEngine (thresholds)
        profile update (plays, best score, max stars)
        xp     = XPEngine (base + bonuses)
        awards = AwardEngine (deterministic conditions)
        stickers = StickerEngine (deterministic conditions)
        gems   = base + 2/star + perfect bonus
        Knowledge Level + world progress recomputed
   → SaveEngine.save(profile)
   → ResultScreen (celebration → score → stars → XP → awards → stickers → progress)
```

## Adding a new game (configuration-first)

1. Add a `GAME_DEFINITIONS` entry: identity, world, 3 level configs, awards, stickers.
2. Create `class NewGameScreen extends GameShell` implementing `onPreload()`,
   `buildWorld()`, `introText()`, `presentRound(i, diff)` and calling
   `answerCorrect/answerWrong/recordFumble`.
3. Register the scene in `index.html` + `game.js`, and point a map city's
   `screenKey` at it — level select, HUD, hints, pause, scoring, rewards,
   stickers, album and world progression come for free.
