import { resolve } from 'node:path';
import { homedir } from 'node:os';
import { runner, Logger } from 'hygen'
import { command } from 'execa';


// const defaultTemplates = resolve(__dirname, '../templates');
const defaultTemplates = resolve(homedir(), './.caa/template/templates');
export const runHygen = async (argv: string[] = []) => {
	try {
		await runner(argv, {
			templates: defaultTemplates,
			cwd: process.cwd(),
			logger: new Logger(console.log.bind(console)),
			createPrompter: () => require('enquirer'),
			exec: (action, body) => {
				const opts = body && body.length > 0 ? { input: body } : {};
				return command(action, opts)
			},
			debug: !!process.env.DEBUG
		})
	} catch (err) {
		console.log('err', err)
	}
}
