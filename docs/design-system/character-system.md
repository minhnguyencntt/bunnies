# Character System

## Identity

Bunnine (bunny) is the companion and guide — warm, playful, encouraging, never
a judge. NPCs: Wise Owl, Young Fox, Squirrel. All share soft-toy rendering:
rounded forms, big expressive eyes, gentle lighting.

## Emotion mapping (implemented in `GameShell.companionReact`)

| Gameplay event | Emotion | Animation |
|---|---|---|
| Correct answer | happy | 2 hops + happy sprite |
| Streak ≥ 3 | excited | 4 hops |
| Level complete | celebrate | 5 hops + hop sprite |
| Wrong answer | think | curious head-tilt (never sad judgment) |
| Hint requested | curious | reverse tilt |
| New world / discovery | curious | tilt |

## Rules

- Characters react to gameplay but never block it.
- Sadness is brief and empathetic; immediately followed by encouragement.
- Reuse `spr_bunny_idle/happy/hop/sad` textures; new character art must match
  the soft-toy rendering quality (no pixel art, no clashing styles).
- Big in-world character (e.g. `VisualMathScreen.createBigBunny`) for hero
  moments; corner companion for continuous feedback.
