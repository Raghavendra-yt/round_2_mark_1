// Jest configuration for Vite + React + ESM project
/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'jsdom',
  setupFilesAfterFramework: ['<rootDir>/src/setupTests.js'],
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
  moduleNameMapper: {
    // CSS Modules → identity object
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    // Asset imports → filename string
    '\\.(jpg|jpeg|png|gif|webp|svg|ico)$': '<rootDir>/src/__mocks__/fileMock.js',
  },
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)',
  ],
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/main.jsx',
    '!src/**/*.d.ts',
    '!src/__mocks__/**',
  ],
  coverageThreshold: {
    global: {
      branches:   80,
      functions:  80,
      lines:      80,
      statements: 80,
    },
  },
  setupFilesAfterFramework: ['@testing-library/jest-dom'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
};

export default config;
