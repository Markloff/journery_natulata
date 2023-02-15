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
exports.HygenGenerator = void 0;
const hygen_1 = require("hygen");
const execa_1 = require("execa");
class HygenGenerator {
    constructor(templates) {
        this.templates = templates;
    }
    execute(argv, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(options);
            const { templates } = this;
            const { locals = {}, helpers = {} } = options;
            yield (0, hygen_1.runner)(argv, {
                templates,
                cwd: process.cwd(),
                logger: new hygen_1.Logger(console.log.bind(console)),
                createPrompter: () => require('enquirer'),
                exec: (action, body) => {
                    const opts = body && body.length > 0 ? { input: body } : {};
                    return (0, execa_1.command)(action, opts);
                },
                helpers: Object.assign({}, helpers),
                localsDefaults: Object.assign({}, locals),
                debug: !!process.env.DEBUG
            });
        });
    }
}
exports.HygenGenerator = HygenGenerator;
