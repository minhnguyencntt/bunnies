#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script để tạo file âm thanh tiếng Việt cho Mirror City screen sử dụng TTS
Cần cài đặt: pip install edge-tts
Hoặc: pip install gtts pydub
"""

import os
import sys
from pathlib import Path

# Fix encoding for Windows
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

# Thêm thư mục gốc vào path
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

def generate_with_gtts():
    """Sử dụng Google Text-to-Speech (gTTS)"""
    try:
        from gtts import gTTS
        from pydub import AudioSegment
        
        # Nội dung các file audio cho Mirror City
        audio_content = {
            # Intro dialogues
            'intro_1.mp3': 'Chào mừng đến Thành Phố Gương! Nơi này từng sáng rực như ngàn vì sao.',
            'intro_2.mp3': '10 tấm gương thiêng đã bị làm mờ bởi phép thuật đen tối.',
            'intro_3.mp3': 'Hãy dùng đôi mắt tinh tường để tìm điểm khác biệt và giải cứu ánh sáng!',
            
            # Game events
            'correct_answer.mp3': 'Tuyệt vời! Bạn đã tìm đúng điểm khác biệt!',
            'wrong_answer.mp3': 'Chưa đúng, hãy tìm ở chỗ khác! Cố lên!',
            'level_complete.mp3': 'Phi thường! Tất cả 10 tấm gương đã sáng rực rỡ! Thành Phố Gương đã được giải cứu!'
        }
        
        output_dir = project_root / 'src' / 'screens' / 'mirror_city' / 'assets' / 'audio' / 'voice'
        output_dir.mkdir(parents=True, exist_ok=True)
        
        print("Đang tạo file âm thanh bằng Google TTS...")
        
        for filename, text in audio_content.items():
            output_path = output_dir / filename
            
            if output_path.exists():
                print(f"⚠️  File {filename} đã tồn tại, bỏ qua...")
                continue
            
            print(f"📝 Đang tạo: {filename}...")
            
            # Tạo TTS
            tts = gTTS(text=text, lang='vi', slow=False)
            
            # Lưu tạm file MP3
            temp_file = output_dir / f'temp_{filename}'
            tts.save(str(temp_file))
            
            # Chuyển đổi và tối ưu với pydub
            audio = AudioSegment.from_mp3(str(temp_file))
            # Export với bitrate 128kbps
            audio.export(str(output_path), format='mp3', bitrate='128k')
            
            # Xóa file tạm
            temp_file.unlink()
            
            print(f"✅ Đã tạo: {filename}")
        
        print("\n✨ Hoàn thành! Tất cả file voice đã được tạo.")
        print("\n💡 Lưu ý: BGM (background music) cần tạo riêng, xem README_AUDIO.md")
        
    except ImportError:
        print("❌ Cần cài đặt: pip install gtts pydub")
        return False
    except Exception as e:
        print(f"❌ Lỗi: {e}")
        return False
    
    return True

def generate_with_edge_tts():
    """Sử dụng Microsoft Edge TTS (chất lượng tốt hơn)"""
    try:
        import edge_tts
        import asyncio
        
        # Nội dung các file audio cho Mirror City
        audio_content = {
            # Intro dialogues
            'intro_1.mp3': 'Chào mừng đến Thành Phố Gương! Nơi này từng sáng rực như ngàn vì sao.',
            'intro_2.mp3': '10 tấm gương thiêng đã bị làm mờ bởi phép thuật đen tối.',
            'intro_3.mp3': 'Hãy dùng đôi mắt tinh tường để tìm điểm khác biệt và giải cứu ánh sáng!',
            
            # Game events
            'correct_answer.mp3': 'Tuyệt vời! Bạn đã tìm đúng điểm khác biệt!',
            'wrong_answer.mp3': 'Chưa đúng, hãy tìm ở chỗ khác! Cố lên!',
            'level_complete.mp3': 'Phi thường! Tất cả 10 tấm gương đã sáng rực rỡ! Thành Phố Gương đã được giải cứu!'
        }
        
        output_dir = project_root / 'src' / 'screens' / 'mirror_city' / 'assets' / 'audio' / 'voice'
        output_dir.mkdir(parents=True, exist_ok=True)
        
        # Chọn giọng nói tiếng Việt (nữ, thân thiện)
        # Có thể thay đổi: vi-VN-HoaiMyNeural (nữ), vi-VN-NamMinhNeural (nam)
        voice = "vi-VN-HoaiMyNeural"
        
        async def generate_audio(filename, text):
            output_path = output_dir / filename
            
            if output_path.exists():
                print(f"⚠️  File {filename} đã tồn tại, bỏ qua...")
                return
            
            print(f"📝 Đang tạo: {filename}...")
            
            communicate = edge_tts.Communicate(text, voice)
            await communicate.save(str(output_path))
            
            print(f"✅ Đã tạo: {filename}")
        
        async def main():
            print("Đang tạo file âm thanh bằng Microsoft Edge TTS...")
            tasks = [generate_audio(filename, text) for filename, text in audio_content.items()]
            await asyncio.gather(*tasks)
            print("\n✨ Hoàn thành! Tất cả file voice đã được tạo.")
            print("\n💡 Lưu ý: BGM (background music) cần tạo riêng, xem README_AUDIO.md")
        
        asyncio.run(main())
        return True
        
    except ImportError:
        print("❌ Cần cài đặt: pip install edge-tts")
        return False
    except Exception as e:
        print(f"❌ Lỗi: {e}")
        return False

def main():
    print("=" * 60)
    print("Tạo file âm thanh cho Mirror City Screen")
    print("=" * 60)
    
    # Check if running non-interactively (no stdin)
    try:
        # Try to get input
        print("\nChọn phương pháp:")
        print("1. Microsoft Edge TTS (khuyến nghị - chất lượng tốt)")
        print("2. Google TTS (gTTS)")
        print()
        choice = input("Nhập lựa chọn (1 hoặc 2, mặc định 1): ").strip() or "1"
    except (EOFError, KeyboardInterrupt):
        # Non-interactive mode, use Edge TTS by default
        choice = "1"
        print("\nChạy ở chế độ tự động, sử dụng Microsoft Edge TTS...")
    
    if choice == "1":
        success = generate_with_edge_tts()
    elif choice == "2":
        success = generate_with_gtts()
    else:
        print("❌ Lựa chọn không hợp lệ")
        return
    
    if not success:
        print("\n💡 Hướng dẫn cài đặt:")
        print("   - Edge TTS: pip install edge-tts")
        print("   - Google TTS: pip install gtts pydub")
        print("\n💡 Hoặc sử dụng công cụ online:")
        print("   - Narakeet: https://www.narakeet.com/create/vn-trinh-tao-giong-noi-ai.html")
        print("   - Viettel AI: https://viettelai.vn")

if __name__ == "__main__":
    main()

