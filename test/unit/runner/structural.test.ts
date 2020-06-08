/**
 * @author WMXPY
 * @namespace Asynchronous_Runner
 * @description Structural
 * @override Unit Test
 */

import { expect } from "chai";
import * as Chance from "chance";
import { StructuralRunner } from "../../../src";

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
            failed: {},
            succeed: {
                a: 10,
            },
        });
    });

    it('should be able to execute - args', async (): Promise<void> => {

        const runner: StructuralRunner<{
            a: number;
        }> = StructuralRunner.create({
            a: async (value: number) => value + 1,
        });

        const result = await runner.start(9);

        expect(result).to.be.deep.equal({
            failed: {},
            succeed: {
                a: 10,
            },
        });
    });

    it('should be able to execute - multiple', async (): Promise<void> => {

        const errorInstance: Error = new Error(chance.string());
        const runner: StructuralRunner<{
            a: number;
            b: number;
        }> = StructuralRunner.create({
            a: async () => 10,
            b: async () => 1,
            c: async () => {
                throw errorInstance;
            },
        });

        const result = await runner.start();

        expect(result).to.be.deep.equal({
            failed: {
                c: errorInstance,
            },
            succeed: {
                a: 10,
                b: 1,
            },
        });
    });

    it('should be able to execute ignore failed', async (): Promise<void> => {

        const errorInstance: Error = new Error(chance.string());
        const runner: StructuralRunner<{
            a: number;
            b: number;
        }> = StructuralRunner.create({
            a: async () => 10,
            b: async () => 1,
            c: async () => {
                throw errorInstance;
            },
        });

        const result = await runner.startIgnoreFailed();

        expect(result).to.be.deep.equal({
            a: 10,
            b: 1,
        });
    });

    it('should be able to execute replace failed', async (): Promise<void> => {

        const errorInstance: Error = new Error(chance.string());
        const runner: StructuralRunner<{
            a: number;
            b: number;
        }> = StructuralRunner.create({
            a: async () => 10,
            b: async () => 1,
            c: async () => {
                throw errorInstance;
            },
        });

        const result = await runner.startReplaceFailed(errorInstance);

        expect(result).to.be.deep.equal({
            a: 10,
            b: 1,
            c: errorInstance,
        });
    });
});
