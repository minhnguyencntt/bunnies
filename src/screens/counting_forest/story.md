# Counting Forest — Khu rừng đếm số (`CountingForestScreen`)

**Lưu ý tên vs gameplay:** Trên bản đồ / menu mô tả kiểu “đếm vật thể”; **code hiện tại** là **bài toán cộng** (hai số, tổng ≤ 10), kéo thẻ đáp án để **ghép lại cầu gỗ 10 tấm ván**. Khi chỉnh `map.md` / voice city_1 cho đồng bộ, nên quyết định một hướng (cộng vs đếm hình).

---

## Cấu trúc file

| File / thư mục | Vai trò |
|----------------|---------|
| `screen.js` | Scene Phaser: cầu, câu hỏi, kéo thả, Cú, BGM, thoại |
| `puzzle.js` | Placeholder `CountingForestPuzzle` — **câu hỏi sinh trong** `generateNewQuestion()` |
| `assets/backgrounds/bg.png` | Nền (fallback: graphics rừng nếu thiếu ảnh) |
| `assets/audio/bgm/bgm.wav` | BGM loop (~volume 0.45 trong code) |
| `assets/audio/voice/` | `intro_1..3`, `correct_answer`, `wrong_answer`, `level_complete` |

---

## [gameplay] — đúng với `screen.js`

1. **Mở màn:** BGM, nền, cầu **10 ván gỗ** (chưa ghép), Cú Thông Thái, `UIScreen` overlay.
2. **Intro:** 3 đoạn nối tiếp + `voice_intro_1` → `voice_intro_2` → `voice_intro_3` (bubble trùng nội dung từng mục **[voice_intro_1]** … **[voice_intro_3]**).
3. **Mỗi lượt:** Sinh **một phép cộng** `a + b = ?` với `a,b ≥ 1`, **`a + b ≤ 10`**. Ba thẻ số: **1 đúng + 2 nhiễu**, xáo trộn.
4. **Chơi:** Kéo thẻ vào **ô thả trên ván cầu** đang “gãy” tiếp theo. Đúng → ván được ghép, hiện đáp án, **thỏ** xuất hiện trên ván, Cú khen + `voice_correct`, sau ~5.5s câu mới (nếu chưa đủ 10 ván). Sai → ván/ thẻ rung, thẻ bay về chỗ cũ, Cú + `voice_wrong` (dòng UI: “đếm cẩn thận” — khác một chút với mechanic cộng).
5. **Hoàn thành 10 ván:** `completeLevel` → hiệu ứng, panel **“Trang sách số 1”** / **“Sức Mạnh Của Những Con Số”**, Cú + `voice_complete`, nút **Tiếp tục** → hiện tại chuyển **`MenuScreen`** (có logic portal / `GameFlowConfig` cho màn tiếp theo trong code nhưng luồng nút chính là về menu — kiểm tra lại nếu muốn auto sang Mirror City).

**Prompt thiết kế:** độ tuổi 4–10, chỉ cộng trong 10, có muốn thêm “đếm vật trong ảnh” sau này không, số ván có đổi không.

---

## [story] — thoại trong game (để đồng bộ TTS)

**Intro:** ba đoạn **theo thứ tự** `intro_1` → `intro_2` → `intro_3` (trước câu hỏi đầu). Nội dung nguyên văn + lệnh sinh file: các mục **[voice_intro_1]**, **[voice_intro_2]**, **[voice_intro_3]** bên dưới.

**Đúng (bubble, song song `voice_correct`):** *“Làm tốt lắm, Bé Thỏ! Một tấm ván nữa đã được khôi phục. Tiếp tục nhé!”*

**Sai (bubble + `voice_wrong`):** *“Ồ! Chưa đúng. Hãy đếm cẩn thận và chọn lại nhé!”*

**Hết level (bubble + `voice_complete`):** *“Tuyệt vời! Bạn đã học được sức mạnh của những con số!”*

---

## [bg]

**File:** `assets/backgrounds/bg.png`

**Prompt gợi ý:** Rừng thân thiện, cầu gỗ / suối (phù hợp câu chuyện cầu gãy), tông sáng, 1280×720 hoặc full HD, không chữ — **không bắt buộc** có “đồ để đếm” vì gameplay hiện là **số trên UI**, không đếm sprite trong ảnh.

---

## [bgm]

```bash
python3 scripts/generate_audio.py bgm counting_forest_level1
```

Preset: `scripts/bgm/screen_bgm_presets.json` → `counting_forest_level1`.

---

## [voice_intro_1]

| | |
|--|--|
| **Vai trò** | Mở đầu: chào bé Thỏ, giới thiệu “Khu Rừng Đếm Số” và không khí con số. |
| **File** | `assets/audio/voice/intro_1.mp3` |
| **Phaser key** | `voice_intro_1` |
| **Thời lượng bubble (code)** | ~7000 ms (`showIntroductionDialogue`) |

**Nội dung thoại (nguyên văn — TTS phải khớp):**

> Chào mừng đến Khu Rừng Đếm Số, Bé Thỏ! Con đường ma thuật này đầy những con số đang chờ bạn khám phá.

**Sinh lại file:**

```bash
python3 scripts/generate_audio.py tts --text "Chào mừng đến Khu Rừng Đếm Số, Bé Thỏ! Con đường ma thuật này đầy những con số đang chờ bạn khám phá." --out src/screens/counting_forest/assets/audio/voice/intro_1.mp3 --force
```

---

## [voice_intro_2]

| | |
|--|--|
| **Vai trò** | Nêu **mâu thuẫn**: cầu gãy, không qua suối; gợi ý **phần thưởng** (mỗi câu đúng → một ván). |
| **File** | `assets/audio/voice/intro_2.mp3` |
| **Phaser key** | `voice_intro_2` |
| **Thời lượng bubble (code)** | ~9000 ms |

**Nội dung thoại (nguyên văn):**

> Ồ không! Cây cầu gỗ bị gãy, và bạn không thể băng qua dòng suối. Nhưng đừng lo, mỗi câu trả lời đúng sẽ giúp khôi phục một tấm ván.

**Sinh lại file:**

```bash
python3 scripts/generate_audio.py tts --text "Ồ không! Cây cầu gỗ bị gãy, và bạn không thể băng qua dòng suối. Nhưng đừng lo, mỗi câu trả lời đúng sẽ giúp khôi phục một tấm ván." --out src/screens/counting_forest/assets/audio/voice/intro_2.mp3 --force
```

---

## [voice_intro_3]

| | |
|--|--|
| **Vai trò** | **Hướng dẫn chơi**: bài **cộng**, kéo số vào chỗ trống trên cầu; mục tiêu **10 ván**. |
| **File** | `assets/audio/voice/intro_3.mp3` |
| **Phaser key** | `voice_intro_3` |
| **Thời lượng bubble (code)** | ~12000 ms |

**Nội dung thoại (nguyên văn):**

> Giải các bài toán cộng bằng cách chọn số đúng. Kéo nó vào chỗ trống trên cầu. Mỗi câu trả lời đúng sẽ khôi phục một tấm ván. Hãy xem bạn có thể khôi phục cả 10 tấm ván không!

**Sinh lại file:**

```bash
python3 scripts/generate_audio.py tts --text "Giải các bài toán cộng bằng cách chọn số đúng. Kéo nó vào chỗ trống trên cầu. Mỗi câu trả lời đúng sẽ khôi phục một tấm ván. Hãy xem bạn có thể khôi phục cả 10 tấm ván không!" --out src/screens/counting_forest/assets/audio/voice/intro_3.mp3 --force
```

---

## [voice_correct_answer]

**File:** `correct_answer.mp3` — key `voice_correct`

**Prompt TTS:** Khớp tinh thần câu khen on-screen (hoặc đọc nguyên câu “Làm tốt lắm…”).

```bash
python3 scripts/generate_audio.py tts --text "Làm tốt lắm, Bé Thỏ! Một tấm ván nữa đã được khôi phục. Tiếp tục nhé!" --out src/screens/counting_forest/assets/audio/voice/correct_answer.mp3 --force
```

---

## [voice_wrong_answer]

**File:** `wrong_answer.mp3` — key `voice_wrong`

```bash
python3 scripts/generate_audio.py tts --text "Ồ! Chưa đúng. Hãy thử tính lại và chọn đáp án đúng nhé!" --out src/screens/counting_forest/assets/audio/voice/wrong_answer.mp3 --force
```
*(Gợi ý trên sửa “đếm” → “tính” cho khớp phép cộng; hoặc giữ đúng text Cú trong code nếu muốn khớp 100% UI.)*

---

## [voice_level_complete]

**File:** `level_complete.mp3` — key `voice_complete`

```bash
python3 scripts/generate_audio.py tts --text "Tuyệt vời! Bạn đã học được sức mạnh của những con số!" --out src/screens/counting_forest/assets/audio/voice/level_complete.mp3 --force
```

---

## [puzzle]

- **Hiện tại:** `generateNewQuestion()` trong `screen.js` — random `a,b`, tổng ≤ 10, 2 đáp án sai.
- **Tương lai:** có thể chuyển bảng câu hỏi / seed / độ khó sang `puzzle.js` hoặc JSON để designer sửa không đụng scene.

---

## Liên kết menu

Voice mô tả thành phố trên map: `src/screens/menu/assets/audio/voice/city_1_khu_rung_dem_so.mp3` — nên **cùng một cốt truyện** (cầu + số / cộng) với màn chơi thực tế sau khi chỉnh `map.md` / `generate_audio.py` (`MENU_VOICE` trong `scripts/generate_audio.py`).
