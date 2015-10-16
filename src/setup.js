/**
 * Set just about everything up for a test to run.
 *
 * - start & optionally reset a simulator, trying 10 times
 * - install & start up the requested app
 * - start up WebDriverAgent
 * - create a driver for you to communicate w/ the WebDriverAgent
 *
 * @param {object} config All the configuration
 * @returns {Promise} a promise to {device, simulator, wdAgent}
 *
 * @flow
 */

import wd from "./wd";
import getSim from "./get-sim";
import installAndStart from "./install-and-start";
import startWebDriver from "./start-webdriver";
import wait from "./wait";

import type { ChildProcess } from "./types";
import type { Result as SimResult } from "./get-sim";

type Args = {
  port: number,
  args: Array<string>,
  resetSim?: boolean,
  device: {
    version: string,
    name: string,
  },
  app: {
    path: string,
    id: string,
  },
  simRetries?: number,
  installRetries?: number,
};

type Result = {
  driver: wd.WebDriver,
  simulator: SimResult,
  wdAgent: ChildProcess,
};

export default async ({
    port,
    args,
    resetSim,
    device: {
        version: iOSVersion,
        name: deviceName,
    },
    app: {
        path: appPath,
        id: appID,
    },
    // TODO(jared): uncomment these once flow understands default values in
    // destructured arguments
    simRetries, // SimRetries: simRetries = 10,
    installRetries, // InstallRetries: installRetries = 5,
}: Args): Promise<Result> => {
    simRetries = simRetries || 10;
    installRetries = installRetries || 5;

    let simulator;
    for (let i = 0; i < simRetries; i++) {
        try {
            simulator = await getSim(iOSVersion, deviceName, resetSim);
            break;
        } catch (e) {
            console.log(
              `Failed to start simulator ${iOSVersion} - ${deviceName} ${e}`);
            if (i < simRetries - 1) {
                console.log("Retrying");
            }
        }
    }
    if (!simulator) {
        throw new Error(`Unable to start simulator ${iOSVersion} - ` +
                        `${deviceName} after ${simRetries} attempts`);
    }

    // Wait half a second for the simulator to figure itself out
    const retryPause = 500;
    console.log("Installing and starting the requested app");
    for (let i = 0; i < installRetries; i++) {
        try {
            await installAndStart(
              simulator.UDID, appPath, appID,
              ...args
            );
            break;
        } catch (e) {
            await wait(retryPause);
        }
    }

    const wdAgent = await startWebDriver(simulator.UDID, port);

    const base = `http://localhost:${port}/`;
    const driver = wd.promiseChainRemote(base);
    driver.attach("arbitrarySessionID");

    return {
        driver,
        simulator,
        wdAgent,
    };
};

