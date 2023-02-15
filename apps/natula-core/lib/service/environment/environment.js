"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkspaceEnvironment = exports.IWorkspaceEnvironmentService = void 0;
const instantiation_1 = require("core/lib/core/instantiation/common/instantiation");
const node_path_1 = require("node:path");
exports.IWorkspaceEnvironmentService = (0, instantiation_1.createDecorator)('IWorkspaceEnvironmentService');
class WorkspaceEnvironment {
    constructor(options) {
        this.options = options;
        this.rootPath = options.rootPath;
        this.name = options.name;
        this.monorepo = options.monorepo;
        this.withGraphQLServer = Boolean(options.graphQL);
        this.withMicroFrontendClient = Boolean(options.microFrontendClient);
        this.generatorCollection = this.refineGeneratorConfig(options.generatorConfig);
        this.appHomeDir = options.appHomeDir;
    }
    refineGeneratorConfig(config) {
        const collection = new Map();
        return collection;
    }
    get templateDir() {
        return (0, node_path_1.resolve)(this.appHomeDir, './template/_templates');
    }
    get generatorConfigPath() {
        return (0, node_path_1.resolve)(this.appHomeDir, './template/config.toml');
    }
    lift() {
        return this;
    }
    get buildPayload() {
        return this.lift();
    }
    getGeneratorHelperPath(generator) {
        return (0, node_path_1.resolve)(this.templateDir, generator, '.helper.js');
    }
}
exports.WorkspaceEnvironment = WorkspaceEnvironment;
