/**
 * maze_engine.js — parse, BFS-validate, seeded pick, anti-repeat.
 * Node-testable. A maze that fails validation is never playable.
 */
const DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1]];

function mulberry32(seed) {
    let a = (Number(seed) >>> 0) || 1;
    return function rand() {
        a |= 0;
        a = a + 0x6D2B79F5 | 0;
        let t = Math.imul(a ^ a >>> 15, 1 | a);
        t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
}

function parseMaze(raw) {
    const rows = raw.rows.map((r) => r.split(''));
    const h = rows.length;
    const w = rows[0].length;
    const cells = { start: null, goal: null, key: null, door: null, stars: [], obstacles: [], paths: [] };
    for (let y = 0; y < h; y++) {
        if (rows[y].length !== w) {
            return { ok: false, error: `ragged_row_${y}`, raw };
        }
        for (let x = 0; x < w; x++) {
            const ch = rows[y][x];
            const pos = { x, y };
            if (ch === 'S') cells.start = pos;
            else if (ch === 'G') cells.goal = pos;
            else if (ch === 'K') cells.key = pos;
            else if (ch === 'D') cells.door = pos;
            else if (ch === '*') cells.stars.push(pos);
            else if (ch === 'O') cells.obstacles.push(pos);
            if (ch !== '#') cells.paths.push(pos);
        }
    }
    return {
        ok: true,
        id: raw.id,
        difficulty: raw.difficulty,
        theme: raw.theme || 'forest',
        rows,
        w,
        h,
        start: cells.start,
        goal: cells.goal,
        key: cells.key,
        door: cells.door,
        stars: cells.stars,
        obstacleCells: cells.obstacles,
        raw,
    };
}

function at(maze, x, y) {
    if (y < 0 || x < 0 || y >= maze.h || x >= maze.w) return '#';
    return maze.rows[y][x];
}

function isWalkable(maze, x, y, opts) {
    const ch = at(maze, x, y);
    if (ch === '#') return false;
    if (ch === 'D' && opts && opts.doorBlocked) return false;
    return ch !== undefined;
}

function bfs(maze, from, to, opts) {
    if (!from || !to) return null;
    const key = (x, y) => `${x},${y}`;
    const q = [from];
    const seen = { [key(from.x, from.y)]: null };
    while (q.length) {
        const cur = q.shift();
        if (cur.x === to.x && cur.y === to.y) {
            const path = [cur];
            let p = seen[key(cur.x, cur.y)];
            while (p) {
                path.push(p);
                p = seen[key(p.x, p.y)];
            }
            path.reverse();
            return path;
        }
        for (let i = 0; i < DIRS.length; i++) {
            const nx = cur.x + DIRS[i][0];
            const ny = cur.y + DIRS[i][1];
            const k = key(nx, ny);
            if (seen[k] !== undefined) continue;
            if (!isWalkable(maze, nx, ny, opts)) continue;
            seen[k] = cur;
            q.push({ x: nx, y: ny });
        }
    }
    return null;
}

function reachable(maze, from, to, opts) {
    return !!bfs(maze, from, to, opts);
}

function validate(raw) {
    const maze = typeof raw.rows[0] === 'string' ? parseMaze(raw) : raw;
    if (!maze.ok && maze.error) return { ok: false, error: maze.error, id: raw.id };
    const id = maze.id;
    if (!maze.start) return { ok: false, error: 'missing_start', id };
    if (!maze.goal) return { ok: false, error: 'missing_goal', id };
    if (maze.start.x === maze.goal.x && maze.start.y === maze.goal.y) {
        return { ok: false, error: 'start_eq_goal', id };
    }
    const d = maze.difficulty;
    if (d === 1) {
        if (maze.key || maze.door) return { ok: false, error: 'l1_no_key_door', id };
        if (maze.obstacleCells.length) return { ok: false, error: 'l1_no_obstacle', id };
        if (!reachable(maze, maze.start, maze.goal, { doorBlocked: false })) {
            return { ok: false, error: 'goal_unreachable', id };
        }
        return { ok: true, maze };
    }
    if (d === 2 || d === 3) {
        if (!maze.key) return { ok: false, error: 'missing_key', id };
        if (!maze.door) return { ok: false, error: 'missing_door', id };
        if (!reachable(maze, maze.start, maze.key, { doorBlocked: true })) {
            return { ok: false, error: 'key_unreachable', id };
        }
        if (reachable(maze, maze.start, maze.goal, { doorBlocked: true })) {
            return { ok: false, error: 'goal_open_without_door', id };
        }
        if (!reachable(maze, maze.start, maze.goal, { doorBlocked: false })) {
            return { ok: false, error: 'goal_unreachable_after_door', id };
        }
        if (!reachable(maze, maze.key, maze.door, { doorBlocked: false })) {
            return { ok: false, error: 'door_unreachable_after_key', id };
        }
        if (d === 3) {
            if (!maze.obstacleCells.length) return { ok: false, error: 'missing_obstacle', id };
        }
        return { ok: true, maze };
    }
    return { ok: false, error: 'bad_difficulty', id };
}

function nextStep(maze, from, hasKey) {
    const doorBlocked = maze.difficulty >= 2 && !hasKey;
    let to = maze.goal;
    if (maze.difficulty >= 2 && !hasKey && maze.key) to = maze.key;
    const path = bfs(maze, from, to, { doorBlocked });
    if (!path || path.length < 2) return null;
    return path[1];
}

function fullPath(maze, from, hasKey) {
    const doorBlocked = maze.difficulty >= 2 && !hasKey;
    const to = (maze.difficulty >= 2 && !hasKey && maze.key) ? maze.key : maze.goal;
    return bfs(maze, from, to, { doorBlocked }) || [];
}

function solvePath(maze) {
    if (maze.difficulty === 1) return bfs(maze, maze.start, maze.goal, { doorBlocked: false }) || [];
    const toKey = bfs(maze, maze.start, maze.key, { doorBlocked: true }) || [];
    const toGoal = bfs(maze, maze.key, maze.goal, { doorBlocked: false }) || [];
    if (!toKey.length || !toGoal.length) return [];
    return toKey.concat(toGoal.slice(1));
}

function loadLibrary(rawList) {
    const playable = [];
    const rejected = [];
    (rawList || []).forEach((raw) => {
        const result = validate(raw);
        if (result.ok) playable.push(result.maze);
        else rejected.push({ id: raw.id, error: result.error });
    });
    return { playable, rejected };
}

function pick(playable, opts) {
    const difficulty = opts.difficulty;
    const seed = opts.seed;
    const history = (opts.history || []).slice();
    const pool = playable.filter((m) => m.difficulty === difficulty);
    if (!pool.length) return { maze: null, history, reset: false };
    let avail = pool.filter((m) => history.indexOf(m.id) === -1);
    let reset = false;
    if (!avail.length) {
        avail = pool.slice();
        history.length = 0;
        reset = true;
    }
    const rand = mulberry32(seed);
    const maze = avail[Math.floor(rand() * avail.length)];
    history.push(maze.id);
    return { maze, history, reset };
}

const BunnyMazeEngine = {
    mulberry32,
    parseMaze,
    bfs,
    reachable,
    validate,
    nextStep,
    fullPath,
    solvePath,
    loadLibrary,
    pick,
    DIRS,
};

if (typeof module !== 'undefined') module.exports = { BunnyMazeEngine };
