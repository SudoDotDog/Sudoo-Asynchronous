/**
 * @author WMXPY
 * @namespace Asynchronous
 * @description Parallel
 */

import { KeyedPromiseFunction, PromiseFunction } from "./declare";

export class Parallel {

    public static create(limit: number): Parallel {

        return new Parallel(limit);
    }

    private readonly _limit: number;

    private constructor(limit: number) {

        this._limit = limit;
    }

    public execute<T extends any = any>(promises: Array<PromiseFunction<T>>): Promise<T[]> {

        const cloned: Array<KeyedPromiseFunction<T>> = this._mapPromiseFunctions(promises);
        const responses: T[] = [];

        const run = async (resolve: () => void, reject: (reason: any) => void) => {

            const func: KeyedPromiseFunction<T> | undefined = cloned.shift();

            if (!func) {
                resolve();
            }
            func.func().then((response: T) => {

                response[func.key] = response;
                run(resolve, reject);
            });
        };

        return new Promise<T[]>((resolve: (value: T[]) => void, reject: (reason: any) => void) => {

            for (let i = 0; i < this._limit; i++) {

                run(() => {
                    resolve(responses);
                }, reject);
            }
        });
    }

    private _mapPromiseFunctions<T extends any = any>(promises: Array<PromiseFunction<T>>): Array<KeyedPromiseFunction<T>> {

        return promises.map((func: PromiseFunction<T>, index: number): KeyedPromiseFunction<T> => {

            return {
                key: index,
                func,
            };
        });
    }
}
