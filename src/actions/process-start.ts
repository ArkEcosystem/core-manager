import { Container } from "@arkecosystem/core-kernel";
import { Exceptions } from "@arkecosystem/core";

import { Actions } from "../contracts";
import { Identifiers } from "../ioc";
import { CliManager } from "../utils/cli-manager";

@Container.injectable()
export class Action implements Actions.Action {
    @Container.inject(Identifiers.CliManager)
    private readonly cliManager!: CliManager;

    public name = "process.start";

    public schema = {
        type: "object",
        properties: {
            name: {
                type: "string",
            },
            args: {
                type: "string",
            },
        },
        required: ["name", "args"],
    };

    public async execute(params: { name: string; args: string }): Promise<any> {
        try {
            await this.cliManager.runCommand(`${params.name}:start`, params.args);
        } catch (err) {
            if (err instanceof Exceptions.Crypto.PassphraseNotDetected) {
                throw new Error("ERR_NO_KEY");
            }

            throw err;
        }
        return {};
    }
}
