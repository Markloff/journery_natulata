"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
const mocha_1 = require("mocha");
const assert_1 = __importDefault(require("assert"));
const event_1 = require("../../../../core/base/common/event");
const lifecycle_1 = require("../../../../core/base/common/lifecycle");
const errors_1 = require("../../../../core/base/common/errors");
const async_1 = require("../../../../core/base/common/async");
const cancellation_1 = require("../../../../core/base/common/cancellation");
var Samples;
(function (Samples) {
    class EventCounter {
        constructor() {
            this.count = 0;
        }
        reset() {
            this.count = 0;
        }
        onEvent() {
            this.count += 1;
        }
    }
    Samples.EventCounter = EventCounter;
    class Document3 {
        constructor() {
            this._onDidChange = new event_1.Emitter();
            this.onDidChange = this._onDidChange.event;
        }
        setText(value) {
            //...
            this._onDidChange.fire(value);
        }
    }
    Samples.Document3 = Document3;
})(Samples || (Samples = {}));
(0, mocha_1.suite)('Event', function () {
    const counter = new Samples.EventCounter();
    (0, mocha_1.setup)(() => counter.reset());
    (0, mocha_1.test)('Emitter plain', function () {
        let doc = new Samples.Document3();
        document.createElement('div').onclick = function () { };
        let subscription = doc.onDidChange(counter.onEvent, counter);
        doc.setText('far');
        doc.setText('boo');
        // unhook listener
        subscription.dispose();
        doc.setText('boo');
        assert_1.default.strictEqual(counter.count, 2);
    });
    (0, mocha_1.test)('Emitter, bucket', function () {
        let bucket = [];
        let doc = new Samples.Document3();
        let subscription = doc.onDidChange(counter.onEvent, counter, bucket);
        doc.setText('far');
        doc.setText('boo');
        // unhook listener
        while (bucket.length) {
            bucket.pop().dispose();
        }
        doc.setText('boo');
        // noop
        subscription.dispose();
        doc.setText('boo');
        assert_1.default.strictEqual(counter.count, 2);
    });
    (0, mocha_1.test)('Emitter, store', function () {
        let bucket = new lifecycle_1.DisposableStore();
        let doc = new Samples.Document3();
        let subscription = doc.onDidChange(counter.onEvent, counter, bucket);
        doc.setText('far');
        doc.setText('boo');
        // unhook listener
        bucket.clear();
        doc.setText('boo');
        // noop
        subscription.dispose();
        doc.setText('boo');
        assert_1.default.strictEqual(counter.count, 2);
    });
    (0, mocha_1.test)('onFirstAdd|onLastRemove', () => {
        let firstCount = 0;
        let lastCount = 0;
        let a = new event_1.Emitter({
            onFirstListenerAdd() { firstCount += 1; },
            onLastListenerRemove() { lastCount += 1; }
        });
        assert_1.default.strictEqual(firstCount, 0);
        assert_1.default.strictEqual(lastCount, 0);
        let subscription = a.event(function () { });
        assert_1.default.strictEqual(firstCount, 1);
        assert_1.default.strictEqual(lastCount, 0);
        subscription.dispose();
        assert_1.default.strictEqual(firstCount, 1);
        assert_1.default.strictEqual(lastCount, 1);
        subscription = a.event(function () { });
        assert_1.default.strictEqual(firstCount, 2);
        assert_1.default.strictEqual(lastCount, 1);
    });
    (0, mocha_1.test)('throwingListener', () => {
        const origErrorHandler = errors_1.errorHandler.getUnexpectedErrorHandler();
        (0, errors_1.setUnexpectedErrorHandler)(() => null);
        try {
            let a = new event_1.Emitter();
            let hit = false;
            a.event(function () {
                // eslint-disable-next-line no-throw-literal
                throw 9;
            });
            a.event(function () {
                hit = true;
            });
            a.fire(undefined);
            assert_1.default.strictEqual(hit, true);
        }
        finally {
            (0, errors_1.setUnexpectedErrorHandler)(origErrorHandler);
        }
    });
    (0, mocha_1.test)('reusing event function and context', function () {
        let counter = 0;
        function listener() {
            counter += 1;
        }
        const context = {};
        let emitter = new event_1.Emitter();
        let reg1 = emitter.event(listener, context);
        let reg2 = emitter.event(listener, context);
        emitter.fire(undefined);
        assert_1.default.strictEqual(counter, 2);
        reg1.dispose();
        emitter.fire(undefined);
        assert_1.default.strictEqual(counter, 3);
        reg2.dispose();
        emitter.fire(undefined);
        assert_1.default.strictEqual(counter, 3);
    });
    (0, mocha_1.test)('Debounce Event', function (done) {
        let doc = new Samples.Document3();
        let onDocDidChange = event_1.Event.debounce(doc.onDidChange, (prev, cur) => {
            if (!prev) {
                prev = [cur];
            }
            else if (prev.indexOf(cur) < 0) {
                prev.push(cur);
            }
            return prev;
        }, 10);
        let count = 0;
        onDocDidChange(keys => {
            count++;
            assert_1.default.ok(keys, 'was not expecting keys.');
            if (count === 1) {
                doc.setText('4');
                assert_1.default.deepStrictEqual(keys, ['1', '2', '3']);
            }
            else if (count === 2) {
                assert_1.default.deepStrictEqual(keys, ['4']);
                done();
            }
        });
        doc.setText('1');
        doc.setText('2');
        doc.setText('3');
    });
    (0, mocha_1.test)('Debounce Event - leading', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const emitter = new event_1.Emitter();
            let debounced = event_1.Event.debounce(emitter.event, (l, e) => e, 0, /*leading=*/ true);
            let calls = 0;
            debounced(() => {
                calls++;
            });
            // If the source event is fired once, the debounced (on the leading edge) event should be fired only once
            emitter.fire();
            yield (0, async_1.timeout)(1);
            assert_1.default.strictEqual(calls, 1);
        });
    });
    (0, mocha_1.test)('Debounce Event - leading', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const emitter = new event_1.Emitter();
            let debounced = event_1.Event.debounce(emitter.event, (l, e) => e, 0, /*leading=*/ true);
            let calls = 0;
            debounced(() => {
                calls++;
            });
            // If the source event is fired multiple times, the debounced (on the leading edge) event should be fired twice
            emitter.fire();
            emitter.fire();
            emitter.fire();
            yield (0, async_1.timeout)(1);
            assert_1.default.strictEqual(calls, 2);
        });
    });
    (0, mocha_1.test)('Debounce Event - leading reset', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const emitter = new event_1.Emitter();
            let debounced = event_1.Event.debounce(emitter.event, (l, e) => l ? l + 1 : 1, 0, /*leading=*/ true);
            let calls = [];
            debounced((e) => calls.push(e));
            emitter.fire(1);
            emitter.fire(1);
            yield (0, async_1.timeout)(1);
            assert_1.default.deepStrictEqual(calls, [1, 1]);
        });
    });
    (0, mocha_1.test)('DebounceEmitter', function () {
        return __awaiter(this, void 0, void 0, function* () {
            let callCount = 0;
            let sum = 0;
            const emitter = new event_1.DebounceEmitter({
                merge: arr => {
                    callCount += 1;
                    return arr.reduce((p, c) => p + c);
                }
            });
            emitter.event(e => { sum = e; });
            const p = event_1.Event.toPromise(emitter.event);
            emitter.fire(1);
            emitter.fire(2);
            yield p;
            assert_1.default.strictEqual(callCount, 1);
            assert_1.default.strictEqual(sum, 3);
        });
    });
    (0, mocha_1.test)('Microtask Emitter', (done) => {
        let count = 0;
        assert_1.default.strictEqual(count, 0);
        const emitter = new event_1.MicrotaskEmitter();
        const listener = emitter.event(() => {
            count++;
        });
        emitter.fire();
        assert_1.default.strictEqual(count, 0);
        emitter.fire();
        assert_1.default.strictEqual(count, 0);
        setTimeout(() => {
            assert_1.default.strictEqual(count, 3);
            done();
        }, 0);
        queueMicrotask(() => {
            assert_1.default.strictEqual(count, 2);
            count++;
            listener.dispose();
        });
    });
    (0, mocha_1.test)('Emitter - In Order Delivery', function () {
        const a = new event_1.Emitter();
        const listener2Events = [];
        a.event(function listener1(event) {
            if (event === 'e1') {
                a.fire('e2');
                // assert that all events are delivered at this point
                assert_1.default.deepStrictEqual(listener2Events, ['e1', 'e2']);
            }
        });
        a.event(function listener2(event) {
            listener2Events.push(event);
        });
        a.fire('e1');
        // assert that all events are delivered in order
        assert_1.default.deepStrictEqual(listener2Events, ['e1', 'e2']);
    });
});
(0, mocha_1.suite)('AsyncEmitter', function () {
    (0, mocha_1.test)('event has waitUntil-function', function () {
        return __awaiter(this, void 0, void 0, function* () {
            let emitter = new event_1.AsyncEmitter();
            emitter.event(e => {
                assert_1.default.strictEqual(e.foo, true);
                assert_1.default.strictEqual(e.bar, 1);
                assert_1.default.strictEqual(typeof e.waitUntil, 'function');
            });
            emitter.fireAsync({ foo: true, bar: 1, }, cancellation_1.CancellationToken.None);
            emitter.dispose();
        });
    });
    (0, mocha_1.test)('sequential delivery', function () {
        return __awaiter(this, void 0, void 0, function* () {
            let globalState = 0;
            let emitter = new event_1.AsyncEmitter();
            emitter.event(e => {
                e.waitUntil((0, async_1.timeout)(10).then(_ => {
                    assert_1.default.strictEqual(globalState, 0);
                    globalState += 1;
                }));
            });
            emitter.event(e => {
                e.waitUntil((0, async_1.timeout)(1).then(_ => {
                    assert_1.default.strictEqual(globalState, 1);
                    globalState += 1;
                }));
            });
            yield emitter.fireAsync({ foo: true }, cancellation_1.CancellationToken.None);
            assert_1.default.strictEqual(globalState, 2);
        });
    });
    (0, mocha_1.test)('sequential, in-order delivery', function () {
        return __awaiter(this, void 0, void 0, function* () {
            let events = [];
            let done = false;
            let emitter = new event_1.AsyncEmitter();
            // e1
            emitter.event(e => {
                e.waitUntil((0, async_1.timeout)(10).then((_) => __awaiter(this, void 0, void 0, function* () {
                    if (e.foo === 1) {
                        yield emitter.fireAsync({ foo: 2 }, cancellation_1.CancellationToken.None);
                        assert_1.default.deepStrictEqual(events, [1, 2]);
                        done = true;
                    }
                })));
            });
            // e2
            emitter.event(e => {
                events.push(e.foo);
                e.waitUntil((0, async_1.timeout)(7));
            });
            yield emitter.fireAsync({ foo: 1 }, cancellation_1.CancellationToken.None);
            assert_1.default.ok(done);
        });
    });
    (0, mocha_1.test)('catch errors', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const origErrorHandler = errors_1.errorHandler.getUnexpectedErrorHandler();
            (0, errors_1.setUnexpectedErrorHandler)(() => null);
            let globalState = 0;
            let emitter = new event_1.AsyncEmitter();
            emitter.event(e => {
                globalState += 1;
                e.waitUntil(new Promise((_r, reject) => reject(new Error())));
            });
            emitter.event(e => {
                globalState += 1;
                e.waitUntil((0, async_1.timeout)(10));
                e.waitUntil((0, async_1.timeout)(20).then(() => globalState++)); // multiple `waitUntil` are supported and awaited on
            });
            yield emitter.fireAsync({ foo: true }, cancellation_1.CancellationToken.None).then(() => {
                assert_1.default.strictEqual(globalState, 3);
            }).catch(e => {
                console.log(e);
                assert_1.default.ok(false);
            });
            (0, errors_1.setUnexpectedErrorHandler)(origErrorHandler);
        });
    });
});
(0, mocha_1.suite)('PausableEmitter', function () {
    (0, mocha_1.test)('basic', function () {
        const data = [];
        const emitter = new event_1.PauseableEmitter();
        emitter.event(e => data.push(e));
        emitter.fire(1);
        emitter.fire(2);
        assert_1.default.deepStrictEqual(data, [1, 2]);
    });
    (0, mocha_1.test)('pause/resume - no merge', function () {
        const data = [];
        const emitter = new event_1.PauseableEmitter();
        emitter.event(e => data.push(e));
        emitter.fire(1);
        emitter.fire(2);
        assert_1.default.deepStrictEqual(data, [1, 2]);
        emitter.pause();
        emitter.fire(3);
        emitter.fire(4);
        assert_1.default.deepStrictEqual(data, [1, 2]);
        emitter.resume();
        assert_1.default.deepStrictEqual(data, [1, 2, 3, 4]);
        emitter.fire(5);
        assert_1.default.deepStrictEqual(data, [1, 2, 3, 4, 5]);
    });
    (0, mocha_1.test)('pause/resume - merge', function () {
        const data = [];
        const emitter = new event_1.PauseableEmitter({ merge: (a) => a.reduce((p, c) => p + c, 0) });
        emitter.event(e => data.push(e));
        emitter.fire(1);
        emitter.fire(2);
        assert_1.default.deepStrictEqual(data, [1, 2]);
        emitter.pause();
        emitter.fire(3);
        emitter.fire(4);
        assert_1.default.deepStrictEqual(data, [1, 2]);
        emitter.resume();
        assert_1.default.deepStrictEqual(data, [1, 2, 7]);
        emitter.fire(5);
        assert_1.default.deepStrictEqual(data, [1, 2, 7, 5]);
    });
    (0, mocha_1.test)('double pause/resume', function () {
        const data = [];
        const emitter = new event_1.PauseableEmitter();
        emitter.event(e => data.push(e));
        emitter.fire(1);
        emitter.fire(2);
        assert_1.default.deepStrictEqual(data, [1, 2]);
        emitter.pause();
        emitter.pause();
        emitter.fire(3);
        emitter.fire(4);
        assert_1.default.deepStrictEqual(data, [1, 2]);
        emitter.resume();
        assert_1.default.deepStrictEqual(data, [1, 2]);
        emitter.resume();
        assert_1.default.deepStrictEqual(data, [1, 2, 3, 4]);
        emitter.resume();
        assert_1.default.deepStrictEqual(data, [1, 2, 3, 4]);
    });
    (0, mocha_1.test)('resume, no pause', function () {
        const data = [];
        const emitter = new event_1.PauseableEmitter();
        emitter.event(e => data.push(e));
        emitter.fire(1);
        emitter.fire(2);
        assert_1.default.deepStrictEqual(data, [1, 2]);
        emitter.resume();
        emitter.fire(3);
        assert_1.default.deepStrictEqual(data, [1, 2, 3]);
    });
    (0, mocha_1.test)('nested pause', function () {
        const data = [];
        const emitter = new event_1.PauseableEmitter();
        let once = true;
        emitter.event(e => {
            data.push(e);
            if (once) {
                emitter.pause();
                once = false;
            }
        });
        emitter.event(e => {
            data.push(e);
        });
        emitter.pause();
        emitter.fire(1);
        emitter.fire(2);
        assert_1.default.deepStrictEqual(data, []);
        emitter.resume();
        assert_1.default.deepStrictEqual(data, [1, 1]); // paused after first event
        emitter.resume();
        assert_1.default.deepStrictEqual(data, [1, 1, 2, 2]); // remaing event delivered
        emitter.fire(3);
        assert_1.default.deepStrictEqual(data, [1, 1, 2, 2, 3, 3]);
    });
});
(0, mocha_1.suite)('Event utils', () => {
    (0, mocha_1.suite)('EventBufferer', () => {
        (0, mocha_1.test)('should not buffer when not wrapped', () => {
            const bufferer = new event_1.EventBufferer();
            const counter = new Samples.EventCounter();
            const emitter = new event_1.Emitter();
            const event = bufferer.wrapEvent(emitter.event);
            const listener = event(counter.onEvent, counter);
            assert_1.default.strictEqual(counter.count, 0);
            emitter.fire();
            assert_1.default.strictEqual(counter.count, 1);
            emitter.fire();
            assert_1.default.strictEqual(counter.count, 2);
            emitter.fire();
            assert_1.default.strictEqual(counter.count, 3);
            listener.dispose();
        });
        (0, mocha_1.test)('should buffer when wrapped', () => {
            const bufferer = new event_1.EventBufferer();
            const counter = new Samples.EventCounter();
            const emitter = new event_1.Emitter();
            const event = bufferer.wrapEvent(emitter.event);
            const listener = event(counter.onEvent, counter);
            assert_1.default.strictEqual(counter.count, 0);
            emitter.fire();
            assert_1.default.strictEqual(counter.count, 1);
            bufferer.bufferEvents(() => {
                emitter.fire();
                assert_1.default.strictEqual(counter.count, 1);
                emitter.fire();
                assert_1.default.strictEqual(counter.count, 1);
            });
            assert_1.default.strictEqual(counter.count, 3);
            emitter.fire();
            assert_1.default.strictEqual(counter.count, 4);
            listener.dispose();
        });
        (0, mocha_1.test)('once', () => {
            const emitter = new event_1.Emitter();
            let counter1 = 0, counter2 = 0, counter3 = 0;
            const listener1 = emitter.event(() => counter1++);
            const listener2 = event_1.Event.once(emitter.event)(() => counter2++);
            const listener3 = event_1.Event.once(emitter.event)(() => counter3++);
            assert_1.default.strictEqual(counter1, 0);
            assert_1.default.strictEqual(counter2, 0);
            assert_1.default.strictEqual(counter3, 0);
            listener3.dispose();
            emitter.fire();
            assert_1.default.strictEqual(counter1, 1);
            assert_1.default.strictEqual(counter2, 1);
            assert_1.default.strictEqual(counter3, 0);
            emitter.fire();
            assert_1.default.strictEqual(counter1, 2);
            assert_1.default.strictEqual(counter2, 1);
            assert_1.default.strictEqual(counter3, 0);
            listener1.dispose();
            listener2.dispose();
        });
    });
    (0, mocha_1.suite)('buffer', () => {
        (0, mocha_1.test)('should buffer events', () => {
            const result = [];
            const emitter = new event_1.Emitter();
            const event = emitter.event;
            const bufferedEvent = event_1.Event.buffer(event);
            emitter.fire(1);
            emitter.fire(2);
            emitter.fire(3);
            assert_1.default.deepStrictEqual(result, []);
            const listener = bufferedEvent(num => result.push(num));
            assert_1.default.deepStrictEqual(result, [1, 2, 3]);
            emitter.fire(4);
            assert_1.default.deepStrictEqual(result, [1, 2, 3, 4]);
            listener.dispose();
            emitter.fire(5);
            assert_1.default.deepStrictEqual(result, [1, 2, 3, 4]);
        });
        (0, mocha_1.test)('should buffer events on next tick', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = [];
            const emitter = new event_1.Emitter();
            const event = emitter.event;
            const bufferedEvent = event_1.Event.buffer(event, true);
            emitter.fire(1);
            emitter.fire(2);
            emitter.fire(3);
            assert_1.default.deepStrictEqual(result, []);
            const listener = bufferedEvent(num => result.push(num));
            assert_1.default.deepStrictEqual(result, []);
            yield (0, async_1.timeout)(10);
            emitter.fire(4);
            assert_1.default.deepStrictEqual(result, [1, 2, 3, 4]);
            listener.dispose();
            emitter.fire(5);
            assert_1.default.deepStrictEqual(result, [1, 2, 3, 4]);
        }));
        (0, mocha_1.test)('should fire initial buffer events', () => {
            const result = [];
            const emitter = new event_1.Emitter();
            const event = emitter.event;
            const bufferedEvent = event_1.Event.buffer(event, false, [-2, -1, 0]);
            emitter.fire(1);
            emitter.fire(2);
            emitter.fire(3);
            assert_1.default.deepStrictEqual(result, []);
            bufferedEvent(num => result.push(num));
            assert_1.default.deepStrictEqual(result, [-2, -1, 0, 1, 2, 3]);
        });
    });
    (0, mocha_1.suite)('EventMultiplexer', () => {
        (0, mocha_1.test)('works', () => {
            const result = [];
            const m = new event_1.EventMultiplexer();
            m.event(r => result.push(r));
            const e1 = new event_1.Emitter();
            m.add(e1.event);
            assert_1.default.deepStrictEqual(result, []);
            e1.fire(0);
            assert_1.default.deepStrictEqual(result, [0]);
        });
        (0, mocha_1.test)('multiplexer dispose works', () => {
            const result = [];
            const m = new event_1.EventMultiplexer();
            m.event(r => result.push(r));
            const e1 = new event_1.Emitter();
            m.add(e1.event);
            assert_1.default.deepStrictEqual(result, []);
            e1.fire(0);
            assert_1.default.deepStrictEqual(result, [0]);
            m.dispose();
            assert_1.default.deepStrictEqual(result, [0]);
            e1.fire(0);
            assert_1.default.deepStrictEqual(result, [0]);
        });
        (0, mocha_1.test)('event dispose works', () => {
            const result = [];
            const m = new event_1.EventMultiplexer();
            m.event(r => result.push(r));
            const e1 = new event_1.Emitter();
            m.add(e1.event);
            assert_1.default.deepStrictEqual(result, []);
            e1.fire(0);
            assert_1.default.deepStrictEqual(result, [0]);
            e1.dispose();
            assert_1.default.deepStrictEqual(result, [0]);
            e1.fire(0);
            assert_1.default.deepStrictEqual(result, [0]);
        });
        (0, mocha_1.test)('mutliplexer event dispose works', () => {
            const result = [];
            const m = new event_1.EventMultiplexer();
            m.event(r => result.push(r));
            const e1 = new event_1.Emitter();
            const l1 = m.add(e1.event);
            assert_1.default.deepStrictEqual(result, []);
            e1.fire(0);
            assert_1.default.deepStrictEqual(result, [0]);
            l1.dispose();
            assert_1.default.deepStrictEqual(result, [0]);
            e1.fire(0);
            assert_1.default.deepStrictEqual(result, [0]);
        });
        (0, mocha_1.test)('hot start works', () => {
            const result = [];
            const m = new event_1.EventMultiplexer();
            m.event(r => result.push(r));
            const e1 = new event_1.Emitter();
            m.add(e1.event);
            const e2 = new event_1.Emitter();
            m.add(e2.event);
            const e3 = new event_1.Emitter();
            m.add(e3.event);
            e1.fire(1);
            e2.fire(2);
            e3.fire(3);
            assert_1.default.deepStrictEqual(result, [1, 2, 3]);
        });
        (0, mocha_1.test)('cold start works', () => {
            const result = [];
            const m = new event_1.EventMultiplexer();
            const e1 = new event_1.Emitter();
            m.add(e1.event);
            const e2 = new event_1.Emitter();
            m.add(e2.event);
            const e3 = new event_1.Emitter();
            m.add(e3.event);
            m.event(r => result.push(r));
            e1.fire(1);
            e2.fire(2);
            e3.fire(3);
            assert_1.default.deepStrictEqual(result, [1, 2, 3]);
        });
        (0, mocha_1.test)('late add works', () => {
            const result = [];
            const m = new event_1.EventMultiplexer();
            const e1 = new event_1.Emitter();
            m.add(e1.event);
            const e2 = new event_1.Emitter();
            m.add(e2.event);
            m.event(r => result.push(r));
            e1.fire(1);
            e2.fire(2);
            const e3 = new event_1.Emitter();
            m.add(e3.event);
            e3.fire(3);
            assert_1.default.deepStrictEqual(result, [1, 2, 3]);
        });
        (0, mocha_1.test)('add dispose works', () => {
            const result = [];
            const m = new event_1.EventMultiplexer();
            const e1 = new event_1.Emitter();
            m.add(e1.event);
            const e2 = new event_1.Emitter();
            m.add(e2.event);
            m.event(r => result.push(r));
            e1.fire(1);
            e2.fire(2);
            const e3 = new event_1.Emitter();
            const l3 = m.add(e3.event);
            e3.fire(3);
            assert_1.default.deepStrictEqual(result, [1, 2, 3]);
            l3.dispose();
            e3.fire(4);
            assert_1.default.deepStrictEqual(result, [1, 2, 3]);
            e2.fire(4);
            e1.fire(5);
            assert_1.default.deepStrictEqual(result, [1, 2, 3, 4, 5]);
        });
    });
    (0, mocha_1.test)('latch', () => {
        const emitter = new event_1.Emitter();
        const event = event_1.Event.latch(emitter.event);
        const result = [];
        const listener = event(num => result.push(num));
        assert_1.default.deepStrictEqual(result, []);
        emitter.fire(1);
        assert_1.default.deepStrictEqual(result, [1]);
        emitter.fire(2);
        assert_1.default.deepStrictEqual(result, [1, 2]);
        emitter.fire(2);
        assert_1.default.deepStrictEqual(result, [1, 2]);
        emitter.fire(1);
        assert_1.default.deepStrictEqual(result, [1, 2, 1]);
        emitter.fire(1);
        assert_1.default.deepStrictEqual(result, [1, 2, 1]);
        emitter.fire(3);
        assert_1.default.deepStrictEqual(result, [1, 2, 1, 3]);
        emitter.fire(3);
        assert_1.default.deepStrictEqual(result, [1, 2, 1, 3]);
        emitter.fire(3);
        assert_1.default.deepStrictEqual(result, [1, 2, 1, 3]);
        listener.dispose();
    });
    (0, mocha_1.test)('dispose is reentrant', () => {
        const emitter = new event_1.Emitter({
            onLastListenerRemove: () => {
                emitter.dispose();
            }
        });
        const listener = emitter.event(() => undefined);
        listener.dispose(); // should not crash
    });
    (0, mocha_1.suite)('Relay', () => {
        (0, mocha_1.test)('should input work', () => {
            const e1 = new event_1.Emitter();
            const e2 = new event_1.Emitter();
            const relay = new event_1.Relay();
            const result = [];
            const listener = (num) => result.push(num);
            const subscription = relay.event(listener);
            e1.fire(1);
            assert_1.default.deepStrictEqual(result, []);
            relay.input = e1.event;
            e1.fire(2);
            assert_1.default.deepStrictEqual(result, [2]);
            relay.input = e2.event;
            e1.fire(3);
            e2.fire(4);
            assert_1.default.deepStrictEqual(result, [2, 4]);
            subscription.dispose();
            e1.fire(5);
            e2.fire(6);
            assert_1.default.deepStrictEqual(result, [2, 4]);
        });
        (0, mocha_1.test)('should Relay dispose work', () => {
            const e1 = new event_1.Emitter();
            const e2 = new event_1.Emitter();
            const relay = new event_1.Relay();
            const result = [];
            const listener = (num) => result.push(num);
            relay.event(listener);
            e1.fire(1);
            assert_1.default.deepStrictEqual(result, []);
            relay.input = e1.event;
            e1.fire(2);
            assert_1.default.deepStrictEqual(result, [2]);
            relay.input = e2.event;
            e1.fire(3);
            e2.fire(4);
            assert_1.default.deepStrictEqual(result, [2, 4]);
            relay.dispose();
            e1.fire(5);
            e2.fire(6);
            assert_1.default.deepStrictEqual(result, [2, 4]);
        });
    });
});
