/**
 * Start a simulator, optionally resetting the runtime first.
 *
 * @param {string} version The iOS version requested, e.g. `iOS 8.4`
 * @param {string} device The device name, e.g. `iPad 2`
 * @param {bool} reset (default false) Reset the device before starting it up
 * @param {int} timeoutMs (default 10,000ms)
 *
 * @flow
 */

import { spawn } from "child_process";

import * as consts from "./consts";
import getSimPath from "./get-sim-path";
import listSims from "./list-sims";
import { shutdown, erase } from "./simctl";

import type { ChildProcess } from "./types";

// To make a new device:
//
//   Xcrun simctl create ipad-5 com.apple.CoreSimulator.SimDeviceType.iPad-2 \
//      com.apple.CoreSimulator.SimRuntime.iOS-8-4

export type Result = {
    UDID: string,
    proc: ?ChildProcess;
};

const defaultTimeoutMs = 10 * 1000;

export default async function getSim(
    version: string,
    device: string,
    reset?: boolean,
    timeoutMs?: number = defaultTimeoutMs
): Promise<Result> {
    const simPath = await getSimPath();
    if (!simPath) {
        throw new Error("Simulator not found. " +
                        "Run `xcode-select` to make sure you have Xcode");
    }
    let sims = await listSims();
    if (!sims[version] || !sims[version][device]) {
        console.error(sims);
        throw new Error(`Unable to find ${version} - ${device}`);
    }
    let info = sims[version][device];
    if (reset) {
        console.log("Resetting simulator");
        if (info.status !== consts.SHUTDOWN) {
            await shutdown(info.UDID);
        }
        await erase(info.UDID);
    }
    let proc = null;
    if (info.status === consts.SHUTDOWN) {
        proc = spawn(simPath, ["-CurrentDeviceUDID", info.UDID]);
        // $FlowFixMe proc is not null here
        process.on("exit", () => proc.kill());
    }
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
        sims = await listSims();
        info = sims[version][device];
        if (info.status === consts.BOOTED) {
            break;
        }
    }
    if (info.status !== consts.BOOTED) {
        throw new Error(`Unable to boot ${version} - ` +
                        `${device} within ${timeoutMs / 1000} seconds`);
    }
    console.log("Booted simulator");
    return { UDID: info.UDID, proc };
};

