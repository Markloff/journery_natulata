#! /usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const natula_core_1 = require("natula-core");
const node_path_1 = require("node:path");
const node_process_1 = require("node:process");
const const_1 = require("./const");
const program = new commander_1.Command();
program
    .name('airwallex-fe-workspace')
    .description('CLI to work on airwallex FE work')
    .version('0.8.0');
// 配置帮助信息
program.on('--help', () => {
    console.log("\nIf you got any issue, please contact Marklov Cai or Yifan Leng\n");
});
program
    .command('init')
    .option('--monorepo <monorepo>', 'monorepo type', null)
    .option('--mfe [name]', 'create micro frontend client', (0, natula_core_1.getDefaultProjectName)(natula_core_1.ProjectType.MicroFrontendClient))
    .option('--graphql <name>', 'with graphQL server', '')
    .option('-b, --branch')
    .action((options) => {
    const { monorepo = null, graphql, mfe } = options;
    const rootPath = (0, node_process_1.cwd)();
    const appHomeDir = process.env.AWF_HOME || (0, const_1.DEFAULT_APP_HOME)();
    natula_core_1.application.executeCommand('init', {
        name: (0, node_path_1.basename)(rootPath),
        rootPath,
        monorepo,
        graphQL: graphql,
        microFrontendClient: mfe,
        appHomeDir,
    });
});
program
    .command('new')
    .argument('<type>')
    .action((type) => {
    console.log('new');
});
program.parse();
