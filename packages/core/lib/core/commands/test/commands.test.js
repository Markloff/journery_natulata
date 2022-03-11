"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const commands_1 = require("../../../core/commands/common/commands");
const mocha_1 = require("mocha");
const assert_2 = __importDefault(require("assert"));
(0, mocha_1.suite)('Command Tests', function () {
    (0, mocha_1.test)('register command - no handler', function () {
        assert_1.default.throws(() => commands_1.CommandsRegistry.registerCommand('foo', null));
    });
    (0, mocha_1.test)('register/dispose', () => {
        const command = function () { };
        const reg = commands_1.CommandsRegistry.registerCommand('foo', command);
        assert_1.default.ok(commands_1.CommandsRegistry.getCommand('foo').handler === command);
        reg.dispose();
        assert_1.default.ok(commands_1.CommandsRegistry.getCommand('foo') === undefined);
    });
    (0, mocha_1.test)('register/register/dispose', () => {
        const command1 = function () { };
        const command2 = function () { };
        // dispose overriding command
        let reg1 = commands_1.CommandsRegistry.registerCommand('foo', command1);
        assert_2.default.ok(commands_1.CommandsRegistry.getCommand('foo').handler === command1);
        let reg2 = commands_1.CommandsRegistry.registerCommand('foo', command2);
        assert_2.default.ok(commands_1.CommandsRegistry.getCommand('foo').handler === command2);
        reg2.dispose();
        assert_2.default.ok(commands_1.CommandsRegistry.getCommand('foo').handler === command1);
        reg1.dispose();
        assert_2.default.ok(commands_1.CommandsRegistry.getCommand('foo') === undefined);
    });
});
