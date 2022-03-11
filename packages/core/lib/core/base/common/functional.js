"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.once = void 0;
function once(fn) {
    const _this = this;
    let didCall = false;
    let result;
    return function () {
        if (didCall) {
            return result;
        }
        didCall = true;
        result = fn.apply(_this, arguments);
        return result;
    };
}
exports.once = once;
