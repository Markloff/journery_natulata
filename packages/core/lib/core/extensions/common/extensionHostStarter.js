"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ipcExtensionHostStarterChannelName = exports.IExtensionHostStarter = void 0;
const common_1 = require("../../../core/instantiation/common");
exports.IExtensionHostStarter = (0, common_1.createDecorator)('extensionHostStarter');
exports.ipcExtensionHostStarterChannelName = 'extensionHostStarter';
