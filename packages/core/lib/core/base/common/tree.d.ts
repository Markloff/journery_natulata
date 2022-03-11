import { IDisposable } from '../../../core/base/common/lifecycle';
export declare class Node<T> {
    element: T;
    static readonly Undefined: Node<any>;
    left: Node<T>;
    right: Node<T>;
    constructor(element: T);
    toString(): string;
}
interface ICompareFunction<T> {
    (a: T, b: T): Compare;
}
interface ITraverseCallbackFunction<T> {
    (element: T): void;
}
declare enum Compare {
    EQUALS = 1,
    BIGGER_THAN = 2,
    LESS_THAN = 3
}
export declare function defaultCompare<T>(a: T, b: T): Compare;
export declare class BinarySearchTree<T> {
    protected compareFn: ICompareFunction<T>;
    protected root: Node<T>;
    constructor(compareFn?: ICompareFunction<T>);
    insert(element: T): IDisposable;
    protected _insertNode(node: Node<T>, element: T): Node<T>;
    search(element: T): Node<T>;
    private _searchNode;
    max(): T;
    private _maxNode;
    min(): T;
    private _minNode;
    remove(element: T): Node<T>;
    protected _removeNode(node: Node<T>, element: T): Node<T>;
    inOrderTraverse(cb: ITraverseCallbackFunction<T>): void;
    private _inOrderTraverseNode;
    preOrderTraverse(cb: ITraverseCallbackFunction<T>): void;
    private _preOrderTraverseNode;
    postOrderTraverse(cb: ITraverseCallbackFunction<T>): void;
    private _postOrderTraverseNode;
}
export declare class AVLTree<T> extends BinarySearchTree<T> {
    protected comparedFn: ICompareFunction<T>;
    constructor(comparedFn?: ICompareFunction<T>);
    private _getNodeHeight;
    private static getNodeHeight;
    private _getBalanceFactor;
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
    private _rotationLL;
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
    private _rotationRR;
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
    private _rotationRL;
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
    private _rotationLR;
    insert(element: T): IDisposable;
    protected _insertNode(node: Node<T>, element: T): Node<T>;
    protected _removeNode(node: Node<T>, element: T): Node<T>;
}
export declare class RedBlackTreeNode<T> {
    element: T;
    static Undefined: RedBlackTreeNode<any>;
    left: RedBlackTreeNode<T>;
    right: RedBlackTreeNode<T>;
    parent: RedBlackTreeNode<T>;
    color: number;
    constructor(element: T);
    flipColors(): void;
    isRed(): boolean;
}
export declare class RedBlackTree<T> extends BinarySearchTree<T> {
    protected compareFn: ICompareFunction<T>;
    protected root: RedBlackTreeNode<T>;
    constructor(compareFn?: ICompareFunction<T>);
    /**
     * 重写insert方法:
     *   1. 插入节点后给节点应用一种颜色
     *   2. 验证树是否满足红黑树的条件以及是否还是自平衡的
     * @param element
     */
    insert(element: T): IDisposable;
    _insertNode(node: RedBlackTreeNode<T>, element: T): RedBlackTreeNode<T>;
    private _isRed;
    private _flipColors;
    private _keepBalance;
    delete(element: T): void;
    private _deleteNode;
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
    protected _rotationRR(node: RedBlackTreeNode<T>): RedBlackTreeNode<T>;
    protected _rotationLL(node: RedBlackTreeNode<T>): RedBlackTreeNode<T>;
}
export {};
