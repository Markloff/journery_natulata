import { Project, ProjectType } from './project';
import { Node } from 'core';


export class ProjectCollection {

	private readonly nodes: Map<string, Node<Project>> = new Map<string, Node<Project>>();

	constructor(private readonly _hasFn: (element: Project) => string) {
	}

	lookupOrInsert(project: Project): Project {
		const key = this._hasFn(project);
		let node = this.nodes.get(key);
		if (!node) {
			node = new Node<Project>(project);
			this.nodes.set(key, node);
		}
		return node.data;
	}

	remove(project: Project): void {
		const key = this._hasFn(project);
		this.nodes.delete(key);
	}

	has(project: Project): boolean {
		const key = this._hasFn(project);
		return this.nodes.has(key);
	}

	isEmpty(): boolean {
		return this.nodes.size === 0;
	}

	* [Symbol.iterator](): Iterator<Project> {
		for (const [, node] of this.nodes) {
			yield node.data
		}
	}
}
