import fs from "fs";

export const fsMock = jest.createMockFromModule("fs") as jest.Mocked<typeof fs>;
