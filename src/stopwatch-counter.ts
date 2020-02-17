/**
 * @author WMXPY
 * @namespace Asynchronous
 * @description Stopwatch
 */

export class CounterStopwatch {

    public static create(resetInterval: number): CounterStopwatch {

        return new CounterStopwatch(resetInterval);
    }

    private readonly _resetInterval: number;

    private _counter: number;

    private constructor(resetInterval: number) {

        this._resetInterval = resetInterval;

        this._counter = 0;
    }

    public get counter(): number {

        return this._counter;
    }

    public plus(amount: number = 1): this {

        this._counter = this._counter + amount;
        return this;
    }
}
