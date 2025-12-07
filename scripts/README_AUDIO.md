# Hướng dẫn tạo file âm thanh cho Game

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
python scripts/generate_menu_audio.py
```

Script sẽ tự động tạo 3 file:
- `city_1_khu_rung_dem_so.mp3`
- `city_2_thanh_pho_guong.mp3`
- `city_click.mp3`

## Mirror City Screen Audio

### Voice Files (Tự động bằng script):

```bash
python scripts/generate_mirror_city_audio.py
```

Script sẽ tự động tạo 6 file voice:
- `intro_1.mp3` - "Chào mừng đến Thành Phố Gương! Nơi này từng sáng rực như ngàn vì sao."
- `intro_2.mp3` - "10 tấm gương thiêng đã bị làm mờ bởi phép thuật đen tối."
- `intro_3.mp3` - "Hãy dùng đôi mắt tinh tường để tìm điểm khác biệt và giải cứu ánh sáng!"
- `correct_answer.mp3` - "Tuyệt vời! Bạn đã tìm đúng điểm khác biệt!"
- `wrong_answer.mp3` - "Chưa đúng, hãy tìm ở chỗ khác! Cố lên!"
- `level_complete.mp3` - "Phi thường! Tất cả 10 tấm gương đã sáng rực rỡ! Thành Phố Gương đã được giải cứu!"

### Background Music (BGM):

BGM cần tạo thủ công. Xem hướng dẫn chi tiết trong:
- `src/screens/mirror_city/assets/audio/voice/README.md`

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

### 3. city_click.mp3
```
"Bắt đầu!"
```
Hoặc có thể dùng sound effect vui nhộn.

## Lưu ý

- File format: MP3
- Sample rate: 44100 Hz hoặc 22050 Hz
- Bitrate: 128 kbps hoặc 64 kbps
- Giọng nói: Thân thiện, dễ hiểu cho trẻ em

