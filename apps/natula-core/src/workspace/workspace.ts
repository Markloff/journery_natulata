import { InitializeOptions, IWorkspace } from '../base/workspace/workspace';
import { Emitter, IDisposable, IInstantiationService, toDisposable } from 'core';
import { Project } from '../base/workspace/project';
import { IWorkspaceEnvironmentService } from '../service/environment/environment';
import { ITemplateService } from '../service/template/templateService';
import { NoRelationshipContainer } from './container';
import * as glob from 'fast-glob';
import { IFileService } from '../service/file/fileService';
import { ProjectType } from '../base/project/project';

export class Workspace implements IWorkspace {

	public readonly _serviceBrand: undefined;

	private readonly _onProjectChange = new Emitter<ReadonlyArray<Project>>();
	public readonly onProjectChange = this._onProjectChange.event;

	constructor(
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IWorkspaceEnvironmentService private readonly environmentService: IWorkspaceEnvironmentService,
		@ITemplateService private readonly templateService: ITemplateService,
		@IFileService private readonly fileService: IFileService,
	) {

	}

	init() {
		const { monorepo, withGraphQLServer, withMicroFrontendClient, rootPath, name} = this.environmentService;

		this.fileService.createDictionary(rootPath);

		if (monorepo === null) {
			const container = new NoRelationshipContainer(rootPath);
			// container.addProject()
		}


		// if (monorepo === null) {
		// 	this.container = new NoRelationshipContainer();
		// } else {
		// 	this.container = new MonorepoContainer();
		// }
		// const template = this.projectTemplateService.getTemplate();
		// const project = new Project(template);
		// this._addProject(project);
		// this._dispatchChange();
	}

	private _dispatchChange() {
		// this._onProjectChange.fire(this.projects);
	}

	private _addProject(project: Project) {

	}

	createProject(): IDisposable {

		return toDisposable(() => {})
	}


	listProject(): Project {
		throw new Error('not implemented')
		// return undefined;
	}

	removeProject(project: Project): IDisposable {
		throw new Error('not implemented')
	}
}


class MonorepoWorkspace extends Workspace {

}
