import { Logger } from "./logger";
import { LoggerImpl } from "./type";

export let logger: LoggerImpl = new Logger({
  name: "default",
  logLevel: "info",
  verbose: false,
});

export function updateGlobalLogger(newLogger: LoggerImpl) {
  logger = newLogger;
}
