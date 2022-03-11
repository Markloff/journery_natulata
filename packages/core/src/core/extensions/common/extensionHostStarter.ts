import { createDecorator } from '@/core/instantiation/common';
import { Event } from '@/core/base/common/event';
import { SerializedError } from '@/core/base/common/errors';
export const IExtensionHostStarter = createDecorator<IExtensionHostStarter>('extensionHostStarter');

export const ipcExtensionHostStarterChannelName = 'extensionHostStarter';

export interface IExtensionHostProcessOptions {
	env: { [key: string]: string | undefined; };
	detached: boolean;
	execArgv: string[] | undefined;
	silent: boolean;
}

export interface IExtensionHostStarter {
	readonly _serviceBrand: undefined;


	onDynamicStdout(id: string): Event<string>;
	onDynamicStderr(id: string): Event<string>;
	onDynamicMessage(id: string): Event<any>;
	onDynamicError(id: string): Event<{ error: SerializedError; }>;
	onDynamicExit(id: string): Event<{ code: number; signal: string }>;

	createExtensionHost(): Promise<{ id: string; }>;
	start(id: string, opts: IExtensionHostProcessOptions): Promise<{ pid: number; }>;
	enableInspectPort(id: string): Promise<boolean>;
	kill(id: string): Promise<void>;
}
