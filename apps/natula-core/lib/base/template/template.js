"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = exports.TomlFileConfigKeyMap = void 0;
const project_1 = require("../project/project");
const fs_extra_1 = require("fs-extra");
const lodash_1 = require("lodash");
const toml = require("toml");
exports.TomlFileConfigKeyMap = {
    'mfe_client': project_1.ProjectType.MicroFrontendClient,
    'graphql_server': project_1.ProjectType.GraphQLServer,
};
const parse = (path) => {
    const config = (0, lodash_1.mapKeys)(toml.parse((0, fs_extra_1.readFileSync)(path, 'utf-8')).generator.default, (_, key) => {
        var _a;
        return (_a = exports.TomlFileConfigKeyMap[key]) !== null && _a !== void 0 ? _a : key;
    });
    return config;
};
exports.parse = parse;
