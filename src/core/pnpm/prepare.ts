import { existsSync, readdirSync, statSync, writeFileSync } from "fs";
import { join } from "path";
import { runPnpm } from "./runPnpm";
import { logger } from "@/utils/logger";
import { PNPM_LOCK, YARN_LOCK, YARN_WORKSPACE } from "@/constant";
import { execSync } from "child_process";
import pnpmWorkspaceTemplate from "@/config/pnpm-workspace";

export const preparePnpm = async (WORK_ROOT: string): Promise<void> => {
  const pnpmLockPath = join(WORK_ROOT, PNPM_LOCK);
  const yarnLockPath = join(WORK_ROOT, YARN_LOCK);

  if (existsSync(yarnLockPath) && !existsSync(pnpmLockPath)) {
    await runPnpm({
      args: ["import"],
      cwd: WORK_ROOT,
    });
    logger.success(`Generate ${PNPM_LOCK} based on ${YARN_LOCK} success`);

    execSync(`rm -rf ${join(WORK_ROOT, "node_modules")}`);
    const modulesPath = join(WORK_ROOT, "modules");
    const modules =
      existsSync(modulesPath) && statSync(modulesPath).isDirectory()
        ? readdirSync(modulesPath)
        : [];

    await Promise.all(
      modules.map(
        (module) =>
          new Promise<void>((__res) => {
            const targetPath = join(modulesPath, module, "node_modules");
            if (existsSync(targetPath)) {
              execSync(`rm -rf ${targetPath}`);
            }
            __res();
          }),
      ),
    );
  }

  if (!existsSync(YARN_WORKSPACE)) {
    writeFileSync(join(WORK_ROOT, YARN_WORKSPACE), pnpmWorkspaceTemplate);
  }
};
