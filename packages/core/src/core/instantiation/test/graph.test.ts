import assert from 'assert';
import { Graph } from '@/core/instantiation/common/graph';
import { suite, test, setup } from 'mocha';

suite('Graph', () => {
	let graph: Graph<string>;

	setup(() => {
		graph = new Graph<string>(s => s);
	})

	test("is possible to lookup nodes that don't exist", () => {
		assert.strictEqual(graph.lookup('ddd'), undefined);
	})

	test('insets nodes when not there yet', () => {
		assert.strictEqual(graph.lookup('ddd'), undefined);
		assert.strictEqual(graph.lookupOrInsertNode('ddd').data, 'ddd');
		assert.strictEqual(graph.lookup('ddd')!.data, 'ddd');
	})

	test('can remove nodes and get length', () => {
		assert.ok(graph.isEmpty());
		assert.strictEqual(graph.lookup('ddd'), undefined);
		assert.strictEqual(graph.lookupOrInsertNode('ddd').data, 'ddd');
		assert.ok(!graph.isEmpty());
		graph.removeNode('ddd');
		assert.strictEqual(graph.lookup('ddd'), undefined);
		assert.ok(graph.isEmpty());
	});

	test('root', () => {
		graph.insertEdge('1', '2');
		let roots = graph.roots();
		assert.strictEqual(roots.length, 1);
		assert.strictEqual(roots[0].data, '2');

		graph.insertEdge('2', '1');
		roots = graph.roots();
		assert.strictEqual(roots.length, 0);

	})

	test('root complex', () => {
		graph.insertEdge('1', '2');
		graph.insertEdge('1', '3');
		graph.insertEdge('3', '4');
		let roots = graph.roots();
		assert.strictEqual(roots.length, 2);
		assert(['2', '4'].every(n => roots.some(node => node.data === n)));
	});

});
