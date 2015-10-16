
import { expect } from "chai";
import path from "path";
import fs from "fs";

import parseSimList from "../src/parse-sim-list";

describe("parseSimList", () => {
    it("should have iPad 2 for iOS 8.4", async () => {
        const rawText = fs.readFileSync(path.join(__dirname, "sims.log"))
          .toString("utf8");
        const sims = parseSimList(rawText);
        expect(sims).to.contain.key("iOS 8.4");
        expect(sims["iOS 8.4"]).to.contain.key("iPad 2");
        expect(sims["iOS 8.4"]["iPad 2"].status).to.be.ok;
    });
});

