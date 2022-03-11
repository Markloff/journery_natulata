export declare class LinkedList<E> {
    private _first;
    private _last;
    private _size;
    get size(): number;
    isEmpty(): boolean;
    shift(): E | undefined;
    pop(): E | undefined;
    clear(): void;
    unshift(element: E): () => void;
    push(element: E): () => void;
    private _insert;
    private _remove;
    [Symbol.iterator](): Iterator<E>;
}
