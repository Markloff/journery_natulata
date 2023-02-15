import { IWorkspaceEnvironmentService } from '../environment/environment';
import { Project } from '../../base/project/project';
export interface ITemplateService {
    _serviceBrand: undefined;
    generateMetaTemplate(): Promise<void>;
    generateTemplate(project: Project): Promise<void>;
}
export declare const ITemplateService: import("core").ServiceIdentifier<ITemplateService>;
export declare class TemplateService implements ITemplateService {
    private readonly environmentService;
    readonly _serviceBrand: undefined;
    private readonly generator;
    constructor(environmentService: IWorkspaceEnvironmentService);
    generateMetaTemplate(): Promise<void>;
    generateTemplate(project: Project): Promise<void>;
    private getGeneratorHelpers;
    private getGeneratorFor;
    private getGeneratorConfig;
}
