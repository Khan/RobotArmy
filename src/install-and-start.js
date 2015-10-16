/**
 * Simple helper fn to install an app and start it up.
 *
 * @param {string} UDID the Unique Device ID of the simulator. It should
 * already be running. You can get this from `get-sim.js`.
 * @param {string} appPath an absolute path to the .app iOS app bundle
 * @param {string} appId the `org.example.something` app identifier
 * @param {...string} args arguments to pass to the App
 *
 * @flow
 */

import { install, launch } from "./simctl";

export default async (
    UDID: string,
    appPath: string,
    appId: string,
    ...args: Array<string>
): Promise<void> => {
    try {
        await install(UDID, appPath);
    } catch (e) {
        throw new Error("Failed to install: " + e.message);
    }
    try {
        await launch(UDID, appId, ...args);
    } catch (e) {
        throw new Error("Failed to launch: " + e.message);
    }
};

