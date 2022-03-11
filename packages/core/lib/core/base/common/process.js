"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.nextTick = exports.platform = exports.env = exports.cwd = void 0;
const platform_1 = require("./platform");
let safeProcess;
// Native sandbox environment
if (typeof platform_1.globals.vscode !== 'undefined' && typeof platform_1.globals.vscode.process !== 'undefined') {
    const sandboxProcess = platform_1.globals.vscode.process;
    safeProcess = {
        get platform() { return sandboxProcess.platform; },
        get env() { return sandboxProcess.env; },
        cwd() { return sandboxProcess.cwd(); },
        nextTick(callback) { return (0, platform_1.setImmediate)(callback); }
    };
}
// Native node.js environment
else if (typeof process !== 'undefined') {
    safeProcess = {
        get platform() { return process.platform; },
        get env() { return process.env; },
        cwd() { return process.env['VSCODE_CWD'] || process.cwd(); },
        nextTick(callback) { return process.nextTick(callback); }
    };
}
// Web environment
else {
    safeProcess = {
        // Supported
        get platform() { return platform_1.isWindows ? 'win32' : platform_1.isMacintosh ? 'darwin' : 'linux'; },
        nextTick(callback) { return (0, platform_1.setImmediate)(callback); },
        // Unsupported
        get env() { return {}; },
        cwd() { return '/'; }
    };
}
/**
 * Provides safe access to the `cwd` property in node.js, sandboxed or web
 * environments.
 *
 * Note: in web, this property is hardcoded to be `/`.
 */
exports.cwd = safeProcess.cwd;
/**
 * Provides safe access to the `env` property in node.js, sandboxed or web
 * environments.
 *
 * Note: in web, this property is hardcoded to be `{}`.
 */
exports.env = safeProcess.env;
/**
 * Provides safe access to the `platform` property in node.js, sandboxed or web
 * environments.
 */
exports.platform = safeProcess.platform;
/**
 * Provides safe access to the `nextTick` method in node.js, sandboxed or web
 * environments.
 */
exports.nextTick = safeProcess.nextTick;
