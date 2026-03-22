# Menu — Bản đồ thế giới (`MenuScreen`)

Scene mở sau Boot: nền **Vườn tri thức**, marker thành phố từ `WORLD_MAP_CITIES`, hover phát mô tả, click vào thành phố có `screenKey` thì vào màn chơi (kèm `city_click`).

---

## Cấu trúc file

| File / thư mục | Vai trò |
|----------------|---------|
| `menu_screen.js` | Scene Phaser, marker, hover, blur, `playCityDescription`, BGM menu |
| `world_map_data.js` | `WORLD_MAP_CITIES`: `id`, `name`, `x`, `y`, `screenKey`, `visible`, … |
| `map.md` | 30 thành phố — tọa độ & mô tả đề (tài liệu thiết kế) |
| `assets/backgrounds/bunnies_world.jpg` | Nền bản đồ |
| `assets/audio/bgm/menu_bgm.wav` | BGM loop menu |
| `assets/audio/voice/` | `city_*`, `city_click` (chỉ load những key có trong `preload`) |

**Lưu ý code:** `playCityDescription` dùng key `voice_city_${city.id}` — chỉ các `id` đã `load.audio` mới phát được (hiện có 1, 2, 4).

---

## [gameplay]

1. Hiển thị ảnh nền, marker cho từng thành phố `visible: true`.
2. **Hover** marker: animation, blur/highlight, gọi `playCityDescription` → phát `voice_city_<id>` nếu có trong cache.
3. **Click** marker có `screenKey`: phát `voice_city_click`, tắt BGM menu, dừng voice mô tả, `scene.start(screenKey)`.
4. `UIScreen` có thể được launch tùy luồng game.

**Prompt thiết kế:** thêm thành phố mới → cập nhật `world_map_data.js`, `map.md`, asset voice, và `preload` trong `menu_screen.js`.

---

## [story]

Cốt truyện tổng thể: **30 vùng** trên một thế giới tri thức; từng marker dẫn tới một chủ đề (đếm, gương, phép trừ, …). Chi tiết từng thành: `map.md`. Đồng bộ **nội dung đọc** voice menu với màn chơi thật (ví dụ city_1 vs Counting Forest đang là phép cộng).

---

## [bg]

**File:** `assets/backgrounds/bunnies_world.jpg`

**Prompt gợi ý:** Bản đồ fantasy thế giới tri thức cho trẻ em, hoạt hình, ~1920×1080, có vùng đặt ~30 điểm marker, không chữ.

---

## [bgm]

**File:** `assets/audio/bgm/menu_bgm.wav`

Chưa có preset trong `screen_bgm_presets.json`. Có thể: WAV thủ công / AI (44100 Hz, loop), hoặc:

```bash
python3 scripts/generate_audio.py bgm --definition scripts/bgm/menu_bgm_preset.example.json
```
*(Tự tạo JSON preset trỏ `output` → `src/screens/menu/assets/audio/bgm/menu_bgm.wav`.)*

---

## [voice_city_1]

| | |
|--|--|
| **Vai trò** | Mô tả thành phố id **1** (Khu rừng đếm số) khi hover. |
| **File** | `assets/audio/voice/city_1_khu_rung_dem_so.mp3` |
| **Phaser key** | `voice_city_1` |

**Nội dung (khớp `MENU_VOICE` / có thể chỉnh cho đồng bộ màn chơi):**

> Khu rừng đếm số. Đếm số lượng vật thể trong rừng để hoàn thành nhiệm vụ. Chủ đề: Đếm số.

```bash
python3 scripts/generate_audio.py tts --text "Khu rừng đếm số. Đếm số lượng vật thể trong rừng để hoàn thành nhiệm vụ. Chủ đề: Đếm số." --out src/screens/menu/assets/audio/voice/city_1_khu_rung_dem_so.mp3 --force
```

---

## [voice_city_2]

| | |
|--|--|
| **Vai trò** | Mô tả thành phố id **2** (Thành phố Gương). |
| **File** | `assets/audio/voice/city_2_thanh_pho_guong.mp3` |
| **Phaser key** | `voice_city_2` |

**Nội dung:**

> Thành phố Gương Kỳ Ảo. Tìm điểm khác nhau giữa hai bức tranh ma thuật. Chủ đề: Tìm điểm khác biệt.

```bash
python3 scripts/generate_audio.py tts --text "Thành phố Gương Kỳ Ảo. Tìm điểm khác nhau giữa hai bức tranh ma thuật. Chủ đề: Tìm điểm khác biệt." --out src/screens/menu/assets/audio/voice/city_2_thanh_pho_guong.mp3 --force
```

---

## [voice_city_4]

| | |
|--|--|
| **Vai trò** | Mô tả thành phố id **4** (Đồi Phép Trừ). |
| **File** | `assets/audio/voice/city_4_doi_phep_tru.mp3` |
| **Phaser key** | `voice_city_4` |

**Nội dung:**

> Đồi Phép Trừ. Tìm kết quả phép trừ để giúp cáo tìm đồ. Chủ đề: Phép trừ.

```bash
python3 scripts/generate_audio.py tts --text "Đồi Phép Trừ. Tìm kết quả phép trừ để giúp cáo tìm đồ. Chủ đề: Phép trừ." --out src/screens/menu/assets/audio/voice/city_4_doi_phep_tru.mp3 --force
```

---

## [voice_city_click]

| | |
|--|--|
| **Vai trò** | Âm thanh khi **chọn** thành phố (bắt đầu vào màn). |
| **File** | `assets/audio/voice/city_click.mp3` |
| **Phaser key** | `voice_city_click` |

**Nội dung gợi ý:** ngắn, vui — ví dụ “Bắt đầu!” (trùng `MENU_VOICE`).

```bash
python3 scripts/generate_audio.py tts --text "Bắt đầu!" --out src/screens/menu/assets/audio/voice/city_click.mp3 --force
```

**Gói cả menu (bỏ qua file đã có, trừ khi `--force`):**

```bash
python3 scripts/generate_audio.py bundle menu
```

---

## [puzzle]

Không có `puzzle.js`. Dữ liệu bản đồ: `world_map_data.js` + `map.md`.

---

## Liên kết

- `map.md` — danh sách & tọa độ 30 thành phố.  
- Thêm city voice mới: thêm `load.audio('voice_city_N', …)` trong `menu_screen.js` + mục `[voice_city_N]` tại đây.
