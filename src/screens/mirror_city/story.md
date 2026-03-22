# Mirror City — Thành phố Gương (`MirrorCityScreen`)

Tìm điểm khác biệt giữa **ảnh gốc** và **ảnh phản chiếu**; **10 gương** / session, dữ liệu từ `MIRROR_PUZZLES` (chọn bộ 10 qua `selectMirrorPuzzles()` nếu có).

---

## Cấu trúc file

| File / thư mục | Vai trò |
|----------------|---------|
| `screen.js` | Scene: gallery 10 gương, challenge view, Cú, BGM, thoại, đối chiếu ảnh |
| `puzzle.js` | `MIRROR_PUZZLES` + (nếu có) `selectMirrorPuzzles` |
| `assets/backgrounds/bg.png` | Nền (fallback graphics nếu thiếu ảnh) |
| `assets/audio/bgm/bgm.wav` | BGM loop |
| `assets/audio/voice/` | `intro_1..3`, `correct_answer`, `wrong_answer`, `level_complete` |

---

## [gameplay] — đúng với `screen.js`

1. **Khởi tạo:** BGM, nền, **10 puzzle ngẫu nhiên** từ pool, **10 gương** dạng gallery, Cú Thông Thái, `UIScreen`, intro 3 đoạn.
2. **Intro:** `voice_intro_1` → `voice_intro_2` → `voice_intro_3` (bubble trùng nội dung các mục **[voice_intro_***]**).
3. **Chơi:** Chọn gương → vào view so sánh hai ảnh; click vùng đúng theo puzzle (`difference.location` / logic trong scene). Đúng → `voice_correct`, gương “sáng”, tiến độ +1. Sai → `voice_wrong`.
4. **Hết 10 gương:** `voice_complete` + luồng kết / chuyển màn (theo code hiện tại).

**Prompt thiết kế:** độ khó puzzle, giới hạn hint (`hintsRemaining` trong code), transition về menu hay màn tiếp theo.

---

## [story] — thoại đồng bộ TTS

**Intro:** thứ tự `intro_1` → `intro_2` → `intro_3` — chi tiết từng file ở dưới.

**Đúng / sai / xong:** nội dung đọc nên khớp `correct_answer` / `wrong_answer` / `level_complete` (và có thể khớp bubble Cú nếu có).

Nội dung mặc định cũng nằm trong `MIRROR_VOICE` (`scripts/generate_audio.py`) và lệnh `bundle mirror-city`.

---

## [bg]

**File:** `assets/backgrounds/bg.png`

**Prompt gợi ý:** Thành phố gương / pha lê / đêm sao, phong cách hoạt hình thân thiện trẻ em, không chữ.

---

## [bgm]

```bash
python3 scripts/generate_audio.py bgm mirror_city_level2
```

Preset: `scripts/bgm/screen_bgm_presets.json` → `mirror_city_level2`.

---

## [voice_intro_1]

| | |
|--|--|
| **Vai trò** | Chào mừng, giới thiệu Thành Phố Gương. |
| **File** | `assets/audio/voice/intro_1.mp3` |
| **Key** | `voice_intro_1` |
| **Bubble (code)** | ~4000 ms |

**Nội dung:**

> Chào mừng đến Thành Phố Gương! Nơi này từng sáng rực như ngàn vì sao.

```bash
python3 scripts/generate_audio.py tts --text "Chào mừng đến Thành Phố Gương! Nơi này từng sáng rực như ngàn vì sao." --out src/screens/mirror_city/assets/audio/voice/intro_1.mp3 --force
```

---

## [voice_intro_2]

| | |
|--|--|
| **Vai trò** | Nêu nhiệm vụ: 10 gương bị làm mờ. |
| **File** | `assets/audio/voice/intro_2.mp3` |
| **Key** | `voice_intro_2` |
| **Bubble (code)** | ~3500 ms |

**Nội dung:**

> 10 tấm gương thiêng đã bị làm mờ bởi phép thuật đen tối.

```bash
python3 scripts/generate_audio.py tts --text "10 tấm gương thiêng đã bị làm mờ bởi phép thuật đen tối." --out src/screens/mirror_city/assets/audio/voice/intro_2.mp3 --force
```

---

## [voice_intro_3]

| | |
|--|--|
| **Vai trò** | Hướng dẫn: tìm điểm khác biệt. |
| **File** | `assets/audio/voice/intro_3.mp3` |
| **Key** | `voice_intro_3` |
| **Bubble (code)** | ~4500 ms |

**Nội dung:**

> Hãy dùng đôi mắt tinh tường để tìm điểm khác biệt và giải cứu ánh sáng!

```bash
python3 scripts/generate_audio.py tts --text "Hãy dùng đôi mắt tinh tường để tìm điểm khác biệt và giải cứu ánh sáng!" --out src/screens/mirror_city/assets/audio/voice/intro_3.mp3 --force
```

---

## [voice_correct_answer]

**File:** `correct_answer.mp3` — key `voice_correct`

**Nội dung:**

> Tuyệt vời! Bạn đã tìm đúng điểm khác biệt!

```bash
python3 scripts/generate_audio.py tts --text "Tuyệt vời! Bạn đã tìm đúng điểm khác biệt!" --out src/screens/mirror_city/assets/audio/voice/correct_answer.mp3 --force
```

---

## [voice_wrong_answer]

**File:** `wrong_answer.mp3` — key `voice_wrong`

**Nội dung:**

> Chưa đúng, hãy tìm ở chỗ khác! Cố lên!

```bash
python3 scripts/generate_audio.py tts --text "Chưa đúng, hãy tìm ở chỗ khác! Cố lên!" --out src/screens/mirror_city/assets/audio/voice/wrong_answer.mp3 --force
```

---

## [voice_level_complete]

**File:** `level_complete.mp3` — key `voice_complete`

**Nội dung:**

> Phi thường! Tất cả 10 tấm gương đã sáng rực rỡ! Thành Phố Gương đã được giải cứu!

```bash
python3 scripts/generate_audio.py tts --text "Phi thường! Tất cả 10 tấm gương đã sáng rực rỡ! Thành Phố Gương đã được giải cứu!" --out src/screens/mirror_city/assets/audio/voice/level_complete.mp3 --force
```

**Tạo cả 6 file voice:**

```bash
python3 scripts/generate_audio.py bundle mirror-city --force
```

---

## [puzzle]

**File:** `puzzle.js` — mảng `MIRROR_PUZZLES` (id, category, `difference`: type, hint, location, …). Thêm puzzle = thêm object; có thể bổ sung `selectMirrorPuzzles()` để lọc độ khó.

---

## Liên kết menu

`src/screens/menu/map.md` mục (2), voice hover `city_2_*`; đồng bộ chủ đề với màn Mirror City.
