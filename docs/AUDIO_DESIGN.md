# Audio Design — Bunnine & Knowledge World

A complete, event-driven audio system in `src/core/audio/`. Audio answers three
questions for the child: **What should I do?** (voice instructions) ·
**What is happening?** (SFX + ambience) · **How am I doing?** (feedback, rewards).

## Architecture

```
Gameplay code
     │  AudioEngine.emit('CorrectAnswer', …)   ← semantic events only
     ▼
AudioEvents.js — event → audio mapping
     ├── SFXEngine.js       synthesized SFX (Web Audio, ~30 sounds, variations)
     ├── VoiceEngine.js     generated vi-VN voice lines + speech-synthesis fallback
     ├── MusicEngine.js     area themes + dynamic intensity layers + stingers
     └── AmbienceEngine.js  procedural environmental ambience
     ▼
AudioEngine.js — channels (master→music/sfx/voice/ambient), priority,
                 voice ducking, cooldowns, persisted settings, analytics
```

- **Audio priority**: Voice > Critical feedback > Reward > Character > SFX > Ambient > Music.
  Voice playback automatically **ducks** music (−75%) and ambience (−60%), then smoothly restores.
- **Voice cooldowns**: per-category cooldowns (correct 2.2s, wrong 3s, hint 4s,
  character reactions 9s) + no immediate line repeats → no audio fatigue.
- **Localization**: every line has `vi` + `en` text; files are generated from
  `scripts/voice_library.json` (dumped from `AudioConfig.js` — single source of truth).
  New locales need only new text + generated files; no game-logic changes.
- **Accessibility**: every voice instruction has a visual equivalent (speech bubble,
  highlight ring, HUD). The game is fully playable muted.
- **Audio analytics** (local only): voice plays, hint usage, mute toggles — in
  `profile.stats.audio`.

## Dynamic music & intensity

Each area has its own theme (menu/world map, each game's world, reward screen,
sticker album). Intensity is engine-driven:

| State | Sound |
|---|---|
| low (exploration) | base theme only |
| medium (active play) | + soft synthesized pulse layer |
| high (time pressure, last 5s) | + gentle arpeggio layer |
| celebration (victory) | stinger flourish, then settles |

Transitions crossfade; the tension layer stops immediately at round end.

## Voice design by level

- **Màn 1 (3–5)**: short, slow, single-action instructions — "Kéo táo vào giỏ giúp Bunnine nhé!"
- **Màn 2 (6–10)**: one-sentence goal + mechanic — "Cộng hai số, rồi chọn con đường có biển số đúng!"
- **Màn 3 (10–15)**: concise, challenge-oriented — "Có gì đó đã thay đổi. Bạn có tìm ra hết không?"

Bunnine's voice = narrator voice pitched up (warm, playful, never scary).
8 correct-answer variations, 6 gentle retry variations, contextual near-completion
and celebration lines. Educational counting voice ("Một… Hai… Ba…") is synced
with each collected object in the counting/subtraction games.

## Per-game audio tables (20 required deliverables)

### 🌲 Khu Rừng Đếm Số (addition)

| # | Element | Design |
|---|---|---|
| 1 | Background music | `bgm_counting_forest` — playful forest theme, seamless loop |
| 2 | Ambient | forest: wind, bird chirps, sparkle pings |
| 3 | Gameplay SFX | drag rustle, apple pickup plink, basket pop, path sparkles |
| 4 | Voice instructions | per-level generated lines (see above) |
| 5 | Hint voice | "Đây là gợi ý nhỏ này." + magical chime |
| 6 | Correct | bright triad figure + praise variation |
| 7 | Incorrect | soft warm descent + "Gần đúng rồi!…" (never a buzzer) |
| 8 | Character reactions | Bunnine: wow/let's go/yay (9s cooldown, sparse) |
| 9 | Score sound | soft tick during result count-up |
| 10 | Star sound | ascending sparkle per star pop (784/880/1047 Hz) |
| 11 | Award sound | short fanfare + "Huy hiệu mới!" |
| 12 | Sticker unlock | collectible reveal arpeggio + "Sticker mới!" (rarer = more magical) |
| 13 | XP sound | magical shimmer on the XP bar |
| 14 | Level completion | victory stinger + "Bạn đã hoàn thành!" |
| 15 | Game completion music | reward theme on the result screen |
| 16 | Transitions | whoosh on scene changes |
| 17 | Intensity | medium during play; high in final seconds of timed rounds |
| 18 | Variations | 8 correct / 6 retry / pitch-jittered SFX |
| 19 | Cooldowns | per-category voice cooldowns; counting voice ≤ 4/s |
| 20 | Localization | vi files + en text fallback; TTS regeneration per locale |

### ⛰️ Đồi Phép Trừ (subtraction)

Identical system; theme `bgm_subtraction_hill`, forest ambience; roll-away
whoosh when items leave; pack pop per basket item; counting voice on collects;
instruction lines match the pack-then-remainder mechanic.

### 🪞 Thành Phố Gương (find the difference)

Theme `bgm_mirror_city`; **mystery ambience** (night wind, soft chimes, rare
creaks); distinct "discovery" two-tone on each find; soft 💭 puff on mis-tap;
hint chime + area pulse; L3 instruction is deliberately non-specific.

### 🌳 Khu Rừng Định Hướng (orientation)

Theme `bgm_orientation_forest`; forest ambience; ascending step tone per correct
sequence step in Màn 3 (audio mirrors the memorized route); arrow tap blips.

## Settings & controls

`AudioSettingsScreen` (⚙️ on the world map): Master / Music / SFX / Voice /
Ambient sliders + 🔊 Sound and 🎵 Music toggles. Persisted in the profile,
applied live (including ducking behavior).

## Asset architecture

```
src/core/audio/assets/
 ├── voice/            51 shared lines (feedback, hints, rewards, counting 1–20, Bunnine)
 └── bgm/              reward_theme.mp3, album_theme.mp3
src/screens/<game>/assets/audio/
 ├── bgm/bgm.mp3       per-game theme
 └── voice/level_N.mp3 per-level instruction
```

Regenerate: `python3 scripts/generate_voice_library.py` ·
`python3 scripts/generate_audio.py bgm all --presets-file scripts/bgm/reward_album_presets.json`
