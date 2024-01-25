export const GG_CONFIG_NAME = "gg.config";

const pkgData = require("../../package.json");

export const VERSION = pkgData.version;

export const PNPM_LOCK = "pnpm-lock.yaml";

export const YARN_LOCK = "yarn.lock";

export const YARN_WORKSPACE = "pnpm-workspace.yaml";

export const DEFAULT_EXTENSIONS = [
  ".js",
  ".mjs",
  ".ts",
  ".jsx",
  ".tsx",
  ".json",
];
