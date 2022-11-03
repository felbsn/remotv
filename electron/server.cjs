const express = require("express")
const cors = require('cors')
const fs = require('fs')


/**@type {import("../src/scripts/models/ICommand").ICommand[]} */
let commands = []


/**@type {import("../src/scripts/models/ISettings").ISettings} */
let settings = {
    audio: {
        mute: false,
        volume: 50,
    },
}

/**@type {import("express").Response} */
let commandListener;

/**@type {import("express").Response[]} */
let settingListener = [];

function notifySettingListeners(data) {
    const d = `data: ${JSON.stringify(data)}\n\n`;
    try {
        console.log(`notifying listeners with ${settingListener.length} ` + d)
        for (const client of settingListener) {
            client.write(d);
        }
    } catch (error) {
        console.log('error on notify settings ', error);
    }

}

function notifyCommandListener(data) {
    if (commandListener) {
        commandListener.write(`data: ${JSON.stringify(data)}\n\n`)
        return true;
    }
    else
        return false;
}



const server = express();
server.use(express.json({ limit: 52428800 }))
server.use(express.urlencoded({ limit: 52428800 }))
server.use(cors())
server.use(express.static('build/gui'))

server.get("/x", (req, res) => {

    res.send("test 1 2 3 4");
})


server.post("/api/commands/run", (req, res) => {
    notifyCommandListener(req.body);
    res.send(true);
})

server.get("/api/commands", (req, res) => {
    res.send(commands);
})

server.post("/api/commands", (req, res) => {

    let found = commands.find(c => c.id == req.body.id);
    if (found) {
        found = Object.assign(found, req.body);
    } else {
        found = req.body;
        commands.push(req.body);
    }

    save();

    return res.send(found);
})

server.delete("/api/commands/:id", (req, res) => {

    let foundIndex = commands.findIndex(c => c.id == req.params.id);

    if (foundIndex < 0)
        return res.sendStatus("404");

    if (foundIndex >= 0) {
        commands.splice(foundIndex, 1);
    }

    save();

    res.sendStatus(200);
})
server.get("/api/commands/sse", (req, res) => {
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });// flush the headers to establish SSE with client

    if (commandListener != null) {
        commandListener.end();
    }


    commandListener = res;


    res.on('close', () => {
        console.log('client dropped me');
        commandListener.end();
        commandListener = null;
    });
})

server.get("/api/settings/sse", (req, res) => {
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });

    // flush the headers to establish SSE with client

    settingListener.push(res);

    //res.write('id: ' + Math.random().toString() + '\n');
    res.write(`data: ${JSON.stringify(settings)}\n\n`)

    res.on('close', () => {
        console.log(`client dropped me ${settingListener.length} clients`);
        settingListener.splice(settingListener.indexOf(res), 1);
        res.end();
    });

})
server.post('/api/settings', (req, res) => {

    /**@type {import("../src/scripts/models/ISettings").ISettings} */
    let s = req.body

    try {
        if (s.audio) {

            console.log("audio set to " + s.audio.volume)
        }

        if (s.command) {
            notifyCommandListener(commands[s.command.index])
        }

        settings = Object.assign(settings, s);
        console.log('updated settings')
        notifySettingListeners(settings);

        res.send({})
    } catch (error) {
        res.end();
    }

})

server.listen(3333, '0.0.0.0', () => {
    console.log("listening http://127.0.0.1:3333");
})


function save() {
    fs.writeFileSync(savePath, JSON.stringify(commands));
}

let savePath;


exports.server = server;

exports.load = function (filePath) {
    savePath = filePath;

    if (fs.existsSync(filePath)) {
        let data = fs.readFileSync(filePath);
        let str = data.toString();
        commands = JSON.parse(str);
        console.log(`loaded ${commands.length} commands`)
    } else {
        commands = []
    }
}
