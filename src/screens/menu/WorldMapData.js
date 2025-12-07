/**
 * World Map Data - Danh sách 30 thành phố trong thế giới Bunnies & Thế Giới Tri Thức
 * Tọa độ theo pixel, background 1920x1080
 */

const WORLD_MAP_CITIES = [
    {
        id: 1,
        name: 'Khu rừng đếm số',
        x: 240,
        y: 310,
        description: 'Đếm số lượng vật thể trong rừng để hoàn thành nhiệm vụ.',
        puzzleTheme: 'Đếm số',
        screenKey: 'CountingForestScreen', // Có thể map với screen hiện có
        visible: true // Hiển thị marker trên bản đồ
    },
    {
        id: 2,
        name: 'Thành phố Gương Kỳ Ảo',
        x: 380,
        y: 260,
        description: 'Tìm điểm khác nhau giữa hai bức tranh ma thuật.',
        puzzleTheme: 'Tìm điểm khác biệt',
        screenKey: 'MirrorCityScreen', // Map với screen hiện có
        visible: true // Hiển thị marker trên bản đồ
    },
    {
        id: 3,
        name: 'Thung lũng Phép Cộng',
        x: 510,
        y: 330,
        description: 'Giải các bài toán cộng đơn giản dành cho trẻ em.',
        puzzleTheme: 'Phép cộng',
        visible: false // Ẩn marker trên bản đồ (chưa có màn chơi)
    },
    {
        id: 4,
        name: 'Đồi Phép Trừ',
        x: 640,
        y: 350,
        description: 'Tìm kết quả phép trừ để mở khóa các chú thỏ tinh nghịch.',
        puzzleTheme: 'Phép trừ',
        visible: false
    },
    {
        id: 5,
        name: 'Thành phố Hình Khối',
        x: 760,
        y: 300,
        description: 'Nhận biết hình vuông, hình tròn, tam giác và ghép chúng lại.',
        puzzleTheme: 'Hình học cơ bản',
        visible: false
    },
    {
        id: 6,
        name: 'Bến Cảng Màu Sắc',
        x: 880,
        y: 340,
        description: 'Phân loại các vật theo màu sắc rực rỡ.',
        puzzleTheme: 'Màu sắc',
        visible: false
    },
    {
        id: 7,
        name: 'Sa mạc Chữ Cái',
        x: 1030,
        y: 380,
        description: 'Tìm chữ cái đúng để giúp chú thỏ vượt qua sa mạc.',
        puzzleTheme: 'Chữ cái',
        visible: false
    },
    {
        id: 8,
        name: 'Núi Âm Thanh',
        x: 1180,
        y: 420,
        description: 'Nghe âm thanh và chọn hình ảnh phù hợp.',
        puzzleTheme: 'Âm thanh',
        visible: false
    },
    {
        id: 9,
        name: 'Thảo nguyên Từ Vựng',
        x: 1330,
        y: 350,
        description: 'Học từ mới thông qua hình ảnh và âm thanh.',
        puzzleTheme: 'Từ vựng',
        visible: false
    },
    {
        id: 10,
        name: 'Thành phố Thời Gian',
        x: 1480,
        y: 300,
        description: 'Nhận biết giờ và thời điểm trong ngày.',
        puzzleTheme: 'Thời gian',
        visible: false
    },
    {
        id: 11,
        name: 'Cảng Logic',
        x: 210,
        y: 500,
        description: 'Sử dụng tư duy logic để giải các câu đố sắp xếp.',
        puzzleTheme: 'Logic',
        visible: false
    },
    {
        id: 12,
        name: 'Hồ Ghép Hình',
        x: 360,
        y: 520,
        description: 'Kéo thả mảnh ghép để hoàn thành bức hình.',
        puzzleTheme: 'Ghép hình',
        visible: false
    },
    {
        id: 13,
        name: 'Hang Động Số Học',
        x: 520,
        y: 540,
        description: 'So sánh lớn hơn, nhỏ hơn giữa các con số.',
        puzzleTheme: 'So sánh số',
        visible: false
    },
    {
        id: 14,
        name: 'Thành phố Bảng Chữ Cái Bí Ẩn',
        x: 650,
        y: 520,
        description: 'Xếp thứ tự bảng chữ cái từ A–Z.',
        puzzleTheme: 'Bảng chữ cái',
        visible: false
    },
    {
        id: 15,
        name: 'Cánh đồng Khoa Học Mini',
        x: 790,
        y: 550,
        description: 'Nhận biết hiện tượng khoa học đơn giản.',
        puzzleTheme: 'Khoa học',
        visible: false
    },
    {
        id: 16,
        name: 'Khu vườn Trung Bình Cộng',
        x: 930,
        y: 520,
        description: 'Tính trung bình cộng của số lượng đồ vật.',
        puzzleTheme: 'Trung bình cộng',
        visible: false
    },
    {
        id: 17,
        name: 'Thành phố Ảo Ảnh Toán Học',
        x: 1080,
        y: 560,
        description: 'Nhận biết quy luật tăng – giảm theo chuỗi.',
        puzzleTheme: 'Quy luật số',
        visible: false
    },
    {
        id: 18,
        name: 'Cao nguyên Ký Ức',
        x: 1230,
        y: 520,
        description: 'Ghi nhớ vị trí các thẻ hình giống nhau.',
        puzzleTheme: 'Trí nhớ',
        visible: false
    },
    {
        id: 19,
        name: 'Thành phố Dòng Chảy Tư Duy',
        x: 1380,
        y: 540,
        description: 'Hoàn thành quy trình gồm các bước theo đúng thứ tự.',
        puzzleTheme: 'Quy trình',
        visible: false
    },
    {
        id: 20,
        name: 'Hòn đảo Bảng Cửu Chương Vui Nhộn',
        x: 1530,
        y: 530,
        description: 'Làm quen bảng cửu chương qua mini game.',
        puzzleTheme: 'Bảng cửu chương',
        visible: false
    },
    {
        id: 21,
        name: 'Cánh đồng Đối Xứng',
        x: 290,
        y: 730,
        description: 'Xác định hình nào đối xứng nhau trên trục.',
        puzzleTheme: 'Đối xứng',
        visible: false
    },
    {
        id: 22,
        name: 'Thành phố Nhạc Điệu',
        x: 430,
        y: 760,
        description: 'Nghe và tái tạo lại giai điệu đơn giản.',
        puzzleTheme: 'Âm nhạc',
        visible: false
    },
    {
        id: 23,
        name: 'Vùng Đầm Lầy Hình Bóng',
        x: 580,
        y: 780,
        description: 'Chọn hình bóng đúng với vật thể.',
        puzzleTheme: 'Hình bóng',
        visible: false
    },
    {
        id: 24,
        name: 'Thành phố Khối Lượng – Trọng Lượng',
        x: 720,
        y: 750,
        description: 'Nhận biết nặng – nhẹ thông qua câu đố trực quan.',
        puzzleTheme: 'Khối lượng',
        visible: false
    },
    {
        id: 25,
        name: 'Làng Phép Nhân Mini',
        x: 870,
        y: 760,
        description: 'Nhân số đơn giản để hoàn thành nhiệm vụ.',
        puzzleTheme: 'Phép nhân',
        visible: false
    },
    {
        id: 26,
        name: 'Khu Rừng Định Hướng',
        x: 1020,
        y: 740,
        description: 'Nhận biết trái – phải – trước – sau.',
        puzzleTheme: 'Định hướng',
        visible: false
    },
    {
        id: 27,
        name: 'Thành phố Gió & Năng Lượng',
        x: 1160,
        y: 770,
        description: 'Ghép đúng nguồn năng lượng vào thiết bị.',
        puzzleTheme: 'Năng lượng',
        visible: false
    },
    {
        id: 28,
        name: 'Thung lũng Hình Học',
        x: 1310,
        y: 730,
        description: 'Xác định diện tích hình học đơn giản (không công thức).',
        puzzleTheme: 'Hình học',
        visible: false
    },
    {
        id: 29,
        name: 'Làng Sáng Tạo',
        x: 1460,
        y: 760,
        description: 'Ghép các mảnh để tạo ra đồ vật mới.',
        puzzleTheme: 'Sáng tạo',
        visible: false
    },
    {
        id: 30,
        name: 'Thành phố Khủng Long',
        x: 1600,
        y: 740,
        description: 'Nhận biết các loài khủng long qua hình ảnh vui nhộn.',
        puzzleTheme: 'Khủng long',
        visible: false
    }
];

// Background dimensions
const WORLD_MAP_WIDTH = 1920;
const WORLD_MAP_HEIGHT = 1080;

