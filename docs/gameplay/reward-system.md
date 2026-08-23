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
- Result screen priority: celebration → solved count → score → stars → XP →
  gems → awards → stickers → world progress → actions.
- Reward audio is synchronized with the reveal animation (see audio-system.md).
- New reward types need: visual identity + animation + sound + celebration +
  progress feedback — and a condition in AwardEngine/StickerEngine.
