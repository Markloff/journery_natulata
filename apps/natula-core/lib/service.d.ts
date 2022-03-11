import { ICommandService, IInstantiationService } from 'core';
declare class Service {
    private readonly _instantiationService;
    private readonly _commandService;
    constructor(_instantiationService: IInstantiationService, _commandService: ICommandService);
}
export declare const createService: () => Service;
export {};
