#! /usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const natula_core_1 = require("natula-core");
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
    .argument('<name>')
    .option('--monorepo <monorepo>', 'monorepo type', null)
    .option('--mfe', 'with micro front end client', true)
    .option('--graphQL', 'with graphQL server', false)
    .option('-b, --branch')
    .action((name, options) => {
    const { monorepo = null, graphQL = false, mfe = true } = options;
    natula_core_1.application.executeCommand('init', {
        name,
        monorepo,
        withGraphQLServer: graphQL,
        withMicroFrontendClient: mfe
    });
});
program
    .command('new')
    .argument('<type>')
    .action((type) => {
    console.log('new');
});
program.parse();
