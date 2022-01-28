import "jest-extended";

import { Sandbox } from "@arkecosystem/core-test-framework";
import cloneDeep from "lodash.clonedeep";

import { Action } from "../../src/actions/info-blockchain-height";
import { HttpClient } from "../../src/utils/http-client";

let sandbox: Sandbox;
let action: Action;

const mockPeersResponse = {
    data: [
        {
            ip: "0.0.0.0",
            ports: {
                "@arkecosystem/core-api": 4003,
            },
        },
    ],
};
const mockStatusResponse = {
    data: {
        now: 10,
    },
};

beforeEach(() => {
    sandbox = new Sandbox();
    action = sandbox.app.resolve(Action);
});

afterEach(() => {
    jest.clearAllMocks();
});

describe("Info:BlockchainHeight", () => {
    it("should have name", () => {
        expect(action.name).toEqual("info.blockchainHeight");
    });

    it("should return height and random node height", async () => {
        jest.spyOn(HttpClient.prototype, "get")
            .mockResolvedValueOnce(mockStatusResponse)
            .mockResolvedValueOnce(mockPeersResponse)
            .mockResolvedValueOnce(mockStatusResponse);

        const result = await action.execute({});

        expect(result).toEqual({ height: 10, randomNodeHeight: 10, randomNodeIp: "0.0.0.0" });
    });

    it("should throw ERR_NO_RELAY if host no response from host", async () => {
        jest.spyOn(HttpClient.prototype, "get").mockImplementation(async () => {
            throw new Error("dummy");
        });

        await expect(action.execute({})).rejects.toThrowError("ERR_NO_RELAY");
    });

    it("should return only height if no peers with enabled api", async () => {
        const tmpMockPeersResponse = cloneDeep(mockPeersResponse);
        tmpMockPeersResponse.data[0].ports["@arkecosystem/core-api"] = -1;

        jest.spyOn(HttpClient.prototype, "get")
            .mockResolvedValueOnce(mockStatusResponse)
            .mockResolvedValueOnce(tmpMockPeersResponse);

        const result = await action.execute({});

        expect(result).toEqual({ height: 10 });
        expect(result.randomNodeHeight).toBeUndefined();
        expect(result.randomNodeIp).toBeUndefined();
    });

    it("should return ERR_NO_RELAY height if /api/peers/ throws", async () => {
        jest.spyOn(HttpClient.prototype, "get")
            .mockResolvedValueOnce(mockStatusResponse)
            .mockImplementation(async () => {
                throw new Error("dummy");
            });

        await expect(action.execute({})).rejects.toThrowError("ERR_NO_RELAY");
    });

    it("should try to call peer 3 times", async () => {
        const spyOnGet = jest
            .spyOn(HttpClient.prototype, "get")
            .mockResolvedValueOnce(mockStatusResponse)
            .mockResolvedValueOnce(mockPeersResponse)
            .mockImplementation(async () => {
                throw new Error("dummy");
            });

        const result = await action.execute({});

        expect(result).toEqual({ height: 10 });
        expect(spyOnGet).toHaveBeenCalledTimes(5);
    });
});
