/**
 * @author WMXPY
 * @namespace Asynchronous_Runner
 * @description Unordered List 
 */

import { AsyncExecutableArray, KeyedResult, PromiseFunction } from "../declare";

export type NestedOrderedListRunnerConditionedResult<T> = {

    readonly succeed: Record<number, T>;
    readonly failed: Record<number, any>;
};

export class NestedOrderedListRunner<T extends any = any> {

    public static create<T extends any = any>(functions: AsyncExecutableArray<T>) {

        return new NestedOrderedListRunner<T>(functions);
    }

    private readonly _functions: AsyncExecutableArray<T>;

    private constructor(functions: AsyncExecutableArray<T>) {

        this._functions = functions;
    }

    public async start(...args: any[]): Promise<NestedOrderedListRunnerConditionedResult<T>> {

        const awaitables: Array<Promise<KeyedResult<T>>> =
            this._functions.map((each: PromiseFunction<T>, index: number) => {
                return new Promise((resolve: (status: KeyedResult<T>) => void) => {
                    each(...args).then((result: T) => {
                        resolve({
                            key: index,
                            succeed: true,
                            result,
                        });
                    }).catch((reason: any) => {
                        resolve({
                            key: index,
                            succeed: false,
                            reason,
                        });
                    });
                });
            });

        const executed: Array<KeyedResult<T>> = await Promise.all(awaitables);
        const results: NestedOrderedListRunnerConditionedResult<T> = executed.reduce(
            (previous: NestedOrderedListRunnerConditionedResult<T>, current: KeyedResult<T>) => {

                if (current.succeed === true) {
                    return {
                        ...previous,
                        succeed: {
                            ...previous.succeed,
                            [current.key]: current.result,
                        },
                    };
                }

                if (current.succeed === false) {
                    return {
                        ...previous,
                        failed: {
                            ...previous.failed,
                            [current.key]: current.reason,
                        },
                    };
                }

                return previous;
            }, {
                succeed: [],
                failed: {},
            } as NestedOrderedListRunnerConditionedResult<T>,
        );

        return results;
    }
}
