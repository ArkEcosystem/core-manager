import * as Cli from "@arkecosystem/core-cli";
import { Container } from "@arkecosystem/core-kernel";
import { dirname, join } from "path";
import parseArgvString from "string-to-argv";

import { Identifiers } from "../ioc";

@Container.injectable()
export class CliManager {
    @Container.inject(Identifiers.CLI)
    private readonly cli!: Cli.Application;

    public async runCommand(name: string, args: string = ""): Promise<void> {
        const commands = this.discoverCommands();

        const command: Cli.Commands.Command = commands[name];

        if (!command) {
            throw new Error(`Command ${name} does not exists.`);
        }

        const argv = parseArgvString(args);

        argv.push("--skipPrompts=true");

        argv.unshift(name);

        command.register(argv);

        await command.run();
    }

    private discoverCommands(): Cli.Contracts.CommandList {
        const discoverer = this.cli.resolve(Cli.Commands.DiscoverCommands);
        return discoverer.within(join(dirname(require.resolve("@arkecosystem/core")), "commands"));
    }
}
