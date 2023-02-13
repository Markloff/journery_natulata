"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StopWatch = void 0;
const platform_1 = require("../../../core/base/common/platform");
/**
 * performance提供高精度的时间精度，Date只能精确到千分之一秒，performance可以拿到毫秒的千分之一精度
 */
const hasPerformanceNow = (platform_1.globals.performance && typeof platform_1.globals.performance.now === 'function');
class StopWatch {
    static create(highResolution = true) {
        return new StopWatch(highResolution);
    }
    constructor(highResolution) {
        this._highResolution = hasPerformanceNow && highResolution;
        this._startTime = this._now();
        this._stopTime = -1;
    }
    _now() {
        return this._highResolution ? platform_1.globals.performance.now() : Date.now();
    }
    stop() {
        this._stopTime = this._now();
    }
    elapsed() {
        if (this._stopTime !== -1) {
            return this._stopTime - this._startTime;
        }
        return this._now() - this._startTime;
    }
}
exports.StopWatch = StopWatch;
