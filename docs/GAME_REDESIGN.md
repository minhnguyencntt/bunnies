# Phase 2 — Game Redesign (per game)

Every game keeps its **original name** and **educational goal**, and gains 3 levels.
Level labels are child-friendly ranks, not age ranges:

| Level | Label | Design target (constraint, not UI) |
|---|---|---|
| Màn 1 | 🌱 Nhà Thám Hiểm (Explorer) | 3–5 years: simple interaction, big targets, no timer, direct hints |
| Màn 2 | ⚔️ Nhà Phiêu Lưu (Adventurer) | 6–10 years: more objects/choices, multi-step, light timer, partial hints |
| Màn 3 | 👑 Bậc Thầy (Master) | 10–15 years: multi-step reasoning, subtlety, time pressure, conceptual hints |

All games run on the shared Game Engine: unified Score (0–100) → Stars (⭐/⭐⭐/⭐⭐⭐)
→ XP → Awards → Stickers → Knowledge Gems → World Progression. Levels unlock
sequentially (finish Màn 1 to open Màn 2, etc.). Adaptive difficulty nudges each
level's parameters up/down within the session based on rolling accuracy, streaks,
mistakes and hint usage.

---

## 1. Khu Rừng Đếm Số (Counting Forest) — Addition

1. **Game Name** — Khu Rừng Đếm Số (kept).
2. **Educational Goal** — addition: combining two groups into a total (kept).
3. **Current Gameplay** — drag the correct number card onto a bridge plank, 10 rounds.
4. **Problems** — abstract quiz; no physical model of addition; flat difficulty.
5. **New Gameplay Concept** — Bunnine harvests with the child: combine apple groups,
   choose crystal paths, solve animated crystal stories.
6. **Core Gameplay Loop** — See → Count/Combine → Act (drag/choose) → Feedback → Score → Reward → Progress.
7. **Main Mechanics** — drag & collect, path choice, multi-step story problem.
8. **Level 1 — Thu Hoạch Táo** — two apple groups (a + b ≤ 5) sit on trees; the child drags every apple into Bunnine's basket; the basket counts up; the equation `🍎🍎 + 🍎 = 3` is revealed from what the child physically did. No failure state, no timer, huge touch targets.
9. **Level 2 — Đường Pha Lê** — `a + b = ?` (≤ 10) on a sign; 3 forest paths each with a number sign; tap the right one and Bunnine runs the path collecting 💎. 25s soft timer per round, 6 rounds.
10. **Level 3 — Nhiệm Vụ Pha Lê** — animated story: Bunnine has 15 💎, uses 6, finds 4 (`a − b + c ≤ 20`); crystals appear/fly away/fly in; 4 answer choices; 30s timer; combo matters.
11. **Difficulty Progression** — mathRange 5 → 10 → 20; interaction steps 1 → 2 → 3; choices 0 → 3 → 4; timer none → 25s → 30s; hints direct → partial → conceptual.
12. **Adaptive Difficulty** — 3 perfect answers: mathRange +2, +1 choice, −12% time (max tier +2). 2 consecutive mistakes: reverse (min tier −2) and richer hints.
13. **Scoring** — accuracy 55 + speed 10–15 + combo 0–10 + exploration 5–15 + perfect 10 + difficulty bonus 0/5/10 − hint penalty (2–4/hint, capped 15).
14. **Stars** — ⭐ complete; ⭐⭐ score ≥ 40; ⭐⭐⭐ ≥ 75 (L3: 45/78).
15. **Awards** — 🧺 Vụ Mùa Đầu Tiên (first completion), 🧠 Siêu Giải Toán (5-correct streak), 🪄 Phù Thủy Toán Học (3⭐ on Màn 3).
16. **Stickers** — 🍎 Táo Rừng (finish Màn 1), 💎 Pha Lê Xanh (Màn 2), 🐰 Bunnine Toán Học (3⭐ anywhere), 🌳 Cây Thần Kỳ (3 plays), ⭐ Ngôi Sao Số Học (no hints), 👑 Vương Miện Pha Lê (legendary, 3⭐ Màn 3).
17. **XP** — 50 / 100 / 200 base + bonuses (3⭐ +25/50/100, perfect +15/25/50, no-hint +10/20/40).
18. **Other Rewards** — Knowledge Gems (5/8/12 + 2/star + 5 perfect), world-map stars on the city marker (🥉🥈🥇 tiers at 3/6/9 stars).
19. **Bunnine Interaction** — Bunnine hosts the basket (L1), runs the chosen path (L2), stars in the story animation (L3), companion reacts happy/sad/celebrate on every action.
20. **Animation** — apple pop-in, drag physics, basket counter bounce, path run with sparkle trail, crystal fly-in/out, star bursts.
21. **Audio** — level BGM + Vietnamese voice (intro/correct/wrong/complete) reused per game.
22. **Hint System** — L1 highlights the basket + "Đếm từng quả…"; L2 partial text; L3 conceptual ("Tính từng bước một…").
23. **Replayability** — best score per level, 3⭐ chase, no-hint sticker, streak award, adaptive numbers keep rounds fresh.
24. **Win Condition** — complete all rounds of the level.
25. **Retry Condition** — wrong choices shake and encourage; the round repeats until solved (L1/L2) or advances gently on timeout (never a fail screen).
26. **Example Scenario** — L2: "4 + 5 = ?" → child taps sign `9` → Bunnine dashes up the path, collects 3 💎, combo x4 🔥, score jumps, ⭐⭐⭐ meter fills.

---

## 2. Đồi Phép Trừ (Subtraction Hill) — Subtraction

1. **Game Name** — Đồi Phép Trừ (kept).
2. **Educational Goal** — subtraction: taking away / what remains (kept).
3. **Current Gameplay** — tap the correct answer to `a − b`, fox collects an item, 6 rounds.
4. **Problems** — the "taking away" is never shown; pure quiz; flat difficulty.
5. **New Gameplay Concept** — Cáo Con's things roll down the hill; the child rescues what remains, packs baskets, and follows multi-step journey stories.
6. **Core Gameplay Loop** — Watch items leave → Collect/pack what remains → Say the remainder → Feedback → Reward.
7. **Main Mechanics** — collect-the-remainder (tap), pack-exactly-N (drag), story problem (choose).
8. **Level 1 — Táo Lăn Đồi** — `a` items (≤ 5) appear; `b` visibly roll off the hill; the child taps each remaining item into the basket; the equation `5 − 1 = 4` is revealed from the child's own counting. No timer.
9. **Level 2 — Giỏ Quà Của Cáo** — "Có 9 quả, xếp 4 vào giỏ" — drag exactly 4 into the basket (counter `🧺 2/4`), then answer "còn lại mấy?" from 3 choices. 25s timer, 6 rounds.
10. **Level 3 — Hành Trình Của Cáo** — animated story `a − b ± c` (≤ 20): items appear, some given away, some added/lost again; 4 choices; 30s timer.
11. **Difficulty Progression** — mathRange 5 → 10 → 20; steps 1 → 2 → 3; choices 0 → 3 → 4; timer none → 25s → 30s.
12. **Adaptive Difficulty** — same engine as all games (tier −2…+2 adjusts range/choices/time/hints).
13. **Scoring** — same unified formula (accuracy/speed/combo/exploration/perfect/difficulty − hint penalty).
14. **Stars** — ⭐ complete; ⭐⭐ ≥ 40; ⭐⭐⭐ ≥ 75 (L3 45/78).
15. **Awards** — 💝 Trái Tim Tử Tế (first completion), 🔥 Chuỗi Thắng Lợi (5 streak), 🪄 Pháp Sư Phép Trừ (3⭐ Màn 3).
16. **Stickers** — 🦊 Cáo Con (Màn 1), 🧺 Giỏ Quà (Màn 2), 🍬 Kẹo Số (3⭐ any), 🏮 Đèn Lồng Đồi (3 plays), ⭐ Sao Phép Trừ (no hints), 💞 Sum Họp (legendary, 3⭐ Màn 3).
17. **XP** — 50 / 100 / 200 base + standard bonuses.
18. **Other Rewards** — gems, marker star tiers, world progress.
19. **Bunnine Interaction** — companion reacts and hints; Cáo Con is the story NPC whose items the child rescues.
20. **Animation** — items roll away down the hill (rotate + fade), fly into the basket, pack counter bounce, journey animation.
21. **Audio** — level BGM + voice set.
22. **Hint System** — L1 highlights the basket; L2 "đếm phần KHÔNG trong giỏ"; L3 "cho đi thì bớt, được thêm thì tăng".
23. **Replayability** — item pool randomizes (10 lost items), best scores, sticker/award chase.
24. **Win Condition** — finish all rounds.
25. **Retry Condition** — gentle shake + encouragement; basket-full mistakes explain the rule ("Giỏ đủ rồi!").
26. **Example Scenario** — L1: 5 🎩 appear, 1 rolls off spinning; child taps the 4 remaining hats into the basket; "5 − 1 = 4" revealed; Bunnine cheers.

---

## 3. Thành Phố Gương (Mirror City) — Find the Difference

1. **Game Name** — Thành Phố Gương (kept).
2. **Educational Goal** — observation & visual discrimination (kept).
3. **Current Gameplay** — gallery of 10 mirrors, each a 1-difference picture pair; tap the difference.
4. **Problems** — always exactly 1 difference; no escalation within/across sessions; no timer/combo; flat reward.
5. **New Gameplay Concept** — repair the magic mirrors: procedurally generated scene pairs with 1 → 3 → 5 differences of increasing subtlety.
6. **Core Gameplay Loop** — Observe → Compare → Detect → Tap → Combo → Score.
7. **Main Mechanics** — spot-the-difference across 8 difference types: count, presence, color, size, shape, direction, position, rotation.
8. **Level 1 — Tấm Gương Nhỏ** — 5 large objects, 1 obvious difference (count or presence), no timer, 3 rounds, direct hint pulses the exact spot.
9. **Level 2 — Phòng Gương Lớn** — 8 objects, 3 differences (adds color/size/shape), 75s per round, combo for clean rounds.
10. **Level 3 — Đại Sảnh Gương** — 10 objects, 5 subtle differences (all 8 types incl. orientation/position/rotation), 90s per round, distractions high.
11. **Difficulty Progression** — differences 1 → 3 → 5; objects 5 → 8 → 10; subtlety obvious → medium → subtle; timer none → 75s → 90s.
12. **Adaptive Difficulty** — object count ±tier; struggling players get richer hint targeting.
13. **Scoring** — unified formula; mis-taps count as mistakes (lose perfect bonus + break combo) but never punish harshly (soft 💭 puff).
14. **Stars** — ⭐ complete; ⭐⭐ ≥ 40; ⭐⭐⭐ ≥ 75 (L3 45/78).
15. **Awards** — 🔍 Thám Tử Nhí (first completion), 🦅 Mắt Diều Hâu (a perfect round — all differences, zero mis-taps), 👀 Anh Hùng Quan Sát (no hints).
16. **Stickers** — 🪞 Gương Thần (Màn 1), 🕵️ Huy Hiệu Bí Ẩn (Màn 2), 🏠 Nhà Bí Ẩn (3 plays), 👁️ Mắt Ưng (3⭐ any), ⭐ Sao Quan Sát (no hints), 🌟 Huyền Thoại Gương (legendary, 3⭐ Màn 3).
17. **XP** — 50 / 100 / 200 base + standard bonuses.
18. **Other Rewards** — gems, marker tiers, world progress.
19. **Bunnine Interaction** — companion celebrates each find ("Mắt tinh quá! ✨"), reacts softly to mis-taps, delivers hints.
20. **Animation** — golden ring + sparkles on found differences, progress pips ⭕→✅, gentle 💭 puff on mis-tap.
21. **Audio** — level BGM + voice set.
22. **Hint System** — L1 pulses the exact difference; L2 pulses a wide area; L3 conceptual strategy text only.
23. **Replayability** — procedural scenes (4 themes × emoji pools × seeded layouts × mutation combos) mean no two sessions repeat.
24. **Win Condition** — find all differences in all 3 rounds.
25. **Retry Condition** — mis-taps are soft; timeout advances to the next round with encouragement.
26. **Example Scenario** — L3: a garden scene; the reflection has one fewer 🦋, a flipped 🐌, a smaller 🍄, a rotated 🪁 and a 🌷→🌹 color swap; the child finds all 5 with 12s left → combo bonus + Speed Star progress.

---

## 4. Khu Rừng Định Hướng (Orientation Forest) — Spatial Orientation

1. **Game Name** — Khu Rừng Định Hướng (kept).
2. **Educational Goal** — left/right/forward/back orientation; Màn 3 adds working memory & sequencing (kept + deepened).
3. **Current Gameplay** — object appears beside Sóc; tap the matching arrow; 6 rounds.
4. **Problems** — single mechanic; no memory load; no escalation.
5. **New Gameplay Concept** — guide Sóc home: from spotting directions to memorizing a route.
6. **Core Gameplay Loop** — Observe → Locate → Choose direction → Sóc hops → Reward; L3: Watch → Remember → Repeat the sequence → Guide Sóc.
7. **Main Mechanics** — direction choice (2 → 4 arrows), sequence memory (repeat 2–5 step route).
8. **Level 1 — Trái Hay Phải** — object appears left/right of Sóc; 2 big arrows; no timer; 5 rounds.
9. **Level 2 — Bốn Hướng** — object at one of 4 positions; 4 arrows; 20s timer; 6 rounds.
10. **Level 3 — Dẫn Đường Cho Sóc** — a route of 2–5 arrows flashes one by one, hides, and the child replays it in order; Sóc hops each correct step toward the 🌰; 40s timer; 4 rounds.
11. **Difficulty Progression** — choices 2 → 4 → 4; memory load 1 → 2 → 4; interaction steps 1 → 1 → sequence; timer none → 20s → 40s.
12. **Adaptive Difficulty** — sequence length ±1 by tier; timer ±12%/tier.
13. **Scoring** — unified formula; a wrong sequence step = mistake, sequence replays once for free (learning-first).
14. **Stars** — ⭐ complete; ⭐⭐ ≥ 40; ⭐⭐⭐ ≥ 75 (L3 45/78).
15. **Awards** — 🧭 Người Tìm Đường (first completion), 🧠 Bậc Thầy Trí Nhớ (perfect sequence round), 🏹 Mũi Tên Vàng (3⭐ Màn 3).
16. **Stickers** — 🐿️ Sóc Nâu (Màn 1), 🧭 La Bàn (Màn 2), 🌰 Hạt Dẻ Vàng (3⭐ any), 🪧 Biển Chỉ Đường (3 plays), ⭐ Sao Định Hướng (no hints), 🗺️ Bản Đồ Kho Báu (legendary, 3⭐ Màn 3).
17. **XP** — 50 / 100 / 200 base + standard bonuses.
18. **Other Rewards** — gems, marker tiers, world progress.
19. **Bunnine Interaction** — companion narrates and hints; Sóc hops in the chosen direction (immediate embodied feedback).
20. **Animation** — clue pop-in with pulsing ring, Sóc hop per step, sequence flash reveal.
21. **Audio** — level BGM + voice set.
22. **Hint System** — L1 "chạm mũi tên chỉ về phía vật"; L2 "tưởng tượng bạn là Sóc"; L3 "chia trình tự thành cụm nhỏ" (+ direct next-arrow reveal when struggling).
23. **Replayability** — random clues/directions/sequences; memory-length chase; perfect-round award.
24. **Win Condition** — finish all rounds.
25. **Retry Condition** — wrong direction: gentle shake, try again; wrong sequence: free replay, no punishment.
26. **Example Scenario** — L3: ➡️⬆️➡️⬇️ flashes; child taps them back in order; Sóc hops right-up-right-down and grabs the 🌰; "Bậc Thầy Trí Nhớ" progress +1.

---

## Global Awards (all games)

| Award | Requirement | Reward |
|---|---|---|
| 🎒 Cuộc Phiêu Lưu Đầu Tiên | Finish any game once | +50 XP |
| 💯 Vòng Chơi Hoàn Hảo | Finish a session with zero mistakes | +80 XP |
| ⚡ Sao Tốc Độ | Finish faster than target time | +80 XP |
| 🌟 Nhà Sưu Tầm Sao | 12 total stars | +100 XP, +15 💎 |
| 🗺️ Nhà Thám Hiểm Vĩ Đại | Play every game | +150 XP, +20 💎 |
| 🏆 Bậc Thầy Tri Thức | 3⭐ Màn 3 in every game | +300 XP, +50 💎 |
