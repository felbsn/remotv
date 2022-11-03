import type { WithId } from "./WithId";

export interface ICommand extends WithId {
    title: string;
    icon: string;
    scripts: string[];
    url?: string
}
