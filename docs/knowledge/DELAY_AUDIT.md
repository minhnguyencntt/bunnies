# Delay / Sleep Audit

Artificial waits found in `src/` (excluding `lib/phaser.min.js`). Classified
for the completion / interaction refactor.

| Location | Purpose | Blocking? | Replacement | Status |
|---|---|---|---|---|
| `GameShell.answerCorrect` 1600ms → Result | Wait for celebration before next/complete | **Yes** — last question felt unfinished | Last round → `completeGame()` immediately; mid-round 480ms pacing only | **Fixed** |
| `GameShell.finishSession` 450ms | Delay before ResultScreen | **Yes** | Launch Result immediately via CompletionEngine | **Fixed** |
| `GameShell.create` 400ms before intro | Cosmetic wait | Soft | Call `playIntro()` immediately; Skip is already available | **Fixed** |
| `GameShell.playIntro` minMs 2000 | Force-watch intro | Soft (Skip existed) | `minMs: 0` | **Fixed** |
| `GameShell.answerWrong` fatal 1400ms | Wait shake before next | Soft | Last round immediate; else 400ms pacing | **Fixed** |
| `GameShell.handleTimeout` 1200ms | Wait speech before next | Soft | Last round immediate; else 400ms pacing | **Fixed** |
| `VisualMathScreen` guided 1200ms auto-advance | Wait speech then advance | **Yes** | Highlight correct button; child taps; `answerCorrect` | **Fixed** |
| `UISystem` press tween vs hover | Tweens fought pointerover/out | **Yes** — missed/delayed clicks | Immediate `setScale` + bindTap state machine | **Fixed** |
| `NavSystem.go` (none) | Duplicate taps could double-navigate | **Yes** | `_navTx` action transaction, no sleep. Phaser reuses scenes so `ready()` clears the lock on the destination | **Fixed** |
| `VisualMathScreen` 1200 / 2100 askDelay | Show objects then ask | No (gameplay beat) | Keep — not on the tap path | Keep |
| `VisualMathScreen` 900ms before guided | Let wrong-feedback play | No (HUD still live) | Keep short | Keep |
| `IntroHelper` duration timer | Auto-start after skip window | No — Skip is instant | Keep timer; `minMs` 0 from shell | Keep |
| `ResultScreen` 80ms star SFX stagger | Decorative audio | No | Keep | Keep |
| `GameShell` sparkle i*70 | Decorative | No | Now owned by RewardPresentationEngine celebrate | Keep |
| `GameShell.companionSay` bubble lifetime | Hide bubble | No | Keep | Keep |
| `GameShell` score tween 400ms | Number roll | No | Keep | Keep |
| `menu_screen.js` bunny hop timers | Ambient decoration | No | Keep | Keep |
| `Bunny/Bird/Firefly/Butterfly` behavior timers | Ambient AI | No | Keep | Keep |
| `AudioEngine` duck timeout | Mix restore | No | Keep | Keep |
| `MusicEngine` fade setTimeout | Theme fade | No | Keep | Keep |
| `AmbienceEngine` stop setTimeout | Voice node teardown | No | Keep | Keep |
| `BootScreen` 30ms | Layout tick | No | Keep | Keep |
| `StickerAlbumScreen` 2800ms | Teaser pulse | No | Keep | Keep |
| `counting/subtraction/orientation` spawn delays | Round presentation | No | Keep | Keep |

## Rule

Do not add `delayedCall` / `setTimeout` on: button feedback, navigation,
speech completion, reward reveal, or enabling next actions.
