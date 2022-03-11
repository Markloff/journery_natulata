"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const graph_1 = require("../../../core/instantiation/common/graph");
const mocha_1 = require("mocha");
(0, mocha_1.suite)('Graph', () => {
    let graph;
    (0, mocha_1.setup)(() => {
        graph = new graph_1.Graph(s => s);
    });
    (0, mocha_1.test)("is possible to lookup nodes that don't exist", () => {
        assert_1.default.strictEqual(graph.lookup('ddd'), undefined);
    });
    (0, mocha_1.test)('insets nodes when not there yet', () => {
        assert_1.default.strictEqual(graph.lookup('ddd'), undefined);
        assert_1.default.strictEqual(graph.lookupOrInsertNode('ddd').data, 'ddd');
        assert_1.default.strictEqual(graph.lookup('ddd').data, 'ddd');
    });
    (0, mocha_1.test)('can remove nodes and get length', () => {
        assert_1.default.ok(graph.isEmpty());
        assert_1.default.strictEqual(graph.lookup('ddd'), undefined);
        assert_1.default.strictEqual(graph.lookupOrInsertNode('ddd').data, 'ddd');
        assert_1.default.ok(!graph.isEmpty());
        graph.removeNode('ddd');
        assert_1.default.strictEqual(graph.lookup('ddd'), undefined);
        assert_1.default.ok(graph.isEmpty());
    });
    (0, mocha_1.test)('root', () => {
        graph.insertEdge('1', '2');
        let roots = graph.roots();
        assert_1.default.strictEqual(roots.length, 1);
        assert_1.default.strictEqual(roots[0].data, '2');
        graph.insertEdge('2', '1');
        roots = graph.roots();
        assert_1.default.strictEqual(roots.length, 0);
    });
    (0, mocha_1.test)('root complex', () => {
        graph.insertEdge('1', '2');
        graph.insertEdge('1', '3');
        graph.insertEdge('3', '4');
        let roots = graph.roots();
        assert_1.default.strictEqual(roots.length, 2);
        (0, assert_1.default)(['2', '4'].every(n => roots.some(node => node.data === n)));
    });
});
