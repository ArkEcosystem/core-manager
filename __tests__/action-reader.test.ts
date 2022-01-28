import "jest-extended";

import { Container } from "@arkecosystem/core-kernel";
import { Sandbox } from "@arkecosystem/core-test-framework";

import { ActionReader } from "../src";
import { Identifiers } from "../src/ioc";

let sandbox: Sandbox;
let actionReader: ActionReader;

beforeEach(() => {
    sandbox = new Sandbox();

    sandbox.app.bind(Identifiers.ActionReader).to(ActionReader).inSingletonScope();
    sandbox.app.bind(Identifiers.CliManager).toConstantValue({});
    sandbox.app.bind(Identifiers.CLI).toConstantValue({});
    sandbox.app.bind(Identifiers.SnapshotsManager).toConstantValue({});
    sandbox.app.bind(Identifiers.WatcherDatabaseService).toConstantValue({});
    sandbox.app.bind(Identifiers.LogsDatabaseService).toConstantValue({});
    sandbox.app.bind(Identifiers.WorkerManager).toConstantValue({});
    sandbox.app.bind(Container.Identifiers.PluginConfiguration).toConstantValue({});
    sandbox.app.bind(Container.Identifiers.ConfigFlags).toConstantValue({});
    sandbox.app.bind(Container.Identifiers.FilesystemService).toConstantValue({});

    actionReader = sandbox.app.get<ActionReader>(Identifiers.ActionReader);
});

describe("ActionReader", () => {
    // @FIX: this test assumes that JS files will be present, which isn't the case with tests.
    it.skip("should discover actions", async () => {
        const actions = actionReader.discoverActions();

        expect(actions).toBeArray();
        expect(actions.length).toBeGreaterThanOrEqual(1);
    });
});
