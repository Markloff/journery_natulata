import { AVLTree, BinarySearchTree } from '@/core/base/common/tree';
import { suite, test } from 'mocha';
import * as assert from 'assert';

const createTestBinarySearchTree = (): BinarySearchTree<number> => {
	const tree = new BinarySearchTree<number>();
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
}

const createTestAVLTree = (): AVLTree<number> => {
	const tree = new AVLTree<number>();
	tree.insert(30);
	tree.insert(27);
	tree.insert(60);
	tree.insert(12);
	tree.insert(10);
	return tree;
}

suite('BinarySearchTree', () => {

	test('insert and traverse', () => {
		const tree = createTestBinarySearchTree();
		const res: number[] = [];
		const collectNode = (element: number) => {
			res.push(element);
		}
		tree.inOrderTraverse(collectNode);
		assert.deepStrictEqual(res, [3, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 18, 20, 25,]);
	})

	test('find max or min', () => {
		const tree = createTestBinarySearchTree();

		assert.strictEqual(tree.max(), 25);
		assert.strictEqual(tree.min(), 3);
	})

	test('insert and delete', () => {
		let res: number[] = [];
		const collectNode = (element: number) => {
			res.push(element);
		}
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
		assert.deepStrictEqual(res, [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 18, 20, ]);
	})

	test('search', () => {
		const tree = createTestBinarySearchTree();

		assert.ok(tree.search(3).element);
		assert.ok(!tree.search(1).element);
	})

	test('traverse', () => {
		const tree = createTestBinarySearchTree();
		let res: number[] = [];
		const collectNode = (element: number) => {
			res.push(element);
		}

		// #inOrder
		tree.inOrderTraverse(collectNode);
		assert.deepStrictEqual(res, [3, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 18, 20, 25]);

		// #preOrder
		res = [];
		tree.preOrderTraverse(collectNode);
		assert.deepStrictEqual(res, [11, 7, 5, 3, 6, 9, 8, 10, 15, 13, 12, 14, 20, 18, 25]) ;

		// #postOrder
		res = [];
		tree.postOrderTraverse(collectNode);
		assert.deepStrictEqual(res, [3, 6, 5, 8, 10, 9, 7, 12, 14, 13, 18, 25, 20, 15, 11]) ;
	})

})

const collectNode = (res: number[]) => (element: number) => {
	res.push(element);
}

suite('AVL Tree', () => {

	test('insert, traverse, remove', () => {
		const tree = createTestAVLTree();
		const res: number[] = [];

		tree.preOrderTraverse(collectNode(res));
		assert.deepStrictEqual(res, [30, 12, 10, 27, 60]);

		res.length = 0;
		tree.remove(10);
		tree.preOrderTraverse(collectNode(res));
		assert.deepStrictEqual(res, [30, 12, 10, 27, 60]);
	});

	test('LL rotation', () => {
		const tree = new AVLTree<number>();
		const res: number[] = [];
		// #LL
		tree.insert(50);
		tree.insert(30);
		tree.insert(70);
		tree.insert(10);
		tree.insert(40);
		tree.preOrderTraverse(collectNode(res));
		assert.deepStrictEqual(res, [50, 30, 10, 40, 70])

		res.length = 0;
		tree.insert(5);
		tree.preOrderTraverse(collectNode(res));
		assert.deepStrictEqual(res, [30, 10, 5, 50, 40, 70])
	});

	test('RR rotation', () => {
		const tree = new AVLTree<number>();
		const res: number[] = [];
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

	test('LR rotation', () => {

		const tree = new AVLTree<number>();
		const res: number[] = [];
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

	test('RL rotation', () => {
		const tree = new AVLTree<number>();
		const res: number[] = [];
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
