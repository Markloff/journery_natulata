import { ProjectType } from '../../base/project/project';
import { createDecorator } from 'core/lib/core/instantiation/common/instantiation';
import { InitializeOptions, MonorepoType } from '../../base/workspace/workspace';
import { resolve } from 'node:path';

export type IWorkspaceEnvironmentOptions = InitializeOptions & {
	rootPath: string;
	generatorConfig?: Config;
}

export interface IWorkspaceEnvironmentLocals {
	rootPath: string;
	withGraphQLServer: boolean;
	withMicroFrontendClient: boolean;
	monorepo: MonorepoType | null;
}

export interface IWorkspaceEnvironmentService extends IWorkspaceEnvironmentLocals {
	_serviceBrand: undefined;
	name: string;
	appHomeDir: string;
	templateDir: string;
	generatorConfigPath: string;
	buildPayload: IWorkspaceEnvironmentLocals;
	getGeneratorHelperPath(generator: string): string;
}



export const IWorkspaceEnvironmentService = createDecorator<IWorkspaceEnvironmentService>('IWorkspaceEnvironmentService');


interface Config {
	branch: string;
	generator: Partial<Record<ProjectType, string>>;
}

export class WorkspaceEnvironment implements IWorkspaceEnvironmentService {

	public readonly _serviceBrand: undefined;
	readonly rootPath: string;
	readonly name: string;
	readonly generatorCollection: Map<ProjectType, string>;

	withGraphQLServer: boolean;
	withMicroFrontendClient: boolean;

	monorepo: MonorepoType | null;
	appHomeDir: string;

	constructor(private readonly options: IWorkspaceEnvironmentOptions) {
		this.rootPath = options.rootPath;
		this.name = options.name;
		this.monorepo = options.monorepo;
		this.withGraphQLServer = Boolean(options.graphQL);
		this.withMicroFrontendClient = Boolean(options.microFrontendClient);
		this.generatorCollection = this.refineGeneratorConfig(options.generatorConfig);
		this.appHomeDir = options.appHomeDir;
	}

	private refineGeneratorConfig(config?: Config): Map<ProjectType, string> {
		const collection = new Map<ProjectType, string>();
		return collection;
	}

	get templateDir(): string {
		return resolve(this.appHomeDir, './template/_templates');
	}

	get generatorConfigPath(): string {
		return resolve(this.appHomeDir, './template/config.toml');
	}

	private lift(): IWorkspaceEnvironmentLocals {
		return this as IWorkspaceEnvironmentLocals;
	}

	get buildPayload(): IWorkspaceEnvironmentLocals {
		return this.lift();
	}

	getGeneratorHelperPath(generator: string): string {
		return resolve(this.templateDir, generator, '.helper.js');
	}
}

