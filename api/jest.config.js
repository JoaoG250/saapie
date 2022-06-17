module.exports = {
  clearMocks: true,
  preset: "ts-jest",
  testRegex: "(/__tests__/.*|(\\.|/)(spec))\\.[jt]sx?$",
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/src/tests/mock/prisma.ts"],
};
