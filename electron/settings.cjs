

const loudness = require('mwl-loudness')
const exec = require("child_process").exec
var AutoLaunch = require('easy-auto-launch');

/**@type {AutoLaunch} */
var appLauncher;

/**@type {import("../src/scripts/models/ISettings").ISettings} */
let current = {
    audio: {
        mute: false,
        volume: 50,
    },
    command: {
        cmd: {},
        index: 0
    },
    app: {
        launchOnStartup: false
    }
}

loudness.getVolume().then(v => {
    current.audio.volume = v;
})
loudness.getMuted().then(v => {
    current.audio.mute = v;
})



/**@type {(s:import("../src/scripts/models/ISettings").ISettings)=> import("../src/scripts/models/ISettings").ISettings} */
exports.handle = (settings) => {
    if (settings.audio) {

        console.log(`changing audio ${current.audio?.volume} => ${settings.audio.volume}`)
        loudness.setVolume(settings.audio.volume)

        if (settings.audio.mute != current.audio.mute) {
            loudness.setMuted(settings.audio.mute);
        }
    }

    if (settings.shutdown) {

        exec("shutdown /f /p")
    }

    if (settings.app) {
        if (settings.app.launchOnStartup) {
            if (settings.app.launchOnStartup != current.app?.launchOnStartup) {
                if (settings.app.launchOnStartup)
                    appLauncher.enable();
                else
                    appLauncher.disable();
            }
        }
    }

    Object.assign(current, settings);
    return current;
}
exports.get = () => current;

exports.setAppUrl = (url, exePath) => {
    current.appUrl = url;
    appLauncher = new AutoLaunch({
        name: 'RemoTv',
        path: exePath,
        //path: '/Applications/Minecraft.app', doc says its optional...
    });
    appLauncher.isEnabled().then(v => {
        current.app.launchOnStartup = v;
    })
}