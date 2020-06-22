/**
 * @author WMXPY
 * @namespace Asynchronous_Pool
 * @description Pool
 */

import { KeyedPromiseFunction, PromiseFunction, RejectFunction } from "../declare";

export class ParallelPool {

    public static create(limit: number): ParallelPool {

        return new ParallelPool(limit);
    }

    private readonly _limit: number;

    private _whenReject: RejectFunction | null;

    private constructor(limit: number) {

        this._limit = limit;

        this._whenReject = null;
    }

    public whenReject(func: RejectFunction): this {

        this._whenReject = func;
        return this;
    }

    public execute<T extends any = any>(promises: Array<PromiseFunction<T>>): Promise<T[]> {

        let count: number = 0;

        const cloned: Array<KeyedPromiseFunction<T>> = this._mapPromiseFunctions(promises);
        const responses: T[] = [];

        const run = (resolve: () => void, reject: (reason: any) => void): void => {

            const func: KeyedPromiseFunction<T> | undefined = cloned.shift();

            if (!func) {
                return;
            }

            func.func().then((response: T) => {

                responses[func.key] = response;
                run(resolve, reject);
                return;
            }).catch((reason: any) => {

                if (this._whenReject) {
                    if (this._whenReject(reason)) {
                        run(resolve, reject);
                        return;
                    }
                }
                reject(reason);
                return;
            }).finally(() => {

                count++;
                resolve();
                return;
            });
        };

        return new Promise<T[]>((resolve: (value: T[]) => void, reject: (reason: any) => void) => {

            for (let i = 0; i < this._limit; i++) {

                run(() => {

                    if (count === promises.length) {
                        resolve(responses);
                    }
                    return;
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
