import { ProjectType } from '../../base/project/project';
import { InitializeOptions, MonorepoType } from '../../base/workspace/workspace';
export type IWorkspaceEnvironmentOptions = InitializeOptions & {
    rootPath: string;
    generatorConfig?: Config;
};
export interface IWorkspaceEnvironmentLocals {
    rootPath: string;
    withGraphQLServer: boolean;
    withMicroFrontendClient: boolean;
    monorepo: MonorepoType | null;
}
export interface IWorkspaceEnvironmentService extends IWorkspaceEnvironmentLocals {
    _serviceBrand: undefined;
    name: string;
    appHomeDir: string;
    templateDir: string;
    generatorConfigPath: string;
    buildPayload: IWorkspaceEnvironmentLocals;
    getGeneratorHelperPath(generator: string): string;
}
export declare const IWorkspaceEnvironmentService: import("core/lib/core/instantiation/common/instantiation").ServiceIdentifier<IWorkspaceEnvironmentService>;
interface Config {
    branch: string;
    generator: Partial<Record<ProjectType, string>>;
}
export declare class WorkspaceEnvironment implements IWorkspaceEnvironmentService {
    private readonly options;
    readonly _serviceBrand: undefined;
    readonly rootPath: string;
    readonly name: string;
    readonly generatorCollection: Map<ProjectType, string>;
    withGraphQLServer: boolean;
    withMicroFrontendClient: boolean;
    monorepo: MonorepoType | null;
    appHomeDir: string;
    constructor(options: IWorkspaceEnvironmentOptions);
    private refineGeneratorConfig;
    get templateDir(): string;
    get generatorConfigPath(): string;
    private lift;
    get buildPayload(): IWorkspaceEnvironmentLocals;
    getGeneratorHelperPath(generator: string): string;
}
export {};
