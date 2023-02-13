import { ProjectType } from '../../base/project/project';
import { createDecorator } from 'core/lib/core/instantiation/common/instantiation';
import { InitializeOptions, MonorepoType } from '../../base/workspace/workspace';

export type IWorkspaceEnvironmentOptions = InitializeOptions & {
	rootPath: string;
	generatorConfig?: Config;
}

export interface IWorkspaceEnvironmentService {
	_serviceBrand: undefined;
	name: string;
	rootPath: string;
	withGraphQLServer: boolean;
	withMicroFrontendClient: boolean;
	monorepo: MonorepoType | null;
}

export const IWorkspaceEnvironmentService = createDecorator<IWorkspaceEnvironmentService>('IWorkspaceEnvironmentService');


interface Config {
	branch: string;
	generator: Partial<Record<ProjectType, string>>;
}

class Generator {

}

export class WorkspaceEnvironment implements IWorkspaceEnvironmentService {

	public readonly _serviceBrand: undefined;
	readonly rootPath: string;
	readonly name: string;
	readonly generatorCollection: Map<ProjectType, Set<Generator>>;

	withGraphQLServer: boolean;
	withMicroFrontendClient: boolean;

	monorepo: MonorepoType | null;


	constructor(options: IWorkspaceEnvironmentOptions) {
		this.rootPath = options.rootPath;
		this.name = options.name;
		this.monorepo = options.monorepo;
		this.withGraphQLServer = options.withGraphQLServer;
		this.withMicroFrontendClient = options.withMicroFrontendClient;
		this.generatorCollection = this.refineGeneratorConfig(options.generatorConfig);
	}

	private refineGeneratorConfig(config?: Config): Map<ProjectType, Set<Generator>> {

		return new Map<ProjectType, Set<Generator>>();
	}

}

