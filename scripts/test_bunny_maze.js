/**
 * test_bunny_maze.js — 50 layouts must load, validate, and pick without repeats.
 */
const { BunnyMazeLib } = require('../src/screens/bunny_maze/maze_lib.js');
const { BunnyMazeEngine } = require('../src/screens/bunny_maze/maze_engine.js');

function assert(cond, msg) {
    if (!cond) throw new Error(msg);
}

const raw = BunnyMazeLib.all();
assert(raw.length === 50, `expected 50 raw, got ${raw.length}`);
assert(raw.filter((m) => m.difficulty === 1).length === 20, '20 level-1');
assert(raw.filter((m) => m.difficulty === 2).length === 20, '20 level-2');
assert(raw.filter((m) => m.difficulty === 3).length === 10, '10 level-3');

const ids = new Set(raw.map((m) => m.id));
assert(ids.size === 50, 'ids must be unique');

const { playable, rejected } = BunnyMazeEngine.loadLibrary(raw);
if (rejected.length) {
    console.error(rejected);
    throw new Error(`rejected ${rejected.length} mazes`);
}
assert(playable.length === 50, `playable ${playable.length}`);
assert(playable.every((m) => m.difficulty === 1 || m.difficulty === 2 || m.difficulty === 3), 'difficulty 1..3');
assert(playable.filter((m) => m.difficulty === 1).every((m) => !m.key && !m.door), 'L1 no key/door');
assert(playable.filter((m) => m.difficulty === 2).every((m) => m.key && m.door), 'L2 key+door');
assert(playable.filter((m) => m.difficulty === 3).every((m) => m.key && m.door && m.obstacleCells.length), 'L3 key+door+O');

playable.forEach((m) => {
    const path = BunnyMazeEngine.solvePath(m);
    assert(path.length >= 2, `solvePath ${m.id}`);
    const last = path[path.length - 1];
    assert(last.x === m.goal.x && last.y === m.goal.y, `path ends at goal ${m.id}`);
});

const seen = new Set();
let history = [];
for (let i = 0; i < 20; i++) {
    const r = BunnyMazeEngine.pick(playable, { difficulty: 1, history, seed: 1000 + i });
    history = r.history;
    assert(r.maze && r.maze.difficulty === 1, 'pick L1');
    if (i < 19) assert(!seen.has(r.maze.id), `repeat ${r.maze.id} at ${i}`);
    seen.add(r.maze.id);
}
assert(seen.size === 20, 'exhausted L1 pool before reset');

const a = BunnyMazeEngine.pick(playable, { difficulty: 2, history: [], seed: 42 });
const b = BunnyMazeEngine.pick(playable, { difficulty: 2, history: [], seed: 42 });
assert(a.maze.id === b.maze.id, 'same seed → same maze');
const c = BunnyMazeEngine.pick(playable, { difficulty: 2, history: [], seed: 99 });
assert(c.maze.id !== a.maze.id || playable.filter((m) => m.difficulty === 2).length === 1, 'different seed usually differs');

console.log('PASS bunny maze library');
