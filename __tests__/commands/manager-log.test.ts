import { Console } from "@arkecosystem/core-test-framework";
import { Command } from "../../src/commands/manager-log";

let cli;
beforeEach(() => (cli = new Console()));

describe("LogCommand", () => {
    it("should throw if the process does not exist", async () => {
        await expect(cli.execute(Command)).rejects.toThrow('The "ark-manager" process does not exist.');
    });
});
