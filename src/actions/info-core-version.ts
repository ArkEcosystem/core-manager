import * as Cli from "@arkecosystem/core-cli";
import { Application, Container } from "@arkecosystem/core-kernel";
import { readJSONSync } from "fs-extra";
import latestVersion from "latest-version";
import { join } from "path";

import { Actions } from "../contracts";
import { Identifiers } from "../ioc";

@Container.injectable()
export class Action implements Actions.Action {
    @Container.inject(Container.Identifiers.Application)
    private readonly app!: Application;

    @Container.inject(Identifiers.CLI)
    private readonly cli!: Cli.Application;

    @Container.inject(Identifiers.Version)
    private readonly currentPluginVersion!: string;

    public name = "info.coreVersion";

    public async execute(params: object): Promise<any> {
        return {
            currentVersion: this.app.version(),
            installedVersion: this.getInstalledVersion(),
            latestVersion: await this.getLatestVersion(),
            currentPluginVersion: this.currentPluginVersion,
            installedPluginVersion: this.getInstalledPluginVersion(),
            latestPluginVersion: await this.getLatestPluginVersion(),
        };
    }

    private async getLatestVersion(): Promise<string> {
        return latestVersion("@arkecosystem/core", {
            version: this.getChannel(),
        });
    }

    private getInstalledVersion(): string {
        return readJSONSync(require.resolve("@arkecosystem/core-kernel/package.json")).version;
    }

    private async getLatestPluginVersion(): Promise<string> {
        return latestVersion("@arkecosystem/core-manager");
    }

    private getInstalledPluginVersion(): string {
        return readJSONSync(join(__dirname, "../../package.json")).version;
    }

    private getChannel(): string {
        return this.cli.resolve(Cli.Services.Config).get("channel");
    }
}
