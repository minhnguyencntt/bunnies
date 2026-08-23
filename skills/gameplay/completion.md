# SKILL: Game Completion & Rewards

## Purpose

Every game finishes through the shared Award Engine so the child always
sees what they earned and what to tap next.

## When to use

Any session end: last correct answer, timeout on last round, or fatal last
round. New games inherit this automatically via `GameShell`.

## Contract

```
PLAYING → LAST_ANSWER → COMPLETED → CALCULATING_REWARD
  → REWARD_REVEAL → REWARD_PRESENTED → NEXT_ACTION
```

Call only:

```
CompletionEngine.completeGame({ scene, gameId, level, analytics, parTimeMs })
```

Do not launch `ResultScreen` from a game subclass. Do not invent stickers/XP
copy. Do not wait for speech, SFX, or tweens before showing next actions.

## Engine split

| Engine | Role |
|---|---|
| `AwardGenerator` | persist + `AwardResult` |
| `AwardResult` | structured hero award + XP/stars/coins |
| `NextActionResolver` | CONTINUE_LEVEL / PLAY_AGAIN / CHOOSE_GAME / HOME |
| `RewardPresentationEngine` | celebration only (non-blocking) |
| `ResultScreen` | shared Award Screen |

A future game only adds GameConfig rules + assets. It does not add an award
screen, continue button, or persist path.

## UI must show

1. Award artwork (hero `Award` — the thing just earned)
2. Award title + type / "NEW"
3. Reward values — XP, stars, coins
4. Short celebration message
5. One primary next action (`TIẾP TỤC` if `GameConfig.nextLevel` exists, else `CHỌN MÀN`)
6. Secondary: `CHƠI LẠI` · `CHỌN MÀN` · `VỀ NHÀ`

If persist fails: "Chưa lưu được phần thưởng" + `THỬ LẠI`. Never lie that the
album was updated.

## Interaction

- Buttons: `UISystem.bindTap` — pressed scale on pointerdown, action immediately.
- Navigation: `NavSystem.go` — first tap wins, duplicates ignored, no debounce.
- Last question: `GameShell.answerCorrect` completes immediately (no 1.6s wait).
- Award animation / speech / SFX never gate the next action.
