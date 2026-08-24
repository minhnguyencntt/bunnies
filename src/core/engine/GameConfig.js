/**
 * GameConfig.js — Data-driven definitions for every game in Knowledge World.
 * A new educational game is added by extending GAME_DEFINITIONS + a scene class.
 *
 * Per game: identity, educational goal, world region, 3 levels
 * (difficulty / scoring / rewards / hints), awards, sticker collection.
 *
 * Level labels are child-friendly ranks; age targets (3–5 / 6–10 / 10–15)
 * are design constraints expressed through the difficulty dimensions.
 */

const LEVEL_LABELS = {
    1: { rank: 'Nhà Thám Hiểm', icon: '🌱' }, // Explorer — designed for 3–5
    2: { rank: 'Nhà Phiêu Lưu', icon: '⚔️' }, // Adventurer — designed for 6–10
    3: { rank: 'Bậc Thầy', icon: '👑' },      // Master — designed for 10–15
};

const KNOWLEDGE_WORLDS = {
    math_forest: { id: 'math_forest', name: 'Rừng Toán Học', icon: '🌲', color: 0x2e8b57 },
    mystery_village: { id: 'mystery_village', name: 'Làng Bí Ẩn', icon: '🔍', color: 0x9370db },
    candy_garden: { id: 'candy_garden', name: 'Vườn Kẹo Ngọt', icon: '🍭', color: 0xff69b4 },
    forest_adventure: { id: 'forest_adventure', name: 'Rừng Diệu Kỳ', icon: '🌳', color: 0x43a047 },
    rainbow_garden: { id: 'rainbow_garden', name: 'Vườn Cầu Vồng', icon: '🌈', color: 0x7c5cbf },
};

const DEFAULT_STAR_THRESHOLDS = [40, 75]; // score 0–39 → 1⭐, 40–74 → 2⭐, 75+ → 3⭐

const GAME_DEFINITIONS = {
    counting_forest: {
        gameId: 'counting_forest',
        sceneKey: 'CountingForestScreen',
        name: 'Khu Rừng Đếm Số',
        world: 'math_forest',
        icon: '🌲',
        color: 0x228b22,
        educationalGoal: 'Luyện phép cộng — hiểu phép cộng là gộp hai nhóm vật.',
        mechanics: ['drag_collect', 'choose_path', 'story_problem'],
        levels: {
            1: {
                label: LEVEL_LABELS[1],
                title: 'Thu Hoạch Táo',
                rounds: 5,
                difficulty: {
                    complexity: 1, objectCount: 5, choiceCount: 0, timeLimit: 0,
                    memoryLoad: 1, distractionLevel: 0, hintLevel: 3,
                    interactionSteps: 1, questionComplexity: 1, visualComplexity: 1,
                    sequenceLength: 0, mathRange: 5, errorTolerance: 3,
                },
                scoring: {
                    accuracyWeight: 55, speedWeight: 10, comboWeight: 0,
                    explorationWeight: 15, perfectBonus: 10, difficultyBonus: 0,
                    hintPenalty: 2, starThresholds: DEFAULT_STAR_THRESHOLDS,
                },
                rewards: { baseXP: 50, gems: 5, threeStarXP: 25, perfectXP: 15, noHintXP: 10 },
                hints: [
                    'Hãy kéo tất cả táo vào giỏ của Bunnine nhé!',
                    'Đếm từng quả: một, hai, ba…',
                    'Gộp hai nhóm táo lại với nhau nào!',
                ],
            },
            2: {
                label: LEVEL_LABELS[2],
                title: 'Đường Pha Lê',
                rounds: 6,
                difficulty: {
                    complexity: 2, objectCount: 8, choiceCount: 3, timeLimit: 25,
                    memoryLoad: 2, distractionLevel: 1, hintLevel: 2,
                    interactionSteps: 2, questionComplexity: 2, visualComplexity: 2,
                    sequenceLength: 0, mathRange: 10, errorTolerance: 2,
                },
                scoring: {
                    accuracyWeight: 55, speedWeight: 15, comboWeight: 10,
                    explorationWeight: 5, perfectBonus: 10, difficultyBonus: 5,
                    hintPenalty: 3, starThresholds: DEFAULT_STAR_THRESHOLDS,
                },
                rewards: { baseXP: 100, gems: 8, threeStarXP: 50, perfectXP: 25, noHintXP: 20 },
                hints: [
                    'Nhìn kỹ hai số rồi cộng lại nhé!',
                    'Đếm tiếp từ số thứ nhất lên nào.',
                    'Con đường đúng mang biển số bằng tổng hai số.',
                ],
            },
            3: {
                label: LEVEL_LABELS[3],
                title: 'Nhiệm Vụ Pha Lê',
                rounds: 6,
                difficulty: {
                    complexity: 3, objectCount: 12, choiceCount: 4, timeLimit: 30,
                    memoryLoad: 3, distractionLevel: 2, hintLevel: 1,
                    interactionSteps: 3, questionComplexity: 3, visualComplexity: 3,
                    sequenceLength: 2, mathRange: 20, errorTolerance: 1,
                },
                scoring: {
                    accuracyWeight: 55, speedWeight: 15, comboWeight: 10,
                    explorationWeight: 5, perfectBonus: 10, difficultyBonus: 10,
                    hintPenalty: 4, starThresholds: [45, 78],
                },
                rewards: { baseXP: 200, gems: 12, threeStarXP: 100, perfectXP: 50, noHintXP: 40 },
                hints: [
                    'Nghĩ xem điều gì xảy ra trước, điều gì xảy ra sau.',
                    'Tính từng bước một: trước tiên… rồi tiếp theo…',
                    'Bắt đầu từ số pha lê Bunnine có lúc đầu.',
                ],
            },
        },
        awards: [
            { id: 'cf_first_harvest', name: 'Vụ Mùa Đầu Tiên', icon: '🧺', rarity: 'common',
              description: 'Hoàn thành màn chơi đầu tiên ở Khu Rừng Đếm Số.',
              reward: { xp: 30 }, condition: { type: 'complete_any_level' } },
            { id: 'cf_super_solver', name: 'Siêu Giải Toán', icon: '🧠', rarity: 'rare',
              description: 'Trả lời đúng 5 câu liên tiếp.',
              reward: { xp: 100 }, condition: { type: 'streak', count: 5 } },
            { id: 'cf_math_wizard', name: 'Phù Thủy Toán Học', icon: '🪄', rarity: 'epic',
              description: 'Đạt 3 sao ở Màn 3.',
              reward: { xp: 150, gems: 10 }, condition: { type: 'three_stars', level: 3 } },
        ],
        stickers: [
            { id: 'cf_apple', name: 'Táo Rừng', icon: '🍎', rarity: 'common',
              hint: 'Hoàn thành Màn 1', condition: { type: 'complete_level', level: 1 } },
            { id: 'cf_crystal', name: 'Pha Lê Xanh', icon: '💎', rarity: 'common',
              hint: 'Hoàn thành Màn 2', condition: { type: 'complete_level', level: 2 } },
            { id: 'cf_bunny_math', name: 'Bunnine Toán Học', icon: '🐰', rarity: 'rare',
              hint: 'Đạt 3 sao ở bất kỳ màn nào', condition: { type: 'three_stars_any' } },
            { id: 'cf_tree', name: 'Cây Thần Kỳ', icon: '🌳', rarity: 'rare',
              hint: 'Chơi 3 lượt ở Khu Rừng Đếm Số', condition: { type: 'plays', count: 3 } },
            { id: 'cf_star', name: 'Ngôi Sao Số Học', icon: '⭐', rarity: 'epic',
              hint: 'Hoàn thành một màn mà không dùng gợi ý', condition: { type: 'no_hint' } },
            { id: 'cf_crown', name: 'Vương Miện Pha Lê', icon: '👑', rarity: 'legendary',
              hint: 'Đạt 3 sao ở Màn 3', condition: { type: 'three_stars', level: 3 } },
        ],
    },

    subtraction_hill: {
        gameId: 'subtraction_hill',
        sceneKey: 'SubtractionHillScreen',
        name: 'Đồi Phép Trừ',
        world: 'math_forest',
        icon: '⛰️',
        color: 0x7cfc00,
        educationalGoal: 'Luyện phép trừ — hiểu phép trừ là bớt đi / còn lại.',
        mechanics: ['collect_remaining', 'drag_pack', 'story_problem'],
        levels: {
            1: {
                label: LEVEL_LABELS[1],
                title: 'Táo Lăn Đồi',
                rounds: 5,
                difficulty: {
                    complexity: 1, objectCount: 5, choiceCount: 0, timeLimit: 0,
                    memoryLoad: 1, distractionLevel: 0, hintLevel: 3,
                    interactionSteps: 1, questionComplexity: 1, visualComplexity: 1,
                    sequenceLength: 0, mathRange: 5, errorTolerance: 3,
                },
                scoring: {
                    accuracyWeight: 55, speedWeight: 10, comboWeight: 0,
                    explorationWeight: 15, perfectBonus: 10, difficultyBonus: 0,
                    hintPenalty: 2, starThresholds: DEFAULT_STAR_THRESHOLDS,
                },
                rewards: { baseXP: 50, gems: 5, threeStarXP: 25, perfectXP: 15, noHintXP: 10 },
                hints: [
                    'Nhặt những quả còn lại bỏ vào giỏ nhé!',
                    'Đếm xem còn lại bao nhiêu quả.',
                    'Mấy quả lăn đi rồi, còn lại mấy quả nào?',
                ],
            },
            2: {
                label: LEVEL_LABELS[2],
                title: 'Giỏ Quà Của Cáo',
                rounds: 6,
                difficulty: {
                    complexity: 2, objectCount: 9, choiceCount: 3, timeLimit: 25,
                    memoryLoad: 2, distractionLevel: 1, hintLevel: 2,
                    interactionSteps: 2, questionComplexity: 2, visualComplexity: 2,
                    sequenceLength: 0, mathRange: 10, errorTolerance: 2,
                },
                scoring: {
                    accuracyWeight: 55, speedWeight: 15, comboWeight: 10,
                    explorationWeight: 5, perfectBonus: 10, difficultyBonus: 5,
                    hintPenalty: 3, starThresholds: DEFAULT_STAR_THRESHOLDS,
                },
                rewards: { baseXP: 100, gems: 8, threeStarXP: 50, perfectXP: 25, noHintXP: 20 },
                hints: [
                    'Xếp đủ đồ vào giỏ trước, rồi đếm phần còn lại.',
                    'Số còn lại = số lúc đầu bớt đi số đã cho vào giỏ.',
                    'Đếm những món KHÔNG nằm trong giỏ.',
                ],
            },
            3: {
                label: LEVEL_LABELS[3],
                title: 'Hành Trình Của Cáo',
                rounds: 6,
                difficulty: {
                    complexity: 3, objectCount: 12, choiceCount: 4, timeLimit: 30,
                    memoryLoad: 3, distractionLevel: 2, hintLevel: 1,
                    interactionSteps: 3, questionComplexity: 3, visualComplexity: 3,
                    sequenceLength: 2, mathRange: 20, errorTolerance: 1,
                },
                scoring: {
                    accuracyWeight: 55, speedWeight: 15, comboWeight: 10,
                    explorationWeight: 5, perfectBonus: 10, difficultyBonus: 10,
                    hintPenalty: 4, starThresholds: [45, 78],
                },
                rewards: { baseXP: 200, gems: 12, threeStarXP: 100, perfectXP: 50, noHintXP: 40 },
                hints: [
                    'Theo dõi từng việc xảy ra với đồ vật của Cáo.',
                    'Cho đi thì bớt, được thêm thì tăng.',
                    'Tính lần lượt từ trái sang phải.',
                ],
            },
        },
        awards: [
            { id: 'sh_kind_heart', name: 'Trái Tim Tử Tế', icon: '💝', rarity: 'common',
              description: 'Giúp Cáo Con xong màn chơi đầu tiên.',
              reward: { xp: 30 }, condition: { type: 'complete_any_level' } },
            { id: 'sh_super_solver', name: 'Chuỗi Thắng Lợi', icon: '🔥', rarity: 'rare',
              description: 'Trả lời đúng 5 câu liên tiếp.',
              reward: { xp: 100 }, condition: { type: 'streak', count: 5 } },
            { id: 'sh_math_wizard', name: 'Pháp Sư Phép Trừ', icon: '🪄', rarity: 'epic',
              description: 'Đạt 3 sao ở Màn 3.',
              reward: { xp: 150, gems: 10 }, condition: { type: 'three_stars', level: 3 } },
        ],
        stickers: [
            { id: 'sh_fox', name: 'Cáo Con', icon: '🦊', rarity: 'common',
              hint: 'Hoàn thành Màn 1', condition: { type: 'complete_level', level: 1 } },
            { id: 'sh_basket', name: 'Giỏ Quà', icon: '🧺', rarity: 'common',
              hint: 'Hoàn thành Màn 2', condition: { type: 'complete_level', level: 2 } },
            { id: 'sh_candy', name: 'Kẹo Số', icon: '🍬', rarity: 'rare',
              hint: 'Đạt 3 sao ở bất kỳ màn nào', condition: { type: 'three_stars_any' } },
            { id: 'sh_lantern', name: 'Đèn Lồng Đồi', icon: '🏮', rarity: 'rare',
              hint: 'Chơi 3 lượt ở Đồi Phép Trừ', condition: { type: 'plays', count: 3 } },
            { id: 'sh_star', name: 'Sao Phép Trừ', icon: '⭐', rarity: 'epic',
              hint: 'Hoàn thành một màn mà không dùng gợi ý', condition: { type: 'no_hint' } },
            { id: 'sh_mom', name: 'Sum Họp', icon: '💞', rarity: 'legendary',
              hint: 'Đạt 3 sao ở Màn 3', condition: { type: 'three_stars', level: 3 } },
        ],
    },

    mirror_city: {
        gameId: 'mirror_city',
        sceneKey: 'MirrorCityScreen',
        name: 'Thành Phố Gương',
        world: 'mystery_village',
        icon: '🪞',
        color: 0x9370db,
        educationalGoal: 'Phát triển quan sát và khả năng phân biệt hình ảnh.',
        mechanics: ['spot_difference'],
        levels: {
            1: {
                label: LEVEL_LABELS[1],
                title: 'Tấm Gương Nhỏ',
                rounds: 3,
                difficulty: {
                    complexity: 1, objectCount: 5, choiceCount: 0, timeLimit: 0,
                    memoryLoad: 1, distractionLevel: 0, hintLevel: 3,
                    interactionSteps: 1, questionComplexity: 1, visualComplexity: 1,
                    sequenceLength: 0, mathRange: 0, errorTolerance: 3,
                    differencesPerRound: 1, subtlety: 1,
                },
                scoring: {
                    accuracyWeight: 55, speedWeight: 10, comboWeight: 0,
                    explorationWeight: 15, perfectBonus: 10, difficultyBonus: 0,
                    hintPenalty: 2, starThresholds: DEFAULT_STAR_THRESHOLDS,
                },
                rewards: { baseXP: 50, gems: 5, threeStarXP: 25, perfectXP: 15, noHintXP: 10 },
                hints: [
                    'Nhìn kỹ từng vật trong hai bức tranh nhé!',
                    'Có một vật không giống nhau đâu này.',
                    'So sánh từ trên xuống dưới nhé.',
                ],
            },
            2: {
                label: LEVEL_LABELS[2],
                title: 'Phòng Gương Lớn',
                rounds: 3,
                difficulty: {
                    complexity: 2, objectCount: 8, choiceCount: 0, timeLimit: 75,
                    memoryLoad: 2, distractionLevel: 1, hintLevel: 2,
                    interactionSteps: 2, questionComplexity: 2, visualComplexity: 2,
                    sequenceLength: 0, mathRange: 0, errorTolerance: 2,
                    differencesPerRound: 3, subtlety: 2,
                },
                scoring: {
                    accuracyWeight: 55, speedWeight: 15, comboWeight: 10,
                    explorationWeight: 5, perfectBonus: 10, difficultyBonus: 5,
                    hintPenalty: 3, starThresholds: DEFAULT_STAR_THRESHOLDS,
                },
                rewards: { baseXP: 100, gems: 8, threeStarXP: 50, perfectXP: 25, noHintXP: 20 },
                hints: [
                    'Có vài vật khác nhau — đếm số vật mỗi bên thử xem.',
                    'Chú ý màu sắc và vị trí của từng vật.',
                    'Quét từ trái sang phải thật chậm.',
                ],
            },
            3: {
                label: LEVEL_LABELS[3],
                title: 'Đại Sảnh Gương',
                rounds: 3,
                difficulty: {
                    complexity: 3, objectCount: 10, choiceCount: 0, timeLimit: 90,
                    memoryLoad: 3, distractionLevel: 3, hintLevel: 1,
                    interactionSteps: 3, questionComplexity: 3, visualComplexity: 3,
                    sequenceLength: 0, mathRange: 0, errorTolerance: 1,
                    differencesPerRound: 5, subtlety: 3,
                },
                scoring: {
                    accuracyWeight: 55, speedWeight: 15, comboWeight: 10,
                    explorationWeight: 5, perfectBonus: 10, difficultyBonus: 10,
                    hintPenalty: 4, starThresholds: [45, 78],
                },
                rewards: { baseXP: 200, gems: 12, threeStarXP: 100, perfectXP: 50, noHintXP: 40 },
                hints: [
                    'Điểm khác có thể rất nhỏ: hướng quay, màu sắc, vị trí…',
                    'Hãy nghĩ xem vật nào "cảm giác" không đúng.',
                    'Chia bức tranh thành 4 phần và kiểm tra từng phần.',
                ],
            },
        },
        awards: [
            { id: 'mc_detective', name: 'Thám Tử Nhí', icon: '🔍', rarity: 'common',
              description: 'Hoàn thành màn chơi đầu tiên ở Thành Phố Gương.',
              reward: { xp: 30 }, condition: { type: 'complete_any_level' } },
            { id: 'mc_eagle_eye', name: 'Mắt Diều Hâu', icon: '🦅', rarity: 'rare',
              description: 'Tìm hết điểm khác của một vòng mà không chạm sai lần nào.',
              reward: { xp: 100 }, condition: { type: 'perfect_round' } },
            { id: 'mc_observation_hero', name: 'Anh Hùng Quan Sát', icon: '👀', rarity: 'epic',
              description: 'Hoàn thành một màn mà không dùng gợi ý.',
              reward: { xp: 120 }, condition: { type: 'no_hint' } },
        ],
        stickers: [
            { id: 'mc_mirror', name: 'Gương Thần', icon: '🪞', rarity: 'common',
              hint: 'Hoàn thành Màn 1', condition: { type: 'complete_level', level: 1 } },
            { id: 'mc_badge', name: 'Huy Hiệu Bí Ẩn', icon: '🕵️', rarity: 'common',
              hint: 'Hoàn thành Màn 2', condition: { type: 'complete_level', level: 2 } },
            { id: 'mc_house', name: 'Nhà Bí Ẩn', icon: '🏠', rarity: 'rare',
              hint: 'Chơi 3 lượt ở Thành Phố Gương', condition: { type: 'plays', count: 3 } },
            { id: 'mc_eye', name: 'Mắt Ưng', icon: '👁️', rarity: 'rare',
              hint: 'Đạt 3 sao ở bất kỳ màn nào', condition: { type: 'three_stars_any' } },
            { id: 'mc_star', name: 'Sao Quan Sát', icon: '⭐', rarity: 'epic',
              hint: 'Hoàn thành một màn mà không dùng gợi ý', condition: { type: 'no_hint' } },
            { id: 'mc_legend', name: 'Huyền Thoại Gương', icon: '🌟', rarity: 'legendary',
              hint: 'Đạt 3 sao ở Màn 3', condition: { type: 'three_stars', level: 3 } },
        ],
    },

    orientation_forest: {
        gameId: 'orientation_forest',
        sceneKey: 'OrientationForestScreen',
        name: 'Khu Rừng Định Hướng',
        world: 'mystery_village',
        icon: '🌳',
        color: 0x228b22,
        educationalGoal: 'Nhận biết phương hướng: trái – phải – trước – sau; ghi nhớ trình tự.',
        mechanics: ['choose_direction', 'sequence_memory'],
        levels: {
            1: {
                label: LEVEL_LABELS[1],
                title: 'Trái Hay Phải',
                rounds: 5,
                difficulty: {
                    complexity: 1, objectCount: 3, choiceCount: 2, timeLimit: 0,
                    memoryLoad: 1, distractionLevel: 0, hintLevel: 3,
                    interactionSteps: 1, questionComplexity: 1, visualComplexity: 1,
                    sequenceLength: 0, mathRange: 0, errorTolerance: 3,
                },
                scoring: {
                    accuracyWeight: 55, speedWeight: 10, comboWeight: 0,
                    explorationWeight: 15, perfectBonus: 10, difficultyBonus: 0,
                    hintPenalty: 2, starThresholds: DEFAULT_STAR_THRESHOLDS,
                },
                rewards: { baseXP: 50, gems: 5, threeStarXP: 25, perfectXP: 15, noHintXP: 10 },
                hints: [
                    'Vật ở bên nào của Sóc nhỉ?',
                    'Nhìn xem vật nằm bên trái hay bên phải Sóc.',
                    'Chạm vào mũi tên chỉ về phía vật nhé!',
                ],
            },
            2: {
                label: LEVEL_LABELS[2],
                title: 'Bốn Hướng',
                rounds: 6,
                difficulty: {
                    complexity: 2, objectCount: 5, choiceCount: 4, timeLimit: 20,
                    memoryLoad: 2, distractionLevel: 1, hintLevel: 2,
                    interactionSteps: 1, questionComplexity: 2, visualComplexity: 2,
                    sequenceLength: 0, mathRange: 0, errorTolerance: 2,
                },
                scoring: {
                    accuracyWeight: 55, speedWeight: 15, comboWeight: 10,
                    explorationWeight: 5, perfectBonus: 10, difficultyBonus: 5,
                    hintPenalty: 3, starThresholds: DEFAULT_STAR_THRESHOLDS,
                },
                rewards: { baseXP: 100, gems: 8, threeStarXP: 50, perfectXP: 25, noHintXP: 20 },
                hints: [
                    'Có bốn hướng: trái, phải, trước, sau.',
                    'Phía trước là hướng Sóc đang nhìn.',
                    'Tưởng tượng bạn là Sóc — vật ở hướng nào?',
                ],
            },
            3: {
                label: LEVEL_LABELS[3],
                title: 'Dẫn Đường Cho Sóc',
                rounds: 4,
                difficulty: {
                    complexity: 3, objectCount: 6, choiceCount: 4, timeLimit: 40,
                    memoryLoad: 4, distractionLevel: 2, hintLevel: 1,
                    interactionSteps: 4, questionComplexity: 3, visualComplexity: 3,
                    sequenceLength: 4, mathRange: 0, errorTolerance: 1,
                },
                scoring: {
                    accuracyWeight: 55, speedWeight: 15, comboWeight: 10,
                    explorationWeight: 5, perfectBonus: 10, difficultyBonus: 10,
                    hintPenalty: 4, starThresholds: [45, 78],
                },
                rewards: { baseXP: 200, gems: 12, threeStarXP: 100, perfectXP: 50, noHintXP: 40 },
                hints: [
                    'Hãy nhớ thứ tự các mũi tên vừa xuất hiện.',
                    'Đọc thầm lại trình tự trong đầu trước khi bấm.',
                    'Chia trình tự dài thành từng cụm nhỏ.',
                ],
            },
        },
        awards: [
            { id: 'of_pathfinder', name: 'Người Tìm Đường', icon: '🧭', rarity: 'common',
              description: 'Hoàn thành màn chơi đầu tiên ở Khu Rừng Định Hướng.',
              reward: { xp: 30 }, condition: { type: 'complete_any_level' } },
            { id: 'of_memory_master', name: 'Bậc Thầy Trí Nhớ', icon: '🧠', rarity: 'rare',
              description: 'Hoàn thành một vòng trình tự mà không sai bước nào.',
              reward: { xp: 100 }, condition: { type: 'perfect_round' } },
            { id: 'of_golden_arrow', name: 'Mũi Tên Vàng', icon: '🏹', rarity: 'epic',
              description: 'Đạt 3 sao ở Màn 3.',
              reward: { xp: 150, gems: 10 }, condition: { type: 'three_stars', level: 3 } },
        ],
        stickers: [
            { id: 'of_squirrel', name: 'Sóc Nâu', icon: '🐿️', rarity: 'common',
              hint: 'Hoàn thành Màn 1', condition: { type: 'complete_level', level: 1 } },
            { id: 'of_compass', name: 'La Bàn', icon: '🧭', rarity: 'common',
              hint: 'Hoàn thành Màn 2', condition: { type: 'complete_level', level: 2 } },
            { id: 'of_acorn', name: 'Hạt Dẻ Vàng', icon: '🌰', rarity: 'rare',
              hint: 'Đạt 3 sao ở bất kỳ màn nào', condition: { type: 'three_stars_any' } },
            { id: 'of_sign', name: 'Biển Chỉ Đường', icon: '🪧', rarity: 'rare',
              hint: 'Chơi 3 lượt ở Khu Rừng Định Hướng', condition: { type: 'plays', count: 3 } },
            { id: 'of_star', name: 'Sao Định Hướng', icon: '⭐', rarity: 'epic',
              hint: 'Hoàn thành một màn mà không dùng gợi ý', condition: { type: 'no_hint' } },
            { id: 'of_map', name: 'Bản Đồ Kho Báu', icon: '🗺️', rarity: 'legendary',
              hint: 'Đạt 3 sao ở Màn 3', condition: { type: 'three_stars', level: 3 } },
        ],
    },

    candy_garden: {
        gameId: 'candy_garden',
        sceneKey: 'CandyGardenScreen',
        name: 'Vườn Kẹo Ngọt',
        world: 'candy_garden',
        icon: '🍭',
        color: 0xff69b4,
        educationalGoal: 'Luyện phép cộng — gộp hai nhóm kẹo và đếm tổng.',
        mechanics: ['visual_groups', 'three_choice'],
        levels: {
            1: {
                label: LEVEL_LABELS[1],
                title: 'Kẹo Ngọt Đầu Tiên',
                rounds: 6,
                difficulty: {
                    complexity: 1, objectCount: 5, choiceCount: 3, timeLimit: 0,
                    memoryLoad: 1, distractionLevel: 0, hintLevel: 3,
                    interactionSteps: 1, questionComplexity: 1, visualComplexity: 1,
                    sequenceLength: 0, mathRange: 5, errorTolerance: 3,
                },
                scoring: {
                    accuracyWeight: 55, speedWeight: 10, comboWeight: 5,
                    explorationWeight: 10, perfectBonus: 10, difficultyBonus: 0,
                    hintPenalty: 2, starThresholds: DEFAULT_STAR_THRESHOLDS,
                },
                rewards: { baseXP: 50, gems: 5, threeStarXP: 25, perfectXP: 15, noHintXP: 10 },
                hints: [
                    'Đếm tất cả kẹo ở hai bên nhé!',
                    'Đếm từng viên kẹo: một, hai, ba…',
                    'Gộp hai nhóm kẹo lại rồi đếm nào!',
                ],
            },
            2: {
                label: LEVEL_LABELS[2],
                title: 'Tiệc Kẹo Ngọt',
                rounds: 8,
                difficulty: {
                    complexity: 2, objectCount: 8, choiceCount: 3, timeLimit: 30,
                    memoryLoad: 2, distractionLevel: 1, hintLevel: 2,
                    interactionSteps: 2, questionComplexity: 2, visualComplexity: 2,
                    sequenceLength: 0, mathRange: 8, errorTolerance: 2,
                },
                scoring: {
                    accuracyWeight: 55, speedWeight: 15, comboWeight: 10,
                    explorationWeight: 5, perfectBonus: 10, difficultyBonus: 5,
                    hintPenalty: 3, starThresholds: DEFAULT_STAR_THRESHOLDS,
                },
                rewards: { baseXP: 100, gems: 8, threeStarXP: 50, perfectXP: 25, noHintXP: 20 },
                hints: [
                    'Đếm nhóm bên trái trước, rồi đếm tiếp nhóm bên phải.',
                    'Cộng là đếm tiếp lên nào.',
                    'Hai số gộp lại được số nào lớn hơn nhỉ?',
                ],
            },
            3: {
                label: LEVEL_LABELS[3],
                title: 'Đại Tiệc Kẹo',
                rounds: 8,
                difficulty: {
                    complexity: 3, objectCount: 10, choiceCount: 3, timeLimit: 25,
                    memoryLoad: 2, distractionLevel: 2, hintLevel: 1,
                    interactionSteps: 2, questionComplexity: 3, visualComplexity: 2,
                    sequenceLength: 0, mathRange: 10, errorTolerance: 1,
                },
                scoring: {
                    accuracyWeight: 55, speedWeight: 15, comboWeight: 10,
                    explorationWeight: 5, perfectBonus: 10, difficultyBonus: 10,
                    hintPenalty: 4, starThresholds: [45, 78],
                },
                rewards: { baseXP: 200, gems: 12, threeStarXP: 100, perfectXP: 50, noHintXP: 40 },
                hints: [
                    'Thử đếm từ số lớn hơn rồi đếm tiếp.',
                    'Tách số nhỏ ra thành từng phần dễ đếm.',
                    'Hãy tự tin — bạn làm được mà!',
                ],
            },
        },
        awards: [
            { id: 'cg_first_sweet', name: 'Viên Kẹo Đầu Tiên', icon: '🍬', rarity: 'common',
              description: 'Hoàn thành màn chơi đầu tiên ở Vườn Kẹo Ngọt.',
              reward: { xp: 30 }, condition: { type: 'complete_any_level' } },
            { id: 'cg_sweet_streak', name: 'Chuỗi Ngọt Ngào', icon: '🍭', rarity: 'rare',
              description: 'Trả lời đúng 5 câu liên tiếp.',
              reward: { xp: 100 }, condition: { type: 'streak', count: 5 } },
            { id: 'cg_candy_master', name: 'Bậc Thầy Kẹo Ngọt', icon: '🧁', rarity: 'epic',
              description: 'Đạt 3 sao ở Màn 3.',
              reward: { xp: 150, gems: 10 }, condition: { type: 'three_stars', level: 3 } },
        ],
        stickers: [
            { id: 'cg_candy', name: 'Kẹo Mút', icon: '🍭', rarity: 'common',
              hint: 'Hoàn thành Màn 1', condition: { type: 'complete_level', level: 1 } },
            { id: 'cg_cupcake', name: 'Bánh Cupcake', icon: '🧁', rarity: 'common',
              hint: 'Hoàn thành Màn 2', condition: { type: 'complete_level', level: 2 } },
            { id: 'cg_strawberry', name: 'Dâu Ngọt', icon: '🍓', rarity: 'rare',
              hint: 'Đạt 3 sao ở bất kỳ màn nào', condition: { type: 'three_stars_any' } },
            { id: 'cg_bunny', name: 'Bunnine Kẹo Ngọt', icon: '🐰', rarity: 'rare',
              hint: 'Chơi 3 lượt ở Vườn Kẹo Ngọt', condition: { type: 'plays', count: 3 } },
            { id: 'cg_star', name: 'Sao Kẹo', icon: '⭐', rarity: 'epic',
              hint: 'Hoàn thành một màn mà không dùng gợi ý', condition: { type: 'no_hint' } },
            { id: 'cg_crown', name: 'Vương Miện Kẹo', icon: '👑', rarity: 'legendary',
              hint: 'Đạt 3 sao ở Màn 3', condition: { type: 'three_stars', level: 3 } },
        ],
    },

    forest_adventure: {
        gameId: 'forest_adventure',
        sceneKey: 'ForestAdventureScreen',
        name: 'Rừng Diệu Kỳ',
        world: 'forest_adventure',
        icon: '🌳',
        color: 0x43a047,
        educationalGoal: 'Luyện phép trừ — bớt đi và đếm phần còn lại.',
        mechanics: ['visual_removal', 'three_choice'],
        levels: {
            1: {
                label: LEVEL_LABELS[1],
                title: 'Nấm Trong Rừng',
                rounds: 6,
                difficulty: {
                    complexity: 1, objectCount: 5, choiceCount: 3, timeLimit: 0,
                    memoryLoad: 1, distractionLevel: 0, hintLevel: 3,
                    interactionSteps: 1, questionComplexity: 1, visualComplexity: 1,
                    sequenceLength: 0, mathRange: 5, errorTolerance: 3,
                },
                scoring: {
                    accuracyWeight: 55, speedWeight: 10, comboWeight: 5,
                    explorationWeight: 10, perfectBonus: 10, difficultyBonus: 0,
                    hintPenalty: 2, starThresholds: DEFAULT_STAR_THRESHOLDS,
                },
                rewards: { baseXP: 50, gems: 5, threeStarXP: 25, perfectXP: 15, noHintXP: 10 },
                hints: [
                    'Đếm xem còn lại bao nhiêu cây nấm nhé!',
                    'Mấy cây nấm bay đi rồi, còn lại mấy cây?',
                    'Đếm những nấm KHÔNG bay đi nào!',
                ],
            },
            2: {
                label: LEVEL_LABELS[2],
                title: 'Đom Đóm Bay',
                rounds: 8,
                difficulty: {
                    complexity: 2, objectCount: 8, choiceCount: 3, timeLimit: 30,
                    memoryLoad: 2, distractionLevel: 1, hintLevel: 2,
                    interactionSteps: 2, questionComplexity: 2, visualComplexity: 2,
                    sequenceLength: 0, mathRange: 8, errorTolerance: 2,
                },
                scoring: {
                    accuracyWeight: 55, speedWeight: 15, comboWeight: 10,
                    explorationWeight: 5, perfectBonus: 10, difficultyBonus: 5,
                    hintPenalty: 3, starThresholds: DEFAULT_STAR_THRESHOLDS,
                },
                rewards: { baseXP: 100, gems: 8, threeStarXP: 50, perfectXP: 25, noHintXP: 20 },
                hints: [
                    'Đếm tất cả trước, rồi bỏ đi số đã bay mất.',
                    'Phép trừ là đếm lùi lại nào.',
                    'Số còn lại nhỏ hơn số lúc đầu nhé!',
                ],
            },
            3: {
                label: LEVEL_LABELS[3],
                title: 'Đêm Trong Rừng',
                rounds: 8,
                difficulty: {
                    complexity: 3, objectCount: 10, choiceCount: 3, timeLimit: 25,
                    memoryLoad: 2, distractionLevel: 2, hintLevel: 1,
                    interactionSteps: 2, questionComplexity: 3, visualComplexity: 2,
                    sequenceLength: 0, mathRange: 10, errorTolerance: 1,
                },
                scoring: {
                    accuracyWeight: 55, speedWeight: 15, comboWeight: 10,
                    explorationWeight: 5, perfectBonus: 10, difficultyBonus: 10,
                    hintPenalty: 4, starThresholds: [45, 78],
                },
                rewards: { baseXP: 200, gems: 12, threeStarXP: 100, perfectXP: 50, noHintXP: 40 },
                hints: [
                    'Đếm lùi từ số lớn: bớt một, bớt hai…',
                    'Tách số bị trừ thành từng phần nhỏ.',
                    'Hãy tự tin suy nghĩ nhé!',
                ],
            },
        },
        awards: [
            { id: 'fa_first_step', name: 'Bước Vào Rừng', icon: '🌲', rarity: 'common',
              description: 'Hoàn thành màn chơi đầu tiên ở Rừng Diệu Kỳ.',
              reward: { xp: 30 }, condition: { type: 'complete_any_level' } },
            { id: 'fa_firefly_streak', name: 'Đom Đóm Dẫn Đường', icon: '✨', rarity: 'rare',
              description: 'Trả lời đúng 5 câu liên tiếp.',
              reward: { xp: 100 }, condition: { type: 'streak', count: 5 } },
            { id: 'fa_forest_master', name: 'Chúa Tể Rừng Xanh', icon: '🏹', rarity: 'epic',
              description: 'Đạt 3 sao ở Màn 3.',
              reward: { xp: 150, gems: 10 }, condition: { type: 'three_stars', level: 3 } },
        ],
        stickers: [
            { id: 'fa_mushroom', name: 'Nấm Xanh', icon: '🍄', rarity: 'common',
              hint: 'Hoàn thành Màn 1', condition: { type: 'complete_level', level: 1 } },
            { id: 'fa_butterfly', name: 'Bướm Rừng', icon: '🦋', rarity: 'common',
              hint: 'Hoàn thành Màn 2', condition: { type: 'complete_level', level: 2 } },
            { id: 'fa_firefly', name: 'Đom Đóm', icon: '✨', rarity: 'rare',
              hint: 'Đạt 3 sao ở bất kỳ màn nào', condition: { type: 'three_stars_any' } },
            { id: 'fa_bunny', name: 'Bunnine Thám Hiểm', icon: '🐰', rarity: 'rare',
              hint: 'Chơi 3 lượt ở Rừng Diệu Kỳ', condition: { type: 'plays', count: 3 } },
            { id: 'fa_star', name: 'Sao Rừng', icon: '⭐', rarity: 'epic',
              hint: 'Hoàn thành một màn mà không dùng gợi ý', condition: { type: 'no_hint' } },
            { id: 'fa_trophy', name: 'Cúp Rừng Xanh', icon: '🏆', rarity: 'legendary',
              hint: 'Đạt 3 sao ở Màn 3', condition: { type: 'three_stars', level: 3 } },
        ],
    },

    color_magic: {
        gameId: 'color_magic',
        sceneKey: 'ColorMagicScreen',
        name: 'Phép Màu Sắc',
        world: 'rainbow_garden',
        icon: '🌈',
        color: 0x7c5cbf,
        educationalGoal: 'Quan sát hình mẫu, nhớ màu từng phần, rồi tô cho giống.',
        mechanics: ['color_match', 'pattern_memory'],
        levels: {
            1: {
                label: LEVEL_LABELS[1],
                title: 'Tô Theo Hình',
                rounds: 5,
                difficulty: {
                    complexity: 1, objectCount: 3, choiceCount: 0, paletteSize: 3, timeLimit: 0,
                    memoryLoad: 1, distractionLevel: 0, hintLevel: 3,
                    interactionSteps: 1, questionComplexity: 1, visualComplexity: 1,
                    sequenceLength: 0, mathRange: 0, errorTolerance: 3,
                },
                scoring: {
                    accuracyWeight: 60, speedWeight: 5, comboWeight: 5,
                    explorationWeight: 10, perfectBonus: 10, difficultyBonus: 0,
                    hintPenalty: 2, starThresholds: DEFAULT_STAR_THRESHOLDS,
                },
                rewards: { baseXP: 50, gems: 5, threeStarXP: 25, perfectXP: 15, noHintXP: 10 },
                hints: [
                    'Nhìn hình mẫu bên trái, rồi chọn đúng màu nhé!',
                    'Mỗi phần một màu. Tô từng phần một nào!',
                    'Chọn màu rồi chạm vào chỗ cần tô.',
                ],
            },
            2: {
                label: LEVEL_LABELS[2],
                title: 'Ghép Màu Khéo',
                rounds: 6,
                difficulty: {
                    complexity: 2, objectCount: 5, choiceCount: 0, paletteSize: 4, timeLimit: 25,
                    memoryLoad: 2, distractionLevel: 1, hintLevel: 2,
                    interactionSteps: 2, questionComplexity: 2, visualComplexity: 2,
                    sequenceLength: 0, mathRange: 0, errorTolerance: 2,
                },
                scoring: {
                    accuracyWeight: 55, speedWeight: 10, comboWeight: 10,
                    explorationWeight: 5, perfectBonus: 10, difficultyBonus: 5,
                    hintPenalty: 3, starThresholds: DEFAULT_STAR_THRESHOLDS,
                },
                rewards: { baseXP: 100, gems: 8, threeStarXP: 50, perfectXP: 25, noHintXP: 20 },
                hints: [
                    'So sánh từng phần với hình mẫu.',
                    'Có màu gần giống nhau — nhìn kỹ nhé!',
                    'Tô xong một phần rồi mới sang phần khác.',
                ],
            },
            3: {
                label: LEVEL_LABELS[3],
                title: 'Nhớ Màu Thần Kỳ',
                rounds: 6,
                difficulty: {
                    complexity: 3, objectCount: 8, choiceCount: 0, paletteSize: 6, timeLimit: 30,
                    memoryLoad: 3, distractionLevel: 2, hintLevel: 1,
                    interactionSteps: 3, questionComplexity: 3, visualComplexity: 3,
                    sequenceLength: 2, mathRange: 0, errorTolerance: 1,
                },
                scoring: {
                    accuracyWeight: 55, speedWeight: 10, comboWeight: 10,
                    explorationWeight: 5, perfectBonus: 10, difficultyBonus: 10,
                    hintPenalty: 4, starThresholds: [45, 78],
                },
                rewards: { baseXP: 200, gems: 12, threeStarXP: 100, perfectXP: 50, noHintXP: 40 },
                hints: [
                    'Nhớ màu hình mẫu trước khi nó thu nhỏ.',
                    'Tô những phần lớn trước cho dễ nhớ.',
                    'Bạn làm được mà — nhìn lại hình mẫu nhỏ nhé!',
                ],
            },
        },
        awards: [
            { id: 'cm_first_mix', name: 'Nét Màu Đầu Tiên', icon: '🎨', rarity: 'common',
              description: 'Hoàn thành màn chơi đầu tiên ở Phép Màu Sắc.',
              reward: { xp: 30 }, condition: { type: 'complete_any_level' } },
            { id: 'cm_color_streak', name: 'Chuỗi Sắc Màu', icon: '🌈', rarity: 'rare',
              description: 'Tô đúng 5 lần liên tiếp.',
              reward: { xp: 100 }, condition: { type: 'streak', count: 5 } },
            { id: 'cm_palette_master', name: 'Bậc Thầy Pha Màu', icon: '🪄', rarity: 'epic',
              description: 'Đạt 3 sao ở Màn 3.',
              reward: { xp: 150, gems: 10 }, condition: { type: 'three_stars', level: 3 } },
        ],
        stickers: [
            { id: 'cm_bunny', name: 'Thỏ Cầu Vồng', icon: '🐰', rarity: 'common',
              hint: 'Hoàn thành Màn 1', condition: { type: 'complete_level', level: 1 } },
            { id: 'cm_flower', name: 'Hoa Sắc Màu', icon: '🌸', rarity: 'common',
              hint: 'Hoàn thành Màn 2', condition: { type: 'complete_level', level: 2 } },
            { id: 'cm_butterfly', name: 'Bướm Tím', icon: '🦋', rarity: 'rare',
              hint: 'Đạt 3 sao ở bất kỳ màn nào', condition: { type: 'three_stars_any' } },
            { id: 'cm_palette', name: 'Bảng Màu', icon: '🎨', rarity: 'rare',
              hint: 'Chơi 3 lượt ở Phép Màu Sắc', condition: { type: 'plays', count: 3 } },
            { id: 'cm_star', name: 'Sao Cầu Vồng', icon: '⭐', rarity: 'epic',
              hint: 'Hoàn thành một màn mà không dùng gợi ý', condition: { type: 'no_hint' } },
            { id: 'cm_crown', name: 'Vương Miện Màu', icon: '👑', rarity: 'legendary',
              hint: 'Đạt 3 sao ở Màn 3', condition: { type: 'three_stars', level: 3 } },
        ],
    },
};

const GLOBAL_AWARDS = [
    { id: 'g_first_adventure', name: 'Cuộc Phiêu Lưu Đầu Tiên', icon: '🎒', rarity: 'common',
      description: 'Hoàn thành trò chơi đầu tiên trong Thế Giới Tri Thức.',
      reward: { xp: 50 }, condition: { type: 'total_plays', count: 1 } },
    { id: 'g_star_collector', name: 'Nhà Sưu Tầm Sao', icon: '🌟', rarity: 'rare',
      description: 'Sưu tầm tổng cộng 12 ngôi sao.',
      reward: { xp: 100, gems: 15 }, condition: { type: 'total_stars', count: 12 } },
    { id: 'g_perfect_round', name: 'Vòng Chơi Hoàn Hảo', icon: '💯', rarity: 'rare',
      description: 'Hoàn thành một màn mà không mắc lỗi nào.',
      reward: { xp: 80 }, condition: { type: 'perfect_session' } },
    { id: 'g_speed_star', name: 'Sao Tốc Độ', icon: '⚡', rarity: 'rare',
      description: 'Hoàn thành màn chơi nhanh hơn thời gian mục tiêu.',
      reward: { xp: 80 }, condition: { type: 'fast_finish' } },
    { id: 'g_explorer', name: 'Nhà Thám Hiểm Vĩ Đại', icon: '🗺️', rarity: 'epic',
      description: 'Chơi tất cả các trò chơi trong Thế Giới Tri Thức.',
      reward: { xp: 150, gems: 20 }, condition: { type: 'all_games' } },
    { id: 'g_knowledge_master', name: 'Bậc Thầy Tri Thức', icon: '🏆', rarity: 'legendary',
      description: 'Đạt 3 sao Màn 3 ở mọi trò chơi.',
      reward: { xp: 300, gems: 50 }, condition: { type: 'all_masters' } },
];

const RARITY_STYLE = {
    common: { label: 'Thường', color: '#8bc34a', glow: 0x8bc34a },
    rare: { label: 'Hiếm', color: '#42a5f5', glow: 0x42a5f5 },
    epic: { label: 'Sử Thi', color: '#ab47bc', glow: 0xab47bc },
    legendary: { label: 'Huyền Thoại', color: '#ffb300', glow: 0xffb300 },
};

const GameConfig = {
    LEVEL_LABELS,
    KNOWLEDGE_WORLDS,
    GLOBAL_AWARDS,
    RARITY_STYLE,
    get(gameId) { return GAME_DEFINITIONS[gameId] || null; },
    getByScene(sceneKey) {
        return Object.values(GAME_DEFINITIONS).find(g => g.sceneKey === sceneKey) || null;
    },
    getLevel(gameId, level) {
        const g = this.get(gameId);
        return g ? g.levels[level] || g.levels[1] : null;
    },
    hasLevel(gameId, level) {
        const g = this.get(gameId);
        return !!(g && g.levels && g.levels[level]);
    },
    nextLevel(gameId, level) {
        const next = Number(level) + 1;
        return this.hasLevel(gameId, next) ? next : null;
    },
    allGames() { return Object.values(GAME_DEFINITIONS); },
    allStickers() {
        return this.allGames().flatMap(g => g.stickers.map(s => ({ ...s, gameId: g.gameId, gameName: g.name })));
    },
    allAwards() {
        const perGame = this.allGames().flatMap(g => g.awards.map(a => ({ ...a, gameId: g.gameId, gameName: g.name })));
        return [...perGame, ...GLOBAL_AWARDS.map(a => ({ ...a, gameId: null, gameName: 'Thế Giới Tri Thức' }))];
    },
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GameConfig, GAME_DEFINITIONS, GLOBAL_AWARDS, LEVEL_LABELS };
}
