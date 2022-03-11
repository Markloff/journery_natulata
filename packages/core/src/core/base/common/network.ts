import { URI } from '@/core/base/common/uri';
import * as platform from '@/core/base/common/platform';


export namespace Schemas {

	/**
	 * A schema that is used for models that exist in memory
	 * only and that have no correspondence on a server or such.
	 */
	export const inMemory = 'inmemory';

	/**
	 * A schema that is used for setting files
	 */
	export const qqmusic = 'qqmusic';

	/**
	 * A schema that is used for internal private files
	 */
	export const internal = 'private';

	/**
	 * A walk-through document.
	 */
	export const walkThrough = 'walkThrough';

	/**
	 * An embedded code snippet.
	 */
	export const walkThroughSnippet = 'walkThroughSnippet';

	export const http = 'http';

	export const https = 'https';

	export const file = 'file';

	export const mailto = 'mailto';

	export const untitled = 'untitled';

	export const data = 'data';

	export const command = 'command';

	export const qqmusicRemote = 'qqmusic-remote';

	export const qqmusicRemoteResource = 'qqmusic-remote-resource';

	export const userData = 'qqmusic-userdata';


	export const qqmusicSettings = 'qqmusic-settings';

	export const qqmusicTerminal = 'qqmusic-terminal';

	export const webviewPanel = 'webview-panel';

	/**
	 * Scheme used for loading the wrapper html and script in webviews.
	 */
	export const qqmusicWebview = 'qqmusic-webview';

	/**
	 * Scheme used for extension pages
	 */
	export const extension = 'extension';

	/**
	 * Scheme used as a replacement of `file` scheme to load
	 * files with our custom protocol handler (desktop only).
	 */
	export const qqmusicFileResource = 'qqmusic-file';

	/**
	 * Scheme used for temporary resources
	 */
	export const tmp = 'tmp';
}

class RemoteAuthoritiesImpl {
	private readonly _hosts: { [authority: string]: string | undefined; } = Object.create(null);
	private readonly _ports: { [authority: string]: number | undefined; } = Object.create(null);
	private readonly _connectionTokens: { [authority: string]: string | undefined; } = Object.create(null);
	private _preferredWebSchema: 'http' | 'https' = 'http';
	private _delegate: ((uri: URI) => URI) | null = null;

	setPreferredWebSchema(schema: 'http' | 'https') {
		this._preferredWebSchema = schema;
	}

	setDelegate(delegate: (uri: URI) => URI): void {
		this._delegate = delegate;
	}

	set(authority: string, host: string, port: number): void {
		this._hosts[authority] = host;
		this._ports[authority] = port;
	}

	setConnectionToken(authority: string, connectionToken: string): void {
		this._connectionTokens[authority] = connectionToken;
	}

	rewrite(uri: URI): URI {
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
		return URI.from({
			scheme: platform.isWeb ? this._preferredWebSchema : Schemas.qqmusicRemoteResource,
			authority: `${host}:${port}`,
			path: `/qqmusic-remote-resource`,
			query
		});
	}
}

export const RemoteAuthorities = new RemoteAuthoritiesImpl();

class FileAccessImpl {

	private readonly FALLBACK_AUTHORITY = 'qqmusic-app';

	/**
	 * Returns a URI to use in contexts where the browser is responsible
	 * for loading (e.g. fetch()) or when used within the DOM.
	 *
	 * **Note:** use `dom.ts#asCSSUrl` whenever the URL is to be used in CSS context.
	 */
	asBrowserUri(uri: URI): URI;
	asBrowserUri(moduleId: string, moduleIdToUrl: { toUrl(moduleId: string): string }, __forceCodeFileUri?: boolean): URI;
	asBrowserUri(uriOrModule: URI | string, moduleIdToUrl?: { toUrl(moduleId: string): string }, __forceCodeFileUri?: boolean): URI {
		const uri = this.toUri(uriOrModule, moduleIdToUrl);

		// Handle remote URIs via `RemoteAuthorities`
		if (uri.scheme === Schemas.qqmusicRemote) {
			return RemoteAuthorities.rewrite(uri);
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

	/**
	 * Returns the `file` URI to use in contexts where node.js
	 * is responsible for loading.
	 */
	asFileUri(uri: URI): URI;
	asFileUri(moduleId: string, moduleIdToUrl: { toUrl(moduleId: string): string }): URI;
	asFileUri(uriOrModule: URI | string, moduleIdToUrl?: { toUrl(moduleId: string): string }): URI {
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

	private toUri(uriOrModule: URI | string, moduleIdToUrl?: { toUrl(moduleId: string): string }): URI {
		if (URI.isUri(uriOrModule)) {
			return uriOrModule;
		}

		return URI.parse(moduleIdToUrl!.toUrl(uriOrModule));
	}
}

export const FileAccess = new FileAccessImpl();
