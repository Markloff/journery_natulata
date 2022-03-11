"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceCollection = void 0;
class ServiceCollection {
    constructor(...entries) {
        this._entries = new Map();
        for (let [id, service] of entries) {
            this.set(id, service);
        }
    }
    set(id, instanceOrDescriptor) {
        const result = this._entries.get(id);
        this._entries.set(id, instanceOrDescriptor);
        return result;
    }
    has(id) {
        return this._entries.has(id);
    }
    get(id) {
        return this._entries.get(id);
    }
}
exports.ServiceCollection = ServiceCollection;
