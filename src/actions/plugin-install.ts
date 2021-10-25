import { Application as Cli, Container as CliContainer, Contracts } from "@arkecosystem/core-cli";
import { Container } from "@arkecosystem/core-kernel";

import { Actions } from "../contracts";
import { Identifiers } from "../ioc";

@Container.injectable()
export class Action implements Actions.Action {
    @Container.inject(Container.Identifiers.ApplicationToken)
    private readonly token!: string;

    @Container.inject(Container.Identifiers.ApplicationNetwork)
    private readonly network!: string;

    @Container.inject(Identifiers.CLI)
    private readonly cli!: Cli;

    public name = "plugin.install";

    public schema = {
        type: "object",
        properties: {
            name: {
                type: "string",
            },
            version: {
                type: "string",
            },
        },
        required: ["name"],
    };

    public async execute(params: { name: string; version?: string }): Promise<void> {
        const pluginManager = this.cli.get<Contracts.PluginManager>(CliContainer.Identifiers.PluginManager);

        return await pluginManager.install(this.token, this.network, params.name, params.version);
    }
}
