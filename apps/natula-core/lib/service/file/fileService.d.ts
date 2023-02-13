import { IDisposable } from 'core';
export interface IFileService {
    _serviceBrand: undefined;
    createDictionary(path: string): IDisposable | void;
    removeDictionary(path: string): void;
}
export declare const IFileService: import("core").ServiceIdentifier<IFileService>;
export declare class FileService implements IFileService {
    readonly _serviceBrand: undefined;
    createDictionary(path: string): IDisposable | void;
    removeDictionary(path: string): void;
}
