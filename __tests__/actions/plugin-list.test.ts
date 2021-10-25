import "jest-extended";

import { Action } from "../../src/actions/plugin-list";
import { Identifiers } from "../../src/ioc";
import { Sandbox } from "@arkecosystem/core-test-framework";
import { Container } from "@arkecosystem/core-kernel";

let sandbox: Sandbox;
let action: Action;

let mockProcessManager;
let plugin;
const token= "ark";
const network= "testnet";

beforeEach(() => {
    plugin = {
        name: "@arkecosystem/core",
        version: "3.0.0",
        path: __dirname
    };


    mockProcessManager = {
        list: jest.fn().mockReturnValue([plugin]),
    }

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
        expect(action.name).toEqual("plugin.list");
    });

    it("should return plugin list", async () => {
        const promise = action.execute({});

        await expect(promise).toResolve();

        const result = await promise;

        expect(result).toEqual([
            {
                name: plugin.name,
                version: plugin.version
            },
        ]);
        expect(mockProcessManager.list).toHaveBeenCalledWith(token, network);
    });
});
