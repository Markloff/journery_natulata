export interface IModule {
}
export declare class Module implements IModule {
    readonly id: string;
    readonly external: boolean;
    constructor(id: string, external: boolean);
}
