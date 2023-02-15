import {
	CommandService,
	CommandsRegistry,
	ICommandService,
	InstantiationService,
	ServiceCollection,
	getSingletonServiceDescriptors,
	IInstantiationService,
	ConsoleMainLogger,
	ILogService,
	LogService
} from 'core';
import { resolve } from 'node:path';

import { InitializeOptions } from './base/workspace/workspace';
import { WorkspaceEnvironment } from './service/environment/environment';
// import { runHygen } from 'template-generator';
import { Workspace } from './workspace/workspace';
import { TemplateService } from './service/template/templateService';
import './service/file/fileService';
import { FileService } from './service/file/fileService';

CommandsRegistry.registerCommand('init', async (accessor, args: [InitializeOptions]) => {
	const [config] = args;

	const instantiationService = accessor.get(IInstantiationService);
	const logService = accessor.get(ILogService);
	const environmentService = new WorkspaceEnvironment(config);
	const templateService = new TemplateService(environmentService);
	const fileService = new FileService();

	const workspace = new Workspace(instantiationService, environmentService, templateService, fileService);

	try {
		await workspace.init();
	} catch (err) {
		logService.error(`AFW init error: ${err.message}`);
	}
	// await runHygen(['init', 'self']);
});



export class Service {

	constructor(
		private readonly _commandService: ICommandService
	) {
	}

	executeCommand<T = any>(commandId: string, ...args: any[]): Promise<T | undefined> {
		return this._commandService.executeCommand(commandId, ...args);
	}

}


export const createService = () => {
	const serviceCollection = new ServiceCollection();
	const singletonServices = getSingletonServiceDescriptors();
	for (const [identifier, descriptor] of singletonServices) {
		serviceCollection.set(identifier, descriptor);
	}
	const logService = new LogService(new ConsoleMainLogger());
	serviceCollection.set(ILogService, logService);
	const instantiationService = new InstantiationService(serviceCollection);
	const commandService = new CommandService(instantiationService);
	return new Service(commandService);
}
