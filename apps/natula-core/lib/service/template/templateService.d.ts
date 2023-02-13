import { IWorkspaceEnvironmentService } from '../environment/environment';
export interface ITemplateService {
    _serviceBrand: undefined;
}
export declare const ITemplateService: import("core").ServiceIdentifier<ITemplateService>;
export declare class TemplateService implements ITemplateService {
    private readonly environmentService;
    readonly _serviceBrand: undefined;
    constructor(environmentService: IWorkspaceEnvironmentService);
}
