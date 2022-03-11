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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const buffer_1 = require("../../../../core/base/common/buffer");
const async_1 = require("../../../../core/base/common/async");
const stream_1 = require("../../../../core/base/common/stream");
const mocha_1 = require("mocha");
(0, mocha_1.suite)('Buffer', () => {
    (0, mocha_1.test)('Buffer toString', () => {
        const data = new Uint8Array([1, 2, 3, 'h'.charCodeAt(0), 'i'.charCodeAt(0), 4, 5]).buffer;
        const buffer = buffer_1.QMBuffer.wrap(new Uint8Array(data, 3, 2));
        assert_1.default.deepStrictEqual(buffer.toString(), 'hi');
    });
    (0, mocha_1.test)('bufferToReadable / readableToBuffer', () => {
        const content = 'Hello World';
        const readable = (0, buffer_1.bufferToReadable)(buffer_1.QMBuffer.fromString(content));
        assert_1.default.strictEqual((0, buffer_1.readableToBuffer)(readable).toString(), content);
    });
    (0, mocha_1.test)('bufferToStream / streamToBuffer', () => __awaiter(void 0, void 0, void 0, function* () {
        const content = 'Hello World';
        const stream = (0, buffer_1.bufferToStream)(buffer_1.QMBuffer.fromString(content));
        assert_1.default.strictEqual((yield (0, buffer_1.streamToBuffer)(stream)).toString(), content);
    }));
    (0, mocha_1.test)('bufferedStreamToBuffer', () => __awaiter(void 0, void 0, void 0, function* () {
        const content = 'Hello World';
        const stream = yield (0, stream_1.peekStream)((0, buffer_1.bufferToStream)(buffer_1.QMBuffer.fromString(content)), 1);
        assert_1.default.strictEqual((yield (0, buffer_1.bufferedStreamToBuffer)(stream)).toString(), content);
    }));
    (0, mocha_1.test)('bufferWriteableStream - basics (no error)', () => __awaiter(void 0, void 0, void 0, function* () {
        const stream = (0, buffer_1.newWriteableBufferStream)();
        let chunks = [];
        stream.on('data', data => {
            chunks.push(data);
        });
        let ended = false;
        stream.on('end', () => {
            ended = true;
        });
        let errors = [];
        stream.on('error', error => {
            errors.push(error);
        });
        yield (0, async_1.timeout)(0);
        stream.write(buffer_1.QMBuffer.fromString('Hello'));
        yield (0, async_1.timeout)(0);
        stream.end(buffer_1.QMBuffer.fromString('World'));
        assert_1.default.strictEqual(chunks.length, 2);
        assert_1.default.strictEqual(chunks[0].toString(), 'Hello');
        assert_1.default.strictEqual(chunks[1].toString(), 'World');
        assert_1.default.strictEqual(ended, true);
        assert_1.default.strictEqual(errors.length, 0);
    }));
    (0, mocha_1.test)('bufferWriteableStream - basics (error)', () => __awaiter(void 0, void 0, void 0, function* () {
        const stream = (0, buffer_1.newWriteableBufferStream)();
        let chunks = [];
        stream.on('data', data => {
            chunks.push(data);
        });
        let ended = false;
        stream.on('end', () => {
            ended = true;
        });
        let errors = [];
        stream.on('error', error => {
            errors.push(error);
        });
        yield (0, async_1.timeout)(0);
        stream.write(buffer_1.QMBuffer.fromString('Hello'));
        yield (0, async_1.timeout)(0);
        stream.error(new Error());
        stream.end();
        assert_1.default.strictEqual(chunks.length, 1);
        assert_1.default.strictEqual(chunks[0].toString(), 'Hello');
        assert_1.default.strictEqual(ended, true);
        assert_1.default.strictEqual(errors.length, 1);
    }));
    (0, mocha_1.test)('bufferWriteableStream - buffers data when no listener', () => __awaiter(void 0, void 0, void 0, function* () {
        const stream = (0, buffer_1.newWriteableBufferStream)();
        yield (0, async_1.timeout)(0);
        stream.write(buffer_1.QMBuffer.fromString('Hello'));
        yield (0, async_1.timeout)(0);
        stream.end(buffer_1.QMBuffer.fromString('World'));
        let chunks = [];
        stream.on('data', data => {
            chunks.push(data);
        });
        let ended = false;
        stream.on('end', () => {
            ended = true;
        });
        let errors = [];
        stream.on('error', error => {
            errors.push(error);
        });
        assert_1.default.strictEqual(chunks.length, 1);
        assert_1.default.strictEqual(chunks[0].toString(), 'HelloWorld');
        assert_1.default.strictEqual(ended, true);
        assert_1.default.strictEqual(errors.length, 0);
    }));
    (0, mocha_1.test)('bufferWriteableStream - buffers errors when no listener', () => __awaiter(void 0, void 0, void 0, function* () {
        const stream = (0, buffer_1.newWriteableBufferStream)();
        yield (0, async_1.timeout)(0);
        stream.write(buffer_1.QMBuffer.fromString('Hello'));
        yield (0, async_1.timeout)(0);
        stream.error(new Error());
        let chunks = [];
        stream.on('data', data => {
            chunks.push(data);
        });
        let errors = [];
        stream.on('error', error => {
            errors.push(error);
        });
        let ended = false;
        stream.on('end', () => {
            ended = true;
        });
        stream.end();
        assert_1.default.strictEqual(chunks.length, 1);
        assert_1.default.strictEqual(chunks[0].toString(), 'Hello');
        assert_1.default.strictEqual(ended, true);
        assert_1.default.strictEqual(errors.length, 1);
    }));
    (0, mocha_1.test)('bufferWriteableStream - buffers end when no listener', () => __awaiter(void 0, void 0, void 0, function* () {
        const stream = (0, buffer_1.newWriteableBufferStream)();
        yield (0, async_1.timeout)(0);
        stream.write(buffer_1.QMBuffer.fromString('Hello'));
        yield (0, async_1.timeout)(0);
        stream.end(buffer_1.QMBuffer.fromString('World'));
        let ended = false;
        stream.on('end', () => {
            ended = true;
        });
        let chunks = [];
        stream.on('data', data => {
            chunks.push(data);
        });
        let errors = [];
        stream.on('error', error => {
            errors.push(error);
        });
        assert_1.default.strictEqual(chunks.length, 1);
        assert_1.default.strictEqual(chunks[0].toString(), 'HelloWorld');
        assert_1.default.strictEqual(ended, true);
        assert_1.default.strictEqual(errors.length, 0);
    }));
    (0, mocha_1.test)('bufferWriteableStream - nothing happens after end()', () => __awaiter(void 0, void 0, void 0, function* () {
        const stream = (0, buffer_1.newWriteableBufferStream)();
        let chunks = [];
        stream.on('data', data => {
            chunks.push(data);
        });
        yield (0, async_1.timeout)(0);
        stream.write(buffer_1.QMBuffer.fromString('Hello'));
        yield (0, async_1.timeout)(0);
        stream.end(buffer_1.QMBuffer.fromString('World'));
        let dataCalledAfterEnd = false;
        stream.on('data', data => {
            dataCalledAfterEnd = true;
        });
        let errorCalledAfterEnd = false;
        stream.on('error', error => {
            errorCalledAfterEnd = true;
        });
        let endCalledAfterEnd = false;
        stream.on('end', () => {
            endCalledAfterEnd = true;
        });
        yield (0, async_1.timeout)(0);
        stream.write(buffer_1.QMBuffer.fromString('Hello'));
        yield (0, async_1.timeout)(0);
        stream.error(new Error());
        yield (0, async_1.timeout)(0);
        stream.end(buffer_1.QMBuffer.fromString('World'));
        assert_1.default.strictEqual(dataCalledAfterEnd, false);
        assert_1.default.strictEqual(errorCalledAfterEnd, false);
        assert_1.default.strictEqual(endCalledAfterEnd, false);
        assert_1.default.strictEqual(chunks.length, 2);
        assert_1.default.strictEqual(chunks[0].toString(), 'Hello');
        assert_1.default.strictEqual(chunks[1].toString(), 'World');
    }));
    (0, mocha_1.test)('bufferWriteableStream - pause/resume (simple)', () => __awaiter(void 0, void 0, void 0, function* () {
        const stream = (0, buffer_1.newWriteableBufferStream)();
        let chunks = [];
        stream.on('data', data => {
            chunks.push(data);
        });
        let ended = false;
        stream.on('end', () => {
            ended = true;
        });
        let errors = [];
        stream.on('error', error => {
            errors.push(error);
        });
        stream.pause();
        yield (0, async_1.timeout)(0);
        stream.write(buffer_1.QMBuffer.fromString('Hello'));
        yield (0, async_1.timeout)(0);
        stream.end(buffer_1.QMBuffer.fromString('World'));
        assert_1.default.strictEqual(chunks.length, 0);
        assert_1.default.strictEqual(errors.length, 0);
        assert_1.default.strictEqual(ended, false);
        stream.resume();
        assert_1.default.strictEqual(chunks.length, 1);
        assert_1.default.strictEqual(chunks[0].toString(), 'HelloWorld');
        assert_1.default.strictEqual(ended, true);
        assert_1.default.strictEqual(errors.length, 0);
    }));
    (0, mocha_1.test)('bufferWriteableStream - pause/resume (pause after first write)', () => __awaiter(void 0, void 0, void 0, function* () {
        const stream = (0, buffer_1.newWriteableBufferStream)();
        let chunks = [];
        stream.on('data', data => {
            chunks.push(data);
        });
        let ended = false;
        stream.on('end', () => {
            ended = true;
        });
        let errors = [];
        stream.on('error', error => {
            errors.push(error);
        });
        yield (0, async_1.timeout)(0);
        stream.write(buffer_1.QMBuffer.fromString('Hello'));
        stream.pause();
        yield (0, async_1.timeout)(0);
        stream.end(buffer_1.QMBuffer.fromString('World'));
        assert_1.default.strictEqual(chunks.length, 1);
        assert_1.default.strictEqual(chunks[0].toString(), 'Hello');
        assert_1.default.strictEqual(errors.length, 0);
        assert_1.default.strictEqual(ended, false);
        stream.resume();
        assert_1.default.strictEqual(chunks.length, 2);
        assert_1.default.strictEqual(chunks[0].toString(), 'Hello');
        assert_1.default.strictEqual(chunks[1].toString(), 'World');
        assert_1.default.strictEqual(ended, true);
        assert_1.default.strictEqual(errors.length, 0);
    }));
    (0, mocha_1.test)('bufferWriteableStream - pause/resume (error)', () => __awaiter(void 0, void 0, void 0, function* () {
        const stream = (0, buffer_1.newWriteableBufferStream)();
        let chunks = [];
        stream.on('data', data => {
            chunks.push(data);
        });
        let ended = false;
        stream.on('end', () => {
            ended = true;
        });
        let errors = [];
        stream.on('error', error => {
            errors.push(error);
        });
        stream.pause();
        yield (0, async_1.timeout)(0);
        stream.write(buffer_1.QMBuffer.fromString('Hello'));
        yield (0, async_1.timeout)(0);
        stream.error(new Error());
        stream.end();
        assert_1.default.strictEqual(chunks.length, 0);
        assert_1.default.strictEqual(ended, false);
        assert_1.default.strictEqual(errors.length, 0);
        stream.resume();
        assert_1.default.strictEqual(chunks.length, 1);
        assert_1.default.strictEqual(chunks[0].toString(), 'Hello');
        assert_1.default.strictEqual(ended, true);
        assert_1.default.strictEqual(errors.length, 1);
    }));
    (0, mocha_1.test)('bufferWriteableStream - destroy', () => __awaiter(void 0, void 0, void 0, function* () {
        const stream = (0, buffer_1.newWriteableBufferStream)();
        let chunks = [];
        stream.on('data', data => {
            chunks.push(data);
        });
        let ended = false;
        stream.on('end', () => {
            ended = true;
        });
        let errors = [];
        stream.on('error', error => {
            errors.push(error);
        });
        stream.destroy();
        yield (0, async_1.timeout)(0);
        stream.write(buffer_1.QMBuffer.fromString('Hello'));
        yield (0, async_1.timeout)(0);
        stream.end(buffer_1.QMBuffer.fromString('World'));
        assert_1.default.strictEqual(chunks.length, 0);
        assert_1.default.strictEqual(ended, false);
        assert_1.default.strictEqual(errors.length, 0);
    }));
    (0, mocha_1.test)('Performance issue with QMBuffer#slice #76076', function () {
        // Buffer#slice creates a view
        if (typeof Buffer !== 'undefined') {
            const buff = Buffer.from([10, 20, 30, 40]);
            const b2 = buff.slice(1, 3);
            assert_1.default.strictEqual(buff[1], 20);
            assert_1.default.strictEqual(b2[0], 20);
            buff[1] = 17; // modify buff AND b2
            assert_1.default.strictEqual(buff[1], 17);
            assert_1.default.strictEqual(b2[0], 17);
        }
        // TypedArray#slice creates a copy
        {
            const unit = new Uint8Array([10, 20, 30, 40]);
            const u2 = unit.slice(1, 3);
            assert_1.default.strictEqual(unit[1], 20);
            assert_1.default.strictEqual(u2[0], 20);
            unit[1] = 17; // modify unit, NOT b2
            assert_1.default.strictEqual(unit[1], 17);
            assert_1.default.strictEqual(u2[0], 20);
        }
        // TypedArray#subarray creates a view
        {
            const unit = new Uint8Array([10, 20, 30, 40]);
            const u2 = unit.subarray(1, 3);
            assert_1.default.strictEqual(unit[1], 20);
            assert_1.default.strictEqual(u2[0], 20);
            unit[1] = 17; // modify unit AND b2
            assert_1.default.strictEqual(unit[1], 17);
            assert_1.default.strictEqual(u2[0], 17);
        }
    });
});
