import { Graph, IDisposable, toDisposable } from 'core';
import { MonorepoType } from '../base/workspace/workspace';
// import { Graph } from 'core/lib/core/instantiation/common/graph';
import { Project, ProjectType } from '../base/project/project';
import * as glob from 'fast-glob';
import { dirname, relative, resolve } from 'node:path';
import { pathExistsSync } from 'fs-extra';
import { ProjectCollection } from '../base/project/projectCollection';

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

	private readonly projectCollection = new ProjectCollection(node => node.id);

	constructor(private readonly rootPath: string) {
		this.identifyProjects();
	}

	removeProject(projects: Project): IDisposable {
        throw new Error('Method not implemented.');
    }

	addProject(project: Project): IDisposable {
		this.identifyProjects();
		if(this.projectCollection.has(project)) {
			throw new Error(`Project type ${project.type} with name ${project.name} already existing`);
		}
		project.hook(this.rootPath);
		const node = this.projectCollection.lookupOrInsert(project);
		return toDisposable(() => this.projectCollection.remove(node));
	}

	private identifyProjects() {
		const entries = glob.sync(`${this.rootPath}/**/${PACKAGE_JSON}`, { ignore: ['**/node_modules/**', '**/automation/**'] });
		if (entries.length === 0) return;
		for (let i = 0; i < entries.length; i++) {
			const project = this.identifyProjectByPackageJsonPath(entries[i]);
			this.projectCollection.lookupOrInsert(project);
		}
	}

	private identifyProjectByPackageJsonPath(path: string): Project {
		const packageJson = require(path);
		const project = new Project(packageJson.name, Utils.identifyProjectType(packageJson), dirname(relative(this.rootPath, path)));
		project.hook(this.rootPath);
		return project;
	}

	get projects(): ReadonlyArray<Project> {
		const projectsSnapshot: Array<Project> = [];
		for (const project of this.projectCollection) {
			projectsSnapshot.push(project);
		}
		return projectsSnapshot;
	}
}
