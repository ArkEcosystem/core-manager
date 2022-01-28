import "jest-extended";

import { Sandbox } from "@arkecosystem/core-test-framework";

import { Action } from "../../src/actions/log-search";
import { Identifiers } from "../../src/ioc";

let sandbox: Sandbox;
let action: Action;

let logDatabaseService;

beforeEach(() => {
    logDatabaseService = {
        search: jest.fn(),
    };

    sandbox = new Sandbox();

    sandbox.app.bind(Identifiers.LogsDatabaseService).toConstantValue(logDatabaseService);

    action = sandbox.app.resolve(Action);
});

describe("Log:Search", () => {
    it("should have name", () => {
        expect(action.name).toEqual("log.search");
    });

    it("should return lines from out log", async () => {
        await action.execute({});

        expect(logDatabaseService.search).toHaveBeenCalledTimes(1);
    });
});
