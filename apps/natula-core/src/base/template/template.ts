import { Bundler, MonorepoType } from '../workspace/workspace';
import { ProjectType } from '../project/project';
import { readFileSync } from 'fs-extra';
import { mapKeys } from 'lodash';
import * as toml from 'toml';


export interface ITemplateBuildPayload {
	isMonorepo: boolean;
	monorepo: MonorepoType;
	bundler: Bundler;
}

/**
 * Toml file, it looks like this:
 * title = "AFW generator config"
 *
 * [owner]
 * name = ["Marklov Cai", "Yifan Leng"]
 *
 * [generator.default]
 * mfe_client = "awx-mfe-client-generator"
 * graphql_server = "awx-mfe-graphql-server-generator"
 */
export type GeneratorConfig = Record<ProjectType, string>;

export const TomlFileConfigKeyMap: Record<string, ProjectType> = {
	'mfe_client': ProjectType.MicroFrontendClient,
	'graphql_server': ProjectType.GraphQLServer,
}

export const parse = (path: string): GeneratorConfig => {
	const config = mapKeys(toml.parse(readFileSync(path, 'utf-8')).generator.default, (_, key: string) => {
		return TomlFileConfigKeyMap[key] ?? key;
	});
	return config as GeneratorConfig;
}
