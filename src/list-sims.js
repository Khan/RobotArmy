/**
 * Get & parse the simulators list from xcode's simctl. This allows you to
 * request a simulator by iOS version + name instead of by UDID.
 *
 * @flow
 */

import { list } from "./simctl";
import parseSimList from "./parse-sim-list";

import type { Result } from "./parse-sim-list";

export default async (): Result => {
    const text = await list();
    return parseSimList(text);
};

