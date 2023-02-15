import { Project } from './project';
export declare class ProjectCollection {
    private readonly _hasFn;
    private readonly nodes;
    constructor(_hasFn: (element: Project) => string);
    lookupOrInsert(project: Project): Project;
    remove(project: Project): void;
    has(project: Project): boolean;
    isEmpty(): boolean;
    [Symbol.iterator](): Iterator<Project>;
}
