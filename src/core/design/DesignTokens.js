/**
 * DesignTokens.js — the single source of visual truth for Bunnies.
 * "Modern 3D Storybook Adventure" + "Soft Toy World":
 * warm, soft, rounded, gently lit, premium children's-game feel.
 *
 * Every screen/component MUST use these tokens — never invent local styles.
 * World accents may differ per world; the global language stays constant.
 */
const DesignTokens = {
    colors: {
        // Global brand
        primary: 0x7c5cbf,      // Bunnies purple
        primaryDark: 0x5c3a8c,
        secondary: 0x4a90e2,    // sky blue
        accent: 0xffd166,       // warm gold
        // Semantic
        success: 0x66bb6a,
        warning: 0xffb74d,
        error: 0xff8a80,        // soft coral — never harsh red
        reward: 0xffd700,
        xp: 0x8bc34a,
        star: 0xffd700,
        gems: 0x4fc3f7,
        // Surfaces (soft storybook)
        surface: 0xfff8e7,      // warm cream cards
        surfaceSoft: 0xfff3d6,
        ink: 0x4a3728,          // warm brown text (never pure black)
        inkSoft: 0x8d6e63,
        overlay: 0x1a0f2e,      // night-purple overlay
        hudBg: 0x2c1810,
        // World accents
        worlds: {
            math_forest: 0x2e8b57,
            mystery_village: 0x9370db,
            candy_garden: 0xff69b4,
            forest_adventure: 0x43a047,
        },
    },

    // Hex string helpers for Phaser text objects
    css: {
        primary: '#7C5CBF', primaryDark: '#5C3A8C', secondary: '#4A90E2',
        accent: '#FFD166', success: '#66BB6A', warning: '#FFB74D', error: '#FF8A80',
        reward: '#FFD700', xp: '#8BC34A', star: '#FFD700', gems: '#4FC3F7',
        surface: '#FFF8E7', ink: '#4A3728', inkSoft: '#8D6E63', white: '#FFFFFF',
    },

    typography: {
        fontFamily: "'Comic Sans MS', 'Arial Rounded MT Bold', Arial, sans-serif",
        display: 36,      // screen titles
        question: 34,     // math questions / equations
        number: 40,       // educational numbers — extra large & readable
        button: 20,
        body: 17,
        caption: 14,
        reward: 30,
        speech: 18,
    },

    spacing: { xs: 6, sm: 12, md: 20, lg: 32, xl: 48 },
    radius: { sm: 10, md: 16, lg: 24, pill: 999 },
    shadow: { offsetY: 4, color: 0x000000, alpha: 0.22 },

    motion: {
        micro: 140,        // buttons, icons
        uiTransition: 280, // panels, cards
        character: 500,    // bunny reactions
        reward: 900,       // stars, stickers
        world: 700,        // scene transitions
        easeOut: 'Back.easeOut',
        easeSoft: 'Sine.easeInOut',
        easePop: 'Power2',
    },

    // Button press physics: 1.0 → 0.94 → 1.03 → 1.0 (tactile, fast)
    press: { down: 0.94, overshoot: 1.03, ms: 70 },

    touch: { minTarget: 46, answerTarget: 96 },

    /**
     * Semantic icon map — one icon per action across the whole game.
     * Emoji render as crisp vector glyphs on all DPIs; never mix in
     * raster icon files or alternate glyphs for the same action.
     */
    icons: {
        back: '◀',
        home: '🏠',
        map: '🗺️',
        settings: '⚙️',
        album: '🎟',
        hint: '💡',
        pause: '⏸️',
        play: '▶',
        close: '✕',
        sound: '🔊',
        music: '🎵',
        star: '⭐',
        gems: '💎',
        level: '🎓',
    },
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DesignTokens };
}
