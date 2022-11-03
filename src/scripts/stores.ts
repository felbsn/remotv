import type { ISettings } from "$scripts/models/ISettings";
import { writable } from "svelte/store";
import { register } from "./remote";


export const settings = writable<Required<ISettings>>({
    audio: {
        mute: false,
        volume: 50
    },
    command: {
        index: 0
    },
    refresh: {
        force: false,
    },
    shutdown: {
        timeout: 0
    }
});

export const ui = writable({
    menu: false
})



