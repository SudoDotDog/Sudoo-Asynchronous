/**
 * @author WMXPY
 * @namespace Asynchronous
 * @description Parallel
 * @override Scenario Test
 */

import { expect } from "chai";
import * as Chance from "chance";
import { ParallelPool } from "../../src";
import { PromiseFunction } from "../../src/declare";

describe('Given {ParallelPool} Class Scenario', (): void => {

    const chance: Chance.Chance = new Chance('scenario-asynchronous-parallel');

    it('should be able to run parallel', async (): Promise<void> => {

        const LIMIT: number = 5;
        const POOL: number = 10;

        const expectedResult: string[] = [];

        const functions: Array<PromiseFunction<string>> = [];

        for (let i = 0; i < POOL; i++) {

            const mash: string = chance.string();
            expectedResult.push(mash);

            const delay: number = chance.natural({
                min: 5,
                max: 15,
            });
            functions.push((): Promise<string> => new Promise<string>((resolve: (value: string) => void) => {
                setTimeout(() => {
                    resolve(mash);
                }, delay);
            }));
        }

        const parallel: ParallelPool = ParallelPool.create(LIMIT);

        const result = await parallel.execute(functions);

        expect(result).to.be.deep.equal(expectedResult);
    });

    it('should be able to reject parallel', async (): Promise<void> => {

        const LIMIT: number = 5;
        const POOL: number = 10;

        const expectedResult: string[] = [];

        const functions: Array<PromiseFunction<string>> = [];

        for (let i = 0; i < POOL; i++) {

            const mash: string = chance.string();
            expectedResult.push(mash);

            const delay: number = chance.natural({
                min: 5,
                max: 15,
            });
            functions.push((): Promise<string> => new Promise<string>((resolve: (value: string) => void, reject: (reason: any) => void) => {

                // tslint:disable-next-line: no-magic-numbers
                if (i === 7) {
                    reject('WRONG');
                    return;
                }

                setTimeout(() => {
                    resolve(mash);
                }, delay);
            }));
        }

        const parallel: ParallelPool = ParallelPool.create(LIMIT);
        let error: string = '';

        try {
            await parallel.execute(functions);
        } catch (reason) {
            error = reason;
        }

        expect(error).to.be.equal('WRONG');
    });

    it('should be able to self fix reject parallel - 1', async (): Promise<void> => {

        const LIMIT: number = 5;
        const POOL: number = 10;

        const expectedResult: string[] = [];

        const functions: Array<PromiseFunction<string>> = [];

        for (let i = 0; i < POOL; i++) {

            const mash: string = chance.string();
            expectedResult.push(mash);

            const delay: number = chance.natural({
                min: 5,
                max: 15,
            });
            functions.push((): Promise<string> => new Promise<string>((resolve: (value: string) => void, reject: (reason: any) => void) => {

                // tslint:disable-next-line: no-magic-numbers
                if (i === 7) {
                    reject('WRONG');
                    return;
                }

                setTimeout(() => {
                    resolve(mash);
                }, delay);
            }));
        }

        // tslint:disable-next-line: no-magic-numbers
        expectedResult[7] = undefined as any;

        const parallel: ParallelPool = ParallelPool.create(LIMIT);
        parallel.whenReject((_: any) => true);

        const result = await parallel.execute(functions);

        expect(result).to.be.deep.equal(expectedResult);
    });

    it('should be able to self fix reject parallel - 2', async (): Promise<void> => {

        const LIMIT: number = 5;
        const POOL: number = 10;

        const expectedResult: string[] = [];

        const functions: Array<PromiseFunction<string>> = [];

        for (let i = 0; i < POOL; i++) {

            const mash: string = chance.string();
            expectedResult.push(mash);

            const delay: number = chance.natural({
                min: 5,
                max: 15,
            });
            functions.push((): Promise<string> => new Promise<string>((resolve: (value: string) => void, reject: (reason: any) => void) => {

                // tslint:disable-next-line: no-magic-numbers
                if (i === 7) {
                    reject('WRONG');
                    return;
                }

                // tslint:disable-next-line: no-magic-numbers
                if (i === 5) {
                    reject('RIGHT');
                    return;
                }

                setTimeout(() => {
                    resolve(mash);
                }, delay);
            }));
        }

        const parallel: ParallelPool = ParallelPool.create(LIMIT);
        parallel.whenReject((reason: any) => reason === 'RIGHT');
        let error: string = '';

        try {
            await parallel.execute(functions);
        } catch (reason) {
            error = reason;
        }

        expect(error).to.be.equal('WRONG');
    });
});
