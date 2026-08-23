/**
 * screen.js — Vườn Kẹo Ngọt (Candy Garden). Educational goal: ADDITION.
 * Visual multiple-choice: candy groups combine → equation → 3 big choices.
 * Runs on VisualMathScreen (Game Engine + Audio System included).
 */
class CandyGardenScreen extends VisualMathScreen {
    constructor() {
        super('CandyGardenScreen');
        this.gameId = 'candy_garden';
        this.theme = typeof CandyGardenPuzzle !== 'undefined' ? CandyGardenPuzzle : null;
    }

    onPreload() {
        this.preloadCommonAudio('candy_garden');
    }

    buildWorld(w, h) {
        this.buildThemedWorld(w, h);
    }

    introText() {
        return {
            1: 'Chào mừng đến Vườn Kẹo Ngọt! Đếm kẹo hai bên rồi chọn đáp án đúng nhé!',
            2: 'Tiệc kẹo bắt đầu! Gộp hai nhóm kẹo lại và chọn tổng đúng nào!',
            3: 'Đại tiệc kẹo lớn! Những phép cộng khó hơn đang chờ bạn — cố lên nhé!',
        }[this.level];
    }
}
