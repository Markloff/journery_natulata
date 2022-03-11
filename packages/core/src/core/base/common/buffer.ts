import * as streams from '@/core/base/common/stream';
import * as strings from '@/core/base/common/strings';

declare const Buffer: any;

const hasBuffer = (typeof Buffer !== 'undefined');
const hasTextEncoder = (typeof TextEncoder !== 'undefined');
const hasTextDecoder = (typeof TextDecoder !== 'undefined');

let textEncoder: TextEncoder | null;
let textDecoder: TextDecoder | null;

export class QMBuffer {

	static alloc(byteLength: number): QMBuffer {
		if (hasBuffer) {
			return new QMBuffer(Buffer.allocUnsafe(byteLength));
		} else {
			return new QMBuffer(new Uint8Array(byteLength));
		}
	}

	static wrap(actual: Uint8Array): QMBuffer {
		if (hasBuffer && (!Buffer.isBuffer(actual))) {
			actual = Buffer.from(actual.buffer, actual.byteOffset, actual.byteLength);
		}
		return new QMBuffer(actual);
	}

	static fromString(source: string, options?: { dontUseNodeBuffer?: boolean }): QMBuffer {
		const dontUseNodeBuffer = options?.dontUseNodeBuffer || false;
		if (!dontUseNodeBuffer && hasBuffer) {
			return new QMBuffer(Buffer.from(source));
		} else if (hasTextEncoder) {
			if (!textEncoder) {
				textEncoder = new TextEncoder();
			}
			return new QMBuffer(textEncoder.encode(source));
		} else {
			return new QMBuffer(strings.encodeUTF8(source));
		}
	}

	static concat(buffers: QMBuffer[], totalLength?: number): QMBuffer {
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


	readonly buffer: Uint8Array;
	readonly byteLength: number;

	private constructor(buffer: Uint8Array) {
		this.buffer = buffer;
		this.byteLength = this.buffer.length;
	}

	toString(): string {
		if (hasBuffer) {
			return this.buffer.toString();
		} else if (hasTextDecoder) {
			if (!textDecoder) {
				textDecoder = new TextDecoder();
			}
			return textDecoder.decode(this.buffer);
		} else {
			return strings.decodeUTF8(this.buffer);
		}
	}

	slice(start?: number, end?: number): QMBuffer {
		return new QMBuffer(this.buffer.subarray(start, end));
	}

	set(array: QMBuffer, offset?: number): void;
	set(array: Uint8Array, offset?: number): void;
	set(array: QMBuffer | Uint8Array, offset?: number): void {
		if (array instanceof QMBuffer) {
			this.buffer.set(array.buffer, offset);
		} else {
			this.buffer.set(array, offset);
		}
	}

	readUInt32BE(offset: number): number {
		return readUInt32BE(this.buffer, offset);
	}

	writeUInt32BE(value: number, offset: number): void {
		writeUInt32BE(this.buffer, value, offset);
	}

	readUInt32LE(offset: number): number {
		return readUInt32LE(this.buffer, offset);
	}

	writeUInt32LE(value: number, offset: number): void {
		writeUInt32LE(this.buffer, value, offset);
	}

	readUInt8(offset: number): number {
		return readUInt8(this.buffer, offset);
	}

	writeUInt8(value: number, offset: number): void {
		writeUInt8(this.buffer, value, offset);
	}



}

export interface QMBufferReadable extends streams.Readable<QMBuffer> { }

export interface QMBufferReadableStream extends streams.ReadableStream<QMBuffer> { }

export interface QMBufferWriteableStream extends streams.WriteableStream<QMBuffer> { }

export interface QMBufferReadableBufferedStream extends streams.ReadableBufferedStream<QMBuffer> { }

export function readUInt16LE(source: Uint8Array, offset: number): number {
	return (
		((source[offset + 0] << 0) >>> 0) |
		((source[offset + 1] << 8) >>> 0)
	);
}

export function writeUInt16LE(destination: Uint8Array, value: number, offset: number): void {
	destination[offset + 0] = (value & 0b11111111);
	value = value >>> 8;
	destination[offset + 1] = (value & 0b11111111);
}

export function readUInt32BE(source: Uint8Array, offset: number): number {
	return (
		source[offset] * 2 ** 24
		+ source[offset + 1] * 2 ** 16
		+ source[offset + 2] * 2 ** 8
		+ source[offset + 3]
	);
}

export function writeUInt32BE(destination: Uint8Array, value: number, offset: number): void {
	destination[offset + 3] = value;
	value = value >>> 8;
	destination[offset + 2] = value;
	value = value >>> 8;
	destination[offset + 1] = value;
	value = value >>> 8;
	destination[offset] = value;
}

export function readUInt32LE(source: Uint8Array, offset: number): number {
	return (
		((source[offset + 0] << 0) >>> 0) |
		((source[offset + 1] << 8) >>> 0) |
		((source[offset + 2] << 16) >>> 0) |
		((source[offset + 3] << 24) >>> 0)
	);
}

export function writeUInt32LE(destination: Uint8Array, value: number, offset: number): void {
	destination[offset + 0] = (value & 0b11111111);
	value = value >>> 8;
	destination[offset + 1] = (value & 0b11111111);
	value = value >>> 8;
	destination[offset + 2] = (value & 0b11111111);
	value = value >>> 8;
	destination[offset + 3] = (value & 0b11111111);
}

export function readUInt8(source: Uint8Array, offset: number): number {
	return source[offset];
}

export function writeUInt8(destination: Uint8Array, value: number, offset: number): void {
	destination[offset] = value;
}

export function readableToBuffer(readable: QMBufferReadable): QMBuffer {
	return streams.consumeReadable<QMBuffer>(readable, chunks => QMBuffer.concat(chunks));
}

export function bufferToReadable(buffer: QMBuffer): QMBufferReadable {
	return streams.toReadable<QMBuffer>(buffer);
}

export function streamToBuffer(stream: streams.ReadableStream<QMBuffer>): Promise<QMBuffer> {
	return streams.consumeStream<QMBuffer>(stream, chunks => QMBuffer.concat(chunks));
}

export async function bufferedStreamToBuffer(bufferedStream: streams.ReadableBufferedStream<QMBuffer>): Promise<QMBuffer> {
	if (bufferedStream.ended) {
		return QMBuffer.concat(bufferedStream.buffer);
	}

	return QMBuffer.concat([

		// Include already read chunks...
		...bufferedStream.buffer,

		// ...and all additional chunks
		await streamToBuffer(bufferedStream.stream)
	]);
}

export function bufferToStream(buffer: QMBuffer): streams.ReadableStream<QMBuffer> {
	return streams.toStream<QMBuffer>(buffer, chunks => QMBuffer.concat(chunks));
}

export function streamToBufferReadableStream(stream: streams.ReadableStreamEvents<Uint8Array | string>): streams.ReadableStream<QMBuffer> {
	return streams.transform<Uint8Array | string, QMBuffer>(stream, { data: data => typeof data === 'string' ? QMBuffer.fromString(data) : QMBuffer.wrap(data) }, chunks => QMBuffer.concat(chunks));
}

export function newWriteableBufferStream(options?: streams.WriteableStreamOptions): streams.WriteableStream<QMBuffer> {
	return streams.newWriteableStream<QMBuffer>(chunks => QMBuffer.concat(chunks), options);
}

export function prefixedBufferReadable(prefix: QMBuffer, readable: QMBufferReadable): QMBufferReadable {
	return streams.prefixedReadable(prefix, readable, chunks => QMBuffer.concat(chunks));
}

export function prefixedBufferStream(prefix: QMBuffer, stream: QMBufferReadableStream): QMBufferReadableStream {
	return streams.prefixedStream(prefix, stream, chunks => QMBuffer.concat(chunks));
}
