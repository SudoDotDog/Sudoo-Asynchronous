/**
 * @author WMXPY
 * @namespace Asynchronous_Runner
 * @description Ordered List
 * @override Unit Test
 */

import { expect } from "chai";
import * as Chance from "chance";
import { OrderedListRunner } from "../../../src";

describe('Given {OrderedListRunner} Class', (): void => {

    const chance: Chance.Chance = new Chance('asynchronous-ordered-list');

    it('should be able to construct', (): void => {

        const runner: OrderedListRunner<number> = OrderedListRunner.create([
            async () => chance.integer(),
        ]);

        expect(runner).to.be.instanceOf(OrderedListRunner);
    });
});
