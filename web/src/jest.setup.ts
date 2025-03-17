import '@testing-library/jest-dom';

globalThis.importMetaEnv = {
  VITE_LOG_LEVEL: 'WARN',
};

globalThis.IS_REACT_ACT_ENVIRONMENT = true; // Ensure the testing environment is aware of `act` usage