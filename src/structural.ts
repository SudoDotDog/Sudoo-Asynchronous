/**
 * @author WMXPY
 * @namespace Asynchronous
 * @description Structural
 */

import { AsyncExecutableRecord, NamedPromiseFunction, NamedResult, PromiseFunction } from "./declare";

export class StructuralRunner<T extends Record<string, any>> {

    public static create<T extends Record<string, any>>(functions: AsyncExecutableRecord<T>) {

        return new StructuralRunner(functions);
    }

    private readonly _functions: AsyncExecutableRecord<T>;

    private constructor(functions: AsyncExecutableRecord<T>) {

        this._functions = functions;
    }

    public async run(...args: any[]): Promise<T> {

        const keys: Array<keyof T> = Object.keys(this._functions);
        const list: Array<NamedPromiseFunction<keyof T, T[keyof T]>> = [];

        for (const key of keys) {

            const executable: PromiseFunction<T[keyof T]> = this._functions[key];
            list.push({
                name: key,
                func: executable,
            });
        }

        const awaitables = list.map((each: NamedPromiseFunction<keyof T, T[keyof T]>) => {
            return new Promise((resolve: (status: NamedResult<keyof T, T[keyof T]>) => void) => {
                each.func(...args).then((result: T[keyof T]) => {
                    resolve({
                        name: each.name,
                        succeed: true,
                        result,
                    });
                }).catch((reason: any) => {
                    resolve({
                        name: each.name,
                        succeed: false,
                        reason,
                    });
                });
            });
        });

        const executed: Array<NamedResult<keyof T, T[keyof T]>> = await Promise.all(awaitables);
        const results: Partial<T> = executed.reduce((previous: Partial<T>, current: NamedResult<keyof T, T[keyof T]>) => {
            return {
                ...previous,
                [current.name]: current.succeed as any,
            };
        }, {} as Partial<T>);

        return results as T;
    }
}
