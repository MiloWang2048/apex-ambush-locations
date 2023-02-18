import dotenv from "dotenv";
import joi from "joi";
import log4js from "log4js";

const result = dotenv.config();
if (result.error) {
  throw "Config fail to load.";
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      LOG_LEVEL: string;
      NODE_ENV: string;

      JWT_SECRET: string;

      DB_HOST: string;
      DB_PORT: string;
      DB_USER: string;
      DB_PASSWORD: string;
      DB_DATABASE: string;

      FE_URL: string;

      SMTP_PASSWD: string;
      SMTP_USER: string;
      SMTP_HOST: string;
      SMTP_PORT: string;
    }
  }
}

const schema = joi.object<NodeJS.ProcessEnv>({
  PORT: joi.string().required(),
  LOG_LEVEL: joi.string().allow("debug", "info", "warn").default("info"),
  NODE_ENV: joi
    .string()
    .allow("development", "production")
    .default("production"),

  JWT_SECRET: joi.string().required(),

  DB_HOST: joi.string().required(),
  DB_PORT: joi.string().required(),
  DB_USER: joi.string().required(),
  DB_PASSWORD: joi.string().required(),
  DB_DATABASE: joi.string().required(),

  FE_URL: joi.string().required(),

  SMTP_PASSWD: joi.string().required(),
  SMTP_USER: joi.string().required(),
  SMTP_HOST: joi.string().required(),
  SMTP_PORT: joi.string().required(),
});

joi.assert(result.parsed, schema);
