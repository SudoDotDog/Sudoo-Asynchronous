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
    private _resolve: (time: number) => void | null;

    private constructor() {

        this._timer = null;
        this._resolve = null;
    }

    public start(time: number): Promise<number> {

        const startTime: number = Date.now();

        return new Promise<number>((resolve: (time: number) => void) => {

            this._resolve = resolve;
            this._timer = setTimeout(() => {

                const endTime: number = Date.now();

                this._resolve = null;
                this._timer = null;
                resolve(endTime - startTime);
            }, time);
        });
    }
}
