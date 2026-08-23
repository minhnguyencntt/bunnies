const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const BASE = process.env.GAME_URL || 'http://127.0.0.1:8080/index.html';
const CHROME = process.env.CHROME || '/usr/local/bin/google-chrome';
const OUT = '/tmp/bunnies-shots/06-award.png';
fs.mkdirSync(path.dirname(OUT), { recursive: true });

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

    const info = await page.evaluate(() => {
        SaveEngine.reset({ keepAudio: true });
        const a = new AnalyticsEngine('candy_garden', 1);
        for (let i = 0; i < 6; i++) { a.beginRound(); a.recordAnswer(true); a.finishRound(); }
        const rewards = RewardEngine.finishSession('candy_garden', 1, a, 15000);
        window.game.scene.start('ResultScreen', { rewards, gameId: 'candy_garden', level: 1 });
        return {
            awards: rewards.awards.map((x) => x.name),
            stickers: rewards.stickers.map((x) => x.name),
        };
    });
    await page.waitForFunction(() => window.game.scene.isActive('ResultScreen'), { timeout: 8000 });
    await new Promise((r) => setTimeout(r, 700));
    await page.screenshot({ path: OUT });

    const ui = await page.evaluate(() => {
        const s = window.game.scene.getScene('ResultScreen');
        const texts = [];
        s.children.list.forEach((c) => {
            if (c.text) texts.push(c.text);
            if (c.list) c.list.forEach((n) => { if (n.text) texts.push(n.text); });
        });
        return texts.join(' | ');
    });
    console.log('granted', info);
    console.log('ui', ui);
    if (!/Sticker mới/.test(ui)) throw new Error('award screen missing Sticker mới');
    if (!/Huy hiệu mới|Phần thưởng/.test(ui)) throw new Error('award screen missing huy hiệu');
    if (!/TIẾP TỤC|CHƠI LẠI|CHỌN MÀN|VỀ NHÀ/.test(ui)) throw new Error('award screen missing next action');
    if (!/Bạn muốn làm gì tiếp/.test(ui)) throw new Error('award screen dead-end');
    if (!info.stickers.length) throw new Error('engine granted no stickers');
    if (errors.length) throw new Error(errors.join(' | '));
    console.log('PASS award screen', OUT);
    await browser.close();
})().catch((e) => { console.error('FAIL', e); process.exit(1); });
