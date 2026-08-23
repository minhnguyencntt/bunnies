# Reward System

Pipeline (RewardEngine.finishSession):

```
Gameplay metrics (AnalyticsEngine)
  → Score 0–100 (ScoringEngine: accuracy+speed+combo+exploration+perfect+difficulty−hint)
  → Stars (StarEngine thresholds, per level; completion always ≥ ⭐)
  → XP (XPEngine: 50/100/200 base by level + 3⭐/perfect/no-hint bonuses)
  → Awards (AwardEngine: deterministic conditions)
  → Stickers (StickerEngine: deterministic unlock rules)
  → Gems (base + 2/star + 5 perfect)
  → World progression (ProgressionEngine: map stars, 🥉🥈🥇 tiers)
```

## Rules

- Child-friendly: hints cost a few points, never remove rewards.
- No random loot: every sticker/award shows exactly how to earn it.
- Completion is owned by `CompletionEngine.completeGame()` — games must not
  build their own result/reward screens.
- Awards are first-class objects (`Award.hydrate`): identity, metadata,
  artwork, presentation state, persistence. ResultScreen and the album render
  the same object via `UISystem.awardCard`.
- `AwardGenerator` persists first, then builds `AwardResult`. Next steps come
  from `NextActionResolver` (`GameConfig.nextLevel`, never a hardcoded `< 3`).
  Never say "added to album" unless `Award.verifyOwned` / `persistOk`.
- Award screen contract: **hero Award** · reward values · short message · one
  primary next action · secondary navigation. Buttons are enabled immediately.
- Reward audio/animation are fire-and-forget (see audio-system.md).
- New reward types need: visual identity + animation + sound + celebration +
  progress feedback — and a condition in AwardEngine/StickerEngine.
