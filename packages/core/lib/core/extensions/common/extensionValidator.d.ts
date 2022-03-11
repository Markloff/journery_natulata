export interface IParsedVersion {
    hasCaret: boolean;
    hasGreaterEquals: boolean;
    majorBase: number;
    majorMustEqual: boolean;
    minorBase: number;
    minorMustEqual: boolean;
    patchBase: number;
    patchMustEqual: boolean;
    preRelease: string | null;
}
export interface INormalizedVersion {
    majorBase: number;
    majorMustEqual: boolean;
    minorBase: number;
    minorMustEqual: boolean;
    patchBase: number;
    patchMustEqual: boolean;
    notBefore: number;
    isMinimum: boolean;
}
export declare function isValidVersionStr(version: string): boolean;
export declare function parseVersion(version: string): IParsedVersion | null;
export declare function normalizeVersion(version: IParsedVersion | null): INormalizedVersion | null;
export declare function isValidVersion(_inputVersion: string | INormalizedVersion, _inputDate: ProductDate, _desiredVersion: string | INormalizedVersion): boolean;
export interface IReducedExtensionDescription {
    isBuiltin: boolean;
    engines: {
        vscode: string;
    };
    main?: string;
}
declare type ProductDate = string | Date | undefined;
export declare function isValidExtensionVersion(version: string, date: ProductDate, extensionDesc: IReducedExtensionDescription, notices: string[]): boolean;
export declare function isEngineValid(engine: string, version: string, date: ProductDate): boolean;
export {};
