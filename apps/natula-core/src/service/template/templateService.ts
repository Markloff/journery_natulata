import { registerSingleton, createDecorator, memoize } from 'core';
import { IWorkspaceEnvironmentService } from '../environment/environment';
import { HygenGenerator } from './generator';
import { Project, ProjectType } from '../../base/project/project';

import { pathExistsSync } from 'fs-extra';
import { resolve } from 'node:path';
import { parse } from '../../base/template/template';

export interface ITemplateService {
	_serviceBrand: undefined;
	generateMetaTemplate(): Promise<void>;
	generateTemplate(project: Project): Promise<void>;
}

export const ITemplateService = createDecorator<ITemplateService>('ITemplateService');

export class TemplateService implements ITemplateService {

	public readonly _serviceBrand: undefined;

	private readonly generator: HygenGenerator;

	constructor(
		@IWorkspaceEnvironmentService private readonly environmentService: IWorkspaceEnvironmentService
	) {
		this.generator = new HygenGenerator(
			resolve(this.environmentService.templateDir),
		);
	}

	/**
	 * todo
	 * clone template repo
	 * update generator config of environment service
	 */
	async generateMetaTemplate(): Promise<void> {
		// const { templateDir, rootPath } = this.environmentService;
		// const target = resolve(rootPath, './_templates');
		// symlinkSync(templateDir, target, 'dir');
	}

	async generateTemplate(project: Project) {
		const generator = this.getGeneratorFor(project.type);
		const helpers = this.getGeneratorHelpers(generator);
		await this.generator.execute([generator, 'new', project.name], {
			locals: this.environmentService.buildPayload,
			helpers,
		});
	}

	private getGeneratorHelpers(generator: string): Record<any, any> {
		const helperPath = this.environmentService.getGeneratorHelperPath(generator);
		if (pathExistsSync(helperPath)) {
			return require(helperPath).helpers;
		}
		return {};
	}

	private getGeneratorFor(type: ProjectType): string {
		return this.getGeneratorConfig()[type];
	}

	@memoize
	private getGeneratorConfig() {
		return parse(this.environmentService.generatorConfigPath);
	}
}

registerSingleton(ITemplateService, TemplateService)


