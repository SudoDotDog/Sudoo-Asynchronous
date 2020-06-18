/* eslint-disable @typescript-eslint/require-await */
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


    it('should be able to execute', async (): Promise<void> => {

        const value: number = chance.integer();
        const runner: OrderedListRunner<number> = OrderedListRunner.create([
            async () => value,
        ]);

        const result = await runner.start();

        expect(result).to.be.deep.equal({
            failed: {},
            succeed: {
                0: value,
            },
        });
    });

    it('should be able to execute - args', async (): Promise<void> => {

        const value: number = chance.integer();
        const runner: OrderedListRunner<number> = OrderedListRunner.create([
            async (current: number) => current + 1,
        ]);

        const result = await runner.start(value);

        expect(result).to.be.deep.equal({
            failed: {},
            succeed: {
                0: value + 1,
            },
        });
    });

    it('should be able to execute - multiple', async (): Promise<void> => {

        const errorInstance: Error = new Error(chance.string());
        const value1: number = chance.integer();
        const value2: number = chance.integer();
        const runner: OrderedListRunner<number> = OrderedListRunner.create([
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
            succeed: {
                0: value1,
                1: value2,
            },
        });
    });

    it('should be able to execute - ignore', async (): Promise<void> => {

        const errorInstance: Error = new Error(chance.string());
        const value1: number = chance.integer();
        const value2: number = chance.integer();
        const runner: OrderedListRunner<number> = OrderedListRunner.create([
            async () => value1,
            async () => value2,
            async () => {
                throw errorInstance;
            },
        ]);

        const result = await runner.startIgnoreFiled();

        expect(result).to.be.deep.equal({
            0: value1,
            1: value2,
        });
    });

    it('should be able to execute - replace', async (): Promise<void> => {

        const errorInstance: Error = new Error(chance.string());
        const value1: number = chance.integer();
        const value2: number = chance.integer();
        const replace: number = chance.integer();
        const runner: OrderedListRunner<number> = OrderedListRunner.create([
            async () => value1,
            async () => value2,
            async () => {
                throw errorInstance;
            },
        ]);

        const result = await runner.startReplaceFailed(replace);

        expect(result).to.be.deep.equal({
            0: value1,
            1: value2,
            2: replace,
        });
    });
});
