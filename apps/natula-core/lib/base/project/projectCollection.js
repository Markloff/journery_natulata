"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectCollection = void 0;
const core_1 = require("core");
class ProjectCollection {
    constructor(_hasFn) {
        this._hasFn = _hasFn;
        this.nodes = new Map();
    }
    lookupOrInsert(project) {
        const key = this._hasFn(project);
        let node = this.nodes.get(key);
        if (!node) {
            node = new core_1.Node(project);
            this.nodes.set(key, node);
        }
        return node.data;
    }
    remove(project) {
        const key = this._hasFn(project);
        this.nodes.delete(key);
    }
    has(project) {
        const key = this._hasFn(project);
        return this.nodes.has(key);
    }
    isEmpty() {
        return this.nodes.size === 0;
    }
    *[Symbol.iterator]() {
        for (const [, node] of this.nodes) {
            yield node.data;
        }
    }
}
exports.ProjectCollection = ProjectCollection;
