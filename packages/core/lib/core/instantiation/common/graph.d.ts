export declare class Node<T> {
    readonly data: T;
    readonly incoming: Map<string, Node<T>>;
    readonly outgoing: Map<string, Node<T>>;
    constructor(data: T);
}
export declare class Graph<T> {
    private readonly _hasFn;
    private readonly _nodes;
    constructor(_hasFn: (element: T) => string);
    roots(): Node<T>[];
    insertEdge(from: T, to: T): void;
    removeNode(data: T): void;
    lookupOrInsertNode(data: T): Node<T>;
    lookup(data: T): Node<T> | undefined;
    isEmpty(): boolean;
    toString(): string;
    findCycleSlow(): string | undefined;
    private _findCycle;
}
