/**
 * A convenience function that returns a promise which will resolve after
 * ${timeMs} ms
 *
 * Usage:
 * await wait(500);
 *
 * @flow
 */

import promisify from "./promisify";

export default (timeMs: number): Promise<void> =>
    promisify(done => setTimeout(() => done(), timeMs));

