const { app, BrowserWindow, BrowserView, session, powerSaveBlocker } = require("electron");
const { ElectronBlocker } = require('@cliqz/adblocker-electron');
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

ElectronBlocker.fromPrebuiltFull(fetch).then((blocker) => {
    blocker.enableBlockingInSession(session.defaultSession);
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

    let exedir = app.getPath("exe")
    console.log("where is this exe is " + exedir);

    const { port, dev } = parseArgs({ port: 9111, dev: false });
    const root = dev ? "." : resourcesPath;
    const scriptTemplate = await readFile(`${root}/templates/script.template.js`, "utf-8");

    let interfaces = os.networkInterfaces()
    let ethernet = interfaces["Ethernet"]?.find(d => d.family == "IPv4");
    let wifi = interfaces["Wi-Fi"]?.find(d => d.family == "IPv4");
    let conn = ethernet ?? wifi;
    let appUrl = `http://${conn.address}:${port}`;

    settings.setAppUrl(appUrl, app.getPath("exe"));
    commands.load(commandsFilePath);
    server.serve(port, `${root}/build/gui`);

    server.command(async (c) => {
        if (c.url) {
            blocked = c.blockedUrls?.join('|');
            await mainWindow.webContents.loadURL(c.url, {
            })

            if (c.script) {
                let cmd = scriptTemplate.replace("//%script%", c.script);
                await mainWindow.webContents.executeJavaScript(cmd, true);
            }
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