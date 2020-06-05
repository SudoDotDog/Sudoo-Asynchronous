/**
 * @author WMXPY
 * @namespace Asynchronous
 * @description Structural
 */

import { AsyncExecutable, AsyncExecutableRecord } from "./declare";

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
        for (const key of keys) {

            const executable: AsyncExecutable<T[keyof T]> = this._functions[key];
        }
    }
}
