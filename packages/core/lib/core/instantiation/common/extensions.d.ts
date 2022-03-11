import { SyncDescriptor } from './descriptors';
import { ServiceIdentifier, BrandedService } from './instantiation';
export declare function registerSingleton<T, Services extends BrandedService[]>(id: ServiceIdentifier<T>, ctor: new (...services: Services) => T, supportDelayedInstantiation?: boolean): void;
export declare function registerSingleton<T, Services extends BrandedService[]>(id: ServiceIdentifier<T>, descriptor: SyncDescriptor<any>): void;
export declare function getSingletonServiceDescriptors(): [ServiceIdentifier<any>, SyncDescriptor<any>][];
