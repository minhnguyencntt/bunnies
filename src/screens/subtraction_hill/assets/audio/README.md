# Subtraction Hill — Audio

Âm thanh màn **Đồi Phép Trừ** (`SubtractionHillScreen`). Dùng **`scripts/generate_audio.py`** và preset BGM trong `scripts/bgm/screen_bgm_presets.json`.

## Cấu trúc

```
audio/
├── bgm/
│   └── bgm.wav                 # BGM loop — preset `subtraction_hill_gameplay`
└── voice/
    ├── intro_1.mp3
    ├── intro_2.mp3
    ├── intro_3.mp3
    ├── correct_answer.mp3
    ├── wrong_answer.mp3
    └── level_complete.mp3
```

Màn này **không** dùng `screens/menu/.../city_click.mp3`.

## Tạo lại BGM

```bash
python3 scripts/generate_audio.py bgm subtraction_hill_gameplay
```

## Tạo lại toàn bộ voice (6 file, cùng cấu trúc Mirror City)

```bash
python3 scripts/generate_audio.py bundle subtraction-hill --force
```

Chi tiết nội dung từng câu: `src/screens/subtraction_hill/story.md`.

## Phaser keys (khớp `screen.js` / `puzzle.js`)

| Key | File |
|-----|------|
| `bgm_subtraction_hill` | `bgm/bgm.wav` |
| `voice_intro_1` … `voice_intro_3` | `voice/intro_1.mp3` … `intro_3.mp3` |
| `voice_correct` | `voice/correct_answer.mp3` |
| `voice_wrong` | `voice/wrong_answer.mp3` |
| `voice_complete` | `voice/level_complete.mp3` |
