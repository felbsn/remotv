import type { WithId } from "./WithId";

export interface ICommand extends WithId {
    title: string;
    icon: string;
    script: string;
    url?: string,
    blockedUrls?: string[]
}
