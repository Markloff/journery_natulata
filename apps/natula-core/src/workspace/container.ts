import { Graph, IDisposable, toDisposable } from 'core';
import { MonorepoType } from '../base/workspace/workspace';
// import { Graph } from 'core/lib/core/instantiation/common/graph';
import { Project, ProjectType } from '../base/project/project';
import * as glob from 'fast-glob';
import { relative, resolve } from 'node:path';
import { pathExistsSync } from 'fs-extra';

const NOT_MONOREPO = 'NOT_MONOREPO';
const REACT = 'React';
const PACKAGE_JSON = 'package.json';
const VERSION_FILE = 'version.json';
const ROVER = '@apollo/rover';
type NOT_MONOREPO = typeof NOT_MONOREPO;

interface IContainer {
	monorepo: MonorepoType | NOT_MONOREPO;
	maxDepth: number;
	addProject(project: Project): IDisposable;
	removeProject(project: Project): IDisposable;
	projects: ReadonlyArray<Project>;
}

namespace Utils {
	export const getPathRelativeDepth = (root: string, path: string): number => {
		const relativePath = relative(root, path);
		return relativePath.split('/').length - 1;
	}

	export const identifyProjectType = (rootPath: string): ProjectType => {
		const packageJson = require(resolve(rootPath, PACKAGE_JSON));
		const configReactAsDevDependency = packageJson.devDependencies[REACT] || packageJson.peerDependencies[REACT];
		const configReactAsDependency = packageJson.dependencies[REACT] || packageJson.peerDependencies[REACT];
		const configRoverAsDependency = packageJson.dependencies[ROVER] || packageJson.devDependencies[ROVER];
		if (configReactAsDependency) {
			const withVersionFile = pathExistsSync(resolve(rootPath, VERSION_FILE));
			return withVersionFile ? ProjectType.MicroFrontendClient : ProjectType.JavascriptClientSDK;
		} else if (configReactAsDevDependency) {
			return ProjectType.ReactComponentPackage;
		} else if (configRoverAsDependency) {
			return ProjectType.GraphQLServer;
		} else {
			return ProjectType.NodePackage;
		}
	}
}

export class NoRelationshipContainer implements IContainer {
	monorepo: NOT_MONOREPO = NOT_MONOREPO;
	maxDepth = 1;

	private readonly projectStore: Graph<Project> = new Graph<Project>(node => node.id);

	constructor(private readonly rootPath: string) {
		this.identifyProjects();
	}

	removeProject(projects: Project): IDisposable {
        throw new Error('Method not implemented.');
    }

	addProject(project: Project): IDisposable {
		this.identifyProjects();
		if(this.projectStore.lookup(project)) {
			throw new Error(`Project type ${project.type} with name ${project.name} already existing`);
		}
		const node = this.projectStore.lookupOrInsertNode(project);
		return toDisposable(() => this.projectStore.removeNode(node.data));
	}

	private identifyProjects() {
		const entries = glob.sync(`${this.rootPath}/**/${PACKAGE_JSON}`, { ignore: ['**/node_modules/**', '**/automation/**'] });
		if (entries.length === 0) return;
		for (let i = 0; i < entries.length; i++) {
			const project = this.identifyProjectByPackageJsonPath(entries[i]);
			this.projectStore.lookupOrInsertNode(project);
		}
	}

	private identifyProjectByPackageJsonPath(path: string): Project {
		const depth = Utils.getPathRelativeDepth(this.rootPath, path);
		const packageJson = require(path);
		return new Project(path, packageJson.name, Utils.identifyProjectType(packageJson), depth);
	}

	get projects(): ReadonlyArray<Project> {
		return [];
	}
}


//
// class Container implements IContainer {
// 	monorepo: MonorepoType = 'turbo';
//
// 	constructor(
// 		private readonly rootPath: string
// 	) {
//
// 	}
//
// 	addProject(name: string, type: ProjectType): IDisposable {
// 		const graph = this.buildGraph();
// 		graph.lookupOrInsertNode(createProject(name, type));
// 	}
//
// 	removeProject(name: string): IDisposable {
//
// 	}
//
// 	private buildGraph(): Graph<Project> {
// 		const graph = new Graph<Project>(node => node.id);
//
// 	}
// }





