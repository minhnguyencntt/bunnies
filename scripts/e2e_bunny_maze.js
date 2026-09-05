const puppeteer = require('puppeteer-core');
const fs = require('fs');

const BASE = process.env.GAME_URL || 'http://127.0.0.1:8080/index.html';
const CHROME = process.env.CHROME || '/usr/local/bin/google-chrome';
const OUT = '/tmp/bunnies-shots/09-bunny-maze.png';
fs.mkdirSync('/tmp/bunnies-shots', { recursive: true });

async function playLevel(page, level) {
    await page.evaluate((lv) => {
        SaveEngine.reset({ keepAudio: true });
        CompletionEngine.reset();
        const sc = window.game.scene.getScenes(true)[0];
        NavSystem.go(sc, 'BunnyMazeScreen', { gameId: 'bunny_maze', level: lv });
    }, level);
    await page.waitForFunction(() => window.game.scene.isActive('BunnyMazeScreen'), { timeout: 15000 });
    await page.evaluate(() => {
        const g = window.game.scene.getScene('BunnyMazeScreen');
        const skip = g.children.list.find((c) => c.list && c.list.some((x) => x.text && String(x.text).includes('Chơi ngay')));
        if (skip) skip.emit('pointerdown');
    });
    const rounds = await page.evaluate(() => window.game.scene.getScene('BunnyMazeScreen').levelCfg.rounds);
    for (let round = 0; round < rounds; round++) {
        await page.waitForFunction(() => {
            const g = window.game.scene.getScene('BunnyMazeScreen');
            return g && g.acceptingInput && g.maze;
        }, { timeout: 8000 });
        const last = round === rounds - 1;
        const t0 = last ? Date.now() : 0;
        await page.evaluate(() => {
            window.game.scene.getScene('BunnyMazeScreen').autoWalkToGoal();
        });
        if (last) {
            await page.waitForFunction(() => window.game.scene.isActive('ResultScreen'), { timeout: 4000 });
            console.log('level', level, 'last-answer → Result', Date.now() - t0 + 'ms');
        } else {
            await new Promise((r) => setTimeout(r, 600));
        }
    }
}

(async () => {
    const browser = await puppeteer.launch({
        executablePath: CHROME, headless: 'new',
        args: ['--no-sandbox', '--disable-gpu', '--window-size=1280,800'],
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    const errors = [];
    page.on('pageerror', (e) => errors.push(String(e)));
    await page.goto(BASE, { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.game && window.game.scene && window.game.scene.isActive('MenuScreen'), { timeout: 25000 });

    await playLevel(page, 1);
    const texts = await page.evaluate(() => {
        const s = window.game.scene.getScene('ResultScreen');
        const out = [];
        const walk = (n) => {
            if (n.text) out.push(n.text);
            if (n.list) n.list.forEach(walk);
        };
        s.children.list.forEach(walk);
        return out.join(' | ');
    });
    if (!/Mê Cung Cà Rốt/.test(texts)) throw new Error('missing game name');
    if (!/TIẾP TỤC/.test(texts)) throw new Error('missing TIẾP TỤC');
    if (!/CHƠI LẠI/.test(texts) || !/CHỌN MÀN/.test(texts)) throw new Error('missing next actions');

    await playLevel(page, 2);
    await playLevel(page, 3);

    await page.screenshot({ path: OUT });
    if (errors.length) throw new Error(errors.join(' | '));
    console.log('PASS bunny maze e2e', OUT);
    await browser.close();
})().catch((e) => { console.error('FAIL', e); process.exit(1); });
