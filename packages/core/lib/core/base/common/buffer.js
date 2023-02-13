"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.prefixedBufferStream = exports.prefixedBufferReadable = exports.newWriteableBufferStream = exports.streamToBufferReadableStream = exports.bufferToStream = exports.bufferedStreamToBuffer = exports.streamToBuffer = exports.bufferToReadable = exports.readableToBuffer = exports.writeUInt8 = exports.readUInt8 = exports.writeUInt32LE = exports.readUInt32LE = exports.writeUInt32BE = exports.readUInt32BE = exports.writeUInt16LE = exports.readUInt16LE = exports.QMBuffer = void 0;
const streams = __importStar(require("../../../core/base/common/stream"));
const strings = __importStar(require("../../../core/base/common/strings"));
const hasBuffer = (typeof Buffer !== 'undefined');
const hasTextEncoder = (typeof TextEncoder !== 'undefined');
const hasTextDecoder = (typeof TextDecoder !== 'undefined');
let textEncoder;
let textDecoder;
class QMBuffer {
    static alloc(byteLength) {
        if (hasBuffer) {
            return new QMBuffer(Buffer.allocUnsafe(byteLength));
        }
        else {
            return new QMBuffer(new Uint8Array(byteLength));
        }
    }
    static wrap(actual) {
        if (hasBuffer && (!Buffer.isBuffer(actual))) {
            actual = Buffer.from(actual.buffer, actual.byteOffset, actual.byteLength);
        }
        return new QMBuffer(actual);
    }
    static fromString(source, options) {
        const dontUseNodeBuffer = (options === null || options === void 0 ? void 0 : options.dontUseNodeBuffer) || false;
        if (!dontUseNodeBuffer && hasBuffer) {
            return new QMBuffer(Buffer.from(source));
        }
        else if (hasTextEncoder) {
            if (!textEncoder) {
                textEncoder = new TextEncoder();
            }
            return new QMBuffer(textEncoder.encode(source));
        }
        else {
            return new QMBuffer(strings.encodeUTF8(source));
        }
    }
    static concat(buffers, totalLength) {
        if (typeof totalLength === 'undefined') {
            totalLength = 0;
            for (let i = 0, len = buffers.length; i < len; i++) {
                totalLength += buffers[i].byteLength;
            }
        }
        const ret = QMBuffer.alloc(totalLength);
        let offset = 0;
        for (let i = 0, len = buffers.length; i < len; i++) {
            const element = buffers[i];
            ret.set(element, offset);
            offset += element.byteLength;
        }
        return ret;
    }
    constructor(buffer) {
        this.buffer = buffer;
        this.byteLength = this.buffer.length;
    }
    toString() {
        if (hasBuffer) {
            return this.buffer.toString();
        }
        else if (hasTextDecoder) {
            if (!textDecoder) {
                textDecoder = new TextDecoder();
            }
            return textDecoder.decode(this.buffer);
        }
        else {
            return strings.decodeUTF8(this.buffer);
        }
    }
    slice(start, end) {
        return new QMBuffer(this.buffer.subarray(start, end));
    }
    set(array, offset) {
        if (array instanceof QMBuffer) {
            this.buffer.set(array.buffer, offset);
        }
        else {
            this.buffer.set(array, offset);
        }
    }
    readUInt32BE(offset) {
        return readUInt32BE(this.buffer, offset);
    }
    writeUInt32BE(value, offset) {
        writeUInt32BE(this.buffer, value, offset);
    }
    readUInt32LE(offset) {
        return readUInt32LE(this.buffer, offset);
    }
    writeUInt32LE(value, offset) {
        writeUInt32LE(this.buffer, value, offset);
    }
    readUInt8(offset) {
        return readUInt8(this.buffer, offset);
    }
    writeUInt8(value, offset) {
        writeUInt8(this.buffer, value, offset);
    }
}
exports.QMBuffer = QMBuffer;
function readUInt16LE(source, offset) {
    return (((source[offset + 0] << 0) >>> 0) |
        ((source[offset + 1] << 8) >>> 0));
}
exports.readUInt16LE = readUInt16LE;
function writeUInt16LE(destination, value, offset) {
    destination[offset + 0] = (value & 0b11111111);
    value = value >>> 8;
    destination[offset + 1] = (value & 0b11111111);
}
exports.writeUInt16LE = writeUInt16LE;
function readUInt32BE(source, offset) {
    return (source[offset] * Math.pow(2, 24)
        + source[offset + 1] * Math.pow(2, 16)
        + source[offset + 2] * Math.pow(2, 8)
        + source[offset + 3]);
}
exports.readUInt32BE = readUInt32BE;
function writeUInt32BE(destination, value, offset) {
    destination[offset + 3] = value;
    value = value >>> 8;
    destination[offset + 2] = value;
    value = value >>> 8;
    destination[offset + 1] = value;
    value = value >>> 8;
    destination[offset] = value;
}
exports.writeUInt32BE = writeUInt32BE;
function readUInt32LE(source, offset) {
    return (((source[offset + 0] << 0) >>> 0) |
        ((source[offset + 1] << 8) >>> 0) |
        ((source[offset + 2] << 16) >>> 0) |
        ((source[offset + 3] << 24) >>> 0));
}
exports.readUInt32LE = readUInt32LE;
function writeUInt32LE(destination, value, offset) {
    destination[offset + 0] = (value & 0b11111111);
    value = value >>> 8;
    destination[offset + 1] = (value & 0b11111111);
    value = value >>> 8;
    destination[offset + 2] = (value & 0b11111111);
    value = value >>> 8;
    destination[offset + 3] = (value & 0b11111111);
}
exports.writeUInt32LE = writeUInt32LE;
function readUInt8(source, offset) {
    return source[offset];
}
exports.readUInt8 = readUInt8;
function writeUInt8(destination, value, offset) {
    destination[offset] = value;
}
exports.writeUInt8 = writeUInt8;
function readableToBuffer(readable) {
    return streams.consumeReadable(readable, chunks => QMBuffer.concat(chunks));
}
exports.readableToBuffer = readableToBuffer;
function bufferToReadable(buffer) {
    return streams.toReadable(buffer);
}
exports.bufferToReadable = bufferToReadable;
function streamToBuffer(stream) {
    return streams.consumeStream(stream, chunks => QMBuffer.concat(chunks));
}
exports.streamToBuffer = streamToBuffer;
function bufferedStreamToBuffer(bufferedStream) {
    return __awaiter(this, void 0, void 0, function* () {
        if (bufferedStream.ended) {
            return QMBuffer.concat(bufferedStream.buffer);
        }
        return QMBuffer.concat([
            // Include already read chunks...
            ...bufferedStream.buffer,
            // ...and all additional chunks
            yield streamToBuffer(bufferedStream.stream)
        ]);
    });
}
exports.bufferedStreamToBuffer = bufferedStreamToBuffer;
function bufferToStream(buffer) {
    return streams.toStream(buffer, chunks => QMBuffer.concat(chunks));
}
exports.bufferToStream = bufferToStream;
function streamToBufferReadableStream(stream) {
    return streams.transform(stream, { data: data => typeof data === 'string' ? QMBuffer.fromString(data) : QMBuffer.wrap(data) }, chunks => QMBuffer.concat(chunks));
}
exports.streamToBufferReadableStream = streamToBufferReadableStream;
function newWriteableBufferStream(options) {
    return streams.newWriteableStream(chunks => QMBuffer.concat(chunks), options);
}
exports.newWriteableBufferStream = newWriteableBufferStream;
function prefixedBufferReadable(prefix, readable) {
    return streams.prefixedReadable(prefix, readable, chunks => QMBuffer.concat(chunks));
}
exports.prefixedBufferReadable = prefixedBufferReadable;
function prefixedBufferStream(prefix, stream) {
    return streams.prefixedStream(prefix, stream, chunks => QMBuffer.concat(chunks));
}
exports.prefixedBufferStream = prefixedBufferStream;
