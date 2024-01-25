import { LoggerImpl } from "./utils/logger/type";

export interface PackageJSON {
  name: string;
  version: string;
  description: string;
  scripts: {
    [key: string]: string;
  };
  [key: string]: unknown;
}

export interface JSON {
  [key: string]: unknown;
}

export interface Boilerplate {
  key: string;
  name: string;
  description: string;
  repo: string;
  module: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GGAlias {
  [key: string]: string;
}

export interface GGEnv {
  [key: string]: string | number | boolean | object | undefined;
}

export interface Runtime {
  // dev period
  NODE_ENV: string;
  // user's project base dir
  WORK_ROOT: string;
  // GG CLI work dir path
  GG_ROOT: string;
  // GG CLI's static resource dir
  STATIC_DIR: string;
  // tsconfig.json path
  TSCONFIG_PATH: string | undefined;
  // tsconfig.json content
  TSCONFIG: string | undefined;
  // build file entry
  BUILD_ENTRY: string[];
  // build output path
  BUILD_OUTPUT: string;
  // GG CLI's config dir
  GG_CONFIG_DIR: string;
  // user's GG CLI's config file path
  GG_CONFIG: string | undefined;
  // GG CLI's pre bundle dir
  GG_BUILD_CACHE_DIR: string;
  // GG CLI's temp data store
  GG_DATA_CACHE_DIR: string;
  // alias
  ALIAS: GGAlias;
  // env
  ENV: GGEnv;
  //  prefix for this website
  PREFIX: string;
  //  publicPath
  PUBLIC_PATH: string;

  // optimizationData: DepOptimizationData | null;

  // POLYFILL_ENV: EnvConfig | false;

  // ECMA_VERSION: JscTarget;

  // DEV_COMPILER: DevCompiler | null;

  // BUILD_COMPILER: BuildCompiler | null;

  logger: LoggerImpl;
}
