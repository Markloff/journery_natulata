"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Workspace = void 0;
const core_1 = require("core");
const environment_1 = require("../service/environment/environment");
const templateService_1 = require("../service/template/templateService");
const container_1 = require("./container");
const fileService_1 = require("../service/file/fileService");
let Workspace = class Workspace {
    constructor(instantiationService, environmentService, templateService, fileService) {
        this.instantiationService = instantiationService;
        this.environmentService = environmentService;
        this.templateService = templateService;
        this.fileService = fileService;
        this._onProjectChange = new core_1.Emitter();
        this.onProjectChange = this._onProjectChange.event;
    }
    init() {
        const { monorepo, withGraphQLServer, withMicroFrontendClient, rootPath, name } = this.environmentService;
        this.fileService.createDictionary(rootPath);
        if (monorepo === null) {
            const container = new container_1.NoRelationshipContainer(rootPath);
        }
    }
    _dispatchChange() {
    }
    _addProject(project) {
    }
    createProject() {
        return (0, core_1.toDisposable)(() => { });
    }
    listProject() {
        throw new Error('not implemented');
    }
    removeProject(project) {
        throw new Error('not implemented');
    }
};
Workspace = __decorate([
    __param(0, core_1.IInstantiationService),
    __param(1, environment_1.IWorkspaceEnvironmentService),
    __param(2, templateService_1.ITemplateService),
    __param(3, fileService_1.IFileService),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], Workspace);
exports.Workspace = Workspace;
class MonorepoWorkspace extends Workspace {
}
