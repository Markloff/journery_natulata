import assets from 'assert';
import { CommandsRegistry } from '@/core/commands/common/commands';
import { suite, test } from 'mocha';
import assert from 'assert';
suite('Command Tests', function() {

	test('register command - no handler', function() {
		assets.throws(() => CommandsRegistry.registerCommand('foo', null!));
	})
	
	test('register/dispose', () => {
		const command = function () {};
		const reg = CommandsRegistry.registerCommand('foo', command);
		assets.ok(CommandsRegistry.getCommand('foo')!.handler === command);
		reg.dispose();
		assets.ok(CommandsRegistry.getCommand('foo') === undefined);
	});
	
	test('register/register/dispose', () => {
		const command1 = function () { };
		const command2 = function () { };
		
		// dispose overriding command
		let reg1 = CommandsRegistry.registerCommand('foo', command1);
		assert.ok(CommandsRegistry.getCommand('foo')!.handler === command1);
		
		let reg2 = CommandsRegistry.registerCommand('foo', command2);
		assert.ok(CommandsRegistry.getCommand('foo')!.handler === command2);
		reg2.dispose();
		
		assert.ok(CommandsRegistry.getCommand('foo')!.handler === command1);
		reg1.dispose();
		assert.ok(CommandsRegistry.getCommand('foo') === undefined);
	})
	
});
