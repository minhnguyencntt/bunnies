/**
 * BootScene - Khởi tạo game và load assets cơ bản
 */
class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    create() {
        console.log('BootScene: create() called');
        
        // Tạo loading screen nhanh
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // Background loading
        this.add.rectangle(width / 2, height / 2, width, height, 0x87CEEB);
        
        // Loading text
        const loadingText = this.add.text(width / 2, height / 2 - 50, 'Đang tải game...', {
            fontSize: '32px',
            fill: '#FFFFFF',
            fontFamily: 'Arial',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Loading bar background
        const barBg = this.add.rectangle(width / 2, height / 2 + 50, 400, 30, 0xFFFFFF, 0.3);
        const bar = this.add.rectangle(width / 2 - 200, height / 2 + 50, 0, 20, 0x90EE90);

        // Simulate loading progress nhanh
        let progress = 0;
        const updateProgress = () => {
            progress += 0.2;
            if (progress > 1) progress = 1;
            bar.width = 400 * progress;
            bar.x = width / 2 - 200 + (400 * progress) / 2;
            
            if (progress < 1) {
                this.time.delayedCall(100, updateProgress);
            } else {
                // Loading xong, tạo graphics và chuyển scene
                console.log('BootScene: Creating placeholder graphics...');
                this.createPlaceholderGraphics();
                console.log('BootScene: Graphics created, starting MenuScene...');
                this.time.delayedCall(200, () => {
                    this.scene.start('MenuScene');
                });
            }
        };
        
        this.time.delayedCall(100, updateProgress);
    }

    createPlaceholderGraphics() {
        // Tạo background forest đẹp hơn
        const bgGraphics = this.add.graphics();
        // Sky gradient
        bgGraphics.fillGradientStyle(0x87CEEB, 0x87CEEB, 0xFFB6C1, 0xFFB6C1, 1);
        bgGraphics.fillRect(0, 0, 800, 400);
        // Ground
        bgGraphics.fillStyle(0x90EE90, 1);
        bgGraphics.fillRect(0, 400, 800, 200);
        // Trees in background
        for (let i = 0; i < 6; i++) {
            const x = (800 / 7) * (i + 1);
            // Tree crown
            bgGraphics.fillStyle(0x228B22, 1);
            bgGraphics.fillCircle(x, 350, 40);
            bgGraphics.fillStyle(0x32CD32, 0.7);
            bgGraphics.fillCircle(x - 15, 340, 25);
            bgGraphics.fillCircle(x + 15, 340, 25);
            // Tree trunk
            bgGraphics.fillStyle(0x8B4513, 1);
            bgGraphics.fillRect(x - 8, 350, 16, 50);
        }
        bgGraphics.generateTexture('bg_forest_level1', 800, 600);
        bgGraphics.destroy();

        // Tạo button đẹp hơn với shadow
        const btnGraphics = this.add.graphics();
        // Shadow
        btnGraphics.fillStyle(0x000000, 0.3);
        btnGraphics.fillRoundedRect(4, 4, 320, 90, 20);
        // Button gradient
        btnGraphics.fillGradientStyle(0xFFD700, 0xFFD700, 0xFF8C00, 0xFF8C00, 1);
        btnGraphics.fillRoundedRect(0, 0, 320, 90, 20);
        // Border
        btnGraphics.lineStyle(4, 0xFFFFFF, 1);
        btnGraphics.strokeRoundedRect(0, 0, 320, 90, 20);
        // Inner highlight
        btnGraphics.lineStyle(2, 0xFFFFFF, 0.5);
        btnGraphics.strokeRoundedRect(5, 5, 310, 80, 15);
        btnGraphics.generateTexture('btn_primary', 320, 90);
        btnGraphics.destroy();

        // Tạo particle sparkle đẹp hơn
        const particleGraphics = this.add.graphics();
        // Outer glow
        particleGraphics.fillStyle(0xFFD700, 0.5);
        particleGraphics.fillCircle(16, 16, 12);
        // Inner bright
        particleGraphics.fillStyle(0xFFFFFF, 1);
        particleGraphics.fillCircle(16, 16, 6);
        // Points
        particleGraphics.fillStyle(0xFFD700, 1);
        particleGraphics.fillCircle(16, 8, 3);
        particleGraphics.fillCircle(16, 24, 3);
        particleGraphics.fillCircle(8, 16, 3);
        particleGraphics.fillCircle(24, 16, 3);
        particleGraphics.generateTexture('particle_sparkle', 32, 32);
        particleGraphics.destroy();

        // Tạo bunny sprite đẹp hơn
        const bunnyGraphics = this.add.graphics();
        // Body (white)
        bunnyGraphics.fillStyle(0xFFFFFF, 1);
        bunnyGraphics.fillCircle(40, 50, 25);
        // Ears
        bunnyGraphics.fillStyle(0xFFFFFF, 1);
        bunnyGraphics.fillEllipse(25, 20, 12, 25);
        bunnyGraphics.fillEllipse(55, 20, 12, 25);
        // Inner ears (pink)
        bunnyGraphics.fillStyle(0xFFB6C1, 1);
        bunnyGraphics.fillEllipse(25, 25, 8, 18);
        bunnyGraphics.fillEllipse(55, 25, 8, 18);
        // Eyes
        bunnyGraphics.fillStyle(0x4A90E2, 1);
        bunnyGraphics.fillCircle(32, 45, 6);
        bunnyGraphics.fillCircle(48, 45, 6);
        // Eye highlights
        bunnyGraphics.fillStyle(0xFFFFFF, 1);
        bunnyGraphics.fillCircle(34, 43, 2);
        bunnyGraphics.fillCircle(50, 43, 2);
        // Nose
        bunnyGraphics.fillStyle(0xFF69B4, 1);
        bunnyGraphics.fillTriangle(40, 52, 37, 58, 43, 58);
        // Mouth
        bunnyGraphics.lineStyle(2, 0xFF69B4, 1);
        bunnyGraphics.beginPath();
        bunnyGraphics.moveTo(40, 58);
        bunnyGraphics.lineTo(35, 62);
        bunnyGraphics.moveTo(40, 58);
        bunnyGraphics.lineTo(45, 62);
        bunnyGraphics.strokePath();
        bunnyGraphics.generateTexture('bunny_sprite', 80, 80);
        bunnyGraphics.destroy();
    }
}

