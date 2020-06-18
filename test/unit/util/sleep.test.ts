/**
 * @author WMXPY
 * @namespace Asynchronous_Util
 * @description Sleep
 * @override Unit Test
 */

import { expect } from "chai";
import * as Chance from "chance";
import { Sleep } from "../../../src";

describe('Given {Sleep} Class', (): void => {

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const chance: Chance.Chance = new Chance('asynchronous-util-sleep');

    it('should be able to construct', (): void => {

        const sleep: Sleep = Sleep.create();

        expect(sleep).to.be.instanceOf(Sleep);
    });

    it('should be able to sleep in a short amount of time', async (): Promise<void> => {

        const sleep: Sleep = Sleep.create();
        const value: number = 20;

        const startTime: number = Date.now();

        const result: number = await sleep.start(value);

        const endTime: number = Date.now();
        const difference: number = endTime - startTime;

        expect(result).to.be.below(value + 5);
        expect(result).to.be.above(value - 5);

        expect(difference).to.be.below(value + 5);
        expect(difference).to.be.above(value - 5);
    });
});
