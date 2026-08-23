/**
 * sw.js — Service Worker cho PWA "Bunnies và thế giới tri thức".
 * - Precache: shell (HTML/JS/Phaser/icon/nền menu+boot) → cài app xong là vào được menu offline.
 * - Runtime cache-first: mọi asset còn lại (ảnh nền màn chơi, audio, video) được cache
 *   sau lần tải đầu → chơi xong 1 lần là offline hoàn toàn.
 */

const CACHE_VERSION = 'bunnies-pwa-v4';
const PRECACHE = `${CACHE_VERSION}-core`;
const RUNTIME = `${CACHE_VERSION}-runtime`;

const CORE_ASSETS = [
    './',
    './index.html',
    './manifest.webmanifest',
    './lib/phaser.min.js',

    // Icons
    './icons/icon-192.png',
    './icons/icon-512.png',
    './icons/icon-512-maskable.png',
    './icons/apple-touch-icon.png',
    './icons/favicon-64.png',

    // Core character systems
    './core/characters/bunny/BunnyCharacter.js',
    './core/characters/bunny/BunnyAnimationGenerator.js',
    './core/characters/bunny/BunnyBehaviorSystem.js',
    './core/characters/wise_owl/WiseOwlAnimationGenerator.js',
    './core/characters/wise_owl/WiseOwlCharacter.js',
    './core/characters/young_fox/YoungFoxCharacter.js',
    './core/characters/squirrel/SquirrelCharacter.js',
    './core/characters/butterfly/ButterflyGenerator.js',
    './core/characters/butterfly/ButterflyBehaviorSystem.js',
    './core/characters/ambient_creatures/AmbientCreaturesGenerator.js',
    './core/characters/ambient_creatures/AmbientCreaturesBehavior.js',
    './core/characters/firefly/FireflyBehaviorSystem.js',
    './core/characters/bird/BirdBehaviorSystem.js',
    './core/characters/magic_particle/MagicParticleBehaviorSystem.js',

    // Shared helpers
    './core/ui/IntroHelper.js',
    './core/effects/RewardFX.js',

    // Knowledge World Game Engine
    './core/engine/GameConfig.js',
    './core/engine/SaveEngine.js',
    './core/engine/AnalyticsEngine.js',
    './core/engine/ScoringEngine.js',
    './core/engine/StarEngine.js',
    './core/engine/AdaptiveDifficultyEngine.js',
    './core/engine/XPEngine.js',
    './core/engine/AwardEngine.js',
    './core/engine/StickerEngine.js',
    './core/engine/ProgressionEngine.js',
    './core/engine/RewardEngine.js',
    './core/engine/HintEngine.js',

    // Game framework
    './core/game/GameShell.js',
    './core/game/ResultScreen.js',
    './core/game/LevelSelectScreen.js',
    './core/game/StickerAlbumScreen.js',

    // Screens
    './screens/boot/BootScreen.js',
    './screens/menu/world_map_data.js',
    './screens/menu/menu_screen.js',
    './screens/counting_forest/puzzle.js',
    './screens/counting_forest/screen.js',
    './screens/mirror_city/puzzle.js',
    './screens/mirror_city/screen.js',
    './screens/subtraction_hill/puzzle.js',
    './screens/subtraction_hill/screen.js',
    './screens/orientation_forest/puzzle.js',
    './screens/orientation_forest/screen.js',
    './screens/ScreenLevelBackground.js',
    './screens/UIScreen.js',

    // Config + main
    './GameFlowConfig.js',
    './game.js',

    // Nền menu + boot (vào game là thấy ngay, kể cả offline)
    './screens/menu/assets/backgrounds/bunnies_world.jpg',
    './screens/boot/assets/backgrounds/bunnies_world.jpg',

    // Sprite nhân vật vẽ tay
    './core/characters/assets/bunny_idle.png',
    './core/characters/assets/bunny_hop.png',
    './core/characters/assets/bunny_happy.png',
    './core/characters/assets/bunny_sad.png',
    './core/characters/assets/squirrel_side.png',
    './core/characters/assets/squirrel_front.png',
    './core/characters/assets/squirrel_back.png',
    './core/characters/assets/squirrel_happy.png',
    './core/characters/assets/owl_idle.png',
    './core/characters/assets/owl_cheer.png',
    './core/characters/assets/owl_sad.png',
    './core/characters/assets/owl_encourage.png',
    './core/characters/assets/fox_idle.png',
    './core/characters/assets/fox_joy.png',
    './core/characters/assets/fox_hopeful.png',
    './core/characters/assets/fox_walk.png',
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(PRECACHE)
            .then((cache) => cache.addAll(CORE_ASSETS))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((keys) => Promise.all(
                keys.filter((key) => !key.startsWith(CACHE_VERSION))
                    .map((key) => caches.delete(key))
            ))
            .then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    const { request } = event;

    if (request.method !== 'GET') return;

    const url = new URL(request.url);
    if (url.origin !== self.location.origin) return;

    // Điều hướng (mở app): network-first, rớt mạng thì trả index.html đã cache
    if (request.mode === 'navigate') {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    const copy = response.clone();
                    caches.open(PRECACHE).then((cache) => cache.put('./index.html', copy));
                    return response;
                })
                .catch(() => caches.match('./index.html'))
        );
        return;
    }

    // Asset trong game: cache-first, tải về rồi lưu vào runtime cache
    event.respondWith(
        caches.match(request, { ignoreSearch: true })
            .then((cached) => {
                if (cached) return cached;
                return fetch(request).then((response) => {
                    if (response && response.ok) {
                        const copy = response.clone();
                        caches.open(RUNTIME).then((cache) => cache.put(request, copy));
                    }
                    return response;
                });
            })
    );
});
