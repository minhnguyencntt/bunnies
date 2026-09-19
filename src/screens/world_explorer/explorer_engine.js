/**
 * explorer_engine.js — pick, distractors, facts, questions, mastery.
 * Helpers stay inside this IIFE so script tags cannot overwrite other worlds.
 */
const WorldExplorerEngine = (function () {
    const KEY = 'bunnies_world_explorer_progress';
    const SKILLS = ['flag', 'country', 'capital', 'fact'];

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

    function lib() {
        if (typeof WorldExplorerLib !== 'undefined') return WorldExplorerLib;
        if (typeof require !== 'undefined') {
            try { return require('./country_lib.js').WorldExplorerLib; } catch (e) { return null; }
        }
        return null;
    }

    function all() {
        const L = lib();
        return L ? L.all() : [];
    }

    function byId(id) {
        const L = lib();
        return L ? L.byId(id) : null;
    }

    function emptyProgress() {
        return { countries: {}, recent: [] };
    }

    function loadProgress() {
        try {
            const raw = (typeof localStorage !== 'undefined') ? localStorage.getItem(KEY) : null;
            if (!raw) return emptyProgress();
            const p = JSON.parse(raw);
            return {
                countries: p.countries && typeof p.countries === 'object' ? p.countries : {},
                recent: Array.isArray(p.recent) ? p.recent : [],
            };
        } catch (e) {
            return emptyProgress();
        }
    }

    function saveProgress(progress) {
        try {
            if (typeof localStorage !== 'undefined') {
                localStorage.setItem(KEY, JSON.stringify(progress || emptyProgress()));
            }
        } catch (e) { /* ignore */ }
        return progress;
    }

    function countryState(progress, id) {
        const cur = (progress && progress.countries && progress.countries[id]) || {};
        return {
            flag: cur.flag || 0,
            country: cur.country || 0,
            capital: cur.capital || 0,
            fact: cur.fact || 0,
            discovered: !!cur.discovered,
            mastered: !!cur.mastered,
            factsSeen: Array.isArray(cur.factsSeen) ? cur.factsSeen.slice() : [],
        };
    }

    function isMastered(st) {
        return st.flag >= 2 && st.country >= 2 && st.capital >= 2 && st.fact >= 1;
    }

    function recordSkill(progress, id, skill, ok) {
        const p = progress || emptyProgress();
        if (!p.countries[id]) p.countries[id] = countryState(p, id);
        const st = p.countries[id];
        if (SKILLS.indexOf(skill) !== -1 && ok) st[skill] = (st[skill] || 0) + 1;
        if (ok && (skill === 'country' || skill === 'flag')) st.discovered = true;
        st.mastered = isMastered(st);
        p.countries[id] = st;
        return p;
    }

    function rememberFact(progress, id, factId) {
        const p = progress || emptyProgress();
        if (!p.countries[id]) p.countries[id] = countryState(p, id);
        const seen = p.countries[id].factsSeen;
        if (factId && seen.indexOf(factId) === -1) seen.push(factId);
        if (seen.length > 12) seen.splice(0, seen.length - 12);
        return p;
    }

    function pushRecent(progress, id) {
        const p = progress || emptyProgress();
        p.recent = (p.recent || []).filter((x) => x !== id);
        p.recent.push(id);
        if (p.recent.length > 16) p.recent.splice(0, p.recent.length - 16);
        return p;
    }

    function worldStats(progress) {
        const L = lib();
        const list = L ? L.all() : [];
        const counts = { asia: 0, europe: 0, africa: 0, north_america: 0, south_america: 0, oceania: 0 };
        const totals = { asia: 0, europe: 0, africa: 0, north_america: 0, south_america: 0, oceania: 0 };
        let discovered = 0;
        let mastered = 0;
        list.forEach((c) => {
            if (totals[c.continent] != null) totals[c.continent] += 1;
            const st = countryState(progress, c.id);
            if (st.discovered) {
                discovered += 1;
                if (counts[c.continent] != null) counts[c.continent] += 1;
            }
            if (st.mastered) mastered += 1;
        });
        return {
            total: list.length,
            discovered,
            mastered,
            continentDiscovered: counts,
            continentTotals: totals,
        };
    }

    function pick(opts) {
        const difficulty = opts.difficulty || 1;
        const seed = opts.seed;
        const progress = opts.progress || emptyProgress();
        const history = (opts.history || progress.recent || []).slice();
        const countries = all();
        if (!countries.length) return { country: null, history, reset: false };

        const unseen = [];
        const learning = [];
        const mastered = [];
        countries.forEach((c) => {
            const st = countryState(progress, c.id);
            if (!st.discovered) unseen.push(c);
            else if (!st.mastered) learning.push(c);
            else mastered.push(c);
        });

        const rand = mulberry32(seed);
        const roll = rand();
        let pool = unseen;
        if (roll < 0.7 && unseen.length) pool = unseen;
        else if (roll < 0.9 && learning.length) pool = learning;
        else if (mastered.length) pool = mastered;
        else if (learning.length) pool = learning;
        else pool = unseen.length ? unseen : countries;

        let avail = pool.filter((c) => history.indexOf(c.id) === -1);
        let reset = false;
        if (!avail.length) {
            avail = pool.slice();
            history.length = 0;
            reset = true;
        }
        if (difficulty >= 3 && avail.length > 4) {
            const far = avail.filter((c) => c.continent !== 'asia' || rand() < 0.45);
            if (far.length) avail = far;
        }
        const country = avail[Math.floor(rand() * avail.length)];
        history.push(country.id);
        return { country, history, reset };
    }

    function shuffle(list, rand) {
        const a = list.slice();
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(rand() * (i + 1));
            const t = a[i]; a[i] = a[j]; a[j] = t;
        }
        return a;
    }

    function uniquePush(out, item, seen) {
        if (!item) return;
        const key = item.id || item;
        if (seen[key]) return;
        seen[key] = true;
        out.push(item);
    }

    function distractors(country, kind, n, seed) {
        const need = n || 3;
        const countries = all();
        const rand = mulberry32(seed);
        const seen = {};
        const out = [];
        if (!country) return [];

        if (kind === 'country') {
            const sameRegion = countries.filter((c) => c.id !== country.id && c.region === country.region);
            const neighbors = (country.neighbors || []).map(byId).filter(Boolean);
            const sameCont = countries.filter((c) => c.id !== country.id && c.continent === country.continent);
            const similar = countries.filter((c) => c.id !== country.id && c.flagColors && country.flagColors
                && c.flagColors.some((x) => country.flagColors.indexOf(x) !== -1));
            shuffle(sameRegion.concat(neighbors), rand).forEach((c) => uniquePush(out, c, seen));
            shuffle(similar, rand).forEach((c) => uniquePush(out, c, seen));
            shuffle(sameCont, rand).forEach((c) => uniquePush(out, c, seen));
            shuffle(countries.filter((c) => c.id !== country.id), rand).forEach((c) => uniquePush(out, c, seen));
            return out.slice(0, need);
        }

        if (kind === 'capital') {
            const caps = [];
            const addCap = (c) => {
                if (!c || c.id === country.id || !c.capital) return;
                uniquePush(caps, { id: c.capitalEn || c.capital, label: c.capital, countryId: c.id }, seen);
            };
            (country.altCities || []).forEach((label, i) => {
                uniquePush(caps, { id: 'alt-' + i, label, countryId: country.id }, seen);
            });
            countries.filter((c) => c.region === country.region).forEach(addCap);
            countries.filter((c) => c.continent === country.continent).forEach(addCap);
            shuffle(countries, rand).forEach(addCap);
            return caps.slice(0, need);
        }

        if (kind === 'continent') {
            const names = {
                asia: 'Châu Á', europe: 'Châu Âu', africa: 'Châu Phi',
                north_america: 'Bắc Mỹ', south_america: 'Nam Mỹ', oceania: 'Châu Đại Dương',
            };
            const keys = Object.keys(names).filter((k) => k !== country.continent);
            return shuffle(keys, rand).slice(0, need).map((k) => ({ id: k, label: names[k] }));
        }

        return [];
    }

    function mixChoices(correct, wrongs, seed) {
        const rand = mulberry32(seed);
        return shuffle([correct].concat(wrongs.slice(0, 3)), rand);
    }

    const TEMPLATES = {
        flag: [
            'Đây là quốc kỳ của nước nào?',
            'Bạn có biết lá cờ này thuộc về quốc gia nào không?',
            'Bunny đang ở quốc gia nào?',
            'Hãy tìm tên đúng của quốc gia này.',
        ],
        capital: [
            'Thủ đô của {country} là thành phố nào?',
            'Thành phố nào là thủ đô của {country}?',
            'Hãy tìm thủ đô của {country}.',
            'Bạn có nhớ thủ đô của {country} không?',
        ],
        continent: [
            '{country} nằm ở châu lục nào?',
            'Hãy tìm châu lục của {country}.',
            'Bunny đang khám phá châu nào vậy?',
        ],
        discover: [
            'Bạn có biết?',
            'Cùng khám phá nhé!',
            'Một điều thú vị về {country}',
            'Bunny vừa phát hiện ra!',
        ],
    };

    function pickTemplate(kind, seed, country) {
        const list = TEMPLATES[kind] || TEMPLATES.discover;
        const rand = mulberry32(seed);
        const raw = list[Math.floor(rand() * list.length)];
        return raw.replace('{country}', country ? country.name : '');
    }

    function pickFact(country, seenIds, seed, level) {
        if (!country) return null;
        const facts = (country.facts || []).slice();
        if (!facts.length) return null;
        const prefer = {
            1: ['fun', 'culture', 'food', 'nature', 'animals'],
            2: ['capital', 'geography', 'food', 'nature', 'landmarks', 'culture'],
            3: ['geography', 'landmarks', 'history', 'technology', 'language', 'nature'],
        }[level] || ['fun', 'geography'];
        const unseen = facts.filter((f) => (seenIds || []).indexOf(f.id) === -1);
        const pool = unseen.length ? unseen : facts;
        const ranked = pool.slice().sort((a, b) => {
            const ai = prefer.indexOf(a.category);
            const bi = prefer.indexOf(b.category);
            return (ai === -1 ? 9 : ai) - (bi === -1 ? 9 : bi);
        });
        const top = ranked.slice(0, Math.min(4, ranked.length));
        const rand = mulberry32(seed);
        return top[Math.floor(rand() * top.length)] || pool[0];
    }

    function knowledgeQuestion(country, fact, seed, level) {
        const rand = mulberry32(seed);
        if (fact && fact.question && fact.answers && fact.answers.length >= 3) {
            const correct = fact.answers[0];
            const wrongs = fact.answers.slice(1);
            return {
                prompt: fact.question,
                choices: mixChoices(correct, shuffle(wrongs, rand).slice(0, 3), seed + 3),
                correct,
            };
        }
        if (level >= 3 && country) {
            const names = {
                asia: 'Châu Á', europe: 'Châu Âu', africa: 'Châu Phi',
                north_america: 'Bắc Mỹ', south_america: 'Nam Mỹ', oceania: 'Châu Đại Dương',
            };
            const correct = names[country.continent];
            const wrongs = distractors(country, 'continent', 3, seed).map((d) => d.label);
            return {
                prompt: pickTemplate('continent', seed + 1, country),
                choices: mixChoices(correct, wrongs, seed + 4),
                correct,
            };
        }
        const correct = country.capital;
        const wrongs = distractors(country, 'capital', 3, seed).map((d) => d.label);
        return {
            prompt: pickTemplate('capital', seed + 2, country),
            choices: mixChoices(correct, wrongs, seed + 5),
            correct,
        };
    }

    function flagQuestion(country, seed) {
        const wrongs = distractors(country, 'country', 3, seed);
        return {
            prompt: pickTemplate('flag', seed, country),
            choices: mixChoices(country, wrongs, seed + 7),
            correctId: country.id,
        };
    }

    function capitalQuestion(country, seed) {
        const wrongs = distractors(country, 'capital', 3, seed);
        return {
            prompt: pickTemplate('capital', seed, country),
            choices: mixChoices(
                { id: country.capitalEn, label: country.capital },
                wrongs,
                seed + 8,
            ),
            correct: country.capital,
        };
    }

    function continentQuestion(country, seed) {
        const names = {
            asia: 'Châu Á', europe: 'Châu Âu', africa: 'Châu Phi',
            north_america: 'Bắc Mỹ', south_america: 'Nam Mỹ', oceania: 'Châu Đại Dương',
        };
        const correct = { id: country.continent, label: names[country.continent] };
        const wrongs = distractors(country, 'continent', 3, seed);
        return {
            prompt: pickTemplate('continent', seed, country),
            choices: mixChoices(correct, wrongs, seed + 9),
            correct: correct.label,
        };
    }

    return {
        KEY,
        SKILLS,
        mulberry32,
        all,
        byId,
        emptyProgress,
        loadProgress,
        saveProgress,
        countryState,
        isMastered,
        recordSkill,
        rememberFact,
        pushRecent,
        worldStats,
        pick,
        distractors,
        mixChoices,
        TEMPLATES,
        pickTemplate,
        pickFact,
        knowledgeQuestion,
        flagQuestion,
        capitalQuestion,
        continentQuestion,
    };
})();

if (typeof module !== 'undefined') module.exports = { WorldExplorerEngine };
