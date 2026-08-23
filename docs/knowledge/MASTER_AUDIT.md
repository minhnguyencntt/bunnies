# Master Audit & Gap Analysis (2026-08-23, second pass)

Source of truth: **current code + interaction model**, not previous reports.
Previous master-refactor marked Navigation/HUD as DONE. Re-audit found they
are still **BROKEN / PARTIAL** for a child playing on a tablet.

## Gap matrix

| Requirement | Status | Evidence | Missing | Action | Priority |
|---|---|---|---|---|---|
| 3D visual system | PARTIAL | Tokens exist; HUD is a dark-brown educational bar | Storybook chrome | Soft floating chips, no full-width bar | P1 |
| Global button system | PARTIAL | UISystem exists; games still hand-draw panels | Consistent chrome/chips | `UISystem.chip` + panel reuse | P1 |
| Global icon system | PARTIAL | Emoji map only (◀🏠⚙️🎟 mixed weights) | One drawn language | Vector `IconSystem` | P1 |
| Navigation system | BROKEN | No shared router; each screen invents Back/Home | One NavSystem | `NavSystem` + route table | P0 |
| Back behavior | BROKEN | Result/Pause skip Level Select → dump on map | Back = previous | Result/Pause → Level Select | P0 |
| Home behavior | PARTIAL | Only “🗺 Bản đồ” text, no standard Home control | Explicit Home | Home control via NavSystem | P0 |
| Top-left visibility | PARTIAL | 26px button sits inside dark bar, easy to miss | Elevated floating Back | Chrome outside the world bar | P1 |
| Play button | PARTIAL | Level cards OK; map cities have no Play affordance | Visible Play on cities | Always-visible name + ▶ | P0 |
| Map tap / mobile | BROKEN | Hover-first: blur + speech; 1st tap ≠ play | Immediate tap→play | Remove hover gate | P0 |
| Marker hit areas | BROKEN | Circle offset to bottom-right of container | Centered hit | `setCenteredInput` | P0 |
| Bunny steal taps | BROKEN | Interactive hopping bunnies overlap city markers | Markers always win | Bunnies non-interactive | P0 |
| Non-blocking speech | BROKEN | Map hover starts voice before navigation | Speech never first | No hover speech | P0 |
| Modern BGM | PARTIAL | Warm engine regenerated | — | Keep | P2 |
| Multi-layer audio | DONE | Music+ambience+SFX+voice | — | — | — |
| Character system | DONE | Emotion map + sprites | — | — | — |
| Motion system | PARTIAL | Tokens exist; HUD/map invent timings | Use tokens | Nav/HUD use motion tokens | P2 |
| Reward system | DONE | Pipeline + result | Result has no Back | Add Back | P0 |
| Addition / subtraction | DONE | 4 math games, visual | Layout overlaps HUD | Safe-zone Y | P1 |
| 3-answer system | DONE | VisualMathScreen | — | — | — |
| Level locking | DONE | Engine always-unlocked | Album still shows 🔒 for unearned stickers (OK — rewards, not access) | — | — |
| Game screen calm | BROKEN | Dark bar + 50-char title + timer + combo + eq @ y=108 overlap | Safe layout | Compact chrome + layout tokens | P0 |
| AGENTS / SKILL | PARTIAL | Docs describe the broken Result→Map flow | Correct flow | Update ADR/skill | P1 |
| Full-game migration | PARTIAL | Shared screens only | Menu + HUD + Result | This pass | P0 |
| QA | PARTIAL | Prior E2E missed hover-gate & hit-area | Nav + visual | New harness | P0 |

## Confirmed navigation defects (why it “still doesn’t work”)

1. **Hover-first map (mobile):** `pointerover` darkens the world and plays speech.
   On touch, the first tap often only “hovers”. Child thinks Play failed.
2. **Offset marker hit-areas:** circle is placed at `(r, r)` on a container whose
   origin is centered → tap target sits bottom-right of the visible icon.
3. **Hopping bunnies steal taps** over Đồi Phép Trừ / Rừng Định Hướng.
4. **Result & Pause “Bản đồ” skip Level Select.** After a level the child cannot
   pick Màn 2 without hunting the city on the map again.
5. **No shared navigator.** Back/Home callbacks are copy-pasted and diverge.

## Screen chaos (why games feel “lộn xộn”)

- Game HUD is a 64px **dark-brown full-width bar** (legacy educational-app look)
  with a title like `🌲 Khu Rừng Đếm Số · Màn 1 🌱 Nhà Thám Hiểm · Câu 1/5`.
- Equation / story panels sit at **y = 108**, overlapping HUD + timer + combo.
- Menu: brown HUD + pulsing Album + hidden city names + blur overlay + 3
  interactive bunnies + sparkles + fireflies + hover speech.

## Plan (systems first)

1. `NavSystem` — one route table, instant leave, Back ≠ Home.
2. `IconSystem` — crisp vector icons, one weight.
3. Storybook chrome (`UISystem.chip` + floating HUD) + `DesignTokens.layout`.
4. Migrate Menu, Level Select, GameShell, Result, Album, Settings, math Y.
5. Second audit + E2E (map tap, back stack, play button, no hover gate).
