/**
 * test_world_explorer.js — 195 countries, pick, distractors, facts, mastery.
 */
const { WorldExplorerLib } = require('../src/screens/world_explorer/country_lib.js');
const { WorldExplorerEngine } = require('../src/screens/world_explorer/explorer_engine.js');

function assert(cond, msg) {
    if (!cond) throw new Error(msg);
}

const all = WorldExplorerLib.all();
assert(all.length === 195, `expected 195, got ${all.length}`);
assert(new Set(all.map((c) => c.id)).size === 195, 'unique ids');
assert(WorldExplorerLib.byId('vn').name === 'Việt Nam', 'Vietnam name');
assert(WorldExplorerLib.byId('vn').capital === 'Hà Nội', 'Hanoi');
assert(WorldExplorerLib.byId('jp').capital === 'Tokyo', 'Tokyo');
assert(WorldExplorerLib.byId('va').id === 'va', 'Holy See');
assert(WorldExplorerLib.byId('ps').id === 'ps', 'Palestine');
assert(!WorldExplorerLib.byId('tw'), 'no Taiwan');
assert(!WorldExplorerLib.byId('xk'), 'no Kosovo');

all.forEach((c) => {
    assert(c.flag && c.capital && c.name && c.isoCode, `core fields ${c.id}`);
    assert(c.facts && c.facts.length >= 4, `facts ${c.id}`);
    const cats = new Set(c.facts.map((f) => f.category));
    assert(cats.size >= 2, `fact variety ${c.id}`);
});

const hist = { asia: 0, europe: 0, africa: 0, north_america: 0, south_america: 0, oceania: 0 };
all.forEach((c) => { hist[c.continent] += 1; });
assert(hist.asia + hist.europe + hist.africa + hist.north_america + hist.south_america + hist.oceania === 195, 'continent sum');

const progress = WorldExplorerEngine.emptyProgress();
const seen = new Set();
let history = [];
for (let i = 0; i < 40; i++) {
    const r = WorldExplorerEngine.pick({ difficulty: 1, history, progress, seed: 2000 + i });
    history = r.history;
    assert(r.country, `pick ${i}`);
    if (i < 30) assert(!seen.has(r.country.id), `repeat ${r.country.id} at ${i}`);
    seen.add(r.country.id);
}
assert(seen.size >= 30, `exploration breadth ${seen.size}`);

const jp = WorldExplorerLib.byId('jp');
const dCountry = WorldExplorerEngine.distractors(jp, 'country', 3, 7);
assert(dCountry.length === 3, '3 country distractors');
assert(dCountry.every((c) => c.id !== 'jp'), 'no self distractor');
assert(dCountry.filter((c) => c.continent === 'asia').length >= 1, 'nearby country distractor');

const dCap = WorldExplorerEngine.distractors(jp, 'capital', 3, 8);
assert(dCap.length === 3, '3 capital distractors');
assert(dCap.every((c) => c.label !== jp.capital), 'capital not self');

const fq = WorldExplorerEngine.flagQuestion(jp, 11);
assert(fq.choices.length === 4, '4 flag choices');
assert(fq.choices.filter((c) => c.id === 'jp').length === 1, 'exactly one Japan');

const seenFacts = [];
const f1 = WorldExplorerEngine.pickFact(jp, seenFacts, 1, 1);
const f2 = WorldExplorerEngine.pickFact(jp, [f1.id], 2, 1);
assert(f1 && f2, 'facts exist');
assert(f1.id !== f2.id, 'anti-repeat facts');

WorldExplorerEngine.recordSkill(progress, 'jp', 'flag', true);
WorldExplorerEngine.recordSkill(progress, 'jp', 'country', true);
WorldExplorerEngine.rememberFact(progress, 'jp', f1.id);
const st = WorldExplorerEngine.countryState(progress, 'jp');
assert(st.discovered, 'discovered after country');
const stats = WorldExplorerEngine.worldStats(progress);
assert(stats.discovered === 1, 'world discovered 1');
assert(stats.total === 195, 'world total 195');

const q = WorldExplorerEngine.knowledgeQuestion(jp, f1, 15, 2);
assert(q.choices.length === 4 && q.correct, 'knowledge Q');
assert(q.choices.indexOf(q.correct) !== -1, 'correct in choices');

console.log('PASS world explorer library');
