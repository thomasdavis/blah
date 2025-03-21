import { Command } from "commander";
import { BlahValidator } from "@blahai/schema";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";
import chalk from "chalk";

// Initialize validator once
const validator = new BlahValidator();

export function registerSchemaCommands(program: Command) {
  const schema = program
    .command("schema")
    .description("Blah schema validation tools");

  schema
    .command("validate")
    .description("Validate a blah.json configuration file")
    .argument("<file>", "Path to blah.json file")
    .action((file) => {
      try {
        const filePath = path.resolve(file);
        const content = readFileSync(filePath, "utf-8");
        const data = JSON.parse(content);
        const result = validator.validate(data);
        
        if (result.valid) {
          console.log(chalk.green("✓ Configuration is valid!"));
          console.log(chalk.blue("Manifest Details:"));
          console.log(chalk.yellow("Name:"), data.name);
          console.log(chalk.yellow("Version:"), data.version);
          console.log(chalk.yellow("Tools:"), data.tools?.length || 0);
          if (data.prompts) {
            console.log(chalk.yellow("Prompts:"), data.prompts.length);
          }
          if (data.resources) {
            console.log(chalk.yellow("Resources:"), data.resources.length);
          }
          if (data.flows) {
            console.log(chalk.yellow("Flows:"), data.flows.length);
          }
          process.exit(0);
        } else {
          console.log(chalk.red("✗ Configuration is invalid:"));
          console.log(JSON.stringify(result.errors, null, 2));
          process.exit(1);
        }
      } catch (error) {
        if (error instanceof Error) {
          console.log(chalk.red("Error:"), error.message);
        } else {
          console.log(chalk.red("An unknown error occurred"));
        }
        process.exit(1);
      }
    });

  schema
    .command("init")
    .description("Initialize a new blah.json file")
    .argument("[file]", "Output file path", "blah.json")
    .action((file) => {
      try {
        const targetPath = path.resolve(file);
        
        if (existsSync(targetPath)) {
          console.log(chalk.red("✗ File already exists:"), targetPath);
          process.exit(1);
        }

        // Get the example file from node_modules
        const pkgPath = path.dirname(fileURLToPath(import.meta.resolve("@blahai/schema")));
        const examplePath = path.join(pkgPath, "examples", "sample-blah.json");
        const exampleContent = readFileSync(examplePath, "utf-8");
        
        writeFileSync(targetPath, exampleContent);
        console.log(chalk.green("✓ Created new blah.json file at:"), targetPath);
        process.exit(0);
      } catch (error) {
        if (error instanceof Error) {
          console.log(chalk.red("Error:"), error.message);
        } else {
          console.log(chalk.red("An unknown error occurred"));
        }
        process.exit(1);
      }
    });
}
