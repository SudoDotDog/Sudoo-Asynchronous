/**
 * @author WMXPY
 * @namespace Asynchronous
 * @description Parallel
 * @override Unit Test
 */

import { expect } from "chai";
import * as Chance from "chance";
import { ParallelRunner } from "../../src/parallel";

describe('Given {Parallel} Class', (): void => {

    const chance: Chance.Chance = new Chance('asynchronous-parallel');

    it('should be able to construct', (): void => {

        const LIMIT: number = 5;

        const parallel: ParallelRunner = ParallelRunner.create(LIMIT);
        expect(parallel).to.be.instanceOf(ParallelRunner);
    });
});
