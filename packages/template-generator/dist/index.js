"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runHygen = void 0;
const node_path_1 = require("node:path");
const node_os_1 = require("node:os");
const hygen_1 = require("hygen");
const execa_1 = require("execa");
// const defaultTemplates = resolve(__dirname, '../templates');
const defaultTemplates = (0, node_path_1.resolve)((0, node_os_1.homedir)(), './.caa/template/templates');
const runHygen = (argv = []) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, hygen_1.runner)(argv, {
            templates: defaultTemplates,
            cwd: process.cwd(),
            logger: new hygen_1.Logger(console.log.bind(console)),
            createPrompter: () => require('enquirer'),
            exec: (action, body) => {
                const opts = body && body.length > 0 ? { input: body } : {};
                return (0, execa_1.command)(action, opts);
            },
            debug: !!process.env.DEBUG
        });
    }
    catch (err) {
        console.log('err', err);
    }
});
exports.runHygen = runHygen;
