import { IInstantiationService, ServicesAccessor } from '../../../core/instantiation/common/instantiation';
import { Event } from '../../../core/base/common/event';
import { TypeConstraint } from '../../../core/base/common/type';
import { IJSONSchema } from '../../../core/base/common/jsonSchema';
import { Disposable, IDisposable } from '../../../core/base/common/lifecycle';
export interface ICommandEvent {
    commandId: string;
    args: any[];
}
export interface ICommandService {
    readonly _serviceBrand: undefined;
    onWillExecuteCommand: Event<ICommandEvent>;
    onDidExecuteCommand: Event<ICommandEvent>;
    executeCommand<T = any>(commandId: string, ...args: any[]): Promise<T | undefined>;
}
export declare const ICommandService: import("../../../core/instantiation/common/instantiation").ServiceIdentifier<ICommandService>;
export interface ICommandHandler {
    (accessor: ServicesAccessor, ...args: any[]): void;
}
export interface ICommand {
    id: string;
    handler: ICommandHandler;
    description?: ICommandHandlerDescription | null;
}
export interface ICommandHandlerDescription {
    readonly description: string;
    readonly args: ReadonlyArray<{
        readonly name: string;
        readonly isOptional?: boolean;
        readonly constraint?: TypeConstraint;
        readonly schema?: IJSONSchema;
    }>;
    readonly returns?: string;
}
export declare type ICommandsMap = Map<string, ICommand>;
export interface ICommandRegistry {
    onDidRegisterCommand: Event<string>;
    registerCommand(id: string, command: ICommandHandler): IDisposable;
    registerCommand(command: ICommand): IDisposable;
    registerCommandAlias(oldId: string, newId: string): IDisposable;
    getCommand(id: string): ICommand | undefined;
    getCommands(): ICommandsMap;
}
export declare const CommandsRegistry: ICommandRegistry;
export declare class CommandService extends Disposable implements ICommandService {
    private readonly _instantiationService;
    readonly _serviceBrand: undefined;
    private readonly _onWillExecuteCommand;
    readonly onWillExecuteCommand: Event<ICommandEvent>;
    private readonly _onDidExecuteCommand;
    readonly onDidExecuteCommand: Event<ICommandEvent>;
    constructor(_instantiationService: IInstantiationService);
    executeCommand<T = any>(id: string, ...args: any[]): Promise<T | undefined>;
    _tryExecuteCommand(id: string, ...args: any[]): Promise<any>;
}
