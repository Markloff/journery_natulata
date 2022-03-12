import {
	CommandService,
	CommandsRegistry,
	ICommandService,
	InstantiationService,
	ServiceCollection,
	getSingletonServiceDescriptors
} from 'core';
import { IDependencyAnalyzeService } from './service/dependencyAnalyze';

CommandsRegistry.registerCommand('build.single-entry', (accessor, args) => {
	const [entry] = args;
	console.log('args', entry);
	const dependencyAnalyzeService = accessor.get(IDependencyAnalyzeService);
	dependencyAnalyzeService.execute(entry);
})



class Service {

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
	const instantiationService = new InstantiationService(serviceCollection);
	const commandService = new CommandService(instantiationService);
	return new Service(commandService);
}
