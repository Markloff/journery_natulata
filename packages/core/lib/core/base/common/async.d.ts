import { CancellationToken } from '../../../core/base/common/cancellation';
import { Event } from '../../../core/base/common/event';
import { IDisposable, Disposable } from '../../../core/base/common/lifecycle';
import { IExtUri } from '../../../core/base/common/resources';
import { URI } from '../../../core/base/common/uri';
import { Thenable } from '../../../core/base/common/thenable';
export declare function isThenable<T>(obj: unknown): obj is Promise<T>;
export interface CancelablePromise<T> extends Promise<T> {
    cancel(): void;
}
export declare function createCancelablePromise<T>(callback: (token: CancellationToken) => Promise<T>): CancelablePromise<T>;
export declare function raceCancellation<T>(promise: Promise<T>, token: CancellationToken): Promise<T | undefined>;
export declare function raceCancellation<T>(promise: Promise<T>, token: CancellationToken, defaultValue: T): Promise<T>;
/**
 * Returns as soon as one of the promises is resolved and cancels remaining promises
 */
export declare function raceCancellablePromises<T>(cancellablePromises: CancelablePromise<T>[]): Promise<T>;
export declare function raceTimeout<T>(promise: Promise<T>, timeout: number, onTimeout?: () => void): Promise<T | undefined>;
export declare function asPromise<T>(callback: () => T | Thenable<T>): Promise<T>;
export interface ITask<T> {
    (): T;
}
/**
 * A helper to prevent accumulation of sequential async tasks.
 *
 * Imagine a mail man with the sole task of delivering letters. As soon as
 * a letter submitted for delivery, he drives to the destination, delivers it
 * and returns to his base. Imagine that during the trip, N more letters were submitted.
 * When the mail man returns, he picks those N letters and delivers them all in a
 * single trip. Even though N+1 submissions occurred, only 2 deliveries were made.
 *
 * The throttler implements this via the queue() method, by providing it a task
 * factory. Following the example:
 *
 * 		const throttler = new Throttler();
 * 		const letters = [];
 *
 * 		function deliver() {
 * 			const lettersToDeliver = letters;
 * 			letters = [];
 * 			return makeTheTrip(lettersToDeliver);
 * 		}
 *
 * 		function onLetterReceived(l) {
 * 			letters.push(l);
 * 			throttler.queue(deliver);
 * 		}
 */
export declare class Throttler {
    private activePromise;
    private queuedPromise;
    private queuedPromiseFactory;
    constructor();
    queue<T>(promiseFactory: ITask<Promise<T>>): Promise<T>;
}
export declare class Sequencer {
    private current;
    queue<T>(promiseTask: ITask<Promise<T>>): Promise<T>;
}
export declare class SequencerByKey<TKey> {
    private promiseMap;
    queue<T>(key: TKey, promiseTask: ITask<Promise<T>>): Promise<T>;
}
/**
 * A helper to delay (debounce) execution of a task that is being requested often.
 *
 * Following the throttler, now imagine the mail man wants to optimize the number of
 * trips proactively. The trip itself can be long, so he decides not to make the trip
 * as soon as a letter is submitted. Instead he waits a while, in case more
 * letters are submitted. After said waiting period, if no letters were submitted, he
 * decides to make the trip. Imagine that N more letters were submitted after the first
 * one, all within a short period of time between each other. Even though N+1
 * submissions occurred, only 1 delivery was made.
 *
 * The delayer offers this behavior via the trigger() method, into which both the task
 * to be executed and the waiting period (delay) must be passed in as arguments. Following
 * the example:
 *
 * 		const delayer = new Delayer(WAITING_PERIOD);
 * 		const letters = [];
 *
 * 		function letterReceived(l) {
 * 			letters.push(l);
 * 			delayer.trigger(() => { return makeTheTrip(); });
 * 		}
 */
export declare class Delayer<T> implements IDisposable {
    defaultDelay: number;
    private timeout;
    private completionPromise;
    private doResolve;
    private doReject;
    private task;
    constructor(defaultDelay: number);
    trigger(task: ITask<T | Promise<T>>, delay?: number): Promise<T>;
    isTriggered(): boolean;
    cancel(): void;
    private cancelTimeout;
    dispose(): void;
}
/**
 * A helper to delay execution of a task that is being requested often, while
 * preventing accumulation of consecutive executions, while the task runs.
 *
 * The mail man is clever and waits for a certain amount of time, before going
 * out to deliver letters. While the mail man is going out, more letters arrive
 * and can only be delivered once he is back. Once he is back the mail man will
 * do one more trip to deliver the letters that have accumulated while he was out.
 */
export declare class ThrottledDelayer<T> {
    private delayer;
    private throttler;
    constructor(defaultDelay: number);
    trigger(promiseFactory: ITask<Promise<T>>, delay?: number): Promise<T>;
    isTriggered(): boolean;
    cancel(): void;
    dispose(): void;
}
/**
 * A barrier that is initially closed and then becomes opened permanently.
 */
export declare class Barrier {
    private _isOpen;
    private _promise;
    private _completePromise;
    constructor();
    isOpen(): boolean;
    open(): void;
    wait(): Promise<boolean>;
}
/**
 * A barrier that is initially closed and then becomes opened permanently after a certain period of
 * time or when open is called explicitly
 */
export declare class AutoOpenBarrier extends Barrier {
    private readonly _timeout;
    constructor(autoOpenTimeMs: number);
    open(): void;
}
export declare function timeout(millis: number): CancelablePromise<void>;
export declare function timeout(millis: number, token: CancellationToken): Promise<void>;
export declare function disposableTimeout(handler: () => void, timeout?: number): IDisposable;
/**
 * Runs the provided list of promise factories in sequential order. The returned
 * promise will complete to an array of results from each promise.
 */
export declare function sequence<T>(promiseFactories: ITask<Promise<T>>[]): Promise<T[]>;
export declare function first<T>(promiseFactories: ITask<Promise<T>>[], shouldStop?: (t: T) => boolean, defaultValue?: T | null): Promise<T | null>;
/**
 * Returns the result of the first promise that matches the "shouldStop",
 * running all promises in parallel. Supports cancelable promises.
 */
export declare function firstParallel<T>(promiseList: Promise<T>[], shouldStop?: (t: T) => boolean, defaultValue?: T | null): Promise<T | null>;
export declare function firstParallel<T, R extends T>(promiseList: Promise<T>[], shouldStop: (t: T) => t is R, defaultValue?: R | null): Promise<R | null>;
/**
 * A helper to queue N promises and run them all with a max degree of parallelism. The helper
 * ensures that at any time no more than M promises are running at the same time.
 */
export declare class Limiter<T> {
    private _size;
    private runningPromises;
    private maxDegreeOfParalellism;
    private outstandingPromises;
    private readonly _onFinished;
    constructor(maxDegreeOfParalellism: number);
    get onFinished(): Event<void>;
    get size(): number;
    queue(factory: ITask<Promise<T>>): Promise<T>;
    private consume;
    private consumed;
    dispose(): void;
}
/**
 * A queue is handles one promise at a time and guarantees that at any time only one promise is executing.
 */
export declare class Queue<T> extends Limiter<T> {
    constructor();
}
/**
 * A helper to organize queues per resource. The ResourceQueue makes sure to manage queues per resource
 * by disposing them once the queue is empty.
 */
export declare class ResourceQueue implements IDisposable {
    private readonly queues;
    queueFor(resource: URI, extUri?: IExtUri): Queue<void>;
    dispose(): void;
}
export declare class TimeoutTimer implements IDisposable {
    private _token;
    constructor();
    constructor(runner: () => void, timeout: number);
    dispose(): void;
    cancel(): void;
    cancelAndSet(runner: () => void, timeout: number): void;
    setIfNotSet(runner: () => void, timeout: number): void;
}
export declare class IntervalTimer implements IDisposable {
    private _token;
    constructor();
    dispose(): void;
    cancel(): void;
    cancelAndSet(runner: () => void, interval: number): void;
}
export declare class RunOnceScheduler {
    protected runner: ((...args: unknown[]) => void) | null;
    private timeoutToken;
    private timeout;
    private timeoutHandler;
    constructor(runner: (...args: any[]) => void, delay: number);
    /**
     * Dispose RunOnceScheduler
     */
    dispose(): void;
    /**
     * Cancel current scheduled runner (if any).
     */
    cancel(): void;
    /**
     * Cancel previous runner (if any) & schedule a new runner.
     */
    schedule(delay?: number): void;
    get delay(): number;
    set delay(value: number);
    /**
     * Returns true if scheduled.
     */
    isScheduled(): boolean;
    private onTimeout;
    protected doRun(): void;
}
export declare class RunOnceWorker<T> extends RunOnceScheduler {
    private units;
    constructor(runner: (units: T[]) => void, timeout: number);
    work(unit: T): void;
    protected doRun(): void;
    dispose(): void;
}
/**
 * The `ThrottledWorker` will accept units of work `T`
 * to handle. The contract is:
 * * there is a maximum of units the worker can handle at once (via `chunkSize`)
 * * after having handled units, the worker needs to rest (via `throttleDelay`)
 */
export declare class ThrottledWorker<T> extends Disposable {
    private readonly maxWorkChunkSize;
    private readonly maxPendingWork;
    private readonly throttleDelay;
    private readonly handler;
    private readonly pendingWork;
    private readonly throttler;
    private disposed;
    constructor(maxWorkChunkSize: number, maxPendingWork: number | undefined, throttleDelay: number, handler: (units: readonly T[]) => void);
    /**
     * The number of work units that are pending to be processed.
     */
    get pending(): number;
    /**
     * Add units to be worked on. Use `pending` to figure out
     * how many units are not yet processed after this method
     * was called.
     *
     * @returns whether the work was accepted or not. If the
     * worker is disposed, it will not accept any more work.
     * If the number of pending units would become larger
     * than `maxPendingWork`, more work will also not be accepted.
     */
    work(units: readonly T[]): boolean;
    private doWork;
    dispose(): void;
}
export interface IdleDeadline {
    readonly didTimeout: boolean;
    timeRemaining(): number;
}
/**
 * Execute the callback the next time the browser is idle
 */
export declare let runWhenIdle: (callback: (idle: IdleDeadline) => void, timeout?: number) => IDisposable;
/**
 * An implementation of the "idle-until-urgent"-strategy as introduced
 * here: https://philipwalton.com/articles/idle-until-urgent/
 */
export declare class IdleValue<T> {
    private readonly _executor;
    private readonly _handle;
    private _didRun;
    private _value?;
    private _error;
    constructor(executor: () => T);
    dispose(): void;
    get value(): T;
}
export declare function retry<T>(task: ITask<Promise<T>>, delay: number, retries: number): Promise<T>;
export interface ITaskSequentializerWithPendingTask {
    readonly pending: Promise<void>;
}
export declare class TaskSequentializer {
    private _pending?;
    private _next?;
    hasPending(taskId?: number): this is ITaskSequentializerWithPendingTask;
    get pending(): Promise<void> | undefined;
    cancelPending(): void;
    setPending(taskId: number, promise: Promise<void>, onCancel?: () => void): Promise<void>;
    private donePending;
    private triggerNext;
    setNext(run: () => Promise<void>): Promise<void>;
}
/**
 * The `IntervalCounter` allows to count the number
 * of calls to `increment()` over a duration of
 * `interval`. This utility can be used to conditionally
 * throttle a frequent task when a certain threshold
 * is reached.
 */
export declare class IntervalCounter {
    private readonly interval;
    private lastIncrementTime;
    private value;
    constructor(interval: number);
    increment(): number;
}
export declare type ValueCallback<T = unknown> = (value: T | Promise<T>) => void;
/**
 * Creates a promise whose resolution or rejection can be controlled imperatively.
 */
export declare class DeferredPromise<T> {
    private completeCallback;
    private errorCallback;
    private rejected;
    private resolved;
    get isRejected(): boolean;
    get isResolved(): boolean;
    get isSettled(): boolean;
    p: Promise<T>;
    constructor();
    complete(value: T): Promise<void>;
    error(err: unknown): Promise<void>;
    cancel(): void;
}
export declare namespace Promises {
    /**
     * A drop-in replacement for `Promise.all` with the only difference
     * that the method awaits every promise to either fulfill or reject.
     *
     * Similar to `Promise.all`, only the first error will be returned
     * if any.
     */
    function settled<T>(promises: Promise<T>[]): Promise<T[]>;
}
