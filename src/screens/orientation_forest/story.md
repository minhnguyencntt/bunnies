# Orientation Forest — Khu Rừng Định Hướng (`OrientationForestScreen`)

Giúp **Sóc con** tìm lại **6 biển chỉ dẫn** bằng cách trả lời câu hỏi **trái – phải – trước – sau**; mỗi lần đúng khôi phục một biển (icon mũi tên bay về Sóc). Kết thúc: con đường sáng, Sóc chạy gặp bạn bè, bubble + `voice_complete`.

---

## Cấu trúc file

| File / thư mục | Vai trò |
|----------------|---------|
| `screen.js` | Scene: 6 round, câu hỏi định hướng, nút chọn hướng, BGM, đường sáng + bạn bè (local) |
| `core/characters/squirrel/SquirrelCharacter.js` | **Sóc con** — vector + idle / `turnTo` / `turnWrong` / `hopJoy` |
| `puzzle.js` | `OrientationForestPuzzle` — `directionPool`, `buildRound`, `audio` keys, `events` |
| `assets/backgrounds/bg.png` | Nền |
| `assets/audio/bgm/bgm.wav` | BGM loop |
| `assets/audio/voice/` | `intro_1..3`, `correct_answer`, `wrong_answer`, `level_complete` |

---

## [gameplay] — visual-first (thiếu nhi chưa biết chữ)

1. **`totalPuzzles = 6`**, `currentRound` 0…5; mỗi round một câu đố trực quan.
2. **Mở màn:** BGM, nền, Sóc ở giữa màn hình (platform sáng bên dưới), hàng tiến độ 6 slot (emoji), `UIScreen` overlay.
3. **Intro:** 3 đoạn voice (`voice_intro_1` → `voice_intro_2` → `voice_intro_3`) + bubble emoji (`😱 🐿️ ❓`, `🪧 ← → ↑ ↓ ❌`, `👆 🐿️ ✨`). **Voice là kênh truyền tải chính**, text chỉ bổ trợ bằng emoji.
4. **Sinh câu đố trực quan:** `buildRound(choiceCount, questionHistory)` chọn ngẫu nhiên **clue object** (emoji từ `cluePool`: 🌳🍄🌸🦋⭐🎈🍎🐦) + **hướng đúng** (trái/phải/trước/sau). Clue xuất hiện ở vị trí tương đối so với Sóc, bao quanh bởi vòng sáng vàng nhấp nháy. Trẻ nhìn vị trí vật → chọn mũi tên đúng.
5. **Nút bấm:** mũi tên tròn lớn (← → ↑ ↓), **không label chữ**, màu sắc riêng biệt. Số nút: round 0–1 → **2**; 2–3 → **3**; 4–5 → **4**.
6. **Đúng:** `voice_correct`; Sóc quay đúng hướng + `hopJoy`; clue emoji bay về Sóc; slot progress +1 (hiện emoji clue); bubble emoji (`👍 ✨`, `🎉 🎉`, v.v.); `emitThemeEvent` `CorrectAnswer` / `DirectionCollected`.
7. **Sai:** `voice_wrong`; Sóc `turnWrong`; bubble `🤔 ❌`; **gợi ý trực quan** = clue object phóng to nhấp nháy + vòng sáng flash (không text); `WrongAnswer`.
8. **Hết 6 round:** fade BGM → đường vàng, Sóc chạy gặp bạn bè; `voice_complete`; bubble `🎉 ❤️ ✨`; panel thưởng hiện chuỗi emoji clue đã thu thập + chuỗi hướng; `LevelComplete`.

---

## [story] — thoại đồng bộ TTS

**Intro:** `intro_1` → `intro_2` → `intro_3` (voice là chính; bubble chỉ hiện emoji).

**Đúng (bubble + `voice_correct`):** bubble emoji luân phiên (`👍 ✨`, `🎉 🎉`, `⭐ ✅`, `💪 🌟`) — `voice_correct` nội dung cố định: *"Đúng rồi! Bạn giỏi lắm!"*

**Sai:** bubble `🤔 ❌` + gợi ý trực quan (flash clue) — `voice_wrong` *"Chưa đúng rồi… Thử lại nhé!"*

**Hết level:** bubble `🎉 ❤️ ✨` — `voice_complete` *"Tớ nhớ đường rồi! Cảm ơn bạn đã giúp Sóc!"*

---

## [bg]

**File:** `assets/backgrounds/bg.png`

**Prompt gợi ý:** a bright cartoon forest with clear walking paths showing left and right directions, open center space for character, soft green trees, child-friendly style, 2D game background, no text

---

## [bgm]

**File:** `assets/audio/bgm/bgm.wav` — Phaser key **`bgm_orientation_forest`**

Preset: `scripts/bgm/screen_bgm_presets.json` — `orientation_forest_gameplay`.

```bash
python3 scripts/generate_audio.py bgm orientation_forest_gameplay
```

---

## [voice_intro_1]

| | |
|--|--|
| **Vai trò** | Mở đầu: Sóc bị lạc trong rừng. |
| **File** | `assets/audio/voice/intro_1.mp3` |
| **Phaser key** | `voice_intro_1` |
| **Thời lượng bubble (code)** | ~5000 ms |

**Nội dung thoại:**

> Ôi không! Sóc con bị lạc trong Khu Rừng Định Hướng rồi!

```bash
python3 scripts/generate_audio.py tts --text "Ôi không! Sóc con bị lạc trong Khu Rừng Định Hướng rồi!" --out src/screens/orientation_forest/assets/audio/voice/intro_1.mp3 --force
```

---

## [voice_intro_2]

| | |
|--|--|
| **Vai trò** | Giải thích mất biển chỉ dẫn. |
| **File** | `assets/audio/voice/intro_2.mp3` |
| **Phaser key** | `voice_intro_2` |
| **Thời lượng bubble (code)** | ~5000 ms |

**Nội dung thoại:**

> Những biển chỉ dẫn trái – phải – trước – sau đã bị thất lạc!

```bash
python3 scripts/generate_audio.py tts --text "Những biển chỉ dẫn trái – phải – trước – sau đã bị thất lạc!" --out src/screens/orientation_forest/assets/audio/voice/intro_2.mp3 --force
```

---

## [voice_intro_3]

| | |
|--|--|
| **Vai trò** | Hướng dẫn gameplay. |
| **File** | `assets/audio/voice/intro_3.mp3` |
| **Phaser key** | `voice_intro_3` |
| **Thời lượng bubble (code)** | ~5000 ms |

**Nội dung thoại:**

> Hãy giúp Sóc chọn đúng hướng để tìm lại đường nhé!

```bash
python3 scripts/generate_audio.py tts --text "Hãy giúp Sóc chọn đúng hướng để tìm lại đường nhé!" --out src/screens/orientation_forest/assets/audio/voice/intro_3.mp3 --force
```

---

## [voice_correct_answer]

| | |
|--|--|
| **Vai trò** | Thoại khi trả lời đúng. |
| **File** | `assets/audio/voice/correct_answer.mp3` |
| **Key** | `voice_correct` |

**Nội dung:**

> Đúng rồi! Bạn giỏi lắm!

```bash
python3 scripts/generate_audio.py tts --text "Đúng rồi! Bạn giỏi lắm!" --out src/screens/orientation_forest/assets/audio/voice/correct_answer.mp3 --force
```

---

## [voice_wrong_answer]

| | |
|--|--|
| **Vai trò** | Phản hồi khi sai. |
| **File** | `assets/audio/voice/wrong_answer.mp3` |
| **Key** | `voice_wrong` |

**Nội dung:**

> Chưa đúng rồi… Thử lại nhé!

```bash
python3 scripts/generate_audio.py tts --text "Chưa đúng rồi… Thử lại nhé!" --out src/screens/orientation_forest/assets/audio/voice/wrong_answer.mp3 --force
```

---

## [voice_level_complete]

| | |
|--|--|
| **Vai trò** | Khi hoàn thành level. |
| **File** | `assets/audio/voice/level_complete.mp3` |
| **Key** | `voice_complete` |
| **Bubble (code)** | *"Tớ nhớ đường rồi! Cảm ơn bạn!"* |

**Nội dung TTS:**

> Tớ nhớ đường rồi! Cảm ơn bạn đã giúp Sóc!

```bash
python3 scripts/generate_audio.py tts --text "Tớ nhớ đường rồi! Cảm ơn bạn đã giúp Sóc!" --out src/screens/orientation_forest/assets/audio/voice/level_complete.mp3 --force
```

---

## [puzzle]

**File:** `puzzle.js` — `OrientationForestPuzzle`

- `directionPool`: `left` / `right` / `forward` / `back` (icon + `labelVi`).
- `cluePool`: 8 emoji objects (🌳🍄🌸🦋⭐🎈🍎🐦) hiển thị trực quan trên màn.
- `buildRound(choiceCount, questionHistory)` → `{ clueEmoji, clueName, correctId, choices }`.
- `events`: `OrientationForestScreen:CorrectAnswer`, `WrongAnswer`, `DirectionCollected`, `LevelComplete`.

---

## Liên kết menu

`map.md` mục (26); `world_map_data.js` `screenKey: 'OrientationForestScreen'`, `visible: true`. Voice hover map: `screens/menu/assets/audio/voice/city_26_khu_rung_dinh_huong.mp3` (`voice_city_26`).

```bash
python3 scripts/generate_audio.py tts --text "Khu Rừng Định Hướng. Nhận biết trái phải trước sau. Chủ đề: Định hướng." --out src/screens/menu/assets/audio/voice/city_26_khu_rung_dinh_huong.mp3 --force
```
