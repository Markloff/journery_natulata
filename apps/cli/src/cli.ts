#! /usr/bin/env node
import { Command } from 'commander';
import { application, getDefaultProjectName, ProjectType } from 'natula-core';
import { basename } from 'node:path';
import { cwd } from 'node:process';
import { DEFAULT_APP_HOME } from './const';

const program = new Command()

program
	.name('airwallex-fe-workspace')
	.description('CLI to work on airwallex FE work')
	.version('0.8.0');

// 配置帮助信息
program.on('--help', () => {
	console.log("\nIf you got any issue, please contact Marklov Cai or Yifan Leng\n");
})

interface InitCommandOptions {
	monorepo: 'turbo' | 'rush' | null;
	graphQL: boolean;
	mfe: boolean;
}

program
	.command('init')
	.option('--monorepo <monorepo>', 'monorepo type', null)
	.option('--mfe [name]', 'create micro frontend client', getDefaultProjectName(ProjectType.MicroFrontendClient))
	.option('--graphql <name>', 'with graphQL server', '')
	.option('-b, --branch')
	.action((options: Omit<InitCommandOptions, 'graphQL'> & { graphql: string }) => {
		const { monorepo = null, graphql, mfe } = options;
		const rootPath = cwd();
		const appHomeDir = process.env.AWF_HOME || DEFAULT_APP_HOME();
		application.executeCommand('init', {
			name: basename(rootPath),
			rootPath,
			monorepo,
			graphQL: graphql,
			microFrontendClient: mfe,
			appHomeDir,
		});
	})

program
	.command('new')
	.argument('<type>')
	.action((type: string) => {
		console.log('new')
	})

program.parse();
