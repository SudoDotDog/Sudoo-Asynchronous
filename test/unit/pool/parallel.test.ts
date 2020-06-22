/**
 * @author WMXPY
 * @namespace Asynchronous_Pool
 * @description Parallel
 * @override Unit Test
 */

import { expect } from "chai";
import * as Chance from "chance";
import { ParallelPool } from "../../../src";

describe('Given {ParallelPool} Class', (): void => {

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const chance: Chance.Chance = new Chance('asynchronous-parallel');

    it('should be able to construct', (): void => {

        const LIMIT: number = 5;

        const parallel: ParallelPool = ParallelPool.create(LIMIT);
        expect(parallel).to.be.instanceOf(ParallelPool);
    });
});
