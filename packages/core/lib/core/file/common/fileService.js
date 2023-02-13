"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileService = exports.IFileService = void 0;
const instantiation_1 = require("../../../core/instantiation/common/instantiation");
const lifecycle_1 = require("../../../core/base/common/lifecycle");
exports.IFileService = (0, instantiation_1.createDecorator)('IFileService');
class FileService {
    createDictionary(path) {
        return (0, lifecycle_1.toDisposable)(() => this.removeDictionary());
    }
    removeDictionary() {
    }
}
exports.FileService = FileService;
