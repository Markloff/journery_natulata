"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Project = exports.ProjectType = void 0;
var ProjectType;
(function (ProjectType) {
    ProjectType["MicroFrontendClient"] = "MicroFrontendClient";
    ProjectType["GraphQLServer"] = "GraphQLServer";
    ProjectType["ReactComponentPackage"] = "ReactComponentPackage";
    ProjectType["JavascriptClientSDK"] = "JavascriptClientSDK";
    ProjectType["NodePackage"] = "NodePackage";
})(ProjectType = exports.ProjectType || (exports.ProjectType = {}));
class Project {
    constructor(path, name, type, depth) {
        this.path = path;
        this.name = name;
        this.type = type;
        this.depth = depth;
    }
    get id() {
        return this.path;
    }
}
exports.Project = Project;
