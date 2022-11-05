

const loudness = require('loudness')

/**@type {import("../src/scripts/models/ISettings").ISettings} */
let current = {
    audio: {
        mute: false,
        volume: 50,
    },
}

loudness.getVolume().then(v => {
    current.audio.volume = v;
})

/**@type {(s:import("../src/scripts/models/ISettings").ISettings)=> import("../src/scripts/models/ISettings").ISettings} */
exports.handle = (settings) => {
    if (settings.audio) {

        console.log(`changing audio ${current.audio?.volume} => ${settings.audio.volume}`)
        loudness.setVolume(settings.audio.volume)
    }

    Object.assign(current, settings);
    return current;
}
exports.get = () => current;