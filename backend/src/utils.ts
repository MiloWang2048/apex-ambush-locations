import crypto from "crypto-js";
import log4js from "log4js";
import jwt from "jsonwebtoken";
import { Logger, QueryRunner } from "typeorm";

export const logger = log4js.getLogger();
logger.level = process.env.LOG_LEVEL;

export function encryptAES(payload: string) {
  return crypto.AES.encrypt(payload, process.env.JWT_SECRET).toString();
}

export function decryptAES(cipher: string) {
  return crypto.AES.decrypt(cipher, process.env.JWT_SECRET).toString(
    crypto.enc.Utf8
  );
}

export function verifyJwt(token: string) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    throw "非法身份标识";
  }
}

export const dbLogger: Logger = {
  logQuery: function (
    query: string,
    parameters?: any[] | undefined,
    queryRunner?: QueryRunner | undefined
  ) {
    logger.debug("Query:", query);
    logger.debug("Parameters:", parameters);
  },
  logQueryError: function (
    error: string | Error,
    query: string,
    parameters?: any[] | undefined,
    queryRunner?: QueryRunner | undefined
  ) {
    logger.error("Query error:", error);
    logger.error("Query:", query);
    logger.error("Parameters:", parameters);
  },
  logQuerySlow: function (
    time: number,
    query: string,
    parameters?: any[] | undefined,
    queryRunner?: QueryRunner | undefined
  ) {
    logger.warn("Slow query, time:", time);
    logger.warn("Query:", query);
    logger.warn("Parameters:", parameters);
  },
  logSchemaBuild: function (
    message: string,
    queryRunner?: QueryRunner | undefined
  ) {
    logger.info("Schema builder:", message);
  },
  logMigration: function (
    message: string,
    queryRunner?: QueryRunner | undefined
  ) {
    logger.info("Migrations:", message);
  },
  log: function (
    level: "warn" | "info" | "log",
    message: any,
    queryRunner?: QueryRunner | undefined
  ) {
    switch (level) {
      case "warn":
        logger.warn(message);
        break;
      case "info":
        logger.info(message);
        break;
      case "log":
        logger.debug(message);
        break;
    }
  },
};
