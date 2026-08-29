/**
 * test_nav.js — NavSystem history stack (browser-like push / back).
 */
const { NavSystem } = require('../src/core/design/NavSystem.js');

function assert(cond, msg) {
    if (!cond) throw new Error(msg);
}

function mockScene(key, extra = {}) {
    const scene = {
        scene: {
            key,
            isActive() { return false; },
            isSleeping() { return false; },
            start(target, data) {
                scene._started = { target, data };
            },
            stop() { scene._stopped = true; },
        },
        sound: { stopAll() {} },
        game: { scene: { getScene() { return null; } } },
        gameId: extra.gameId,
        level: extra.level,
        _navTx: false,
    };
    return scene;
}

NavSystem.resetHistory();

{
    const menu = mockScene('MenuScreen');
    NavSystem.go(menu, 'LevelSelectScreen', { gameId: 'candy_garden' });
    assert(menu._started.target === 'LevelSelectScreen', 'menu → levels');
    assert(NavSystem.history().length === 1, 'pushed menu');
    assert(NavSystem.history()[0].key === 'MenuScreen', 'stack top is menu');
}

{
    const levels = mockScene('LevelSelectScreen', { gameId: 'candy_garden' });
    NavSystem.go(levels, 'CandyGardenScreen', { gameId: 'candy_garden', level: 1 });
    assert(NavSystem.history().map((e) => e.key).join('>') === 'MenuScreen>LevelSelectScreen', 'stack');
}

{
    const game = mockScene('CandyGardenScreen', { gameId: 'candy_garden', level: 1 });
    NavSystem.back(game);
    assert(game._started.target === 'LevelSelectScreen', 'game back → levels');
    assert(game._started.data.gameId === 'candy_garden', 'restored gameId');
    assert(NavSystem.history().length === 1, 'popped levels, menu remains');
}

{
    const levels = mockScene('LevelSelectScreen', { gameId: 'candy_garden' });
    NavSystem.back(levels);
    assert(levels._started.target === 'MenuScreen', 'levels back → menu');
    assert(NavSystem.history().length === 0, 'stack empty at home');
}

{
    NavSystem.resetHistory();
    const menu = mockScene('MenuScreen');
    NavSystem.go(menu, 'StickerAlbumScreen');
    const album = mockScene('StickerAlbumScreen');
    NavSystem.back(album);
    assert(album._started.target === 'MenuScreen', 'album back → menu');
}

{
    NavSystem.resetHistory();
    const menu = mockScene('MenuScreen');
    NavSystem.go(menu, 'CandyGardenScreen', { gameId: 'candy_garden', level: 1 });
    const game = mockScene('CandyGardenScreen', { gameId: 'candy_garden', level: 1 });
    NavSystem.back(game);
    assert(game._started.target === 'MenuScreen', 'direct play back → menu, not a fake LevelSelect');
}

{
    NavSystem.resetHistory();
    const menu = mockScene('MenuScreen');
    NavSystem.go(menu, 'LevelSelectScreen', { gameId: 'candy_garden' });
    const levels = mockScene('LevelSelectScreen', { gameId: 'candy_garden' });
    NavSystem.go(levels, 'CandyGardenScreen', { gameId: 'candy_garden', level: 1 });
    const result = mockScene('ResultScreen', { gameId: 'candy_garden', level: 1 });
    NavSystem.back(result, { key: 'LevelSelectScreen', data: { gameId: 'candy_garden' } });
    assert(result._started.target === 'LevelSelectScreen', 'result back → levels (gameplay was not pushed)');
    assert(NavSystem.history()[0].key === 'MenuScreen', 'menu still under levels');
}

{
    NavSystem.resetHistory();
    const menu = mockScene('MenuScreen');
    NavSystem.go(menu, 'LevelSelectScreen', { gameId: 'candy_garden' });
    const levels = mockScene('LevelSelectScreen', { gameId: 'candy_garden' });
    NavSystem.go(levels, 'CandyGardenScreen', { gameId: 'candy_garden', level: 1 });
    const game = mockScene('CandyGardenScreen', { gameId: 'candy_garden', level: 1 });
    NavSystem.home(game);
    assert(game._started.target === 'MenuScreen', 'home clears to map');
    assert(NavSystem.history().length === 0, 'home clears stack');
}

{
    NavSystem.resetHistory();
    const menu = mockScene('MenuScreen');
    NavSystem.go(menu, 'LevelSelectScreen', { gameId: 'candy_garden' });
    const levels = mockScene('LevelSelectScreen', { gameId: 'candy_garden' });
    NavSystem.go(levels, 'CandyGardenScreen', { gameId: 'candy_garden', level: 1 });
    const game = mockScene('CandyGardenScreen', { gameId: 'candy_garden', level: 1 });
    game._navTx = false;
    const ok = NavSystem.go(game, 'MirrorCityScreen', { gameId: 'mirror_city', level: 1 });
    assert(ok, 'first go wins');
    game._navTx = true;
    const again = NavSystem.go(game, 'MenuScreen');
    assert(!again, 'duplicate nav ignored');
}

{
    NavSystem.resetHistory();
    const result = mockScene('ResultScreen', { gameId: 'candy_garden', level: 1 });
    NavSystem.go(result, 'CandyGardenScreen', { gameId: 'candy_garden', level: 1 });
    assert(NavSystem.history().length === 0, 'Result is transient — not pushed');
}

{
    NavSystem.resetHistory();
    const menu = mockScene('MenuScreen');
    NavSystem.go(menu, 'CandyGardenScreen', { gameId: 'candy_garden', level: 1 });
    const game = mockScene('CandyGardenScreen', { gameId: 'candy_garden', level: 1 });
    NavSystem.backToLevels(game, 'candy_garden');
    assert(game._started.target === 'LevelSelectScreen', 'backToLevels opens levels');
    assert(NavSystem.history()[0] && NavSystem.history()[0].key === 'MenuScreen', 'menu stays under levels');
}

console.log('PASS nav history');
