const fs = require("fs")

/**@type {import("../src/scripts/models/ICommand").ICommand[]} */
let commands = []

/**@type {string} */
let savePath;


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

exports.all = () => commands;

/**@type {(cmd:import("../src/scripts/models/ICommand").ICommand) => void} */
exports.upsert = (cmd) => {

    let index = commands.findIndex(d => d.id == cmd.id)
    if (index < 0) {
        commands.push(cmd);
    } else {
        commands.splice(index, 1, cmd);
    }
    save();
}

exports.del = (cmd) => {
    let index = commands.findIndex(d => d.id == cmd.id)

    if (index >= 0) {
        commands.splice(index, 1);
        save();
    }
    return index >= 0;
}


function save() {
    fs.writeFileSync(savePath, JSON.stringify(commands));
}