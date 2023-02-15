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
exports.TemplateService = exports.ITemplateService = void 0;
const core_1 = require("core");
const environment_1 = require("../environment/environment");
const generator_1 = require("./generator");
const fs_extra_1 = require("fs-extra");
const node_path_1 = require("node:path");
const template_1 = require("../../base/template/template");
exports.ITemplateService = (0, core_1.createDecorator)('ITemplateService');
let TemplateService = class TemplateService {
    constructor(environmentService) {
        this.environmentService = environmentService;
        this.generator = new generator_1.HygenGenerator((0, node_path_1.resolve)(this.environmentService.templateDir));
    }
    generateMetaTemplate() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    generateTemplate(project) {
        return __awaiter(this, void 0, void 0, function* () {
            const generator = this.getGeneratorFor(project.type);
            const helpers = this.getGeneratorHelpers(generator);
            yield this.generator.execute([generator, 'new', project.name], {
                locals: this.environmentService.buildPayload,
                helpers,
            });
        });
    }
    getGeneratorHelpers(generator) {
        const helperPath = this.environmentService.getGeneratorHelperPath(generator);
        if ((0, fs_extra_1.pathExistsSync)(helperPath)) {
            return require(helperPath).helpers;
        }
        return {};
    }
    getGeneratorFor(type) {
        return this.getGeneratorConfig()[type];
    }
    getGeneratorConfig() {
        return (0, template_1.parse)(this.environmentService.generatorConfigPath);
    }
};
__decorate([
    core_1.memoize,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TemplateService.prototype, "getGeneratorConfig", null);
TemplateService = __decorate([
    __param(0, environment_1.IWorkspaceEnvironmentService),
    __metadata("design:paramtypes", [Object])
], TemplateService);
exports.TemplateService = TemplateService;
(0, core_1.registerSingleton)(exports.ITemplateService, TemplateService);
