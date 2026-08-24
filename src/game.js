/**
 * Bunnies và thế giới tri thức
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
    
    // Check if all screens are defined
    if (typeof BootScreen === 'undefined') {
        console.error('BootScreen not defined!');
        return;
    }
    if (typeof MenuScreen === 'undefined') {
        console.error('MenuScreen not defined!');
        return;
    }
    if (typeof CountingForestScreen === 'undefined') {
        console.error('CountingForestScreen not defined!');
        return;
    }
    if (typeof MirrorCityScreen === 'undefined') {
        console.error('MirrorCityScreen not defined!');
        return;
    }
    if (typeof SubtractionHillScreen === 'undefined') {
        console.error('SubtractionHillScreen not defined!');
        return;
    }
    if (typeof OrientationForestScreen === 'undefined') {
        console.error('OrientationForestScreen not defined!');
        return;
    }
    if (typeof GameShell === 'undefined') {
        console.error('GameShell (Game Engine) not defined!');
        return;
    }
    if (typeof CandyGardenScreen === 'undefined') {
        console.error('CandyGardenScreen not defined!');
        return;
    }
    if (typeof ForestAdventureScreen === 'undefined') {
        console.error('ForestAdventureScreen not defined!');
        return;
    }
    
    // Game Configuration
    const config = {
        type: Phaser.AUTO,
        width: 1280,
        height: 720,
        parent: 'game-container',
        backgroundColor: '#87CEEB', // Sky blue background
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH,
            fullscreenTarget: 'game-container',
            expandParent: false,
            min: {
                width: 320,
                height: 240
            },
            max: {
                width: 2560,
                height: 1440
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
            BootScreen,
            MenuScreen,
            LevelSelectScreen,
            StickerAlbumScreen,
            AudioSettingsScreen,
            ResultScreen,
            CountingForestScreen,
            MirrorCityScreen,
            SubtractionHillScreen,
            OrientationForestScreen,
            CandyGardenScreen,
            ForestAdventureScreen
        ],
        input: {
            activePointers: 3 // Support multiple touch points
        }
    };

    try {
        // Initialize game
        const game = new Phaser.Game(config);
        window.game = game; // for debugging / testing
        console.log('Game initialized successfully!');

        // Vào chế độ toàn màn hình ở lần chạm đầu tiên (mobile yêu cầu gesture)
        const enterFullscreen = () => {
            try {
                if (!document.fullscreenElement && game.scale) {
                    const p = game.scale.startFullscreen();
                    if (p && p.catch) p.catch(() => {});
                }
                if (screen.orientation && screen.orientation.lock) {
                    screen.orientation.lock('landscape').catch(() => {});
                }
            } catch (e) { /* trình duyệt không hỗ trợ — bỏ qua */ }
        };
        window.addEventListener('pointerdown', enterFullscreen, { once: true });
        
        // Global game data
        window.gameData = {
            currentLevel: 1,
            score: 0,
            stars: 0,
            soundEnabled: true,
            musicEnabled: true
        };
        
        // Log GameFlowConfig if available
        if (typeof GameFlowConfig !== 'undefined') {
            GameFlowConfig.logConfig();
        }
    } catch (error) {
        console.error('Error initializing game:', error);
        alert('Lỗi khởi tạo game: ' + error.message);
    }
})();


