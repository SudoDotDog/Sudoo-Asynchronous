/**
 * @author WMXPY
 * @namespace Asynchronous_Future
 * @description Executable
 */

import { PromiseFunction } from "../declare";

export class ExecutableFuture<T extends any = any, A extends any[] = []> {

    public static create<T extends any = any, A extends any[] = []>(func: PromiseFunction<T, A>): ExecutableFuture<T, A> {

        return new ExecutableFuture<T, A>(func);
    }

    private readonly _function: PromiseFunction<T, A>;

    private constructor(func: PromiseFunction<T, A>) {

        this._function = func;
    }

    public start(...args: A): Promise<T> {

        const promise = this._function(...args);
        return promise;
    }
}
