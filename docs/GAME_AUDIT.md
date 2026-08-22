# Phase 1 — Game Audit

Audit of every existing game in **Bunnine & Knowledge World** before the redesign.
Original names and educational goals are preserved; everything else was redesigned.

| Game (original name) | Educational Goal (kept) | Current Gameplay (before) | Problems | New Gameplay Direction |
|---|---|---|---|---|
| **Khu Rừng Đếm Số** (Counting Forest) | Addition | Text question "2 + 3 = ?" → drag one of 3 number cards onto a bridge plank → plank restores. 10 identical rounds. | Classic quiz loop (Question → Multiple Choice → Next). No physical sense of "adding = combining groups". No levels, no timer concept, no score depth (+10 flat), no replay value, one fixed difficulty. | **Màn 1 Thu Hoạch Táo**: physically drag two apple groups into Bunnine's basket — addition as combining. **Màn 2 Đường Pha Lê**: pick the path whose sign equals the sum; Bunnine runs it and collects crystals. **Màn 3 Nhiệm Vụ Pha Lê**: animated multi-step story problems (15 − 6 + 4). |
| **Đồi Phép Trừ** (Subtraction Hill) | Subtraction | Text question "8 − 3 = ?" → tap one of 4 answer buttons → fox collects a lost item. 6 identical rounds. | Abstract; child never *sees* "taking away". No levels, flat scoring, no persistence, no reason to replay. | **Màn 1 Táo Lăn Đồi**: items visibly roll away; child taps each *remaining* item to collect it — subtraction as "what's left". **Màn 2 Giỏ Quà Của Cáo**: drag exactly *b* items into the basket, then tell the remainder (multi-step). **Màn 3 Hành Trình Của Cáo**: animated multi-step stories (a − b ± c) under time pressure. |
| **Thành Phố Gương** (Mirror City) | Observation / visual discrimination | 10 procedurally drawn mirror pairs in a gallery; each has exactly 1 difference; tap it; hint button; no timer, no levels. | Single difference per image regardless of age; no difficulty curve within a round; no combo/score system; reward is a static panel; long flat session of 10 identical puzzles. | **Màn 1 Tấm Gương Nhỏ**: 1 obvious difference (count/presence), big objects, no timer. **Màn 2 Phòng Gương Lớn**: 3 differences per scene, more objects, light timer, combo. **Màn 3 Đại Sảnh Gương**: 5 subtle differences (color, size, orientation, position, pattern, quantity), time challenge, limited hints. |
| **Khu Rừng Định Hướng** (Orientation Forest) | Spatial orientation (left/right/forward/back) | Object appears next to the squirrel; child taps one of 2–4 arrow buttons. 6 identical rounds. | One mechanic only; no memory or sequencing; no progression; static difficulty. | **Màn 1 Trái Hay Phải**: 2 big arrows, no timer. **Màn 2 Bốn Hướng**: 4 directions, light timer. **Màn 3 Dẫn Đường Cho Sóc**: watch a flashing arrow sequence, then repeat it from memory to walk Sóc to the acorn — orientation + working memory + sequencing. |

## Cross-cutting problems (all games, before)

1. **No level system** — one fixed difficulty per game; ages 4 and 12 get the same challenge.
2. **No meaningful score** — flat +10 per answer; no accuracy/speed/combo/perfect components.
3. **No stars, awards, stickers, XP, gems, or persistence** — every session erased (`window.gameData` only).
4. **No world progression** — the 30-city map is decorative; nothing visibly progresses.
5. **Quiz-first interaction** — Question → Multiple Choice → Answer → Next Question.
6. **Bunnine is a mascot, not a participant** — characters react but never play.
7. **No adaptive difficulty** — a struggling child and a fluent child get identical rounds.
8. **No structured hint system** — hints are per-game ad-hoc and free of design rules.

These are addressed by the Game Engine (see `docs/GAME_ENGINE.md`) and the per-game redesign (see `docs/GAME_REDESIGN.md`).
