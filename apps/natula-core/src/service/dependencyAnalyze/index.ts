import { createDecorator, Emitter, LinkedList, registerSingleton } from 'core';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, isAbsolute, join, resolve, basename, extname } from 'node:path';
import { ImportDeclaration, parseSync, transformSync } from '@swc/core';
import { Visitor } from '@swc/core/Visitor.js';
import { Graph } from 'core/lib/core/instantiation/common/graph';
import { Module } from './module';


export interface IDependencyAnalyzeService {
	readonly _serviceBrand: undefined;
	execute(entry: string): void
}

export const IDependencyAnalyzeService = createDecorator<IDependencyAnalyzeService>('IDependencyAnalyzeService');


namespace Utils {

	function resolvePath(path: string): string {
		if (existsSync(path)) {
			return path;
		} else {
			return '';
		}
	}

	export function resolveModuleRelativePath(from: string, to: string): string {
		console.log(isExternalModule(to), to);
		if (isExternalModule(to)) {
			return to;
		}
		const basePath = join(dirname(from), to);
		const result = resolvePath(`${basePath}.js`)
			|| resolvePath(`${basePath}.ts`)
			|| resolvePath(`${basePath}/index.js`)
			|| resolvePath(`${basePath}/index.ts`);
		if (result) {
			return result;
		} else {
			throw new Error(`找不到模块 ${to}`,);
		}
	}

	export function isExternalModule(path: string): boolean {
		return path.startsWith("node:") || (!isAbsolute(path) && !path.startsWith('.'));
	}
}


class ImportVisitor extends Visitor {

	private readonly _onVisitImportDeclaration: Emitter<[string, string]> = new Emitter<[string, string]>()
	public readonly onVisitImportDeclaration = this._onVisitImportDeclaration.event;

	constructor(
		private readonly _id: string,
	) {
		super();
	}

	override visitImportDeclaration(node: ImportDeclaration): ImportDeclaration {
		this._onVisitImportDeclaration.fire([this._id, node.source.value]);
		return super.visitImportDeclaration(node);
	}

	// override visitImportDefaultSpecifier(node: ImportDefaultSpecifier): ImportSpecifier {
	// 	console.log(node)
	// 	return super.visitImportDefaultSpecifier(node);
	// }
	//
	// override visitImportSpecifiers(nodes: ImportSpecifier[]): ImportSpecifier[] {
	//
	// 	console.log(nodes)
	// 	return super.visitImportSpecifiers(nodes);
	// }
	//
	// override visitImportNamespaceSpecifier(node: ImportNamespaceSpecifier): ImportNamespaceSpecifier {
	// 	console.log(node)
	// 	return super.visitImportNamespaceSpecifier(node);
	// }
	//
	// override visitNamedImportSpecifier(node: NamedImportSpecifier): NamedImportSpecifier {
	// 	console.log(node)
	// 	return super.visitNamedImportSpecifier(node);
	// }
	//
	// override visitImportSpecifier(node: ImportSpecifier): ImportSpecifier {
	// 	console.log(node)
	// 	return super.visitImportSpecifier(node);
	// }


}


class ModuleCollection {
	private readonly _modules: Map<string, Module>

	constructor() {
		this._modules = new Map<string, Module>();
	}

	lookupOrInsert(path: string): Module {
		if (!this._modules.has(path)) {
			return this.insert(path);
		}
		return this._modules.get(path)!;
	}

	insert(path: string): Module {
		const module = new Module(path, Utils.isExternalModule(path));
		this._modules.set(path, module);
		return module;
	}

}


class DependencyAnalyzeService implements IDependencyAnalyzeService {
	readonly _serviceBrand: undefined;

	private readonly _modules: ModuleCollection;
	private readonly _graph: Graph<Module>;
	private readonly _tasks: LinkedList<Module>;
	private readonly _resolvedModules: Set<String>;

	constructor() {
		this._tasks = new LinkedList<Module>();
		this._graph = new Graph((module) => module.id);
		this._modules = new ModuleCollection();
		this._resolvedModules = new Set();
	}

	execute(entry: string) {
		const absoluteEntry = resolve(entry);
		const entryModule = this._modules.insert(absoluteEntry);
		this._tasks.push(entryModule);
		while (this._tasks.size > 0) {
			const module = this._tasks.pop()!;
			if (!module.external) {
				const source = readFileSync(module.id).toString();
				const extName = extname(module.id);
				let syntax: 'ecmascript' | 'typescript' = 'ecmascript';
				if (extName === '.ts' || extName === '.tsx') {
					syntax = 'typescript'
				}
				const programModule = parseSync(source, {
					syntax,
					jsx: extName === '.jsx',
					tsx: extName === '.tsx',
					decorators: true,
					exportDefaultFrom: true,
					decoratorsBeforeExport: true,
				});
				programModule.body.forEach(item => {
					if (item.type === 'ImportDeclaration') {
						this._insertEdge(module.id, item.source.value);
					}
					if (item.type === 'ExportAllDeclaration') {
						this._insertEdge(module.id, item.source.value);
					}
				});

				// transformSync(source, {
				// 	filename: basename(module.id),
				// 	jsc: {
				// 		parser: {
				// 			syntax
				// 		}
				// 	},
				// 	plugin: (m) => {
				// 		const visitor = new ImportVisitor(entry);
				// 		visitor.onVisitImportDeclaration(([from, to]) => {
				// 			this._insertEdge(from, to);
				// 		})
				// 		return visitor.visitProgram(m);
				// 	}
				// });
			}
		}
		// console.log(this._graph.toString())
	}

	private _insertEdge(from: string, to: string) {
		const resolvedFromPath = resolve(from);
		const resolvedToPath = Utils.resolveModuleRelativePath(resolvedFromPath, to);

		const fromNode = this._modules.lookupOrInsert(resolvedFromPath);
		const toNode = this._modules.lookupOrInsert(resolvedToPath);
		this._graph.insertEdge(fromNode, toNode);

		if (!this._resolvedModules.has(resolvedToPath)) {
			this._resolvedModules.add(resolvedToPath);
			this._tasks.push(toNode);
		}

	}

}

registerSingleton(IDependencyAnalyzeService, DependencyAnalyzeService);
