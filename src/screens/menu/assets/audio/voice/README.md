# Menu Screen Audio Files

Các file âm thanh tiếng Việt cần thiết cho menu screen:

## File cần tạo:

1. **city_1_khu_rung_dem_so.mp3**
   - Nội dung: "Khu rừng đếm số. Đếm số lượng vật thể trong rừng để hoàn thành nhiệm vụ. Chủ đề: Đếm số."
   - Độ dài: ~5-7 giây
   - Giọng nói: Thân thiện, dễ hiểu cho trẻ em

2. **city_2_thanh_pho_guong.mp3**
   - Nội dung: "Thành phố Gương Kỳ Ảo. Tìm điểm khác nhau giữa hai bức tranh ma thuật. Chủ đề: Tìm điểm khác biệt."
   - Độ dài: ~6-8 giây
   - Giọng nói: Thân thiện, dễ hiểu cho trẻ em

3. **city_click.mp3**
   - Nội dung: Âm thanh khi click vào marker (ví dụ: "Bắt đầu!", "Đi thôi!", hoặc sound effect vui nhộn)
   - Độ dài: ~1-2 giây
   - Giọng nói hoặc sound effect: Vui nhộn, kích thích

## Format:
- File format: MP3
- Sample rate: 44100 Hz hoặc 22050 Hz
- Bitrate: 128 kbps hoặc 64 kbps (đủ cho voice)

## Cách tạo:
1. Sử dụng text-to-speech (TTS) với giọng tiếng Việt
2. Hoặc thu âm với người nói tiếng Việt
3. Export thành MP3 với format trên

## Lưu ý:
- File sẽ được load tự động khi MenuScreen khởi tạo
- Nếu file không tồn tại, hệ thống sẽ fallback về Web Speech API
- File sẽ phát khi hover vào marker tương ứng

## ✅ Đã tạo tự động:
Các file đã được tạo tự động bằng script Python sử dụng Microsoft Edge TTS:
- ✅ city_1_khu_rung_dem_so.mp3 (47KB)
- ✅ city_2_thanh_pho_guong.mp3 (47KB)
- ✅ city_click.mp3 (8.3KB)

Để tạo lại hoặc tạo file mới, chạy:
```bash
python scripts/generate_menu_audio.py
```

Xem thêm: `scripts/README_AUDIO.md`

