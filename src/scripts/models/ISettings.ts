import type { ICommand } from "$scripts/models/ICommand"



export interface ISettings {
    audio?: {
        volume: number
        mute: boolean
    }
    shutdown?: {
        timeout: number
    },
    refresh?: {
        force: false
    },
    command?: {
        index: number
        cmd: ICommand
    }
}