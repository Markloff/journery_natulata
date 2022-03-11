"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
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
exports.throwIfDisposablesAreLeakedAsync = exports.throwIfDisposablesAreLeaked = exports.ensureNoDisposablesAreLeakedInTestSuite = exports.assertThrowsAsync = exports.testRepeat = exports.suiteRepeat = exports.toResource = void 0;
const path_1 = require("../../../../core/base/common/path");
const uri_1 = require("../../../../core/base/common/uri");
const platform_1 = require("../../../../core/base/common/platform");
const lifecycle_1 = require("../../../../core/base/common/lifecycle");
const mocha_1 = require("mocha");
function toResource(path) {
    if (platform_1.isWindows) {
        return uri_1.URI.file((0, path_1.join)('C:\\', btoa(this.test.fullTitle()), path));
    }
    return uri_1.URI.file((0, path_1.join)('/', btoa(this.test.fullTitle()), path));
}
exports.toResource = toResource;
function suiteRepeat(n, description, callback) {
    for (let i = 0; i < n; i++) {
        (0, mocha_1.suite)(`${description} (iteration ${i})`, callback);
    }
}
exports.suiteRepeat = suiteRepeat;
function testRepeat(n, description, callback) {
    for (let i = 0; i < n; i++) {
        (0, mocha_1.test)(`${description} (iteration ${i})`, callback);
    }
}
exports.testRepeat = testRepeat;
function assertThrowsAsync(block, message = 'Missing expected exception') {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield block();
        }
        catch (_a) {
            return;
        }
        const err = message instanceof Error ? message : new Error(message);
        throw err;
    });
}
exports.assertThrowsAsync = assertThrowsAsync;
class DisposableTracker {
    constructor() {
        this.livingDisposables = new Map();
    }
    getDisposableData(d) {
        let val = this.livingDisposables.get(d);
        if (!val) {
            val = { parent: null, source: null, isSingleton: false };
            this.livingDisposables.set(d, val);
        }
        return val;
    }
    trackDisposable(d) {
        const data = this.getDisposableData(d);
        if (!data.source) {
            data.source = new Error().stack;
        }
    }
    setParent(child, parent) {
        const data = this.getDisposableData(child);
        data.parent = parent;
    }
    markAsDisposed(x) {
        this.livingDisposables.delete(x);
    }
    markAsSingleton(disposable) {
        this.getDisposableData(disposable).isSingleton = true;
    }
    getRootParent(data, cache) {
        const cacheValue = cache.get(data);
        if (cacheValue) {
            return cacheValue;
        }
        const result = data.parent ? this.getRootParent(this.getDisposableData(data.parent), cache) : data;
        cache.set(data, result);
        return result;
    }
    ensureNoLeakingDisposables() {
        const rootParentCache = new Map();
        const leaking = [...this.livingDisposables.values()]
            .filter(v => v.source !== null && !this.getRootParent(v, rootParentCache).isSingleton);
        if (leaking.length > 0) {
            const count = 10;
            const firstLeaking = leaking.slice(0, count);
            const remainingCount = leaking.length - count;
            const separator = '--------------------\n\n';
            let s = firstLeaking.map(l => l.source).join(separator);
            if (remainingCount > 0) {
                s += `${separator}+ ${remainingCount} more`;
            }
            throw new Error(`These disposables were not disposed:\n${s}`);
        }
    }
}
/**
 * Use this function to ensure that all disposables are cleaned up at the end of each test in the current suite.
 *
 * Use `markAsSingleton` if disposable singletons are created lazily that are allowed to outlive the test.
 * Make sure that the singleton properly registers all child disposables so that they are excluded too.
*/
function ensureNoDisposablesAreLeakedInTestSuite() {
    let tracker;
    (0, mocha_1.setup)(() => {
        tracker = new DisposableTracker();
        (0, lifecycle_1.setDisposableTracker)(tracker);
    });
    (0, mocha_1.teardown)(() => {
        (0, lifecycle_1.setDisposableTracker)(null);
        tracker.ensureNoLeakingDisposables();
    });
}
exports.ensureNoDisposablesAreLeakedInTestSuite = ensureNoDisposablesAreLeakedInTestSuite;
function throwIfDisposablesAreLeaked(body) {
    const tracker = new DisposableTracker();
    (0, lifecycle_1.setDisposableTracker)(tracker);
    body();
    (0, lifecycle_1.setDisposableTracker)(null);
    tracker.ensureNoLeakingDisposables();
}
exports.throwIfDisposablesAreLeaked = throwIfDisposablesAreLeaked;
function throwIfDisposablesAreLeakedAsync(body) {
    return __awaiter(this, void 0, void 0, function* () {
        const tracker = new DisposableTracker();
        (0, lifecycle_1.setDisposableTracker)(tracker);
        yield body();
        (0, lifecycle_1.setDisposableTracker)(null);
        tracker.ensureNoLeakingDisposables();
    });
}
exports.throwIfDisposablesAreLeakedAsync = throwIfDisposablesAreLeakedAsync;
