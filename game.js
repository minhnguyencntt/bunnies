/**
 * Bé Thỏ và Rừng Tri Thức
 * Main Game Configuration
 * Phaser 3.70.0
 */

// Wait for everything to load
(function() {
    'use strict';
    
    // Check if Phaser is loaded
    if (typeof Phaser === 'undefined') {
        console.error('Phaser library not loaded!');
        return;
    }
    
    // Check if all scenes are defined
    if (typeof BootScene === 'undefined') {
        console.error('BootScene not defined!');
        return;
    }
    if (typeof MenuScene === 'undefined') {
        console.error('MenuScene not defined!');
        return;
    }
    if (typeof Level1Scene === 'undefined') {
        console.error('Level1Scene not defined!');
        return;
    }
    if (typeof UIScene === 'undefined') {
        console.error('UIScene not defined!');
        return;
    }
    
    // Game Configuration
    const config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        parent: 'game-container',
        backgroundColor: '#87CEEB', // Sky blue background
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH,
            min: {
                width: 320,
                height: 240
            },
            max: {
                width: 1920,
                height: 1080
            }
        },
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 0 },
                debug: false
            }
        },
        scene: [
            BootScene,
            MenuScene,
            Level1Scene,
            UIScene
        ],
        input: {
            activePointers: 3 // Support multiple touch points
        }
    };

    try {
        // Initialize game
        const game = new Phaser.Game(config);
        console.log('Game initialized successfully!');
        
        // Global game data
        window.gameData = {
            currentLevel: 1,
            score: 0,
            stars: 0,
            soundEnabled: true,
            musicEnabled: true
        };
    } catch (error) {
        console.error('Error initializing game:', error);
        alert('Lỗi khởi tạo game: ' + error.message);
    }
})();


