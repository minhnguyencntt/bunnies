# Subtraction Hill — Đồi Phép Trừ (`SubtractionHillScreen`)

Giúp **cáo con** tìm lại **6 món đồ** bằng cách giải **6 phép trừ**; mỗi lần đúng nhặt một món (emoji bay về cáo). Kết thúc: reunion với mẹ, bubble + `voice_complete`.

---

## Cấu trúc file

| File / thư mục | Vai trò |
|----------------|---------|
| `screen.js` | Scene: 6 round, sinh bài `a - b`, nút đáp án, BGM, mẹ cáo (local) |
| `core/characters/young_fox/YoungFoxCharacter.js` | **Cáo con** — container vector + idle / emotion / `hopJoy` |
| `puzzle.js` | `SubtractionHillPuzzle` — `lostItemPool`, `getLostItemsForLevel`, `audio` keys, `events` |
| `assets/backgrounds/bg.png` | Nền |
| `assets/audio/bgm/bgm.wav` | BGM loop |
| `assets/audio/voice/` | `intro_1..3`, `correct_answer`, `wrong_answer`, `level_complete` |

---

## [gameplay] — đúng với `screen.js`

1. **`totalPuzzles = 6`**, `currentRound` 0…5; mỗi round một phép trừ.
2. **Mở màn:** BGM, nền, cáo con, hàng tiến độ (6 slot), `UIScreen` overlay.
3. **Intro:** 3 đoạn nối tiếp + `voice_intro_1` → `voice_intro_2` → `voice_intro_3` (bubble trùng nội dung từng mục **[voice_intro_1]** … **[voice_intro_3]**).
4. **Sinh bài:** `a` ngẫu nhiên `0 … maxA`, `b` ngẫu nhiên `0 … a` (nếu `a === 0` thì `b = 0`), đáp án `a - b`, giá trị đáp án và nhiễu trong **0–10**. Tránh lặp gần đây qua `problemHistory`.
5. **`maxMinuendForRound()`:** `min(10, 3 + ceil((round+1)/6 * 7))` — độ khó tăng dần theo round.
6. **Số nút chọn:** round 0–1 → **2** lựa chọn; 2–3 → **3**; 4–5 → **4**.
7. **Đúng:** `voice_correct`; bay emoji đồ về cáo; slot tiến độ +1; bubble hiện tên món đồ tiếng Việt (ví dụ "Tìm thấy Thú bông rồi!"); `emitThemeEvent` (`SubtractionHillScreen:CorrectAnswer` / `ItemCollected`).
8. **Sai:** `voice_wrong`; bubble "Chưa đúng rồi… Thử lại nhé!"; gợi ý "💡 Gợi ý: a bớt b còn mấy?"; `emitThemeEvent` `SubtractionHillScreen:WrongAnswer`.
9. **Hết 6 round:** fade dừng BGM → reunion, `voice_complete`, bubble **"Mẹ ơi! Con tìm được hết đồ rồi!"**, panel thưởng hiện danh sách món đồ (emoji + tên tiếng Việt); `emitThemeEvent` `SubtractionHillScreen:LevelComplete`.

---

## [story] — thoại đồng bộ TTS

**Intro:** thứ tự `intro_1` → `intro_2` → `intro_3` — chi tiết từng file ở dưới.

**Đúng (bubble, song song `voice_correct`):** Theo tên món đồ — *"Tìm thấy Thú bông rồi!"* / *"Sách nhỏ đây rồi! Cảm ơn bạn!"* / *"Hay quá! Nhặt được Kẹo!"* / *"Mũ đã về với cáo con!"*

**Sai (bubble + `voice_wrong`):** *"Chưa đúng rồi… Thử lại nhé!"* + gợi ý *"💡 Gợi ý: a bớt b còn mấy?"*

**Hết level (bubble + `voice_complete`):** *"Mẹ ơi! Con tìm được hết đồ rồi!"*

---

## [bg]

**File:** `assets/backgrounds/bg.png`

**Prompt gợi ý:** Đồi cỏ, hoàng hôn hoặc ban ngày, phong cách hoạt hình, có chỗ đặt cáo & thanh tiến độ, không chữ.

---

## [bgm]

**File:** `assets/audio/bgm/bgm.wav` — Phaser key **`bgm_subtraction_hill`**

Preset: `scripts/bgm/screen_bgm_presets.json` — `subtraction_hill_gameplay`.

```bash
python3 scripts/generate_audio.py bgm subtraction_hill_gameplay
```

---

## [voice_intro_1]

| | |
|--|--|
| **Vai trò** | Mở đầu: giới thiệu Đồi Phép Trừ, cáo con bị lạc đồ. |
| **File** | `assets/audio/voice/intro_1.mp3` |
| **Phaser key** | `voice_intro_1` |
| **Thời lượng bubble (code)** | ~5500 ms |

**Nội dung thoại (nguyên văn — TTS phải khớp):**

> Hu hu… Cáo con làm rơi đồ đạc khắp Đồi Phép Trừ! Bạn có thể giúp tìm lại không?

```bash
python3 scripts/generate_audio.py tts --text "Hu hu… Cáo con làm rơi đồ đạc khắp Đồi Phép Trừ! Bạn có thể giúp tìm lại không?" --out src/screens/subtraction_hill/assets/audio/voice/intro_1.mp3 --force
```

---

## [voice_intro_2]

| | |
|--|--|
| **Vai trò** | Giải thích gameplay: mỗi phép trừ đúng → nhặt đồ bay về. |
| **File** | `assets/audio/voice/intro_2.mp3` |
| **Phaser key** | `voice_intro_2` |
| **Thời lượng bubble (code)** | ~5000 ms |

**Nội dung thoại (nguyên văn):**

> Mỗi câu trừ đúng sẽ gọi một món đồ bị thất lạc bay về chỗ cáo con.

```bash
python3 scripts/generate_audio.py tts --text "Mỗi câu trừ đúng sẽ gọi một món đồ bị thất lạc bay về chỗ cáo con." --out src/screens/subtraction_hill/assets/audio/voice/intro_2.mp3 --force
```

---

## [voice_intro_3]

| | |
|--|--|
| **Vai trò** | Hướng dẫn phạm vi số + mục tiêu: tìm hết đồ, gặp mẹ. |
| **File** | `assets/audio/voice/intro_3.mp3` |
| **Phaser key** | `voice_intro_3` |
| **Thời lượng bubble (code)** | ~5500 ms |

**Nội dung thoại (nguyên văn):**

> Chỉ có số từ 0 đến 10 thôi — tìm hết đồ, cáo con sẽ được gặp mẹ!

```bash
python3 scripts/generate_audio.py tts --text "Chỉ có số từ 0 đến 10 thôi — tìm hết đồ, cáo con sẽ được gặp mẹ!" --out src/screens/subtraction_hill/assets/audio/voice/intro_3.mp3 --force
```

---

## [voice_correct_answer]

| | |
|--|--|
| **Vai trò** | Thoại cáo khi trả lời đúng. |
| **File** | `assets/audio/voice/correct_answer.mp3` |
| **Key** | `voice_correct` |

**Nội dung:**

> Đúng rồi! Cảm ơn bạn!

```bash
python3 scripts/generate_audio.py tts --text "Đúng rồi! Cảm ơn bạn!" --out src/screens/subtraction_hill/assets/audio/voice/correct_answer.mp3 --force
```

---

## [voice_wrong_answer]

| | |
|--|--|
| **Vai trò** | Phản hồi khi chọn sai. |
| **File** | `assets/audio/voice/wrong_answer.mp3` |
| **Key** | `voice_wrong` |

**Nội dung:**

> Chưa đúng rồi… Thử lại nhé!

```bash
python3 scripts/generate_audio.py tts --text "Chưa đúng rồi… Thử lại nhé!" --out src/screens/subtraction_hill/assets/audio/voice/wrong_answer.mp3 --force
```

---

## [voice_level_complete]

| | |
|--|--|
| **Vai trò** | Khi xong 6 round (reunion). |
| **File** | `assets/audio/voice/level_complete.mp3` |
| **Key** | `voice_complete` |
| **Bubble (code)** | "Mẹ ơi! Con tìm được hết đồ rồi!" |

**Nội dung:**

> Mẹ ơi! Con tìm được hết đồ rồi! Cảm ơn bạn đã giúp cáo con!

```bash
python3 scripts/generate_audio.py tts --text "Mẹ ơi! Con tìm được hết đồ rồi! Cảm ơn bạn đã giúp cáo con!" --out src/screens/subtraction_hill/assets/audio/voice/level_complete.mp3 --force
```

**Tạo cả 6 file voice:**

```bash
python3 scripts/generate_audio.py bundle subtraction-hill --force
```

---

## [puzzle]

**File:** `puzzle.js` — `SubtractionHillPuzzle`: `lostItemPool` (mỗi món có `id`, `emoji`, `labelVi`), `getLostItemsForLevel(count)`, `audio` (keys khớp preload, bao gồm `intro1..3`), `events` (`SubtractionHillScreen:…`). Thêm đồ = thêm phần tử vào `lostItemPool`.

---

## Liên kết menu

`map.md` mục (4), voice `city_4_*`; `world_map_data` `screenKey: 'SubtractionHillScreen'`.
