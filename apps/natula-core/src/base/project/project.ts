import { relative, resolve } from 'node:path';

export enum ProjectType {
	MicroFrontendClient = 'MicroFrontendClient',
	GraphQLServer = 'GraphQLServer',
	ReactComponentPackage = 'ReactComponentPackage',
	JavascriptClientSDK = 'JavascriptClientSDK',
	NodePackage = 'NodePackage',
}

const getPathRelativeDepth = (root: string, path: string): number => {
	const relativePath = relative(root, path);
	return relativePath.split('/').length - 1;
}

export class Project {
	relativePath: string;
	name: string;
	containerDir: string;
	type: ProjectType;

	constructor(name: string, type: ProjectType, relativePath = '') {
		this.name = name;
		this.type = type;
		this.relativePath = relativePath;
		this.containerDir = '';
	}

	hook(containerDir: string, relativePath: string = '') {
		this.relativePath = this.relativePath || relativePath;
		this.containerDir = containerDir;
	}

	get hooked(): boolean {
		return Boolean(this.relativePath);
	}

	get id(): string {
		if (this.hooked) {
			return resolve(this.containerDir, this.relativePath);
		} else {
			return `${this.containerDir}_${this.name}_${this.type}`;
		}
	}

	get depth(): number {
		return this.relativePath.split('/').length;
	}
}

const DEFAULT_NAME: Record<ProjectType, string> = {
	[ProjectType.MicroFrontendClient]: 'airwallex-micro-frontend-client',
	[ProjectType.GraphQLServer]: 'airwallex-graphQL-federation-server',
	[ProjectType.NodePackage]: '@airwallex/node-package',
	[ProjectType.ReactComponentPackage]: '@airwallex/react-component',
	[ProjectType.JavascriptClientSDK]: '@airwallex/javascript-sdk'
}

export const getDefaultProjectName = (type: ProjectType) => {
	return DEFAULT_NAME[type] || '';
}

export const getDefaultProject = (type: ProjectType) => {
	return createProject(DEFAULT_NAME[type], type);
}

export const createProject = (name: string, type: ProjectType): Project => {
	return new Project(name, type);
}
