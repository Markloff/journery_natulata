import { IInstantiationService, ServicesAccessor } from '../../../core/instantiation/common/instantiation';
import { ServiceCollection } from '../../../core/instantiation/common/serviceCollection';
import { SyncDescriptor } from '../../../core/instantiation/common/descriptors';
export declare class InstantiationService implements IInstantiationService {
    readonly _serviceBrand: undefined;
    private readonly _services;
    private readonly _strict;
    private readonly _parent?;
    constructor(services?: ServiceCollection, strict?: boolean, parent?: InstantiationService);
    createChild(services: ServiceCollection): IInstantiationService;
    invokeFunction<R, TS extends any[] = []>(fn: (accessor: ServicesAccessor, ...args: TS) => R, ...args: TS): R;
    createInstance(ctorOrDescriptor: any | SyncDescriptor<any>, ...rest: any[]): any;
    private _createInstance;
    private _setServiceInstance;
    private _getServiceInstanceOrDescriptor;
    private _getOrCreateServiceInstance;
    private readonly _activeInstantiations;
    private _safeCreateAndCacheServiceInstance;
    private _createAndCacheServiceInstance;
    private _createServiceInstanceWithOwner;
    private _createServiceInstance;
}
