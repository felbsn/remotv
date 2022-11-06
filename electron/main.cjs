const { app, BrowserWindow, BrowserView, session, powerSaveBlocker } = require("electron");
const { ElectronBlocker, BlockingContext } = require('@cliqz/adblocker-electron');
const { fetch } = require('cross-fetch')
const server = require("./server.cjs")
const commands = require("./commands.cjs");
const settings = require("./settings.cjs");
const path = require("path");
const os = require("os")
const { readFile } = require("fs/promises");
const { resourcesPath } = require("process");
const { readdirSync } = require("fs");

console.log("RES PATH IS" + resourcesPath + " \n" + readdirSync(resourcesPath).join(","))





let blocked = "";

/**@type {BlockingContext} */
let blockerContext;

ElectronBlocker.fromPrebuiltFull(fetch).then((blocker) => {

    blockerContext = blocker.enableBlockingInSession(session.defaultSession);
    session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {

        if (blocked && details.url.match(blocked)) {
            console.log("@@@ cancelled some kind of stuff like this " + details.url);
            callback({ cancel: true })

        } else
            callback({});
    })

});


app.whenReady().then(async () => {
    powerSaveBlocker.start("prevent-app-suspension");


    const userDataDir = app.getPath("userData")
    const commandsFilePath = `${userDataDir}/commands.json`;



    const { port, dev } = parseArgs({ port: 9111, dev: false });
    const root = dev ? "." : resourcesPath;
    const scriptTemplate = await readFile(`${root}/templates/script.template.js`, "utf-8");



    console.log("mode " + (dev ? "DEVELOPMENT" : "PRODUCTION"))

    let interfaces = os.networkInterfaces()
    let keys = Object.keys(interfaces);

    let conn = keys.map(k => interfaces[k].find(r => r.family == "IPv4")).find(r => !r.internal);
    let appUrl = `http://${conn.address}:${port}`;

    settings.setAppUrl(appUrl, app.getPath("exe"));
    commands.load(commandsFilePath);
    server.serve(port, `${root}/build/gui`);

    server.command(async (c) => {
        if (c.url) {

            blockerContext.disable();
            blocked = c.blockedUrls?.join('|');

            let ok = await timed(mainWindow.webContents.loadURL(c.url), 2_000)


            await new Promise(r => setTimeout(() => {
                r(true);
            }, 2500))

            if (c.delay)
                await delay(c.delay);

            mainWindow.webContents.stop();

            if (c.script) {
                let cmd = scriptTemplate.replace("//%script%", c.script);


                try {
                    await mainWindow.webContents.executeJavaScript(cmd, true);
                } catch (error) {
                    console.error("script error ", error);
                }


            }

            blockerContext.enable();
        }
    })

    const mainWindow = new BrowserWindow({
        height: 600,
        width: 800,
        fullscreen: true,
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: false,
            nodeIntegrationInSubFrames: false,
            webviewTag: false,
            preload: path.resolve(`${root}/build/overlay/main.js`),
        },
    });

    mainWindow.setMenuBarVisibility(false);

    if (dev) {
        mainWindow.webContents.openDevTools();
    }


    mainWindow.loadURL("about:blank");

    app.on("window-all-closed", () => {
        app.exit(0);
    })
})


function delay(time = 2000) {
    return new Promise(r => setTimeout(() => {
        r(true)
    }, time))
}

async function timed(p, time = 2000) {
    let timeout;
    let timer = new Promise(r => {
        timeout = setTimeout(() => {
            r("timeout");
        }, time);
    })
    try {
        let res = await Promise.race([p, timer])

        if (res == "timeout") {
            return false;
        } else {
            clearTimeout(timeout);
            return true;
        }
    } catch (error) {
        return false;
    }
}

function parseArgs(defaults) {
    let args = defaults ?? {}
    for (let i = 0; i < process.argv.length; i++) {
        const element = process.argv[i];
        if (element == "-p" || element == "--port") {
            let p = Number.parseInt(process.argv[i + 1]);
            if (!isNaN(p)) {
                args.port = p;
            }
        }
        if (element == "-d" || element == "--dev") {
            args.dev = true;
        }
    }
    return args;
}