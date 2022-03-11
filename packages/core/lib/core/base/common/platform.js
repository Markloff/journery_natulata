"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.isLittleEndian = exports.isMobile = exports.isMusic = exports.userAgent = exports.platform = exports.isAndroid = exports.isIOS = exports.isWeb = exports.isNative = exports.isLinuxSnap = exports.isLinux = exports.isMacintosh = exports.isWindows = exports.PlatformToString = exports.Platform = exports.setImmediate = exports.globals = void 0;
let _isWindows = false;
let _isMacintosh = false;
let _isLinux = false;
let _isLinuxSnap = false;
let _isNative = false;
let _isWeb = false;
let _isIOS = false;
let _isAndroid = false;
let _isMusic = false;
let _userAgent = undefined;
exports.globals = (typeof self === 'object' ? self : typeof global === 'object' ? global : {});
let nodeProcess = undefined;
if (typeof exports.globals.qqmusic !== 'undefined' && typeof exports.globals.qqmusic.process !== 'undefined') {
    // Native environment (sandboxed)
    nodeProcess = exports.globals.qqmusic.process;
}
else if (typeof process !== 'undefined') {
    // Native environment (non-sandboxed)
    nodeProcess = process;
}
const isElectronRenderer = typeof ((_a = nodeProcess === null || nodeProcess === void 0 ? void 0 : nodeProcess.versions) === null || _a === void 0 ? void 0 : _a.electron) === 'string' && nodeProcess.type === 'renderer';
exports.setImmediate = (function defineSetImmediate() {
    if (exports.globals.setImmediate) {
        return exports.globals.setImmediate.bind(exports.globals);
    }
    if (typeof exports.globals.postMessage === 'function' && !exports.globals.importScripts) {
        let pending = [];
        exports.globals.addEventListener('message', (e) => {
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
        return (callback) => {
            const myId = ++lastId;
            pending.push({
                id: myId,
                callback: callback
            });
            exports.globals.postMessage({ vscodeSetImmediateId: myId }, '*');
        };
    }
    if (typeof (nodeProcess === null || nodeProcess === void 0 ? void 0 : nodeProcess.nextTick) === 'function') {
        return nodeProcess.nextTick.bind(nodeProcess);
    }
    const _promise = Promise.resolve();
    return (callback) => _promise.then(callback);
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
}
else if (typeof nodeProcess === 'object') {
    _isWindows = (nodeProcess.platform === 'win32');
    _isMacintosh = (nodeProcess.platform === 'darwin');
    _isLinux = (nodeProcess.platform === 'linux');
    _isLinuxSnap = _isLinux && !!nodeProcess.env['SNAP'] && !!nodeProcess.env['SNAP_REVISION'];
    _isNative = true;
}
var Platform;
(function (Platform) {
    Platform[Platform["Web"] = 0] = "Web";
    Platform[Platform["Mac"] = 1] = "Mac";
    Platform[Platform["Linux"] = 2] = "Linux";
    Platform[Platform["Windows"] = 3] = "Windows";
})(Platform = exports.Platform || (exports.Platform = {}));
function PlatformToString(platform) {
    switch (platform) {
        case 0 /* Web */: return 'Web';
        case 1 /* Mac */: return 'Mac';
        case 2 /* Linux */: return 'Linux';
        case 3 /* Windows */: return 'Windows';
    }
}
exports.PlatformToString = PlatformToString;
let _platform = 0 /* Web */;
if (_isMacintosh) {
    _platform = 1 /* Mac */;
}
else if (_isWindows) {
    _platform = 3 /* Windows */;
}
else if (_isLinux) {
    _platform = 2 /* Linux */;
}
exports.isWindows = _isWindows;
exports.isMacintosh = _isMacintosh;
exports.isLinux = _isLinux;
exports.isLinuxSnap = _isLinuxSnap;
exports.isNative = _isNative;
exports.isWeb = _isWeb;
exports.isIOS = _isIOS;
exports.isAndroid = _isAndroid;
exports.platform = _platform;
exports.userAgent = _userAgent;
exports.isMusic = _isMusic;
exports.isMobile = exports.isIOS || exports.isAndroid;
let _isLittleEndian = true;
let _isLittleEndianComputed = false;
function isLittleEndian() {
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
exports.isLittleEndian = isLittleEndian;
