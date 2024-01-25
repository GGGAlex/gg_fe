import {
  clearConsole,
  getProjectPath,
  printMsg,
  readJsonFile,
  writeJsonFile,
} from "./common";
import { existsSync } from "fs";
import inquirer from "inquirer";
import chalk from "chalk";
import shell from "shelljs";
import { PackageJSON, JSON } from "@/types";
import {
  installBuild,
  installCZ,
  installESLint,
  installHusky,
  installPrettier,
} from "./installFeatures";

/**
 * verify the file whether it exists, if it does, kill the process
 * @param filename
 */
export function isFileExist(filename: string): void {
  // get the path of the file
  const path = getProjectPath(filename);
  // verify the file, if it exists, kill the process
  if (existsSync(path)) {
    printMsg(chalk.red(`${filename} exists`));
    process.exit(1);
  }
}

/**
 * Let users select the feature that they need
 * @returns ['ESLint', 'Prettier', 'CZ']
 */
export async function selectFeatures(): Promise<Array<string>> {
  // clear the terminal
  clearConsole();
  // print message
  printMsg(chalk.blue(`gg CLI v${require("../../package.json").version}`));
  printMsg(chalk.green(`Start initializing the project`));
  printMsg("");

  const { feature } = await inquirer.prompt([
    {
      name: "feature",
      type: "checkbox",
      message: "Check the features needed for your project",
      choices: [
        { name: "ESLint", value: "ESLint" },
        { name: "Prettier", value: "Prettier" },
        { name: "CZ", value: "CZ" },
      ],
    },
  ]);

  return feature as Array<string>;
}

/**
 * Initializes the project dictionary
 * @param projectName The name of the project
 */
export function initProjectDir(projectName: string): void {
  shell.exec(`mkdir ${projectName}`);
  shell.cd(projectName);
  shell.exec("yarn init -y");
}

/**
 * Change name and description in package.json to project
 * @param projectName The name of the project
 */
export function changePackageInfo(projectName: string): void {
  const packageJSON: PackageJSON = readJsonFile<PackageJSON>("./package.json");
  packageJSON.name = packageJSON.description = projectName;
  packageJSON["scripts"] = {};
  writeJsonFile("./package.json", packageJSON);
}

/**
 * Install Typescript and initialize the project
 */
export function installTSAndInit(): void {
  shell.exec("yarn add typescript -D && npx tsc --init");
  const tsconfigJson: JSON = {
    compileOnSave: true,
    compilerOptions: {
      target: "ES2018",
      module: "commonjs",
      moduleResolution: "node",
      experimentalDecorators: true,
      emitDecoratorMetadata: true,
      inlineSourceMap: true,
      noImplicitThis: true,
      noUnusedLocals: true,
      stripInternal: true,
      pretty: true,
      declaration: true,
      outDir: "lib",
      baseUrl: "./",
      paths: {
        "*": ["src/*"],
      },
    },
    exclude: ["lib", "node_modules"],
  };
  writeJsonFile<JSON>("./tsconfig.json", tsconfigJson);
  shell.exec("mkdir src && touch src/index.ts");
}

/**
 * Install @types/node
 */
export function installTypesNode(): void {
  shell.exec("yarn add @types/node -D");
}

/**
 * Install Dev Environment
 */
export function installDevEnvironment(): void {
  shell.exec("yarn add ts-node-dev -D");
  const packageJSON = readJsonFile<PackageJSON>("./package.json");
  packageJSON["scripts"]["dev:comment"] = "Start dev environment";
  packageJSON["scripts"]["dev"] =
    "ts-node-dev --respawn --transpile-only src/index.ts";
  writeJsonFile<PackageJSON>("./package.json", packageJSON);
}

/**
 * Install the features that user selected
 * @param features
 */
export function installFeatures(features: Array<string>): void {
  features.forEach((item) => {
    switch (item) {
      case "ESLint":
        installESLint();
        break;
      case "Prettier":
        installPrettier();
        break;
      case "CZ":
        installCZ();
        break;
      default:
        break;
    }
  });
  implementHusky(features);
  installBuild(features);
}

/**
 * Install Husky and lint-staged, then set commands
 * @param features
 */
function implementHusky(features: Array<string>): void {
  const featuresCopy = JSON.parse(JSON.stringify(features));
  const hooks: JSON = {};
  if (featuresCopy.includes("CZ")) {
    hooks["commit-msg"] = "commitlint -E HUSKY_GIT_PARAMS";
  }

  const lintStaged: Array<string> = [];
  if (featuresCopy.includes("ESLint")) {
    lintStaged.push("eslint --fix");
  }
  if (featuresCopy.includes("Prettier")) {
    lintStaged.push("prettier --write");
  }
  installHusky(hooks, lintStaged);
}

export function createEnd(projectName: string): void {
  printMsg(
    `${chalk.green(
      `Successfully created project ${chalk.yellow(projectName)}`,
    )}`,
  );
  printMsg("Get started with the following commands: ");
  printMsg(`${chalk.gray("$")} ${chalk.cyanBright("yarn dev")}`);
}
