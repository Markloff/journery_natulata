import { IDisposable } from 'core';
import { Project } from './project';


export type MonorepoType = 'rush' | 'turbo';
export type Bundler = 'webpack' | 'vite';

export interface InitializeOptions {
	name: string;
	monorepo: MonorepoType | null;
	withMicroFrontendClient: boolean;
	withGraphQLServer: boolean;
}



export interface IWorkspace {
	_serviceBrand: undefined;
	init(): void;
	listProject(): Project;
	createProject(): IDisposable;
	removeProject(project: Project): IDisposable;

}



