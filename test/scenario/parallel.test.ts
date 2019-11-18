/**
 * @author WMXPY
 * @namespace Asynchronous
 * @description Parallel
 * @override Scenario Test
 */

import { expect } from "chai";
import * as Chance from "chance";
import { PromiseFunction } from "../../src/declare";
import { Parallel } from "../../src/parallel";

describe('Given {Parallel} Class Scenario', (): void => {

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

        const parallel: Parallel = Parallel.create(LIMIT);

        const result = await parallel.execute(functions);

        expect(result).to.be.deep.equal(expectedResult);
    });
});
