"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const tree_1 = require("../../../../core/base/common/tree");
const mocha_1 = require("mocha");
const assert = __importStar(require("assert"));
const createTestBinarySearchTree = () => {
    const tree = new tree_1.BinarySearchTree();
    tree.insert(11);
    tree.insert(7);
    tree.insert(15);
    tree.insert(5);
    tree.insert(3);
    tree.insert(9);
    tree.insert(8);
    tree.insert(10);
    tree.insert(13);
    tree.insert(12);
    tree.insert(14);
    tree.insert(20);
    tree.insert(18);
    tree.insert(25);
    tree.insert(6);
    return tree;
};
const createTestAVLTree = () => {
    const tree = new tree_1.AVLTree();
    tree.insert(30);
    tree.insert(27);
    tree.insert(60);
    tree.insert(12);
    tree.insert(10);
    return tree;
};
(0, mocha_1.suite)('BinarySearchTree', () => {
    (0, mocha_1.test)('insert and traverse', () => {
        const tree = createTestBinarySearchTree();
        const res = [];
        const collectNode = (element) => {
            res.push(element);
        };
        tree.inOrderTraverse(collectNode);
        assert.deepStrictEqual(res, [3, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 18, 20, 25,]);
    });
    (0, mocha_1.test)('find max or min', () => {
        const tree = createTestBinarySearchTree();
        assert.strictEqual(tree.max(), 25);
        assert.strictEqual(tree.min(), 3);
    });
    (0, mocha_1.test)('insert and delete', () => {
        let res = [];
        const collectNode = (element) => {
            res.push(element);
        };
        const tree = createTestBinarySearchTree();
        tree.remove(3);
        assert.strictEqual(tree.min(), 5);
        assert.strictEqual(tree.max(), 25);
        tree.inOrderTraverse(collectNode);
        assert.deepStrictEqual(res, [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 18, 20, 25]);
        res = [];
        tree.remove(25);
        assert.strictEqual(tree.min(), 5);
        assert.strictEqual(tree.max(), 20);
        tree.inOrderTraverse(collectNode);
        assert.deepStrictEqual(res, [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 18, 20,]);
    });
    (0, mocha_1.test)('search', () => {
        const tree = createTestBinarySearchTree();
        assert.ok(tree.search(3).element);
        assert.ok(!tree.search(1).element);
    });
    (0, mocha_1.test)('traverse', () => {
        const tree = createTestBinarySearchTree();
        let res = [];
        const collectNode = (element) => {
            res.push(element);
        };
        // #inOrder
        tree.inOrderTraverse(collectNode);
        assert.deepStrictEqual(res, [3, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 18, 20, 25]);
        // #preOrder
        res = [];
        tree.preOrderTraverse(collectNode);
        assert.deepStrictEqual(res, [11, 7, 5, 3, 6, 9, 8, 10, 15, 13, 12, 14, 20, 18, 25]);
        // #postOrder
        res = [];
        tree.postOrderTraverse(collectNode);
        assert.deepStrictEqual(res, [3, 6, 5, 8, 10, 9, 7, 12, 14, 13, 18, 25, 20, 15, 11]);
    });
});
const collectNode = (res) => (element) => {
    res.push(element);
};
(0, mocha_1.suite)('AVL Tree', () => {
    (0, mocha_1.test)('insert, traverse, remove', () => {
        const tree = createTestAVLTree();
        const res = [];
        tree.preOrderTraverse(collectNode(res));
        assert.deepStrictEqual(res, [30, 12, 10, 27, 60]);
        res.length = 0;
        tree.remove(10);
        tree.preOrderTraverse(collectNode(res));
        assert.deepStrictEqual(res, [30, 12, 10, 27, 60]);
    });
    (0, mocha_1.test)('LL rotation', () => {
        const tree = new tree_1.AVLTree();
        const res = [];
        // #LL
        tree.insert(50);
        tree.insert(30);
        tree.insert(70);
        tree.insert(10);
        tree.insert(40);
        tree.preOrderTraverse(collectNode(res));
        assert.deepStrictEqual(res, [50, 30, 10, 40, 70]);
        res.length = 0;
        tree.insert(5);
        tree.preOrderTraverse(collectNode(res));
        assert.deepStrictEqual(res, [30, 10, 5, 50, 40, 70]);
    });
    (0, mocha_1.test)('RR rotation', () => {
        const tree = new tree_1.AVLTree();
        const res = [];
        // #LL
        tree.insert(50);
        tree.insert(30);
        tree.insert(70);
        tree.insert(60);
        tree.insert(80);
        tree.preOrderTraverse(collectNode(res));
        assert.deepStrictEqual(res, [50, 30, 70, 60, 80]);
        res.length = 0;
        tree.insert(90);
        tree.preOrderTraverse(collectNode(res));
        assert.deepStrictEqual(res, [70, 50, 30, 60, 80, 90]);
    });
    (0, mocha_1.test)('LR rotation', () => {
        const tree = new tree_1.AVLTree();
        const res = [];
        // #LR
        tree.insert(50);
        tree.insert(30);
        tree.insert(70);
        tree.insert(10);
        tree.insert(40);
        tree.preOrderTraverse(collectNode(res));
        assert.deepStrictEqual(res, [50, 30, 10, 40, 70]);
        tree.insert(35);
        res.length = 0;
        tree.preOrderTraverse(collectNode(res));
        assert.deepStrictEqual(res, [40, 30, 10, 35, 50, 70]);
    });
    (0, mocha_1.test)('RL rotation', () => {
        const tree = new tree_1.AVLTree();
        const res = [];
        tree.insert(70);
        tree.insert(50);
        tree.insert(80);
        tree.insert(72);
        tree.insert(90);
        tree.preOrderTraverse(collectNode(res));
        assert.deepStrictEqual(res, [70, 50, 80, 72, 90]);
        tree.insert(75);
        res.length = 0;
        tree.preOrderTraverse(collectNode(res));
        assert.deepStrictEqual(res, [72, 70, 50, 80, 75, 90]);
    });
});
// suite('RedBlack Tree', () => {
// 	test('create and insert', () => {
// 		const tree = new RedBlackTree<number>();
// 		const root = new RedBlackTreeNode(1);
// tree.insert(1);
// tree.insert(2);
// tree.insert(3);
// tree.insert(4);
// tree.insert(5);
// tree.insert(6);
// tree.insert(7);
// tree.insert(8);
// tree.insert(9);
// const res: number[] = [];
// tree.preOrderTraverse(collectNode(res));
// assert.deepStrictEqual(res, [4, 2, 1, 3, 6, 5, 8, 7, 9]);
// })
// })
