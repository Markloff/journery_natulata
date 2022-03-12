"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IDependencyAnalyzeService = void 0;
const core_1 = require("core");
const node_fs_1 = require("node:fs");
const core_2 = require("@swc/core");
const Visitor_js_1 = require("@swc/core/Visitor.js");
exports.IDependencyAnalyzeService = (0, core_1.createDecorator)('IDependencyAnalyzeService');
class ImportVisitor extends Visitor_js_1.Visitor {
    visitImportDeclaration(node) {
        console.log(node.source);
        return super.visitImportDeclaration(node);
    }
    visitImportDefaultSpecifier(node) {
        console.log(node.span);
        return super.visitImportDefaultSpecifier(node);
    }
    visitImportSpecifiers(nodes) {
        console.log(nodes);
        return super.visitImportSpecifiers(nodes);
    }
    visitImportNamespaceSpecifier(node) {
        console.log(node);
        return super.visitImportNamespaceSpecifier(node);
    }
    visitNamedImportSpecifier(node) {
        console.log(node);
        return super.visitNamedImportSpecifier(node);
    }
    visitImportSpecifier(node) {
        console.log(node);
        return super.visitImportSpecifier(node);
    }
}
class DependencyAnalyzeService {
    execute(entry) {
        const resolvedEntry = (0, core_1.resolve)(entry);
        const source = (0, node_fs_1.readFileSync)(resolvedEntry).toString();
        (0, core_2.transformSync)(source, {
            plugin: (m) => {
                const importPlugin = new ImportVisitor();
                return importPlugin.visitProgram(m);
            }
        });
    }
}
(0, core_1.registerSingleton)(exports.IDependencyAnalyzeService, DependencyAnalyzeService);
