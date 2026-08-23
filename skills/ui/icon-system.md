# SKILL: Icon System

## Purpose

Keep every icon in the game consistent and crisp.

## System

`DesignTokens.icons` — the semantic icon map. One glyph per action:

```
back ◀ · home 🏠 · map 🗺️ · settings ⚙️ · album 🎟 · hint 💡 ·
pause ⏸️ · play ▶ · close ✕ · sound 🔊 · music 🎵 · star ⭐ · gems 💎 · level 🎓
```

## Rules

- Always reference `DesignTokens.icons.<name>` — never inline a different glyph
  for the same action.
- Emoji glyphs are vector-rendered by the OS → crisp on Retina/high-DPI.
  Do NOT add raster icon files for UI actions.
- World/gameplay objects (candies, mushrooms, animals) may use thematic emoji
  freely — they are content, not UI icons.
- Sizes: HUD icons 18–22px in a 46px+ target; decorative content may scale.

## Validation

- [ ] Same action = same glyph everywhere (search for the glyph before adding)
- [ ] No raster/blurry icon assets for UI
- [ ] Icons centered with optical padding in their containers
