import * as Cli from "@arkecosystem/core-cli";
import { Container as CliContainer, Services } from "@arkecosystem/core-cli";
import { Container } from "@arkecosystem/core-kernel";
import { readJSONSync } from "fs-extra";
import latestVersion from "latest-version";
import { join } from "path";

import { Actions } from "../contracts";
import { Identifiers } from "../ioc";

@Container.injectable()
export class Action implements Actions.Action {
    @Container.inject(Identifiers.CLI)
    private readonly cli!: Cli.Application;

    @Container.inject(Identifiers.Version)
    private readonly currentManagerVersion!: string;

    public name = "info.coreVersion";

    public async execute(params: object): Promise<any> {
        return {
            currentVersion: this.getCurrentVersion(),
            installedVersion: this.getInstalledVersion(),
            latestVersion: await this.getLatestVersion(),
            manager: {
                currentVersion: this.currentManagerVersion,
                installedVersion: this.getInstalledManagerVersion(),
                latestVersion: await this.getLatestManagerVersion(),
            },
        };
    }

    private getCurrentVersion(): string | undefined {
        const processManager = this.cli.get<Services.ProcessManager>(CliContainer.Identifiers.ProcessManager);

        const processList = processManager.list().filter((processInfo) => {
            return processManager.status(processInfo.name) === Cli.Contracts.ProcessState.Online;
        });

        const coreProcess = processList.find((process) => process.name.includes("core"));
        if (coreProcess) {
            return coreProcess.pm2_env.version;
        }

        const relayProcess = processList.find((process) => process.name.includes("relay"));
        if (relayProcess) {
            return relayProcess.pm2_env.version;
        }

        return undefined;
    }

    private getChannel(): string {
        return this.cli.resolve(Cli.Services.Config).get("channel");
    }

    private parseChannel(version: string): string {
        const channel = version.replace(/[^a-z]/gi, "");

        if (!channel) {
            return "latest";
        }

        return channel;
    }

    private getInstalledVersion(): string {
        return readJSONSync(require.resolve("@arkecosystem/core-kernel/package.json")).version;
    }

    private async getLatestVersion(): Promise<string> {
        return latestVersion("@arkecosystem/core", {
            version: this.getChannel(),
        });
    }

    private getInstalledManagerVersion(): string {
        return readJSONSync(join(__dirname, "../../package.json")).version;
    }

    private async getLatestManagerVersion(): Promise<string> {
        return latestVersion("@arkecosystem/core-manager", {
            version: this.parseChannel(this.getInstalledManagerVersion()),
        });
    }
}
