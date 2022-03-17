#! /usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const path_1 = require("path");
const natula_core_1 = require("natula-core");
const program = new commander_1.Command();
// 配置帮助信息
program.on('--help', () => {
    console.log("1233");
});
program
    .command('build <source>')
    .action((source) => {
    const standardPath = (0, path_1.resolve)(source);
    (0, natula_core_1.build)(standardPath);
});
program.parse(process.argv);
