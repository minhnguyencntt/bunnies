#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script để tạo BGM (Background Music) cho Mirror City bằng AI
Có thể sử dụng:
1. MusicLM (Google) - nếu có API
2. Mubert API - nếu có API key
3. Hoặc download từ các nguồn miễn phí
4. Hoặc tạo nhạc đơn giản bằng thư viện Python
"""

import os
import sys
import subprocess
from pathlib import Path

# Fix encoding for Windows
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

# Thêm thư mục gốc vào path
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

def generate_with_musiclm():
    """Sử dụng Google MusicLM (nếu có API)"""
    try:
        # Cần cài đặt: pip install google-generativeai
        import google.generativeai as genai
        
        print("⚠️  MusicLM API cần API key từ Google AI Studio")
        print("   Xem: https://makersuite.google.com/app/apikey")
        return False
        
    except ImportError:
        print("❌ Cần cài đặt: pip install google-generativeai")
        return False
    except Exception as e:
        print(f"❌ Lỗi: {e}")
        return False

def generate_with_mubert():
    """Sử dụng Mubert API (nếu có API key)"""
    try:
        import requests
        
        print("⚠️  Mubert API cần API key")
        print("   Xem: https://mubert.com/developers/")
        return False
        
    except ImportError:
        print("❌ Cần cài đặt: pip install requests")
        return False
    except Exception as e:
        print(f"❌ Lỗi: {e}")
        return False

def generate_simple_music_with_numpy():
    """Tạo nhạc phong phú với nhiều layers và âm điệu bằng numpy và scipy"""
    try:
        import numpy as np
        from scipy.io import wavfile
        
        print("📝 Đang tạo nhạc nền phong phú với nhiều âm điệu...")
        
        output_dir = project_root / 'src' / 'screens' / 'mirror_city' / 'assets' / 'audio' / 'bgm'
        output_dir.mkdir(parents=True, exist_ok=True)
        output_path = output_dir / 'level2_bgm.wav'
        
        # Tạo một đoạn nhạc mystical, ambient (90 giây - dài hơn để phong phú)
        duration_seconds = 90
        sample_rate = 44100
        t = np.linspace(0, duration_seconds, int(sample_rate * duration_seconds))
        
        # Tần số các nốt nhạc (C major scale + một số nốt khác)
        notes = {
            'C2': 65.41,
            'C3': 130.81,
            'D3': 146.83,
            'E3': 164.81,
            'F3': 174.61,
            'G3': 196.00,
            'A3': 220.00,
            'B3': 246.94,
            'C4': 261.63,
            'D4': 293.66,
            'E4': 329.63,
            'F4': 349.23,
            'G4': 392.00,
            'A4': 440.00,
            'B4': 493.88,
            'C5': 523.25,
            'D5': 587.33,
            'E5': 659.25,
            'F5': 698.46,
            'G5': 783.99,
        }
        
        # Layer 1: Deep bass drone (C2 và C3) - tạo nền tảng mystical
        bass_wave = np.zeros_like(t)
        bass_wave += 0.12 * np.sin(2 * np.pi * notes['C2'] * t)
        bass_wave += 0.08 * np.sin(2 * np.pi * notes['C3'] * t)
        # Thêm harmonics để phong phú hơn
        bass_wave += 0.04 * np.sin(2 * np.pi * notes['C2'] * 2 * t)
        
        # Layer 2: Harmony chords (chord progression)
        harmony_wave = np.zeros_like(t)
        chord_progression = [
            (['C3', 'E3', 'G3'], 8),  # C major - 8 giây
            (['D3', 'F3', 'A3'], 8),  # D minor - 8 giây
            (['E3', 'G3', 'B3'], 8),  # E minor - 8 giây
            (['C3', 'E3', 'G3'], 8),  # C major - 8 giây
            (['F3', 'A3', 'C4'], 8),  # F major - 8 giây
            (['G3', 'B3', 'D4'], 8),  # G major - 8 giây
            (['C3', 'E3', 'G3'], 8),  # C major - 8 giây
            (['A3', 'C4', 'E4'], 8),  # A minor - 8 giây
            (['C3', 'E3', 'G3'], 8),  # C major - 8 giây
            (['D3', 'F3', 'A3'], 8),  # D minor - 8 giây
            (['G3', 'B3', 'D4'], 4),  # G major - 4 giây
            (['C3', 'E3', 'G3'], 2),  # C major - 2 giây (kết thúc)
        ]
        
        current_time = 0
        for chord_notes, chord_duration in chord_progression:
            chord_samples = int(sample_rate * chord_duration)
            start_idx = int(current_time * sample_rate)
            end_idx = start_idx + chord_samples
            if end_idx > len(t):
                end_idx = len(t)
            
            chord_t = t[start_idx:end_idx] - t[start_idx]
            for note_name in chord_notes:
                if note_name in notes:
                    freq = notes[note_name]
                    # Sử dụng triangle wave cho sound mềm mại hơn
                    chord_wave = 0.06 * np.sin(2 * np.pi * freq * chord_t)
                    # Thêm octave để phong phú
                    chord_wave += 0.03 * np.sin(2 * np.pi * freq * 2 * chord_t)
                    harmony_wave[start_idx:end_idx] += chord_wave
            
            current_time += chord_duration
            if current_time >= duration_seconds:
                break
        
        # Layer 3: Main melody (ethereal, high frequency)
        melody_wave = np.zeros_like(t)
        # Melody pattern phức tạp hơn, lặp lại 3 lần với biến thể
        melody_patterns = [
            ['C4', 'E4', 'G4', 'C5', 'G4', 'E4', 'C4', 'D4', 'F4', 'A4', 'D5', 'A4', 'F4', 'D4'],
            ['E4', 'G4', 'B4', 'E5', 'B4', 'G4', 'E4', 'F4', 'A4', 'C5', 'F5', 'C5', 'A4', 'F4'],
            ['G4', 'B4', 'D5', 'G5', 'D5', 'B4', 'G4', 'A4', 'C5', 'E5', 'A5', 'E5', 'C5', 'A4'],
        ]
        
        pattern_duration = duration_seconds / len(melody_patterns)
        for pattern_idx, melody_pattern in enumerate(melody_patterns):
            pattern_start = pattern_idx * pattern_duration
            pattern_samples = int(sample_rate * pattern_duration)
            note_duration_samples = pattern_samples // len(melody_pattern)
            
            for i, note_name in enumerate(melody_pattern):
                if note_name in notes:
                    freq = notes[note_name]
                    start_idx = int(pattern_start * sample_rate) + i * note_duration_samples
                    end_idx = start_idx + note_duration_samples
                    if end_idx > len(t):
                        end_idx = len(t)
                    
                    note_t = t[start_idx:end_idx] - t[start_idx]
                    # Envelope với attack và decay mềm mại
                    envelope = np.exp(-note_t * 1.5) * (1 - np.exp(-note_t * 10))
                    # Sử dụng sine wave với harmonics
                    note_wave = 0.12 * envelope * np.sin(2 * np.pi * freq * note_t)
                    note_wave += 0.04 * envelope * np.sin(2 * np.pi * freq * 2 * note_t)  # Octave
                    melody_wave[start_idx:end_idx] += note_wave
        
        # Layer 4: Bell-like sparkles (high frequency, occasional)
        sparkle_wave = np.zeros_like(t)
        sparkle_notes = ['C5', 'E5', 'G5', 'C6'] if 'C6' in notes else ['C5', 'E5', 'G5']
        sparkle_interval = 3.0  # Mỗi 3 giây một sparkle
        num_sparkles = int(duration_seconds / sparkle_interval)
        
        for i in range(num_sparkles):
            sparkle_time = i * sparkle_interval + 1.0  # Bắt đầu sau 1 giây
            note_name = sparkle_notes[i % len(sparkle_notes)]
            if note_name in notes:
                freq = notes[note_name]
                sparkle_duration = 0.5  # 0.5 giây
                start_idx = int(sparkle_time * sample_rate)
                end_idx = int((sparkle_time + sparkle_duration) * sample_rate)
                if end_idx > len(t):
                    end_idx = len(t)
                
                sparkle_t = t[start_idx:end_idx] - t[start_idx]
                # Bell-like envelope (fast attack, slow decay)
                envelope = np.exp(-sparkle_t * 8) * (1 - np.exp(-sparkle_t * 50))
                sparkle = 0.15 * envelope * np.sin(2 * np.pi * freq * sparkle_t)
                sparkle += 0.05 * envelope * np.sin(2 * np.pi * freq * 3 * sparkle_t)  # Harmonic
                sparkle_wave[start_idx:end_idx] += sparkle
        
        # Layer 5: Ambient pad (very soft, continuous)
        pad_wave = np.zeros_like(t)
        pad_freq = notes['C4']
        # Slow LFO modulation để tạo movement
        lfo = 0.5 + 0.5 * np.sin(2 * np.pi * 0.1 * t)  # 0.1 Hz modulation
        pad_wave = 0.05 * lfo * np.sin(2 * np.pi * pad_freq * t)
        pad_wave += 0.03 * lfo * np.sin(2 * np.pi * pad_freq * 1.5 * t)  # Fifth
        
        # Kết hợp tất cả layers
        combined = bass_wave + harmony_wave + melody_wave + sparkle_wave + pad_wave
        
        # Thêm fade in/out để loop mượt mà (3 giây)
        fade_samples = int(sample_rate * 3)
        fade_in = np.linspace(0, 1, fade_samples)
        fade_out = np.linspace(1, 0, fade_samples)
        combined[:fade_samples] *= fade_in
        combined[-fade_samples:] *= fade_out
        
        # Normalize để tránh clipping
        max_val = np.max(np.abs(combined))
        if max_val > 0:
            combined = combined / max_val * 0.85  # 85% volume để an toàn
        
        # Convert to 16-bit integer
        audio_data = (combined * 32767).astype(np.int16)
        
        # Export thành WAV
        wavfile.write(str(output_path), sample_rate, audio_data)
        
        file_size = output_path.stat().st_size
        print(f"✅ Đã tạo file BGM phong phú: {output_path}")
        print(f"   Kích thước: {file_size / 1024:.1f} KB")
        print(f"   Độ dài: {duration_seconds} giây")
        print("   Format: WAV, 44100 Hz")
        print("   Layers: Bass drone, Harmony chords, Main melody, Bell sparkles, Ambient pad")
        
        return True
        
    except ImportError:
        print("❌ Cần cài đặt các thư viện:")
        print("   pip install numpy scipy")
        print("\n💡 Hoặc sử dụng các công cụ AI online:")
        print("   - MusicCreator AI: https://www.musiccreator.ai/")
        print("   - Suno AI: https://suno.ai")
        print("   - Mubert: https://mubert.com")
        return False
    except Exception as e:
        print(f"❌ Lỗi: {e}")
        import traceback
        traceback.print_exc()
        return False

def generate_simple_music():
    """Tạo nhạc đơn giản bằng thư viện Python"""
    # Thử numpy/scipy trước (không cần ffmpeg)
    if generate_simple_music_with_numpy():
        return True
    
    # Fallback: hướng dẫn sử dụng music21
    try:
        from music21 import stream, note, tempo, meter, key, chord
        
        print("📝 Đang tạo nhạc nền đơn giản bằng music21...")
        
        # Tạo một đoạn nhạc mystical, magical
        s = stream.Stream()
        s.insert(0, tempo.MetronomeMark(number=60))  # 60 BPM - chậm, mystical
        s.insert(0, meter.TimeSignature('4/4'))
        s.insert(0, key.Key('C', 'major'))
        
        # Tạo giai điệu chính (mystical, ethereal)
        melody_notes = [
            'C4', 'E4', 'G4', 'C5', 'G4', 'E4', 'C4',
            'D4', 'F4', 'A4', 'D5', 'A4', 'F4', 'D4',
            'E4', 'G4', 'B4', 'E5', 'B4', 'G4', 'E4',
            'C4', 'E4', 'G4', 'C5', 'G4', 'E4', 'C4'
        ]
        
        for note_name in melody_notes:
            n = note.Note(note_name)
            n.duration.quarterLength = 0.5
            s.append(n)
        
        # Export thành MIDI
        output_dir = project_root / 'src' / 'screens' / 'mirror_city' / 'assets' / 'audio' / 'bgm'
        output_dir.mkdir(parents=True, exist_ok=True)
        midi_path = output_dir / 'level2_bgm_temp.mid'
        s.write('midi', fp=str(midi_path))
        
        print("✅ Đã tạo file MIDI tạm thời")
        print("💡 Cần chuyển đổi MIDI sang WAV bằng công cụ bên ngoài")
        print(f"   File MIDI: {midi_path}")
        
        return True
        
    except ImportError:
        print("❌ Cần cài đặt các thư viện:")
        print("   pip install music21")
        return False
    except Exception as e:
        print(f"❌ Lỗi: {e}")
        return False

def download_from_freesound():
    """Hướng dẫn download từ Freesound"""
    print("\n📥 Hướng dẫn download từ Freesound.org:")
    print("   1. Truy cập: https://freesound.org")
    print("   2. Tìm kiếm: 'mystical ambient', 'magical fantasy', 'ethereal music'")
    print("   3. Lọc theo license: CC0 hoặc CC BY")
    print("   4. Download file WAV hoặc MP3")
    print("   5. Đổi tên thành: level2_bgm.wav")
    print("   6. Đặt vào: src/screens/mirror_city/assets/audio/bgm/")
    return False

def generate_with_online_ai():
    """Hướng dẫn sử dụng các công cụ AI online"""
    print("\n🤖 Hướng dẫn tạo BGM bằng AI online:")
    print("\n1. MusicCreator AI (Khuyến nghị - Miễn phí):")
    print("   - Truy cập: https://www.musiccreator.ai/")
    print("   - Chọn: Game Music Maker")
    print("   - Thể loại: Ambient, Fantasy, Mystical")
    print("   - Tâm trạng: Calm, Mysterious, Magical")
    print("   - Độ dài: 60-120 giây (loopable)")
    print("   - Download và đặt tên: level2_bgm.wav")
    print("\n2. Suno AI:")
    print("   - Truy cập: https://suno.ai")
    print("   - Prompt: 'Mystical magical mirror city background music, ambient, ethereal, fantasy, instrumental, loopable, 2 minutes'")
    print("   - Download và đặt tên: level2_bgm.wav")
    print("\n3. Mubert:")
    print("   - Truy cập: https://mubert.com")
    print("   - Chọn: Generate Track")
    print("   - Style: Ambient, Fantasy, Mystical")
    print("   - Download và đặt tên: level2_bgm.wav")
    print("\n4. AIVA:")
    print("   - Truy cập: https://www.aiva.ai")
    print("   - Chọn: Create Track")
    print("   - Style: Fantasy, Ambient")
    print("   - Download và đặt tên: level2_bgm.wav")
    print("\n📁 Sau khi download, đặt file vào:")
    print(f"   {project_root / 'src' / 'screens' / 'mirror_city' / 'assets' / 'audio' / 'bgm' / 'level2_bgm.wav'}")
    return False

def check_existing_file():
    """Kiểm tra file BGM đã tồn tại chưa"""
    output_dir = project_root / 'src' / 'screens' / 'mirror_city' / 'assets' / 'audio' / 'bgm'
    bgm_file = output_dir / 'level2_bgm.wav'
    
    if bgm_file.exists():
        file_size = bgm_file.stat().st_size
        if file_size > 1000:  # File có kích thước hợp lý (> 1KB)
            print(f"✅ File BGM đã tồn tại: {bgm_file}")
            print(f"   Kích thước: {file_size / 1024:.1f} KB")
            return True
        else:
            print(f"⚠️  File BGM tồn tại nhưng quá nhỏ ({file_size} bytes), có thể là placeholder")
            return False
    else:
        print(f"❌ File BGM chưa tồn tại: {bgm_file}")
        return False

def main():
    print("=" * 60)
    print("Tạo BGM (Background Music) cho Mirror City")
    print("=" * 60)
    
    # Kiểm tra file đã tồn tại chưa
    if check_existing_file():
        overwrite = input("\nFile đã tồn tại. Bạn có muốn tạo lại không? (y/N): ").strip().lower()
        if overwrite != 'y':
            print("Bỏ qua.")
            return
    
    print("\nChọn phương pháp:")
    print("1. Tạo nhạc đơn giản bằng Python (pydub) - Tự động")
    print("2. Hướng dẫn sử dụng AI online (Khuyến nghị - Chất lượng tốt hơn)")
    print("3. Hướng dẫn download từ Freesound")
    print("4. Sử dụng Mubert API (cần API key)")
    print("5. Sử dụng MusicLM API (cần API key)")
    print()
    
    try:
        choice = input("Nhập lựa chọn (1-5, mặc định 1): ").strip() or "1"
    except (EOFError, KeyboardInterrupt):
        choice = "1"
        print("\nChạy ở chế độ tự động, tạo nhạc bằng Python...")
    
    if choice == "1":
        if generate_simple_music():
            print("\n✨ Hoàn thành! File BGM đã được tạo.")
        else:
            print("\n⚠️  Không thể tạo tự động, xem hướng dẫn bên dưới:")
            generate_with_online_ai()
    elif choice == "2":
        generate_with_online_ai()
    elif choice == "3":
        download_from_freesound()
    elif choice == "4":
        generate_with_mubert()
    elif choice == "5":
        generate_with_musiclm()
    else:
        print("❌ Lựa chọn không hợp lệ")
        return
    
    print("\n" + "=" * 60)
    print("Yêu cầu kỹ thuật cho file BGM:")
    print("- Format: WAV hoặc MP3")
    print("- Sample rate: 44100 Hz")
    print("- Bitrate: 128-192 kbps")
    print("- Độ dài: 60-120 giây (sẽ loop)")
    print("- Tính chất: Mystical, magical, ambient, ethereal")
    print("- Nên có: Fade in/out để loop mượt mà")
    print("=" * 60)

if __name__ == "__main__":
    main()

