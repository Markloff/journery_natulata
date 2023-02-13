export interface IWorkspaceEnvironment {
    name: string;
    rootPath: string;
}
export declare class WorkspaceEnvironment implements IWorkspaceEnvironment {
    readonly rootPath: string;
    readonly name: string;
    constructor(options: IWorkspaceEnvironment);
}
