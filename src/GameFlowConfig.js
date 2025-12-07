/**
 * GameFlowConfig.js - Centralized game flow configuration
 * Control the sequence of levels and game progression
 */

const GameFlowConfig = {
    /**
     * ============================================
     * SCREEN CONFIGURATION
     * ============================================
     * List of available game screens (independent gameplays).
     * Each screen is independent - completing a screen returns to menu.
     * 
     * Available screens:
     * - 'CountingForestScreen' : Counting Forest (Khu Rừng Đếm Số) - Math addition
     * - 'MirrorCityScreen' : Mirror City (Thành Phố Gương) - Spot the difference
     */
    screenOrder: ['CountingForestScreen', 'MirrorCityScreen'],

    /**
     * ============================================
     * GAME MODE
     * ============================================
     */
    // Levels are independent - completing a level returns to menu
    // No continuous story transitions between levels
    independentLevels: true,

    /**
     * ============================================
     * DEBUG / TESTING OPTIONS
     * ============================================
     */
    // Skip directly to a specific screen (set to null for normal flow)
    // Options: null, 'CountingForestScreen', 'MirrorCityScreen'
    skipToScreen: null,

    // Show level selection in menu (allows choosing any level)
    showLevelSelect: true,

    // Enable debug mode (shows extra info in console)
    debugMode: false,

    /**
     * ============================================
     * LEVEL METADATA
     * ============================================
     * Information about each level for UI display
     */
    screenInfo: {
        'CountingForestScreen': {
            id: 1,
            key: 'CountingForestScreen',
            name: 'Khu Rừng Đếm Số',
            nameEN: 'Counting Forest',
            subtitle: 'Cầu Toán Học',
            description: 'Giải các bài toán cộng để sửa cây cầu gỗ',
            icon: '🌲',
            color: 0x228B22,
            reward: 'Sức Mạnh Của Những Con Số'
        },
        'MirrorCityScreen': {
            id: 2,
            key: 'MirrorCityScreen',
            name: 'Thành Phố Gương',
            nameEN: 'Mirror City',
            subtitle: 'Tìm Điểm Khác Biệt',
            description: 'Tìm điểm khác biệt để khôi phục những tấm gương thiêng',
            icon: '🪞',
            color: 0x9370DB,
            reward: 'Sức Mạnh Của Quan Sát'
        }
    },

    /**
     * ============================================
     * HELPER METHODS
     * ============================================
     */

    /**
     * Get the first screen to play (after menu)
     * @returns {Object} Screen info object
     */
    getFirstScreen() {
        if (this.skipToScreen) {
            return this.screenInfo[this.skipToScreen] || null;
        }
        const firstKey = this.screenOrder[0];
        return this.screenInfo[firstKey] || null;
    },

    /**
     * Get the next screen after the current one
     * @param {string} currentScreen - Current screen scene key
     * @returns {Object|null} Next screen info object, or null if no more screens
     */
    getNextScreen(currentScreen) {
        const currentIndex = this.screenOrder.indexOf(currentScreen);
        if (currentIndex === -1 || currentIndex >= this.screenOrder.length - 1) {
            return null; // No more screens
        }
        const nextKey = this.screenOrder[currentIndex + 1];
        return this.screenInfo[nextKey] || null;
    },

    /**
     * Get the previous screen
     * @param {string} currentScreen - Current screen scene key
     * @returns {Object|null} Previous screen info object, or null if at start
     */
    getPreviousScreen(currentScreen) {
        const currentIndex = this.screenOrder.indexOf(currentScreen);
        if (currentIndex <= 0) {
            return null;
        }
        const prevKey = this.screenOrder[currentIndex - 1];
        return this.screenInfo[prevKey] || null;
    },

    /**
     * Check if there's a next screen
     * @param {string} currentScreen - Current screen scene key
     * @returns {boolean}
     */
    hasNextScreen(currentScreen) {
        return this.getNextScreen(currentScreen) !== null;
    },

    /**
     * Get screen info by scene key
     * @param {string} screenKey - Screen scene key
     * @returns {Object} Screen info object
     */
    getScreenInfo(screenKey) {
        return this.screenInfo[screenKey] || null;
    },

    /**
     * Get all screens in order with their info
     * @returns {Array} Array of screen info objects
     */
    getAllScreens() {
        return this.screenOrder.map(key => this.screenInfo[key]).filter(Boolean);
    },

    /**
     * Get screen position in the sequence (1-indexed for display)
     * @param {string} screenKey - Screen scene key
     * @returns {number} Position (1, 2, etc.) or 0 if not found
     */
    getScreenPosition(screenKey) {
        const index = this.screenOrder.indexOf(screenKey);
        return index === -1 ? 0 : index + 1;
    },

    /**
     * Get total number of screens
     * @returns {number}
     */
    getTotalScreens() {
        return this.screenOrder.length;
    },

    /**
     * Log current configuration (for debugging)
     */
    logConfig() {
        console.log('=== GameFlowConfig ===');
        console.log('Screen Order:', this.screenOrder);
        console.log('Skip To Screen:', this.skipToScreen);
        console.log('Show Level Select:', this.showLevelSelect);
        console.log('Debug Mode:', this.debugMode);
        console.log('First Screen:', this.getFirstScreen());
        console.log('======================');
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GameFlowConfig };
}

