import { createDecorator, registerSingleton, resolve } from 'core';
import { readFileSync } from 'node:fs';
import {
	ImportDeclaration,
	ImportDefaultSpecifier, ImportNamespaceSpecifier,
	ImportSpecifier, NamedImportSpecifier,
	transformSync,
} from '@swc/core';
import { Visitor } from "@swc/core/Visitor.js";

export interface IDependencyAnalyzeService {
	readonly _serviceBrand: undefined;
	execute(entry: string): void
}

export const IDependencyAnalyzeService = createDecorator<IDependencyAnalyzeService>('IDependencyAnalyzeService');



class ImportVisitor extends Visitor {

	override visitImportDeclaration(node: ImportDeclaration): ImportDeclaration {
		console.log(node.source)
		return super.visitImportDeclaration(node);
	}

	override visitImportDefaultSpecifier(node: ImportDefaultSpecifier): ImportSpecifier {
		console.log(node.span)
		return super.visitImportDefaultSpecifier(node);
	}

	override visitImportSpecifiers(nodes: ImportSpecifier[]): ImportSpecifier[] {

		console.log(nodes)
		return super.visitImportSpecifiers(nodes);
	}

	override visitImportNamespaceSpecifier(node: ImportNamespaceSpecifier): ImportNamespaceSpecifier {
		console.log(node)
		return super.visitImportNamespaceSpecifier(node);
	}

	override visitNamedImportSpecifier(node: NamedImportSpecifier): NamedImportSpecifier {
		console.log(node)
		return super.visitNamedImportSpecifier(node);
	}

	override visitImportSpecifier(node: ImportSpecifier): ImportSpecifier {
		console.log(node)
		return super.visitImportSpecifier(node);
	}


}


class DependencyAnalyzeService implements IDependencyAnalyzeService {
	readonly _serviceBrand: undefined;

	execute(entry: string) {
		const resolvedEntry = resolve(entry);
		const source = readFileSync(resolvedEntry).toString();

		transformSync(source, {
			plugin: (m) => {
				const importPlugin = new ImportVisitor();
				return importPlugin.visitProgram(m);
			}
		});

	}
}

registerSingleton(IDependencyAnalyzeService, DependencyAnalyzeService);
