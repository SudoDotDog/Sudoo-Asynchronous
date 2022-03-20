/**
 * @author WMXPY
 * @namespace Asynchronous_Runner
 * @description Unordered List 
 */

import { AsyncExecutableArray, KeyedResult, PromiseFunction } from "../declare";

export type UnorderedListRunnerResult<T> = {

    readonly succeed: T[];
    readonly failed: Record<number, any>;
};

export class UnorderedListRunner<T = any> {

    public static create<T = any>(functions: AsyncExecutableArray<T>): UnorderedListRunner<T> {

        return new UnorderedListRunner<T>(functions);
    }

    private readonly _functions: AsyncExecutableArray<T>;

    private constructor(functions: AsyncExecutableArray<T>) {

        this._functions = functions;
    }

    public async startIgnoreFiled(...args: any[]): Promise<T[]> {

        const evaluated: UnorderedListRunnerResult<T> = await this.start(...args);
        return evaluated.succeed;
    }

    public async start(...args: any[]): Promise<UnorderedListRunnerResult<T>> {

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
        const results: UnorderedListRunnerResult<T> = executed.reduce(
            (previous: UnorderedListRunnerResult<T>, current: KeyedResult<T>) => {

                if (current.succeed === true) {
                    return {
                        ...previous,
                        succeed: [...previous.succeed, current.result],
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
            } as UnorderedListRunnerResult<T>,
        );

        return results;
    }
}
