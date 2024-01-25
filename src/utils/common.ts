import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";
import clear from "console-clear";

/**
 * Read json file from filepath
 * @param filepath
 * @returns
 */
export function readJsonFile<T>(filepath: string): T {
  return JSON.parse(readFileSync(filepath, { encoding: "utf8", flag: "r" }));
}

/**
 * Write json file to filepath
 * @param filepath json filepath
 * @param content json content
 */
export function writeJsonFile<T>(filepath: string, content: T): void {
  writeFileSync(filepath, JSON.stringify(content, null, 2));
}

/**
 * Get project's absolute path
 * @param projectName
 */
export function getProjectPath(projectName: string): string {
  return resolve(process.cwd(), projectName);
}

/**
 * Print Message to console
 * @param message
 */
export function printMsg(message: string): void {
  console.log(message);
}

/**
 * Clear terminal
 */
export function clearConsole(): void {
  clear();
}
