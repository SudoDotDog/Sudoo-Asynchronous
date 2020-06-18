/**
 * @author WMXPY
 * @namespace Asynchronous_Util
 * @description Sleep
 */

export const sleep = (time: number): Promise<number> => {

    const startTime: number = Date.now();

    return Promise((resolve: () => void) => {

        setTimeout(() => {

        }, timeout);
    });
};
