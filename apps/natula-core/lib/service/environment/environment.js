"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkspaceEnvironment = exports.IWorkspaceEnvironmentService = void 0;
const instantiation_1 = require("core/lib/core/instantiation/common/instantiation");
exports.IWorkspaceEnvironmentService = (0, instantiation_1.createDecorator)('IWorkspaceEnvironmentService');
class Generator {
}
class WorkspaceEnvironment {
    constructor(options) {
        this.rootPath = options.rootPath;
        this.name = options.name;
        this.monorepo = options.monorepo;
        this.withGraphQLServer = options.withGraphQLServer;
        this.withMicroFrontendClient = options.withMicroFrontendClient;
        this.generatorCollection = this.refineGeneratorConfig(options.generatorConfig);
    }
    refineGeneratorConfig(config) {
        return new Map();
    }
}
exports.WorkspaceEnvironment = WorkspaceEnvironment;
