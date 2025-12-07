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
    if (typeof UIScreen === 'undefined') {
        console.error('UIScreen not defined!');
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
            BootScreen,
            MenuScreen,
            CountingForestScreen,
            MirrorCityScreen,
            UIScreen
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
        
        // Log GameFlowConfig if available
        if (typeof GameFlowConfig !== 'undefined') {
            GameFlowConfig.logConfig();
        }
    } catch (error) {
        console.error('Error initializing game:', error);
        alert('Lỗi khởi tạo game: ' + error.message);
    }
})();


