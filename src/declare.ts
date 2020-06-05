/**
 * @author WMXPY
 * @namespace Asynchronous
 * @description Declare
 */

export type PromiseFunction<T> = (...args: any[]) => Promise<T>;

export type RejectFunction = (reason: any) => boolean;

export type KeyedPromise<T> = {

    readonly key: number;
    readonly func: Promise<T>;
};

export type KeyedPromiseFunction<T> = {

    readonly key: number;
    readonly func: PromiseFunction<T>;
};

export type NamedPromise<K, T> = {

    readonly name: K;
    readonly func: Promise<T>;
};

export type NamedPromiseFunction<K, T> = {

    readonly name: K;
    readonly func: PromiseFunction<T>;
};

export type AsyncExecutableRecord<T extends Record<string, any>> = {
    [K in keyof T]: PromiseFunction<T[K]>;
};
