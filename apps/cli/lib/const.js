"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_APP_HOME = void 0;
const node_path_1 = require("node:path");
const os_1 = require("os");
const CAA_DIR = '.caa';
const DEFAULT_APP_HOME = () => (0, node_path_1.resolve)((0, os_1.homedir)(), CAA_DIR);
exports.DEFAULT_APP_HOME = DEFAULT_APP_HOME;
