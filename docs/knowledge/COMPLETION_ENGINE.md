# Completion Engine Implementation Report

## Flow

```
Last answer → notifyLastAnswer → completeGame
  → AwardGenerator.generate (persist via RewardEngine)
  → AwardResult (hero Award + XP/stars/coins)
  → NextActionResolver (CONTINUE / CHOOSE_GAME / HOME)
  → launch ResultScreen immediately
  → next actions already visible
  → celebration / speech / sparkles async
```

## Engine split (all games inherit)

| System | Role |
|---|---|
| `CompletionEngine` | State machine + `completeGame()` + action router |
| `AwardGenerator` | Persist + assemble `AwardResult` |
| `AwardResult` | Structured award the UI and album share |
| `NextActionResolver` | Next-step model; Continue only if `GameConfig.nextLevel` |
| `Award` | Collectible (identity, artwork, presentation, persist) |
| `RewardPresentationEngine` | Celebration only |
| `ResultScreen` | Shared Award Screen — hero Award + next actions |
| `UISystem.awardCard` | One card for ResultScreen and the album |
| `GameShell.answerCorrect` | Last round completes immediately |

## Next actions

- Next level exists: primary **TIẾP TỤC** (`CONTINUE_LEVEL`) opens that level
- Final level: primary **CHỌN MÀN** (`CHOOSE_GAME`) — no Continue button
- Secondary: **CHƠI LẠI** · **CHỌN MÀN** · **VỀ NHÀ**
- Persist failure: primary **THỬ LẠI** — never claims "added to album"

## Delay audit

See `docs/knowledge/DELAY_AUDIT.md`. Interaction-path waits removed.
Gameplay presentation delays (object count-in) kept.
