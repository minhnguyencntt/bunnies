# 🐰 Bunnies và thế giới tri thức

Game phiêu lưu giáo dục offline HTML5 cho trẻ em 3-15 tuổi, xây bằng Phaser 3 trên **Knowledge World Game Engine** (data-driven).

## 📋 Tổng Quan

"Bunnies và thế giới tri thức" là một nền tảng game phiêu lưu giáo dục: trẻ em học toán, quan sát và định hướng không gian thông qua gameplay thật sự (kéo-thả, khám phá, ghi nhớ, giải quyết vấn đề) — không phải trắc nghiệm. Mỗi game có 3 màn (🌱 Nhà Thám Hiểm · ⚔️ Nhà Phiêu Lưu · 👑 Bậc Thầy) với độ khó thích ứng, và mọi hoạt động đều đổ vào hệ thống **Điểm → Sao → Huy hiệu → Sticker → XP → Đá Tri Thức → Tiến trình Thế Giới**.

### Đặc Điểm

- ✅ **Game Engine tái sử dụng** — 13 engine (Level, Difficulty, Adaptive Difficulty, Scoring, Star, Award, Sticker, Reward, XP, Progression, Hint, Analytics, Save) — thêm game mới chủ yếu bằng cấu hình
- ✅ **3 màn chơi mỗi game** với độ khó khác biệt thật sự (số vật, số lựa chọn, giới hạn giờ, tải trí nhớ, độ tinh vi…)
- ✅ **Độ khó thích ứng** trong từng màn theo hiệu suất của trẻ
- ✅ **Bunnine tham gia gameplay** — chạy đường, thu hoạch, phản hồi cảm xúc
- ✅ **Album Sticker + Huy hiệu + XP + Đá Tri Thức** lưu bền (localStorage)
- ✅ **Offline hoàn toàn** - Không cần internet, **PWA** cài như app thật
- ✅ **Responsive** - Mobile (portrait/landscape) và desktop; touch, mouse, keyboard
- ✅ **Tiếng Việt** - Tất cả text trong game đều bằng tiếng Việt

### Tài liệu thiết kế

- [docs/GAME_AUDIT.md](docs/GAME_AUDIT.md) — đánh giá game hiện có (Phase 1)
- [docs/GAME_REDESIGN.md](docs/GAME_REDESIGN.md) — thiết kế lại từng game 26 mục (Phase 2)
- [docs/GAME_ENGINE.md](docs/GAME_ENGINE.md) — kiến trúc Game Engine (Phase 3)
- [docs/UI_UX_REDESIGN.md](docs/UI_UX_REDESIGN.md) — hệ thống màn hình UI/UX (Phase 4)
- [docs/AUDIO_DESIGN.md](docs/AUDIO_DESIGN.md) — hệ thống âm thanh hoàn chỉnh (voice, nhạc động, SFX, ambience)

### Hệ thống âm thanh

- ✅ **Voice hướng dẫn theo ngữ cảnh** — 63 câu thoại tiếng Việt tạo bằng edge-tts (theo màn/độ tuổi), fallback Web Speech, đa ngôn ngữ sẵn sàng
- ✅ **Nhạc nền động** — chủ đề riêng mỗi khu vực + lớp cường độ (khám phá → chơi → thử thách → chiến thắng)
- ✅ **SFX tổng hợp** (Web Audio, không cần file) — mọi tương tác đều có âm thanh, có biến tấu chống nhàm
- ✅ **Ambience thủ tục** — gió, chim, chuông… theo từng thế giới
- ✅ **Voice ducking + ưu tiên + cooldown** — giọng nói luôn rõ, không bao giờ ồn
- ✅ **Cài đặt âm thanh** — 5 thanh trượt + bật/tắt, lưu bền
- ✅ **Đếm số bằng giọng nói** đồng bộ với thao tác thu thập (giáo dục)

---

## 📲 Cài Đặt Như Ứng Dụng (PWA)

Game là một **Progressive Web App** — mở bằng trình duyệt rồi cài lên màn hình chính để chơi như app thật (fullscreen, có icon riêng, không cần internet sau lần tải đầu).

### Android (Chrome/Edge)
1. Mở link game bằng Chrome
2. Bấm menu **⋮** (góc phải trên) → **Cài đặt ứng dụng** / **Add to Home screen**
3. Icon 🐰 xuất hiện trên màn hình chính — bấm để mở như app

### iPhone/iPad (Safari)
1. Mở link game bằng Safari
2. Bấm nút **Chia sẻ** (Share) → **Thêm vào Màn hình chính** (Add to Home Screen)
3. Icon 🐰 xuất hiện trên màn hình chính

### Máy tính (Chrome/Edge)
1. Mở link game
2. Bấm biểu tượng **cài đặt** (⊕ với màn hình) trên thanh địa chỉ, hoặc menu → **Cài đặt Bunnies...**
3. Game mở trong cửa sổ riêng như ứng dụng desktop

> 💡 Lần đầu cần internet để tải game. Sau đó các màn đã chơi sẽ chạy được **hoàn toàn offline**.

---

## 🚀 Cách Chạy Game

### Phương Pháp 1: Sử dụng npx serve (Khuyến nghị)

1. Mở terminal/command prompt
2. Di chuyển đến thư mục project:
   ```bash
   cd path/to/bunnies
   ```
3. Chạy local server:
   ```bash
   npx serve .
   ```
4. Mở trình duyệt và truy cập địa chỉ hiển thị (thường là `http://localhost:3000`)

### Phương Pháp 2: Sử dụng VSCode Live Server

1. Mở project trong VSCode
2. Cài đặt extension "Live Server" (nếu chưa có)
3. Click chuột phải vào file `index.html`
4. Chọn "Open with Live Server"

### Phương Pháp 3: Sử dụng Python HTTP Server

1. Mở terminal/command prompt
2. Di chuyển đến thư mục project
3. Chạy server:
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Python 2
   python -m SimpleHTTPServer 8000
   ```
4. Mở trình duyệt và truy cập `http://localhost:8000`

### Phương Pháp 4: Sử dụng Node.js http-server

1. Cài đặt http-server (nếu chưa có):
   ```bash
   npm install -g http-server
   ```
2. Chạy server:
   ```bash
   http-server .
   ```
3. Mở trình duyệt và truy cập địa chỉ hiển thị

---

## 📁 Cấu trúc dự án (thực tế)

Entry game nằm dưới `src/` (Phaser 3):

```
bunnies/
├── src/
│   ├── index.html
│   ├── game.js
│   ├── GameFlowConfig.js        # legacy flow (xem core/engine/GameConfig.js)
│   ├── ASSETS_MANIFEST.json
│   ├── core/
│   │   ├── audio/               # Hệ thống âm thanh: AudioEngine, SFX, Music, Voice, Ambience
│   │   │   ├── assets/voice/    # 63 câu thoại vi-VN (edge-tts) · assets/bgm/ chủ đề thưởng
│   │   ├── engine/              # Knowledge World Game Engine (13 engine, data-driven)
│   │   │   ├── GameConfig.js    # định nghĩa game × 3 màn: difficulty/scoring/reward/hint/award/sticker
│   │   │   ├── SaveEngine.js · AnalyticsEngine.js · ScoringEngine.js · StarEngine.js
│   │   │   ├── AdaptiveDifficultyEngine.js · XPEngine.js · AwardEngine.js
│   │   │   ├── StickerEngine.js · RewardEngine.js · ProgressionEngine.js · HintEngine.js
│   │   ├── game/                # framework dùng chung
│   │   │   ├── GameShell.js     # scene gốc: HUD, pause, hint, timer, Bunnine, luồng màn
│   │   │   ├── ResultScreen.js · LevelSelectScreen.js · StickerAlbumScreen.js
│   │   └── characters/          # Bunnine, Cú, Cáo, Sóc, bướm, …
│   ├── screens/
│   │   ├── boot/BootScreen.js
│   │   ├── menu/                # bản đồ Thế Giới Tri Thức + HUD tiến trình
│   │   ├── counting_forest/     # Khu Rừng Đếm Số — phép cộng (3 màn)
│   │   ├── mirror_city/         # Thành Phố Gương — tìm điểm khác biệt (3 màn)
│   │   ├── subtraction_hill/    # Đồi Phép Trừ — phép trừ (3 màn)
│   │   └── orientation_forest/  # Khu Rừng Định Hướng — trái/phải/trước/sau (3 màn)
│   └── sw.js                    # PWA offline
├── scripts/                     # Python: `generate_audio.py` (TTS + BGM)
├── docs/                        # tài liệu thiết kế Phase 1–4
└── README.md
```

---

## 🗺️ Chuẩn thư mục Menu (`src/screens/menu/`)

Mỗi phần tài nguyên và file nguồn theo một chỗ cố định; âm thanh nên tạo qua script trong `scripts/` (xem `scripts/README_AUDIO.md`).

```
menu/
├── menu_screen.js              # Scene Phaser MenuScreen
├── world_map_data.js           # WORLD_MAP_CITIES → screenKey
├── map.md                      # 30 thành phố: tọa độ, mô tả đề
├── story.md                    # Session / prompt theo từng loại asset
└── assets/
    ├── backgrounds/
    │   └── bunnies_world.jpg
    └── audio/
        ├── bgm/
        │   └── menu_bgm.wav    # (spec gốc: .mp3 — repo dùng WAV)
        └── voice/
            ├── city_1_….mp3, city_2_….mp3, city_4_….mp3, …
            └── city_click.mp3
```

---

## 🎮 Chuẩn thư mục từng màn chơi (`src/screens/<tên_màn>/`)

Ví dụ: `counting_forest`, `mirror_city`, `subtraction_hill`. Thêm màn mới: nhân bản cấu trúc này, đăng ký scene trong `src/index.html` và `src/game.js`.

```
<tên_màn>/
├── screen.js                   # Scene Phaser (preload/load đường dẫn bên dưới)
├── puzzle.js                   # Dữ liệu / config câu đố (global const)
├── story.md                    # Kịch bản & prompt theo session (chi tiết từng màn)
└── assets/
    ├── backgrounds/
    │   └── bg.png
    └── audio/
        ├── bgm/
        │   └── bgm.wav         # Subtraction Hill thêm bgm_celebration.wav nếu cần
        └── voice/
            ├── correct_answer.mp3
            ├── wrong_answer.mp3
            ├── level_complete.mp3
            ├── intro_1.mp3
            ├── intro_2.mp3
            └── intro_3.mp3
```

### Nội dung gợi ý trong `story.md` (session / prompt)

Mỗi màn nên có các mục tương ứng prompt thiết kế — **ưu tiên `scripts/generate_audio.py`** (`tts`, `bundle`, `bgm`):

| Mục | Mục đích |
|-----|----------|
| `[gameplay]` | Prompt mô tả luồng chơi |
| `[bg]` | Prompt tạo `bg.png` |
| `[bgm]` | `python3 scripts/generate_audio.py bgm <preset>` hoặc `bgm --definition …` |
| `[voice_*]` | `generate_audio.py tts --text "<prompt>" --out …/correct_answer.mp3` (và tương tự intro_1…3, wrong, level_complete) |
| `[puzzle]` | Prompt / spec tạo hoặc mở rộng `puzzle.js` |
| `[story]` | Tóm tắt cốt truyện, liên kết `map.md` / menu |

Chi tiết và lệnh cụ thể từng màn: `src/screens/<màn>/story.md`.

---

## 🎮 Gameplay

Mỗi game giữ nguyên tên và mục tiêu giáo dục gốc, với 3 màn chơi:

| Game | Mục tiêu | Màn 1 🌱 | Màn 2 ⚔️ | Màn 3 👑 |
|---|---|---|---|---|
| 🌲 Khu Rừng Đếm Số | Phép cộng | Thu Hoạch Táo — kéo 2 nhóm táo vào giỏ Bunnine | Đường Pha Lê — chọn con đường có tổng đúng | Nhiệm Vụ Pha Lê — bài toán nhiều bước a − b + c |
| ⛰️ Đồi Phép Trừ | Phép trừ | Táo Lăn Đồi — nhặt phần còn lại sau khi vật lăn đi | Giỏ Quà Của Cáo — xếp đúng số vào giỏ rồi đếm phần dư | Hành Trình Của Cáo — bài toán nhiều bước a − b ± c |
| 🪞 Thành Phố Gương | Quan sát | 1 điểm khác rõ, không giờ | 3 điểm khác, giờ nhẹ, combo | 5 điểm khác tinh vi (màu/hướng/vị trí/họa tiết), thử thách giờ |
| 🌳 Khu Rừng Định Hướng | Trái/phải/trước/sau | 2 mũi tên lớn, không giờ | 4 hướng, giờ nhẹ | Dẫn Đường Cho Sóc — ghi nhớ & lặp lại trình tự hướng |
| 🍭 Vườn Kẹo Ngọt | Phép cộng | Kẹo Ngọt Đầu Tiên — gộp 2 nhóm kẹo, 3 lựa chọn (tổng ≤ 5) | Tiệc Kẹo Ngọt — tổng ≤ 8, giờ nhẹ | Đại Tiệc Kẹo — tổng ≤ 10, giờ + combo |
| 🌳 Rừng Diệu Kỳ *(mở khi xong Vườn Kẹo Màn 1)* | Phép trừ | Nấm Trong Rừng — vật bay đi, đếm phần còn (≤ 5) | Đom Đóm Bay — ≤ 8, giờ nhẹ | Đêm Trong Rừng — ≤ 10, giờ + combo |

**Hai world mới** dùng gameplay trắc nghiệm trực quan: vật thể hiện ra → gộp/bớt bằng hoạt ảnh → phép tính hiện → 3 nút đáp án lớn. Sai 2 lần → hệ thống **hướng dẫn từng bước** (đếm bằng giọng nói + tô sáng đáp án đúng) — học mà không bao giờ thấy thất bại.

**Vòng đời phần thưởng**: Chơi → Điểm (0–100) → ⭐/⭐⭐/⭐⭐⭐ → XP (lên Cấp Tri Thức) → Huy hiệu → Sticker (Album) → 💎 Đá Tri Thức → Tiến trình trên bản đồ thế giới (🥉🥈🥇 theo sao mỗi thành phố).

---

## 🎨 Thay Thế Placeholder Assets

Hiện tại game sử dụng placeholder graphics (hình vẽ đơn giản). Để thay thế bằng assets thật:

### 1. Backgrounds

1. Tạo file ảnh theo spec trong `ASSETS_MANIFEST.json`
2. Đặt file vào `assets/backgrounds/`
3. Cập nhật đường dẫn trong `BootScene.js`:
   ```javascript
   this.load.image('bg_forest_level1', 'assets/backgrounds/forest_level1.png');
   ```

### 2. Character Sprites

1. Tạo sprite sheets theo spec trong `UI_UX_DESIGN.md`
2. Đặt file vào `assets/characters/`
3. Load trong scene:
   ```javascript
   this.load.spritesheet('bunny_idle', 'assets/characters/bunny_idle.png', {
       frameWidth: 512,
       frameHeight: 512
   });
   ```
4. Tạo animation:
   ```javascript
   this.anims.create({
       key: 'bunny_idle',
       frames: this.anims.generateFrameNumbers('bunny_idle', { start: 0, end: 11 }),
       frameRate: 8,
       repeat: -1
   });
   ```

### 3. UI Elements

1. Tạo UI assets theo spec
2. Đặt file vào `assets/ui/`
3. Load và sử dụng tương tự backgrounds

### 4. Audio

1. Tạo file audio theo spec trong `SOUND_ANIMATION_DESIGN.md`
2. Đặt file vào `assets/audio/music/` hoặc `assets/audio/sfx/`
3. Load trong scene:
   ```javascript
   this.load.audio('music_level1', 'assets/audio/music/level1.mp3');
   ```
4. Phát nhạc:
   ```javascript
   this.sound.play('music_level1', { loop: true, volume: 0.5 });
   ```

---

## 🔧 Mở Rộng Thêm Levels

Để thêm Level 2, 3, 4:

### 1. Tạo Scene Mới

Tạo file `scenes/Level2Scene.js`:

```javascript
class Level2Scene extends Phaser.Scene {
    constructor() {
        super({ key: 'Level2Scene' });
    }

    create() {
        // Implement Level 2 gameplay
        // Xem Level1Scene.js để tham khảo
    }
}
```

### 2. Đăng Ký Scene

Thêm vào `game.js`:

```javascript
scene: [
    BootScene,
    MenuScene,
    Level1Scene,
    Level2Scene,  // Thêm mới
    UIScene
]
```

### 3. Load Assets

Thêm assets vào `BootScene.js`:

```javascript
this.load.image('bg_forest_level2', 'assets/backgrounds/forest_level2.png');
```

### 4. Thêm Button Menu

Cập nhật `MenuScene.js` để thêm button chọn level.

---

## 🎯 Yêu Cầu Kỹ Thuật

### Trình Duyệt Hỗ Trợ

- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+
- Mobile browsers (iOS Safari, Chrome Mobile)

### Phaser Version

- Phaser 3.70.0 (hoặc mới hơn)

### Performance

- Target: 60 FPS
- Canvas size: 800x600 (desktop), responsive (mobile)
- Asset optimization: Sử dụng WebP cho backgrounds, PNG cho sprites

---

## 📝 Ghi Chú Phát Triển

### Placeholder Assets

Hiện tại game sử dụng placeholder graphics được tạo bằng Phaser Graphics API. Để có game hoàn chỉnh, cần thay thế bằng:

- Background images (PNG/WebP)
- Character sprite sheets (PNG)
- UI elements (PNG/SVG)
- Audio files (MP3/OGG)

### Code Comments

Tất cả code đều có comments tiếng Việt để dễ hiểu và maintain.

### Responsive Design

Game tự động scale để phù hợp với mọi kích thước màn hình. Sử dụng `Phaser.Scale.FIT` để đảm bảo tỷ lệ đúng.

---

## 🐛 Troubleshooting

### Game không load

- Kiểm tra console để xem lỗi
- Đảm bảo đang chạy qua HTTP server (không phải file://)
- Kiểm tra đường dẫn assets

### Assets không hiển thị

- Kiểm tra đường dẫn file
- Đảm bảo file tồn tại
- Kiểm tra format file (PNG, MP3, etc.)

### Performance chậm

- Giảm số lượng particles
- Tối ưu hóa kích thước assets
- Sử dụng WebP thay vì PNG cho backgrounds

### Touch không hoạt động trên mobile

- Đảm bảo viewport meta tag đúng
- Kiểm tra `input.activePointers` trong config
- Test trên thiết bị thật

---

## 📚 Tài Liệu Tham Khảo

- [Phaser 3 Documentation](https://photonstorm.github.io/phaser3-docs/)
- [Phaser 3 Examples](https://labs.phaser.io/)
- [Game Design Documents](./DIALOGUE_SCRIPT.md)
- [UI/UX Design](./UI_UX_DESIGN.md)
- [Assets Manifest](./ASSETS_MANIFEST.json)
- [Sound & Animation Design](./SOUND_ANIMATION_DESIGN.md)

---

## 🎨 Art Style Guidelines

Tất cả assets phải tuân theo:

- **Cartoon style**: Cute, friendly, expressive
- **Colors**: Pastel, bright, vibrant
- **Shapes**: Rounded, soft, no sharp edges
- **Shadows**: Soft, subtle
- **Lighting**: Fantasy, glowing effects
- **Proportions**: Chibi style (big head, small body)

Xem chi tiết trong `UI_UX_DESIGN.md`.

---

## 🔊 Audio Guidelines

Tất cả audio phải:

- **Child-friendly**: Không harsh, không scary
- **Volume**: Phù hợp, không quá to
- **Tone**: Positive, encouraging
- **Format**: MP3 hoặc OGG

Xem chi tiết trong `SOUND_ANIMATION_DESIGN.md`.

---

## 📄 License

Project này được tạo cho mục đích giáo dục. Tự do sử dụng và chỉnh sửa.

---

## 👥 Credits

- **Game Engine**: Phaser 3
- **Design**: Cartoon style, child-friendly
- **Language**: Vietnamese
- **Target Audience**: Children 4-10 years old

---

## 🔄 Changelog

### Version 1.0.0
- ✅ Level 1: Cầu Toán Học (fully implemented)
- ✅ Menu scene
- ✅ UI overlay
- ✅ Drag & drop gameplay
- ✅ Particle effects
- ✅ Responsive design
- ✅ Touch + mouse + keyboard support
- 📝 Placeholder assets (cần thay thế)

---

## 📧 Liên Hệ & Hỗ Trợ

Nếu có câu hỏi hoặc gặp vấn đề, vui lòng kiểm tra:
1. Console errors
2. Network tab (để xem assets có load không)
3. Documentation files

---

**Chúc bạn phát triển game vui vẻ! 🎮✨**



