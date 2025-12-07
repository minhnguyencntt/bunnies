# Mirror City Audio Files

Các file âm thanh tiếng Việt cần thiết cho Mirror City screen:

## Voice Files (TTS):

### Intro Dialogues:
1. **intro_1.mp3**
   - Nội dung: "Chào mừng đến Thành Phố Gương! Nơi này từng sáng rực như ngàn vì sao."
   - Độ dài: ~4-5 giây
   - Giọng nói: Thân thiện, dễ hiểu cho trẻ em

2. **intro_2.mp3**
   - Nội dung: "10 tấm gương thiêng đã bị làm mờ bởi phép thuật đen tối."
   - Độ dài: ~3-4 giây
   - Giọng nói: Thân thiện, dễ hiểu cho trẻ em

3. **intro_3.mp3**
   - Nội dung: "Hãy dùng đôi mắt tinh tường để tìm điểm khác biệt và giải cứu ánh sáng!"
   - Độ dài: ~4-5 giây
   - Giọng nói: Thân thiện, dễ hiểu cho trẻ em

### Game Events:
4. **correct_answer.mp3**
   - Nội dung: "Tuyệt vời! Bạn đã tìm đúng điểm khác biệt!"
   - Độ dài: ~2-3 giây
   - Giọng nói: Vui mừng, khích lệ

5. **wrong_answer.mp3**
   - Nội dung: "Chưa đúng, hãy tìm ở chỗ khác! Cố lên!"
   - Độ dài: ~2-3 giây
   - Giọng nói: Động viên, nhẹ nhàng

6. **level_complete.mp3**
   - Nội dung: "Phi thường! Tất cả 10 tấm gương đã sáng rực rỡ! Thành Phố Gương đã được giải cứu!"
   - Độ dài: ~5-6 giây
   - Giọng nói: Vui mừng, phấn khích

## Background Music (BGM):

### level2_bgm.wav
- **Thể loại**: Nhạc nền ma thuật, huyền bí, phù hợp với chủ đề "Thành Phố Gương"
- **Tính chất**: 
  - Mystical, magical atmosphere
  - Có thể có tiếng chuông, tiếng vang như trong cung điện
  - Nhẹ nhàng, không quá ồn ào để không làm phân tâm
  - Có thể loop (lặp lại)
- **Độ dài**: 1-3 phút (sẽ loop)
- **Format**: WAV hoặc MP3
- **Sample rate**: 44100 Hz
- **Bitrate**: 128-192 kbps

## Format:
- **Voice files**: MP3
- **BGM**: WAV hoặc MP3
- **Sample rate**: 44100 Hz hoặc 22050 Hz
- **Bitrate**: 128 kbps hoặc 64 kbps (đủ cho voice), 128-192 kbps (cho BGM)

## Cách tạo:

### Voice Files (Tự động bằng script):
```bash
python scripts/generate_mirror_city_audio.py
```

Script sẽ tự động tạo 6 file voice bằng TTS (Text-to-Speech).

### BGM (Cần tạo thủ công hoặc sử dụng nhạc có sẵn):

#### Cách 1: Sử dụng nhạc miễn phí
- **Freesound.org**: https://freesound.org (tìm "mystical", "magical", "ambient")
- **Incompetech**: https://incompetech.com/music/royalty-free/ (Kevin MacLeod)
- **Pixabay Music**: https://pixabay.com/music/
- **YouTube Audio Library**: https://www.youtube.com/audiolibrary

Từ khóa tìm kiếm: "mystical", "magical", "fantasy", "ambient", "ethereal", "crystal", "mirror"

#### Cách 2: Tạo bằng AI
- **Mubert**: https://mubert.com (AI music generator)
- **AIVA**: https://www.aiva.ai (AI composer)
- **Suno AI**: https://suno.ai (AI music generation)

Prompt gợi ý: "Mystical magical mirror city background music, ambient, ethereal, fantasy, loopable, 2 minutes"

#### Cách 3: Sử dụng công cụ tạo nhạc
- **LMMS**: https://lmms.io (miễn phí, open source)
- **Audacity**: https://www.audacityteam.org (chỉnh sửa audio)
- **GarageBand**: (macOS/iOS)

## Lưu ý:
- Voice files sẽ được load tự động khi MirrorCityScreen khởi tạo
- BGM sẽ phát khi scene bắt đầu và loop liên tục
- Nếu file không tồn tại, hệ thống sẽ bỏ qua (không có lỗi)
- File BGM nên có fade in/out để mượt mà hơn

## ✅ Đã tạo tự động:
Các file voice đã được tạo tự động bằng script Python sử dụng Microsoft Edge TTS:
- ✅ intro_1.mp3
- ✅ intro_2.mp3
- ✅ intro_3.mp3
- ✅ correct_answer.mp3
- ✅ wrong_answer.mp3
- ✅ level_complete.mp3

Để tạo lại hoặc tạo file mới, chạy:
```bash
python scripts/generate_mirror_city_audio.py
```

Xem thêm: `scripts/README_AUDIO.md`

