import type { ISettings } from "$scripts/models/ISettings";
import axios, { type AxiosResponse } from "axios";
import type { ICommand } from "./models/ICommand";
import type { WithId } from "./models/WithId";

let API_BASE = "/api";


export default {
    getCommandList,
    updateCommand,
    deleteCommand,
    onCommand,
    runCommand,
    runCommandExact,
    setSettings,
    onSettings,
    importCommands,
    exportCommands,
    updateApiBase(url: string) {
        API_BASE = url;
    }
}


async function getCommandList(): Promise<{ data: ICommand[]; error?: false; } | { error: true; data?: undefined; }> {
    try {
        let res = await axios.get<ICommand[]>(`${API_BASE}/commands`);
        return { data: res.data }
    } catch (error) {
        console.error("error", error);
        return {
            error: true
        }
    }
}

export async function runCommandExact(cmd: WithId) {
    try {
        let res = await axios.post<boolean>(`${API_BASE}/commands/run/${cmd.id}`);
        return { data: res.data }
    } catch (error) {
        console.error("error", error);
        return {
            error: true
        }
    }
}

export async function runCommand(cmd: ICommand) {
    try {
        let res = await axios.post<boolean>(`${API_BASE}/commands/run`, cmd);
        return { data: res.data }
    } catch (error) {
        console.error("error", error);
        return {
            error: true
        }
    }

}

async function updateCommand(cmd: Partial<ICommand> & WithId) {

    try {
        let res = await axios.post<ICommand>(`${API_BASE}/commands`, cmd);
        return { data: res.data }
    } catch (error) {
        console.error("error", error);
        return {
            error: true
        }
    }
}

async function deleteCommand(cmd: WithId) {
    try {
        let res = await axios.delete(`${API_BASE}/commands/${cmd.id}`);
        return { data: res.data }
    } catch (error) {
        console.error("error", error);
        return {
            error: true
        }
    }
}

async function importCommands(commands: ICommand[]) {
    try {
        let res = await axios.post(`${API_BASE}/commands/import`, commands);
        return { data: res.data }
    } catch (error) {
        console.error("error", error);
        return {
            error: true
        }
    }
}

async function exportCommands() {
    try {
        let res = await axios.get(`${API_BASE}/commands/export`);
        return { data: res.data }
    } catch (error) {
        console.error("error", error);
        return {
            error: true
        }
    }
}




let timed = 0;

async function setSettings(values: ISettings) {

    // if (timed) {
    //    clearTimeout(timed)
    // }

    //timed = window.setTimeout(async () => {
    try {
        console.log("here in the begin")
        // let res = await fetch(`/api/settings`, {
        // method: 'POST',
        // headers: {
        // 'Accept': 'application/json',
        // 'Content-Type': 'application/json'
        // },
        // body: JSON.stringify(values)
        // })

        // timed = 0;
        // console.log("here in the middle")
        let res = await axios.post(`${API_BASE}/settings`, values);
        //let d = await res.json();
        //return { data: d.data }
    } catch (error) {
        console.error("error", error);
        timed = 0;
        return {
            error: true
        }
    }
    //}, 600)
}

function onSettings(f: (v: Required<ISettings>) => void, o?: (ev: Event) => void, err?: (ev: Event) => void) {
    let source = new EventSource(`${API_BASE}/settings/sse`);
    source.onmessage = (e) => {
        f.call(null, JSON.parse(e.data))
    }
    source.onerror = err ?? null;
    source.onopen = o ?? null;
    return source;
}


async function onCommand(f: (v: ICommand) => void, o?: (ev: Event) => void, err?: (ev: Event) => void) {
    let source = new EventSource(`${API_BASE}/commands/sse`);
    source.onmessage = (e) => {
        f.call(null, JSON.parse(e.data))
    }
    source.onerror = err ?? null;
    source.onopen = o ?? null;

}



