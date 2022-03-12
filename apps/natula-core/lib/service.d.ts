import { ICommandService } from 'core';
declare class Service {
    private readonly _commandService;
    constructor(_commandService: ICommandService);
    executeCommand<T = any>(commandId: string, ...args: any[]): Promise<T | undefined>;
}
export declare const createService: () => Service;
export {};
