import "jest-extended";

import { Action } from "../../src/actions/plugin-update";
import { Identifiers } from "../../src/ioc";
import { Sandbox } from "@arkecosystem/core-test-framework";
import { Container } from "@arkecosystem/core-kernel";

let sandbox: Sandbox;
let action: Action;

let mockProcessManager;
const token = "ark";
const network = "testnet";
const name = "@arkecosystem/core-manager";

beforeEach(() => {
    mockProcessManager = {
        update: jest.fn(),
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
        expect(action.name).toEqual("plugin.update");
    });

    it("should return plugin list", async () => {
        const promise = action.execute({ name });

        const result = await promise;

        expect(result).toEqual({});
        expect(mockProcessManager.update).toHaveBeenCalledWith(token, network, name);
    });
});
