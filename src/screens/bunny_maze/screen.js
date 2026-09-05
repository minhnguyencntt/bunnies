/**
 * screen.js — Mê Cung Cà Rốt. Tìm đường trên lối đất (ô lưới).
 */
class BunnyMazeScreen extends GameShell {
    constructor() {
        super('BunnyMazeScreen');
        this.gameId = 'bunny_maze';
        this.theme = typeof BunnyMazePuzzle !== 'undefined' ? BunnyMazePuzzle : null;
        this.roundObjects = [];
        this.sessionSeed = 1;
        this.maze = null;
        this.tiles = {};
        this.bunnyPos = null;
        this.hasKey = false;
        this.moving = false;
        this.friend = null;
        this.butterflies = [];
        this.birds = [];
        this.fireflies = [];
        this.magicParticles = [];
    }

    onPreload() {
        this.preloadCommonAudio('bunny_maze');
    }

    buildWorld(w, h) {
        const T = (this.theme && this.theme.worldForLevel(this.level)) || {
            skyTop: 0x7ec8e3, skyBottom: 0xffe082, grass: 0x7cb342,
            hill1: 0x66bb6a, hill2: 0x9ccc65, hill3: 0x558b2f,
            sun: 0xfff176, canopy: 0x2e7d32, deco: ['🌸', '🌿', '🥕'],
            particleColors: [0xffffff, 0xfff59d],
        };
        this.paintGarden(w, h, T);
        this.addWorldLife(w, h, T);
    }

    paintGarden(w, h, T) {
        const g = this.add.graphics().setDepth(0);
        g.fillGradientStyle(T.skyTop, T.skyTop, T.skyBottom, T.skyBottom, 1);
        g.fillRect(0, 0, w, h);

        g.fillStyle(T.sun, 0.35);
        g.fillCircle(w * 0.84, h * 0.15, 62);
        g.fillStyle(T.sun, 0.92);
        g.fillCircle(w * 0.84, h * 0.15, 30);

        g.fillStyle(T.hill3, 0.55);
        g.fillEllipse(-20, h * 0.78, 320, 180);
        g.fillEllipse(w + 20, h * 0.80, 320, 170);
        g.fillStyle(T.hill1, 0.88);
        g.fillEllipse(w * 0.18, h * 1.06, w * 0.72, h * 0.58);
        g.fillStyle(T.hill2, 0.9);
        g.fillEllipse(w * 0.86, h * 1.08, w * 0.7, h * 0.56);
        g.fillStyle(T.grass, 0.95);
        g.fillEllipse(w * 0.50, h * 1.18, w * 1.1, h * 0.5);

        this.drawTree(g, w * 0.07, h * 0.58, 1.15, T.canopy);
        this.drawTree(g, w * 0.14, h * 0.64, 0.85, T.hill3);
        this.drawTree(g, w * 0.93, h * 0.56, 1.2, T.canopy);
        this.drawTree(g, w * 0.86, h * 0.66, 0.75, T.hill3);

        g.fillStyle(0xe67e22, 0.85);
        [[0.05, 0.86], [0.10, 0.90], [0.91, 0.88], [0.96, 0.84]].forEach(([x, y]) => {
            g.fillEllipse(w * x, h * y, 18, 28);
            g.fillStyle(0x7cb342, 0.9);
            g.fillRect(w * x - 2, h * y + 10, 4, 12);
            g.fillStyle(0xe67e22, 0.85);
        });
    }

    drawTree(g, x, y, s, canopy) {
        g.fillStyle(0x8d6e46, 1);
        g.fillRoundedRect(x - 7 * s, y, 14 * s, 42 * s, 5);
        g.fillStyle(canopy, 0.95);
        g.fillCircle(x, y - 6 * s, 30 * s);
        g.fillCircle(x - 20 * s, y + 8 * s, 22 * s);
        g.fillCircle(x + 18 * s, y + 10 * s, 20 * s);
    }

    addWorldLife(w, h, T) {
        this.addCloud(w * 0.22, h * 0.13, 1.1);
        this.addCloud(w * 0.48, h * 0.10, 0.75);
        this.addCloud(w * 0.68, h * 0.16, 0.95);

        const flora = (T.deco || ['🌸', '🌿']).concat(['🥕']);
        const spots = [
            { x: 0.05, y: 0.34 }, { x: 0.11, y: 0.42 }, { x: 0.06, y: 0.74 },
            { x: 0.94, y: 0.32 }, { x: 0.89, y: 0.44 }, { x: 0.96, y: 0.70 },
            { x: 0.03, y: 0.52 }, { x: 0.97, y: 0.50 },
        ];
        spots.forEach((s, i) => {
            const x = w * s.x;
            const y = h * s.y;
            const t = this.add.text(x, y, flora[i % flora.length], {
                fontSize: i % 3 === 0 ? '40px' : '30px',
            }).setDepth(6).setOrigin(0.5);
            this.tweens.add({
                targets: t, y: y - 8, angle: i % 2 ? 8 : -8,
                duration: 1700 + i * 140, yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
            });
        });

        const colors = T.particleColors || [0xffffff, 0xfff59d];
        for (let i = 0; i < 14; i++) {
            const side = i % 2 === 0;
            const px = side ? Phaser.Math.Between(18, 150) : Phaser.Math.Between(w - 150, w - 18);
            const py = Phaser.Math.Between(90, h - 80);
            const spark = this.add.graphics().setDepth(7);
            spark.fillStyle(colors[i % colors.length], 0.7);
            spark.fillCircle(0, 0, Phaser.Math.Between(2, 4));
            spark.setPosition(px, py);
            this.tweens.add({
                targets: spark, y: py - Phaser.Math.Between(16, 40), alpha: 0.15,
                duration: Phaser.Math.Between(1800, 3600), yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
            });
        }

        this.flyEmoji('🦋', w * 0.08, h * 0.26, 46, -28, 3800);
        this.flyEmoji('🦋', w * 0.93, h * 0.30, -54, 22, 4400);
        this.flyEmoji('🐦', w * 0.28, h * 0.12, 140, 10, 9000);
        this.flyEmoji('🐦', w * 0.78, h * 0.14, -120, 8, 8200);
        this.flyEmoji('🌸', w * 0.12, h * 0.48, 18, 36, 5200);

        this.spawnGardenBunny(w * 0.045, h * 0.80, 70);
        this.spawnGardenBunny(w * 0.92, h * 0.76, 78);
        this.spawnGardenBunny(w * 0.97, h * 0.86, 54);

        this.spawnButterflies(w, h);
        this.spawnBirds(w, h);
        if (this.level === 3) this.spawnFireflies(w, h);
        this.spawnMagicDust(w, h);
    }

    addCloud(x, y, s) {
        const c = this.add.container(x, y).setDepth(3);
        const g = this.add.graphics();
        g.fillStyle(0xffffff, 0.86);
        g.fillEllipse(0, 0, 78 * s, 30 * s);
        g.fillEllipse(-26 * s, 5 * s, 44 * s, 24 * s);
        g.fillEllipse(28 * s, 3 * s, 40 * s, 22 * s);
        c.add(g);
        this.tweens.add({
            targets: c, x: x + 90 * s, duration: 16000 + s * 1800,
            yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
        });
        this.tweens.add({
            targets: c, y: y - 10, duration: 3400 + s * 200,
            yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
        });
    }

    spawnGardenBunny(x, y, size) {
        const key = this.textures.exists('spr_bunny_idle') ? 'spr_bunny_idle' : null;
        let bun;
        if (key) {
            bun = this.add.image(x, y, key).setDepth(14);
            bun.setScale(size / bun.texture.getSourceImage().height);
        } else {
            bun = this.add.text(x, y, '🐰', { fontSize: Math.round(size * 0.7) + 'px' })
                .setOrigin(0.5).setDepth(14);
        }
        const idle = () => {
            this.tweens.add({
                targets: bun, y: y - 6, duration: 1500, yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
            });
        };
        idle();
        this.time.addEvent({
            delay: Phaser.Math.Between(2400, 4000),
            loop: true,
            callback: () => {
                if (!bun.active || this.sessionOver || this.isPaused) return;
                this.tweens.killTweensOf(bun);
                if (this.textures.exists('spr_bunny_hop')) bun.setTexture('spr_bunny_hop');
                this.tweens.add({
                    targets: bun, y: y - 26, duration: 220, yoyo: true, ease: 'Power2',
                    onComplete: () => {
                        if (this.textures.exists('spr_bunny_idle')) bun.setTexture('spr_bunny_idle');
                        idle();
                    },
                });
            },
        });
    }

    skyBounds(w) {
        return { minX: 40, maxX: w - 40, minY: 56, maxY: 148 };
    }

    pinCritter(sprite, bounds, depth) {
        if (!sprite) return;
        sprite.setDepth(depth);
        const bs = sprite.getData && sprite.getData('behaviorSystem');
        if (bs && bs.bounds) {
            bs.bounds = bounds;
            sprite.x = Phaser.Math.Between(bounds.minX, bounds.maxX);
            sprite.y = Phaser.Math.Between(bounds.minY, bounds.maxY);
        }
        if (sprite.setScale) sprite.setScale((sprite.scale || 1) * 1.25);
    }

    flyEmoji(emoji, x, y, dx, dy, ms) {
        const t = this.add.text(x, y, emoji, { fontSize: '34px' }).setDepth(8).setOrigin(0.5);
        this.tweens.add({
            targets: t, x: x + dx, y: y + dy, duration: ms,
            yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
        });
    }

    spawnButterflies(w, h) {
        if (typeof generateButterflies !== 'function' || typeof createMenuButterfly !== 'function') return;
        const sky = this.skyBounds(w);
        const side = { minX: w - 170, maxX: w - 30, minY: h * 0.28, maxY: h * 0.62 };
        generateButterflies(this, 4).forEach((data, i) => {
            const b = createMenuButterfly(this, data);
            this.pinCritter(b, i < 3 ? sky : side, 8);
            if (b) this.butterflies.push(b);
        });
    }

    spawnBirds(w) {
        if (typeof generateBirds !== 'function' || typeof createMenuBird !== 'function') return;
        const sky = this.skyBounds(w);
        generateBirds(this, 2).forEach((data) => {
            const b = createMenuBird(this, data);
            this.pinCritter(b, sky, 8);
            if (b) this.birds.push(b);
        });
    }

    spawnFireflies(w, h) {
        if (typeof generateFireflies !== 'function' || typeof createMenuFirefly !== 'function') return;
        const side = { minX: 24, maxX: 160, minY: h * 0.22, maxY: h * 0.70 };
        generateFireflies(this, 4).forEach((data, i) => {
            const f = createMenuFirefly(this, data);
            const box = i % 2 ? { minX: w - 160, maxX: w - 24, minY: side.minY, maxY: side.maxY } : side;
            this.pinCritter(f, box, 9);
            if (f) this.fireflies.push(f);
        });
    }

    spawnMagicDust(w, h) {
        if (typeof generateMagicParticles !== 'function' || typeof createMenuMagicParticle !== 'function') return;
        const side = { minX: 20, maxX: 150, minY: h * 0.20, maxY: h * 0.75 };
        generateMagicParticles(this, 5).forEach((data, i) => {
            const p = createMenuMagicParticle(this, data);
            const box = i % 2 ? { minX: w - 150, maxX: w - 20, minY: side.minY, maxY: side.maxY } : side;
            this.pinCritter(p, box, 7);
            if (p) this.magicParticles.push(p);
        });
    }

    update() {
        const tick = (list) => {
            list.forEach((c) => {
                const bs = c.getData && c.getData('behaviorSystem');
                if (bs && bs.update) bs.update(list);
            });
        };
        if (this.butterflies.length) tick(this.butterflies);
        if (this.birds.length) tick(this.birds);
        if (this.fireflies.length) tick(this.fireflies);
        if (this.magicParticles.length) tick(this.magicParticles);
    }

    onSessionStart() {
        this.sessionSeed = (Date.now() % 100000) + this.level * 97;
        if (this.input.keyboard) {
            this.input.keyboard.on('keydown', (ev) => this.onKey(ev));
        }
        this.time.addEvent({
            delay: 3400, loop: true,
            callback: () => {
                if (this.companion && !this.sessionOver && !this.isPaused) {
                    this.companionReact('happy');
                }
            },
        });
    }

    introText() {
        return (this.theme && this.theme.copy.intro[this.level]) || 'Giúp Bunnine tìm cà rốt nào!';
    }

    track(obj) { this.roundObjects.push(obj); return obj; }

    clearRound() {
        this.roundObjects.forEach((o) => { if (o && o.active) o.destroy(true); });
        this.roundObjects = [];
        this.tiles = {};
        this.friend = null;
        this.moving = false;
        this.hasKey = false;
        this.hintMark = null;
    }

    presentRound(index) {
        this.clearRound();
        const lib = typeof BunnyMazeLib !== 'undefined' ? BunnyMazeLib.all() : [];
        const loaded = BunnyMazeEngine.loadLibrary(lib);
        const hist = this.loadHistory();
        const seed = this.sessionSeed + index * 17 + this.level * 3;
        const picked = BunnyMazeEngine.pick(loaded.playable, {
            difficulty: this.level, history: hist, seed,
        });
        if (!picked.maze) return;
        this.saveHistory(picked.history);
        this.maze = picked.maze;
        this.bunnyPos = { x: this.maze.start.x, y: this.maze.start.y };
        this.hasKey = false;
        this._got = {};
        const extras = this.maze.stars.length + (this.maze.key ? 1 : 0);
        this.analytics.recordExploration(0, Math.max(1, extras));
        this.drawBoard();
    }

    histKey() { return `bunnies_bunny_maze_recent_${this.level}`; }

    loadHistory() {
        try {
            const raw = localStorage.getItem(this.histKey());
            const arr = raw ? JSON.parse(raw) : [];
            return Array.isArray(arr) ? arr : [];
        } catch (e) { return []; }
    }

    saveHistory(list) {
        try { localStorage.setItem(this.histKey(), JSON.stringify(list || [])); } catch (e) { /* ignore */ }
    }

    drawBoard() {
        const w = this.cameras.main.width;
        const h = this.cameras.main.height;
        const T = (this.theme && this.theme.themeOf(this.maze.theme)) || {
            grass: 0x7cb342, dirt: 0xc4a574, dirtLine: 0x8d6e46, wall: '🌳',
        };
        const playTop = DesignTokens.layout.contentTop + 36;
        const playBot = h * 0.78;
        const cell = Math.min(
            Math.floor((w * 0.7) / this.maze.w),
            Math.floor((playBot - playTop) / this.maze.h),
            68,
        );
        const ox = Math.round((w - this.maze.w * cell) / 2);
        const oy = Math.round(playTop + (playBot - playTop - this.maze.h * cell) / 2);
        this.cell = cell;
        this.origin = { x: ox, y: oy };

        const goalChip = this.track(UISystem.chip(this, w / 2, DesignTokens.layout.equationY, (this.theme && this.theme.copy.goal) || '🐰  →  🥕', {
            minWidth: 160, height: 44, fontSize: 22,
        }));
        goalChip.setDepth(150);

        for (let y = 0; y < this.maze.h; y++) {
            for (let x = 0; x < this.maze.w; x++) {
                this.drawTile(x, y, T);
            }
        }
        this.placeActors(T);
        this.startFriend();
    }

    cellCenter(x, y) {
        return {
            x: this.origin.x + x * this.cell + this.cell / 2,
            y: this.origin.y + y * this.cell + this.cell / 2,
        };
    }

    drawTile(x, y, T) {
        const ch = this.maze.rows[y][x];
        const p = this.cellCenter(x, y);
        const c = this.track(this.add.container(p.x, p.y).setDepth(40));
        const g = this.add.graphics();
        const pad = Math.max(2, Math.floor(this.cell * 0.08));
        const s = this.cell - pad * 2;
        if (ch === '#') {
            g.fillStyle(T.grass, 1);
            g.fillRoundedRect(-s / 2, -s / 2, s, s, 8);
            c.add(g);
            c.add(this.add.text(0, 0, T.wall, { fontSize: Math.round(this.cell * 0.55) + 'px' }).setOrigin(0.5));
        } else {
            g.fillStyle(T.dirt, 1);
            g.fillRoundedRect(-s / 2, -s / 2, s, s, 10);
            g.lineStyle(2, T.dirtLine, 0.55);
            g.strokeRoundedRect(-s / 2, -s / 2, s, s, 10);
            c.add(g);
            if (ch === 'G') {
                c.add(this.add.text(0, 4, '🥕', { fontSize: Math.round(this.cell * 0.5) + 'px' }).setOrigin(0.5));
            } else if (ch === 'K') {
                this.keyGlyph = this.add.text(0, 0, '🔑', { fontSize: Math.round(this.cell * 0.46) + 'px' }).setOrigin(0.5);
                c.add(this.keyGlyph);
            } else if (ch === 'D') {
                this.doorGlyph = this.add.text(0, 0, '🚪', { fontSize: Math.round(this.cell * 0.48) + 'px' }).setOrigin(0.5);
                c.add(this.doorGlyph);
            } else if (ch === '*') {
                const star = this.add.text(0, 0, '⭐', { fontSize: Math.round(this.cell * 0.42) + 'px' }).setOrigin(0.5);
                c.add(star);
                this.tweens.add({ targets: star, y: -5, duration: 900, yoyo: true, repeat: -1 });
            }
            UISystem.enableHit(c, this.cell, this.cell);
            UISystem.bindTap(this, c, () => this.tryStep(x, y), { sfx: false });
        }
        this.tiles[`${x},${y}`] = c;
    }

    placeActors() {
        const p = this.cellCenter(this.bunnyPos.x, this.bunnyPos.y);
        const key = this.textures.exists('spr_bunny_idle') ? 'spr_bunny_idle' : null;
        if (key) {
            this.actor = this.track(this.add.image(p.x, p.y, key).setDepth(120));
            const tex = this.actor.texture.getSourceImage();
            this.actor.setScale((this.cell * 0.85) / tex.height);
        } else {
            this.actor = this.track(this.add.text(p.x, p.y, '🐰', {
                fontSize: Math.round(this.cell * 0.7) + 'px',
            }).setOrigin(0.5).setDepth(120));
        }
        this.tweens.add({
            targets: this.actor, y: p.y - 4, duration: 1400, yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
        });
    }

    startFriend() {
        if (this.level !== 3 || !this.maze.obstacleCells.length) return;
        const cells = this.maze.obstacleCells;
        const friends = (this.theme && this.theme.friends) || ['🐌', '🐸', '🦔'];
        const emoji = friends[this.roundIndex % friends.length];
        const p = this.cellCenter(cells[0].x, cells[0].y);
        const spr = this.track(this.add.text(p.x, p.y, emoji, {
            fontSize: Math.round(this.cell * 0.48) + 'px',
        }).setOrigin(0.5).setDepth(110));
        this.friend = { spr, cells, i: 0, dir: 1 };
        this.friendTimer = this.time.addEvent({
            delay: 900, loop: true,
            callback: () => this.stepFriend(),
        });
        this.roundObjects.push({ destroy: () => { if (this.friendTimer) this.friendTimer.remove(false); } });
    }

    stepFriend() {
        if (!this.friend || this.sessionOver) return;
        const f = this.friend;
        let ni = f.i + f.dir;
        if (ni < 0 || ni >= f.cells.length) { f.dir *= -1; ni = f.i + f.dir; }
        if (ni < 0 || ni >= f.cells.length) return;
        f.i = ni;
        const cell = f.cells[f.i];
        const p = this.cellCenter(cell.x, cell.y);
        this.tweens.add({ targets: f.spr, x: p.x, y: p.y, duration: 280, ease: 'Sine.easeInOut' });
        if (this.bunnyPos && cell.x === this.bunnyPos.x && cell.y === this.bunnyPos.y) {
            this.bumpFriend();
        }
    }

    friendAt(x, y) {
        if (!this.friend) return false;
        const c = this.friend.cells[this.friend.i];
        return c && c.x === x && c.y === y;
    }

    bumpFriend() {
        this.recordFumble();
        this.companionSay('Bạn đang dạo đó! Đi ô khác nhé.', 1800);
        if (this.prevPos) this.hopTo(this.prevPos.x, this.prevPos.y, true);
    }

    onKey(ev) {
        if (!this.acceptingInput || this.isPaused || this.moving) return;
        const map = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
        const d = map[ev.key];
        if (!d) return;
        this.tryStep(this.bunnyPos.x + d[0], this.bunnyPos.y + d[1]);
    }

    tryStep(x, y) {
        if (!this.acceptingInput || this.isPaused || this.moving || !this.bunnyPos) return;
        const dx = Math.abs(x - this.bunnyPos.x);
        const dy = Math.abs(y - this.bunnyPos.y);
        if (dx + dy !== 1) return;
        const ch = this.maze.rows[y] && this.maze.rows[y][x];
        if (!ch || ch === '#') {
            this.recordFumble();
            return;
        }
        if (ch === 'D' && !this.hasKey) {
            this.recordFumble();
            AudioEngine.emit('Locked');
            this.companionSay('Cần chìa mới mở cổng nè!', 1600);
            return;
        }
        if (this.friendAt(x, y)) {
            this.bumpFriend();
            return;
        }
        this.prevPos = { x: this.bunnyPos.x, y: this.bunnyPos.y };
        this.hopTo(x, y, false);
    }

    hopTo(x, y, bounced) {
        this.moving = true;
        this.bunnyPos = { x, y };
        const p = this.cellCenter(x, y);
        this.tweens.killTweensOf(this.actor);
        if (this.textures.exists('spr_bunny_hop')) this.actor.setTexture('spr_bunny_hop');
        this.tweens.add({
            targets: this.actor, x: p.x, y: p.y - 8, duration: 160, ease: 'Sine.easeOut',
            onComplete: () => {
                this.tweens.add({
                    targets: this.actor, y: p.y, duration: 120,
                    onComplete: () => {
                        if (this.textures.exists('spr_bunny_idle')) this.actor.setTexture('spr_bunny_idle');
                        this.moving = false;
                        if (!bounced) this.afterLand(x, y);
                    },
                });
            },
        });
        AudioEngine.emit('ObjectTapped');
    }

    afterLand(x, y) {
        const ch = this.maze.rows[y][x];
        if (ch === '*' && !this.collectedAt(`${x},${y}`)) {
            this.markCollected(`${x},${y}`);
            this.maze.rows[y][x] = '.';
            const tile = this.tiles[`${x},${y}`];
            if (tile) tile.list.filter((n) => n.text === '⭐').forEach((n) => n.setVisible(false));
            this.analytics.recordExploration(1, 0);
            AudioEngine.emit('ObjectCollected', { count: 1 });
        }
        if (ch === 'K' && !this.hasKey) {
            this.hasKey = true;
            this.maze.rows[y][x] = '.';
            if (this.keyGlyph) this.keyGlyph.setVisible(false);
            this.analytics.recordExploration(1, 0);
            AudioEngine.emit('ObjectCollected');
            this.companionSay('Có chìa rồi! Mở cổng nào!', 1600);
        }
        if (ch === 'D' && this.hasKey && this.doorGlyph && this.doorGlyph.visible) {
            this.doorGlyph.setVisible(false);
            this.maze.rows[y][x] = '.';
            AudioEngine.emit('Discovery');
        }
        if (ch === 'G' || (x === this.maze.goal.x && y === this.maze.goal.y)) {
            const p = this.cellCenter(x, y);
            this.answerCorrect(p.x, p.y);
        }
    }

    collectedAt(k) {
        this._got = this._got || {};
        return !!this._got[k];
    }

    markCollected(k) {
        this._got = this._got || {};
        this._got[k] = true;
    }

    showHintVisual() {
        if (!this.maze || !this.bunnyPos) return;
        const step = BunnyMazeEngine.nextStep(this.maze, this.bunnyPos, this.hasKey);
        if (!step) return;
        const p = this.cellCenter(step.x, step.y);
        if (this.hintMark && this.hintMark.active) this.hintMark.destroy();
        const ring = this.add.graphics().setDepth(200);
        ring.lineStyle(5, 0xffd700, 0.95);
        ring.strokeRoundedRect(p.x - this.cell * 0.4, p.y - this.cell * 0.4, this.cell * 0.8, this.cell * 0.8, 10);
        this.hintMark = ring;
        this.track(ring);
    }

    /** E2E / debug: đi hết lối giải rồi tới đích. */
    autoWalkToGoal() {
        if (!this.maze) return;
        const path = BunnyMazeEngine.solvePath(this.maze);
        path.forEach((step) => {
            this.bunnyPos = { x: step.x, y: step.y };
            const ch = this.maze.rows[step.y][step.x];
            if (ch === 'K') this.hasKey = true;
            if (ch === '*') this.analytics.recordExploration(1, 0);
        });
        const g = this.maze.goal;
        const p = this.cellCenter(g.x, g.y);
        this.answerCorrect(p.x, p.y);
    }
}

if (typeof module !== 'undefined') module.exports = { BunnyMazeScreen };
