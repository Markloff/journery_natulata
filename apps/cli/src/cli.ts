#! /usr/bin/env node
import { Command } from 'commander'
import { resolve } from 'path';
import { build } from 'natula-core';

const program = new Command()

// 配置帮助信息
program.on('--help', () => {
	console.log("1233")
})
program
	.command('build <source>')
	.action((source: string) => {
		const standardPath = resolve(source);
		build(standardPath)
	})
program.parse(process.argv)

