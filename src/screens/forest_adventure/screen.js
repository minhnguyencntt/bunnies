/**
 * screen.js — Rừng Diệu Kỳ (Forest Adventure). Educational goal: SUBTRACTION.
 * Visual multiple-choice: objects appear → some fly away → equation → 3 choices.
 * Runs on VisualMathScreen (Game Engine + Audio System included).
 */
class ForestAdventureScreen extends VisualMathScreen {
    constructor() {
        super('ForestAdventureScreen');
        this.gameId = 'forest_adventure';
        this.theme = typeof ForestAdventurePuzzle !== 'undefined' ? ForestAdventurePuzzle : null;
        this.fireflies = [];
    }

    onPreload() {
        this.load.image('forest_adventure_bg', 'screens/forest_adventure/assets/backgrounds/bg.png');
        this.preloadCommonAudio('forest_adventure');
    }

    buildWorld(w, h) {
        this.buildThemedWorld(w, h);
        // Fireflies make the forest feel alive
        if (typeof generateFireflies === 'function' && typeof createMenuFirefly === 'function') {
            generateFireflies(this, 6).forEach(data => {
                const f = createMenuFirefly(this, data);
                if (f) {
                    f.x = Phaser.Math.Between(w * 0.1, w * 0.9);
                    f.y = Phaser.Math.Between(h * 0.25, h * 0.6);
                    this.fireflies.push(f);
                }
            });
        }
    }

    update() {
        this.fireflies.forEach(f => {
            const bs = f.getData('behaviorSystem');
            if (bs?.update) bs.update(this.fireflies);
        });
    }

    introText() {
        return {
            1: 'Vào Rừng Diệu Kỳ thôi! Nấm bay đi mất rồi — đếm xem còn lại bao nhiêu nhé!',
            2: 'Đom đóm bay lượn trong rừng! Bớt đi rồi đếm phần còn lại nào!',
            3: 'Đêm trong rừng thật bí ẩn! Những phép trừ khó hơn đang chờ bạn!',
        }[this.level];
    }
}
