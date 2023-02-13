import { IWorkspace } from '../base/workspace/workspace';
import { IDisposable, IInstantiationService } from 'core';
import { Project } from '../base/workspace/project';
import { IWorkspaceEnvironmentService } from '../service/environment/environment';
import { ITemplateService } from '../service/template/templateService';
import { IFileService } from '../service/file/fileService';
export declare class Workspace implements IWorkspace {
    private readonly instantiationService;
    private readonly environmentService;
    private readonly templateService;
    private readonly fileService;
    readonly _serviceBrand: undefined;
    private readonly _onProjectChange;
    readonly onProjectChange: import("core").Event<readonly Project[]>;
    constructor(instantiationService: IInstantiationService, environmentService: IWorkspaceEnvironmentService, templateService: ITemplateService, fileService: IFileService);
    init(): void;
    private _dispatchChange;
    private _addProject;
    createProject(): IDisposable;
    listProject(): Project;
    removeProject(project: Project): IDisposable;
}
