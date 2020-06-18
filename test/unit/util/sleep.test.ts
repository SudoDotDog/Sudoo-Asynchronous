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
});
