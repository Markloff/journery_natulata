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
const mocha_1 = require("mocha");
const assert_1 = __importDefault(require("assert"));
const stream_1 = require("../../../../core/base/common/stream");
const async_1 = require("../../../../core/base/common/async");
(0, mocha_1.suite)('Stream', () => {
    (0, mocha_1.test)('isReadableStream', () => {
        assert_1.default.ok(!(0, stream_1.isReadableStream)(Object.create(null)));
        assert_1.default.ok((0, stream_1.isReadableStream)((0, stream_1.newWriteableStream)(d => d)));
    });
    (0, mocha_1.test)('isReadableBufferedStream', () => __awaiter(void 0, void 0, void 0, function* () {
        assert_1.default.ok(!(0, stream_1.isReadableStream)(Object.create(null)));
        const stream = (0, stream_1.newWriteableStream)(d => d);
        stream.end();
        const bufferedStream = yield (0, stream_1.peekStream)(stream, 1);
        assert_1.default.ok((0, stream_1.isReadableBufferedStream)(bufferedStream));
    }));
    (0, mocha_1.test)('WriteableStream - basics', () => {
        const stream = (0, stream_1.newWriteableStream)(strings => strings.join());
        let error = false;
        stream.on('error', e => {
            error = true;
        });
        let end = false;
        stream.on('end', () => {
            end = true;
        });
        stream.write('Hello');
        const chunks = [];
        stream.on('data', data => {
            chunks.push(data);
        });
        assert_1.default.strictEqual(chunks[0], 'Hello');
        stream.write('World');
        assert_1.default.strictEqual(chunks[1], 'World');
        assert_1.default.strictEqual(error, false);
        assert_1.default.strictEqual(end, false);
        stream.pause();
        stream.write('1');
        stream.write('2');
        stream.write('3');
        assert_1.default.strictEqual(chunks.length, 2);
        stream.resume();
        assert_1.default.strictEqual(chunks.length, 3);
        assert_1.default.strictEqual(chunks[2], '1,2,3');
        stream.error(new Error());
        assert_1.default.strictEqual(error, true);
        error = false;
        stream.error(new Error());
        assert_1.default.strictEqual(error, true);
        stream.end('Final Bit');
        assert_1.default.strictEqual(chunks.length, 4);
        assert_1.default.strictEqual(chunks[3], 'Final Bit');
        assert_1.default.strictEqual(end, true);
        stream.destroy();
        stream.write('Unexpected');
        assert_1.default.strictEqual(chunks.length, 4);
    });
    (0, mocha_1.test)('WriteableStream - end with empty string works', () => __awaiter(void 0, void 0, void 0, function* () {
        const reducer = (strings) => strings.length > 0 ? strings.join() : 'error';
        const stream = (0, stream_1.newWriteableStream)(reducer);
        stream.end('');
        const result = yield (0, stream_1.consumeStream)(stream, reducer);
        assert_1.default.strictEqual(result, '');
    }));
    (0, mocha_1.test)('WriteableStream - end with error works', () => __awaiter(void 0, void 0, void 0, function* () {
        const reducer = (errors) => errors[0];
        const stream = (0, stream_1.newWriteableStream)(reducer);
        stream.end(new Error('error'));
        const result = yield (0, stream_1.consumeStream)(stream, reducer);
        assert_1.default.ok(result instanceof Error);
    }));
    (0, mocha_1.test)('WriteableStream - removeListener', () => {
        const stream = (0, stream_1.newWriteableStream)(strings => strings.join());
        let error = false;
        const errorListener = (e) => {
            error = true;
        };
        stream.on('error', errorListener);
        let data = false;
        const dataListener = () => {
            data = true;
        };
        stream.on('data', dataListener);
        stream.write('Hello');
        assert_1.default.strictEqual(data, true);
        data = false;
        stream.removeListener('data', dataListener);
        stream.write('World');
        assert_1.default.strictEqual(data, false);
        stream.error(new Error());
        assert_1.default.strictEqual(error, true);
        error = false;
        stream.removeListener('error', errorListener);
        // always leave at least one error listener to streams to avoid unexpected errors during test running
        stream.on('error', () => { });
        stream.error(new Error());
        assert_1.default.strictEqual(error, false);
    });
    (0, mocha_1.test)('WriteableStream - highWaterMark', () => __awaiter(void 0, void 0, void 0, function* () {
        const stream = (0, stream_1.newWriteableStream)(strings => strings.join(), { highWaterMark: 3 });
        let res = stream.write('1');
        assert_1.default.ok(!res);
        res = stream.write('2');
        assert_1.default.ok(!res);
        res = stream.write('3');
        assert_1.default.ok(!res);
        let promise1 = stream.write('4');
        assert_1.default.ok(promise1 instanceof Promise);
        let promise2 = stream.write('5');
        assert_1.default.ok(promise2 instanceof Promise);
        let drained1 = false;
        (() => __awaiter(void 0, void 0, void 0, function* () {
            yield promise1;
            drained1 = true;
        }))();
        let drained2 = false;
        (() => __awaiter(void 0, void 0, void 0, function* () {
            yield promise2;
            drained2 = true;
        }))();
        let data = undefined;
        stream.on('data', chunk => {
            assert_1.default.strictEqual(drained1, false);
            assert_1.default.strictEqual(drained2, false);
            data = chunk;
        });
        assert_1.default.ok(data);
        yield (0, async_1.timeout)(0);
        assert_1.default.strictEqual(drained1, true);
        assert_1.default.strictEqual(drained2, true);
    }));
    (0, mocha_1.test)('consumeReadable', () => {
        const readable = arrayToReadable(['1', '2', '3', '4', '5']);
        const consumed = (0, stream_1.consumeReadable)(readable, strings => strings.join());
        assert_1.default.strictEqual(consumed, '1,2,3,4,5');
    });
    (0, mocha_1.test)('peekReadable', () => __awaiter(void 0, void 0, void 0, function* () {
        for (let i = 0; i < 5; i++) {
            const readable = arrayToReadable(['1', '2', '3', '4', '5']);
            const consumedOrReadable = (0, stream_1.peekReadable)(readable, strings => strings.join(), i);
            if (typeof consumedOrReadable === 'string') {
                assert_1.default.fail('Unexpected result');
            }
            else {
                const consumed = (0, stream_1.consumeReadable)(consumedOrReadable, strings => strings.join());
                assert_1.default.strictEqual(consumed, '1,2,3,4,5');
            }
        }
    }));
    (0, mocha_1.test)('peekReadable - error handling', () => __awaiter(void 0, void 0, void 0, function* () {
        // 0 Chunks
        let stream = (0, stream_1.newWriteableStream)(data => data);
        let error = undefined;
        let promise = (() => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield (0, stream_1.peekStream)(stream, 1);
            }
            catch (err) {
                error = err;
            }
        }))();
        stream.error(new Error());
        yield promise;
        assert_1.default.ok(error);
        // 1 Chunk
        stream = (0, stream_1.newWriteableStream)(data => data);
        error = undefined;
        promise = (() => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield (0, stream_1.peekStream)(stream, 1);
            }
            catch (err) {
                error = err;
            }
        }))();
        stream.write('foo');
        stream.error(new Error());
        yield promise;
        assert_1.default.ok(error);
        // 2 Chunks
        stream = (0, stream_1.newWriteableStream)(data => data);
        error = undefined;
        promise = (() => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield (0, stream_1.peekStream)(stream, 1);
            }
            catch (err) {
                error = err;
            }
        }))();
        stream.write('foo');
        stream.write('bar');
        stream.error(new Error());
        yield promise;
        assert_1.default.ok(!error);
        stream.on('error', err => error = err);
        stream.on('data', chunk => { });
        assert_1.default.ok(error);
    }));
    function arrayToReadable(array) {
        return {
            read: () => array.shift() || null
        };
    }
    function readableToStream(readable) {
        const stream = (0, stream_1.newWriteableStream)(strings => strings.join());
        // Simulate async behavior
        setTimeout(() => {
            let chunk = null;
            while ((chunk = readable.read()) !== null) {
                stream.write(chunk);
            }
            stream.end();
        }, 0);
        return stream;
    }
    (0, mocha_1.test)('consumeStream', () => __awaiter(void 0, void 0, void 0, function* () {
        const stream = readableToStream(arrayToReadable(['1', '2', '3', '4', '5']));
        const consumed = yield (0, stream_1.consumeStream)(stream, strings => strings.join());
        assert_1.default.strictEqual(consumed, '1,2,3,4,5');
    }));
    (0, mocha_1.test)('consumeStream - without reducer', () => __awaiter(void 0, void 0, void 0, function* () {
        const stream = readableToStream(arrayToReadable(['1', '2', '3', '4', '5']));
        const consumed = yield (0, stream_1.consumeStream)(stream);
        assert_1.default.strictEqual(consumed, undefined);
    }));
    (0, mocha_1.test)('consumeStream - without reducer and error', () => __awaiter(void 0, void 0, void 0, function* () {
        const stream = (0, stream_1.newWriteableStream)(strings => strings.join());
        stream.error(new Error());
        const consumed = yield (0, stream_1.consumeStream)(stream);
        assert_1.default.strictEqual(consumed, undefined);
    }));
    (0, mocha_1.test)('listenStream', () => {
        const stream = (0, stream_1.newWriteableStream)(strings => strings.join());
        let error = false;
        let end = false;
        let data = '';
        (0, stream_1.listenStream)(stream, {
            onData: d => {
                data = d;
            },
            onError: e => {
                error = true;
            },
            onEnd: () => {
                end = true;
            }
        });
        stream.write('Hello');
        assert_1.default.strictEqual(data, 'Hello');
        stream.write('World');
        assert_1.default.strictEqual(data, 'World');
        assert_1.default.strictEqual(error, false);
        assert_1.default.strictEqual(end, false);
        stream.error(new Error());
        assert_1.default.strictEqual(error, true);
        stream.end('Final Bit');
        assert_1.default.strictEqual(end, true);
    });
    (0, mocha_1.test)('peekStream', () => __awaiter(void 0, void 0, void 0, function* () {
        for (let i = 0; i < 5; i++) {
            const stream = readableToStream(arrayToReadable(['1', '2', '3', '4', '5']));
            const result = yield (0, stream_1.peekStream)(stream, i);
            assert_1.default.strictEqual(stream, result.stream);
            if (result.ended) {
                assert_1.default.fail('Unexpected result, stream should not have ended yet');
            }
            else {
                assert_1.default.strictEqual(result.buffer.length, i + 1, `maxChunks: ${i}`);
                const additionalResult = [];
                yield (0, stream_1.consumeStream)(stream, strings => {
                    additionalResult.push(...strings);
                    return strings.join();
                });
                assert_1.default.strictEqual([...result.buffer, ...additionalResult].join(), '1,2,3,4,5');
            }
        }
        let stream = readableToStream(arrayToReadable(['1', '2', '3', '4', '5']));
        let result = yield (0, stream_1.peekStream)(stream, 5);
        assert_1.default.strictEqual(stream, result.stream);
        assert_1.default.strictEqual(result.buffer.join(), '1,2,3,4,5');
        assert_1.default.strictEqual(result.ended, true);
        stream = readableToStream(arrayToReadable(['1', '2', '3', '4', '5']));
        result = yield (0, stream_1.peekStream)(stream, 6);
        assert_1.default.strictEqual(stream, result.stream);
        assert_1.default.strictEqual(result.buffer.join(), '1,2,3,4,5');
        assert_1.default.strictEqual(result.ended, true);
    }));
    (0, mocha_1.test)('toStream', () => __awaiter(void 0, void 0, void 0, function* () {
        const stream = (0, stream_1.toStream)('1,2,3,4,5', strings => strings.join());
        const consumed = yield (0, stream_1.consumeStream)(stream, strings => strings.join());
        assert_1.default.strictEqual(consumed, '1,2,3,4,5');
    }));
    (0, mocha_1.test)('toReadable', () => __awaiter(void 0, void 0, void 0, function* () {
        const readable = (0, stream_1.toReadable)('1,2,3,4,5');
        const consumed = (0, stream_1.consumeReadable)(readable, strings => strings.join());
        assert_1.default.strictEqual(consumed, '1,2,3,4,5');
    }));
    (0, mocha_1.test)('transform', () => __awaiter(void 0, void 0, void 0, function* () {
        const source = (0, stream_1.newWriteableStream)(strings => strings.join());
        const result = (0, stream_1.transform)(source, { data: string => string + string }, strings => strings.join());
        // Simulate async behavior
        setTimeout(() => {
            source.write('1');
            source.write('2');
            source.write('3');
            source.write('4');
            source.end('5');
        }, 0);
        const consumed = yield (0, stream_1.consumeStream)(result, strings => strings.join());
        assert_1.default.strictEqual(consumed, '11,22,33,44,55');
    }));
    // slice拷贝了一份listener
    (0, mocha_1.test)('events are delivered even if a listener is removed during delivery', () => {
        const stream = (0, stream_1.newWriteableStream)(strings => strings.join());
        let listener1Called = false;
        let listener2Called = false;
        const listener1 = () => { stream.removeListener('end', listener1); listener1Called = true; };
        const listener2 = () => { listener2Called = true; };
        stream.on('end', listener1);
        stream.on('end', listener2);
        stream.on('data', () => { });
        stream.end('');
        assert_1.default.strictEqual(listener1Called, true);
        assert_1.default.strictEqual(listener2Called, true);
    });
    (0, mocha_1.test)('prefixedReadable', () => {
        // Basic
        let readable = (0, stream_1.prefixedReadable)('1,2', arrayToReadable(['3', '4', '5']), val => val.join(','));
        assert_1.default.strictEqual((0, stream_1.consumeReadable)(readable, val => val.join(',')), '1,2,3,4,5');
        // Empty
        readable = (0, stream_1.prefixedReadable)('empty', arrayToReadable([]), val => val.join(','));
        assert_1.default.strictEqual((0, stream_1.consumeReadable)(readable, val => val.join(',')), 'empty');
    });
    (0, mocha_1.test)('prefixedStream', () => __awaiter(void 0, void 0, void 0, function* () {
        // Basic
        let stream = (0, stream_1.newWriteableStream)(strings => strings.join());
        stream.write('3');
        stream.write('4');
        stream.write('5');
        stream.end();
        let prefixStream = (0, stream_1.prefixedStream)('1,2', stream, val => val.join(','));
        assert_1.default.strictEqual(yield (0, stream_1.consumeStream)(prefixStream, val => val.join(',')), '1,2,3,4,5');
        // Empty
        stream = (0, stream_1.newWriteableStream)(strings => strings.join());
        stream.end();
        prefixStream = (0, stream_1.prefixedStream)('1,2', stream, val => val.join(','));
        assert_1.default.strictEqual(yield (0, stream_1.consumeStream)(prefixStream, val => val.join(',')), '1,2');
        // Error
        stream = (0, stream_1.newWriteableStream)(strings => strings.join());
        stream.error(new Error('fail'));
        prefixStream = (0, stream_1.prefixedStream)('error', stream, val => val.join(','));
        let error;
        try {
            yield (0, stream_1.consumeStream)(prefixStream, val => val.join(','));
        }
        catch (e) {
            error = e;
        }
        assert_1.default.ok(error);
    }));
});
