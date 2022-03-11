export interface IProcessEnvironment {
    [key: string]: string | undefined;
}
export interface INodeProcess {
    platform: string;
    env: IProcessEnvironment;
    nextTick?: (callback: (...args: any[]) => void) => void;
    versions?: {
        electron?: string;
    };
    sandboxed?: boolean;
    type?: string;
    cwd: () => string;
}
export declare const globals: any;
interface ISetImmediate {
    (callback: (...args: unknown[]) => void): void;
}
export declare const setImmediate: ISetImmediate;
export declare const enum Platform {
    Web = 0,
    Mac = 1,
    Linux = 2,
    Windows = 3
}
export declare function PlatformToString(platform: Platform): "Windows" | "Linux" | "Web" | "Mac";
export declare const isWindows: boolean;
export declare const isMacintosh: boolean;
export declare const isLinux: boolean;
export declare const isLinuxSnap: boolean;
export declare const isNative: boolean;
export declare const isWeb: boolean;
export declare const isIOS: boolean;
export declare const isAndroid: boolean;
export declare const platform: Platform;
export declare const userAgent: string | undefined;
export declare const isMusic: boolean;
export declare const isMobile: boolean;
export declare function isLittleEndian(): boolean;
export {};
