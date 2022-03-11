/**
 * Identifies a service of type T
 */
import { ServiceCollection } from '../../../core/instantiation/common/serviceCollection';
import * as descriptors from './descriptors';
export interface ServiceIdentifier<T> {
    (...args: any[]): void;
    type: T;
}
/**
 * 这里是存储生成的装饰器的，避免重复生成
 * DI means Dependency Injection 依赖注入
 * DI_TARGET和DI_DEPENDENCIES是自定义的两个key
 */
export declare namespace _util {
    const servicesIds: Map<string, ServiceIdentifier<any>>;
    const DI_TARGET = "$di$target";
    const DI_DEPENDENCIES = "$di$dependencies";
    function getServiceDependencies(ctor: any): {
        id: ServiceIdentifier<any>;
        index: number;
        optional: boolean;
    }[];
}
export declare function createDecorator<T>(serviceId: string): ServiceIdentifier<T>;
export declare function refineServiceDecorator<T1, T extends T1>(serviceIdentifier: ServiceIdentifier<T1>): ServiceIdentifier<T>;
/**
 * Mark a service dependency as optional.
 */
export declare function optional<T>(serviceIdentifier: ServiceIdentifier<T>): (target: Function, key: string, index: number) => void;
export declare type BrandedService = {
    _serviceBrand: undefined;
};
export interface IConstructorSignature0<T> {
    new (...services: BrandedService[]): T;
}
export interface IConstructorSignature1<A1, T> {
    new <Services extends BrandedService[]>(first: A1, ...services: Services): T;
}
export interface IConstructorSignature2<A1, A2, T> {
    new (first: A1, second: A2, ...services: BrandedService[]): T;
}
export interface IConstructorSignature3<A1, A2, A3, T> {
    new (first: A1, second: A2, third: A3, ...services: BrandedService[]): T;
}
export interface IConstructorSignature4<A1, A2, A3, A4, T> {
    new (first: A1, second: A2, third: A3, fourth: A4, ...services: BrandedService[]): T;
}
export interface IConstructorSignature5<A1, A2, A3, A4, A5, T> {
    new (first: A1, second: A2, third: A3, fourth: A4, fifth: A5, ...services: BrandedService[]): T;
}
export interface IConstructorSignature6<A1, A2, A3, A4, A5, A6, T> {
    new (first: A1, second: A2, third: A3, fourth: A4, fifth: A5, sixth: A6, ...services: BrandedService[]): T;
}
export interface IConstructorSignature7<A1, A2, A3, A4, A5, A6, A7, T> {
    new (first: A1, second: A2, third: A3, fourth: A4, fifth: A5, sixth: A6, seventh: A7, ...services: BrandedService[]): T;
}
export interface IConstructorSignature8<A1, A2, A3, A4, A5, A6, A7, A8, T> {
    new (first: A1, second: A2, third: A3, fourth: A4, fifth: A5, sixth: A6, seventh: A7, eigth: A8, ...services: BrandedService[]): T;
}
export interface ServicesAccessor {
    get<T>(id: ServiceIdentifier<T>): T;
    get<T>(id: ServiceIdentifier<T>, isOptional: typeof optional): T | undefined;
}
/**
 * Given a list of arguments as a tuple, attempt to extract the leading, non-service arguments
 * to their own tuple.
 */
declare type GetLeadingNonServiceArgs<Args> = Args extends [...BrandedService[]] ? [] : Args extends [infer A1, ...BrandedService[]] ? [A1] : Args extends [infer A1, infer A2, ...BrandedService[]] ? [A1, A2] : Args extends [infer A1, infer A2, infer A3, ...BrandedService[]] ? [A1, A2, A3] : Args extends [infer A1, infer A2, infer A3, infer A4, ...BrandedService[]] ? [A1, A2, A3, A4] : Args extends [infer A1, infer A2, infer A3, infer A4, infer A5, ...BrandedService[]] ? [A1, A2, A3, A4, A5] : Args extends [infer A1, infer A2, infer A3, infer A4, infer A5, infer A6, ...BrandedService[]] ? [A1, A2, A3, A4, A5, A6] : Args extends [infer A1, infer A2, infer A3, infer A4, infer A5, infer A6, infer A7, ...BrandedService[]] ? [A1, A2, A3, A4, A5, A6, A7] : Args extends [infer A1, infer A2, infer A3, infer A4, infer A5, infer A6, infer A7, infer A8, ...BrandedService[]] ? [A1, A2, A3, A4, A5, A6, A7, A8] : never;
export declare const IInstantiationService: ServiceIdentifier<IInstantiationService>;
export interface IInstantiationService {
    readonly _serviceBrand: undefined;
    createInstance<T>(descriptor: descriptors.SyncDescriptor0<T>): T;
    createInstance<A1, T>(descriptor: descriptors.SyncDescriptor1<A1, T>, a1: A1): T;
    createInstance<A1, A2, T>(descriptor: descriptors.SyncDescriptor2<A1, A2, T>, a1: A1, a2: A2): T;
    createInstance<A1, A2, A3, T>(descriptor: descriptors.SyncDescriptor3<A1, A2, A3, T>, a1: A1, a2: A2, a3: A3): T;
    createInstance<A1, A2, A3, A4, T>(descriptor: descriptors.SyncDescriptor4<A1, A2, A3, A4, T>, a1: A1, a2: A2, a3: A3, a4: A4): T;
    createInstance<A1, A2, A3, A4, A5, T>(descriptor: descriptors.SyncDescriptor5<A1, A2, A3, A4, A5, T>, a1: A1, a2: A2, a3: A3, a4: A4, a5: A5): T;
    createInstance<A1, A2, A3, A4, A5, A6, T>(descriptor: descriptors.SyncDescriptor6<A1, A2, A3, A4, A5, A6, T>, a1: A1, a2: A2, a3: A3, a4: A4, a5: A5, a6: A6): T;
    createInstance<A1, A2, A3, A4, A5, A6, A7, T>(descriptor: descriptors.SyncDescriptor7<A1, A2, A3, A4, A5, A6, A7, T>, a1: A1, a2: A2, a3: A3, a4: A4, a5: A5, a6: A6, a7: A7): T;
    createInstance<A1, A2, A3, A4, A5, A6, A7, A8, T>(descriptor: descriptors.SyncDescriptor8<A1, A2, A3, A4, A5, A6, A7, A8, T>, a1: A1, a2: A2, a3: A3, a4: A4, a5: A5, a6: A6, a7: A7, a8: A8): T;
    createInstance<Ctor extends new (...args: any[]) => any, R extends InstanceType<Ctor>>(t: Ctor, ...args: GetLeadingNonServiceArgs<ConstructorParameters<Ctor>>): R;
    invokeFunction<R, TS extends any[] = []>(fn: (accessor: ServicesAccessor, ...args: TS) => R, ...args: TS): R;
    createChild(services: ServiceCollection): IInstantiationService;
}
export {};
