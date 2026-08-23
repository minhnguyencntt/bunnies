const puppeteer = require('puppeteer-core');
const fs = require('fs');

const BASE = process.env.GAME_URL || 'http://127.0.0.1:8080/index.html';
const CHROME = process.env.CHROME || '/usr/local/bin/google-chrome';
const OUT = '/tmp/bunnies-shots/07-completion.png';
fs.mkdirSync('/tmp/bunnies-shots', { recursive: true });

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

    const games = await page.evaluate(() => GameConfig.allGames().map((g) => g.gameId));
    for (const gameId of games) {
        const ui = await page.evaluate((id) => {
            SaveEngine.reset({ keepAudio: true });
            CompletionEngine.reset();
            const a = new AnalyticsEngine(id, 1);
            const rounds = GameConfig.getLevel(id, 1).rounds;
            for (let i = 0; i < rounds; i++) { a.beginRound(); a.recordAnswer(true); a.finishRound(); }
            const completion = CompletionEngine.completeGame({
                gameId: id, level: 1, analytics: a, parTimeMs: 15000,
            });
            window.game.scene.start('ResultScreen', { completion, rewards: completion.raw, gameId: id, level: 1 });
            return {
                name: completion.gameName,
                primary: completion.recommendedNextAction,
                stickers: completion.rewards.filter((r) => r.isNew && r.type === 'sticker').map((r) => r.name).slice(0, 4),
                persistOk: completion.persistOk,
            };
        }, gameId);
        await page.waitForFunction(() => window.game.scene.isActive('ResultScreen'), { timeout: 8000 });
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
        if (!ui.persistOk) throw new Error(`${gameId} persist failed`);
        if (!texts.includes(ui.name)) throw new Error(`${gameId} missing game name`);
        if (!/TIẾP TỤC/.test(texts)) throw new Error(`${gameId} missing primary TIẾP TỤC`);
        if (!/CHƠI LẠI/.test(texts) || !/CHỌN MÀN/.test(texts) || !/VỀ NHÀ/.test(texts)) {
            throw new Error(`${gameId} missing next actions`);
        }
        if (!/Bạn muốn làm gì tiếp/.test(texts)) throw new Error(`${gameId} dead-end copy`);
        if (!/Sticker mới|Huy hiệu mới|Phần thưởng/.test(texts)) throw new Error(`${gameId} missing reward`);
        if (!ui.stickers.length) throw new Error(`${gameId} no sticker names`);
        for (const name of ui.stickers) {
            if (!texts.includes(name)) throw new Error(`${gameId} missing artwork label ${name}`);
        }
        console.log('ok', gameId, ui.stickers.join(', '));
    }

    await page.screenshot({ path: OUT });

    const nav = await page.evaluate(() => {
        const s = window.game.scene.getScene('ResultScreen');
        s.go('continue');
        s.go('replay');
        s.go('home');
        s.go('levels');
        return window.game.scene.getScenes(true).map((x) => x.sys.settings.key);
    });
    if (nav.filter((k) => k === 'ResultScreen').length > 1) throw new Error('duplicate result');
    if (nav.includes('MenuScreen') && nav.includes('LevelSelectScreen')) {
        throw new Error('nav corruption ' + nav);
    }

    if (errors.length) throw new Error(errors.join(' | '));
    console.log('PASS completion e2e', OUT);
    await browser.close();
})().catch((e) => { console.error('FAIL', e); process.exit(1); });
