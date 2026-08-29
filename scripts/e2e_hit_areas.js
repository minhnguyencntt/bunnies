const puppeteer = require('puppeteer-core');

const BASE = process.env.GAME_URL || 'http://127.0.0.1:8080/index.html';
const CHROME = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

(async () => {
    const browser = await puppeteer.launch({
        executablePath: CHROME, headless: 'new',
        args: ['--no-sandbox', '--disable-gpu', '--window-size=1280,800'],
    });
    const page = await browser.newPage();
    await page.setCacheEnabled(false);
    await page.setViewport({ width: 1280, height: 800 });
    const errors = [];
    page.on('pageerror', (e) => errors.push(String(e)));
    await page.goto(BASE + '?v=hit', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(
        () => window.game && window.game.scene && window.game.scene.isActive('MenuScreen'),
        { timeout: 25000 },
    );

    // ── Candy Garden answer buttons ──
    await page.evaluate(() => {
        SaveEngine.reset({ keepAudio: true });
        CompletionEngine.reset();
        NavSystem.go(window.game.scene.getScenes(true)[0], 'CandyGardenScreen', {
            gameId: 'candy_garden', level: 1,
        });
    });
    await page.waitForFunction(() => window.game.scene.isActive('CandyGardenScreen'), { timeout: 15000 });
    await page.evaluate(() => {
        const g = window.game.scene.getScene('CandyGardenScreen');
        const skip = g.children.list.find((c) => c.list && c.list.some((x) => x.text && String(x.text).includes('Chơi ngay')));
        if (skip) skip.emit('pointerdown');
    });
    await page.waitForFunction(() => {
        const g = window.game.scene.getScene('CandyGardenScreen');
        return g && g.acceptingInput && g.choiceButtons && g.choiceButtons.length === 3
            && g.choiceButtons.every((b) => b.scaleX > 0.9);
    }, { timeout: 10000 });

    const candyHits = await page.evaluate(() => {
        const g = window.game.scene.getScene('CandyGardenScreen');
        const mgr = g.input.manager;
        const buttons = g.choiceButtons;
        const labelOf = (b) => ((b.list.find((c) => c.type === 'Text') || {}).text);
        const ownersAt = (px, py) => buttons.filter((b) => mgr.pointWithinHitArea(b, px - b.x, py - b.y));
        const out = [];
        for (let i = 0; i < buttons.length; i++) {
            const b = buttons[i];
            const ha = b.input && b.input.hitArea;
            const custom = !!(b.input && b.input.customHitArea);
            const hw = (ha && ha.width) ? ha.width / 2 : (b.width / 2);
            const hh = (ha && ha.height) ? ha.height / 2 : (b.height / 2);
            const spots = [
                ['center', b.x, b.y],
                ['tl', b.x - hw + 2, b.y - hh + 2],
                ['br', b.x + hw - 2, b.y + hh - 2],
                ['right', b.x + hw - 2, b.y],
                ['bottom', b.x, b.y + hh - 2],
            ];
            const misses = spots.filter(([, px, py]) => {
                const owners = ownersAt(px, py);
                return !(owners.length === 1 && owners[0] === b);
            }).map((s) => s[0]);
            const next = buttons[i + 1];
            const stealsNeighbor = !!(next && ownersAt(next.x, next.y).includes(b));
            out.push({
                i,
                label: labelOf(b),
                custom,
                misses,
                stealsNeighbor,
                hit: ha ? { x: ha.x, y: ha.y, w: ha.width, h: ha.height, r: ha.radius } : null,
            });
        }
        return out;
    });
    console.log('candy', JSON.stringify(candyHits));
    for (const h of candyHits) {
        if (!h.custom) throw new Error('candy button missing customHitArea: ' + h.i);
        if (h.misses.length) throw new Error('candy button visual not fully clickable: ' + h.i + ' ' + h.misses);
        if (h.stealsNeighbor) throw new Error('candy button steals neighbor: ' + h.i);
    }

    const br = await page.evaluate(() => {
        const g = window.game.scene.getScene('CandyGardenScreen');
        const b = g.choiceButtons[0];
        const ha = b.input.hitArea;
        return { x: b.x + ha.width / 2 - 4, y: b.y + ha.height / 2 - 4 };
    });
    const box = await page.evaluate((gx, gy) => {
        const g = window.game;
        const r = g.canvas.getBoundingClientRect();
        return { x: r.left + gx * (r.width / g.scale.width), y: r.top + gy * (r.height / g.scale.height) };
    }, br.x, br.y);
    await page.mouse.click(box.x, box.y);
    const afterTap = await page.evaluate(() => {
        const g = window.game.scene.getScene('CandyGardenScreen');
        return { accepting: g.acceptingInput, score: g.displayScore || 0 };
    });
    if (afterTap.accepting) throw new Error('bottom-right of answer button did not register a tap');

    // ── Color Magic palette swatches ──
    await page.evaluate(() => {
        CompletionEngine.reset();
        NavSystem.go(window.game.scene.getScenes(true)[0], 'ColorMagicScreen', {
            gameId: 'color_magic', level: 1,
        });
    });
    await page.waitForFunction(() => window.game.scene.isActive('ColorMagicScreen'), { timeout: 15000 });
    await page.evaluate(() => {
        const g = window.game.scene.getScene('ColorMagicScreen');
        const skip = g.children.list.find((c) => c.list && c.list.some((x) => x.text && String(x.text).includes('Chơi ngay')));
        if (skip) skip.emit('pointerdown');
    });
    await page.waitForFunction(() => {
        const g = window.game.scene.getScene('ColorMagicScreen');
        return g && g.acceptingInput && g.swatches && g.swatches.length >= 2;
    }, { timeout: 10000 });

    const paletteHits = await page.evaluate(() => {
        const g = window.game.scene.getScene('ColorMagicScreen');
        const mgr = g.input.manager;
        return g.swatches.map((sw, i) => {
            const ha = sw.input && sw.input.hitArea;
            const custom = !!(sw.input && sw.input.customHitArea);
            const r = (ha && ha.radius != null) ? ha.radius : ((ha && ha.width) ? ha.width / 2 : 24);
            const centerOk = mgr.pointWithinHitArea(sw, 0, 0);
            const edgeOk = mgr.pointWithinHitArea(sw, r - 2, 0);
            const next = g.swatches[i + 1];
            const steals = !!(next && mgr.pointWithinHitArea(sw, next.x - sw.x, next.y - sw.y));
            return { i, custom, centerOk, edgeOk, steals, colorId: sw.getData('colorId') };
        });
    });
    console.log('palette', JSON.stringify(paletteHits));
    for (const h of paletteHits) {
        if (!h.custom) throw new Error('swatch missing customHitArea');
        if (!h.centerOk || !h.edgeOk) throw new Error('swatch visual not fully clickable ' + h.i);
        if (h.steals) throw new Error('swatch steals neighbor ' + h.i);
    }

    if (errors.length) throw new Error(errors.join(' | '));
    console.log('PASS hit-area e2e');
    await browser.close();
})().catch((e) => { console.error('FAIL', e); process.exit(1); });
