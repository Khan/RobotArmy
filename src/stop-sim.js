/**
 * Stop a simulator, and wait till the device is in "Shutdown" state
 *
 * @param {string} deviceName (see get-sim.js)
 * @param {string} iosVersion (see get-sim.js)
 * @param {process} proc (optional) the simulator process
 * @param {number} timeoutMs
 *
 * @flow
 */

import * as consts from "./consts";
import listSims from "./list-sims";
import wait from "./wait";
import { shutdown } from "./simctl";

import type { ChildProcess } from "./types";

const defaultTimeoutMs = 30 * 1000;
const checkPauseMs = 500;

export default async function stopSim(
  deviceName: string,
  iosVersion: string,
  proc: ChildProcess,
  timeoutMs?: number = defaultTimeoutMs
): Promise<void> {
    let info = (await listSims())[iosVersion][deviceName];
    if (info.status === consts.SHUTDOWN) {
        return;
    }
    const start = new Date();
    if (proc) {
        proc.kill();
    } else {
        await shutdown(info.UDID);
    }

    while (Date.now() - start < timeoutMs) {
        info = (await listSims())[iosVersion][deviceName];
        if (info.status === consts.SHUTDOWN) {
            return;
        }
        await wait(checkPauseMs);
    }
    throw new Error(`Simulator did not shut down within ${timeoutMs / 1000}s`);
};

