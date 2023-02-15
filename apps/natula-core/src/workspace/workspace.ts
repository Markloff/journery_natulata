import { IWorkspace } from '../base/workspace/workspace';
import { Emitter, IDisposable, IInstantiationService, toDisposable } from 'core';
import { IWorkspaceEnvironmentService } from '../service/environment/environment';
import { ITemplateService } from '../service/template/templateService';
import { NoRelationshipContainer } from './container';
import { IFileService } from '../service/file/fileService';
import { getDefaultProject, Project, ProjectType } from '../base/project/project';

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

	// TODO need refactor
	async init() {
		const { monorepo, withGraphQLServer, withMicroFrontendClient, rootPath } = this.environmentService;
		// this.fileService.createDictionary(rootPath);
		await this.templateService.generateMetaTemplate();
		if (monorepo === null) {
			const container = new NoRelationshipContainer(rootPath);
			if (withMicroFrontendClient) {
				container.addProject(getDefaultProject(ProjectType.MicroFrontendClient));
			}
			if (withGraphQLServer) {
				container.addProject(getDefaultProject(ProjectType.GraphQLServer))
			}
			this._dispatchChange(container.projects);
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

	private _dispatchChange(projects: ReadonlyArray<Project>) {
		for (const project of projects) {
			this.templateService.generateTemplate(project);
		}
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
