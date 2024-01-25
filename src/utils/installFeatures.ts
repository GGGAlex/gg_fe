import shell from "shelljs";
import { writeFileSync } from "fs";
import { PackageJSON, JSON } from "@/types";
import { printMsg, readJsonFile, writeJsonFile } from "./common";
import chalk from "chalk";

/**
 * Install ESLint
 */
export function installESLint(): void {
  shell.exec(
    "yarn add eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin -D",
  );

  const eslintrc = `module.exports = { 
    "env": {
      "es2021": true,
      "node": true
    },
    "extends": [
      "eslint:recommended",
      "plugin:@typescript-eslint/recommended"
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
      "ecmaVersion": 12,
      "sourceType": "module"
    },
    "plugins": [
      "@typescript-eslint"
    ],
    "rules": {
    }
  }`;

  try {
    writeFileSync("./.eslintrc.js", eslintrc, { encoding: "utf-8" });
  } catch (err) {
    printMsg(`${chalk.red("Failed to write .eslintrc.js file content")}`);
    printMsg(
      `${chalk.red("Please add the following content in .eslintrc.js")}`,
    );
    printMsg(`${chalk.cyan(eslintrc)}`);
  }

  const packageJSON = readJsonFile<PackageJSON>("./package.json");
  packageJSON["scripts"]["eslint:comment"] =
    "Use ESLint to auto fix .ts files in src";
  packageJSON["scripts"]["eslint"] =
    "eslint --fix src --ext .ts --max-warnings=0";
  writeJsonFile<PackageJSON>("./package.json", packageJSON);
}

/**
 * Install Prettier
 */
export function installPrettier(): void {
  shell.exec("yarn add prettier -D");
  const prettierrc = `module.exports = {
    // 一行最多 80 字符
    printWidth: 80,
    // 使用 2 个空格缩进
    tabWidth: 2,
    // 不使用 tab 缩进，而使用空格
    useTabs: false,
    // 行尾需要有分号
    semi: true,
    // 使用单引号代替双引号
    singleQuote: true,
    // 对象的 key 仅在必要时用引号
    quoteProps: 'as-needed',
    // jsx 不使用单引号，而使用双引号
    jsxSingleQuote: false,
    // 末尾使用逗号
    trailingComma: 'all',
    // 大括号内的首尾需要空格 { foo: bar }
    bracketSpacing: true,
    // jsx 标签的反尖括号需要换行
    jsxBracketSameLine: false,
    // 箭头函数，只有一个参数的时候，也需要括号
    arrowParens: 'always',
    // 每个文件格式化的范围是文件的全部内容
    rangeStart: 0,
    rangeEnd: Infinity,
    // 不需要写文件开头的 @prettier
    requirePragma: false,
    // 不需要自动在文件开头插入 @prettier
    insertPragma: false,
    // 使用默认的折行标准
    proseWrap: 'preserve',
    // 根据显示样式决定 html 要不要折行
    htmlWhitespaceSensitivity: 'css',
    // 换行符使用 lf
    endOfLine: 'lf'
  };`;
  try {
    writeFileSync("./.prettierrc.js", prettierrc, { encoding: "utf-8" });
  } catch (err) {
    printMsg(`${chalk.red("Failed to write .prettierrc.js file content")}`);
    printMsg(
      `${chalk.red("Please add the following content in .prettierrc.js")}`,
    );
    printMsg(`${chalk.cyan(prettierrc)}`);
  }

  const packageJson = readJsonFile<PackageJSON>("./package.json");
  packageJson["scripts"]["prettier:comment"] = "Auto format .ts files in src";
  packageJson["scripts"]["prettier"] = 'prettier --write "src/**/*.ts"';
  writeJsonFile<PackageJSON>("./package.json", packageJson);
}

/**
 * Install CZ
 */
export function installCZ(): void {
  shell.exec(
    "npx commitizen init cz-conventional-changelog --save --save-exact",
  );
  shell.exec("yarn add @commitlint/cli @commitlint/config-conventional -D");
  const commitlint = `module.exports = {
extends: ['@commitlint/config-conventional']
};
`;
  try {
    writeFileSync("./commitlint.config.js", commitlint, { encoding: "utf-8" });
  } catch (err) {
    printMsg(
      `${chalk.red("Failed to write commitlint.config.js file content")}`,
    );
    printMsg(
      `${chalk.red(
        "Please add the following content in commitlint.config.js",
      )}`,
    );
    printMsg(`${chalk.cyan(commitlint)}`);
  }
  const packageJson = readJsonFile<PackageJSON>("./package.json");
  packageJson["scripts"]["commit"] = "cz";
  writeJsonFile<PackageJSON>("./package.json", packageJson);
}

/**
 * Install husky and lint-staged to auto verify git commit
 * @param hooks
 * @param lintStaged
 */
export function installHusky(hooks: JSON, lintStaged: Array<string>): void {
  // init git
  shell.exec("git init");
  // install husky and lint-staged
  shell.exec("yarn add husky@4.2.3 lint-staged -D");
  // add husky and lint-staged to package.json
  const packageJson = readJsonFile<PackageJSON>("./package.json");
  packageJson["husky"] = {
    hooks: {
      "pre-commit": "lint-staged",
      ...hooks,
    },
  };
  packageJson["lint-staged"] = {
    "*.ts": lintStaged.map((item) => `yarn ${item}`),
  };
  writeJsonFile<PackageJSON>("./package.json", packageJson);
}

/**
 * install Build Tools
 */
export function installBuild(feature: Array<string>): void {
  // 设置 package.json
  const packageJson = readJsonFile<PackageJSON>("./package.json");
  packageJson["scripts"]["build:comment"] = "build";
  let order = "";
  if (feature.includes("ESLint")) {
    order += "yarn eslint";
  }
  if (feature.includes("Prettier")) {
    order += " && yarn prettier";
  }
  order += " && rimraf -rf lib && tsc --build";
  packageJson["scripts"]["build"] = order;
  writeJsonFile<PackageJSON>("./package.json", packageJson);
}
