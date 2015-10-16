/**
 * A promise-friendly process runner. The original process is available as the
 * `proc` attribute on the returned promise.
 *
 * Example:
 * ```
 * const output = await run('ls', ['-a']);
 * ```
 *
 * @flow
 */

import { spawn } from "child_process";
import promisify from "./promisify";

export default function(cmd: string, args: Array<string>): Promise<string> {
    const proc = spawn(cmd, args);
    const promise = promisify(done => {
        let buf = "";
        proc.stdout.on("data", data => {
            buf += data.toString();
        });
        proc.stderr.on("data", data => {
            buf += data.toString();
        });
        proc.on("close", code => {
            if (code === 0) {
                return done(null, buf);
            }
            done(new Error(`Error code ${code}. Output ${buf}`));
        });
        proc.on("error", error => {
            error.output = buf;
            done(error, buf);
        });
    });
    return promise;
};

