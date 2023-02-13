import { IDisposable } from '../../../core/base/common/lifecycle';
export interface IFileService {
    _serviceBrand: undefined;
    createDictionary(path: string): IDisposable;
    removeDictionary(): void;
}
export declare const IFileService: import("../../../core/instantiation/common/instantiation").ServiceIdentifier<IFileService>;
export declare class FileService implements IFileService {
    readonly _serviceBrand: undefined;
    createDictionary(path: string): IDisposable;
    removeDictionary(): void;
}
