
let _isWindows = false;
let _isMacintosh = false;
let _isLinux = false;
let _isLinuxSnap = false;
let _isNative = false;
let _isWeb = false;
let _isIOS = false;
let _isAndroid = false;
let _isMusic = false;
let _userAgent: string | undefined = undefined;

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

declare const process: INodeProcess;
declare const global: unknown;
declare const self: unknown;

export const globals: any = (typeof self === 'object' ? self : typeof global === 'object' ? global : {});

interface INavigator {
	userAgent: string;
	language: string;
	maxTouchPoints?: number;
}
declare const navigator: INavigator;

let nodeProcess: INodeProcess | undefined = undefined;
if (typeof globals.qqmusic !== 'undefined' && typeof globals.qqmusic.process !== 'undefined') {
	// Native environment (sandboxed)
	nodeProcess = globals.qqmusic.process;
} else if (typeof process !== 'undefined') {
	// Native environment (non-sandboxed)
	nodeProcess = process;
}
const isElectronRenderer = typeof nodeProcess?.versions?.electron === 'string' && nodeProcess.type === 'renderer';

interface ISetImmediate {
	(callback: (...args: unknown[]) => void): void;
}

export const setImmediate: ISetImmediate = (function defineSetImmediate() {
	if (globals.setImmediate) {
		return globals.setImmediate.bind(globals);
	}
	if (typeof globals.postMessage === 'function' && !globals.importScripts) {
		interface IQueueElement {
			id: number;
			callback: () => void;
		}
		let pending: IQueueElement[] = [];
		globals.addEventListener('message', (e: MessageEvent) => {
			if (e.data && e.data.vscodeSetImmediateId) {
				for (let i = 0, len = pending.length; i < len; i++) {
					const candidate = pending[i];
					if (candidate.id === e.data.vscodeSetImmediateId) {
						pending.splice(i, 1);
						candidate.callback();
						return;
					}
				}
			}
		});
		let lastId = 0;
		return (callback: () => void) => {
			const myId = ++lastId;
			pending.push({
				id: myId,
				callback: callback
			});
			globals.postMessage({ vscodeSetImmediateId: myId }, '*');
		};
	}
	if (typeof nodeProcess?.nextTick === 'function') {
		return nodeProcess.nextTick.bind(nodeProcess);
	}
	const _promise = Promise.resolve();
	return (callback: (...args: unknown[]) => void) => _promise.then(callback);
})();



// Web environment
if (typeof navigator === 'object' && !isElectronRenderer) {
	_userAgent = navigator.userAgent;
	_isWindows = _userAgent.indexOf('Windows') >= 0;
	_isMacintosh = _userAgent.indexOf('Macintosh') >= 0;
	_isIOS = (_userAgent.indexOf('Macintosh') >= 0 || _userAgent.indexOf('iPad') >= 0 || _userAgent.indexOf('iPhone') >= 0) && !!navigator.maxTouchPoints && navigator.maxTouchPoints > 0;
	_isLinux = _userAgent.indexOf('Linux') >= 0;
	_isAndroid = _userAgent.indexOf('Android') >= 0;
	_isMusic = Boolean(_userAgent.match(/\bQQMUSIC\/(\d[\.\d]*)/i)) || Boolean(_userAgent.match(/QQMUSIC\/(\d[\.\d]*)/i));
	_isWeb = true;
} else if (typeof nodeProcess === 'object') {
	_isWindows = (nodeProcess.platform === 'win32');
	_isMacintosh = (nodeProcess.platform === 'darwin');
	_isLinux = (nodeProcess.platform === 'linux');
	_isLinuxSnap = _isLinux && !!nodeProcess.env['SNAP'] && !!nodeProcess.env['SNAP_REVISION'];
	_isNative = true;
}


export const enum Platform {
	Web,
	Mac,
	Linux,
	Windows
}
export function PlatformToString(platform: Platform) {
	switch (platform) {
		case Platform.Web: return 'Web';
		case Platform.Mac: return 'Mac';
		case Platform.Linux: return 'Linux';
		case Platform.Windows: return 'Windows';
	}
}

let _platform: Platform = Platform.Web;
if (_isMacintosh) {
	_platform = Platform.Mac;
} else if (_isWindows) {
	_platform = Platform.Windows;
} else if (_isLinux) {
	_platform = Platform.Linux;
}

export const isWindows = _isWindows;
export const isMacintosh = _isMacintosh;
export const isLinux = _isLinux;
export const isLinuxSnap = _isLinuxSnap;
export const isNative = _isNative;
export const isWeb = _isWeb;
export const isIOS = _isIOS;
export const isAndroid = _isAndroid;
export const platform = _platform;
export const userAgent = _userAgent;
export const isMusic = _isMusic;
export const isMobile = isIOS || isAndroid;

let _isLittleEndian = true;
let _isLittleEndianComputed = false;

export function isLittleEndian(): boolean {
	if (!_isLittleEndianComputed) {
		_isLittleEndianComputed = true;
		const test = new Uint8Array(2);
		test[0] = 1;
		test[1] = 2;
		const view = new Uint16Array(test.buffer);
		_isLittleEndian = (view[0] === (2 << 8) + 1);
	}
	return _isLittleEndian;
}
