import { logger } from "./logger";

export const throwCommonError = (message: string): Error => {
  logger.error(message);
  throw new Error(`[gg_cli]: 💣 ${message}`);
};
