import "jest-extended";

import { generateLogFactory } from "../../src/workers/generate-log-factory";
import { GenerateLogGz } from "../../src/workers/generate-log-gz";
import { GenerateLogZip } from "../../src/workers/generate-log-zip";

jest.mock("../../src/workers/generate-log-zip");
jest.mock("../../src/workers/generate-log-gz");

describe("Generate Log Factory", () => {
    it("should return instance of GenerateLogZip", async () => {
        expect(
            // @ts-ignore
            generateLogFactory({
                archiveFormat: "zip",
            }),
        ).toBeInstanceOf(GenerateLogZip);
    });

    it("should return instance of GenerateLogGz", async () => {
        expect(
            // @ts-ignore
            generateLogFactory({
                archiveFormat: "gz",
            }),
        ).toBeInstanceOf(GenerateLogGz);
    });
});
