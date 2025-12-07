# Mirror City Audio - Tổng quan

Thư mục này chứa tất cả các file âm thanh cho màn chơi Thành Phố Gương (Mirror City).

## Cấu trúc thư mục:

```
audio/
├── bgm/
│   └── level2_bgm.wav          # Nhạc nền (cần tạo thủ công)
└── voice/
    ├── intro_1.mp3              # ✅ Đã tạo (TTS)
    ├── intro_2.mp3              # ✅ Đã tạo (TTS)
    ├── intro_3.mp3              # ✅ Đã tạo (TTS)
    ├── correct_answer.mp3       # ✅ Đã tạo (TTS)
    ├── wrong_answer.mp3          # ✅ Đã tạo (TTS)
    ├── level_complete.mp3       # ✅ Đã tạo (TTS)
    └── README.md                 # Chi tiết về voice files
```

## Trạng thái:

### ✅ Voice Files (Hoàn thành):
Tất cả 6 file voice đã được tạo tự động bằng AI TTS (Microsoft Edge TTS):
- `intro_1.mp3` (33KB) - "Chào mừng đến Thành Phố Gương! Nơi này từng sáng rực như ngàn vì sao."
- `intro_2.mp3` (23KB) - "10 tấm gương thiêng đã bị làm mờ bởi phép thuật đen tối."
- `intro_3.mp3` (27KB) - "Hãy dùng đôi mắt tinh tường để tìm điểm khác biệt và giải cứu ánh sáng!"
- `correct_answer.mp3` (24KB) - "Tuyệt vời! Bạn đã tìm đúng điểm khác biệt!"
- `wrong_answer.mp3` (25KB) - "Chưa đúng, hãy tìm ở chỗ khác! Cố lên!"
- `level_complete.mp3` (42KB) - "Phi thường! Tất cả 10 tấm gương đã sáng rực rỡ! Thành Phố Gương đã được giải cứu!"

### ✅ Background Music (Đã tạo):
File `bgm/level2_bgm.wav` đã được tạo tự động bằng Python script (60 giây, mystical ambient music).

**Để tạo lại:** `python scripts/generate_mirror_city_bgm.py`

## Tạo lại Voice Files:

Nếu cần tạo lại các file voice, chạy:

```bash
python scripts/generate_mirror_city_audio.py
```

Script sẽ tự động tạo lại tất cả 6 file voice bằng Microsoft Edge TTS.

## Tạo Background Music:

### Cách 1: Tự động bằng Python (Khuyến nghị - Đã tạo sẵn):

```bash
python scripts/generate_mirror_city_bgm.py
```

Chọn option 1 để tạo BGM tự động bằng numpy/scipy. Script sẽ tạo file `level2_bgm.wav` (60 giây, mystical ambient music).

**Yêu cầu:** `pip install numpy scipy`

### Cách 2: Tạo bằng AI online (Chất lượng tốt hơn):

Xem hướng dẫn chi tiết trong `voice/README.md` phần "Background Music (BGM)".

**Các công cụ AI khuyến nghị:**
1. **MusicCreator AI** (Miễn phí): https://www.musiccreator.ai/
2. **Suno AI**: https://suno.ai
3. **Mubert**: https://mubert.com
4. **AIVA**: https://www.aiva.ai

**Prompt gợi ý:** "Mystical magical mirror city background music, ambient, ethereal, fantasy, instrumental, loopable, 2 minutes"

### Cách 3: Sử dụng nhạc miễn phí:

- Freesound.org
- Incompetech (Kevin MacLeod)
- Pixabay Music
- YouTube Audio Library
- Từ khóa: "mystical", "magical", "fantasy", "ambient", "ethereal", "crystal", "mirror"

## Yêu cầu kỹ thuật:

- **Voice files**: MP3, 44100 Hz, 128 kbps
- **BGM**: WAV hoặc MP3, 44100 Hz, 128-192 kbps
- **BGM nên có**: Fade in/out, loopable, 1-3 phút

## Sử dụng trong game:

Các file audio được load tự động trong `MirrorCityScreen.js`:
- Voice files: Phát khi có dialogue hoặc game events
- BGM: Phát khi scene bắt đầu và loop liên tục

Xem code: `src/screens/mirror_city/MirrorCityScreen.js`

