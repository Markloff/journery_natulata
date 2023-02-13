export enum ProjectType {
	MicroFrontendClient = 'MicroFrontendClient',
	GraphQLServer = 'GraphQLServer',
	ReactComponentPackage = 'ReactComponentPackage',
	JavascriptClientSDK = 'JavascriptClientSDK',
	NodePackage = 'NodePackage',
}


export class Project {
	path: string;
	name: string;
	depth: number;
	type: ProjectType;

	constructor(path: string, name: string, type: ProjectType, depth: number) {
		this.path = path;
		this.name = name;
		this.type = type;
		this.depth = depth;
	}

	get id() {
		return this.path;
	}
}


// export const createProject = (name: string, type: ProjectType): Project => {
// 	return new Project(name, type);
// }
