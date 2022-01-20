import "jest-extended";

import { Action } from "../../src/actions/process-start";
import { Identifiers } from "../../src/ioc";
import { Sandbox } from "@arkecosystem/core-test-framework";

let sandbox: Sandbox;
let action: Action;

const mockCliManager = {
    runCommand: jest.fn(),
};

beforeEach(() => {
    sandbox = new Sandbox();

    sandbox.app.bind(Identifiers.CliManager).toConstantValue(mockCliManager);

    action = sandbox.app.resolve(Action);
});

afterEach(() => {
    delete process.env.CORE_API_DISABLED;
    jest.clearAllMocks();
});

describe("Process:Start", () => {
    it("should have name", () => {
        expect(action.name).toEqual("process.start");
    });

    it("should call start process", async () => {
        const result = await action.execute({ name: "core", args: "--network=testnet --env=test" });

        expect(result).toEqual({});
        expect(mockCliManager.runCommand).toHaveBeenCalledWith("core:start", "--network=testnet --env=test");
    });

    it("should rethrow error if runCommand throws", async () => {
        mockCliManager.runCommand.mockImplementation( () => {
            throw new Error("Dummy error");
        })

        await expect(action.execute({ name: "core", args: "--network=testnet --env=test" })).rejects.toThrowError("Dummy error")
    });

    it("should throw ERR_NO_KEY if runCommand throws 'We were unable to detect a BIP38 or BIP39 passphrase.'", async () => {
        mockCliManager.runCommand.mockImplementation( () => {
            throw new Error("We were unable to detect a BIP38 or BIP39 passphrase.");
        })

        await expect(action.execute({ name: "core", args: "--network=testnet --env=test" })).rejects.toThrowError("ERR_NO_KEY")
    });
});
