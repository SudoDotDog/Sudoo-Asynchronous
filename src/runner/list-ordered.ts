/**
 * @author WMXPY
 * @namespace Asynchronous_Runner
 * @description List Ordered
 */

import { AsyncNestedExecutableArray, KeyedResult, NamedResult, PromiseFunction } from "../declare";

export type ListOrderedRunnerConditionedResult<T> = {

    readonly succeed: Record<number, T[]>;
    readonly failed: Record<number, any>;
};

export class ListOrderedRunner<T extends any = any> {

    public static create<T extends any = any>(functions: AsyncNestedExecutableArray<T>) {

        return new ListOrderedRunner<T>(functions);
    }

    private readonly _functions: AsyncNestedExecutableArray<T>;

    private constructor(functions: AsyncNestedExecutableArray<T>) {

        this._functions = functions;
    }

    public async start(...args: any[]): Promise<ListOrderedRunnerConditionedResult<T>> {

        const awaitables: Array<Promise<KeyedResult<T[]>>> =
            this._functions.map((each: PromiseFunction<T[]>, index: number) => {
                return new Promise((resolve: (status: KeyedResult<T[]>) => void) => {
                    each(...args).then((result: T[keyof T]) => {
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

        const executed: Array<KeyedResult<T[]>> = await Promise.all(awaitables);
        const results: ListOrderedRunnerConditionedResult<T> = executed.reduce(
            (previous: ListOrderedRunnerConditionedResult<T>, current: KeyedResult<T[]>) => {

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
            } as ListOrderedRunnerConditionedResult<T>,
        );

        return results;
    }
}
