import { IDisposable } from '../../../core/base/common/lifecycle';
export interface CancellationToken {
    readonly isCancellationRequested: boolean;
    readonly onCancellationRequested: (listener: (e: any) => any, thisArgs?: any, disposables?: IDisposable[]) => IDisposable;
}
export declare namespace CancellationToken {
    function isCancellationToken(thing: unknown): thing is CancellationToken;
    const None: CancellationToken;
    const Cancelled: CancellationToken;
}
export declare class CancellationTokenSource implements IDisposable {
    private _token?;
    private _parentListener?;
    constructor(parent?: CancellationToken);
    get token(): CancellationToken;
    cancel(): void;
    dispose(cancel?: boolean): void;
}
