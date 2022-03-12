"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.build = void 0;
const service_1 = require("./service");
const service = (0, service_1.createService)();
const build = (entry) => {
    service.executeCommand('build.single-entry', entry);
};
exports.build = build;
