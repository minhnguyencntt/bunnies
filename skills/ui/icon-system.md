# SKILL: Icon system

## Purpose

One drawn icon language for navigation and HUD actions.

## Rules

- Use `IconSystem.draw` / `UISystem.iconButton(scene, x, y, 'back', …)`.
- Allowed keys: `back`, `home`, `pause`, `play`, `hint`, `settings`,
  `close`, `album`, `map`, `sound`.
- Same fill weight, same circular button container, crisp at any DPI.
- Do not mix random emoji libraries for those actions.
- Decorative world emoji (🍎 ⭐ 💎) may still appear in gameplay/content.
