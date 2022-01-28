import "jest-extended";

import { ProcessState } from "@arkecosystem/core-cli/dist/contracts";
import { Sandbox } from "@arkecosystem/core-test-framework";

import { Action } from "../../src/actions/process.stop";
import { Identifiers } from "../../src/ioc";

let sandbox: Sandbox;
let action: Action;

let mockCli;
let mockProcessManagerStatus;

beforeEach(() => {
    mockProcessManagerStatus = ProcessState.Stopped;

    mockCli = {
        get: jest.fn().mockReturnValue({
            status: jest.fn().mockImplementation(() => {
                return mockProcessManagerStatus;
            }),
            stop: jest.fn(),
        }),
    };

    sandbox = new Sandbox();

    sandbox.app.bind(Identifiers.CLI).toConstantValue(mockCli);

    action = sandbox.app.resolve(Action);
});

afterEach(() => {
    jest.clearAllMocks();
});

describe("Process:Stop", () => {
    it("should have name", () => {
        expect(action.name).toEqual("process.stop");
    });

    it("should return stopped process status", async () => {
        const result = await action.execute({ name: "ark-core" });

        expect(result).toEqual({
            name: "ark-core",
            status: "stopped",
        });
    });

    it("should return undefined status", async () => {
        mockProcessManagerStatus = undefined;

        const result = await action.execute({ name: "ark-core" });

        expect(result).toEqual({
            name: "ark-core",
            status: "undefined",
        });
    });
});
