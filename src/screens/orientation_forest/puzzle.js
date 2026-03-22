/**
 * puzzle.js — Khu Rừng Định Hướng: visual-first (thiếu nhi chưa biết chữ).
 *
 * Gameplay bằng hình ảnh: một vật (cluePool) xuất hiện ở vị trí tương đối
 * so với Sóc (trái/phải/trước/sau) — trẻ chọn mũi tên đúng hướng.
 * Voice narration là kênh chính truyền tải nội dung, text chỉ bổ trợ.
 */
const OrientationForestPuzzle = {
    version: 2,

    /** Nền video (mp4 + âm trong video); màn city duy nhất dùng video. */
    background: {
        type: 'video',
        imageKey: 'orientation_forest_bg',
        imageUrl: 'screens/orientation_forest/assets/backgrounds/bg.png',
        videoKey: 'orientation_forest_bg_video',
        videoUrl: 'screens/orientation_forest/assets/backgrounds/bg.mp4',
    },

    directionPool: [
        { id: 'left', icon: '←', labelVi: 'bên trái' },
        { id: 'right', icon: '→', labelVi: 'bên phải' },
        { id: 'forward', icon: '↑', labelVi: 'phía trước' },
        { id: 'back', icon: '↓', labelVi: 'phía sau' },
    ],

    /** Các vật thể hiển thị trên bản đồ — trẻ nhìn vị trí tương đối so với Sóc. */
    cluePool: [
        { emoji: '🌳', name: 'cây' },
        { emoji: '🍄', name: 'nấm' },
        { emoji: '🌸', name: 'hoa' },
        { emoji: '🦋', name: 'bướm' },
        { emoji: '⭐', name: 'ngôi sao' },
        { emoji: '🎈', name: 'bóng bay' },
        { emoji: '🍎', name: 'táo' },
        { emoji: '🐦', name: 'chim' },
    ],

    shuffle(arr) {
        const a = arr.slice();
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    },

    byId(id) {
        return this.directionPool.find(d => d.id === id) || this.directionPool[0];
    },

    /**
     * Sinh round trực quan: vật clue + hướng đúng + các nút chọn.
     * @param {number} choiceCount — số nút (2–4)
     * @param {string[]} questionHistory
     * @returns {{ clueEmoji: string, clueName: string, correctId: string, choices: Array }}
     */
    buildRound(choiceCount, questionHistory) {
        const pool = this.directionPool;
        const rnd = (n) => Math.floor(Math.random() * n);
        let correct = pool[rnd(pool.length)];
        let clue = this.cluePool[rnd(this.cluePool.length)];

        let guard = 0;
        while (guard < 50) {
            const key = `${correct.id}:${clue.emoji}`;
            if (!questionHistory.includes(key)) break;
            correct = pool[rnd(pool.length)];
            clue = this.cluePool[rnd(this.cluePool.length)];
            guard++;
        }
        questionHistory.push(`${correct.id}:${clue.emoji}`);
        if (questionHistory.length > 16) questionHistory.shift();

        const n = Math.min(4, Math.max(2, choiceCount));
        const others = pool.filter(d => d.id !== correct.id);
        const wrongPick = this.shuffle(others).slice(0, n - 1);
        const choices = this.shuffle([correct, ...wrongPick]);

        return { clueEmoji: clue.emoji, clueName: clue.name, correctId: correct.id, choices };
    },

    audio: {
        bgm: 'bgm_orientation_forest',
        intro1: 'voice_intro_1',
        intro2: 'voice_intro_2',
        intro3: 'voice_intro_3',
        correctVoice: 'voice_correct',
        wrongVoice: 'voice_wrong',
        completeVoice: 'voice_complete',
    },

    events: {
        correct: 'OrientationForestScreen:CorrectAnswer',
        wrong: 'OrientationForestScreen:WrongAnswer',
        directionCollected: 'OrientationForestScreen:DirectionCollected',
        levelComplete: 'OrientationForestScreen:LevelComplete',
    },
};
