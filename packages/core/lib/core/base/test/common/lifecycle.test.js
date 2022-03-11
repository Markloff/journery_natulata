"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mocha_1 = require("mocha");
const lifecycle_1 = require("../../../../core/base/common/lifecycle");
const assert_1 = __importDefault(require("assert"));
const event_1 = require("../../../../core/base/common/event");
const utils_1 = require("../../../../core/base/test/common/utils");
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
class Disposable {
    constructor() {
        this.isDisposed = false;
    }
    dispose() { this.isDisposed = true; }
}
(0, mocha_1.suite)('Lifecycle', () => {
    (0, mocha_1.test)('dispose single disposable', () => {
        const disposable = new Disposable();
        (0, assert_1.default)(!disposable.isDisposed);
        (0, lifecycle_1.dispose)(disposable);
        (0, assert_1.default)(disposable.isDisposed);
    });
    (0, mocha_1.test)('dispose disposable array', () => {
        const disposable = new Disposable();
        const disposable2 = new Disposable();
        (0, assert_1.default)(!disposable.isDisposed);
        (0, assert_1.default)(!disposable2.isDisposed);
        (0, lifecycle_1.dispose)([disposable, disposable2]);
        (0, assert_1.default)(disposable.isDisposed);
        (0, assert_1.default)(disposable2.isDisposed);
    });
    (0, mocha_1.test)('dispose disposables', () => {
        const disposable = new Disposable();
        const disposable2 = new Disposable();
        (0, assert_1.default)(!disposable.isDisposed);
        (0, assert_1.default)(!disposable2.isDisposed);
        (0, lifecycle_1.dispose)(disposable);
        (0, lifecycle_1.dispose)(disposable2);
        (0, assert_1.default)(disposable.isDisposed);
        (0, assert_1.default)(disposable2.isDisposed);
    });
    (0, mocha_1.test)('dispose array should dispose all if a child throws on dispose', () => {
        const disposedValues = new Set();
        let thrownError;
        try {
            (0, lifecycle_1.dispose)([
                (0, lifecycle_1.toDisposable)(() => { disposedValues.add(1); }),
                (0, lifecycle_1.toDisposable)(() => { throw new Error('I am error'); }),
                (0, lifecycle_1.toDisposable)(() => { disposedValues.add(3); }),
            ]);
        }
        catch (e) {
            thrownError = e;
        }
        assert_1.default.ok(disposedValues.has(1));
        assert_1.default.ok(disposedValues.has(3));
        assert_1.default.strictEqual(thrownError.message, 'I am error');
    });
    (0, mocha_1.test)('dispose array should rethrow composite error if multiple entries throw on dispose', () => {
        const disposedValues = new Set();
        let thrownError;
        try {
            (0, lifecycle_1.dispose)([
                (0, lifecycle_1.toDisposable)(() => { disposedValues.add(1); }),
                (0, lifecycle_1.toDisposable)(() => { throw new Error('I am error 1'); }),
                (0, lifecycle_1.toDisposable)(() => { throw new Error('I am error 2'); }),
                (0, lifecycle_1.toDisposable)(() => { disposedValues.add(4); }),
            ]);
        }
        catch (e) {
            thrownError = e;
        }
        assert_1.default.ok(disposedValues.has(1));
        assert_1.default.ok(disposedValues.has(4));
        assert_1.default.ok(thrownError instanceof lifecycle_1.MultiDisposeError);
        assert_1.default.strictEqual(thrownError.errors.length, 2);
        assert_1.default.strictEqual(thrownError.errors[0].message, 'I am error 1');
        assert_1.default.strictEqual(thrownError.errors[1].message, 'I am error 2');
    });
    (0, mocha_1.test)('Action bar has broken accessibility #100273', function () {
        let array = [{ dispose() { } }, { dispose() { } }];
        let array2 = (0, lifecycle_1.dispose)(array);
        assert_1.default.strictEqual(array.length, 2);
        assert_1.default.strictEqual(array2.length, 0);
        assert_1.default.ok(array !== array2);
        let set = new Set([{ dispose() { } }, { dispose() { } }]);
        let setValues = set.values();
        let setValues2 = (0, lifecycle_1.dispose)(setValues);
        assert_1.default.ok(setValues === setValues2);
    });
});
(0, mocha_1.suite)('DisposableStore', () => {
    (0, mocha_1.test)('dispose should call all child disposes even if a child throws on dispose', () => {
        const disposedValues = new Set();
        const store = new lifecycle_1.DisposableStore();
        store.add((0, lifecycle_1.toDisposable)(() => { disposedValues.add(1); }));
        store.add((0, lifecycle_1.toDisposable)(() => { throw new Error('I am error'); }));
        store.add((0, lifecycle_1.toDisposable)(() => { disposedValues.add(3); }));
        let thrownError;
        try {
            store.dispose();
        }
        catch (e) {
            thrownError = e;
        }
        assert_1.default.ok(disposedValues.has(1));
        assert_1.default.ok(disposedValues.has(3));
        assert_1.default.strictEqual(thrownError.message, 'I am error');
    });
    (0, mocha_1.test)('dispose should throw composite error if multiple children throw on dispose', () => {
        const disposedValues = new Set();
        const store = new lifecycle_1.DisposableStore();
        store.add((0, lifecycle_1.toDisposable)(() => { disposedValues.add(1); }));
        store.add((0, lifecycle_1.toDisposable)(() => { throw new Error('I am error 1'); }));
        store.add((0, lifecycle_1.toDisposable)(() => { throw new Error('I am error 2'); }));
        store.add((0, lifecycle_1.toDisposable)(() => { disposedValues.add(4); }));
        let thrownError;
        try {
            store.dispose();
        }
        catch (e) {
            thrownError = e;
        }
        assert_1.default.ok(disposedValues.has(1));
        assert_1.default.ok(disposedValues.has(4));
        assert_1.default.ok(thrownError instanceof lifecycle_1.MultiDisposeError);
        assert_1.default.strictEqual(thrownError.errors.length, 2);
        assert_1.default.strictEqual(thrownError.errors[0].message, 'I am error 1');
        assert_1.default.strictEqual(thrownError.errors[1].message, 'I am error 2');
    });
});
(0, mocha_1.suite)('Reference Collection', () => {
    class Collection extends lifecycle_1.ReferenceCollection {
        constructor() {
            super(...arguments);
            this._count = 0;
        }
        get count() { return this._count; }
        createReferencedObject(key) { this._count++; return key.length; }
        destroyReferencedObject(key, object) { this._count--; }
    }
    (0, mocha_1.test)('simple', () => {
        const collection = new Collection();
        const ref1 = collection.acquire('test');
        (0, assert_1.default)(ref1);
        assert_1.default.strictEqual(ref1.object, 4);
        assert_1.default.strictEqual(collection.count, 1);
        ref1.dispose();
        assert_1.default.strictEqual(collection.count, 0);
        const ref2 = collection.acquire('test');
        const ref3 = collection.acquire('test');
        assert_1.default.strictEqual(ref2.object, ref3.object);
        assert_1.default.strictEqual(collection.count, 1);
        const ref4 = collection.acquire('monkey');
        assert_1.default.strictEqual(ref4.object, 6);
        assert_1.default.strictEqual(collection.count, 2);
        ref2.dispose();
        assert_1.default.strictEqual(collection.count, 2);
        ref3.dispose();
        assert_1.default.strictEqual(collection.count, 1);
        ref4.dispose();
        assert_1.default.strictEqual(collection.count, 0);
    });
});
function assertThrows(fn, test) {
    try {
        fn();
        assert_1.default.fail('Expected function to throw, but it did not.');
    }
    catch (e) {
        assert_1.default.ok(test(e));
    }
}
(0, mocha_1.suite)('No Leakage Utilities', () => {
    (0, mocha_1.suite)('throwIfDisposablesAreLeaked', () => {
        (0, mocha_1.test)('throws if an event subscription is not cleaned up', () => {
            const eventEmitter = new event_1.Emitter();
            assertThrows(() => {
                (0, utils_1.throwIfDisposablesAreLeaked)(() => {
                    eventEmitter.event(() => {
                        // noop
                    });
                });
            }, e => e.message.indexOf('These disposables were not disposed') !== -1);
        });
        (0, mocha_1.test)('throws if a disposable is not disposed', () => {
            assertThrows(() => {
                (0, utils_1.throwIfDisposablesAreLeaked)(() => {
                    new lifecycle_1.DisposableStore();
                });
            }, e => e.message.indexOf('These disposables were not disposed') !== -1);
        });
        (0, mocha_1.test)('does not throw if all event subscriptions are cleaned up', () => {
            const eventEmitter = new event_1.Emitter();
            (0, utils_1.throwIfDisposablesAreLeaked)(() => {
                eventEmitter.event(() => {
                    // noop
                }).dispose();
            });
        });
        (0, mocha_1.test)('does not throw if all disposables are disposed', () => {
            // This disposable is reported before the test and not tracked.
            (0, lifecycle_1.toDisposable)(() => { });
            (0, utils_1.throwIfDisposablesAreLeaked)(() => {
                // This disposable is marked as singleton
                (0, lifecycle_1.markAsSingleton)((0, lifecycle_1.toDisposable)(() => { }));
                // These disposables are also marked as singleton
                const disposableStore = new lifecycle_1.DisposableStore();
                disposableStore.add((0, lifecycle_1.toDisposable)(() => { }));
                (0, lifecycle_1.markAsSingleton)(disposableStore);
                (0, lifecycle_1.toDisposable)(() => { }).dispose();
            });
        });
    });
    (0, mocha_1.suite)('ensureNoDisposablesAreLeakedInTest', () => {
        (0, utils_1.ensureNoDisposablesAreLeakedInTestSuite)();
        (0, mocha_1.test)('Basic Test', () => {
            (0, lifecycle_1.toDisposable)(() => { }).dispose();
        });
    });
});
