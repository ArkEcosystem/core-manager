import "jest-extended";

import nock from "nock";

import { HttpClient } from "../../src/utils/http-client";

describe("HttpClient", () => {
    describe("get", () => {
        it("should be ok", async () => {
            nock.cleanAll();

            nock(/.*/).get("/").reply(200, {
                result: {},
            });

            const httpClient = new HttpClient({ ip: "0.0.0.0", port: 4003, protocol: "http" });

            const promise = httpClient.get("/");

            const result = await promise;

            expect(result).toEqual({ result: {} });
        });
    });
});
