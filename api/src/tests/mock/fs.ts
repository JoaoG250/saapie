import fs from "fs";
import { mockDeep, mockReset, DeepMockProxy } from "jest-mock-extended";

jest.mock("fs", () => ({
  __esModule: true,
  default: mockDeep<typeof fs>(),
}));

beforeEach(() => {
  mockReset(fsMock);
});

export const fsMock = fs as unknown as DeepMockProxy<typeof fs>;
