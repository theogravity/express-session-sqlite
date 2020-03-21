module.exports = {
  "preset": "ts-jest",
  "collectCoverageFrom": [
    "src/**/*.ts"
  ],
  "testResultsProcessor": "./node_modules/jest-junit-reporter",
  "testEnvironment": "node",
  "testPathIgnorePatterns": [
    "/build",
    "/node_modules/"
  ],
  "coverageThreshold": {
    "global": {
      "statements": 95,
      "branches": 80,
      "functions": 95,
      "lines": 95
    }
  },
}
