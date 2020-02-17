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

    private _timer: any = null;
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

    public reset(): this {

        this._counter = 0;
        return this;
    }

    public start(): this {

        this._timer = setInterval(() => {
            this._counter = 0;
        }, this._resetInterval);
        return this;
    }

    public destroy(): this {

        clearInterval(this._timer);
        this._timer = null;
        return this;
    }
}
