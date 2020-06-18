/**
 * @author WMXPY
 * @namespace Asynchronous_Util
 * @description Sleep
 */

export class Sleep {

    public static create(): Sleep {

        return new Sleep();
    }

    private _timer: any;
    private _startTime: number | null;
    private _resolve: ((time: number) => void) | null;

    private constructor() {

        this._timer = null;
        this._startTime = null;
        this._resolve = null;
    }

    public start(time: number): Promise<number> {

        const startTime: number = Date.now();
        this._startTime = startTime;

        return new Promise<number>((resolve: (time: number) => void) => {

            this._resolve = resolve;
            this._timer = setTimeout(() => {

                this._resetValues();

                const endTime: number = Date.now();
                const difference: number = endTime - startTime;

                resolve(difference);
            }, time);
        });
    }

    public stop(): number {

        if (this._timer === null
            || this._startTime === null
            || this._resolve === null) {

            return NaN;
        }

        clearTimeout(this._timer);

        const endTime: number = Date.now();
        const difference: number = endTime - this._startTime;

        this._resolve(difference);
        this._resetValues();

        return difference;
    }

    private _resetValues(): void {

        this._timer = null;
        this._startTime = null;
        this._resolve = null;
        return;
    }
}
