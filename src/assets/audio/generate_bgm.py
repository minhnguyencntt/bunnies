#!/usr/bin/env python3
"""
Generate Background Music (BGM) for Bunnies game
Creates simple, child-friendly procedural music for each scene

Requires: numpy, scipy (for signal processing)
Install: pip install numpy scipy

Note: This generates WAV files. Convert to MP3 using ffmpeg if needed:
  ffmpeg -i bgm/boot_bgm.wav -codec:a libmp3lame -qscale:a 2 bgm/boot_bgm.mp3
"""

import numpy as np
import wave
import struct
import os
import sys

# Fix Unicode output on Windows
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding='utf-8')

# Audio settings
SAMPLE_RATE = 44100
OUTPUT_DIR = "bgm"

# Musical notes (frequencies in Hz)
NOTES = {
    'C3': 130.81, 'D3': 146.83, 'E3': 164.81, 'F3': 174.61, 'G3': 196.00, 'A3': 220.00, 'B3': 246.94,
    'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23, 'G4': 392.00, 'A4': 440.00, 'B4': 493.88,
    'C5': 523.25, 'D5': 587.33, 'E5': 659.25, 'F5': 698.46, 'G5': 783.99, 'A5': 880.00, 'B5': 987.77,
    'C6': 1046.50,
    'REST': 0
}

def generate_sine_wave(frequency, duration, volume=0.3, sample_rate=SAMPLE_RATE):
    """Generate a sine wave with envelope"""
    t = np.linspace(0, duration, int(sample_rate * duration), False)
    if frequency == 0:
        return np.zeros(len(t))
    
    # Basic sine wave
    wave_data = np.sin(2 * np.pi * frequency * t) * volume
    
    # Apply ADSR envelope for smoother sound
    attack = int(0.01 * sample_rate)  # 10ms attack
    decay = int(0.05 * sample_rate)    # 50ms decay
    release = int(0.1 * sample_rate)   # 100ms release
    
    envelope = np.ones(len(t))
    # Attack
    if attack > 0:
        envelope[:attack] = np.linspace(0, 1, attack)
    # Release
    if release > 0 and release < len(t):
        envelope[-release:] = np.linspace(1, 0, release)
    
    return wave_data * envelope

def generate_soft_bell(frequency, duration, volume=0.25, sample_rate=SAMPLE_RATE):
    """Generate a soft bell/chime sound (good for magical effects)"""
    t = np.linspace(0, duration, int(sample_rate * duration), False)
    if frequency == 0:
        return np.zeros(len(t))
    
    # Combine harmonics for bell-like sound
    wave_data = (
        np.sin(2 * np.pi * frequency * t) * 1.0 +
        np.sin(2 * np.pi * frequency * 2.0 * t) * 0.5 +
        np.sin(2 * np.pi * frequency * 3.0 * t) * 0.25 +
        np.sin(2 * np.pi * frequency * 4.0 * t) * 0.125
    ) * volume / 2
    
    # Exponential decay envelope for bell sound
    decay_rate = 3.0 / duration
    envelope = np.exp(-decay_rate * t)
    
    return wave_data * envelope

def generate_soft_pad(frequency, duration, volume=0.15, sample_rate=SAMPLE_RATE):
    """Generate a soft pad sound for background atmosphere"""
    t = np.linspace(0, duration, int(sample_rate * duration), False)
    if frequency == 0:
        return np.zeros(len(t))
    
    # Soft sawtooth approximation with heavy filtering
    wave_data = (
        np.sin(2 * np.pi * frequency * t) * 1.0 +
        np.sin(2 * np.pi * frequency * 2 * t) * 0.3 +
        np.sin(2 * np.pi * frequency * 3 * t) * 0.1
    ) * volume
    
    # Slow attack and release for pad sound
    attack = int(0.2 * sample_rate)
    release = int(0.3 * sample_rate)
    
    envelope = np.ones(len(t))
    if attack > 0:
        envelope[:attack] = np.linspace(0, 1, attack)
    if release > 0 and release < len(t):
        envelope[-release:] = np.linspace(1, 0, release)
    
    return wave_data * envelope

def mix_tracks(*tracks):
    """Mix multiple tracks together"""
    max_len = max(len(t) for t in tracks)
    result = np.zeros(max_len)
    for track in tracks:
        result[:len(track)] += track
    # Normalize to prevent clipping
    max_val = np.max(np.abs(result))
    if max_val > 0.9:
        result = result * 0.9 / max_val
    return result

def save_wav(filename, audio_data, sample_rate=SAMPLE_RATE):
    """Save audio data to WAV file"""
    # Normalize
    audio_data = np.int16(audio_data * 32767)
    
    with wave.open(filename, 'w') as wav_file:
        wav_file.setnchannels(1)
        wav_file.setsampwidth(2)
        wav_file.setframerate(sample_rate)
        wav_file.writeframes(audio_data.tobytes())

def create_loop_friendly(audio_data, crossfade_samples=4410):
    """Make audio loop-friendly with crossfade"""
    if len(audio_data) < crossfade_samples * 2:
        return audio_data
    
    # Crossfade end into beginning
    fade_out = np.linspace(1, 0, crossfade_samples)
    fade_in = np.linspace(0, 1, crossfade_samples)
    
    result = audio_data.copy()
    result[-crossfade_samples:] = (
        audio_data[-crossfade_samples:] * fade_out +
        audio_data[:crossfade_samples] * fade_in
    )
    return result

# ============================================================================
# BOOT SCENE BGM - Magical, whimsical loading music (~20 seconds loop)
# ============================================================================
def generate_boot_bgm():
    """Generate magical loading screen music"""
    print("🎵 Generating Boot Scene BGM...")
    
    duration = 20.0  # 20 seconds loop
    
    # Magical arpeggio melody (C major pentatonic - child-friendly)
    melody_notes = [
        ('C5', 0.25), ('E5', 0.25), ('G5', 0.25), ('C6', 0.25),
        ('G5', 0.25), ('E5', 0.25), ('C5', 0.25), ('G4', 0.25),
        ('C5', 0.25), ('D5', 0.25), ('E5', 0.25), ('G5', 0.25),
        ('A5', 0.25), ('G5', 0.25), ('E5', 0.25), ('D5', 0.25),
        ('C5', 0.25), ('E5', 0.25), ('G5', 0.25), ('A5', 0.25),
        ('G5', 0.25), ('E5', 0.25), ('D5', 0.25), ('C5', 0.25),
        ('E5', 0.25), ('G5', 0.25), ('C6', 0.25), ('G5', 0.25),
        ('E5', 0.25), ('C5', 0.25), ('D5', 0.25), ('E5', 0.25),
    ]
    
    # Generate melody track
    melody = np.array([])
    for note, dur in melody_notes:
        note_audio = generate_soft_bell(NOTES[note], dur, volume=0.2)
        melody = np.concatenate([melody, note_audio])
    
    # Repeat melody to fill duration
    while len(melody) < int(SAMPLE_RATE * duration):
        melody = np.concatenate([melody, melody])
    melody = melody[:int(SAMPLE_RATE * duration)]
    
    # Background pad (C major chord drone)
    pad_c = generate_soft_pad(NOTES['C4'], duration, volume=0.1)
    pad_e = generate_soft_pad(NOTES['E4'], duration, volume=0.08)
    pad_g = generate_soft_pad(NOTES['G4'], duration, volume=0.08)
    
    # Sparkle effects (random high notes)
    sparkles = np.zeros(int(SAMPLE_RATE * duration))
    sparkle_times = np.random.uniform(0, duration - 0.5, 15)
    sparkle_notes = ['C6', 'E5', 'G5', 'A5', 'C5']
    for t in sparkle_times:
        note = np.random.choice(sparkle_notes)
        sparkle = generate_soft_bell(NOTES[note], 0.4, volume=0.1)
        start = int(t * SAMPLE_RATE)
        end = min(start + len(sparkle), len(sparkles))
        sparkles[start:end] += sparkle[:end-start]
    
    # Mix all tracks
    final_mix = mix_tracks(melody, pad_c, pad_e, pad_g, sparkles)
    final_mix = create_loop_friendly(final_mix)
    
    return final_mix

# ============================================================================
# MENU SCENE BGM - Cheerful, playful garden music (~60 seconds loop)
# ============================================================================
def generate_menu_bgm():
    """Generate cheerful menu music"""
    print("🎵 Generating Menu Scene BGM...")
    
    duration = 60.0  # 60 seconds loop
    
    # Happy, bouncy melody (C major - playful)
    melody_patterns = [
        # Pattern 1 - Playful ascending
        [('C5', 0.3), ('E5', 0.3), ('G5', 0.3), ('C6', 0.6), ('REST', 0.3),
         ('B5', 0.3), ('G5', 0.3), ('E5', 0.3), ('C5', 0.6), ('REST', 0.3)],
        # Pattern 2 - Dancing
        [('G4', 0.2), ('C5', 0.2), ('E5', 0.2), ('G5', 0.4), ('E5', 0.2), ('C5', 0.2),
         ('D5', 0.2), ('F5', 0.2), ('A5', 0.4), ('F5', 0.2), ('D5', 0.2), ('REST', 0.2)],
        # Pattern 3 - Gentle ending
        [('E5', 0.4), ('D5', 0.4), ('C5', 0.4), ('E5', 0.4), ('G5', 0.4),
         ('F5', 0.4), ('E5', 0.4), ('D5', 0.4), ('C5', 0.8), ('REST', 0.4)],
        # Pattern 4 - Magical flourish
        [('C5', 0.15), ('D5', 0.15), ('E5', 0.15), ('F5', 0.15), ('G5', 0.15), ('A5', 0.15),
         ('B5', 0.15), ('C6', 0.45), ('REST', 0.3), ('G5', 0.3), ('E5', 0.3), ('C5', 0.6)],
    ]
    
    # Generate melody
    melody = np.array([])
    pattern_index = 0
    while len(melody) < int(SAMPLE_RATE * duration):
        pattern = melody_patterns[pattern_index % len(melody_patterns)]
        for note, dur in pattern:
            note_audio = generate_sine_wave(NOTES[note], dur, volume=0.25)
            melody = np.concatenate([melody, note_audio])
        pattern_index += 1
    melody = melody[:int(SAMPLE_RATE * duration)]
    
    # Bass line (simple root notes)
    bass_pattern = [
        ('C3', 1.0), ('G3', 1.0), ('A3', 1.0), ('F3', 1.0),
        ('C3', 1.0), ('E3', 1.0), ('G3', 1.0), ('C3', 1.0),
    ]
    
    bass = np.array([])
    while len(bass) < int(SAMPLE_RATE * duration):
        for note, dur in bass_pattern:
            note_audio = generate_soft_pad(NOTES[note], dur, volume=0.12)
            bass = np.concatenate([bass, note_audio])
    bass = bass[:int(SAMPLE_RATE * duration)]
    
    # Harmony pad (chord progression)
    chord_duration = 4.0
    chords = [
        ['C4', 'E4', 'G4'],  # C major
        ['G3', 'B3', 'D4'],  # G major
        ['A3', 'C4', 'E4'],  # A minor
        ['F3', 'A3', 'C4'],  # F major
    ]
    
    harmony = np.zeros(int(SAMPLE_RATE * duration))
    time_pos = 0
    chord_index = 0
    while time_pos < duration:
        chord = chords[chord_index % len(chords)]
        for note_name in chord:
            pad = generate_soft_pad(NOTES[note_name], chord_duration, volume=0.06)
            start = int(time_pos * SAMPLE_RATE)
            end = min(start + len(pad), len(harmony))
            harmony[start:end] += pad[:end-start]
        time_pos += chord_duration
        chord_index += 1
    
    # Bird chirp effects (occasional high notes)
    chirps = np.zeros(int(SAMPLE_RATE * duration))
    chirp_times = np.random.uniform(0, duration - 1, 20)
    for t in chirp_times:
        chirp_notes = [('G5', 0.1), ('A5', 0.1), ('G5', 0.15)]
        chirp = np.array([])
        for note, dur in chirp_notes:
            chirp = np.concatenate([chirp, generate_soft_bell(NOTES[note], dur, volume=0.08)])
        start = int(t * SAMPLE_RATE)
        end = min(start + len(chirp), len(chirps))
        chirps[start:end] += chirp[:end-start]
    
    # Mix all tracks
    final_mix = mix_tracks(melody, bass, harmony, chirps)
    final_mix = create_loop_friendly(final_mix)
    
    return final_mix

# ============================================================================
# LEVEL 1 BGM - Forest adventure, gentle and encouraging (~90 seconds loop)
# ============================================================================
def generate_level1_bgm():
    """Generate gentle forest adventure music"""
    print("🎵 Generating Level 1 Scene BGM...")
    
    duration = 90.0  # 90 seconds loop
    
    # Calm, encouraging melody (Gentle, not distracting from learning)
    melody_patterns = [
        # Pattern 1 - Gentle forest theme
        [('E4', 0.5), ('G4', 0.5), ('A4', 1.0), ('REST', 0.5),
         ('G4', 0.5), ('E4', 0.5), ('D4', 1.0), ('REST', 0.5)],
        # Pattern 2 - Curious exploration
        [('C4', 0.5), ('E4', 0.5), ('G4', 0.5), ('E4', 0.5),
         ('A4', 0.75), ('G4', 0.75), ('E4', 1.0), ('REST', 0.5)],
        # Pattern 3 - Encouraging
        [('G4', 0.5), ('A4', 0.5), ('B4', 0.5), ('C5', 1.0),
         ('B4', 0.5), ('A4', 0.5), ('G4', 1.0), ('REST', 0.5)],
        # Pattern 4 - Peaceful
        [('E4', 1.0), ('D4', 0.5), ('C4', 1.0), ('REST', 0.5),
         ('D4', 0.5), ('E4', 0.5), ('G4', 1.0), ('REST', 0.5)],
        # Pattern 5 - Wonder
        [('C5', 0.5), ('B4', 0.5), ('A4', 0.5), ('G4', 1.0),
         ('A4', 0.5), ('B4', 0.5), ('C5', 1.0), ('REST', 0.5)],
    ]
    
    # Generate melody (softer for concentration)
    melody = np.array([])
    pattern_index = 0
    while len(melody) < int(SAMPLE_RATE * duration):
        pattern = melody_patterns[pattern_index % len(melody_patterns)]
        for note, dur in pattern:
            note_audio = generate_sine_wave(NOTES[note], dur, volume=0.18)
            melody = np.concatenate([melody, note_audio])
        pattern_index += 1
    melody = melody[:int(SAMPLE_RATE * duration)]
    
    # Soft bass drone (very subtle)
    bass_notes = [('C3', 6.0), ('G3', 6.0), ('A3', 6.0), ('E3', 6.0), ('F3', 6.0), ('C3', 6.0)]
    
    bass = np.array([])
    while len(bass) < int(SAMPLE_RATE * duration):
        for note, dur in bass_notes:
            note_audio = generate_soft_pad(NOTES[note], dur, volume=0.08)
            bass = np.concatenate([bass, note_audio])
    bass = bass[:int(SAMPLE_RATE * duration)]
    
    # Atmospheric forest pad (very gentle)
    forest_pad = np.zeros(int(SAMPLE_RATE * duration))
    # Long, evolving pad chords
    pad_chords = [
        ['C4', 'E4', 'G4'],  # C major
        ['A3', 'C4', 'E4'],  # A minor  
        ['F3', 'A3', 'C4'],  # F major
        ['G3', 'B3', 'D4'],  # G major
        ['E3', 'G3', 'B3'],  # E minor
    ]
    
    chord_duration = 8.0
    time_pos = 0
    chord_index = 0
    while time_pos < duration:
        chord = pad_chords[chord_index % len(pad_chords)]
        for note_name in chord:
            pad = generate_soft_pad(NOTES[note_name], chord_duration, volume=0.05)
            start = int(time_pos * SAMPLE_RATE)
            end = min(start + len(pad), len(forest_pad))
            forest_pad[start:end] += pad[:end-start]
        time_pos += chord_duration
        chord_index += 1
    
    # Forest ambience (subtle nature sounds approximation)
    nature_sounds = np.zeros(int(SAMPLE_RATE * duration))
    # Wind-like noise (very subtle filtered noise)
    wind = np.random.normal(0, 0.02, int(SAMPLE_RATE * duration))
    # Simple low-pass filter approximation
    for i in range(1, len(wind)):
        wind[i] = wind[i-1] * 0.95 + wind[i] * 0.05
    nature_sounds += wind * 0.3
    
    # Occasional sparkles (magical forest feel)
    sparkle_times = np.random.uniform(0, duration - 0.5, 25)
    sparkle_notes_list = ['C5', 'E5', 'G5', 'A5']
    for t in sparkle_times:
        note = np.random.choice(sparkle_notes_list)
        sparkle = generate_soft_bell(NOTES[note], 0.5, volume=0.06)
        start = int(t * SAMPLE_RATE)
        end = min(start + len(sparkle), len(nature_sounds))
        nature_sounds[start:end] += sparkle[:end-start]
    
    # Mix all tracks
    final_mix = mix_tracks(melody, bass, forest_pad, nature_sounds)
    final_mix = create_loop_friendly(final_mix, crossfade_samples=8820)  # Longer crossfade
    
    return final_mix

def main():
    """Generate all BGM files"""
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    print("=" * 60)
    print("Bunnies Game - Background Music Generation Script")
    print("=" * 60)
    print()
    
    # Generate Boot BGM
    boot_bgm = generate_boot_bgm()
    boot_path = os.path.join(OUTPUT_DIR, "boot_bgm.wav")
    save_wav(boot_path, boot_bgm)
    print(f"  ✓ Saved: {boot_path} ({len(boot_bgm) / SAMPLE_RATE:.1f} seconds)")
    print()
    
    # Generate Menu BGM
    menu_bgm = generate_menu_bgm()
    menu_path = os.path.join(OUTPUT_DIR, "menu_bgm.wav")
    save_wav(menu_path, menu_bgm)
    print(f"  ✓ Saved: {menu_path} ({len(menu_bgm) / SAMPLE_RATE:.1f} seconds)")
    print()
    
    # Generate Level 1 BGM
    level1_bgm = generate_level1_bgm()
    level1_path = os.path.join(OUTPUT_DIR, "level1_bgm.wav")
    save_wav(level1_path, level1_bgm)
    print(f"  ✓ Saved: {level1_path} ({len(level1_bgm) / SAMPLE_RATE:.1f} seconds)")
    print()
    
    print("=" * 60)
    print("✓ All BGM files generated successfully!")
    print(f"  Location: {os.path.abspath(OUTPUT_DIR)}")
    print()
    print("To convert to MP3, run:")
    print("  ffmpeg -i bgm/boot_bgm.wav -codec:a libmp3lame -qscale:a 2 bgm/boot_bgm.mp3")
    print("  ffmpeg -i bgm/menu_bgm.wav -codec:a libmp3lame -qscale:a 2 bgm/menu_bgm.mp3")
    print("  ffmpeg -i bgm/level1_bgm.wav -codec:a libmp3lame -qscale:a 2 bgm/level1_bgm.mp3")
    print("=" * 60)

if __name__ == "__main__":
    main()

