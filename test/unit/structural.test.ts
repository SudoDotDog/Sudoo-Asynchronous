/**
 * @author WMXPY
 * @namespace Asynchronous
 * @description Structural
 * @override Unit Test
 */

import { expect } from "chai";
import * as Chance from "chance";
import { StructuralRunner } from "../../src";

describe('Given {StructuralRunner} Class', (): void => {

    const chance: Chance.Chance = new Chance('asynchronous-structural');

    it('should be able to construct', (): void => {

        const runner: StructuralRunner<{
            a: number;
        }> = StructuralRunner.create({
            a: async () => 10,
        });

        expect(runner).to.be.instanceOf(StructuralRunner);
    });

    it('should be able to execute', async (): Promise<void> => {

        const runner: StructuralRunner<{
            a: number;
        }> = StructuralRunner.create({
            a: async () => 10,
        });

        const result = await runner.start();

        expect(result).to.be.deep.equal({

        });
    });
});
