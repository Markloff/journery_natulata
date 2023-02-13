#! /usr/bin/env node
import { Command } from 'commander'
import { application } from 'natula-core';

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
	.argument('<name>')
	.option('--monorepo <monorepo>', 'monorepo type', null)
	.option('--mfe', 'with micro front end client', true)
	.option('--graphQL', 'with graphQL server', false)
	.option('-b, --branch')
	.action((name: string, options: InitCommandOptions) => {
		const { monorepo = null, graphQL = false, mfe = true } = options;
		application.executeCommand('init', {
			name,
			monorepo,
			withGraphQLServer: graphQL,
			withMicroFrontendClient: mfe
		});
	})

program
	.command('new')
	.argument('<type>')
	.action((type: string) => {
		console.log('new')
	})

program.parse();
