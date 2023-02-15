export declare enum ProjectType {
    MicroFrontendClient = "MicroFrontendClient",
    GraphQLServer = "GraphQLServer",
    ReactComponentPackage = "ReactComponentPackage",
    JavascriptClientSDK = "JavascriptClientSDK",
    NodePackage = "NodePackage"
}
export declare class Project {
    relativePath: string;
    name: string;
    containerDir: string;
    type: ProjectType;
    constructor(name: string, type: ProjectType, relativePath?: string);
    hook(containerDir: string, relativePath?: string): void;
    get hooked(): boolean;
    get id(): string;
    get depth(): number;
}
export declare const getDefaultProjectName: (type: ProjectType) => string;
export declare const getDefaultProject: (type: ProjectType) => Project;
export declare const createProject: (name: string, type: ProjectType) => Project;
