import { IDisposable } from 'core';
import { MonorepoType } from '../base/workspace/workspace';
import { Project } from '../base/project/project';
declare const NOT_MONOREPO = "NOT_MONOREPO";
type NOT_MONOREPO = typeof NOT_MONOREPO;
interface IContainer {
    monorepo: MonorepoType | NOT_MONOREPO;
    maxDepth: number;
    addProject(project: Project): IDisposable;
    removeProject(project: Project): IDisposable;
    projects: ReadonlyArray<Project>;
}
export declare class NoRelationshipContainer implements IContainer {
    private readonly rootPath;
    monorepo: NOT_MONOREPO;
    maxDepth: number;
    private readonly projectStore;
    constructor(rootPath: string);
    removeProject(projects: Project): IDisposable;
    addProject(project: Project): IDisposable;
    private identifyProjects;
    private identifyProjectByPackageJsonPath;
}
export {};
