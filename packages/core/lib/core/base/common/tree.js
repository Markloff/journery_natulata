"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedBlackTree = exports.RedBlackTreeNode = exports.AVLTree = exports.BinarySearchTree = exports.defaultCompare = exports.Node = void 0;
const lifecycle_1 = require("../../../core/base/common/lifecycle");
class Node {
    constructor(element) {
        this.element = element;
        this.left = Node.Undefined;
        this.right = Node.Undefined;
    }
    toString() {
        return `${this.element}`;
    }
}
exports.Node = Node;
Node.Undefined = new Node(undefined);
var Compare;
(function (Compare) {
    Compare[Compare["EQUALS"] = 1] = "EQUALS";
    Compare[Compare["BIGGER_THAN"] = 2] = "BIGGER_THAN";
    Compare[Compare["LESS_THAN"] = 3] = "LESS_THAN";
})(Compare || (Compare = {}));
function defaultCompare(a, b) {
    if (a === b) {
        return Compare.EQUALS;
    }
    else if (a > b) {
        return Compare.BIGGER_THAN;
    }
    else {
        return Compare.LESS_THAN;
    }
}
exports.defaultCompare = defaultCompare;
class BinarySearchTree {
    constructor(compareFn = defaultCompare) {
        this.compareFn = compareFn;
        this.root = Node.Undefined;
    }
    insert(element) {
        if (this.root === Node.Undefined) {
            this.root = new Node(element);
        }
        else {
            this.root = this._insertNode(this.root, element);
        }
        let hasRemoved = false;
        return (0, lifecycle_1.toDisposable)(() => {
            if (!hasRemoved) {
                this._removeNode(this.root, element);
            }
        });
    }
    _insertNode(node, element) {
        if (this.compareFn(element, node.element) === Compare.LESS_THAN) {
            if (node.left === Node.Undefined) {
                node.left = new Node(element);
            }
            else {
                this._insertNode(node.left, element);
            }
        }
        else {
            if (node.right === Node.Undefined) {
                node.right = new Node(element);
            }
            else {
                this._insertNode(node.right, element);
            }
        }
        return node;
    }
    search(element) {
        return this._searchNode(this.root, element);
    }
    _searchNode(node, element) {
        if (node === Node.Undefined) {
            return Node.Undefined;
        }
        if (this.compareFn(element, node.element) === Compare.LESS_THAN) {
            return this._searchNode(node.left, element);
        }
        else if (this.compareFn(element, node.element) === Compare.BIGGER_THAN) {
            return this._searchNode(node.right, element);
        }
        else {
            return node;
        }
    }
    max() {
        return this._maxNode(this.root).element;
    }
    _maxNode(node) {
        let current = node;
        while (current !== Node.Undefined && current.right !== Node.Undefined) {
            current = current.right;
        }
        return current;
    }
    min() {
        return this._minNode(this.root).element;
    }
    _minNode(node) {
        let current = node;
        while (current !== Node.Undefined && current.left !== Node.Undefined) {
            current = current.left;
        }
        return current;
    }
    remove(element) {
        this.root = this._removeNode(this.root, element);
        return this.root;
    }
    _removeNode(node, element) {
        if (node === Node.Undefined) {
            return node;
        }
        if (this.compareFn(element, node.element) === Compare.LESS_THAN) {
            node.left = this._removeNode(node.left, element);
            return node;
        }
        else if (this.compareFn(element, node.element) === Compare.BIGGER_THAN) {
            node.right = this._removeNode(node.right, element);
            return node;
        }
        else {
            // equals
            if (node.left === Node.Undefined && node.right === Node.Undefined) {
                node = Node.Undefined;
                return node;
            }
            if (node.left === Node.Undefined) {
                node = node.right;
                return node;
            }
            else if (node.right === Node.Undefined) {
                node = node.left;
                return node;
            }
            const minNodeOfRight = this._minNode(node.right);
            node.element = minNodeOfRight.element;
            node.right = this._removeNode(node.right, minNodeOfRight.element);
            return node;
        }
    }
    inOrderTraverse(cb) {
        this._inOrderTraverseNode(this.root, cb);
    }
    _inOrderTraverseNode(node, cb) {
        if (node === Node.Undefined)
            return;
        this._inOrderTraverseNode(node.left, cb);
        cb(node.element);
        this._inOrderTraverseNode(node.right, cb);
    }
    preOrderTraverse(cb) {
        this._preOrderTraverseNode(this.root, cb);
    }
    _preOrderTraverseNode(node, cb) {
        if (node === Node.Undefined)
            return;
        cb(node.element);
        this._preOrderTraverseNode(node.left, cb);
        this._preOrderTraverseNode(node.right, cb);
    }
    postOrderTraverse(cb) {
        this._postOrderTraverseNode(this.root, cb);
    }
    _postOrderTraverseNode(node, cb) {
        if (node === Node.Undefined)
            return;
        this._postOrderTraverseNode(node.left, cb);
        this._postOrderTraverseNode(node.right, cb);
        cb(node.element);
    }
}
exports.BinarySearchTree = BinarySearchTree;
var BalanceFactor;
(function (BalanceFactor) {
    BalanceFactor[BalanceFactor["UNBALANCED_RIGHT"] = 1] = "UNBALANCED_RIGHT";
    BalanceFactor[BalanceFactor["SLIGHTLY_UNBALANCED_RIGHT"] = 2] = "SLIGHTLY_UNBALANCED_RIGHT";
    BalanceFactor[BalanceFactor["BALANCED"] = 3] = "BALANCED";
    BalanceFactor[BalanceFactor["SLIGHTLY_UNBALANCED_LEFT"] = 4] = "SLIGHTLY_UNBALANCED_LEFT";
    BalanceFactor[BalanceFactor["UNBALANCED_LEFT"] = 5] = "UNBALANCED_LEFT";
})(BalanceFactor || (BalanceFactor = {}));
class AVLTree extends BinarySearchTree {
    constructor(comparedFn = defaultCompare) {
        super(comparedFn);
        this.comparedFn = comparedFn;
    }
    _getNodeHeight(node) {
        return AVLTree.getNodeHeight(node);
    }
    static getNodeHeight(node) {
        if (node === Node.Undefined)
            return -1;
        return Math.max(AVLTree.getNodeHeight(node.left), AVLTree.getNodeHeight(node.right)) + 1;
    }
    _getBalanceFactor(node) {
        const heightDifference = this._getNodeHeight(node.left) - this._getNodeHeight(node.right);
        switch (heightDifference) {
            case -2:
                return BalanceFactor.UNBALANCED_RIGHT;
            case -1:
                return BalanceFactor.SLIGHTLY_UNBALANCED_RIGHT;
            case 1:
                return BalanceFactor.SLIGHTLY_UNBALANCED_LEFT;
            case 2:
                return BalanceFactor.UNBALANCED_LEFT;
            default:
                return BalanceFactor.BALANCED;
        }
    }
    /**
     * 左左情况: 向右的单旋转
     *
     *      b                            a
     *     / \                          / \
     *    a   e -> rotationLL(b) ->    c   b
     *   / \                              / \
     *  c   d                            d   e
     *
     * @param node
     */
    _rotationLL(node) {
        const tmp = node.left;
        node.left = tmp.right;
        tmp.right = node;
        return tmp;
    }
    /**
     * 右右情况: 向左的单旋转
     *
     *      a                            b
     *     / \                          / \
     *    c   b -> rotationRR(a) ->    a   e
     *       / \                      / \
     *      d   e                    c   d
     * @param node
     */
    _rotationRR(node) {
        const tmp = node.right;
        node.right = tmp.left;
        tmp.left = node;
        return tmp;
    }
    /**
     * 右侧节点的左节插入新节点后，导致了不平衡，是为RL
     * 先对node.right进行左旋
     * 左右情况: 向右的双旋转, 先向右旋转然后向左旋转
     *
     *
     *      70(node)                             70 (node)                         72
     *     / \                                  /   \                            /   \
     *    50  80 -> rotationLL(node.right) ->  50   72-> rotationRR(node) ->   70   80
     *       / \                                     \                        /     / \
     *      72   90                                   80                    50    75  90
     *       \                                       / \
     *        75                                   75   90
     * @param node
     */
    _rotationRL(node) {
        node.right = this._rotationLL(node.right);
        return this._rotationRR(node);
    }
    /**
     * 左右情况: 向右的双旋转, 先向右旋转然后向左旋转
     *
     *      50(node)                             50                                 40
     *     / \                                  /   \                              /  \
     *    30  70 -> rotationLL(node.left) ->  40   70   -> rotationRR(node) ->   30   50
     *   / \                                 /                                   / \     \
     * 10   40                              30                                  10  35    70
     *     /                               / \
     *    35                              10  35
     * @param node
     */
    _rotationLR(node) {
        node.left = this._rotationRR(node.left);
        return this._rotationLL(node);
    }
    insert(element) {
        if (this.root === Node.Undefined) {
            this.root = new Node(element);
        }
        else {
            this.root = this._insertNode(this.root, element);
        }
        let hasRemoved = false;
        return (0, lifecycle_1.toDisposable)(() => {
            if (!hasRemoved) {
                this._removeNode(this.root, element);
            }
        });
    }
    _insertNode(node, element) {
        if (node === Node.Undefined) {
            return new Node(element);
        }
        if (this.compareFn(element, node.element) === Compare.LESS_THAN) {
            node.left = this._insertNode(node.left, element);
        }
        else if (this.compareFn(element, node.element) === Compare.BIGGER_THAN) {
            node.right = this._insertNode(node.right, element);
        }
        else {
            return node; // 重复的键
        }
        const balanceState = this._getBalanceFactor(node);
        if (balanceState === BalanceFactor.UNBALANCED_LEFT) {
            // #LL
            if (this.comparedFn(element, node.left.element) === Compare.LESS_THAN) {
                node = this._rotationLL(node);
            }
            else {
                // #LR
                node = this._rotationLR(node);
            }
        }
        if (balanceState === BalanceFactor.UNBALANCED_RIGHT) {
            if (this.compareFn(element, node.right.element) === Compare.BIGGER_THAN) {
                // 小于则进行RR旋转
                node = this._rotationRR(node);
            }
            else {
                // 否则进行RL旋转
                node = this._rotationRL(node);
            }
        }
        return node;
    }
    _removeNode(node, element) {
        super._removeNode(node, element);
        const balanceState = this._getBalanceFactor(this.root);
        if (balanceState === BalanceFactor.UNBALANCED_LEFT) {
            const balanceFactorOfLeft = this._getBalanceFactor(node.left);
            if (balanceFactorOfLeft === BalanceFactor.BALANCED || balanceFactorOfLeft === BalanceFactor.UNBALANCED_LEFT) {
                return this._rotationLL(node);
            }
            if (balanceFactorOfLeft === BalanceFactor.SLIGHTLY_UNBALANCED_RIGHT) {
                return this._rotationLR(node.left);
            }
        }
        if (balanceState === BalanceFactor.UNBALANCED_RIGHT) {
            const balanceFactorOfLeft = this._getBalanceFactor(node.right);
            if (balanceFactorOfLeft === BalanceFactor.BALANCED || balanceFactorOfLeft === BalanceFactor.UNBALANCED_RIGHT) {
                return this._rotationLL(node);
            }
            if (balanceFactorOfLeft === BalanceFactor.SLIGHTLY_UNBALANCED_LEFT) {
                return this._rotationRL(node.right);
            }
        }
        return node;
    }
}
exports.AVLTree = AVLTree;
var Colors;
(function (Colors) {
    Colors[Colors["Red"] = 0] = "Red";
    Colors[Colors["Black"] = 1] = "Black";
})(Colors || (Colors = {}));
class RedBlackTreeNode {
    constructor(element) {
        this.element = element;
        this.left = RedBlackTreeNode.Undefined;
        this.right = RedBlackTreeNode.Undefined;
        this.parent = RedBlackTreeNode.Undefined;
        this.color = Colors.Red;
    }
    flipColors() {
        this.color = 1 ^ this.color;
    }
    isRed() {
        return this.color === Colors.Red;
    }
}
exports.RedBlackTreeNode = RedBlackTreeNode;
RedBlackTreeNode.Undefined = new RedBlackTreeNode(undefined);
class RedBlackTree extends BinarySearchTree {
    constructor(compareFn = defaultCompare) {
        super(compareFn);
        this.compareFn = compareFn;
        this.root = RedBlackTreeNode.Undefined;
    }
    /**
     * 重写insert方法:
     *   1. 插入节点后给节点应用一种颜色
     *   2. 验证树是否满足红黑树的条件以及是否还是自平衡的
     * @param element
     */
    insert(element) {
        this.root = this._insertNode(this.root, element);
        this.root.color = Colors.Black;
        let hasRemoved = false;
        return (0, lifecycle_1.toDisposable)(() => {
            if (!hasRemoved) {
                this._removeNode(this.root, element);
            }
        });
    }
    _insertNode(node, element) {
        if (node === RedBlackTreeNode.Undefined) {
            node = new RedBlackTreeNode(element);
            node.color = Colors.Red;
            return node;
        }
        // 当前插入element小于当前节点的element
        if (this.compareFn(element, node.element) === Compare.LESS_THAN) {
            node.left = this._insertNode(node.left, element);
        }
        else if (this.compareFn(element, node.element) === Compare.BIGGER_THAN) {
            node.right = this._insertNode(node.right, element);
        }
        else {
            node.element = element;
        }
        return this._keepBalance(node);
    }
    _isRed(node) {
        if (node === RedBlackTreeNode.Undefined) {
            return false;
        }
        return node.isRed();
    }
    _flipColors(node) {
        node.flipColors();
        node.left.flipColors();
        node.right.flipColors();
    }
    _keepBalance(node) {
        var _a;
        if (this._isRed(node.right) && !this._isRed(node.left)) {
            node = this._rotationLL(node);
        }
        if (this._isRed(node.left) && this._isRed((_a = node.left) === null || _a === void 0 ? void 0 : _a.left)) {
            node = this._rotationRR(node);
        }
        if (this._isRed(node.left) && this._isRed(node.right)) {
            this._flipColors(node);
        }
        return node;
    }
    delete(element) {
        if (this.search(element) === Node.Undefined)
            return;
        if (!this._isRed(this.root.left) && !this._isRed(this.root.right)) {
            this.root.color = Colors.Red;
        }
        this.root = this._deleteNode(this.root, element);
        if (this.root) {
            this.root.color = Colors.Black;
        }
    }
    _deleteNode(node, element) {
        // if (this.compareFn(element, node.element) === Compare.LESS_THAN) {
        // 	if (!this._isRed(node.left) && !this._isRed(node.left?.left)) {
        // 		node = this._moveRedLeft(node);
        // 		node.left = this._deleteNode(node.left, element);
        // 	} else {
        //
        // 	}
        // }
        return node;
    }
    /**
     * 右旋
     *
     *       a                           c
     *      / \                         / \
     *     c   b -> rotateRight(a) ->   d   a
     *    / \                             / \
     *   d   e                           e   b
     *
     * @param node Node<T>
     */
    _rotationRR(node) {
        const tmp = node.left;
        node.left = tmp.right;
        tmp.right = node;
        tmp.color = node.color;
        node.color = Colors.Red;
        return tmp;
    }
    _rotationLL(node) {
        const tmp = node.right;
        node.right = tmp.left;
        tmp.left = node;
        tmp.color = node.color;
        node.color = Colors.Red;
        return tmp;
    }
}
exports.RedBlackTree = RedBlackTree;
