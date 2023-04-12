import type { ICommand } from "$scripts/models/ICommand"



export interface ISettings {
    audio?: {
        volume: number
        mute: boolean
    }
    exit?: {
    },
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


    app?: {
        launchOnStartup?: boolean;
    }

    appUrl?: string
}