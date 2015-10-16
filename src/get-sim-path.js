/**
 * Runs xcode-select to find the Xcode path, and then gets the executable path
 * of the Simulator runtime.
 *
 * We start the simulator directly (instead of `open -a Simulator`) so that we
 * have direct control over the simulator process, and can kill it when we
 * clean up.
 *
 * @flow
 */

import fs from "fs";
import path from "path";

import run from "./run";

let cache = null;

const v6path = "Applications/iOS Simulator.app/Contents/MacOS/iOS Simulator";
const v7path = "Applications/Simulator.app/Contents/MacOS/Simulator";

export default async (): Promise<?string> => {
    if (cache) {
        return cache;
    }
    const xcodePath = (await run("xcode-select", ["-p"], true)).trim();
    try {
        fs.statSync(path.join(xcodePath, v6path));
        cache = path.join(xcodePath, v6path);
        return cache;
    } catch (e) { }

    try {
        fs.statSync(path.join(xcodePath, v7path));
        cache = path.join(xcodePath, v7path);
        return cache;
    } catch (e) { }
    return null;
};

