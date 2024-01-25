import { logger } from "@/utils/logger";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { resolve } from "path";
import prompts from "prompts";
import { cwd } from "process";
import { Boilerplate } from "@/types";
import { cloneBoilerplate } from "@/core/boilerplate";
import { GG_CONFIG_NAME, VERSION } from "@/constant";

export const init = async (project: string = "") => {
  logger.info(`Start Initializing ...`);

  const WORK_ROOT = cwd();

  // Get projectName
  if (!project) {
    const { project: _project } = await prompts([
      {
        type: "text",
        name: "project",
        message: "Please input project name: ",
      },
    ]);
    if (!_project) {
      logger.error("Project name cannot be empty!");
      process.exit(0);
    } else {
      project = _project;
    }
  }

  // Get Template
  const { template }: { template: Boilerplate } = await prompts([
    {
      type: "select",
      name: "template",
      message: "Please select a template: ",
      choices: [
        {
          title: "Standard React for PC",
          value: "standard_react_ts_antd_pc",
          description:
            "Standard React template based on AntDesign and Typescript for PC",
        },
        {
          title: "Standard React for H5",
          value: "standard_react_ts_antd_mobile",
          description:
            "Standard React template based on AntDesign and Typescript for H5",
        },
      ],
    },
  ]);

  if (!template || !template.repo) {
    process.exit(-1);
  }

  logger.info(`Start Cloning Template ${template.name}...`);

  await cloneBoilerplate({
    location: template.repo,
    projectName: project,
    cwd: WORK_ROOT,
  });

  await modifyVersion({ project, cwd: WORK_ROOT });

  logger.success(`Clone Template ${template.name} Success!`);
};

const modifyVersion = async ({
  project,
  cwd,
}: {
  project: string;
  cwd: string;
}) => {
  const configPath = resolve(cwd, project, GG_CONFIG_NAME);

  if (!existsSync(configPath)) return;

  let content = readFileSync(configPath, "utf-8").toString();

  content = content.replace(
    /version:\s*['"]([.\d]+)['"]/,
    () => `version: '~${VERSION}'`,
  );

  writeFileSync(configPath, content, "utf-8");
};
