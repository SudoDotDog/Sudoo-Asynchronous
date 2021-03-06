/**
 * @author WMXPY
 * @namespace Asynchronous_Runner
 * @description Structural
 */

import { AsyncExecutableRecord, NamedPromiseFunction, NamedResult, PromiseFunction } from "../declare";

export type StructuralRunnerConditionedResult<T> = {

    readonly succeed: Partial<T>;
    readonly failed: Partial<Record<keyof T, any>>;
};

export class StructuralRunner<T extends Record<string, any> = Record<string, any>> {

    public static create<T extends Record<string, any> = Record<string, any>>(functions: AsyncExecutableRecord<T>): StructuralRunner<T> {

        return new StructuralRunner<T>(functions);
    }

    private readonly _functions: AsyncExecutableRecord<T>;

    private constructor(functions: AsyncExecutableRecord<T>) {

        this._functions = functions;
    }

    public async startReplaceFailed(whenFailed: any, ...args: any[]): Promise<Record<keyof T, any>> {

        const evaluated: StructuralRunnerConditionedResult<T> = await this.start(...args);
        const succeedKeys: Array<keyof T> = Object.keys(evaluated.succeed);
        const failedKeys: Array<keyof T> = Object.keys(evaluated.failed);

        const result: Record<keyof T, any> = {} as Record<keyof T, any>;

        for (const succeedKey of succeedKeys) {
            result[succeedKey] = evaluated.succeed[succeedKey];
        }
        for (const failedKey of failedKeys) {
            result[failedKey] = whenFailed;
        }

        return result;
    }

    public async startIgnoreFailed(...args: any[]): Promise<Partial<T>> {

        const evaluated: StructuralRunnerConditionedResult<T> = await this.start(...args);
        return evaluated.succeed;
    }

    public async start(...args: any[]): Promise<StructuralRunnerConditionedResult<T>> {

        const keys: Array<keyof T> = Object.keys(this._functions);
        const list: Array<NamedPromiseFunction<keyof T, T[keyof T]>> = [];

        for (const key of keys) {

            const executable: PromiseFunction<T[keyof T]> = this._functions[key];
            list.push({
                name: key,
                func: executable,
            });
        }

        const awaitables: Array<Promise<NamedResult<keyof T, T[keyof T]>>> =
            list.map((each: NamedPromiseFunction<keyof T, T[keyof T]>) => {
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
        const results: StructuralRunnerConditionedResult<T> = executed.reduce(
            (previous: StructuralRunnerConditionedResult<T>, current: NamedResult<keyof T, T[keyof T]>) => {

                if (current.succeed === true) {
                    return {
                        ...previous,
                        succeed: {
                            ...previous.succeed,
                            [current.name]: current.result,
                        },
                    };
                }

                if (current.succeed === false) {
                    return {
                        ...previous,
                        failed: {
                            ...previous.failed,
                            [current.name]: current.reason,
                        },
                    };
                }

                return previous;
            }, {
                succeed: {},
                failed: {},
            } as StructuralRunnerConditionedResult<T>,
        );

        return results;
    }
}
