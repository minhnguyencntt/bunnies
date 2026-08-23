const { SaveEngine } = require('../src/core/engine/SaveEngine.js');

const store = {};
global.localStorage = {
    getItem: (k) => (k in store ? store[k] : null),
    setItem: (k, v) => { store[k] = String(v); },
    removeItem: (k) => { delete store[k]; },
    get length() { return Object.keys(store).length; },
    key(i) { return Object.keys(store)[i]; },
};

const p = SaveEngine.defaultProfile();
p.xp = 99;
p.gems = 12;
p.audioSettings = { master: 0.2 };
SaveEngine.save(p);
if (!localStorage.getItem(SaveEngine.KEY)) throw new Error('save missing');

SaveEngine.reset({ keepAudio: true });
const fresh = SaveEngine.load();
if (fresh.xp !== 0) throw new Error('xp not reset');
if (fresh.gems !== 0) throw new Error('gems not reset');
if (!fresh.audioSettings || fresh.audioSettings.master !== 0.2) throw new Error('audio should stay');

SaveEngine.reset({ keepAudio: false });
if (localStorage.getItem(SaveEngine.KEY)) throw new Error('key should be gone');
console.log('PASS save reset');
