import { Container } from "@arkecosystem/core-kernel";

import { Actions } from "../contracts";
import { ConnectionData } from "../contracts/http-client";
import { Utils } from "../utils";

@Container.injectable()
export class Action implements Actions.Action {
    public name = "info.blockchainHeight";

    public async execute(params: any): Promise<any> {
        let response = {
            height: await this.getHeight(Utils.getConnectionData()),
        };

        try {
            response = {
                ...response,
                ...(await this.prepareRandomNodeHeight()),
            };
        } catch {}

        return response;
    }

    private async getHeight(connectionData: ConnectionData): Promise<number> {
        const httpClient = new Utils.HttpClient(connectionData);

        const response = await httpClient.get("/api/node/status");

        return response.data.now;
    }

    private async getPeers(): Promise<ConnectionData[]> {
        const httpClient = new Utils.HttpClient(Utils.getConnectionData());

        const response = await httpClient.get("/api/peers");

        const peers = response.data
            .map((peer) => {
                return {
                    ip: peer.ip,
                    port: peer.ports["@arkecosystem/core-api"],
                    protocol: "http"
                };
            })
            .filter((peer: ConnectionData) => peer.port && peer.port > 0);

        if (!peers.length) {
            throw new Error("No peers found.");
        }

        return peers;
    }

    private async prepareRandomNodeHeight(): Promise<{ randomNodeHeight: number; randomNodeIp: string }> {
        const peers = await this.getPeers();

        for(let i = 0; i < 3; i++) {
            const peer = peers[Math.floor(Math.random() * peers.length)];

            try {
                return {
                    randomNodeHeight: await this.getHeight(peer),
                    randomNodeIp: peer.ip,
                };
            } catch {}
        }

        throw new Error("No responsive peers");
    }
}
