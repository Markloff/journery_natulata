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
exports.Workspace = void 0;
const core_1 = require("core");
const environment_1 = require("../service/environment/environment");
const templateService_1 = require("../service/template/templateService");
const container_1 = require("./container");
const fileService_1 = require("../service/file/fileService");
const project_1 = require("../base/project/project");
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
        return __awaiter(this, void 0, void 0, function* () {
            const { monorepo, withGraphQLServer, withMicroFrontendClient, rootPath } = this.environmentService;
            yield this.templateService.generateMetaTemplate();
            if (monorepo === null) {
                const container = new container_1.NoRelationshipContainer(rootPath);
                if (withMicroFrontendClient) {
                    container.addProject((0, project_1.getDefaultProject)(project_1.ProjectType.MicroFrontendClient));
                }
                if (withGraphQLServer) {
                    container.addProject((0, project_1.getDefaultProject)(project_1.ProjectType.GraphQLServer));
                }
                this._dispatchChange(container.projects);
            }
        });
    }
    _dispatchChange(projects) {
        for (const project of projects) {
            this.templateService.generateTemplate(project);
        }
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
