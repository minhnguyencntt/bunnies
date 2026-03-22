"""
Layered procedural BGM: bass + chord pads + melody + sparkles + LFO pad.
Dùng chung cho Counting Forest, Mirror City, Subtraction Hill và màn mới (qua JSON).
"""
from __future__ import annotations

from typing import Any

NOTES: dict[str, float] = {
    "C2": 65.41,
    "C3": 130.81,
    "D3": 146.83,
    "E3": 164.81,
    "F3": 174.61,
    "G3": 196.00,
    "A3": 220.00,
    "B3": 246.94,
    "C4": 261.63,
    "D4": 293.66,
    "E4": 329.63,
    "F4": 349.23,
    "G4": 392.00,
    "A4": 440.00,
    "B4": 493.88,
    "C5": 523.25,
    "D5": 587.33,
    "E5": 659.25,
    "F5": 698.46,
    "G5": 783.99,
    "A5": 880.00,
    "C6": 1046.50,
}


def chord_progression_from_spec(duration_seconds: float, chord_spec: dict[str, Any]) -> list[tuple[list[str], float]]:
    """
    chord_spec:
      mode: "once" — chạy hết steps rồi dừng (dù phần cuối < duration, giống level2 mirror gốc)
      mode: "repeat" — lặp steps cho đến khi đủ duration
      steps: [ {"notes": ["C3","E3","G3"], "sec": 8}, ... ]
    """
    steps = chord_spec.get("steps") or []
    if not steps:
        return []
    mode = (chord_spec.get("mode") or "repeat").lower()
    out: list[tuple[list[str], float]] = []

    if mode == "once":
        t_acc = 0.0
        for step in steps:
            if t_acc >= duration_seconds - 0.001:
                break
            sec = float(step["sec"])
            notes = list(step["notes"])
            d = min(sec, duration_seconds - t_acc)
            out.append((notes, d))
            t_acc += d
        return out

    # repeat
    t_acc = 0.0
    i = 0
    nsteps = len(steps)
    while t_acc < duration_seconds - 0.01:
        step = steps[i % nsteps]
        sec = float(step["sec"])
        notes = list(step["notes"])
        d = min(sec, duration_seconds - t_acc)
        out.append((notes, d))
        t_acc += d
        i += 1
    return out


def build_layered_bgm(
    *,
    duration_seconds: float,
    sample_rate: int,
    chord_progression: list[tuple[list[str], float]],
    melody_patterns: list[list[str]],
    melody_note_gain: float = 0.12,
    melody_octave_gain: float = 0.04,
    harmony_note_gain: float = 0.06,
    harmony_octave_gain: float = 0.03,
    sparkle_interval: float = 3.0,
    sparkle_gain: float = 0.15,
    sparkle_notes: list[str] | None = None,
    pad_root: str = "C4",
    fade_seconds: float = 3.0,
    normalize_peak: float = 0.85,
) -> tuple[Any, int]:
    import numpy as np

    n = int(sample_rate * duration_seconds)
    t = np.linspace(0, duration_seconds, n, endpoint=False)

    bass_wave = np.zeros_like(t)
    bass_wave += 0.12 * np.sin(2 * np.pi * NOTES["C2"] * t)
    bass_wave += 0.08 * np.sin(2 * np.pi * NOTES["C3"] * t)
    bass_wave += 0.04 * np.sin(2 * np.pi * NOTES["C2"] * 2 * t)

    harmony_wave = np.zeros_like(t)
    current_time = 0.0
    for chord_notes, chord_duration in chord_progression:
        start_idx = int(current_time * sample_rate)
        end_idx = int((current_time + chord_duration) * sample_rate)
        end_idx = min(end_idx, n)
        if start_idx >= n:
            break
        chord_t = t[start_idx:end_idx] - t[start_idx]
        for note_name in chord_notes:
            if note_name not in NOTES:
                continue
            freq = NOTES[note_name]
            cw = harmony_note_gain * np.sin(2 * np.pi * freq * chord_t)
            cw += harmony_octave_gain * np.sin(2 * np.pi * freq * 2 * chord_t)
            harmony_wave[start_idx:end_idx] += cw
        current_time += chord_duration
        if current_time >= duration_seconds:
            break

    melody_wave = np.zeros_like(t)
    num_patterns = len(melody_patterns)
    if num_patterns == 0:
        pass
    else:
        pattern_duration = duration_seconds / num_patterns
        for pattern_idx, melody_pattern in enumerate(melody_patterns):
            pattern_start = pattern_idx * pattern_duration
            pattern_samples = int(sample_rate * pattern_duration)
            note_duration_samples = max(1, pattern_samples // len(melody_pattern))
            for i, note_name in enumerate(melody_pattern):
                if note_name not in NOTES:
                    continue
                freq = NOTES[note_name]
                start_idx = int(pattern_start * sample_rate) + i * note_duration_samples
                end_idx = start_idx + note_duration_samples
                end_idx = min(end_idx, n)
                if start_idx >= n:
                    break
                note_t = t[start_idx:end_idx] - t[start_idx]
                envelope = np.exp(-note_t * 1.5) * (1 - np.exp(-note_t * 10))
                note_wave = melody_note_gain * envelope * np.sin(2 * np.pi * freq * note_t)
                note_wave += melody_octave_gain * envelope * np.sin(2 * np.pi * freq * 2 * note_t)
                melody_wave[start_idx:end_idx] += note_wave

    sparkle_wave = np.zeros_like(t)
    sn = sparkle_notes or ["C5", "E5", "G5", "C6"]
    num_sparkles = int(duration_seconds / sparkle_interval)
    for i in range(num_sparkles):
        sparkle_time = i * sparkle_interval + 1.0
        note_name = sn[i % len(sn)]
        if note_name not in NOTES:
            continue
        freq = NOTES[note_name]
        sparkle_duration = 0.5
        start_idx = int(sparkle_time * sample_rate)
        end_idx = int((sparkle_time + sparkle_duration) * sample_rate)
        end_idx = min(end_idx, n)
        if start_idx >= n:
            break
        sparkle_t = t[start_idx:end_idx] - t[start_idx]
        envelope = np.exp(-sparkle_t * 8) * (1 - np.exp(-sparkle_t * 50))
        sparkle = sparkle_gain * envelope * np.sin(2 * np.pi * freq * sparkle_t)
        sparkle += (sparkle_gain * 0.33) * envelope * np.sin(2 * np.pi * freq * 3 * sparkle_t)
        sparkle_wave[start_idx:end_idx] += sparkle

    pad_freq = NOTES.get(pad_root, NOTES["C4"])
    lfo = 0.5 + 0.5 * np.sin(2 * np.pi * 0.1 * t)
    pad_wave = 0.05 * lfo * np.sin(2 * np.pi * pad_freq * t)
    pad_wave += 0.03 * lfo * np.sin(2 * np.pi * pad_freq * 1.5 * t)

    combined = bass_wave + harmony_wave + melody_wave + sparkle_wave + pad_wave

    fs = int(sample_rate * fade_seconds)
    fs = min(fs, n // 2)
    if fs > 0:
        fade_in = np.linspace(0, 1, fs)
        fade_out = np.linspace(1, 0, fs)
        combined[:fs] *= fade_in
        combined[-fs:] *= fade_out

    max_val = float(np.max(np.abs(combined)))
    if max_val > 0:
        combined = combined / max_val * normalize_peak

    audio_i16 = (combined * 32767).astype("int16")
    return audio_i16, sample_rate


def preset_to_build_kwargs(preset: dict[str, Any], project_root) -> tuple[dict, Any]:
    """Trả về (kwargs cho build_layered_bgm, output_path Path)."""
    from pathlib import Path

    out_rel = preset["output"]
    path = Path(project_root) / out_rel
    duration = float(preset["duration_sec"])
    sample_rate = int(preset.get("sample_rate", 44100))
    chord_spec = preset["chords"]
    progression = chord_progression_from_spec(duration, chord_spec)

    kwargs = {
        "duration_seconds": duration,
        "sample_rate": sample_rate,
        "chord_progression": progression,
        "melody_patterns": preset["melody_patterns"],
        "melody_note_gain": float(preset.get("melody_note_gain", 0.12)),
        "melody_octave_gain": float(preset.get("melody_octave_gain", 0.04)),
        "harmony_note_gain": float(preset.get("harmony_note_gain", 0.06)),
        "harmony_octave_gain": float(preset.get("harmony_octave_gain", 0.03)),
        "sparkle_interval": float(preset.get("sparkle_interval", 3.0)),
        "sparkle_gain": float(preset.get("sparkle_gain", 0.15)),
        "pad_root": str(preset.get("pad_root", "C4")),
        "fade_seconds": float(preset.get("fade_seconds", 3.0)),
        "normalize_peak": float(preset.get("normalize_peak", 0.85)),
    }
    if preset.get("sparkle_notes"):
        kwargs["sparkle_notes"] = list(preset["sparkle_notes"])

    return kwargs, path
