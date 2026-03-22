# Hướng dẫn tạo file âm thanh cho Game

Cấu trúc thư mục menu / màn chơi và `story.md`: xem **README.md** (mục chuẩn thư mục Menu & từng màn chơi).

## Menu Screen Audio

### Cách 1: Sử dụng script Python (Tự động)

#### Bước 1: Cài đặt thư viện

```bash
# Cài đặt Edge TTS (khuyến nghị)
pip install edge-tts

# Hoặc Google TTS
pip install gtts pydub
```

#### Bước 2: Chạy script

```bash
python3 scripts/generate_audio.py bundle menu
# Ghi đè file cũ: thêm --force
```

Script sẽ tự động tạo các file (bỏ qua file đã tồn tại):
- `city_1_khu_rung_dem_so.mp3`
- `city_2_thanh_pho_guong.mp3`
- `city_4_doi_phep_tru.mp3`
- `city_click.mp3`

## BGM màn hình (một pipeline cho mọi screen)

Engine: `scripts/bgm/layered_engine.py` (numpy/scipy — bass, hợp âm, giai điệu, sparkle, pad).  
Cấu hình: `scripts/bgm/screen_bgm_presets.json` (thêm preset mới = thêm object trong `presets`).

```bash
pip install numpy scipy
python3 scripts/generate_audio.py bgm --list
python3 scripts/generate_audio.py bgm all
python3 scripts/generate_audio.py bgm mirror_city_level2
```

Một màn chơi mới **chỉ cần JSON** (không sửa Python):

```bash
python3 scripts/generate_audio.py bgm --definition path/to/my_screen_bgm.json
```

**TTS một dòng (prompt = nội dung đọc):**

```bash
python3 scripts/generate_audio.py tts --text "Câu thoại" --out src/screens/.../voice/foo.mp3
python3 scripts/generate_audio.py tts --prompt-file kich_ban.txt --out .../intro_1.mp3 --force
```

## Mirror City Screen Audio

### Voice Files (Tự động bằng script):

```bash
python3 scripts/generate_audio.py bundle mirror-city
```

Script sẽ tự động tạo 6 file voice:
- `intro_1.mp3` - "Chào mừng đến Thành Phố Gương! Nơi này từng sáng rực như ngàn vì sao."
- `intro_2.mp3` - "10 tấm gương thiêng đã bị làm mờ bởi phép thuật đen tối."
- `intro_3.mp3` - "Hãy dùng đôi mắt tinh tường để tìm điểm khác biệt và giải cứu ánh sáng!"
- `correct_answer.mp3` - "Tuyệt vời! Bạn đã tìm đúng điểm khác biệt!"
- `wrong_answer.mp3` - "Chưa đúng, hãy tìm ở chỗ khác! Cố lên!"
- `level_complete.mp3` - "Phi thường! Tất cả 10 tấm gương đã sáng rực rỡ! Thành Phố Gương đã được giải cứu!"

### Background Music (BGM):

Xem mục **BGM màn hình** ở trên (`generate_audio.py bgm`). Thay BGM bằng file tải từ AI/Freesound: export WAV 44100 Hz, đặt đúng đường dẫn trong `preload` của scene.

## Cách 2: Sử dụng công cụ online

### Narakeet (Miễn phí 20 file đầu)
1. Truy cập: https://www.narakeet.com/create/vn-trinh-tao-giong-noi-ai.html
2. Nhập nội dung văn bản
3. Chọn giọng nói tiếng Việt
4. Tải file MP3 về
5. Đổi tên và đặt vào `src/screens/menu/assets/audio/voice/`

### Viettel AI
1. Truy cập: https://viettelai.vn
2. Sử dụng công cụ Text-to-Speech
3. Tải file về và đặt vào thư mục

## Nội dung các file cần tạo

### 1. city_1_khu_rung_dem_so.mp3
```
"Khu rừng đếm số. Đếm số lượng vật thể trong rừng để hoàn thành nhiệm vụ. Chủ đề: Đếm số."
```

### 2. city_2_thanh_pho_guong.mp3
```
"Thành phố Gương Kỳ Ảo. Tìm điểm khác nhau giữa hai bức tranh ma thuật. Chủ đề: Tìm điểm khác biệt."
```

### 3. city_4_doi_phep_tru.mp3
```
"Đồi Phép Trừ. Tìm kết quả phép trừ để giúp cáo tìm đồ. Chủ đề: Phép trừ."
```

### 4. city_click.mp3
```
"Bắt đầu!"
```
Hoặc có thể dùng sound effect vui nhộn.

## Lưu ý

- File format: MP3
- Sample rate: 44100 Hz hoặc 22050 Hz
- Bitrate: 128 kbps hoặc 64 kbps
- Giọng nói: Thân thiện, dễ hiểu cho trẻ em

