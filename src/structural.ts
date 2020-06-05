/**
 * @author WMXPY
 * @namespace Asynchronous
 * @description Structural
 */

import { Promisify } from "./declare";

export class StructuralRunner<T extends Record<string, any>> {

    public static create<T extends Record<string, any>>(functions: Promisify<T>) {

        return new StructuralRunner(functions);
    }

    private readonly _functions: Promisify<T>;

    private constructor(functions: Promisify<T>) {

        this._functions = functions;
    }

    public async run(): Promise<T> {

    }
}
