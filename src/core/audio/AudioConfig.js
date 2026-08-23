/**
 * AudioConfig.js — audio asset & profile configuration (localization-ready).
 *
 * VOICE_LIBRARY: every spoken line. `file` is the generated mp3 (edge-tts,
 * see scripts/voice_library.json); `vi`/`en` text drives the speech-synthesis
 * fallback and future locales. Gameplay code never hard-codes audio paths —
 * it references line ids and categories only.
 *
 * VOICE_CATEGORIES: variation pools with cooldowns (anti-fatigue).
 * GAME_AUDIO: per-game AudioConfig (theme, ambience, instruction lines).
 */

const VOICE_LIBRARY = {
    // ── Correct feedback variations (Bunnine, warm) ──
    correct_1: { vi: 'Giỏi quá!', en: 'Great job!', voice: 'bunnine' },
    correct_2: { vi: 'Tuyệt vời!', en: 'Wonderful!', voice: 'bunnine' },
    correct_3: { vi: 'Đúng rồi!', en: "That's right!", voice: 'bunnine' },
    correct_4: { vi: 'Xuất sắc!', en: 'Excellent!', voice: 'bunnine' },
    correct_5: { vi: 'Hay quá!', en: 'Awesome!', voice: 'bunnine' },
    correct_6: { vi: 'Chính xác!', en: 'Exactly!', voice: 'bunnine' },
    correct_7: { vi: 'Bạn thật giỏi!', en: 'You are so good!', voice: 'bunnine' },
    correct_8: { vi: 'Siêu đỉnh!', en: 'Super!', voice: 'bunnine' },

    // ── Gentle retry / encouragement ──
    wrong_1: { vi: 'Gần đúng rồi! Thử lại nhé!', en: 'Almost! Try again!', voice: 'bunnine' },
    wrong_2: { vi: 'Không sao, thử lại nào!', en: "It's okay, try again!", voice: 'bunnine' },
    wrong_3: { vi: 'Cố lên, bạn làm được!', en: 'Keep going, you can do it!', voice: 'bunnine' },
    wrong_4: { vi: 'Suýt đúng rồi!', en: 'So close!', voice: 'bunnine' },
    wrong_5: { vi: 'Thử lại một lần nữa nhé!', en: 'Try one more time!', voice: 'bunnine' },
    wrong_6: { vi: 'Bunnine tin bạn mà!', en: 'Bunnine believes in you!', voice: 'bunnine' },

    // ── Hints ──
    hint_1: { vi: 'Đây là gợi ý nhỏ này.', en: 'Here is a little hint.', voice: 'narrator' },
    hint_2: { vi: 'Nhìn kỹ nhé.', en: 'Look carefully.', voice: 'narrator' },
    hint_3: { vi: 'Bunnine giúp bạn này.', en: 'Bunnine will help you.', voice: 'bunnine' },

    // ── Session flow ──
    start_1: { vi: 'Cùng chơi với Bunnine nhé!', en: "Let's play with Bunnine!", voice: 'bunnine' },
    start_2: { vi: 'Bắt đầu thôi!', en: "Let's go!", voice: 'bunnine' },
    near_done_1: { vi: 'Sắp xong rồi! Cố lên!', en: 'Almost done! Keep going!', voice: 'bunnine' },
    complete_1: { vi: 'Bạn đã hoàn thành! Tuyệt vời!', en: 'You did it! Wonderful!', voice: 'bunnine' },
    complete_2: { vi: 'Hoàn thành rồi! Giỏi lắm!', en: 'Completed! Well done!', voice: 'bunnine' },

    // ── Reward moments ──
    sticker_new: { vi: 'Sticker mới!', en: 'A new sticker!', voice: 'bunnine' },
    award_new: { vi: 'Huy hiệu mới!', en: 'A new award!', voice: 'bunnine' },
    levelup: { vi: 'Lên cấp rồi!', en: 'Level up!', voice: 'bunnine' },

    // ── Bunnine character reactions (used sparingly) ──
    bunny_wow: { vi: 'Ồ ó!', en: 'Whoa!', voice: 'bunnine' },
    bunny_letsgo: { vi: 'Đi thôi!', en: "Let's go!", voice: 'bunnine' },
    bunny_wedidit: { vi: 'Ta làm được rồi!', en: 'We did it!', voice: 'bunnine' },
    bunny_hmm: { vi: 'Hừm…', en: 'Hmm…', voice: 'bunnine' },
    bunny_keepgoing: { vi: 'Cố lên!', en: 'Keep going!', voice: 'bunnine' },
    bunny_yay: { vi: 'Yeah!', en: 'Yay!', voice: 'bunnine' },

    // ── Educational counting (synced with visual counting) ──
    ...Object.fromEntries(Array.from({ length: 20 }, (_, i) => [
        `count_${i + 1}`,
        { vi: ['Một', 'Hai', 'Ba', 'Bốn', 'Năm', 'Sáu', 'Bảy', 'Tám', 'Chín', 'Mười',
               'Mười một', 'Mười hai', 'Mười ba', 'Mười bốn', 'Mười lăm', 'Mười sáu',
               'Mười bảy', 'Mười tám', 'Mười chín', 'Hai mươi'][i], en: String(i + 1), voice: 'narrator' },
    ])),

    // ── Per-game, per-level instructions (match the redesigned gameplay) ──
    instr_counting_forest_1: { vi: 'Kéo táo vào giỏ giúp Bunnine nhé!', en: 'Drag the apples into Bunnine\'s basket!', voice: 'narrator', game: 'counting_forest', level: 1 },
    instr_counting_forest_2: { vi: 'Cộng hai số, rồi chọn con đường có biển số đúng!', en: 'Add the two numbers, then choose the path with the right sign!', voice: 'narrator', game: 'counting_forest', level: 2 },
    instr_counting_forest_3: { vi: 'Nghe kỹ câu chuyện, rồi tính xem Bunnine còn bao nhiêu pha lê!', en: 'Listen to the story, then work out how many crystals Bunnine has!', voice: 'narrator', game: 'counting_forest', level: 3 },
    instr_subtraction_hill_1: { vi: 'Đồ của Cáo lăn đi rồi! Nhặt những món còn lại nhé!', en: 'Fox\'s things rolled away! Collect the ones that are left!', voice: 'narrator', game: 'subtraction_hill', level: 1 },
    instr_subtraction_hill_2: { vi: 'Xếp đủ đồ vào giỏ, rồi đếm xem còn lại bao nhiêu!', en: 'Pack the basket, then count how many are left!', voice: 'narrator', game: 'subtraction_hill', level: 2 },
    instr_subtraction_hill_3: { vi: 'Theo dõi hành trình của Cáo, rồi tính số đồ còn lại!', en: 'Follow Fox\'s journey, then work out what is left!', voice: 'narrator', game: 'subtraction_hill', level: 3 },
    instr_mirror_city_1: { vi: 'Tìm một điểm khác nhau giữa hai bức tranh nhé!', en: 'Find one difference between the two pictures!', voice: 'narrator', game: 'mirror_city', level: 1 },
    instr_mirror_city_2: { vi: 'Tìm ba điểm khác nhau. Nhìn thật kỹ nhé!', en: 'Find three differences. Look carefully!', voice: 'narrator', game: 'mirror_city', level: 2 },
    instr_mirror_city_3: { vi: 'Có gì đó đã thay đổi. Bạn có tìm ra hết không?', en: 'Something has changed. Can you spot them all?', voice: 'narrator', game: 'mirror_city', level: 3 },
    instr_orientation_forest_1: { vi: 'Vật ở bên trái hay bên phải Sóc nhỉ?', en: 'Is the object on Squirrel\'s left or right?', voice: 'narrator', game: 'orientation_forest', level: 1 },
    instr_orientation_forest_2: { vi: 'Vật ở hướng nào của Sóc? Trái, phải, trước hay sau?', en: 'Which direction is the object? Left, right, front or back?', voice: 'narrator', game: 'orientation_forest', level: 2 },
    instr_orientation_forest_3: { vi: 'Nhớ các mũi tên, rồi dẫn Sóc đi đúng đường nhé!', en: 'Remember the arrows, then guide Squirrel the right way!', voice: 'narrator', game: 'orientation_forest', level: 3 },

    // ── Vườn Kẹo Ngọt (Candy Garden — addition) ──
    instr_candy_garden_1: { vi: 'Đếm kẹo hai bên, rồi chọn đáp án đúng nhé!', en: 'Count the candies on both sides, then pick the right answer!', voice: 'narrator', game: 'candy_garden', level: 1 },
    instr_candy_garden_2: { vi: 'Gộp hai nhóm kẹo lại và chọn tổng đúng nào!', en: 'Combine the two candy groups and pick the right total!', voice: 'narrator', game: 'candy_garden', level: 2 },
    instr_candy_garden_3: { vi: 'Những phép cộng khó hơn đang chờ bạn. Sẵn sàng chưa?', en: 'Harder additions await. Ready?', voice: 'narrator', game: 'candy_garden', level: 3 },

    // ── Rừng Diệu Kỳ (Forest Adventure — subtraction) ──
    instr_forest_adventure_1: { vi: 'Nấm bay đi mất rồi! Đếm xem còn lại bao nhiêu nhé!', en: 'Some mushrooms flew away! Count how many are left!', voice: 'narrator', game: 'forest_adventure', level: 1 },
    instr_forest_adventure_2: { vi: 'Bớt đi rồi đếm phần còn lại nào!', en: 'Take some away, then count what is left!', voice: 'narrator', game: 'forest_adventure', level: 2 },
    instr_forest_adventure_3: { vi: 'Đêm trong rừng thật bí ẩn. Tính xem còn lại bao nhiêu!', en: 'The forest night is mysterious. Work out how many remain!', voice: 'narrator', game: 'forest_adventure', level: 3 },
};

const VOICE_CATEGORIES = {
    correct: { lines: ['correct_1', 'correct_2', 'correct_3', 'correct_4', 'correct_5', 'correct_6', 'correct_7', 'correct_8'], cooldownMs: 2200 },
    wrong: { lines: ['wrong_1', 'wrong_2', 'wrong_3', 'wrong_4', 'wrong_5', 'wrong_6'], cooldownMs: 3000 },
    hint: { lines: ['hint_1', 'hint_2', 'hint_3'], cooldownMs: 4000 },
    start: { lines: ['start_1', 'start_2'], cooldownMs: 5000 },
    nearDone: { lines: ['near_done_1'], cooldownMs: 8000 },
    complete: { lines: ['complete_1', 'complete_2'], cooldownMs: 5000 },
    sticker: { lines: ['sticker_new'], cooldownMs: 3000 },
    award: { lines: ['award_new'], cooldownMs: 3000 },
    levelup: { lines: ['levelup'], cooldownMs: 5000 },
    bunnyReact: { lines: ['bunny_wow', 'bunny_letsgo', 'bunny_wedidit', 'bunny_hmm', 'bunny_keepgoing', 'bunny_yay'], cooldownMs: 9000 },
};

const GAME_AUDIO = {
    counting_forest: { theme: { key: 'bgm_counting_forest', url: 'screens/counting_forest/assets/audio/bgm/bgm.mp3', volume: 0.35 }, ambience: 'forest' },
    subtraction_hill: { theme: { key: 'bgm_subtraction_hill', url: 'screens/subtraction_hill/assets/audio/bgm/bgm.mp3', volume: 0.35 }, ambience: 'forest' },
    mirror_city: { theme: { key: 'bgm_mirror_city', url: 'screens/mirror_city/assets/audio/bgm/bgm.mp3', volume: 0.35 }, ambience: 'mystery' },
    orientation_forest: { theme: { key: 'bgm_orientation_forest', url: 'screens/orientation_forest/assets/audio/bgm/bgm.mp3', volume: 0.35 }, ambience: 'forest' },
    candy_garden: { theme: { key: 'bgm_candy_garden', url: 'screens/candy_garden/assets/audio/bgm/bgm.mp3', volume: 0.35 }, ambience: 'candy' },
    forest_adventure: { theme: { key: 'bgm_forest_adventure', url: 'screens/forest_adventure/assets/audio/bgm/bgm.mp3', volume: 0.35 }, ambience: 'forest' },
};

const AREA_AUDIO = {
    menu: { theme: { key: 'bgm_menu', url: 'screens/menu/assets/audio/bgm/menu_bgm.mp3', volume: 0.35 }, ambience: 'forest' },
    result: { theme: { key: 'bgm_reward', url: 'core/audio/assets/bgm/reward_theme.mp3', volume: 0.4 }, ambience: null },
    album: { theme: { key: 'bgm_album', url: 'core/audio/assets/bgm/album_theme.mp3', volume: 0.3 }, ambience: null },
};

const AudioConfig = {
    VOICE_LIBRARY,
    VOICE_CATEGORIES,
    GAME_AUDIO,
    AREA_AUDIO,
    locale: 'vi',
    line(id) { return VOICE_LIBRARY[id] || null; },
    instructionFor(gameId, level) { return `instr_${gameId}_${level}`; },
    gameAudio(gameId) { return GAME_AUDIO[gameId] || null; },
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AudioConfig, VOICE_LIBRARY, VOICE_CATEGORIES, GAME_AUDIO, AREA_AUDIO };
}
