/**
 * Start a WebDriverAgent in a simulator.
 *
 * @param {string} UDID the simulator device to run on
 * @param {int} port the port to listen on
 * @param {int} timeoutMs the timeout in ms
 *
 * @flow
 */

import fs from "fs";
import axios from "axios";
import path from "path";
import { spawn } from "child_process";

import wait from "./wait";

import type { ChildProcess } from "./types";

const WEBDRIVER = (
    process.env.WEBDRIVER ||
    path.join(__dirname, "../WebDriverAgent")
);

if (!fs.existsSync(WEBDRIVER)) {
    throw new Error(`WebDriverAgent not found at ${WEBDRIVER}. ` +
                    `Please provide it via the WEBDRIVER env variable.`);
}

const defaultTimeoutMs = 10 * 1000;
const checkPauseMs = 500;

export default async function startWebdriver(
    UDID: string,
    port: number,
    timeoutMs?: number = defaultTimeoutMs
): Promise<ChildProcess> {
    const proc = spawn("xcrun", [
        "simctl",
        "spawn",
        UDID,
        WEBDRIVER,
        "-port",
        port ? "" + port : "0",
    ]);
    process.on("exit", () => proc.kill());
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
        try {
            await axios.get(`http://localhost:${port}`);
            console.log(`Connected to http://localhost:${port}`);
            return proc;
        } catch (e) {
            await wait(checkPauseMs);
        }
    }
    proc.kill();
    throw new Error(`Unable to connect to webdriver at ` +
                    `http://localhost:${port} after ${timeoutMs / 1000}s`);
};

