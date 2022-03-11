import * as streams from '../../../core/base/common/stream';
export declare class QMBuffer {
    static alloc(byteLength: number): QMBuffer;
    static wrap(actual: Uint8Array): QMBuffer;
    static fromString(source: string, options?: {
        dontUseNodeBuffer?: boolean;
    }): QMBuffer;
    static concat(buffers: QMBuffer[], totalLength?: number): QMBuffer;
    readonly buffer: Uint8Array;
    readonly byteLength: number;
    private constructor();
    toString(): string;
    slice(start?: number, end?: number): QMBuffer;
    set(array: QMBuffer, offset?: number): void;
    set(array: Uint8Array, offset?: number): void;
    readUInt32BE(offset: number): number;
    writeUInt32BE(value: number, offset: number): void;
    readUInt32LE(offset: number): number;
    writeUInt32LE(value: number, offset: number): void;
    readUInt8(offset: number): number;
    writeUInt8(value: number, offset: number): void;
}
export interface QMBufferReadable extends streams.Readable<QMBuffer> {
}
export interface QMBufferReadableStream extends streams.ReadableStream<QMBuffer> {
}
export interface QMBufferWriteableStream extends streams.WriteableStream<QMBuffer> {
}
export interface QMBufferReadableBufferedStream extends streams.ReadableBufferedStream<QMBuffer> {
}
export declare function readUInt16LE(source: Uint8Array, offset: number): number;
export declare function writeUInt16LE(destination: Uint8Array, value: number, offset: number): void;
export declare function readUInt32BE(source: Uint8Array, offset: number): number;
export declare function writeUInt32BE(destination: Uint8Array, value: number, offset: number): void;
export declare function readUInt32LE(source: Uint8Array, offset: number): number;
export declare function writeUInt32LE(destination: Uint8Array, value: number, offset: number): void;
export declare function readUInt8(source: Uint8Array, offset: number): number;
export declare function writeUInt8(destination: Uint8Array, value: number, offset: number): void;
export declare function readableToBuffer(readable: QMBufferReadable): QMBuffer;
export declare function bufferToReadable(buffer: QMBuffer): QMBufferReadable;
export declare function streamToBuffer(stream: streams.ReadableStream<QMBuffer>): Promise<QMBuffer>;
export declare function bufferedStreamToBuffer(bufferedStream: streams.ReadableBufferedStream<QMBuffer>): Promise<QMBuffer>;
export declare function bufferToStream(buffer: QMBuffer): streams.ReadableStream<QMBuffer>;
export declare function streamToBufferReadableStream(stream: streams.ReadableStreamEvents<Uint8Array | string>): streams.ReadableStream<QMBuffer>;
export declare function newWriteableBufferStream(options?: streams.WriteableStreamOptions): streams.WriteableStream<QMBuffer>;
export declare function prefixedBufferReadable(prefix: QMBuffer, readable: QMBufferReadable): QMBufferReadable;
export declare function prefixedBufferStream(prefix: QMBuffer, stream: QMBufferReadableStream): QMBufferReadableStream;
