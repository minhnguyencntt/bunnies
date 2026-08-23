#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
generate_voice_library.py — generate the Knowledge World voice library.

Source of truth: scripts/voice_library.json (dumped from
src/core/audio/AudioConfig.js — run `node scripts/dump_voice_library.js`
first, or let this script do it).

  python3 scripts/generate_voice_library.py            # missing files only
  python3 scripts/generate_voice_library.py --force    # regenerate all

Voices: narrator = vi-VN-HoaiMyNeural (clear, friendly);
        bunnine  = same voice pitched up (younger, playful — Bunnine's identity).
Adding a locale = adding `text.<locale>` entries; no game-logic changes.
"""
from __future__ import annotations

import argparse
import asyncio
import json
import subprocess
import sys
from pathlib import Path

SCRIPTS_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = SCRIPTS_DIR.parent
MANIFEST = SCRIPTS_DIR / "voice_library.json"

VOICES = {
    "narrator": {"voice": "vi-VN-HoaiMyNeural", "pitch": "+0Hz", "rate": "+0%"},
    "bunnine": {"voice": "vi-VN-HoaiMyNeural", "pitch": "+60Hz", "rate": "+2%"},
}


def dump_manifest() -> dict:
    """Dump VOICE_LIBRARY from AudioConfig.js via node (single source of truth)."""
    out = subprocess.run(
        ["node", str(SCRIPTS_DIR / "dump_voice_library.js")],
        capture_output=True, text=True, cwd=str(PROJECT_ROOT),
    )
    if out.returncode != 0:
        print(out.stderr, file=sys.stderr)
        raise SystemExit("node dump failed — is scripts/dump_voice_library.js present?")
    data = json.loads(out.stdout)
    MANIFEST.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    return data


def out_path(line_id: str, line: dict) -> Path:
    if line.get("game") and line.get("level"):
        return PROJECT_ROOT / "src" / "screens" / line["game"] / "assets" / "audio" / "voice" / f"level_{line['level']}.mp3"
    return PROJECT_ROOT / "src" / "core" / "audio" / "assets" / "voice" / f"{line_id}.mp3"


async def gen(line_id: str, line: dict, force: bool) -> bool:
    import edge_tts

    path = out_path(line_id, line)
    if path.exists() and not force:
        return True
    path.parent.mkdir(parents=True, exist_ok=True)
    v = VOICES.get(line.get("voice", "narrator"), VOICES["narrator"])
    text = (line.get("text") or {}).get("vi", "").strip()
    if not text:
        print(f"skip {line_id}: no vi text")
        return False
    comm = edge_tts.Communicate(text, v["voice"], pitch=v["pitch"], rate=v["rate"])
    await comm.save(str(path))
    print(f"OK {line_id} -> {path.relative_to(PROJECT_ROOT)}")
    return True


async def main_async(force: bool) -> int:
    data = dump_manifest()  # AudioConfig.js is the source of truth — always re-dump
    lines = data.get("lines", {})
    sem = asyncio.Semaphore(6)

    async def guarded(lid, line):
        async with sem:
            try:
                return await gen(lid, line, force)
            except Exception as e:
                print(f"Lỗi {lid}: {e}", file=sys.stderr)
                return False

    results = await asyncio.gather(*[guarded(lid, line) for lid, line in lines.items()])
    ok = sum(1 for r in results if r)
    print(f"Voice library: {ok}/{len(lines)} files")
    return 0 if ok == len(lines) else 1


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--force", action="store_true")
    args = ap.parse_args()
    return asyncio.run(main_async(args.force))


if __name__ == "__main__":
    raise SystemExit(main())
