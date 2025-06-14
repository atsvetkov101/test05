import type { JestConfigWithTsJest } from 'ts-jest';

const config: JestConfigWithTsJest = {
  "moduleFileExtensions": [
    "js",
    "json",
    "ts"
  ],
  "rootDir": '.',
  "testMatch": ['<rootDir>/jest-test/**/*.spec.ts', '<rootDir>/src/core/**/*.spec.ts'],
  "transform": {
    "^.+\\.(t|j)s$": "ts-jest"
  },
  "collectCoverageFrom": [
    "**/*.(t|j)s"
  ],
  "coverageDirectory": "../coverage",
  "testEnvironment": "node",
  "testTimeout": 60000,
};

export default config;
