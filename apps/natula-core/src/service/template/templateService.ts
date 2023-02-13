import { registerSingleton, createDecorator } from 'core';
import { IWorkspaceEnvironmentService } from '../environment/environment';


export interface ITemplateService {
	_serviceBrand: undefined;

}

export const ITemplateService = createDecorator<ITemplateService>('ITemplateService');

export class TemplateService implements ITemplateService {

	public readonly _serviceBrand: undefined;


	constructor(
		@IWorkspaceEnvironmentService private readonly environmentService: IWorkspaceEnvironmentService
	) {
	}




}

registerSingleton(ITemplateService, TemplateService)
