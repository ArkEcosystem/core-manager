import * as Cli from "@arkecosystem/core-cli";
import { Container } from "@arkecosystem/core-kernel";
import { dirname, join } from "path";

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

        const parsedArguments = this.parseArguments(args);

        const argv = [name, ...parsedArguments];

        command.register(argv);

        await command.run();
    }

    private parseArguments(args: string): string[] {
        // Look for:
        // - <param>: everything that start with -- and ends with an space or `=`
        // - <value> (optional) everything after the '=' until find a space
        // - OR <quotedValue> (optional) everything after the '=' that is between quotes "'"
        const regex = /(?<param>--[^\s|=]*)=?(?:(?:'(?<quotedValue>[^']*)')|(?<value>[^\s]*))/gm;

        const parsedArguments: string[] = [];

        let match: RegExpExecArray | null;
        while ((match = regex.exec(args)) !== null) {
            if (match.groups === undefined) {
                continue;
            }

            const { param, quotedValue, value } = match.groups;

            const argParts = [param, quotedValue || value].filter(Boolean);

            parsedArguments.push(argParts.join("="));
        }

        return parsedArguments.length ? parsedArguments : [""];
    }

    private discoverCommands(): Cli.Contracts.CommandList {
        const discoverer = this.cli.resolve(Cli.Commands.DiscoverCommands);
        return discoverer.within(join(dirname(require.resolve("@arkecosystem/core")), "commands"));
    }
}
