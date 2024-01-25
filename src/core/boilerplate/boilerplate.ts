import { throwCommonError } from "@/utils/errorHandler";
import { logger } from "@/utils/logger";
import { resolve } from "path";
// @ts-expect-error no types for this package
import { download } from "download-git-repo";

interface ICloneBoilerplateProps {
  location: string;
  projectName: string;
  cwd: string;
}

export const cloneBoilerplate = async ({
  location,
  projectName,
  cwd,
}: ICloneBoilerplateProps): Promise<void> => {
  const projectPath = resolve(cwd, projectName);

  await download(location, projectPath, function (err: any) {
    if (err) {
      if (err instanceof Error) {
        return logger.error(err.message);
      }
      throw throwCommonError(
        "Clone Boilerplate Error, Please contact with the author.",
      );
    }
  });
};
