/**
 * @author WMXPY
 * @namespace Asynchronous_Runner
 * @description Ordered List 
 */

import { AsyncExecutableArray, KeyedResult, PromiseFunction } from "../declare";

export type OrderedListRunnerConditionedResult<T> = {

    readonly succeed: Record<number, T>;
    readonly failed: Record<number, any>;
};

export class OrderedListRunner<T = any> {

    public static create<T = any>(functions: AsyncExecutableArray<T>): OrderedListRunner<T> {

        return new OrderedListRunner<T>(functions);
    }

    private readonly _functions: AsyncExecutableArray<T>;

    private constructor(functions: AsyncExecutableArray<T>) {

        this._functions = functions;
    }

    public async startReplaceFailed(whenFailed: any, ...args: any[]): Promise<Record<number, T>> {

        const evaluated: OrderedListRunnerConditionedResult<T> = await this.start(...args);
        const succeedKeys: string[] = Object.keys(evaluated.succeed);
        const failedKeys: string[] = Object.keys(evaluated.failed);

        const result: Record<number, T> = {} as Record<number, T>;

        for (const succeedKey of succeedKeys) {
            const numberedKey: number = Number(succeedKey);
            result[numberedKey] = evaluated.succeed[numberedKey];
        }
        for (const failedKey of failedKeys) {
            const numberedKey: number = Number(failedKey);
            result[numberedKey] = whenFailed;
        }

        return result;
    }

    public async startIgnoreFiled(...args: any[]): Promise<Record<number, T>> {

        const evaluated: OrderedListRunnerConditionedResult<T> = await this.start(...args);
        return evaluated.succeed;
    }

    public async start(...args: any[]): Promise<OrderedListRunnerConditionedResult<T>> {

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
        const results: OrderedListRunnerConditionedResult<T> = executed.reduce(
            (previous: OrderedListRunnerConditionedResult<T>, current: KeyedResult<T>) => {

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
                succeed: {},
                failed: {},
            } as OrderedListRunnerConditionedResult<T>,
        );

        return results;
    }
}
