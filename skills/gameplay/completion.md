# SKILL: Game Completion & Rewards

## Purpose

Every game finishes through the shared completion engine so the child always
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

## UI must show

1. Achievement — game name + level
2. Result — score, correct/total, stars
3. Reward — real sticker/award artwork + name + type + NEW vs teaser
4. One primary next action (`TIẾP TỤC` if another level, else `CHỌN MÀN`)
5. Secondary: `CHƠI LẠI` · `CHỌN MÀN` · `VỀ NHÀ`

If persist fails: "Chưa lưu được phần thưởng" + `THỬ LẠI`. Never lie that the
album was updated.

## Interaction

- Buttons: `UISystem.bindTap` — pressed scale on pointerdown, action immediately.
- Navigation: `NavSystem.go` — first tap wins, duplicates ignored, no debounce.
- Last question: `GameShell.answerCorrect` completes immediately (no 1.6s wait).
