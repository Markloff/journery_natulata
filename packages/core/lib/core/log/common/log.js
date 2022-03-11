"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogLevelToString = exports.parseLogLevel = exports.getLogLevel = exports.NullLogService = exports.AbstractLoggerService = exports.LogService = exports.MultiplexLogService = exports.AdapterLogger = exports.ConsoleLogger = exports.ConsoleMainLogger = exports.AbstractMessageLogger = exports.AbstractLogger = exports.DEFAULT_LOG_LEVEL = exports.LogLevel = exports.ILogService = void 0;
const common_1 = require("../../../core/instantiation/common");
const common_2 = require("../../../core/base/common");
exports.ILogService = (0, common_1.createDecorator)('logService');
function now() {
    return new Date().toISOString();
}
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["Trace"] = 0] = "Trace";
    LogLevel[LogLevel["Debug"] = 1] = "Debug";
    LogLevel[LogLevel["Info"] = 2] = "Info";
    LogLevel[LogLevel["Warning"] = 3] = "Warning";
    LogLevel[LogLevel["Error"] = 4] = "Error";
    LogLevel[LogLevel["Critical"] = 5] = "Critical";
    LogLevel[LogLevel["Off"] = 6] = "Off";
})(LogLevel = exports.LogLevel || (exports.LogLevel = {}));
exports.DEFAULT_LOG_LEVEL = LogLevel.Info;
class AbstractLogger extends common_2.Disposable {
    constructor() {
        super(...arguments);
        this.level = exports.DEFAULT_LOG_LEVEL;
        this._onDidChangeLogLevel = this._register(new common_2.Emitter());
        this.onDidChangeLogLevel = this._onDidChangeLogLevel.event;
    }
    setLevel(level) {
        if (this.level !== level) {
            this.level = level;
            this._onDidChangeLogLevel.fire(this.level);
        }
    }
    getLevel() {
        return this.level;
    }
}
exports.AbstractLogger = AbstractLogger;
class AbstractMessageLogger extends AbstractLogger {
    constructor(logAlways) {
        super();
        this.logAlways = logAlways;
    }
    checkLogLevel(level) {
        return this.logAlways || this.getLevel() <= level;
    }
    trace(message, ...args) {
        if (this.checkLogLevel(LogLevel.Trace)) {
            this.log(LogLevel.Trace, this.format([message, ...args]));
        }
    }
    debug(message, ...args) {
        if (this.checkLogLevel(LogLevel.Debug)) {
            this.log(LogLevel.Debug, this.format([message, ...args]));
        }
    }
    info(message, ...args) {
        if (this.checkLogLevel(LogLevel.Info)) {
            this.log(LogLevel.Info, this.format([message, ...args]));
        }
    }
    warn(message, ...args) {
        if (this.checkLogLevel(LogLevel.Warning)) {
            this.log(LogLevel.Warning, this.format([message, ...args]));
        }
    }
    error(message, ...args) {
        if (this.checkLogLevel(LogLevel.Error)) {
            if (message instanceof Error) {
                const array = Array.prototype.slice.call(arguments);
                array[0] = message.stack;
                this.log(LogLevel.Error, this.format(array));
            }
            else {
                this.log(LogLevel.Error, this.format([message, ...args]));
            }
        }
    }
    critical(message, ...args) {
        if (this.checkLogLevel(LogLevel.Critical)) {
            this.log(LogLevel.Critical, this.format([message, ...args]));
        }
    }
    flush() { }
    format(args) {
        let result = '';
        for (let i = 0; i < args.length; i++) {
            let a = args[i];
            if (typeof a === 'object') {
                try {
                    a = JSON.stringify(a);
                }
                catch (e) { }
            }
            result += (i > 0 ? ' ' : '') + a;
        }
        return result;
    }
}
exports.AbstractMessageLogger = AbstractMessageLogger;
class ConsoleMainLogger extends AbstractLogger {
    constructor(logLevel = exports.DEFAULT_LOG_LEVEL) {
        super();
        this.setLevel(logLevel);
        this.useColors = !common_2.isWindows;
    }
    trace(message, ...args) {
        if (this.getLevel() <= LogLevel.Trace) {
            if (this.useColors) {
                console.log(`\x1b[90m[main ${now()}]\x1b[0m`, message, ...args);
            }
            else {
                console.log(`[main ${now()}]`, message, ...args);
            }
        }
    }
    debug(message, ...args) {
        if (this.getLevel() <= LogLevel.Debug) {
            if (this.useColors) {
                console.log(`\x1b[90m[main ${now()}]\x1b[0m`, message, ...args);
            }
            else {
                console.log(`[main ${now()}]`, message, ...args);
            }
        }
    }
    info(message, ...args) {
        if (this.getLevel() <= LogLevel.Info) {
            if (this.useColors) {
                console.log(`\x1b[90m[main ${now()}]\x1b[0m`, message, ...args);
            }
            else {
                console.log(`[main ${now()}]`, message, ...args);
            }
        }
    }
    warn(message, ...args) {
        if (this.getLevel() <= LogLevel.Warning) {
            if (this.useColors) {
                console.warn(`\x1b[93m[main ${now()}]\x1b[0m`, message, ...args);
            }
            else {
                console.warn(`[main ${now()}]`, message, ...args);
            }
        }
    }
    error(message, ...args) {
        if (this.getLevel() <= LogLevel.Error) {
            if (this.useColors) {
                console.error(`\x1b[91m[main ${now()}]\x1b[0m`, message, ...args);
            }
            else {
                console.error(`[main ${now()}]`, message, ...args);
            }
        }
    }
    critical(message, ...args) {
        if (this.getLevel() <= LogLevel.Critical) {
            if (this.useColors) {
                console.error(`\x1b[90m[main ${now()}]\x1b[0m`, message, ...args);
            }
            else {
                console.error(`[main ${now()}]`, message, ...args);
            }
        }
    }
    dispose() {
        // noop
    }
    flush() {
        // noop
    }
}
exports.ConsoleMainLogger = ConsoleMainLogger;
class ConsoleLogger extends AbstractLogger {
    constructor(logLevel = exports.DEFAULT_LOG_LEVEL) {
        super();
        this.setLevel(logLevel);
    }
    trace(message, ...args) {
        if (this.getLevel() <= LogLevel.Trace) {
            console.log('%cTRACE', 'color: #888', message, ...args);
        }
    }
    debug(message, ...args) {
        if (this.getLevel() <= LogLevel.Debug) {
            console.log('%cDEBUG', 'background: #eee; color: #888', message, ...args);
        }
    }
    info(message, ...args) {
        if (this.getLevel() <= LogLevel.Info) {
            console.log('%c INFO', 'color: #33f', message, ...args);
        }
    }
    warn(message, ...args) {
        if (this.getLevel() <= LogLevel.Warning) {
            console.log('%c WARN', 'color: #993', message, ...args);
        }
    }
    error(message, ...args) {
        if (this.getLevel() <= LogLevel.Error) {
            console.log('%c  ERR', 'color: #f33', message, ...args);
        }
    }
    critical(message, ...args) {
        if (this.getLevel() <= LogLevel.Critical) {
            console.log('%cCRITI', 'background: #f33; color: white', message, ...args);
        }
    }
    dispose() {
        // noop
    }
    flush() {
        // noop
    }
}
exports.ConsoleLogger = ConsoleLogger;
class AdapterLogger extends AbstractLogger {
    constructor(adapter, logLevel = exports.DEFAULT_LOG_LEVEL) {
        super();
        this.adapter = adapter;
        this.setLevel(logLevel);
    }
    trace(message, ...args) {
        if (this.getLevel() <= LogLevel.Trace) {
            this.adapter.log(LogLevel.Trace, [this.extractMessage(message), ...args]);
        }
    }
    debug(message, ...args) {
        if (this.getLevel() <= LogLevel.Debug) {
            this.adapter.log(LogLevel.Debug, [this.extractMessage(message), ...args]);
        }
    }
    info(message, ...args) {
        if (this.getLevel() <= LogLevel.Info) {
            this.adapter.log(LogLevel.Info, [this.extractMessage(message), ...args]);
        }
    }
    warn(message, ...args) {
        if (this.getLevel() <= LogLevel.Warning) {
            this.adapter.log(LogLevel.Warning, [this.extractMessage(message), ...args]);
        }
    }
    error(message, ...args) {
        if (this.getLevel() <= LogLevel.Error) {
            this.adapter.log(LogLevel.Error, [this.extractMessage(message), ...args]);
        }
    }
    critical(message, ...args) {
        if (this.getLevel() <= LogLevel.Critical) {
            this.adapter.log(LogLevel.Critical, [this.extractMessage(message), ...args]);
        }
    }
    extractMessage(msg) {
        if (typeof msg === 'string') {
            return msg;
        }
        return (0, common_2.toErrorMessage)(msg, this.getLevel() <= LogLevel.Trace);
    }
    dispose() {
        // noop
    }
    flush() {
        // noop
    }
}
exports.AdapterLogger = AdapterLogger;
class MultiplexLogService extends AbstractLogger {
    constructor(logServices) {
        super();
        this.logServices = logServices;
        if (logServices.length) {
            this.setLevel(logServices[0].getLevel());
        }
    }
    setLevel(level) {
        for (const logService of this.logServices) {
            logService.setLevel(level);
        }
        super.setLevel(level);
    }
    trace(message, ...args) {
        for (const logService of this.logServices) {
            logService.trace(message, ...args);
        }
    }
    debug(message, ...args) {
        for (const logService of this.logServices) {
            logService.debug(message, ...args);
        }
    }
    info(message, ...args) {
        for (const logService of this.logServices) {
            logService.info(message, ...args);
        }
    }
    warn(message, ...args) {
        for (const logService of this.logServices) {
            logService.warn(message, ...args);
        }
    }
    error(message, ...args) {
        for (const logService of this.logServices) {
            logService.error(message, ...args);
        }
    }
    critical(message, ...args) {
        for (const logService of this.logServices) {
            logService.critical(message, ...args);
        }
    }
    flush() {
        for (const logService of this.logServices) {
            logService.flush();
        }
    }
    dispose() {
        for (const logService of this.logServices) {
            logService.dispose();
        }
    }
}
exports.MultiplexLogService = MultiplexLogService;
class LogService extends common_2.Disposable {
    constructor(logger) {
        super();
        this.logger = logger;
        this._register(logger);
    }
    get onDidChangeLogLevel() {
        return this.logger.onDidChangeLogLevel;
    }
    setLevel(level) {
        this.logger.setLevel(level);
    }
    getLevel() {
        return this.logger.getLevel();
    }
    trace(message, ...args) {
        this.logger.trace(message, ...args);
    }
    debug(message, ...args) {
        this.logger.debug(message, ...args);
    }
    info(message, ...args) {
        this.logger.info(message, ...args);
    }
    warn(message, ...args) {
        this.logger.warn(message, ...args);
    }
    error(message, ...args) {
        this.logger.error(message, ...args);
    }
    critical(message, ...args) {
        this.logger.critical(message, ...args);
    }
    flush() {
        this.logger.flush();
    }
}
exports.LogService = LogService;
class AbstractLoggerService extends common_2.Disposable {
    constructor(logLevel, onDidChangeLogLevel) {
        super();
        this.logLevel = logLevel;
        this.loggers = new Map();
        this.logLevelChangeableLoggers = [];
        this._register(onDidChangeLogLevel(logLevel => {
            this.logLevel = logLevel;
            this.logLevelChangeableLoggers.forEach(logger => logger.setLevel(logLevel));
        }));
    }
    getLogger(resource) {
        return this.loggers.get(resource.toString());
    }
    createLogger(resource, options) {
        let logger = this.loggers.get(resource.toString());
        if (!logger) {
            logger = this.doCreateLogger(resource, (options === null || options === void 0 ? void 0 : options.always) ? LogLevel.Trace : this.logLevel, options);
            this.loggers.set(resource.toString(), logger);
            if (!(options === null || options === void 0 ? void 0 : options.always)) {
                this.logLevelChangeableLoggers.push(logger);
            }
        }
        return logger;
    }
    dispose() {
        this.logLevelChangeableLoggers.splice(0, this.logLevelChangeableLoggers.length);
        this.loggers.forEach(logger => logger.dispose());
        this.loggers.clear();
        super.dispose();
    }
}
exports.AbstractLoggerService = AbstractLoggerService;
class NullLogService {
    constructor() {
        this.onDidChangeLogLevel = new common_2.Emitter().event;
    }
    setLevel(level) { }
    getLevel() { return LogLevel.Info; }
    trace(message, ...args) { }
    debug(message, ...args) { }
    info(message, ...args) { }
    warn(message, ...args) { }
    error(message, ...args) { }
    critical(message, ...args) { }
    dispose() { }
    flush() { }
}
exports.NullLogService = NullLogService;
function getLogLevel() {
    return exports.DEFAULT_LOG_LEVEL;
}
exports.getLogLevel = getLogLevel;
function parseLogLevel(logLevel) {
    switch (logLevel) {
        case 'trace':
            return LogLevel.Trace;
        case 'debug':
            return LogLevel.Debug;
        case 'info':
            return LogLevel.Info;
        case 'warn':
            return LogLevel.Warning;
        case 'error':
            return LogLevel.Error;
        case 'critical':
            return LogLevel.Critical;
        case 'off':
            return LogLevel.Off;
    }
    return undefined;
}
exports.parseLogLevel = parseLogLevel;
function LogLevelToString(logLevel) {
    switch (logLevel) {
        case LogLevel.Trace: return 'trace';
        case LogLevel.Debug: return 'debug';
        case LogLevel.Info: return 'info';
        case LogLevel.Warning: return 'warn';
        case LogLevel.Error: return 'error';
        case LogLevel.Critical: return 'critical';
        case LogLevel.Off: return 'off';
    }
}
exports.LogLevelToString = LogLevelToString;
