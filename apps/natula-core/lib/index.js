"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectType = exports.getDefaultProjectName = exports.application = void 0;
const service_1 = require("./service");
const project_1 = require("./base/project/project");
Object.defineProperty(exports, "getDefaultProjectName", { enumerable: true, get: function () { return project_1.getDefaultProjectName; } });
Object.defineProperty(exports, "ProjectType", { enumerable: true, get: function () { return project_1.ProjectType; } });
const application = (0, service_1.createService)();
exports.application = application;
