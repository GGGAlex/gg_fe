import chalk from "chalk";

import {
  ILogProps,
  ILoggerProps,
  LogLevel,
  LOG_LEVEL_ORDER,
  LoggerImpl,
} from "./type";

export class Logger implements LoggerImpl {
  constructor({ name, logLevel, verbose }: ILoggerProps) {
    this.name = name;
    this.logLevel = logLevel;
    this.logLevelOrder = LOG_LEVEL_ORDER[logLevel] || LOG_LEVEL_ORDER.info;
    this.verbose = verbose;
  }

  name: string;

  logLevel: LogLevel;

  logLevelOrder: LOG_LEVEL_ORDER;

  verbose: string | boolean;

  format(log: ILogProps): string {
    const { type = "info", name = this.name, message } = log;
    let coloredMessage = message;
    switch (type) {
      case "warning":
        coloredMessage = chalk.yellowBright(message);
        break;
      case "error":
        coloredMessage = chalk.redBright(message);
        break;
      case "success":
        coloredMessage = chalk.greenBright(message);
        break;
      case "debug":
        coloredMessage = chalk.cyanBright(message);
        break;
      default:
        break;
    }

    const time = new Date().toLocaleTimeString();

    return `[${chalk.dim(time)} ${chalk.bgWhite(chalk.black(` ${name}`))} ${coloredMessage}]`;
  }

  public show(
    message: string,
    options?: Partial<Omit<ILogProps, "message">> | undefined,
  ): void {
    console.log(this.format({ message, name: this.name, ...options }));
  }

  public info(
    message: string,
    options?: Partial<Omit<ILogProps, "message">> | undefined,
  ): void {
    if (this.logLevelOrder > LOG_LEVEL_ORDER.info) return;
    this.show(message, { ...options, type: "info" });
  }
  public success(
    message: string,
    options?: Partial<Omit<ILogProps, "type" | "message">> | undefined,
  ): void {
    this.show(message, { ...options, type: "success" });
  }
  public warn(
    message: string,
    options?: Partial<Omit<ILogProps, "type" | "message">> | undefined,
  ): void {
    if (this.logLevelOrder > LOG_LEVEL_ORDER.warning) return;
    this.show(message, { ...options, type: "warning" });
  }
  public error(
    message: string,
    options?: Partial<Omit<ILogProps, "type" | "message">> | undefined,
  ): void {
    if (this.logLevelOrder > LOG_LEVEL_ORDER.error) return;
    this.show(message, { ...options, type: "error" });
  }
  public debug(
    message: string,
    field?: string | undefined,
    options?: Partial<Omit<ILogProps, "type" | "message">> | undefined,
  ): void {
    if (!this.verbose) return;
    const hasField = typeof this.verbose === "string" && field;
    if (hasField && !field.startsWith(this.verbose as string)) return;
    this.show(message, { ...options, type: "debug", name: field || this.name });
  }
}

export function formatLogLevel(logLevel?: string): LogLevel | undefined {
  if (
    typeof logLevel === "string" &&
    logLevel && [
      "info",
      "warning",
      "error",
      "debug".includes(logLevel.toLowerCase()),
    ]
  ) {
    return logLevel.toLowerCase() as LogLevel;
  }
}
