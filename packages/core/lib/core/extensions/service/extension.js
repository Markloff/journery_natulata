"use strict";
// import { ExtensionIdentifier, IExtensionDescription } from '../../../core/extensions/common/extension';
// import { URI } from '../../../core/base/common/uri';
// import { createDecorator } from '../../../core/instantiation/common/instantiation'
// import Severity from '../../../core/base/common/severity';
// import { Event } from '../../../core/base/common/event';
//
// export const NullExtensionDescription = Object.freeze(<IExtensionDescription>{
// 	identifier: new ExtensionIdentifier('nullExtensionDescription'),
// 	name: 'Null Extension Description',
// 	version: '0.0.0',
// 	publisher: 'vscode',
// 	engines: { vscode: '' },
// 	extensionLocation: URI.parse('void:location'),
// 	isBuiltin: false,
// });
//
// export type WebWorkerExtHostConfigValue = boolean | 'auto';
// export const webWorkerExtHostConfig = 'extensions.webWorker';
//
// export const IExtensionService = createDecorator<IExtensionService>('extensionService');
//
// export interface IMessage {
// 	type: Severity;
// 	message: string;
// 	extensionId: ExtensionIdentifier;
// 	extensionPointId: string;
// }
//
// export  enum ExtensionRunningLocation {
// 	None,
// 	LocalProcess,
// 	LocalWebWorker,
// 	Remote
// }
//
// export function extensionRunningLocationToString(location: ExtensionRunningLocation) {
// 	switch (location) {
// 		case ExtensionRunningLocation.None:
// 			return 'None';
// 		case ExtensionRunningLocation.LocalProcess:
// 			return 'LocalProcess';
// 		case ExtensionRunningLocation.LocalWebWorker:
// 			return 'LocalWebWorker';
// 		case ExtensionRunningLocation.Remote:
// 			return 'Remote';
// 	}
// }
//
// export interface IExtensionStatus {
// 	message: IMessage[];
// 	activationTimes: ActivationTimes | undefined;
// 	runtimeErrors: Error[];
// 	runningLocation: ExtensionRunningLocation;
// }
//
// export class MissingExtensionDependency {
// 	constructor(readonly dependency: string) { }
// }
//
// export interface IExtensionHostProfile {
// 	startTime: number;
// 	endTime: number;
// 	deltas: number[];
// 	ids: ProfileSegmentId[];
// 	data: object;
// 	getAggregatedTimes(): Map<ProfileSegmentId, number>;
// }
//
// export const enum ExtensionHostKind {
// 	LocalProcess,
// 	LocalWebWorker,
// 	Remote,
// }
//
// export function extensionHostKindToString(kind: ExtensionHostKind): string {
// 	switch (kind) {
// 		case ExtensionHostKind.LocalProcess: return 'LocalProcess';
// 		case ExtensionHostKind.LocalWebWorker: return 'LocalWebWorker';
// 		case ExtensionHostKind.Remote: return 'Remote';
// 	}
// }
//
// export interface IExtensionHost {
// 	readonly kind: ExtensionHostKind;
// 	readonly remoteAuthority: string | null;
// 	readonly lazyStart: boolean;
// 	readonly onExit: Event<[number, string | null]>;
//
// 	start(): Promise<any> | null;
// 	getInspectPort(): number | undefined;
// 	enableInspectPort(): Promise<boolean>;
// 	dispose(): void;
// }
//
// export type ProfileSegmentId = string | 'ideal' | 'program' | 'gc' | 'self';
//
// export class ActivationTimes {
// 	constructor(
// 		public readonly codeLoadingTime: number,
// 		public readonly activateCallTime: number,
// 		public readonly activateResolvedTime: number,
// 		public readonly activationReason: ExtensionActivationReason
// 	) {
// 	}
// }
//
// export interface IExtensionService {
//
// }
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
