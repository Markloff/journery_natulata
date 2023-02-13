import { ProjectType } from '../../base/project/project';
import { InitializeOptions, MonorepoType } from '../../base/workspace/workspace';
export type IWorkspaceEnvironmentOptions = InitializeOptions & {
    rootPath: string;
    generatorConfig?: Config;
};
export interface IWorkspaceEnvironmentService {
    _serviceBrand: undefined;
    name: string;
    rootPath: string;
    withGraphQLServer: boolean;
    withMicroFrontendClient: boolean;
    monorepo: MonorepoType | null;
}
export declare const IWorkspaceEnvironmentService: import("core/lib/core/instantiation/common/instantiation").ServiceIdentifier<IWorkspaceEnvironmentService>;
interface Config {
    branch: string;
    generator: Partial<Record<ProjectType, string>>;
}
declare class Generator {
}
export declare class WorkspaceEnvironment implements IWorkspaceEnvironmentService {
    readonly _serviceBrand: undefined;
    readonly rootPath: string;
    readonly name: string;
    readonly generatorCollection: Map<ProjectType, Set<Generator>>;
    withGraphQLServer: boolean;
    withMicroFrontendClient: boolean;
    monorepo: MonorepoType | null;
    constructor(options: IWorkspaceEnvironmentOptions);
    private refineGeneratorConfig;
}
export {};
