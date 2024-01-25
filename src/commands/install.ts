import { YARN_WORKSPACE } from "@/constant";
import { preparePnpm } from "@/core/pnpm/prepare";
import { runPnpm } from "@/core/pnpm/runPnpm";
import { Runtime } from "@/types";
import { logger } from "@/utils/logger";
import { existsSync, readdirSync } from "fs";
import { join, resolve } from "path";

export interface IInstallProps {
  cwd?: string;
  args?: string[];
  prepare?: boolean;
}

/**
 * @description Standard install command for a directory path
 * @param props
 */
export const installPackages = async (props: IInstallProps): Promise<void> => {
  const { args = [], prepare = true } = props;

  const cwd = props.cwd || process.cwd();

  if (prepare) await preparePnpm(cwd);

  if (args.length === 0) {
    args.push("install");
  }

  const isWorkspace = existsSync(join(cwd, YARN_WORKSPACE));

  if (
    isWorkspace &&
    (args.includes("add") || args.includes("remove")) &&
    !args.includes("-w") &&
    !args.includes("--workspace-root")
  ) {
    args.push("--workspace-root");
  }

  return runPnpm({
    args: [...args],
    cwd: cwd,
  });
};

export const checkPackages = async (runtime: Runtime): Promise<void> => {
  const { WORK_ROOT } = runtime;

  const install = async () => {
    logger.warn("Dependencies NOT Found, Start Install Dependencies.");
    await installPackages({ cwd: WORK_ROOT });
  };

  const NODE_MODULES = resolve(WORK_ROOT, "node_modules");
  if (!existsSync(NODE_MODULES)) {
    await install();
  }

  const dependencies = readdirSync(NODE_MODULES);

  if (dependencies.length === 0) {
    await install();
  }
};
