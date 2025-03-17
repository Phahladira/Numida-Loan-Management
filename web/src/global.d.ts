/* eslint-disable no-var */
interface ImportMetaEnv {
  VITE_LOG_LEVEL: string;
}

declare global {
  var importMetaEnv: ImportMetaEnv;
  var IS_REACT_ACT_ENVIRONMENT: boolean;
}

export {};