import { CommandService, ICommandService, IInstantiationService, InstantiationService, ServiceCollection } from 'core';


class Service {

	constructor(
		private readonly _instantiationService: IInstantiationService,
		private readonly _commandService: ICommandService
	) {
	}
}


export const createService = () => {
	const serviceCollection = new ServiceCollection();
	const instantiationService = new InstantiationService(serviceCollection);
	const commandService = new CommandService(instantiationService);
	return new Service(instantiationService, commandService);
}
