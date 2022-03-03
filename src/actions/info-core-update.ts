import { Container } from "@arkecosystem/core-kernel";

import { Actions } from "../contracts";
import { Identifiers } from "../ioc";
import { CliManager } from "../utils/cli-manager";

@Container.injectable()
export class Action implements Actions.Action {
    @Container.inject(Identifiers.CliManager)
    private readonly cliManager!: CliManager;

    public name = "info.coreUpdate";

    public schema = {
        type: "object",
        properties: {
            restart: {
                type: "boolean",
            },
        },
    };

    public async execute(params: { restart?: boolean }): Promise<any> {
        let args = "--force";

        if (params.restart) {
            args += " --restart";
        }

        await this.cliManager.runCommand("update", args);
        return {};
    }
}
