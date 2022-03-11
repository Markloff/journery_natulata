
import { SyncDescriptor } from './descriptors';
import { ServiceIdentifier, BrandedService } from './instantiation';

const _registry: [ServiceIdentifier<any>, SyncDescriptor<any>][] = [];

export function registerSingleton<T, Services extends BrandedService[]>(id: ServiceIdentifier<T>, ctor: new (...services: Services) => T, supportDelayedInstantiation?: boolean): void;
export function registerSingleton<T, Services extends BrandedService[]>(id: ServiceIdentifier<T>, descriptor: SyncDescriptor<any>): void;
export function registerSingleton<T, Services extends BrandedService[]>(id: ServiceIdentifier<T>, ctorDescriptor: { new(...services: Services): T } | SyncDescriptor<any>, supportsDelayedInstantiation?: boolean): void {
	if (!(ctorDescriptor instanceof SyncDescriptor)) {
		ctorDescriptor = new SyncDescriptor(ctorDescriptor as new (...args: any[]) => T, [], supportsDelayedInstantiation);
	}

	_registry.push([id, ctorDescriptor]);
}

export function getSingletonServiceDescriptors(): [ServiceIdentifier<any>, SyncDescriptor<any>][] {
	return _registry;
}
