"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSingletonServiceDescriptors = exports.registerSingleton = void 0;
const descriptors_1 = require("./descriptors");
const _registry = [];
function registerSingleton(id, ctorDescriptor, supportsDelayedInstantiation) {
    if (!(ctorDescriptor instanceof descriptors_1.SyncDescriptor)) {
        ctorDescriptor = new descriptors_1.SyncDescriptor(ctorDescriptor, [], supportsDelayedInstantiation);
    }
    _registry.push([id, ctorDescriptor]);
}
exports.registerSingleton = registerSingleton;
function getSingletonServiceDescriptors() {
    return _registry;
}
exports.getSingletonServiceDescriptors = getSingletonServiceDescriptors;
