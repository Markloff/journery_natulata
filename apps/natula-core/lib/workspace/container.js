"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoRelationshipContainer = void 0;
const core_1 = require("core");
const project_1 = require("../base/project/project");
const glob = require("fast-glob");
const node_path_1 = require("node:path");
const fs_extra_1 = require("fs-extra");
const projectCollection_1 = require("../base/project/projectCollection");
const NOT_MONOREPO = 'NOT_MONOREPO';
const REACT = 'React';
const PACKAGE_JSON = 'package.json';
const VERSION_FILE = 'version.json';
const ROVER = '@apollo/rover';
var Utils;
(function (Utils) {
    Utils.identifyProjectType = (rootPath) => {
        const packageJson = require((0, node_path_1.resolve)(rootPath, PACKAGE_JSON));
        const configReactAsDevDependency = packageJson.devDependencies[REACT] || packageJson.peerDependencies[REACT];
        const configReactAsDependency = packageJson.dependencies[REACT] || packageJson.peerDependencies[REACT];
        const configRoverAsDependency = packageJson.dependencies[ROVER] || packageJson.devDependencies[ROVER];
        if (configReactAsDependency) {
            const withVersionFile = (0, fs_extra_1.pathExistsSync)((0, node_path_1.resolve)(rootPath, VERSION_FILE));
            return withVersionFile ? project_1.ProjectType.MicroFrontendClient : project_1.ProjectType.JavascriptClientSDK;
        }
        else if (configReactAsDevDependency) {
            return project_1.ProjectType.ReactComponentPackage;
        }
        else if (configRoverAsDependency) {
            return project_1.ProjectType.GraphQLServer;
        }
        else {
            return project_1.ProjectType.NodePackage;
        }
    };
})(Utils || (Utils = {}));
class NoRelationshipContainer {
    constructor(rootPath) {
        this.rootPath = rootPath;
        this.monorepo = NOT_MONOREPO;
        this.maxDepth = 1;
        this.projectCollection = new projectCollection_1.ProjectCollection(node => node.id);
        this.identifyProjects();
    }
    removeProject(projects) {
        throw new Error('Method not implemented.');
    }
    addProject(project) {
        this.identifyProjects();
        if (this.projectCollection.has(project)) {
            throw new Error(`Project type ${project.type} with name ${project.name} already existing`);
        }
        project.hook(this.rootPath);
        const node = this.projectCollection.lookupOrInsert(project);
        return (0, core_1.toDisposable)(() => this.projectCollection.remove(node));
    }
    identifyProjects() {
        const entries = glob.sync(`${this.rootPath}/**/${PACKAGE_JSON}`, { ignore: ['**/node_modules/**', '**/automation/**'] });
        if (entries.length === 0)
            return;
        for (let i = 0; i < entries.length; i++) {
            const project = this.identifyProjectByPackageJsonPath(entries[i]);
            this.projectCollection.lookupOrInsert(project);
        }
    }
    identifyProjectByPackageJsonPath(path) {
        const packageJson = require(path);
        const project = new project_1.Project(packageJson.name, Utils.identifyProjectType(packageJson), (0, node_path_1.dirname)((0, node_path_1.relative)(this.rootPath, path)));
        project.hook(this.rootPath);
        return project;
    }
    get projects() {
        const projectsSnapshot = [];
        for (const project of this.projectCollection) {
            projectsSnapshot.push(project);
        }
        return projectsSnapshot;
    }
}
exports.NoRelationshipContainer = NoRelationshipContainer;
