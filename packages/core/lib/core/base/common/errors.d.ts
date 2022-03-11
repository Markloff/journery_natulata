export declare function illegalState(name?: string): Error;
export interface ErrorListenerCallback {
    (error: any): void;
}
export interface ErrorListenerUnbind {
    (): void;
}
export declare class ErrorHandler {
    private unexpectedErrorHandler;
    private listeners;
    constructor();
    addListener(listener: ErrorListenerCallback): ErrorListenerUnbind;
    private emit;
    private _removeListener;
    setUnexpectedErrorHandler(newUnexpectedErrorHandler: (e: any) => void): void;
    getUnexpectedErrorHandler(): (e: any) => void;
    onUnexpectedError(e: any): void;
    onUnexpectedExternalError(e: any): void;
}
export declare const errorHandler: ErrorHandler;
export declare function setUnexpectedErrorHandler(newUnexpectedErrorHandler: (e: any) => void): void;
export declare function onUnexpectedError(e: any): undefined;
/**
 * Returns an error that signals cancellation.
 */
export declare function canceled(): Error;
/**
 * Checks if the given error is a promise in canceled state
 */
export declare function isPromiseCanceledError(error: any): boolean;
export interface SerializedError {
    readonly $isError: true;
    readonly name: string;
    readonly message: string;
    readonly stack: string;
}
