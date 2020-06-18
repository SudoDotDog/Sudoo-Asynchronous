/* eslint-disable @typescript-eslint/require-await */
/**
 * @author WMXPY
 * @namespace Asynchronous_Runner
 * @description Unordered List
 * @override Unit Test
 */

import { expect } from "chai";
import * as Chance from "chance";
import { UnorderedListRunner } from "../../../src";

describe('Given {UnorderedListRunner} Class', (): void => {

    const chance: Chance.Chance = new Chance('asynchronous-unordered-list');

    it('should be able to construct', (): void => {

        const runner: UnorderedListRunner<number> = UnorderedListRunner.create([
            async () => chance.integer(),
        ]);

        expect(runner).to.be.instanceOf(UnorderedListRunner);
    });


    it('should be able to execute', async (): Promise<void> => {

        const value: number = chance.integer();
        const runner: UnorderedListRunner<number> = UnorderedListRunner.create([
            async () => value,
        ]);

        const result = await runner.start();

        expect(result).to.be.deep.equal({
            failed: {},
            succeed: [value],
        });
    });

    it('should be able to execute - args', async (): Promise<void> => {

        const value: number = chance.integer();
        const runner: UnorderedListRunner<number> = UnorderedListRunner.create([
            async (current: number) => current + 1,
        ]);

        const result = await runner.start(value);

        expect(result).to.be.deep.equal({
            failed: {},
            succeed: [value + 1],
        });
    });

    it('should be able to execute - multiple', async (): Promise<void> => {

        const errorInstance: Error = new Error(chance.string());
        const value1: number = chance.integer();
        const value2: number = chance.integer();
        const runner: UnorderedListRunner<number> = UnorderedListRunner.create([
            async () => value1,
            async () => value2,
            async () => {
                throw errorInstance;
            },
        ]);

        const result = await runner.start();

        expect(result).to.be.deep.equal({
            failed: {
                2: errorInstance,
            },
            succeed: [value1, value2],
        });
    });

    it('should be able to execute - ignore', async (): Promise<void> => {

        const errorInstance: Error = new Error(chance.string());
        const value1: number = chance.integer();
        const value2: number = chance.integer();
        const runner: UnorderedListRunner<number> = UnorderedListRunner.create([
            async () => value1,
            async () => value2,
            async () => {
                throw errorInstance;
            },
        ]);

        const result = await runner.startIgnoreFiled();

        expect(result).to.be.deep.equal([value1, value2]);
    });
});
