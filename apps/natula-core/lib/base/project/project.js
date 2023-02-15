"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProject = exports.getDefaultProject = exports.getDefaultProjectName = exports.Project = exports.ProjectType = void 0;
const node_path_1 = require("node:path");
var ProjectType;
(function (ProjectType) {
    ProjectType["MicroFrontendClient"] = "MicroFrontendClient";
    ProjectType["GraphQLServer"] = "GraphQLServer";
    ProjectType["ReactComponentPackage"] = "ReactComponentPackage";
    ProjectType["JavascriptClientSDK"] = "JavascriptClientSDK";
    ProjectType["NodePackage"] = "NodePackage";
})(ProjectType = exports.ProjectType || (exports.ProjectType = {}));
const getPathRelativeDepth = (root, path) => {
    const relativePath = (0, node_path_1.relative)(root, path);
    return relativePath.split('/').length - 1;
};
class Project {
    constructor(name, type, relativePath = '') {
        this.name = name;
        this.type = type;
        this.relativePath = relativePath;
        this.containerDir = '';
    }
    hook(containerDir, relativePath = '') {
        this.relativePath = this.relativePath || relativePath;
        this.containerDir = containerDir;
    }
    get hooked() {
        return Boolean(this.relativePath);
    }
    get id() {
        if (this.hooked) {
            return (0, node_path_1.resolve)(this.containerDir, this.relativePath);
        }
        else {
            return `${this.containerDir}_${this.name}_${this.type}`;
        }
    }
    get depth() {
        return this.relativePath.split('/').length;
    }
}
exports.Project = Project;
const DEFAULT_NAME = {
    [ProjectType.MicroFrontendClient]: 'airwallex-micro-frontend-client',
    [ProjectType.GraphQLServer]: 'airwallex-graphQL-federation-server',
    [ProjectType.NodePackage]: '@airwallex/node-package',
    [ProjectType.ReactComponentPackage]: '@airwallex/react-component',
    [ProjectType.JavascriptClientSDK]: '@airwallex/javascript-sdk'
};
const getDefaultProjectName = (type) => {
    return DEFAULT_NAME[type] || '';
};
exports.getDefaultProjectName = getDefaultProjectName;
const getDefaultProject = (type) => {
    return (0, exports.createProject)(DEFAULT_NAME[type], type);
};
exports.getDefaultProject = getDefaultProject;
const createProject = (name, type) => {
    return new Project(name, type);
};
exports.createProject = createProject;
