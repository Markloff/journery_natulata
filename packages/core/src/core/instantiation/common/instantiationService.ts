import {
	_util,
	IInstantiationService,
	optional,
	ServiceIdentifier,
	ServicesAccessor,
} from '@/core/instantiation/common/instantiation';
import { ServiceCollection } from '@/core/instantiation/common/serviceCollection';
import { SyncDescriptor } from '@/core/instantiation/common/descriptors';
import { illegalState } from '@/core/base/common/errors';
import { Graph } from '@/core/instantiation/common/graph';
import { IdleValue } from '@/core/base/common/async';


const _enableTracing = false;

class CyclicDependencyError extends Error {
	constructor(graph: Graph<any>) {
		super('cycle dependency between services');
		this.message = graph.findCycleSlow() ?? `UNABLE to detect cycle, dumping graph: \n${graph.toString()}`;
	}
}


export class InstantiationService implements IInstantiationService {

	declare readonly _serviceBrand: undefined;

	private readonly _services: ServiceCollection;
	private readonly _strict: boolean;
	private readonly _parent?: InstantiationService;

	constructor(services: ServiceCollection = new ServiceCollection(), strict: boolean = false, parent?: InstantiationService) {
		this._services = services;
		this._strict = strict;
		this._parent = parent;

		this._services.set(IInstantiationService, this);
	}

	createChild(services: ServiceCollection): IInstantiationService {
		return new InstantiationService(services, this._strict, this);
	}

	invokeFunction<R, TS extends any[] = []>(fn: (accessor: ServicesAccessor, ...args: TS) => R, ...args: TS): R {
		let _trace = Trace.traceCreation(fn);
		let _done = false;
		try {
			const accessor: ServicesAccessor = {
				get: <T>(id: ServiceIdentifier<T>, isOptional?: typeof optional): T => {
					if (_done) {
						throw illegalState('service accessor is only valid during the invocation of its target method');
					}

					const result = this._getOrCreateServiceInstance(id, _trace);
					if (!result && isOptional !== optional) {
						throw new Error(`[invokeFunction] unknown service ${id}`);
					}
					return result;
				}
			};
			return fn(accessor, ...args);
		} finally {
			_done = true;
			_trace.stop();
		}
	}

	createInstance(ctorOrDescriptor: any | SyncDescriptor<any>, ...rest: any[]): any {
		let _trace: Trace;
		let result: any;
		if (ctorOrDescriptor instanceof SyncDescriptor) {
			_trace = Trace.traceCreation(ctorOrDescriptor.ctor);
			result = this._createInstance(ctorOrDescriptor.ctor, ctorOrDescriptor.staticArguments.concat(rest), _trace);
		} else {
			_trace = Trace.traceCreation(ctorOrDescriptor);
			result = this._createInstance(ctorOrDescriptor, rest, _trace);
		}
		_trace.stop();
		return result;
	}

	private _createInstance<T>(ctor: any, args: any[] = [], _trace: Trace): T {
		let serviceDependencies = _util.getServiceDependencies(ctor).sort((a, b) => a.index - b.index);
		let serviceArgs: any[] = [];
		for (const dependency of serviceDependencies) {
			let service = this._getOrCreateServiceInstance(dependency.id, _trace);
			if (!service && this._strict && !dependency.optional) {
				throw new Error(`[createInstance] ${ctor.name}`)
			}
			serviceArgs.push(service);
		}

		let firstServiceArgPos = serviceDependencies.length > 0 ? serviceDependencies[0].index : args.length;

		if (args.length !== firstServiceArgPos) {
			console.warn(`[createInstance First service dependency of ${ctor.name}] at position ${firstServiceArgPos + 1} conflicts with ${args.length} static arguments`);
			let delta = firstServiceArgPos - args.length;
			if (delta > 0) {
				args = args.concat(new Array(delta));
			} else {
				args = args.slice(0, firstServiceArgPos);
			}
		}

		return <T>new ctor(...[...args, ...serviceArgs]);
	}

	private _setServiceInstance<T>(id: ServiceIdentifier<T>, instance: T): void {
		if (this._services.get(id) instanceof SyncDescriptor) {
			this._services.set(id, instance);
		} else if (this._parent) {
			this._parent._setServiceInstance(id, instance);
		} else {
			throw new Error('illegalState - setting UNKNOWN service instance');
		}
	}

	private _getServiceInstanceOrDescriptor<T>(id: ServiceIdentifier<T>): T | SyncDescriptor<T> {
		let instanceOrDesc = this._services.get(id);
		if (!instanceOrDesc && this._parent) {
			return this._parent._getServiceInstanceOrDescriptor(id);
		} else {
			return instanceOrDesc;
		}
	}

	private _getOrCreateServiceInstance<T>(id: ServiceIdentifier<T>, _trace: Trace): T {
		let thing = this._getServiceInstanceOrDescriptor(id);
		if (thing instanceof SyncDescriptor) {
			return this._safeCreateAndCacheServiceInstance(id, thing, _trace.branch(id, true));
		} else {
			_trace.branch(id, false);
			return thing;
		}
	}

	private readonly _activeInstantiations = new Set<ServiceIdentifier<any>>();

	private _safeCreateAndCacheServiceInstance<T>(id: ServiceIdentifier<T>, desc: SyncDescriptor<T>, _trace: Trace): T {
		if (this._activeInstantiations.has(id)) {
			// 递归创建
			throw new Error(`illegal state - RECURSIVELY instantiating service '${id}'`);
		}
		this._activeInstantiations.add(id);
		try {
			return this._createAndCacheServiceInstance(id, desc, _trace);
		} finally {
			this._activeInstantiations.delete(id);
		}
	}

	private _createAndCacheServiceInstance<T>(id: ServiceIdentifier<T>, desc: SyncDescriptor<T>, _trace: Trace): T {
		type Triple = { id: ServiceIdentifier<any>, desc: SyncDescriptor<any>, _trace: Trace; };
		const graph = new Graph<Triple>(data => data.id.toString());

		let cycleCount = 0;
		const stack = [{ id, desc, _trace }];

		while (stack.length) {
			const item = stack.pop()!;
			graph.lookupOrInsertNode(item);

			if (cycleCount ++ > 1000) {
				throw new CyclicDependencyError(graph);
			}

			for (let dependency of _util.getServiceDependencies(item.desc.ctor)) {

				let instanceOrDesc = this._getServiceInstanceOrDescriptor(dependency.id);
				if (!instanceOrDesc && !instanceOrDesc.optional) {
					console.warn(`[createInstance] ${id} depends on ${dependency.id} which is NOT registered.`);
				}

				if (instanceOrDesc instanceof SyncDescriptor) {
					const node = { id: dependency.id, desc: instanceOrDesc, _trace: item._trace.branch(dependency.id, true) };
					graph.insertEdge(item, node);
					stack.push(node);
				}
			}
		}

		while (true) {
			const roots = graph.roots();

			// 没有根节点，但是不为空，说明是循环依赖
			if (roots.length === 0) {
				if (!graph.isEmpty()) {
					throw new CyclicDependencyError(graph);
				}
				break;
			}

			for (const { data } of roots) {
				const instanceOrDesc = this._getServiceInstanceOrDescriptor(data.id);
				if (instanceOrDesc instanceof SyncDescriptor) {
					const instance = this._createServiceInstanceWithOwner(data.id, data.desc.ctor, data.desc.staticArguments, data.desc.supportDelayedInstantiation, data._trace);
					this._setServiceInstance(data.id, instance);
				}
				graph.removeNode(data);
			}
		}

		return <T>this._getServiceInstanceOrDescriptor(id);

	}

	private _createServiceInstanceWithOwner<T>(id: ServiceIdentifier<T>, ctor: Function, args: any[] = [], supportDelayedInstantiation: boolean, _trace: Trace): T {
		if (this._services.get(id) instanceof SyncDescriptor) {
			return this._createServiceInstance(ctor, args, supportDelayedInstantiation, _trace);
		} else if (this._parent) {
			return this._parent._createServiceInstanceWithOwner(id, ctor, args, supportDelayedInstantiation, _trace);
		} else {
			throw new Error(`illegalState - creating UNKNOWN service instance ${ctor.name}`);
		}
	}

	private _createServiceInstance<T>(ctor: any, args: any[] = [], _supportDelayedInstantiation: boolean, _trace: Trace): T {
		if (!_supportDelayedInstantiation) {
			return this._createInstance(ctor, args, _trace);
		} else {
			const idle = new IdleValue<any>(() => this._createInstance(ctor, args, _trace));
			return <T>new Proxy(Object.create(null), {
				get(target: any, propertyKey: PropertyKey): any {
					if (propertyKey in target) {
						return target[propertyKey];
					}
					let obj = idle.value;
					let prop = obj[propertyKey];
					if (typeof prop !== 'function') {
						return prop;
					}
					prop = prop.bind(obj);
					target[propertyKey] = prop;
					return prop;
				},
				set(target: any, propertyKey: PropertyKey, value: any): boolean {
					idle.value[propertyKey] = value;
					return true;
				}
			});
		}
	}

}


const enum TraceType {
	Creation, Invocation, Branch,
}

class Trace {

	private static readonly _None = new class extends Trace {
		constructor() {
			super(-1, null);
		}
		override stop() { }
		override branch() { return this; }
	}

	static traceInvocation(ctor: FunctionConstructor): Trace {
		return !_enableTracing ? Trace._None : new Trace(TraceType.Invocation, ctor.name || (ctor.toString() as string).substring(0, 42).replace(/\n/g, ''));
	}

	static traceCreation(ctor: Function): Trace {
		return !_enableTracing ? Trace._None : new Trace(TraceType.Creation, ctor.name);
	}

	private static _totals: number = 0;
	private readonly _start: number = Date.now();
	private readonly _dep: [ServiceIdentifier<any>, boolean, Trace?][] = [];

	private constructor(
		readonly type: TraceType,
		readonly name: string | null,
	) { }

	branch(id: ServiceIdentifier<any>, first: boolean): Trace {
		let child = new Trace(TraceType.Branch, id.toString());
		this._dep.push([id, first, child]);
		return child;
	}

	stop() {
		let dur = Date.now() - this._start;
		Trace._totals += dur;

		let causedCreation = false;

		function printChild(n: number, trace: Trace) {
			let res: string[] = [];
			let prefix = new Array(n + 1).join('\t');
			for (const [id, first, child] of trace._dep) {
				if (first && child) {
					causedCreation = true;
					res.push(`${prefix}CREATES -> ${id}`);
					let nested = printChild(n + 1, child);
					if (nested) {
						res.push(nested);
					}
				} else {
					res.push(`${prefix}uses -> ${id}`);
				}
			}
			return res.join('\n');
		}

		let lines = [
			`${this.type === TraceType.Creation ? 'CREATE' : 'CALL'} ${this.name}`,
			`${printChild(1, this)}`,
			`DONE, took ${dur.toFixed(2)}ms (grand total ${Trace._totals.toFixed(2)}ms)`
		];

		if (dur > 2 || causedCreation) {
			console.log(lines.join('\n'));
		}

	}

}

