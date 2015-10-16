/**
 * Parse the output from `xrcun simctl list`
 *
 * @returns {Result} a nested object (see `Result` below)
 *
 * @flow
 */

const devicesSectionHeader = "== Devices ==";
const iosVersionRegex = /^\s*--\s*(.*?)\s*--\s*$/;

export type Result = {
  [key: string]: {
    [key: string]: {
      UDID: string,
      status: "Booted" | "Shutdown",
    },
  },
};

/** This is what `xrcun simctl list` looks like
 *
 * == Some Previous Section ==
 * ...
 * == Devices ==
 * -- iOS 8.4 --
 * iPhone 4s (F9A2D311-9DF7-433E-B96B-161C06F6D44D) (Shutdown)
 * iPhone 5 (D96DFAB4-7C0C-4FDF-8FEF-CAF1D4912160) (Shutdown)
 * iPhone 5s (B5811A6C-0D72-44CE-A538-278A1D58802E) (Shutdown)
 * -- iOS 9.0 --
 * iPhone 4s (3E143280-75F8-48C5-A561-4AB44A46561F) (Shutdown)
 * iPhone 5 (56BE21AE-8845-4C2B-B668-22559127D0DF) (Shutdown)
 * iPhone 5s (706502C2-DF31-4D52-B529-76272356485D) (Shutdown)
 * iPhone 6 (7EF50A81-5086-47F4-99E8-89D41B9085C6) (Shutdown)
 * == Some other Section ==
 * ...
 *
 */

export default (rawOutput: string): Result => {
    const lines = rawOutput.split("\n");
    while (lines[0].indexOf(devicesSectionHeader) === -1) {
        lines.shift();
    }
    lines.shift();
    const sims = {};
    let currentVersion = lines[0].match(iosVersionRegex)[1];
    lines.some(line => {
        if (line[0] === "=") {
            // This means we've reached the end of the "Devices" section
            return true;
        }
        if (line[0] === "-") {
            currentVersion = line.match(iosVersionRegex)[1];
            sims[currentVersion] = {};
            return false;
        }
        if (!line.trim()) {
            return false;
        }
        const parts = line.trim().split(/\(/g);
        const name = parts[0].trim();
        const UDID = parts[1].trim().slice(0, -1);
        const status = parts[2].trim().slice(0, -1);
        sims[currentVersion][name] = { UDID, status };
    });

    return sims;
};

