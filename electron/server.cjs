const express = require("express")
const cors = require('cors')
const settings = require("./settings.cjs");
const commands = require("./commands.cjs");



/**@type {import("express").Response[]} */
let settingsListeners = [];
function notifySettingsListeners(data) {
    const d = `data: ${JSON.stringify(data)}\n\n`;
    try {
        console.log(`notifying listeners with ${settingsListeners.length} with ` + d)
        for (const client of settingsListeners) {
            client.write(d);
        }
    } catch (error) {
        console.log('error on notify settings ', error);
    }

}


const server = express();
server.use(express.json({ limit: 52428800 }))
server.use(express.urlencoded({ extended: true, limit: 52428800 }))
server.use(cors())


server.get("/x", (req, res) => {

    res.send("test 1 2 3 4");
})


server.post("/api/commands/run", (req, res) => {
    onCommand(req.body);

    notifySettingsListeners({
        command: {
            cmd: req.body
        }
    })

    return res.send(true);
})

server.post("/api/commands/run/:id", (req, res) => {

    let found = commands.all().find(d => d.id == req.params.id)

    if (found) {
        onCommand(found);

        notifySettingsListeners({
            command: {
                cmd: found
            }
        })
    }

    return res.send(true);
})


server.get("/api/commands", (req, res) => {
    return res.send(commands.all());
})

server.post("/api/commands", (req, res) => {
    commands.upsert(req.body);
    return res.sendStatus(200);
})

server.post("/api/commands/import", (req, res) => {
    commands.import(req.body);
    return res.sendStatus(200);
})

server.get("/api/commands/export", (req, res) => {
    return res.send(commands.export(req.body));
})





server.delete("/api/commands/:id", (req, res) => {

    let deleted = commands.del({ id: req.params.id })
    return res.sendStatus(deleted ? 200 : 404);
})

server.post('/api/settings', (req, res) => {

    let current = settings.handle(req.body);

    notifySettingsListeners(current);
    return res.sendStatus(200);
})

server.get("/api/settings/sse", (req, res) => {
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });

    // flush the headers to establish SSE with client
    settingsListeners.push(res);

    //res.write('id: ' + Math.random().toString() + '\n');
    res.write(`data: ${JSON.stringify(settings.get())}\n\n`)

    res.on('close', () => {
        console.log(`client dropped me ${settingsListeners.length} clients`);
        settingsListeners.splice(settingsListeners.indexOf(res), 1);
        res.end();
    });

})



/**@type {(cmd:import("../src/scripts/models/ICommand").ICommand)=>void} */
let onCommand = () => console.error("Command handler not set");

exports.serve = (port, res) => {

    server.use(express.static(res))

    server.listen(port, '0.0.0.0', () => {
        console.log(`listening http://127.0.0.1:${port}`);
    })
}
/**@type {(f:(cmd:import("../src/scripts/models/ICommand").ICommand)=>void)=>void} */
exports.command = (c) => {
    onCommand = c;
}


