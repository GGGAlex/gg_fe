import { spawn } from "child_process";
import { resolveFrom } from "../depSource/resolve";

interface Props {
  args: string[];
  cwd?: string;
}

const resolvePnpmPath = (() => {
  let pnpmPath: string;
  return () => {
    if (!pnpmPath) {
      pnpmPath = resolveFrom("pnpm", __dirname, false);
    }
    return pnpmPath;
  };
})();

export const runPnpm = (props: Props): Promise<void> => {
  const { args, cwd = process.cwd() } = props;
  const pnpmPath = resolvePnpmPath();

  return new Promise<void>((__res) => {
    const childProcess = spawn("node", [pnpmPath, ...args], {
      cwd,
      stdio: "inherit",
    });
    childProcess.on("close", __res);
    childProcess.on("disconnect", __res);
    childProcess.on("error", __res);
    childProcess.on("exit", __res);
  });
};
