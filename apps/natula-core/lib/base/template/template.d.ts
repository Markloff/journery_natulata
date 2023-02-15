import { Bundler, MonorepoType } from '../workspace/workspace';
import { ProjectType } from '../project/project';
export interface ITemplateBuildPayload {
    isMonorepo: boolean;
    monorepo: MonorepoType;
    bundler: Bundler;
}
export type GeneratorConfig = Record<ProjectType, string>;
export declare const TomlFileConfigKeyMap: Record<string, ProjectType>;
export declare const parse: (path: string) => GeneratorConfig;
