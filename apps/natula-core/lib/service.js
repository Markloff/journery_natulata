"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createService = exports.Service = void 0;
const core_1 = require("core");
const node_path_1 = require("node:path");
const environment_1 = require("./service/environment/environment");
const workspace_1 = require("./workspace/workspace");
const templateService_1 = require("./service/template/templateService");
require("./service/file/fileService");
const fileService_1 = require("./service/file/fileService");
core_1.CommandsRegistry.registerCommand('init', (accessor, args) => __awaiter(void 0, void 0, void 0, function* () {
    const [config] = args;
    const instantiationService = accessor.get(core_1.IInstantiationService);
    const logService = accessor.get(core_1.ILogService);
    const environmentService = new environment_1.WorkspaceEnvironment(Object.assign(Object.assign({}, config), { rootPath: (0, node_path_1.resolve)(config.name) }));
    const templateService = new templateService_1.TemplateService(environmentService);
    const fileService = new fileService_1.FileService();
    const workspace = new workspace_1.Workspace(instantiationService, environmentService, templateService, fileService);
    try {
        workspace.init();
    }
    catch (err) {
        logService.error(`AFW init error: ${err.message}`);
    }
}));
class Service {
    constructor(_commandService) {
        this._commandService = _commandService;
    }
    executeCommand(commandId, ...args) {
        return this._commandService.executeCommand(commandId, ...args);
    }
}
exports.Service = Service;
const createService = () => {
    const serviceCollection = new core_1.ServiceCollection();
    const singletonServices = (0, core_1.getSingletonServiceDescriptors)();
    for (const [identifier, descriptor] of singletonServices) {
        serviceCollection.set(identifier, descriptor);
    }
    const logService = new core_1.LogService(new core_1.ConsoleMainLogger());
    serviceCollection.set(core_1.ILogService, logService);
    const instantiationService = new core_1.InstantiationService(serviceCollection);
    const commandService = new core_1.CommandService(instantiationService);
    return new Service(commandService);
};
exports.createService = createService;
