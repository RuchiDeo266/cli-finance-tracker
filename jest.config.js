// jest.config.js
module.exports = {
  // 1. Preset: Tells Jest to use ts-jest to handle TypeScript files
  preset: "ts-jest",

  // 2. Test Environment: Specifies the environment for running tests
  testEnvironment: "node",

  // 3. Test Match: Tells Jest where to find the test files
  testMatch: ["**/__tests__/**/*.test.ts"],

  // 4. Roots: Specifies the root directory Jest should search in
  roots: ["<rootDir>/src"],

  // 5. Setup Files (Optional but good for env vars)
  // This file runs before all tests to load environment variables
  setupFiles: ["dotenv/config"],
};
