export declare enum ProjectType {
    MicroFrontendClient = "MicroFrontendClient",
    GraphQLServer = "GraphQLServer",
    ReactComponentPackage = "ReactComponentPackage",
    JavascriptClientSDK = "JavascriptClientSDK",
    NodePackage = "NodePackage"
}
export declare class Project {
    path: string;
    name: string;
    depth: number;
    type: ProjectType;
    constructor(path: string, name: string, type: ProjectType, depth: number);
    get id(): string;
}
