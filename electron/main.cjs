const { app, BrowserWindow, BrowserView, session } = require("electron");
const { ElectronBlocker } = require('@cliqz/adblocker-electron');
const { fetch } = require('cross-fetch')
const server = require("./server.cjs")
const commands = require("./commands.cjs");
const path = require("path");
const { readFile } = require("fs/promises");


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

    const userDataDir = app.getPath("userData")
    const commandsFilePath = `${userDataDir}/commands.json`;
    const scriptTemplate = await readFile("templates/script.template.js", "utf-8");
    const { port } = parseArgs({ port: 9111 });

    commands.load(commandsFilePath);
    server.serve(port);
    server.command(async (c) => {
        if (c.url) {
            blocked = c.blockedUrls?.join('|');
            await mainWindow.webContents.loadURL(c.url, {
            })
            for (const script of c.scripts) {
                let cmd = scriptTemplate.replace("//%script%", script);
                console.log("running script ? ", cmd)
                await mainWindow.webContents.executeJavaScript(cmd, true);
            }
        }
    })

    const mainWindow = new BrowserWindow({
        height: 600,
        width: 800,
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: false,
            nodeIntegrationInSubFrames: false,
            webviewTag: false,
            preload: path.resolve("build/overlay/main.js"),
        },
    });

    mainWindow.webContents.openDevTools();
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
    }
    return args;
}