export default {
  preset: "jest-preset-angular",
  setupFilesAfterEnv: ["<rootDir>/src/setup-jest.ts"],
  testMatch: ["**/+(*.)+(spec).+(ts)"],
  transform: {
    "^.+\\.(ts|mjs|js|html|scss)$": "jest-preset-angular",
  },
  moduleNameMapper: {
    "\\.(html|scss)$": "jest-transform-stub",
  },
  moduleFileExtensions: ["ts", "js", "html", "scss"],
  testMatch: ["**/+(*.)+(spec).+(ts)"],
  testEnvironment: "jsdom",
};
