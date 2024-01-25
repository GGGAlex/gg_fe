import {
  changePackageInfo,
  createEnd,
  initProjectDir,
  installDevEnvironment,
  installFeatures,
  installTSAndInit,
  installTypesNode,
  isFileExist,
  selectFeatures,
} from "../utils/create";

export default async function create(projectName: string) {
  // verify the file whether it exists, if it does, kill the process
  isFileExist(projectName);

  // get features from the user
  const features = await selectFeatures();

  // init project directory
  initProjectDir(projectName);

  // change package info
  changePackageInfo(projectName);

  // install typescript and init
  installTSAndInit();

  // install types node
  installTypesNode();

  // install dev environment
  installDevEnvironment();

  // install features
  installFeatures(features);

  // create end
  createEnd(projectName);
}
