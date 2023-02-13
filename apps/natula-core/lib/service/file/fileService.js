"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileService = exports.IFileService = void 0;
const core_1 = require("core");
const fs_extra_1 = require("fs-extra");
exports.IFileService = (0, core_1.createDecorator)('IFileService');
class FileService {
    createDictionary(path) {
        try {
            (0, fs_extra_1.ensureDirSync)(path);
            return (0, core_1.toDisposable)(() => this.removeDictionary(path));
        }
        catch (err) {
            throw new Error(`Create dictionary ${path} failed`);
        }
    }
    removeDictionary(path) {
        try {
            (0, fs_extra_1.removeSync)(path);
        }
        catch (err) {
            throw new Error(`Remove dictionary ${path} failed`);
        }
    }
}
exports.FileService = FileService;
