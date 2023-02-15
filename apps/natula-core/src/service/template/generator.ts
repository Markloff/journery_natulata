import { runner, Logger } from 'hygen';
import { command } from 'execa';

interface Options {
	locals?: Record<string, any>;
	helpers?: any;
}

export class HygenGenerator {
	constructor(private readonly templates: string) { }

	async execute(argv: string[], options: Options = {}) {
		console.log(options)
		const { templates } = this;
		const { locals = {}, helpers = {} } = options;
		await runner(argv, {
			templates,
			cwd: process.cwd(),
			logger: new Logger(console.log.bind(console)),
			createPrompter: () => require('enquirer'),
			exec: (action, body) => {
				const opts = body && body.length > 0 ? { input: body } : {};
				return command(action, opts)
			},
			helpers: {
				...helpers,
			},
			localsDefaults: {
				...locals
			},
			debug: !!process.env.DEBUG
		})
	}
}
