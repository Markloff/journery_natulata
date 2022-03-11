"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileAccess = exports.RemoteAuthorities = exports.Schemas = void 0;
const uri_1 = require("../../../core/base/common/uri");
const platform = __importStar(require("../../../core/base/common/platform"));
var Schemas;
(function (Schemas) {
    /**
     * A schema that is used for models that exist in memory
     * only and that have no correspondence on a server or such.
     */
    Schemas.inMemory = 'inmemory';
    /**
     * A schema that is used for setting files
     */
    Schemas.qqmusic = 'qqmusic';
    /**
     * A schema that is used for internal private files
     */
    Schemas.internal = 'private';
    /**
     * A walk-through document.
     */
    Schemas.walkThrough = 'walkThrough';
    /**
     * An embedded code snippet.
     */
    Schemas.walkThroughSnippet = 'walkThroughSnippet';
    Schemas.http = 'http';
    Schemas.https = 'https';
    Schemas.file = 'file';
    Schemas.mailto = 'mailto';
    Schemas.untitled = 'untitled';
    Schemas.data = 'data';
    Schemas.command = 'command';
    Schemas.qqmusicRemote = 'qqmusic-remote';
    Schemas.qqmusicRemoteResource = 'qqmusic-remote-resource';
    Schemas.userData = 'qqmusic-userdata';
    Schemas.qqmusicSettings = 'qqmusic-settings';
    Schemas.qqmusicTerminal = 'qqmusic-terminal';
    Schemas.webviewPanel = 'webview-panel';
    /**
     * Scheme used for loading the wrapper html and script in webviews.
     */
    Schemas.qqmusicWebview = 'qqmusic-webview';
    /**
     * Scheme used for extension pages
     */
    Schemas.extension = 'extension';
    /**
     * Scheme used as a replacement of `file` scheme to load
     * files with our custom protocol handler (desktop only).
     */
    Schemas.qqmusicFileResource = 'qqmusic-file';
    /**
     * Scheme used for temporary resources
     */
    Schemas.tmp = 'tmp';
})(Schemas = exports.Schemas || (exports.Schemas = {}));
class RemoteAuthoritiesImpl {
    constructor() {
        this._hosts = Object.create(null);
        this._ports = Object.create(null);
        this._connectionTokens = Object.create(null);
        this._preferredWebSchema = 'http';
        this._delegate = null;
    }
    setPreferredWebSchema(schema) {
        this._preferredWebSchema = schema;
    }
    setDelegate(delegate) {
        this._delegate = delegate;
    }
    set(authority, host, port) {
        this._hosts[authority] = host;
        this._ports[authority] = port;
    }
    setConnectionToken(authority, connectionToken) {
        this._connectionTokens[authority] = connectionToken;
    }
    rewrite(uri) {
        if (this._delegate) {
            return this._delegate(uri);
        }
        const authority = uri.authority;
        let host = this._hosts[authority];
        if (host && host.indexOf(':') !== -1) {
            host = `[${host}]`;
        }
        const port = this._ports[authority];
        const connectionToken = this._connectionTokens[authority];
        let query = `path=${encodeURIComponent(uri.path)}`;
        if (typeof connectionToken === 'string') {
            query += `&tkn=${encodeURIComponent(connectionToken)}`;
        }
        return uri_1.URI.from({
            scheme: platform.isWeb ? this._preferredWebSchema : Schemas.qqmusicRemoteResource,
            authority: `${host}:${port}`,
            path: `/qqmusic-remote-resource`,
            query
        });
    }
}
exports.RemoteAuthorities = new RemoteAuthoritiesImpl();
class FileAccessImpl {
    constructor() {
        this.FALLBACK_AUTHORITY = 'qqmusic-app';
    }
    asBrowserUri(uriOrModule, moduleIdToUrl, __forceCodeFileUri) {
        const uri = this.toUri(uriOrModule, moduleIdToUrl);
        // Handle remote URIs via `RemoteAuthorities`
        if (uri.scheme === Schemas.qqmusicRemote) {
            return exports.RemoteAuthorities.rewrite(uri);
        }
        let convertToQqmusicFileResource = false;
        // Only convert the URI if we are in a native context and it has `file:` scheme
        // and we have explicitly enabled the conversion (sandbox, or qqmusic_BROWSER_CODE_LOADING)
        if (platform.isNative && __forceCodeFileUri && uri.scheme === Schemas.file) {
            convertToQqmusicFileResource = true;
        }
        // Also convert `file:` URIs in the web worker extension host (running in desktop) case
        if (uri.scheme === Schemas.file && typeof platform.globals.importScripts === 'function' && platform.globals.origin === 'qqmusic-file://qqmusic-app') {
            convertToQqmusicFileResource = true;
        }
        if (convertToQqmusicFileResource) {
            return uri.with({
                scheme: Schemas.qqmusicFileResource,
                // We need to provide an authority here so that it can serve
                // as origin for network and loading matters in chromium.
                // If the URI is not coming with an authority already, we
                // add our own
                authority: uri.authority || this.FALLBACK_AUTHORITY,
                query: null,
                fragment: null
            });
        }
        return uri;
    }
    asFileUri(uriOrModule, moduleIdToUrl) {
        const uri = this.toUri(uriOrModule, moduleIdToUrl);
        // Only convert the URI if it is `qqmusic-file:` scheme
        if (uri.scheme === Schemas.qqmusicFileResource) {
            return uri.with({
                scheme: Schemas.file,
                // Only preserve the `authority` if it is different from
                // our fallback authority. This ensures we properly preserve
                // Windows UNC paths that come with their own authority.
                authority: uri.authority !== this.FALLBACK_AUTHORITY ? uri.authority : null,
                query: null,
                fragment: null
            });
        }
        return uri;
    }
    toUri(uriOrModule, moduleIdToUrl) {
        if (uri_1.URI.isUri(uriOrModule)) {
            return uriOrModule;
        }
        return uri_1.URI.parse(moduleIdToUrl.toUrl(uriOrModule));
    }
}
exports.FileAccess = new FileAccessImpl();
