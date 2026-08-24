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
        return g && g.acceptingInput && g.choiceButtons && g.choiceButtons.length === 3;
    }, { timeout: 10000 });

    const candyHits = await page.evaluate(() => {
        const g = window.game.scene.getScene('CandyGardenScreen');
        const buttons = g.choiceButtons;
        const out = [];
        for (let i = 0; i < buttons.length; i++) {
            const b = buttons[i];
            const ha = b.input && b.input.hitArea;
            const custom = !!(b.input && b.input.customHitArea);
            // Hit area must be centered: Rectangle x = -w/2 (or Circle at 0,0)
            let centered = false;
            if (ha && typeof ha.radius === 'number') {
                centered = ha.x === 0 && ha.y === 0;
            } else if (ha) {
                centered = Math.abs(ha.x + ha.width / 2) < 0.5 && Math.abs(ha.y + ha.height / 2) < 0.5;
            }
            // Neighbor center must not fall inside this button's world hit box
            let stealsNeighbor = false;
            if (i < buttons.length - 1 && ha && ha.width) {
                const next = buttons[i + 1];
                const dx = next.x - b.x;
                const half = ha.width / 2;
                stealsNeighbor = Math.abs(dx) <= half;
            }
            out.push({
                i,
                label: (b.list.find((c) => c.type === 'Text') || {}).text,
                custom,
                centered,
                stealsNeighbor,
                hit: ha ? { x: ha.x, y: ha.y, w: ha.width, h: ha.height, r: ha.radius } : null,
            });
        }
        return out;
    });
    console.log('candy', JSON.stringify(candyHits));
    for (const h of candyHits) {
        if (!h.custom) throw new Error('candy button missing customHitArea: ' + h.i);
        if (!h.centered) throw new Error('candy button hit not centered: ' + h.i + ' ' + JSON.stringify(h.hit));
        if (h.stealsNeighbor) throw new Error('candy button steals neighbor: ' + h.i);
    }

    // Geometric hover: world point at center of button i must fall only in button i's hit box
    const hoverOk = await page.evaluate(() => {
        const g = window.game.scene.getScene('CandyGardenScreen');
        const buttons = g.choiceButtons;
        const results = [];
        for (let i = 0; i < buttons.length; i++) {
            const target = buttons[i];
            const px = target.x;
            const py = target.y;
            const owners = buttons.filter((b) => {
                const ha = b.input && b.input.hitArea;
                if (!ha) return false;
                const lx = px - b.x;
                const ly = py - b.y;
                if (typeof ha.radius === 'number') {
                    return lx * lx + ly * ly <= ha.radius * ha.radius;
                }
                return lx >= ha.x && lx <= ha.x + ha.width && ly >= ha.y && ly <= ha.y + ha.height;
            });
            results.push({
                i,
                owners: owners.map((o) => {
                    const t = o.list && o.list.find((c) => c.type === 'Text');
                    return t && t.text;
                }),
                ok: owners.length === 1 && owners[0] === target,
            });
        }
        return results;
    });
    console.log('hover', JSON.stringify(hoverOk));
    for (const h of hoverOk) {
        if (!h.ok) throw new Error('hover center of button ' + h.i + ' hit ' + JSON.stringify(h.owners));
    }

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
        return g.swatches.map((sw, i) => {
            const ha = sw.input && sw.input.hitArea;
            const custom = !!(sw.input && sw.input.customHitArea);
            const centered = ha && typeof ha.radius === 'number'
                ? ha.x === 0 && ha.y === 0
                : ha && Math.abs(ha.x + ha.width / 2) < 0.5;
            let steals = false;
            if (i < g.swatches.length - 1 && ha) {
                const next = g.swatches[i + 1];
                const dx = next.x - sw.x;
                const half = (ha.radius != null) ? ha.radius : ha.width / 2;
                steals = Math.abs(dx) <= half;
            }
            return { i, custom, centered, steals, colorId: sw.getData('colorId') };
        });
    });
    console.log('palette', JSON.stringify(paletteHits));
    for (const h of paletteHits) {
        if (!h.custom) throw new Error('swatch missing customHitArea');
        if (!h.centered) throw new Error('swatch hit not centered');
        if (h.steals) throw new Error('swatch steals neighbor ' + h.i);
    }

    if (errors.length) throw new Error(errors.join(' | '));
    console.log('PASS hit-area e2e');
    await browser.close();
})().catch((e) => { console.error('FAIL', e); process.exit(1); });
