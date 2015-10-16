
import { expect } from "chai";

import listSims from "../src/list-sims";
import getSimPath from "../src/get-sim-path";
import { list } from "../src/simctl";

describe("listSims", () => {
    it("should not fail terribly", async () => {
        const sims = await listSims();
    });
});

describe("simctl - list", () => {
    it("should have reasonable output", async () => {
        const raw = await list();
        expect(raw).to.contain("== Devices ==");
    });
});

describe("getSimPath", () => {
    it("should find a simulator", async () => {
        const path = await getSimPath();
        expect(path).to.be.ok;
    });
});

