import "jest-extended";

import { Container } from "@arkecosystem/core-kernel";
import { Sandbox } from "@arkecosystem/core-test-framework";

import { Action } from "../../src/actions/configuration-set-env";

let sandbox: Sandbox;
let action: Action;

const mockFilesystem = {
    put: jest.fn(),
};

beforeEach(() => {
    sandbox = new Sandbox();

    sandbox.app.bind(Container.Identifiers.FilesystemService).toConstantValue(mockFilesystem);

    action = sandbox.app.resolve(Action);

    sandbox.app.environmentFile = jest.fn().mockReturnValue("/path/to/file");
});

describe("Configuration:SetEnv", () => {
    it("should have name", () => {
        expect(action.name).toEqual("configuration.setEnv");
    });

    it("should validate and save configuration", async () => {
        const params = {
            STRING_VARIABLE: "string",
            NUMERIC_VARIABLE: 123,
        };

        const result = await action.execute(params);

        expect(result).toEqual({});

        expect(mockFilesystem.put).toHaveBeenCalledWith(
            "/path/to/file",
            "STRING_VARIABLE=string\nNUMERIC_VARIABLE=123\n",
        );
    });
});
