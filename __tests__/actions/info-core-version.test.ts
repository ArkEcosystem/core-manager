import "jest-extended";

import { Sandbox } from "@arkecosystem/core-test-framework";
import { Container } from "@arkecosystem/core-kernel";
import { Action } from "../../src/actions/info-core-version";
import { Identifiers } from "../../src/ioc";
import {readJSONSync} from "fs-extra";
import * as Cli from "@arkecosystem/core-cli";

jest.mock("fs-extra", () => {
    return {
        readJSONSync: jest.fn(),
    };
});

let sandbox: Sandbox;
let action: Action;

const mockCliConfig = {
    get: jest.fn().mockReturnValue("next"),
};

const mockProcessManager = {
    list: jest.fn().mockReturnValue([]),
    status: jest.fn().mockReturnValue(Cli.Contracts.ProcessState.Online)
};

const mockCli = {
    resolve: jest.fn().mockReturnValue(mockCliConfig),
    get: jest.fn().mockReturnValue(mockProcessManager),
};

beforeEach(() => {
    sandbox = new Sandbox();

    sandbox.app.bind(Container.Identifiers.ApplicationVersion).toConstantValue("3.0.0");
    sandbox.app.bind(Identifiers.CLI).toConstantValue(mockCli);
    sandbox.app.bind(Identifiers.Version).toConstantValue("3.0.1");

    action = sandbox.app.resolve(Action);
});

describe("Info:CoreVersion", () => {
    it("should have name", () => {
        expect(action.name).toEqual("info.coreVersion");
    });

    it("should return versions", async () => {
        readJSONSync
            .mockReturnValueOnce({ version: "3.0.0" }) // core-kernel
            .mockReturnValueOnce({ version: "3.0.2" }); // core-manager

        const promise = action.execute({});

        await expect(promise).toResolve();

        const result = await promise;

        await expect(result.currentVersion).toBe(undefined);
        await expect(result.installedVersion).toBe("3.0.0");
        await expect(result.latestVersion).toBeString();
        await expect(result.manager.currentVersion).toBe("3.0.1");
        await expect(result.manager.installedVersion).toBe("3.0.2");
        await expect(result.manager.latestVersion).toBeString();
    }, 10000);

    it("should return current relay version", async () => {
        mockProcessManager.list.mockReturnValue([
            {
                name: "ark-relay",
                pm2_env: {
                    version: "4.0.0"
                }
            }
        ])

        readJSONSync
            .mockReturnValueOnce({ version: "3.0.0" }) // core-kernel
            .mockReturnValueOnce({ version: "3.0.2" }); // core-manager

        const promise = action.execute({});

        await expect(promise).toResolve();

        const result = await promise;

        await expect(result.currentVersion).toBe("4.0.0");
        await expect(result.installedVersion).toBe("3.0.0");
        await expect(result.latestVersion).toBeString();
        await expect(result.manager.currentVersion).toBe("3.0.1");
        await expect(result.manager.installedVersion).toBe("3.0.2");
        await expect(result.manager.latestVersion).toBeString();
    }, 10000);

    it("should return current core version", async () => {
        mockProcessManager.list.mockReturnValue([
            {
                name: "ark-core",
                pm2_env: {
                    version: "4.0.1"
                }
            },
            {
                name: "ark-relay",
                pm2_env: {
                    version: "4.0.0"
                }
            }
        ])

        readJSONSync
            .mockReturnValueOnce({ version: "3.0.0" }) // core-kernel
            .mockReturnValueOnce({ version: "3.0.2" }); // core-manager

        const promise = action.execute({});

        await expect(promise).toResolve();

        const result = await promise;

        await expect(result.currentVersion).toBe("4.0.1");
        await expect(result.installedVersion).toBe("3.0.0");
        await expect(result.latestVersion).toBeString();
        await expect(result.manager.currentVersion).toBe("3.0.1");
        await expect(result.manager.installedVersion).toBe("3.0.2");
        await expect(result.manager.latestVersion).toBeString();
    }, 10000);
});
