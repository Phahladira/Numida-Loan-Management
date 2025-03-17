export default {
  testEnvironment: "jsdom",
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'ts-jest',
  },
  setupFilesAfterEnv: ['<rootDir>/src/jest.setup.ts'],
};