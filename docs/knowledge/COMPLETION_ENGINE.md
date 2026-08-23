# Completion Engine Implementation Report

## Problem

Last-question success (e.g. Mirror City 3/3) showed a hopping bunny and no
completion UI. Rewards were text-only or delayed. Buttons sometimes missed
because press tweens fought hover. The 1600ms + 450ms waits made the session
feel cut off.

## Engine changes (all games inherit)

| System | Role |
|---|---|
| `CompletionEngine` | State machine + `completeGame()` + next-action router |
| `RewardPresentationEngine` | Persist → verify → visual reward items |
| `ResultScreen` | Shared completion UI (achievement / result / reward / next) |
| `GameShell.answerCorrect` | Last round completes immediately |
| `UISystem.bindTap` | Immediate press, one action, async bounce |
| `NavSystem.begin` | One navigation transaction, no debounce |

## Flow

```
Last answer → notifyLastAnswer → completeGame
  → persist rewards (SaveEngine)
  → launch ResultScreen immediately
  → next actions already visible
  → celebration / speech / sparkles async
```

## Next actions

- Level 1–2: primary **TIẾP TỤC**, then Chơi lại / Chọn màn / Về nhà
- Level 3: primary **CHỌN MÀN**
- Persist failure: primary **THỬ LẠI** — never claims "added to album"

## Delay audit

See `docs/knowledge/DELAY_AUDIT.md`. Interaction-path waits removed.
Gameplay presentation delays (object count-in) kept.
