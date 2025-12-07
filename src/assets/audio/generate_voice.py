#!/usr/bin/env python3
"""
Generate Vietnamese voice MP3 files for the Bunnies game
Uses edge-tts (Microsoft Edge Text-to-Speech) for high-quality Vietnamese voices
"""

import asyncio
import edge_tts
import os
import sys

# Fix Unicode output on Windows
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding='utf-8')

# Vietnamese voice options:
# vi-VN-HoaiMyNeural (Female) - Friendly, warm
# vi-VN-NamMinhNeural (Male) - Clear, professional
VOICE = "vi-VN-HoaiMyNeural"  # Female voice - perfect for children's game

# Output directory
OUTPUT_DIR = "voice"

# All dialogues from the game
DIALOGUES = [
    {
        "id": "intro_1",
        "text": "Chào mừng đến Khu Rừng Đếm Số, Bé Thỏ! Con đường ma thuật này đầy những con số đang chờ bạn khám phá.",
        "description": "Level start - Welcome"
    },
    {
        "id": "intro_2", 
        "text": "Ồ không! Cây cầu gỗ bị gãy, và bạn không thể băng qua dòng suối. Nhưng đừng lo, mỗi câu trả lời đúng sẽ giúp khôi phục một tấm ván.",
        "description": "Level start - Problem"
    },
    {
        "id": "intro_3",
        "text": "Giải các bài toán cộng bằng cách chọn số đúng. Kéo nó vào chỗ trống trên cầu. Mỗi câu trả lời đúng sẽ khôi phục một tấm ván. Hãy xem bạn có thể khôi phục cả 10 tấm ván không!",
        "description": "Level start - Instructions"
    },
    {
        "id": "correct_answer",
        "text": "Làm tốt lắm, Bé Thỏ! Một tấm ván nữa đã được khôi phục. Tiếp tục nhé!",
        "description": "Correct answer feedback"
    },
    {
        "id": "wrong_answer",
        "text": "Ồ! Chưa đúng. Hãy đếm cẩn thận và chọn lại nhé!",
        "description": "Wrong answer feedback"
    },
    {
        "id": "level_complete",
        "text": "Tuyệt vời! Bạn đã học được sức mạnh của những con số!",
        "description": "Level completion celebration"
    }
]

async def generate_voice(dialogue: dict) -> None:
    """Generate a single voice MP3 file"""
    output_path = os.path.join(OUTPUT_DIR, f"{dialogue['id']}.mp3")
    
    print(f"Generating: {dialogue['id']}.mp3")
    print(f"  Text: {dialogue['text'][:50]}...")
    
    communicate = edge_tts.Communicate(dialogue['text'], VOICE)
    await communicate.save(output_path)
    
    print(f"  ✓ Saved to {output_path}")

async def main():
    """Generate all voice files"""
    # Create output directory if it doesn't exist
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    print("=" * 60)
    print("Bunnies Game - Voice Generation Script")
    print(f"Using voice: {VOICE}")
    print("=" * 60)
    print()
    
    for dialogue in DIALOGUES:
        await generate_voice(dialogue)
        print()
    
    print("=" * 60)
    print(f"✓ All {len(DIALOGUES)} voice files generated successfully!")
    print(f"  Location: {os.path.abspath(OUTPUT_DIR)}")
    print("=" * 60)

if __name__ == "__main__":
    asyncio.run(main())

