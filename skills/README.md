# Bunnies Skills

Reusable implementation capabilities — "how do we build this type of thing in
Bunnies?" Read the root `/AGENTS.md` first, then the skill(s) relevant to your
feature (classify the feature: UI / Gameplay / World / Character / Animation /
Audio / Navigation / Reward / Progression / Content).

## Index

| Skill | Use when |
|---|---|
| `gameplay/SKILL.md` | adding any game/level; round lifecycle, engine wiring |
| `gameplay/multiple-choice.md` | visual 3-choice math games (addition/subtraction/…) |
| `ui/SKILL.md` | buttons, cards, panels, bars, bubbles, HUD |
| `animation/SKILL.md` | motion tokens, character reactions, reward reveals |
| `audio/SKILL.md` | music, SFX, voice lines, ambience, events, settings |
| `content/SKILL.md` | dialogue, educational content, localization |

## Rules

- Reuse the closest existing skill before inventing a pattern.
- After implementing, if you created a reusable pattern → update/create the
  SKILL.md and link it here. Never document one-off details.
