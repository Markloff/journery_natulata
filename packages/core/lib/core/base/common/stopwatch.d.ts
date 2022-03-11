export declare class StopWatch {
    private _highResolution;
    private _startTime;
    private _stopTime;
    static create(highResolution?: boolean): StopWatch;
    constructor(highResolution: boolean);
    private _now;
    stop(): void;
    elapsed(): number;
}
