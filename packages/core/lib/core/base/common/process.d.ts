/**
 * Provides safe access to the `cwd` property in node.js, sandboxed or web
 * environments.
 *
 * Note: in web, this property is hardcoded to be `/`.
 */
export declare const cwd: () => string;
/**
 * Provides safe access to the `env` property in node.js, sandboxed or web
 * environments.
 *
 * Note: in web, this property is hardcoded to be `{}`.
 */
export declare const env: import("./platform").IProcessEnvironment;
/**
 * Provides safe access to the `platform` property in node.js, sandboxed or web
 * environments.
 */
export declare const platform: string;
/**
 * Provides safe access to the `nextTick` method in node.js, sandboxed or web
 * environments.
 */
export declare const nextTick: ((callback: (...args: any[]) => void) => void) & ((callback: (...args: any[]) => void) => void);
