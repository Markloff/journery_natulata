"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSyncDescriptor = exports.SyncDescriptor = void 0;
class SyncDescriptor {
    constructor(ctor, staticArguments = [], supportDelayedInstantiation = false) {
        this.ctor = ctor;
        this.staticArguments = staticArguments;
        this.supportDelayedInstantiation = supportDelayedInstantiation;
    }
}
exports.SyncDescriptor = SyncDescriptor;
const createSyncDescriptor = (ctor, ...staticArguments) => {
    return new SyncDescriptor(ctor, staticArguments);
};
exports.createSyncDescriptor = createSyncDescriptor;
