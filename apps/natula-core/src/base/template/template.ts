import { Bundler, MonorepoType } from '../workspace/workspace';




export interface ITemplateBuildPayload {
	isMonorepo: boolean;
	monorepo: MonorepoType;
	bundler: Bundler;
}

