import { DEFAULT_EXTENSIONS } from "@/constant";
import _resolve from "resolve";

export const resolveFrom = (
  id: string,
  basedir: string,
  preserveSymlinks = true,
): string => {
  return _resolve.sync(id, {
    basedir,
    extensions: DEFAULT_EXTENSIONS,
    preserveSymlinks,
  });
};
