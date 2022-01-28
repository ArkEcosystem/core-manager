import "jest-extended";

import { Sandbox } from "@arkecosystem/core-test-framework";
import fs from "fs-extra";

import { Action } from "../../src/actions/configuration-get-plugins";

let sandbox: Sandbox;
let action: Action;

beforeEach(() => {
    sandbox = new Sandbox();
    action = sandbox.app.resolve(Action);
});

describe("Configuration:EnvGet", () => {
    it("should have name", () => {
        expect(action.name).toEqual("configuration.getPlugins");
    });

    it("should return plugins.js content", async () => {
        const readJSONSync = jest.spyOn(fs, "readJSONSync").mockReturnValue({
            key: "value",
        });

        sandbox.app.configPath = jest.fn().mockReturnValue("path/to/env/file");

        const result = await action.execute({});

        await expect(result).toEqual({
            key: "value",
        });

        expect(readJSONSync).toHaveBeenCalled();
    });
});
