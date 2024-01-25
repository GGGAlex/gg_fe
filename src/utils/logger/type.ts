export type LogLevel = "info" | "warning" | "error" | "silent";

export type LogType = "info" | "warning" | "error" | "success" | "debug";

export interface ILoggerProps {
  name: string;
  logLevel: LogLevel;
  verbose: string | boolean;
}

export interface ILogProps {
  message: string;
  type?: LogType;
  name?: string;
}

export enum LOG_LEVEL_ORDER {
  info,
  warning,
  error,
  silent,
}

// export keyword is used to export a class, function, or a variable, so that it can be used in other modules.
export declare class LoggerImpl {
  // name is a string that stores the name of the logger
  name: string;
  // logLevel is a LogLevel type that stores the log level of the logger
  logLevel: LogLevel;
  // logLevelOrder is an array of LOG_LEVEL_ORDER types that stores the log level order of the logger
  logLevelOrder: LOG_LEVEL_ORDER;
  // verbose is a string or boolean type that stores the verbose level of the logger
  verbose: string | boolean;
  // format is a function that takes an ILogProps object and returns a string
  format(log: ILogProps): string;
  // show is a function that takes a message and an optional object of Omit<ILogProps, 'message'> and prints the message
  public show(
    message: string,
    options?: Partial<Omit<ILogProps, "message">>,
  ): void;
  // info is a function that takes a message and an optional object of Omit<ILogProps, 'message'> and prints the message with the info type
  public info(
    message: string,
    options?: Partial<Omit<ILogProps, "message">>,
  ): void;
  // success is a function that takes a message and an optional object of Omit<ILogProps, 'message' | 'type'> and prints the message with the success type
  public success(
    message: string,
    options?: Partial<Omit<ILogProps, "message" | "type">>,
  ): void;
  // warn is a function that takes a message and an optional object of Omit<ILogProps, 'message' | 'type'> and prints the message with the warn type
  public warn(
    message: string,
    options?: Partial<Omit<ILogProps, "message" | "type">>,
  ): void;
  // error is a function that takes a message and an optional object of Omit<ILogProps, 'message' | 'type'> and prints the message with the error type
  public error(
    message: string,
    options?: Partial<Omit<ILogProps, "message" | "type">>,
  ): void;
  // debug is a function that takes a message, an optional field, and an optional object of Omit<ILogProps, 'message' | 'type'> and prints the message with the debug type
  public debug(
    message: string,
    field?: string,
    options?: Partial<Omit<ILogProps, "message" | "type">>,
  ): void;
}
