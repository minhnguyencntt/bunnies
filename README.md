# 🐰 Bunnies và thế giới tri thức

Game giáo dục offline HTML5 cho trẻ em 4-10 tuổi, được xây dựng bằng Phaser 3.

## 📋 Tổng Quan

"Bunnies và thế giới tri thức" là một game giáo dục phiêu lưu với phong cách hoạt hình đáng yêu, giúp trẻ em học toán học, chữ cái và màu sắc thông qua các thử thách vui nhộn.

### Đặc Điểm

- ✅ **Offline hoàn toàn** - Không cần internet
- ✅ **Không backend** - Chạy 100% trên client
- ✅ **Không lưu state** - Mỗi lần chơi là mới
- ✅ **Responsive** - Hỗ trợ mobile (portrait/landscape) và desktop
- ✅ **Đa input** - Hỗ trợ touch, mouse và keyboard
- ✅ **Cartoon style** - Đẹp, thân thiện, phù hợp trẻ em
- ✅ **Tiếng Việt** - Tất cả text trong game đều bằng tiếng Việt

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
│   ├── GameFlowConfig.js
│   ├── ASSETS_MANIFEST.json
│   ├── screens/
│   │   ├── boot/BootScreen.js
│   │   ├── menu/                 # xem chuẩn “Menu” bên dưới
│   │   ├── counting_forest/
│   │   ├── mirror_city/
│   │   ├── subtraction_hill/
│   │   └── UIScreen.js
│   └── core/                   # nhân vật, hạt, bướm, …
├── scripts/                    # Python: `generate_audio.py` (TTS + BGM), presets trong `scripts/bgm/`
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

### Level 1: Cầu Toán Học

**Mục tiêu**: Trả lời đúng các câu hỏi toán học để sửa cầu.

**Cách chơi**:
1. Đọc câu hỏi hiển thị trên màn hình
2. Kéo thẻ đáp án vào ô trả lời (drop zone)
3. Nếu đúng: Cầu được sửa một phần, Bé Thỏ nhảy cẫng vui mừng
4. Nếu sai: Thẻ rung lắc, Cú Thông Thái đưa ra gợi ý
5. Hoàn thành 3 câu hỏi để vượt qua level

**Câu hỏi mẫu**:
- "2 + 3 = ?"
- "5 - 2 = ?"
- "1 + 4 = ?"

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



