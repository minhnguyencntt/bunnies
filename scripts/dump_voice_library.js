// dump_voice_library.js — export VOICE_LIBRARY from AudioConfig.js to JSON
// (single source of truth for the voice generation pipeline).
const { VOICE_LIBRARY } = require('../src/core/audio/AudioConfig.js');

const lines = {};
for (const [id, line] of Object.entries(VOICE_LIBRARY)) {
    lines[id] = {
        text: { vi: line.vi, en: line.en },
        voice: line.voice || 'narrator',
        ...(line.game ? { game: line.game } : {}),
        ...(line.level ? { level: line.level } : {}),
    };
}
process.stdout.write(JSON.stringify({ version: 1, locale: 'vi', lines }));
