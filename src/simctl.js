/**
 * Helper functions for running simctl commands
 *
 * @flow
 */

import run from "./run";

const runsim = (cmd, ...args) => run("xcrun", ["simctl", cmd, ...args]);

export const list = () => runsim("list");

export const install = (UDID: string, appPath: string) =>
  runsim("install", UDID, appPath);

export const launch = (UDID: string, appId: string, ...args: Array<string>) =>
  runsim("launch", UDID, appId, ...args);

export const shutdown = (UDID: string) =>
  runsim("shutdown", UDID);

export const erase = (UDID: string) =>
  runsim("erase", UDID);

