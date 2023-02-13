"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoRelationshipContainer = void 0;
const core_1 = require("core");
const project_1 = require("../base/project/project");
const glob = require("fast-glob");
const node_path_1 = require("node:path");
const NOT_MONOREPO = 'NOT_MONOREPO';
var Utils;
(function (Utils) {
    Utils.getPathRelativeDepth = (root, path) => {
        const relativePath = (0, node_path_1.relative)(root, path);
        return relativePath.split('/').length - 1;
    };
    Utils.identifyProjectTypeByPackageJson = (packageJson) => {
        if (packageJson.de)
            ;
    };
})(Utils || (Utils = {}));
class NoRelationshipContainer {
    constructor(rootPath) {
        this.rootPath = rootPath;
        this.monorepo = NOT_MONOREPO;
        this.maxDepth = 1;
        this.projectStore = new core_1.Graph(node => node.id);
        this.identifyProjects();
    }
    removeProject(projects) {
        throw new Error('Method not implemented.');
    }
    addProject(project) {
        this.identifyProjects();
        if (this.projectStore.lookup(project)) {
            throw new Error(`Project type ${project.type} with name ${project.name} already existing`);
        }
        const node = this.projectStore.lookupOrInsertNode(project);
        return (0, core_1.toDisposable)(() => this.projectStore.removeNode(node.data));
    }
    identifyProjects() {
        const entries = glob.sync(`${this.rootPath}/**/package.json`, { ignore: ['**/node_modules/**', '**/automation/**'] });
        if (entries.length === 0)
            return;
        for (let i = 0; i < entries.length; i++) {
            const project = this.identifyProjectByPackageJsonPath(entries[i]);
        }
    }
    identifyProjectByPackageJsonPath(path) {
        const depth = Utils.getPathRelativeDepth(this.rootPath, path);
        const packageJson = require(path);
        return new project_1.Project(path, packageJson.name, Utils.identifyProjectTypeByPackageJson(packageJson), depth);
    }
}
exports.NoRelationshipContainer = NoRelationshipContainer;
