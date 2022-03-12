"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createService = void 0;
const core_1 = require("core");
const dependencyAnalyze_1 = require("./service/dependencyAnalyze");
core_1.CommandsRegistry.registerCommand('build.single-entry', (accessor, args) => {
    const [entry] = args;
    console.log('args', entry);
    const dependencyAnalyzeService = accessor.get(dependencyAnalyze_1.IDependencyAnalyzeService);
    dependencyAnalyzeService.execute(entry);
});
class Service {
    constructor(_commandService) {
        this._commandService = _commandService;
    }
    executeCommand(commandId, ...args) {
        return this._commandService.executeCommand(commandId, ...args);
    }
}
const createService = () => {
    const serviceCollection = new core_1.ServiceCollection();
    const singletonServices = (0, core_1.getSingletonServiceDescriptors)();
    for (const [identifier, descriptor] of singletonServices) {
        serviceCollection.set(identifier, descriptor);
    }
    const instantiationService = new core_1.InstantiationService(serviceCollection);
    const commandService = new core_1.CommandService(instantiationService);
    return new Service(commandService);
};
exports.createService = createService;
