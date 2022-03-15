"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IDependencyAnalyzeService = void 0;
const core_1 = require("core");
const node_fs_1 = require("node:fs");
const node_path_1 = require("node:path");
const core_2 = require("@swc/core");
const Visitor_js_1 = require("@swc/core/Visitor.js");
const graph_1 = require("core/lib/core/instantiation/common/graph");
const module_1 = require("./module");
exports.IDependencyAnalyzeService = (0, core_1.createDecorator)('IDependencyAnalyzeService');
var Utils;
(function (Utils) {
    function resolvePath(path) {
        if ((0, node_fs_1.existsSync)(path)) {
            return path;
        }
        else {
            return '';
        }
    }
    function resolveModuleRelativePath(from, to) {
        console.log(isExternalModule(to), to);
        if (isExternalModule(to)) {
            return to;
        }
        const basePath = (0, node_path_1.join)((0, node_path_1.dirname)(from), to);
        const result = resolvePath(`${basePath}.js`)
            || resolvePath(`${basePath}.ts`)
            || resolvePath(`${basePath}/index.js`)
            || resolvePath(`${basePath}/index.ts`);
        if (result) {
            return result;
        }
        else {
            throw new Error(`找不到模块 ${to}`);
        }
    }
    Utils.resolveModuleRelativePath = resolveModuleRelativePath;
    function isExternalModule(path) {
        return path.startsWith("node:") || (!(0, node_path_1.isAbsolute)(path) && !path.startsWith('.'));
    }
    Utils.isExternalModule = isExternalModule;
})(Utils || (Utils = {}));
class ImportVisitor extends Visitor_js_1.Visitor {
    constructor(_id) {
        super();
        this._id = _id;
        this._onVisitImportDeclaration = new core_1.Emitter();
        this.onVisitImportDeclaration = this._onVisitImportDeclaration.event;
    }
    visitImportDeclaration(node) {
        this._onVisitImportDeclaration.fire([this._id, node.source.value]);
        return super.visitImportDeclaration(node);
    }
}
class ModuleCollection {
    constructor() {
        this._modules = new Map();
    }
    lookupOrInsert(path) {
        if (!this._modules.has(path)) {
            return this.insert(path);
        }
        return this._modules.get(path);
    }
    insert(path) {
        const module = new module_1.Module(path, Utils.isExternalModule(path));
        this._modules.set(path, module);
        return module;
    }
}
class DependencyAnalyzeService {
    constructor() {
        this._tasks = new core_1.LinkedList();
        this._graph = new graph_1.Graph((module) => module.id);
        this._modules = new ModuleCollection();
        this._resolvedModules = new Set();
    }
    execute(entry) {
        const absoluteEntry = (0, node_path_1.resolve)(entry);
        const entryModule = this._modules.insert(absoluteEntry);
        this._tasks.push(entryModule);
        while (this._tasks.size > 0) {
            const module = this._tasks.pop();
            if (!module.external) {
                const source = (0, node_fs_1.readFileSync)(module.id).toString();
                const extName = (0, node_path_1.extname)(module.id);
                let syntax = 'ecmascript';
                if (extName === '.ts' || extName === '.tsx') {
                    syntax = 'typescript';
                }
                const programModule = (0, core_2.parseSync)(source, {
                    syntax,
                    jsx: extName === '.jsx',
                    tsx: extName === '.tsx',
                    decorators: true,
                    exportDefaultFrom: true,
                    decoratorsBeforeExport: true,
                });
                programModule.body.forEach(item => {
                    if (item.type === 'ImportDeclaration') {
                        this._insertEdge(module.id, item.source.value);
                    }
                    if (item.type === 'ExportAllDeclaration') {
                        this._insertEdge(module.id, item.source.value);
                    }
                });
            }
        }
    }
    _insertEdge(from, to) {
        const resolvedFromPath = (0, node_path_1.resolve)(from);
        const resolvedToPath = Utils.resolveModuleRelativePath(resolvedFromPath, to);
        const fromNode = this._modules.lookupOrInsert(resolvedFromPath);
        const toNode = this._modules.lookupOrInsert(resolvedToPath);
        this._graph.insertEdge(fromNode, toNode);
        if (!this._resolvedModules.has(resolvedToPath)) {
            this._resolvedModules.add(resolvedToPath);
            this._tasks.push(toNode);
        }
    }
}
(0, core_1.registerSingleton)(exports.IDependencyAnalyzeService, DependencyAnalyzeService);
