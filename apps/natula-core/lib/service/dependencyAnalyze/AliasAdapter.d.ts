export interface IAliasService {
    readonly _serviceBrand: undefined;
    check(path: string): boolean;
    transfer(path: string): string;
}
export declare class AliasService implements IAliasService {
    readonly _serviceBrand: undefined;
    private readonly _aliasMap;
    constructor();
    check(path: string): boolean;
    transfer(path: string): string;
}
