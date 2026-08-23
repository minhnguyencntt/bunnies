/**
 * E2E: navigation stack, first-tap play, no hover gate, Result → Level Select.
 */
const puppeteer = require('puppeteer-core');

const BASE = process.env.GAME_URL || 'http://127.0.0.1:8080/index.html';
const CHROME = process.env.CHROME || '/usr/local/bin/google-chrome';

function fail(msg, extra) {
    console.error('FAIL', msg, extra || '');
    process.exitCode = 1;
}

async function waitForScene(page, key, ms = 15000) {
    await page.waitForFunction((k) => {
        const g = window.game;
        return !!(g && g.scene && g.scene.isActive(k));
    }, { timeout: ms }, key);
}

async function activeScenes(page) {
    return page.evaluate(() => {
        const g = window.game;
        if (!g) return [];
        return g.scene.getScenes(true).map((s) => s.sys.settings.key);
    });
}

async function tapCanvas(page, gx, gy) {
    const box = await page.evaluate((gx, gy) => {
        const g = window.game;
        const c = g.canvas;
        const r = c.getBoundingClientRect();
        return {
            x: r.left + gx * (r.width / g.scale.width),
            y: r.top + gy * (r.height / g.scale.height),
        };
    }, gx, gy);
    await page.mouse.click(box.x, box.y);
}

(async () => {
    const browser = await puppeteer.launch({
        executablePath: CHROME,
        headless: 'new',
        args: ['--no-sandbox', '--disable-gpu', '--window-size=1280,800'],
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    const errors = [];
    page.on('pageerror', (e) => errors.push(String(e)));

    await page.goto(BASE, { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.game && window.game.scene, { timeout: 20000 });
    await waitForScene(page, 'MenuScreen', 25000);

    let scenes = await activeScenes(page);
    console.log('menu scenes', scenes);
    if (!scenes.includes('MenuScreen')) fail('MenuScreen not active', scenes);

    const mapInfo = await page.evaluate(() => {
        const s = window.game.scene.getScene('MenuScreen');
        return {
            markers: (s.cityMarkers || []).length,
            hoverSpeech: typeof s.playCityDescription === 'function' && s.blurOverlay != null,
            namesVisible: (s.cityMarkers || []).every((m) => {
                const lab = m.getData('nameLabel');
                return lab && lab.visible && lab.alpha > 0.5;
            }),
            bunniesInteractive: (s.bunnies || []).some((b) => b.input && b.input.enabled),
            first: s.cityMarkers && s.cityMarkers[0] ? {
                x: s.cityMarkers[0].x, y: s.cityMarkers[0].y,
                city: s.cityMarkers[0].getData('city') && s.cityMarkers[0].getData('city').name,
            } : null,
        };
    });
    console.log('map', mapInfo);
    if (mapInfo.markers < 6) fail('expected 6 playable city markers', mapInfo);
    if (mapInfo.hoverSpeech) fail('hover dim/speech overlay still present');
    if (!mapInfo.namesVisible) fail('city names must be visible without hover');
    if (mapInfo.bunniesInteractive) fail('bunnies must not steal taps');

    // First tap on the first city — must open Level Select (no hover gate)
    await tapCanvas(page, mapInfo.first.x, mapInfo.first.y);
    try {
        await waitForScene(page, 'LevelSelectScreen', 8000);
    } catch (e) {
        fail('first city tap did not open LevelSelect', await activeScenes(page));
        await browser.close();
        return;
    }
    scenes = await activeScenes(page);
    console.log('after city tap', scenes);
    if (scenes.includes('MenuScreen')) fail('Menu still active after city tap');

    // Back from Level Select → Map
    await page.evaluate(() => NavSystem.home(window.game.scene.getScene('LevelSelectScreen')));
    await waitForScene(page, 'MenuScreen', 8000);
    console.log('back to menu', await activeScenes(page));

    // Re-enter first city, tap Play via NavSystem-equivalent (card start)
    await page.evaluate(() => {
        const s = window.game.scene.getScene('MenuScreen');
        const m = s.cityMarkers[0];
        s.onMarkerClick(m, m.getData('city'));
    });
    await waitForScene(page, 'LevelSelectScreen', 8000);

    const started = await page.evaluate(() => {
        const s = window.game.scene.getScene('LevelSelectScreen');
        const def = GameConfig.get(s.gameId);
        NavSystem.go(s, def.sceneKey, { gameId: s.gameId, level: 1 });
        return def.sceneKey;
    });
    await waitForScene(page, started, 10000);
    console.log('gameplay', started, await activeScenes(page));

    // Back from gameplay → Level Select (NOT menu)
    await page.evaluate(() => {
        const key = window.game.scene.getScenes(true).find((s) => s.goBack).sys.settings.key;
        window.game.scene.getScene(key).goBack();
    });
    await waitForScene(page, 'LevelSelectScreen', 8000);
    scenes = await activeScenes(page);
    console.log('game back', scenes);
    if (scenes.includes('MenuScreen')) fail('game Back went to Home instead of Level Select');
    if (!scenes.includes('LevelSelectScreen')) fail('game Back did not reach Level Select');

    // Home from a game via exitToMenu
    await page.evaluate(() => {
        const s = window.game.scene.getScene('LevelSelectScreen');
        const def = GameConfig.get(s.gameId);
        NavSystem.go(s, def.sceneKey, { gameId: s.gameId, level: 1 });
    });
    await waitForScene(page, started, 10000);
    await page.evaluate(() => {
        const g = window.game.scene.getScenes(true).find((s) => s.exitToMenu);
        g.exitToMenu();
    });
    await waitForScene(page, 'MenuScreen', 8000);
    console.log('home from game', await activeScenes(page));

    // Result Back → Level Select (simulate finish + go('levels'))
    await page.evaluate(() => {
        const s = window.game.scene.getScene('MenuScreen');
        const m = s.cityMarkers.find((c) => c.getData('city').screenKey === 'CandyGardenScreen') || s.cityMarkers[0];
        s.onMarkerClick(m, m.getData('city'));
    });
    await waitForScene(page, 'LevelSelectScreen', 8000);
    const gameId = await page.evaluate(() => {
        const s = window.game.scene.getScene('LevelSelectScreen');
        const def = GameConfig.get(s.gameId);
        NavSystem.go(s, def.sceneKey, { gameId: s.gameId, level: 1 });
        return s.gameId;
    });
    const playKey = await page.evaluate((gid) => GameConfig.get(gid).sceneKey, gameId);
    await waitForScene(page, playKey, 10000);
    await page.evaluate((gid) => {
        const g = window.game.scene.getScenes(true).find((s) => s.gameId);
        g.sessionOver = true;
        g.scene.launch('ResultScreen', {
            gameId: gid,
            level: 1,
            rewards: {
                stars: 2, score: 80, xp: 50, gems: 5, awards: [], stickers: [],
                isNewBest: false, leveledUp: false,
                metrics: { correctAnswers: 4 },
                levelCfg: { rounds: 5 },
                knowledgeLevel: { level: 1, intoLevel: 10, needed: 100 },
                worldProgress: { percent: 10, stars: 2, maxStars: 54 },
            },
        });
    }, gameId);
    await waitForScene(page, 'ResultScreen', 8000);
    await page.evaluate(() => {
        window.game.scene.getScene('ResultScreen').go('levels');
    });
    await waitForScene(page, 'LevelSelectScreen', 8000);
    scenes = await activeScenes(page);
    console.log('result back', scenes);
    if (!scenes.includes('LevelSelectScreen')) fail('Result Back did not reach Level Select');
    if (scenes.includes('MenuScreen')) fail('Result Back went to Map');

    if (errors.length) fail('page errors', errors);
    if (process.exitCode) {
        console.log('DONE with failures');
    } else {
        console.log('PASS navigation e2e');
    }
    await browser.close();
})().catch((e) => {
    console.error(e);
    process.exit(1);
});
