# SKILL: Content (dialogue & educational content)

## Purpose

Write child-safe Vietnamese content: instructions, hints, praise, stories.

## Rules

- Short, natural, encouraging. Level-band voice: Màn 1 = very short & concrete;
  Màn 2 = one sentence + mechanic; Màn 3 = concise challenge.
- Never shame. Wrong answers → "Gần đúng rồi! Thử lại nhé!" style.
- Educational content teaches through objects/actions first, words second.
- All spoken text lives in `AudioConfig.VOICE_LIBRARY` (vi + en) — never inline
  in gameplay code. UI strings stay Vietnamese, minimal, large.

## Localization

Lines carry `vi` and `en`; new locales = new text + regenerated voice files.
No game-logic changes.

## Validation

- [ ] Readable by a 5-year-old (or playable without reading)
- [ ] No long explanations during active gameplay
- [ ] Every spoken instruction has a visual equivalent
