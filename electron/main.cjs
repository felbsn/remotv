const { app, BrowserWindow, BrowserView, session } = require("electron");
const { ElectronBlocker } = require('@cliqz/adblocker-electron');
const { fetch } = require('cross-fetch')
const s = require("./server.cjs")




ElectronBlocker.fromPrebuiltAdsAndTracking(fetch).then((blocker) => {
    blocker.enableBlockingInSession(session.defaultSession);
});

app.whenReady().then(async () => {

    let userDataDir = app.getPath("userData")
    let commandsFilePath = `${userDataDir}/commands.json`;
    s.load(commandsFilePath);

    // if (!app.getLoginItemSettings().executableWillLaunchAtLogin) {
    //   app.setLoginItemSettings({
    //     enabled: true,
    //     openAtLogin: true,
    //     name: "RemoTv",
    //     path: app.getPath('exe')
    //   })
    // }

    const mainWindow = new BrowserWindow({
        height: 600,
        width: 800,
        webPreferences: {
            // preload: path.join(__dirname, "preload.js"), //"overlay/main.js"
            contextIsolation: true,
            nodeIntegration: false,
            nodeIntegrationInSubFrames: false,
            webviewTag: true,
        },
    });
    mainWindow.loadFile('electron/index.html')


    //mainWindow.webContents.executeJavaScript()



    // //  mainWindow.fullScreen = true;
    // mainWindow.menuBarVisible = false;

    // mainWindow.webContents.on('new-window', (event: any, url: any) => {
    //   event.preventDefault()
    // })


    //const blocker = await ElectronBlocker.fromPrebuiltFull(fetch);

    //let blocking = blocker.enableBlockingInSession(mainWindow.webContents.session);

    // controller.on('refresh', () => {
    //     mainWindow.reload();
    // })
    // controller.on('channelchanged', async (ch) => {
    //     console.log('url loading for ' + ch.label);
    //     await mainWindow.loadURL(ch.url)
    // })


    // mainWindow.loadURL("https://www.atv.com.tr/canli-yayin");
    // mainWindow.loadURL("https://www.atv.com.tr/canli-yayin");
    //mainWindow.webContents.openDevTools();
})