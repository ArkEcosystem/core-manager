import "jest-extended";

import { Action } from "../../src/actions/plugin-install";
import { Identifiers } from "../../src/ioc";
import { Sandbox } from "@arkecosystem/core-test-framework";
import { Container } from "@arkecosystem/core-kernel";

let sandbox: Sandbox;
let action: Action;

let mockProcessManager;
const token = "ark";
const network = "testnet";
const name = "@arkecosystem/core-manager";
const version = "3.0.0";

beforeEach(() => {
    mockProcessManager = {
        install: jest.fn(),
    };

    const mockCli = {
        get: jest.fn().mockReturnValue(mockProcessManager),
    };

    sandbox = new Sandbox();

    sandbox.app.bind(Identifiers.CLI).toConstantValue(mockCli);
    sandbox.app.bind(Container.Identifiers.ApplicationToken).toConstantValue(token);
    sandbox.app.bind(Container.Identifiers.ApplicationNetwork).toConstantValue(network);

    action = sandbox.app.resolve(Action);
});

afterEach(() => {
    jest.clearAllMocks();
});

describe("Process:List", () => {
    it("should have name", () => {
        expect(action.name).toEqual("plugin.install");
    });

    it("should return plugin list", async () => {
        const promise = action.execute({ name, version });

        await expect(promise).toResolve();

        const result = await promise;

        expect(result).toEqual({});
        expect(mockProcessManager.install).toHaveBeenCalledWith(token, network, name, version);
    });
});
