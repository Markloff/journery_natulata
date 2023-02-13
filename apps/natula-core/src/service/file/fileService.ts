import { createDecorator, IDisposable, registerSingleton, toDisposable } from 'core';
import { ensureDirSync, removeSync } from 'fs-extra';


export interface IFileService {
	_serviceBrand: undefined;
	createDictionary(path: string): IDisposable | void;
	removeDictionary(path: string): void;
}

export const IFileService = createDecorator<IFileService>('IFileService');


export class FileService implements IFileService {
	public readonly _serviceBrand: undefined;

	createDictionary(path: string): IDisposable | void {
		try {
			ensureDirSync(path);
			return toDisposable(() => this.removeDictionary(path));
		} catch (err) {
			throw new Error(`Create dictionary ${path} failed`);
		}
	}

	removeDictionary(path: string) {
		try {
			removeSync(path);
		} catch (err) {
			throw new Error(`Remove dictionary ${path} failed`);
		}
	}
}
