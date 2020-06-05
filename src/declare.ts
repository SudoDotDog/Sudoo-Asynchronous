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

export type AsyncExecutable<T extends any> = (...args: any[]) => Promise<T>;

export type AsyncExecutableRecord<T extends Record<string, any>> = {
    [K in keyof T]: AsyncExecutable<T[K]>;
};
