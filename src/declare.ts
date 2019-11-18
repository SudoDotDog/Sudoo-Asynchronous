/**
 * @author WMXPY
 * @namespace Asynchronous
 * @description Declare
 */

export type PromiseFunction<T> = () => Promise<T>;

export type RejectFunction = (reason: any) => boolean;

export type KeyedPromiseFunction<T> = {

    readonly key: number;
    readonly func: PromiseFunction<T>;
};
