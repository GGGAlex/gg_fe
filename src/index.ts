import { program } from "commander";
import create from "./commands/create";

program
  .version(`${require("../package.json").version}`, "-v --version")
  .usage("<command> [options]");

program
  .command("create <app-name>")
  .description("Create new project from => gg_fe create yourProjectName")
  .action(async (name: string) => {
    await create(name);
  });

program.parse(process.argv);
