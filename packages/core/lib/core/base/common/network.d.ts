import { URI } from '../../../core/base/common/uri';
export declare namespace Schemas {
    /**
     * A schema that is used for models that exist in memory
     * only and that have no correspondence on a server or such.
     */
    const inMemory = "inmemory";
    /**
     * A schema that is used for setting files
     */
    const qqmusic = "qqmusic";
    /**
     * A schema that is used for internal private files
     */
    const internal = "private";
    /**
     * A walk-through document.
     */
    const walkThrough = "walkThrough";
    /**
     * An embedded code snippet.
     */
    const walkThroughSnippet = "walkThroughSnippet";
    const http = "http";
    const https = "https";
    const file = "file";
    const mailto = "mailto";
    const untitled = "untitled";
    const data = "data";
    const command = "command";
    const qqmusicRemote = "qqmusic-remote";
    const qqmusicRemoteResource = "qqmusic-remote-resource";
    const userData = "qqmusic-userdata";
    const qqmusicSettings = "qqmusic-settings";
    const qqmusicTerminal = "qqmusic-terminal";
    const webviewPanel = "webview-panel";
    /**
     * Scheme used for loading the wrapper html and script in webviews.
     */
    const qqmusicWebview = "qqmusic-webview";
    /**
     * Scheme used for extension pages
     */
    const extension = "extension";
    /**
     * Scheme used as a replacement of `file` scheme to load
     * files with our custom protocol handler (desktop only).
     */
    const qqmusicFileResource = "qqmusic-file";
    /**
     * Scheme used for temporary resources
     */
    const tmp = "tmp";
}
declare class RemoteAuthoritiesImpl {
    private readonly _hosts;
    private readonly _ports;
    private readonly _connectionTokens;
    private _preferredWebSchema;
    private _delegate;
    setPreferredWebSchema(schema: 'http' | 'https'): void;
    setDelegate(delegate: (uri: URI) => URI): void;
    set(authority: string, host: string, port: number): void;
    setConnectionToken(authority: string, connectionToken: string): void;
    rewrite(uri: URI): URI;
}
export declare const RemoteAuthorities: RemoteAuthoritiesImpl;
declare class FileAccessImpl {
    private readonly FALLBACK_AUTHORITY;
    /**
     * Returns a URI to use in contexts where the browser is responsible
     * for loading (e.g. fetch()) or when used within the DOM.
     *
     * **Note:** use `dom.ts#asCSSUrl` whenever the URL is to be used in CSS context.
     */
    asBrowserUri(uri: URI): URI;
    asBrowserUri(moduleId: string, moduleIdToUrl: {
        toUrl(moduleId: string): string;
    }, __forceCodeFileUri?: boolean): URI;
    /**
     * Returns the `file` URI to use in contexts where node.js
     * is responsible for loading.
     */
    asFileUri(uri: URI): URI;
    asFileUri(moduleId: string, moduleIdToUrl: {
        toUrl(moduleId: string): string;
    }): URI;
    private toUri;
}
export declare const FileAccess: FileAccessImpl;
export {};
