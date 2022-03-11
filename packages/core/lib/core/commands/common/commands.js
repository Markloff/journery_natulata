"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandService = exports.CommandsRegistry = exports.ICommandService = void 0;
const instantiation_1 = require("../../../core/instantiation/common/instantiation");
const event_1 = require("../../../core/base/common/event");
const type_1 = require("../../../core/base/common/type");
const lifecycle_1 = require("../../../core/base/common/lifecycle");
const LinkedList_1 = require("../../../core/base/common/LinkedList");
const iterator_1 = require("../../../core/base/common/iterator");
const extensions_1 = require("../../../core/instantiation/common/extensions");
exports.ICommandService = (0, instantiation_1.createDecorator)('commandService');
exports.CommandsRegistry = new class {
    constructor() {
        this._commands = new Map();
        this._onDidRegisterCommand = new event_1.Emitter();
        this.onDidRegisterCommand = this._onDidRegisterCommand.event;
    }
    registerCommand(idOrCommand, handler) {
        if (!idOrCommand) {
            throw new Error('invalid Command');
        }
        if (typeof idOrCommand === 'string') {
            if (!handler) {
                throw new Error(`invalid command`);
            }
            return this.registerCommand({ id: idOrCommand, handler });
        }
        if (idOrCommand.description) {
            const constrains = [];
            for (let arg of idOrCommand.description.args) {
                constrains.push(arg.constraint);
            }
            const actualHandler = idOrCommand.handler;
            idOrCommand.handler = function (accessor, ...args) {
                (0, type_1.validateConstraints)(args, constrains);
                return actualHandler(accessor, ...args);
            };
        }
        const { id } = idOrCommand;
        let commands = this._commands.get(id);
        if (!commands) {
            commands = new LinkedList_1.LinkedList();
            this._commands.set(id, commands);
        }
        let removeFn = commands.unshift(idOrCommand);
        let ret = (0, lifecycle_1.toDisposable)(() => {
            removeFn();
            const command = this._commands.get(id);
            if (command === null || command === void 0 ? void 0 : command.isEmpty()) {
                this._commands.delete(id);
            }
        });
        this._onDidRegisterCommand.fire(id);
        return ret;
    }
    registerCommandAlias(oldId, newId) {
        return exports.CommandsRegistry.registerCommand(oldId, (accessor, args) => accessor.get(exports.ICommandService).executeCommand(newId, ...args));
    }
    getCommand(id) {
        const list = this._commands.get(id);
        if (!list || list.isEmpty()) {
            return undefined;
        }
        return iterator_1.Iterable.first(list);
    }
    getCommands() {
        const result = new Map();
        for (const key of this._commands.keys()) {
            const command = this.getCommand(key);
            if (command) {
                result.set(key, command);
            }
        }
        return result;
    }
};
let CommandService = class CommandService extends lifecycle_1.Disposable {
    constructor(_instantiationService) {
        super();
        this._instantiationService = _instantiationService;
        this._onWillExecuteCommand = this._register(new event_1.Emitter());
        this.onWillExecuteCommand = this._onWillExecuteCommand.event;
        this._onDidExecuteCommand = new event_1.Emitter();
        this.onDidExecuteCommand = this._onDidExecuteCommand.event;
    }
    executeCommand(id, ...args) {
        return this._tryExecuteCommand(id, args);
    }
    _tryExecuteCommand(id, ...args) {
        const command = exports.CommandsRegistry.getCommand(id);
        if (!command) {
            return Promise.reject(new Error(`command ${id} not found`));
        }
        try {
            this._onWillExecuteCommand.fire({ commandId: id, args });
            const result = this._instantiationService.invokeFunction(command.handler, ...args);
            this._onDidExecuteCommand.fire({ commandId: id, args });
            return Promise.resolve(result);
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
};
CommandService = __decorate([
    __param(0, instantiation_1.IInstantiationService),
    __metadata("design:paramtypes", [Object])
], CommandService);
exports.CommandService = CommandService;
(0, extensions_1.registerSingleton)(exports.ICommandService, CommandService, true);
