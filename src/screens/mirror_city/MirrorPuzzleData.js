/**
 * MirrorPuzzleData.js - 100 Image Pair Configurations for Level 2: Mirror City
 * Each puzzle has an original scene and one difference for spot-the-difference gameplay
 */

const MIRROR_PUZZLES = [
    // ===================== ANIMALS (20 pairs) =====================
    {
        id: 1,
        category: "animals",
        sceneName: "forest_bunny",
        baseDescription: "A cute bunny sitting in a flower garden with butterflies",
        difference: {
            type: "count",
            element: "butterflies",
            original: "3 butterflies",
            reflection: "2 butterflies",
            hint: "Đếm xem có mấy bạn bướm nhé!",
            location: { x: 0.7, y: 0.3 }
        },
        difficulty: 1
    },
    {
        id: 2,
        category: "animals",
        sceneName: "cat_yarn",
        baseDescription: "A playful kitten with a ball of yarn",
        difference: {
            type: "color",
            element: "yarn ball",
            original: "red yarn",
            reflection: "blue yarn",
            hint: "Nhìn màu cuộn len xem nào!",
            location: { x: 0.5, y: 0.6 }
        },
        difficulty: 1
    },
    {
        id: 3,
        category: "animals",
        sceneName: "puppy_bone",
        baseDescription: "A happy puppy with its favorite bone",
        difference: {
            type: "presence",
            element: "collar",
            original: "with collar",
            reflection: "without collar",
            hint: "Cún cưng đeo gì trên cổ nhỉ?",
            location: { x: 0.5, y: 0.4 }
        },
        difficulty: 1
    },
    {
        id: 4,
        category: "animals",
        sceneName: "pond_ducks",
        baseDescription: "Ducks swimming in a peaceful pond",
        difference: {
            type: "count",
            element: "ducks",
            original: "4 ducks",
            reflection: "5 ducks",
            hint: "Đếm số con vịt trong hồ!",
            location: { x: 0.6, y: 0.5 }
        },
        difficulty: 1
    },
    {
        id: 5,
        category: "animals",
        sceneName: "bird_nest",
        baseDescription: "A mother bird feeding baby birds in nest",
        difference: {
            type: "count",
            element: "baby birds",
            original: "3 baby birds",
            reflection: "2 baby birds",
            hint: "Có mấy chú chim con đang há mỏ?",
            location: { x: 0.5, y: 0.4 }
        },
        difficulty: 2
    },
    {
        id: 6,
        category: "animals",
        sceneName: "fish_aquarium",
        baseDescription: "Colorful fish swimming in an aquarium",
        difference: {
            type: "color",
            element: "big fish",
            original: "orange fish",
            reflection: "yellow fish",
            hint: "Con cá lớn nhất màu gì?",
            location: { x: 0.4, y: 0.5 }
        },
        difficulty: 2
    },
    {
        id: 7,
        category: "animals",
        sceneName: "butterfly_garden",
        baseDescription: "Beautiful butterflies on flowers",
        difference: {
            type: "pattern",
            element: "big butterfly wings",
            original: "spotted wings",
            reflection: "striped wings",
            hint: "Hoa văn trên cánh bướm như thế nào?",
            location: { x: 0.5, y: 0.3 }
        },
        difficulty: 2
    },
    {
        id: 8,
        category: "animals",
        sceneName: "farm_cow",
        baseDescription: "A friendly cow in green pasture",
        difference: {
            type: "count",
            element: "spots on cow",
            original: "5 spots",
            reflection: "4 spots",
            hint: "Đếm số đốm trên mình bò!",
            location: { x: 0.5, y: 0.5 }
        },
        difficulty: 2
    },
    {
        id: 9,
        category: "animals",
        sceneName: "ladybug_leaf",
        baseDescription: "A ladybug resting on a green leaf",
        difference: {
            type: "count",
            element: "dots on ladybug",
            original: "7 dots",
            reflection: "6 dots",
            hint: "Bọ rùa có mấy chấm đen?",
            location: { x: 0.5, y: 0.5 }
        },
        difficulty: 2
    },
    {
        id: 10,
        category: "animals",
        sceneName: "squirrel_acorn",
        baseDescription: "A squirrel holding acorns",
        difference: {
            type: "count",
            element: "acorns",
            original: "2 acorns",
            reflection: "3 acorns",
            hint: "Sóc con đang cầm mấy hạt dẻ?",
            location: { x: 0.6, y: 0.4 }
        },
        difficulty: 2
    },
    {
        id: 11,
        category: "animals",
        sceneName: "frog_lily",
        baseDescription: "A frog sitting on lily pads",
        difference: {
            type: "direction",
            element: "frog",
            original: "facing left",
            reflection: "facing right",
            hint: "Ếch con đang nhìn về hướng nào?",
            location: { x: 0.5, y: 0.5 }
        },
        difficulty: 2
    },
    {
        id: 12,
        category: "animals",
        sceneName: "owl_tree",
        baseDescription: "An owl perched on a tree branch at night",
        difference: {
            type: "presence",
            element: "moon",
            original: "with moon",
            reflection: "without moon",
            hint: "Trời đêm có gì sáng trên cao?",
            location: { x: 0.8, y: 0.2 }
        },
        difficulty: 2
    },
    {
        id: 13,
        category: "animals",
        sceneName: "elephant_ball",
        baseDescription: "A baby elephant playing with a ball",
        difference: {
            type: "color",
            element: "ball",
            original: "green ball",
            reflection: "purple ball",
            hint: "Quả bóng voi con đang chơi màu gì?",
            location: { x: 0.6, y: 0.6 }
        },
        difficulty: 2
    },
    {
        id: 14,
        category: "animals",
        sceneName: "penguin_ice",
        baseDescription: "Penguins standing on ice",
        difference: {
            type: "size",
            element: "baby penguin",
            original: "small baby",
            reflection: "medium baby",
            hint: "Chim cánh cụt con to hay nhỏ?",
            location: { x: 0.7, y: 0.6 }
        },
        difficulty: 3
    },
    {
        id: 15,
        category: "animals",
        sceneName: "horse_stable",
        baseDescription: "A horse in a stable with hay",
        difference: {
            type: "color",
            element: "horse mane",
            original: "brown mane",
            reflection: "black mane",
            hint: "Bờm ngựa màu gì nhỉ?",
            location: { x: 0.5, y: 0.3 }
        },
        difficulty: 3
    },
    {
        id: 16,
        category: "animals",
        sceneName: "turtle_beach",
        baseDescription: "A sea turtle on sandy beach",
        difference: {
            type: "pattern",
            element: "turtle shell",
            original: "hexagon pattern",
            reflection: "diamond pattern",
            hint: "Hoa văn trên mai rùa thế nào?",
            location: { x: 0.5, y: 0.5 }
        },
        difficulty: 3
    },
    {
        id: 17,
        category: "animals",
        sceneName: "bee_hive",
        baseDescription: "Bees buzzing around a beehive",
        difference: {
            type: "count",
            element: "bees",
            original: "6 bees",
            reflection: "5 bees",
            hint: "Có mấy con ong đang bay?",
            location: { x: 0.4, y: 0.3 }
        },
        difficulty: 3
    },
    {
        id: 18,
        category: "animals",
        sceneName: "parrot_perch",
        baseDescription: "A colorful parrot on a perch",
        difference: {
            type: "color",
            element: "parrot tail",
            original: "blue tail",
            reflection: "green tail",
            hint: "Đuôi vẹt màu gì nào?",
            location: { x: 0.5, y: 0.7 }
        },
        difficulty: 3
    },
    {
        id: 19,
        category: "animals",
        sceneName: "snail_mushroom",
        baseDescription: "A snail near colorful mushrooms",
        difference: {
            type: "direction",
            element: "snail",
            original: "moving right",
            reflection: "moving left",
            hint: "Ốc sên đang bò về hướng nào?",
            location: { x: 0.4, y: 0.6 }
        },
        difficulty: 3
    },
    {
        id: 20,
        category: "animals",
        sceneName: "hamster_wheel",
        baseDescription: "A hamster running on a wheel",
        difference: {
            type: "presence",
            element: "water bottle",
            original: "with bottle",
            reflection: "without bottle",
            hint: "Chuột có bình nước không?",
            location: { x: 0.8, y: 0.4 }
        },
        difficulty: 3
    },

    // ===================== NATURE (15 pairs) =====================
    {
        id: 21,
        category: "nature",
        sceneName: "rainbow_sky",
        baseDescription: "A beautiful rainbow after rain",
        difference: {
            type: "count",
            element: "rainbow stripes",
            original: "7 colors",
            reflection: "6 colors",
            hint: "Cầu vồng có mấy màu?",
            location: { x: 0.5, y: 0.3 }
        },
        difficulty: 2
    },
    {
        id: 22,
        category: "nature",
        sceneName: "flower_garden",
        baseDescription: "A garden full of tulips",
        difference: {
            type: "color",
            element: "center tulip",
            original: "pink tulip",
            reflection: "yellow tulip",
            hint: "Bông hoa ở giữa màu gì?",
            location: { x: 0.5, y: 0.5 }
        },
        difficulty: 1
    },
    {
        id: 23,
        category: "nature",
        sceneName: "sunny_day",
        baseDescription: "A bright sunny day with clouds",
        difference: {
            type: "count",
            element: "clouds",
            original: "3 clouds",
            reflection: "4 clouds",
            hint: "Có mấy đám mây trên trời?",
            location: { x: 0.6, y: 0.2 }
        },
        difficulty: 1
    },
    {
        id: 24,
        category: "nature",
        sceneName: "tree_seasons",
        baseDescription: "A tree with colorful autumn leaves",
        difference: {
            type: "color",
            element: "tree leaves",
            original: "orange leaves",
            reflection: "red leaves",
            hint: "Lá cây màu gì nhỉ?",
            location: { x: 0.5, y: 0.4 }
        },
        difficulty: 2
    },
    {
        id: 25,
        category: "nature",
        sceneName: "mountain_view",
        baseDescription: "Majestic mountains with snow caps",
        difference: {
            type: "presence",
            element: "snow cap",
            original: "with snow",
            reflection: "without snow",
            hint: "Đỉnh núi có tuyết không?",
            location: { x: 0.5, y: 0.2 }
        },
        difficulty: 2
    },
    {
        id: 26,
        category: "nature",
        sceneName: "waterfall_scene",
        baseDescription: "A waterfall in lush forest",
        difference: {
            type: "size",
            element: "waterfall",
            original: "wide waterfall",
            reflection: "narrow waterfall",
            hint: "Thác nước rộng hay hẹp?",
            location: { x: 0.5, y: 0.4 }
        },
        difficulty: 3
    },
    {
        id: 27,
        category: "nature",
        sceneName: "starry_night",
        baseDescription: "A night sky full of stars",
        difference: {
            type: "count",
            element: "shooting stars",
            original: "2 shooting stars",
            reflection: "1 shooting star",
            hint: "Có mấy sao băng?",
            location: { x: 0.7, y: 0.3 }
        },
        difficulty: 2
    },
    {
        id: 28,
        category: "nature",
        sceneName: "moon_phases",
        baseDescription: "The moon in night sky",
        difference: {
            type: "shape",
            element: "moon",
            original: "full moon",
            reflection: "crescent moon",
            hint: "Mặt trăng tròn hay khuyết?",
            location: { x: 0.5, y: 0.3 }
        },
        difficulty: 2
    },
    {
        id: 29,
        category: "nature",
        sceneName: "beach_sunset",
        baseDescription: "Beautiful sunset over the ocean",
        difference: {
            type: "color",
            element: "sky",
            original: "orange sky",
            reflection: "pink sky",
            hint: "Bầu trời lúc hoàng hôn màu gì?",
            location: { x: 0.5, y: 0.2 }
        },
        difficulty: 2
    },
    {
        id: 30,
        category: "nature",
        sceneName: "river_stones",
        baseDescription: "A river with stepping stones",
        difference: {
            type: "count",
            element: "stepping stones",
            original: "5 stones",
            reflection: "4 stones",
            hint: "Có mấy hòn đá để bước qua?",
            location: { x: 0.5, y: 0.6 }
        },
        difficulty: 2
    },
    {
        id: 31,
        category: "nature",
        sceneName: "forest_path",
        baseDescription: "A winding path through the forest",
        difference: {
            type: "presence",
            element: "mushrooms",
            original: "with mushrooms",
            reflection: "without mushrooms",
            hint: "Bên đường có nấm không?",
            location: { x: 0.3, y: 0.7 }
        },
        difficulty: 3
    },
    {
        id: 32,
        category: "nature",
        sceneName: "sunflower_field",
        baseDescription: "Tall sunflowers facing the sun",
        difference: {
            type: "direction",
            element: "sunflowers",
            original: "facing right",
            reflection: "facing left",
            hint: "Hoa hướng dương quay về đâu?",
            location: { x: 0.5, y: 0.4 }
        },
        difficulty: 3
    },
    {
        id: 33,
        category: "nature",
        sceneName: "lake_reflection",
        baseDescription: "A calm lake reflecting trees",
        difference: {
            type: "presence",
            element: "boat",
            original: "with boat",
            reflection: "without boat",
            hint: "Có thuyền trên hồ không?",
            location: { x: 0.6, y: 0.5 }
        },
        difficulty: 3
    },
    {
        id: 34,
        category: "nature",
        sceneName: "cherry_blossom",
        baseDescription: "Cherry blossom tree in spring",
        difference: {
            type: "count",
            element: "falling petals",
            original: "many petals",
            reflection: "few petals",
            hint: "Có nhiều hay ít cánh hoa rơi?",
            location: { x: 0.5, y: 0.5 }
        },
        difficulty: 3
    },
    {
        id: 35,
        category: "nature",
        sceneName: "volcano_scene",
        baseDescription: "A volcano with smoke rising",
        difference: {
            type: "size",
            element: "smoke plume",
            original: "big smoke",
            reflection: "small smoke",
            hint: "Khói núi lửa to hay nhỏ?",
            location: { x: 0.5, y: 0.2 }
        },
        difficulty: 3
    },

    // ===================== OBJECTS (15 pairs) =====================
    {
        id: 36,
        category: "objects",
        sceneName: "teddy_bear",
        baseDescription: "A cuddly teddy bear with ribbon",
        difference: {
            type: "color",
            element: "ribbon",
            original: "red ribbon",
            reflection: "blue ribbon",
            hint: "Gấu bông đeo nơ màu gì?",
            location: { x: 0.5, y: 0.4 }
        },
        difficulty: 1
    },
    {
        id: 37,
        category: "objects",
        sceneName: "balloon_bunch",
        baseDescription: "Colorful balloons floating in sky",
        difference: {
            type: "count",
            element: "balloons",
            original: "5 balloons",
            reflection: "6 balloons",
            hint: "Đếm số quả bóng bay!",
            location: { x: 0.5, y: 0.4 }
        },
        difficulty: 1
    },
    {
        id: 38,
        category: "objects",
        sceneName: "toy_blocks",
        baseDescription: "Stacked building blocks tower",
        difference: {
            type: "color",
            element: "top block",
            original: "yellow block",
            reflection: "green block",
            hint: "Khối xếp trên cùng màu gì?",
            location: { x: 0.5, y: 0.2 }
        },
        difficulty: 1
    },
    {
        id: 39,
        category: "objects",
        sceneName: "gift_box",
        baseDescription: "A wrapped present with bow",
        difference: {
            type: "pattern",
            element: "wrapping paper",
            original: "polka dots",
            reflection: "stripes",
            hint: "Giấy gói quà có họa tiết gì?",
            location: { x: 0.5, y: 0.5 }
        },
        difficulty: 2
    },
    {
        id: 40,
        category: "objects",
        sceneName: "bookshelf",
        baseDescription: "A bookshelf with colorful books",
        difference: {
            type: "count",
            element: "books",
            original: "8 books",
            reflection: "7 books",
            hint: "Có mấy quyển sách trên kệ?",
            location: { x: 0.5, y: 0.4 }
        },
        difficulty: 2
    },
    {
        id: 41,
        category: "objects",
        sceneName: "clock_tower",
        baseDescription: "An old clock tower",
        difference: {
            type: "position",
            element: "clock hands",
            original: "3 o'clock",
            reflection: "6 o'clock",
            hint: "Kim đồng hồ chỉ mấy giờ?",
            location: { x: 0.5, y: 0.4 }
        },
        difficulty: 2
    },
    {
        id: 42,
        category: "objects",
        sceneName: "toy_car",
        baseDescription: "A toy car on a track",
        difference: {
            type: "color",
            element: "car",
            original: "red car",
            reflection: "orange car",
            hint: "Xe ô tô màu gì?",
            location: { x: 0.5, y: 0.5 }
        },
        difficulty: 2
    },
    {
        id: 43,
        category: "objects",
        sceneName: "kite_sky",
        baseDescription: "A kite flying high in the sky",
        difference: {
            type: "shape",
            element: "kite",
            original: "diamond kite",
            reflection: "triangle kite",
            hint: "Diều hình gì nhỉ?",
            location: { x: 0.5, y: 0.3 }
        },
        difficulty: 2
    },
    {
        id: 44,
        category: "objects",
        sceneName: "umbrella_rain",
        baseDescription: "A colorful umbrella in rain",
        difference: {
            type: "pattern",
            element: "umbrella",
            original: "striped",
            reflection: "solid color",
            hint: "Ô có sọc hay không?",
            location: { x: 0.5, y: 0.3 }
        },
        difficulty: 2
    },
    {
        id: 45,
        category: "objects",
        sceneName: "lamp_night",
        baseDescription: "A desk lamp illuminating books",
        difference: {
            type: "color",
            element: "lamp shade",
            original: "green shade",
            reflection: "blue shade",
            hint: "Chao đèn màu gì?",
            location: { x: 0.5, y: 0.3 }
        },
        difficulty: 3
    },
    {
        id: 46,
        category: "objects",
        sceneName: "music_box",
        baseDescription: "A beautiful music box with dancer",
        difference: {
            type: "direction",
            element: "dancer",
            original: "arms up",
            reflection: "arms down",
            hint: "Vũ công giơ tay lên hay xuống?",
            location: { x: 0.5, y: 0.4 }
        },
        difficulty: 3
    },
    {
        id: 47,
        category: "objects",
        sceneName: "pencil_case",
        baseDescription: "A pencil case with school supplies",
        difference: {
            type: "count",
            element: "pencils",
            original: "4 pencils",
            reflection: "3 pencils",
            hint: "Có mấy cây bút chì?",
            location: { x: 0.5, y: 0.5 }
        },
        difficulty: 3
    },
    {
        id: 48,
        category: "objects",
        sceneName: "treasure_chest",
        baseDescription: "An open treasure chest with jewels",
        difference: {
            type: "presence",
            element: "crown",
            original: "with crown",
            reflection: "without crown",
            hint: "Có vương miện trong rương không?",
            location: { x: 0.5, y: 0.4 }
        },
        difficulty: 3
    },
    {
        id: 49,
        category: "objects",
        sceneName: "robot_toy",
        baseDescription: "A friendly toy robot",
        difference: {
            type: "color",
            element: "robot eyes",
            original: "blue eyes",
            reflection: "red eyes",
            hint: "Mắt robot màu gì?",
            location: { x: 0.5, y: 0.3 }
        },
        difficulty: 3
    },
    {
        id: 50,
        category: "objects",
        sceneName: "guitar_music",
        baseDescription: "An acoustic guitar with musical notes",
        difference: {
            type: "count",
            element: "strings",
            original: "6 strings",
            reflection: "5 strings",
            hint: "Đàn guitar có mấy dây?",
            location: { x: 0.5, y: 0.5 }
        },
        difficulty: 3
    },

    // ===================== FOOD (15 pairs) =====================
    {
        id: 51,
        category: "food",
        sceneName: "fruit_basket",
        baseDescription: "A basket full of fresh fruits",
        difference: {
            type: "count",
            element: "apples",
            original: "4 apples",
            reflection: "3 apples",
            hint: "Có mấy quả táo trong giỏ?",
            location: { x: 0.5, y: 0.5 }
        },
        difficulty: 1
    },
    {
        id: 52,
        category: "food",
        sceneName: "birthday_cake",
        baseDescription: "A birthday cake with candles",
        difference: {
            type: "count",
            element: "candles",
            original: "5 candles",
            reflection: "6 candles",
            hint: "Có mấy cây nến trên bánh?",
            location: { x: 0.5, y: 0.3 }
        },
        difficulty: 1
    },
    {
        id: 53,
        category: "food",
        sceneName: "ice_cream",
        baseDescription: "A colorful ice cream cone",
        difference: {
            type: "count",
            element: "scoops",
            original: "3 scoops",
            reflection: "2 scoops",
            hint: "Có mấy viên kem?",
            location: { x: 0.5, y: 0.4 }
        },
        difficulty: 1
    },
    {
        id: 54,
        category: "food",
        sceneName: "pizza_slice",
        baseDescription: "A delicious pizza with toppings",
        difference: {
            type: "presence",
            element: "mushrooms",
            original: "with mushrooms",
            reflection: "without mushrooms",
            hint: "Pizza có nấm không?",
            location: { x: 0.6, y: 0.5 }
        },
        difficulty: 2
    },
    {
        id: 55,
        category: "food",
        sceneName: "cupcake",
        baseDescription: "A cupcake with frosting",
        difference: {
            type: "color",
            element: "frosting",
            original: "pink frosting",
            reflection: "purple frosting",
            hint: "Kem trên bánh màu gì?",
            location: { x: 0.5, y: 0.3 }
        },
        difficulty: 1
    },
    {
        id: 56,
        category: "food",
        sceneName: "lollipop",
        baseDescription: "A spiral lollipop candy",
        difference: {
            type: "pattern",
            element: "spiral",
            original: "red-white spiral",
            reflection: "blue-white spiral",
            hint: "Kẹo mút có màu gì?",
            location: { x: 0.5, y: 0.4 }
        },
        difficulty: 2
    },
    {
        id: 57,
        category: "food",
        sceneName: "watermelon",
        baseDescription: "A juicy watermelon slice",
        difference: {
            type: "count",
            element: "seeds",
            original: "8 seeds",
            reflection: "6 seeds",
            hint: "Có mấy hạt dưa hấu?",
            location: { x: 0.5, y: 0.5 }
        },
        difficulty: 2
    },
    {
        id: 58,
        category: "food",
        sceneName: "sandwich",
        baseDescription: "A layered sandwich",
        difference: {
            type: "presence",
            element: "lettuce",
            original: "with lettuce",
            reflection: "without lettuce",
            hint: "Bánh mì có rau xà lách không?",
            location: { x: 0.5, y: 0.5 }
        },
        difficulty: 2
    },
    {
        id: 59,
        category: "food",
        sceneName: "donut",
        baseDescription: "A glazed donut with sprinkles",
        difference: {
            type: "color",
            element: "glaze",
            original: "chocolate glaze",
            reflection: "strawberry glaze",
            hint: "Bánh donut phủ kem gì?",
            location: { x: 0.5, y: 0.5 }
        },
        difficulty: 2
    },
    {
        id: 60,
        category: "food",
        sceneName: "cookie_jar",
        baseDescription: "Cookies in a glass jar",
        difference: {
            type: "count",
            element: "cookies",
            original: "6 cookies",
            reflection: "5 cookies",
            hint: "Có mấy cái bánh quy?",
            location: { x: 0.5, y: 0.5 }
        },
        difficulty: 2
    },
    {
        id: 61,
        category: "food",
        sceneName: "sushi_plate",
        baseDescription: "A plate of colorful sushi",
        difference: {
            type: "count",
            element: "sushi pieces",
            original: "5 pieces",
            reflection: "4 pieces",
            hint: "Có mấy miếng sushi?",
            location: { x: 0.5, y: 0.5 }
        },
        difficulty: 3
    },
    {
        id: 62,
        category: "food",
        sceneName: "vegetable_garden",
        baseDescription: "Fresh vegetables from garden",
        difference: {
            type: "color",
            element: "pepper",
            original: "red pepper",
            reflection: "green pepper",
            hint: "Quả ớt màu gì?",
            location: { x: 0.6, y: 0.5 }
        },
        difficulty: 3
    },
    {
        id: 63,
        category: "food",
        sceneName: "pancake_stack",
        baseDescription: "A stack of fluffy pancakes",
        difference: {
            type: "count",
            element: "pancakes",
            original: "4 pancakes",
            reflection: "3 pancakes",
            hint: "Có mấy cái bánh pancake?",
            location: { x: 0.5, y: 0.4 }
        },
        difficulty: 3
    },
    {
        id: 64,
        category: "food",
        sceneName: "hot_chocolate",
        baseDescription: "A cup of hot chocolate",
        difference: {
            type: "count",
            element: "marshmallows",
            original: "3 marshmallows",
            reflection: "2 marshmallows",
            hint: "Có mấy viên kẹo dẻo?",
            location: { x: 0.5, y: 0.3 }
        },
        difficulty: 3
    },
    {
        id: 65,
        category: "food",
        sceneName: "popcorn_bucket",
        baseDescription: "A bucket of popcorn",
        difference: {
            type: "color",
            element: "bucket",
            original: "red bucket",
            reflection: "yellow bucket",
            hint: "Xô bắp rang màu gì?",
            location: { x: 0.5, y: 0.6 }
        },
        difficulty: 3
    },

    // ===================== VEHICLES (10 pairs) =====================
    {
        id: 66,
        category: "vehicles",
        sceneName: "fire_truck",
        baseDescription: "A bright red fire truck",
        difference: {
            type: "presence",
            element: "ladder",
            original: "with ladder",
            reflection: "without ladder",
            hint: "Xe cứu hỏa có thang không?",
            location: { x: 0.6, y: 0.3 }
        },
        difficulty: 1
    },
    {
        id: 67,
        category: "vehicles",
        sceneName: "airplane_sky",
        baseDescription: "An airplane flying in clouds",
        difference: {
            type: "count",
            element: "windows",
            original: "6 windows",
            reflection: "5 windows",
            hint: "Máy bay có mấy cửa sổ?",
            location: { x: 0.5, y: 0.5 }
        },
        difficulty: 2
    },
    {
        id: 68,
        category: "vehicles",
        sceneName: "train_station",
        baseDescription: "A colorful train at station",
        difference: {
            type: "count",
            element: "train cars",
            original: "4 cars",
            reflection: "3 cars",
            hint: "Tàu hỏa có mấy toa?",
            location: { x: 0.5, y: 0.5 }
        },
        difficulty: 2
    },
    {
        id: 69,
        category: "vehicles",
        sceneName: "sailboat_ocean",
        baseDescription: "A sailboat on calm ocean",
        difference: {
            type: "color",
            element: "sail",
            original: "white sail",
            reflection: "red sail",
            hint: "Cánh buồm màu gì?",
            location: { x: 0.5, y: 0.3 }
        },
        difficulty: 2
    },
    {
        id: 70,
        category: "vehicles",
        sceneName: "bicycle_park",
        baseDescription: "A bicycle in the park",
        difference: {
            type: "presence",
            element: "basket",
            original: "with basket",
            reflection: "without basket",
            hint: "Xe đạp có giỏ không?",
            location: { x: 0.5, y: 0.4 }
        },
        difficulty: 2
    },
    {
        id: 71,
        category: "vehicles",
        sceneName: "helicopter",
        baseDescription: "A helicopter in the sky",
        difference: {
            type: "color",
            element: "body",
            original: "blue body",
            reflection: "yellow body",
            hint: "Thân trực thăng màu gì?",
            location: { x: 0.5, y: 0.5 }
        },
        difficulty: 2
    },
    {
        id: 72,
        category: "vehicles",
        sceneName: "school_bus",
        baseDescription: "A yellow school bus",
        difference: {
            type: "count",
            element: "wheels",
            original: "4 wheels visible",
            reflection: "3 wheels visible",
            hint: "Thấy được mấy bánh xe?",
            location: { x: 0.5, y: 0.7 }
        },
        difficulty: 3
    },
    {
        id: 73,
        category: "vehicles",
        sceneName: "rocket_launch",
        baseDescription: "A rocket launching into space",
        difference: {
            type: "count",
            element: "flames",
            original: "3 flames",
            reflection: "2 flames",
            hint: "Có mấy ngọn lửa phía sau?",
            location: { x: 0.5, y: 0.8 }
        },
        difficulty: 3
    },
    {
        id: 74,
        category: "vehicles",
        sceneName: "hot_air_balloon",
        baseDescription: "A colorful hot air balloon",
        difference: {
            type: "pattern",
            element: "balloon",
            original: "striped",
            reflection: "checkered",
            hint: "Khinh khí cầu có họa tiết gì?",
            location: { x: 0.5, y: 0.4 }
        },
        difficulty: 3
    },
    {
        id: 75,
        category: "vehicles",
        sceneName: "submarine_ocean",
        baseDescription: "A submarine underwater",
        difference: {
            type: "count",
            element: "portholes",
            original: "4 portholes",
            reflection: "3 portholes",
            hint: "Tàu ngầm có mấy cửa sổ tròn?",
            location: { x: 0.5, y: 0.5 }
        },
        difficulty: 3
    },

    // ===================== FANTASY (15 pairs) =====================
    {
        id: 76,
        category: "fantasy",
        sceneName: "fairy_castle",
        baseDescription: "A magical fairy castle",
        difference: {
            type: "count",
            element: "towers",
            original: "4 towers",
            reflection: "3 towers",
            hint: "Lâu đài có mấy tháp?",
            location: { x: 0.5, y: 0.3 }
        },
        difficulty: 1
    },
    {
        id: 77,
        category: "fantasy",
        sceneName: "unicorn_rainbow",
        baseDescription: "A unicorn with rainbow mane",
        difference: {
            type: "color",
            element: "horn",
            original: "golden horn",
            reflection: "silver horn",
            hint: "Sừng kỳ lân màu gì?",
            location: { x: 0.5, y: 0.2 }
        },
        difficulty: 1
    },
    {
        id: 78,
        category: "fantasy",
        sceneName: "magic_wand",
        baseDescription: "A sparkling magic wand",
        difference: {
            type: "shape",
            element: "wand tip",
            original: "star tip",
            reflection: "heart tip",
            hint: "Đầu đũa thần hình gì?",
            location: { x: 0.5, y: 0.3 }
        },
        difficulty: 1
    },
    {
        id: 79,
        category: "fantasy",
        sceneName: "dragon_cave",
        baseDescription: "A friendly dragon in a cave",
        difference: {
            type: "color",
            element: "dragon scales",
            original: "green dragon",
            reflection: "purple dragon",
            hint: "Rồng con màu gì?",
            location: { x: 0.5, y: 0.5 }
        },
        difficulty: 2
    },
    {
        id: 80,
        category: "fantasy",
        sceneName: "fairy_wings",
        baseDescription: "A fairy with sparkling wings",
        difference: {
            type: "color",
            element: "wings",
            original: "blue wings",
            reflection: "pink wings",
            hint: "Cánh tiên màu gì?",
            location: { x: 0.5, y: 0.4 }
        },
        difficulty: 2
    },
    {
        id: 81,
        category: "fantasy",
        sceneName: "crystal_ball",
        baseDescription: "A glowing crystal ball",
        difference: {
            type: "color",
            element: "glow",
            original: "purple glow",
            reflection: "blue glow",
            hint: "Quả cầu pha lê phát sáng màu gì?",
            location: { x: 0.5, y: 0.5 }
        },
        difficulty: 2
    },
    {
        id: 82,
        category: "fantasy",
        sceneName: "mermaid_ocean",
        baseDescription: "A mermaid sitting on a rock",
        difference: {
            type: "color",
            element: "tail",
            original: "teal tail",
            reflection: "purple tail",
            hint: "Đuôi nàng tiên cá màu gì?",
            location: { x: 0.5, y: 0.7 }
        },
        difficulty: 2
    },
    {
        id: 83,
        category: "fantasy",
        sceneName: "wizard_hat",
        baseDescription: "A wizard's pointed hat with stars",
        difference: {
            type: "count",
            element: "stars on hat",
            original: "5 stars",
            reflection: "4 stars",
            hint: "Có mấy ngôi sao trên mũ?",
            location: { x: 0.5, y: 0.4 }
        },
        difficulty: 2
    },
    {
        id: 84,
        category: "fantasy",
        sceneName: "magic_potion",
        baseDescription: "Colorful magic potions in bottles",
        difference: {
            type: "color",
            element: "center potion",
            original: "green potion",
            reflection: "red potion",
            hint: "Bình thuốc ở giữa màu gì?",
            location: { x: 0.5, y: 0.5 }
        },
        difficulty: 2
    },
    {
        id: 85,
        category: "fantasy",
        sceneName: "enchanted_forest",
        baseDescription: "An enchanted forest with glowing mushrooms",
        difference: {
            type: "count",
            element: "glowing mushrooms",
            original: "4 mushrooms",
            reflection: "3 mushrooms",
            hint: "Có mấy cây nấm phát sáng?",
            location: { x: 0.4, y: 0.6 }
        },
        difficulty: 3
    },
    {
        id: 86,
        category: "fantasy",
        sceneName: "phoenix_fire",
        baseDescription: "A magnificent phoenix in flames",
        difference: {
            type: "count",
            element: "tail feathers",
            original: "5 feathers",
            reflection: "4 feathers",
            hint: "Phượng hoàng có mấy lông đuôi?",
            location: { x: 0.6, y: 0.6 }
        },
        difficulty: 3
    },
    {
        id: 87,
        category: "fantasy",
        sceneName: "treasure_map",
        baseDescription: "An ancient treasure map",
        difference: {
            type: "presence",
            element: "compass rose",
            original: "with compass",
            reflection: "without compass",
            hint: "Bản đồ có la bàn không?",
            location: { x: 0.8, y: 0.2 }
        },
        difficulty: 3
    },
    {
        id: 88,
        category: "fantasy",
        sceneName: "magic_mirror",
        baseDescription: "An ornate magic mirror",
        difference: {
            type: "shape",
            element: "frame",
            original: "oval frame",
            reflection: "rectangular frame",
            hint: "Khung gương hình gì?",
            location: { x: 0.5, y: 0.5 }
        },
        difficulty: 3
    },
    {
        id: 89,
        category: "fantasy",
        sceneName: "flying_carpet",
        baseDescription: "A magical flying carpet",
        difference: {
            type: "pattern",
            element: "carpet",
            original: "geometric pattern",
            reflection: "floral pattern",
            hint: "Thảm bay có họa tiết gì?",
            location: { x: 0.5, y: 0.5 }
        },
        difficulty: 3
    },
    {
        id: 90,
        category: "fantasy",
        sceneName: "genie_lamp",
        baseDescription: "A golden genie lamp",
        difference: {
            type: "presence",
            element: "smoke",
            original: "with magical smoke",
            reflection: "without smoke",
            hint: "Có khói thần kỳ bay ra không?",
            location: { x: 0.6, y: 0.2 }
        },
        difficulty: 3
    },

    // ===================== SEASONAL (10 pairs) =====================
    {
        id: 91,
        category: "seasonal",
        sceneName: "christmas_tree",
        baseDescription: "A decorated Christmas tree",
        difference: {
            type: "count",
            element: "ornaments",
            original: "8 ornaments",
            reflection: "7 ornaments",
            hint: "Có mấy quả cầu trang trí?",
            location: { x: 0.5, y: 0.4 }
        },
        difficulty: 1
    },
    {
        id: 92,
        category: "seasonal",
        sceneName: "snowman_winter",
        baseDescription: "A friendly snowman with hat",
        difference: {
            type: "color",
            element: "scarf",
            original: "red scarf",
            reflection: "blue scarf",
            hint: "Người tuyết đeo khăn màu gì?",
            location: { x: 0.5, y: 0.5 }
        },
        difficulty: 1
    },
    {
        id: 93,
        category: "seasonal",
        sceneName: "easter_eggs",
        baseDescription: "Decorated Easter eggs in basket",
        difference: {
            type: "count",
            element: "eggs",
            original: "6 eggs",
            reflection: "5 eggs",
            hint: "Có mấy quả trứng Phục Sinh?",
            location: { x: 0.5, y: 0.5 }
        },
        difficulty: 1
    },
    {
        id: 94,
        category: "seasonal",
        sceneName: "halloween_pumpkin",
        baseDescription: "Jack-o-lantern pumpkin",
        difference: {
            type: "shape",
            element: "eyes",
            original: "triangle eyes",
            reflection: "round eyes",
            hint: "Mắt bí ngô hình gì?",
            location: { x: 0.5, y: 0.4 }
        },
        difficulty: 2
    },
    {
        id: 95,
        category: "seasonal",
        sceneName: "valentines_heart",
        baseDescription: "Valentine's hearts and flowers",
        difference: {
            type: "count",
            element: "hearts",
            original: "5 hearts",
            reflection: "4 hearts",
            hint: "Có mấy trái tim?",
            location: { x: 0.5, y: 0.4 }
        },
        difficulty: 2
    },
    {
        id: 96,
        category: "seasonal",
        sceneName: "summer_beach",
        baseDescription: "Beach scene with sandcastle",
        difference: {
            type: "count",
            element: "shells",
            original: "4 shells",
            reflection: "3 shells",
            hint: "Có mấy vỏ sò trên cát?",
            location: { x: 0.6, y: 0.7 }
        },
        difficulty: 2
    },
    {
        id: 97,
        category: "seasonal",
        sceneName: "autumn_harvest",
        baseDescription: "Autumn harvest with pumpkins",
        difference: {
            type: "color",
            element: "big pumpkin",
            original: "orange pumpkin",
            reflection: "white pumpkin",
            hint: "Quả bí ngô lớn màu gì?",
            location: { x: 0.4, y: 0.6 }
        },
        difficulty: 2
    },
    {
        id: 98,
        category: "seasonal",
        sceneName: "spring_garden",
        baseDescription: "Spring garden with baby animals",
        difference: {
            type: "count",
            element: "chicks",
            original: "3 chicks",
            reflection: "2 chicks",
            hint: "Có mấy chú gà con?",
            location: { x: 0.5, y: 0.6 }
        },
        difficulty: 3
    },
    {
        id: 99,
        category: "seasonal",
        sceneName: "new_year_fireworks",
        baseDescription: "New Year fireworks display",
        difference: {
            type: "color",
            element: "big firework",
            original: "gold firework",
            reflection: "green firework",
            hint: "Pháo hoa lớn nhất màu gì?",
            location: { x: 0.5, y: 0.3 }
        },
        difficulty: 3
    },
    {
        id: 100,
        category: "seasonal",
        sceneName: "thanksgiving_feast",
        baseDescription: "Thanksgiving dinner table",
        difference: {
            type: "presence",
            element: "pie",
            original: "with pie",
            reflection: "without pie",
            hint: "Có bánh pie trên bàn không?",
            location: { x: 0.7, y: 0.5 }
        },
        difficulty: 3
    }
];

/**
 * Select 10 random puzzles for a game session
 * Ensures variety: at least 2 easy, 3 medium, 2 hard
 * No duplicate categories in adjacent mirrors
 * @returns {Array} Array of 10 puzzle configurations
 */
function selectMirrorPuzzles() {
    // Separate puzzles by difficulty
    const easyPuzzles = MIRROR_PUZZLES.filter(p => p.difficulty === 1);
    const mediumPuzzles = MIRROR_PUZZLES.filter(p => p.difficulty === 2);
    const hardPuzzles = MIRROR_PUZZLES.filter(p => p.difficulty === 3);
    
    // Shuffle each difficulty array
    Phaser.Utils.Array.Shuffle(easyPuzzles);
    Phaser.Utils.Array.Shuffle(mediumPuzzles);
    Phaser.Utils.Array.Shuffle(hardPuzzles);
    
    // Select guaranteed puzzles: 2 easy, 3 medium, 2 hard = 7 total
    const selected = [];
    selected.push(...easyPuzzles.slice(0, 2));
    selected.push(...mediumPuzzles.slice(0, 3));
    selected.push(...hardPuzzles.slice(0, 2));
    
    // Fill remaining 3 slots randomly from remaining puzzles
    const remaining = [
        ...easyPuzzles.slice(2),
        ...mediumPuzzles.slice(3),
        ...hardPuzzles.slice(2)
    ];
    Phaser.Utils.Array.Shuffle(remaining);
    selected.push(...remaining.slice(0, 3));
    
    // Shuffle selected puzzles
    Phaser.Utils.Array.Shuffle(selected);
    
    // Reorder to avoid adjacent duplicate categories
    const reordered = reorderToAvoidDuplicateCategories(selected);
    
    return reordered;
}

/**
 * Reorder puzzles to avoid adjacent duplicate categories
 * @param {Array} puzzles - Array of puzzles to reorder
 * @returns {Array} Reordered array
 */
function reorderToAvoidDuplicateCategories(puzzles) {
    const result = [puzzles[0]];
    const remaining = puzzles.slice(1);
    
    while (remaining.length > 0) {
        const lastCategory = result[result.length - 1].category;
        
        // Find a puzzle with different category
        let foundIndex = remaining.findIndex(p => p.category !== lastCategory);
        
        // If no different category found, just take the first one
        if (foundIndex === -1) {
            foundIndex = 0;
        }
        
        result.push(remaining[foundIndex]);
        remaining.splice(foundIndex, 1);
    }
    
    return result;
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MIRROR_PUZZLES, selectMirrorPuzzles };
}

