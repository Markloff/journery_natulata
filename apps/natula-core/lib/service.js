"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createService = void 0;
const core_1 = require("core");
class Service {
    constructor(_instantiationService, _commandService) {
        this._instantiationService = _instantiationService;
        this._commandService = _commandService;
    }
}
const createService = () => {
    const serviceCollection = new core_1.ServiceCollection();
    const instantiationService = new core_1.InstantiationService(serviceCollection);
    const commandService = new core_1.CommandService(instantiationService);
    return new Service(instantiationService, commandService);
};
exports.createService = createService;
