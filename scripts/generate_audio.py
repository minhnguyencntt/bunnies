#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Một entry point cho âm thanh: TTS (prompt/text), bundle có sẵn, BGM procedural.

  # Một file voice bất kỳ — reuse chính (prompt = nội dung đọc)
  python3 scripts/generate_audio.py tts --text "Câu cần đọc" --out src/screens/.../voice/foo.mp3
  python3 scripts/generate_audio.py tts --prompt-file kich_ban.txt --out .../intro_1.mp3

  # Gói có sẵn (menu / mirror city voice)
  python3 scripts/generate_audio.py bundle menu
  python3 scripts/generate_audio.py bundle mirror-city --force
  python3 scripts/generate_audio.py bundle subtraction-hill --force

  # BGM WAV (numpy/scipy)
  python3 scripts/generate_audio.py bgm --list
  python3 scripts/generate_audio.py bgm mirror_city_level2
  python3 scripts/generate_audio.py bgm all
  python3 scripts/generate_audio.py bgm --definition my_preset.json

  pip install edge-tts          # TTS khuyến nghị
  pip install gtts pydub        # TTS dự phòng
  pip install numpy scipy       # BGM
"""
from __future__ import annotations

import argparse
import asyncio
import json
import sys
from pathlib import Path

SCRIPTS_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = SCRIPTS_DIR.parent
DEFAULT_BGM_PRESETS = SCRIPTS_DIR / "bgm" / "screen_bgm_presets.json"

if sys.platform == "win32":
    import io

    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8")

sys.path.insert(0, str(SCRIPTS_DIR))

MENU_VOICE: dict[str, str] = {
    "city_1_khu_rung_dem_so.mp3": (
        "Khu rừng đếm số. Đếm số lượng vật thể trong rừng để hoàn thành nhiệm vụ. Chủ đề: Đếm số."
    ),
    "city_2_thanh_pho_guong.mp3": (
        "Thành phố Gương Kỳ Ảo. Tìm điểm khác nhau giữa hai bức tranh ma thuật. Chủ đề: Tìm điểm khác biệt."
    ),
    "city_4_doi_phep_tru.mp3": (
        "Đồi Phép Trừ. Tìm kết quả phép trừ để giúp cáo tìm đồ. Chủ đề: Phép trừ."
    ),
    "city_26_khu_rung_dinh_huong.mp3": (
        "Khu Rừng Định Hướng. Nhận biết trái phải trước sau. Chủ đề: Định hướng."
    ),
    "city_click.mp3": "Bắt đầu!",
}

MIRROR_VOICE: dict[str, str] = {
    "intro_1.mp3": "Chào mừng đến Thành Phố Gương! Nơi này từng sáng rực như ngàn vì sao.",
    "intro_2.mp3": "10 tấm gương thiêng đã bị làm mờ bởi phép thuật đen tối.",
    "intro_3.mp3": "Hãy dùng đôi mắt tinh tường để tìm điểm khác biệt và giải cứu ánh sáng!",
    "correct_answer.mp3": "Tuyệt vời! Bạn đã tìm đúng điểm khác biệt!",
    "wrong_answer.mp3": "Chưa đúng, hãy tìm ở chỗ khác! Cố lên!",
    "level_complete.mp3": (
        "Phi thường! Tất cả 10 tấm gương đã sáng rực rỡ! Thành Phố Gương đã được giải cứu!"
    ),
}

SUBTRACTION_HILL_VOICE: dict[str, str] = {
    "intro_1.mp3": (
        "Hu hu… Cáo con làm rơi đồ đạc khắp Đồi Phép Trừ! Bạn có thể giúp tìm lại không?"
    ),
    "intro_2.mp3": "Mỗi câu trừ đúng sẽ gọi một món đồ bị thất lạc bay về chỗ cáo con.",
    "intro_3.mp3": "Chỉ có số từ 0 đến 10 thôi — tìm hết đồ, cáo con sẽ được gặp mẹ!",
    "correct_answer.mp3": "Đúng rồi! Cảm ơn bạn!",
    "wrong_answer.mp3": "Chưa đúng rồi… Thử lại nhé!",
    "level_complete.mp3": (
        "Mẹ ơi! Con tìm được hết đồ rồi! Cảm ơn bạn đã giúp cáo con!"
    ),
}

DEFAULT_VOICE = "vi-VN-HoaiMyNeural"


def _resolve_out(path_str: str) -> Path:
    p = Path(path_str)
    if not p.is_absolute():
        p = PROJECT_ROOT / p
    return p


async def tts_edge_save(text: str, out_path: Path, voice: str) -> None:
    import edge_tts

    out_path.parent.mkdir(parents=True, exist_ok=True)
    comm = edge_tts.Communicate(text.strip(), voice)
    await comm.save(str(out_path))


def tts_gtts_save(text: str, out_path: Path) -> None:
    from gtts import gTTS
    from pydub import AudioSegment

    out_path.parent.mkdir(parents=True, exist_ok=True)
    temp = out_path.with_suffix(".temp.mp3")
    gTTS(text=text, lang="vi", slow=False).save(str(temp))
    audio = AudioSegment.from_mp3(str(temp))
    audio.export(str(out_path), format="mp3", bitrate="128k")
    temp.unlink(missing_ok=True)


def cmd_tts(args: argparse.Namespace) -> int:
    text_parts: list[str] = []
    if args.text:
        text_parts.append(args.text)
    if args.prompt_file:
        pf = Path(args.prompt_file)
        if not pf.is_file():
            print(f"Không tìm thấy: {pf}", file=sys.stderr)
            return 1
        text_parts.append(pf.read_text(encoding="utf-8"))
    text = "\n".join(text_parts).strip()
    if not text:
        print("Cần --text và/hoặc --prompt-file", file=sys.stderr)
        return 1

    out_path = _resolve_out(args.out)
    if out_path.exists() and not args.force:
        print(f"Bỏ qua (đã tồn tại): {out_path} — dùng --force để ghi đè", file=sys.stderr)
        return 0

    try:
        if args.engine == "edge":
            asyncio.run(tts_edge_save(text, out_path, args.voice))
        else:
            tts_gtts_save(text, out_path)
    except ImportError as e:
        print(f"Thiếu thư viện: {e}", file=sys.stderr)
        print("  edge: pip install edge-tts", file=sys.stderr)
        print("  gtts: pip install gtts pydub", file=sys.stderr)
        return 1
    except Exception as e:
        print(f"Lỗi TTS: {e}", file=sys.stderr)
        return 1

    print(f"OK tts -> {out_path}")
    return 0


def cmd_bundle(args: argparse.Namespace) -> int:
    if args.name == "menu":
        items = MENU_VOICE
        out_dir = PROJECT_ROOT / "src" / "screens" / "menu" / "assets" / "audio" / "voice"
    elif args.name == "mirror-city":
        items = MIRROR_VOICE
        out_dir = PROJECT_ROOT / "src" / "screens" / "mirror_city" / "assets" / "audio" / "voice"
    elif args.name == "subtraction-hill":
        items = SUBTRACTION_HILL_VOICE
        out_dir = PROJECT_ROOT / "src" / "screens" / "subtraction_hill" / "assets" / "audio" / "voice"
    else:
        print(f"Bundle không hỗ trợ: {args.name}", file=sys.stderr)
        return 1

    ok = 0
    for filename, text in items.items():
        out_path = out_dir / filename
        if out_path.exists() and not args.force:
            print(f"skip exists: {out_path}")
            continue
        try:
            if args.engine == "edge":
                asyncio.run(tts_edge_save(text, out_path, args.voice))
            else:
                tts_gtts_save(text, out_path)
            print(f"OK {filename}")
        except ImportError:
            print("Thiếu edge-tts hoặc gtts/pydub — xem scripts/requirements_audio.txt", file=sys.stderr)
            return 1
        except Exception as e:
            print(f"Lỗi {filename}: {e}", file=sys.stderr)
            ok = 1
    return ok


# --- BGM (layered_engine + presets JSON) ---
from bgm.layered_engine import build_layered_bgm, preset_to_build_kwargs  # noqa: E402


def _load_bgm_presets(path: Path) -> dict:
    with open(path, encoding="utf-8") as f:
        data = json.load(f)
    return data.get("presets") or {}


def _write_bgm_preset(preset_id: str, preset: dict) -> bool:
    try:
        from scipy.io import wavfile
    except ImportError:
        print("Cần: python3 -m pip install numpy scipy", file=sys.stderr)
        return False
    kwargs, out_path = preset_to_build_kwargs(preset, PROJECT_ROOT)
    audio_i16, sr = build_layered_bgm(**kwargs)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    wavfile.write(str(out_path), sr, audio_i16)
    desc = preset.get("description", "")
    dur = preset.get("duration_sec", "")
    kb = out_path.stat().st_size // 1024
    print(f"OK {preset_id} -> {out_path} ({dur}s, {kb} KB) {desc}")
    return True


def cmd_bgm(args: argparse.Namespace) -> int:
    if args.definition:
        if not args.definition.is_file():
            print(f"Không tìm thấy: {args.definition}", file=sys.stderr)
            return 1
        with open(args.definition, encoding="utf-8") as f:
            one = json.load(f)
        req = ("output", "duration_sec", "chords", "melody_patterns")
        if not all(k in one for k in req):
            print(f"JSON cần: {req}", file=sys.stderr)
            return 1
        return 0 if _write_bgm_preset("custom", one) else 1

    presets_path = args.presets_file
    if not presets_path.is_file():
        print(f"Không tìm thấy presets: {presets_path}", file=sys.stderr)
        return 1
    presets = _load_bgm_presets(presets_path)
    if args.list_presets:
        for pid, p in sorted(presets.items()):
            print(f"  {pid}: {p.get('description', '')}")
        return 0

    key = (args.preset or "all").strip().lower()
    if key == "all":
        bad = False
        for pid in sorted(presets.keys()):
            if not _write_bgm_preset(pid, presets[pid]):
                bad = True
        return 1 if bad else 0
    if key not in presets:
        print(f"Preset không có: {key}", file=sys.stderr)
        print("Có:", ", ".join(sorted(presets.keys())), "hoặc all", file=sys.stderr)
        return 1
    return 0 if _write_bgm_preset(key, presets[key]) else 1


def build_parser() -> argparse.ArgumentParser:
    ap = argparse.ArgumentParser(
        description="generate_audio.py — TTS (prompt), bundle voice, BGM WAV",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    sub = ap.add_subparsers(dest="command", required=True)

    p_tts = sub.add_parser("tts", help="Tạo một file MP3 từ text/prompt")
    p_tts.add_argument("--text", "-t", default="", help="Nội dung đọc (prompt)")
    p_tts.add_argument("--prompt-file", "-f", type=Path, help="File UTF-8 chứa prompt")
    p_tts.add_argument("--out", "-o", required=True, help="Đường dẫn file .mp3 ra")
    p_tts.add_argument("--voice", default=DEFAULT_VOICE, help="Edge voice (mặc định HoaiMy)")
    p_tts.add_argument("--engine", choices=("edge", "gtts"), default="edge")
    p_tts.add_argument("--force", action="store_true", help="Ghi đè nếu file đã có")
    p_tts.set_defaults(func=cmd_tts)

    p_b = sub.add_parser("bundle", help="Gói voice định sẵn (menu, mirror-city, subtraction-hill)")
    p_b.add_argument("name", choices=("menu", "mirror-city", "subtraction-hill"))
    p_b.add_argument("--voice", default=DEFAULT_VOICE)
    p_b.add_argument("--engine", choices=("edge", "gtts"), default="edge")
    p_b.add_argument("--force", action="store_true")
    p_b.set_defaults(func=cmd_bundle)

    p_bg = sub.add_parser("bgm", help="BGM WAV từ scripts/bgm/screen_bgm_presets.json")
    p_bg.add_argument("preset", nargs="?", default=None, help="Tên preset hoặc all")
    p_bg.add_argument("--list", action="store_true", dest="list_presets")
    p_bg.add_argument("--presets-file", type=Path, default=DEFAULT_BGM_PRESETS)
    p_bg.add_argument("--definition", type=Path, default=None, help="Một preset JSON đơn")
    p_bg.set_defaults(func=cmd_bgm)

    return ap


def main() -> int:
    ap = build_parser()
    args = ap.parse_args()
    return int(args.func(args))


if __name__ == "__main__":
    raise SystemExit(main())
