/**
 * E2E: every playable city starts, Back returns to Level Select,
 * and one visual-math session reaches Result then Level Select.
 */
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const BASE = process.env.GAME_URL || 'http://127.0.0.1:8080/index.html';
const CHROME = process.env.CHROME || '/usr/local/bin/google-chrome';
const OUT = process.env.SHOT_DIR || '/tmp/bunnies-shots';
fs.mkdirSync(OUT, { recursive: true });

async function waitForScene(page, key, ms = 15000) {
    await page.waitForFunction((k) => window.game && window.game.scene && window.game.scene.isActive(k), { timeout: ms }, key);
}

async function scenes(page) {
    return page.evaluate(() => window.game.scene.getScenes(true).map((s) => s.sys.settings.key));
}

async function shot(page, name) {
    await page.screenshot({ path: path.join(OUT, name + '.png'), fullPage: true });
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

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
    await waitForScene(page, 'MenuScreen', 25000);
    await sleep(400);
    await shot(page, '01-menu');

    const cities = await page.evaluate(() => window.game.scene.getScene('MenuScreen').cityMarkers.map((m) => {
        const c = m.getData('city');
        return { name: c.name, screenKey: c.screenKey };
    }));
    console.log('cities', cities.map((c) => c.name).join(', '));

    for (const city of cities) {
        await page.evaluate((sk) => {
            const s = window.game.scene.getScene('MenuScreen');
            const m = s.cityMarkers.find((x) => x.getData('city').screenKey === sk);
            s.onMarkerClick(m, m.getData('city'));
        }, city.screenKey);
        await waitForScene(page, 'LevelSelectScreen', 8000);
        await sleep(250);
        await shot(page, `02-levels-${city.screenKey}`);

        const sceneKey = await page.evaluate(() => {
            const s = window.game.scene.getScene('LevelSelectScreen');
            const def = GameConfig.get(s.gameId);
            NavSystem.go(s, def.sceneKey, { gameId: s.gameId, level: 1 });
            return def.sceneKey;
        });
        await waitForScene(page, sceneKey, 10000);
        await sleep(350);
        await shot(page, `03-game-${sceneKey}`);

        await page.evaluate(() => {
            const g = window.game.scene.getScenes(true).find((s) => s.goBack);
            g.goBack();
        });
        await waitForScene(page, 'LevelSelectScreen', 8000);
        const after = await scenes(page);
        if (!after.includes('LevelSelectScreen') || after.includes('MenuScreen')) {
            throw new Error(`Back broken for ${city.name}: ${after}`);
        }
        await page.evaluate(() => NavSystem.home(window.game.scene.getScene('LevelSelectScreen')));
        await waitForScene(page, 'MenuScreen', 8000);
        console.log('ok', city.name);
    }

    // Play Candy Garden L1 to Result
    await page.evaluate(() => {
        const s = window.game.scene.getScene('MenuScreen');
        const m = s.cityMarkers.find((x) => x.getData('city').screenKey === 'CandyGardenScreen');
        s.onMarkerClick(m, m.getData('city'));
    });
    await waitForScene(page, 'LevelSelectScreen', 8000);
    await page.evaluate(() => {
        const s = window.game.scene.getScene('LevelSelectScreen');
        NavSystem.go(s, 'CandyGardenScreen', { gameId: s.gameId, level: 1 });
    });
    await waitForScene(page, 'CandyGardenScreen', 10000);
    await sleep(500);
    await page.evaluate(() => {
        const g = window.game.scene.getScene('CandyGardenScreen');
        const skip = g.children && g.children.list && g.children.list.find((c) => c.list && c.list.some((x) => x.text && String(x.text).includes('Chơi ngay')));
        if (skip) skip.emit('pointerdown');
    });

    const rounds = await page.evaluate(() => window.game.scene.getScene('CandyGardenScreen').levelCfg.rounds);
    for (let round = 0; round < rounds; round++) {
        await page.waitForFunction(() => {
            const g = window.game.scene.getScene('CandyGardenScreen');
            return g && g.acceptingInput && g.currentQuestion && g.choiceButtons && g.choiceButtons.length === 3;
        }, { timeout: 8000 });
        await page.evaluate(() => {
            const g = window.game.scene.getScene('CandyGardenScreen');
            const ans = g.currentQuestion.answer;
            const btn = g.choiceButtons.find((b) => {
                const t = b.list.find((c) => c.type === 'Text');
                return t && t.text === String(ans);
            });
            if (!btn) throw new Error('no correct button');
            btn.emit('pointerdown');
        });
        await sleep(2000);
        console.log('answered round', round + 1);
    }
    const pre = await page.evaluate(() => {
        const g = window.game.scene.getScene('CandyGardenScreen');
        return {
            scenes: window.game.scene.getScenes(true).map((s) => s.sys.settings.key),
            sessionOver: g && g.sessionOver,
            round: g && g.roundIndex,
            accepting: g && g.acceptingInput,
        };
    });
    console.log('pre-result', pre);
    await waitForScene(page, 'ResultScreen', 12000);
    await sleep(600);
    await shot(page, '04-result');
    await page.evaluate(() => window.game.scene.getScene('ResultScreen').go('levels'));
    await waitForScene(page, 'LevelSelectScreen', 8000);
    const end = await scenes(page);
    if (!end.includes('LevelSelectScreen')) throw new Error('result back failed ' + end);
    await shot(page, '05-levels-after-result');

    if (errors.length) throw new Error('page errors: ' + errors.join(' | '));
    console.log('PASS screen e2e, shots in', OUT);
    await browser.close();
})().catch((e) => {
    console.error('FAIL', e);
    process.exit(1);
});
