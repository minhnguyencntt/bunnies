/**
 * AudioEvents.js — default event → audio wiring.
 * Game code emits semantic events; this module decides what they sound like.
 * Each event may trigger SFX + voice + music-intensity layers together.
 */
const AudioEvents = {
    _registered: false,

    register() {
        if (this._registered) return;
        this._registered = true;
        const E = AudioEngine;

        E.on('GameStarted', ({ gameId, level } = {}) => {
            if (gameId) VoiceEngine.sayInstruction(gameId, level || 1);
            else VoiceEngine.say('start');
        });
        E.on('RoundStarted', () => MusicEngine.setIntensity('medium'));
        E.on('ObjectTapped', () => SFXEngine.tap());
        E.on('ObjectDragged', () => SFXEngine.drag());
        E.on('ObjectCollected', ({ count } = {}) => {
            SFXEngine.pickup();
            if (count) VoiceEngine.count(count); // educational counting sync
        });
        E.on('ObjectMisTap', () => SFXEngine.fumble());
        E.on('Discovery', () => SFXEngine.discovery());
        E.on('SequenceStep', ({ index } = {}) => SFXEngine.sequenceStep(index || 0));
        E.on('PuzzleSolved', () => SFXEngine.solve());
        E.on('CorrectAnswer', () => {
            SFXEngine.correct();
            VoiceEngine.say('correct');
        });
        E.on('IncorrectAnswer', () => {
            SFXEngine.wrong();
            VoiceEngine.say('wrong');
        });
        E.on('HintRequested', () => {
            SFXEngine.hint();
            VoiceEngine.say('hint');
        });
        E.on('ComboStarted', ({ streak } = {}) => SFXEngine.combo(streak || 3));
        E.on('NearCompletion', () => VoiceEngine.say('nearDone'));
        E.on('TimeWarning', () => {
            MusicEngine.setIntensity('high');
            SFXEngine.timerWarning();
        });
        E.on('GameCompleted', () => {
            MusicEngine.setIntensity('celebration');
            SFXEngine.victory();
            VoiceEngine.say('complete', { force: true });
        });
        E.on('ScoreTick', () => SFXEngine.scoreTick());
        E.on('StarEarned', ({ index } = {}) => SFXEngine.star(index || 0));
        E.on('ThreeStars', () => SFXEngine.threeStars());
        E.on('XPGranted', () => SFXEngine.xp());
        E.on('AwardUnlocked', () => {
            SFXEngine.award();
            VoiceEngine.say('award');
        });
        E.on('StickerUnlocked', ({ rarity } = {}) => {
            SFXEngine.sticker(rarity);
            VoiceEngine.say('sticker');
        });
        E.on('LevelUp', () => {
            SFXEngine.levelUp();
            VoiceEngine.say('levelup');
        });
        E.on('UITap', () => SFXEngine.tap());
        E.on('UIPop', () => SFXEngine.pop());
        E.on('Locked', () => SFXEngine.locked());
        E.on('Transition', () => SFXEngine.whoosh());
        E.on('Paused', () => SFXEngine.pause());
        E.on('BunnyReaction', () => VoiceEngine.say('bunnyReact'));
    },
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AudioEvents };
}
