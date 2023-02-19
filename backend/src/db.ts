import path from "path";
import { DataSource, Logger, QueryRunner } from "typeorm";

// load config from .env in dev mode
import "./config";
import { dbLogger } from "./utils";

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_DATABASE } = process.env;

const AppDataSource = new DataSource({
  type: "mysql",
  host: DB_HOST,
  port: +DB_PORT,
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  logging: true,
  logger: dbLogger,
  timezone: "+08:00",
  entities: [path.join(__dirname, "entities/*.js")],
  migrations: [path.join(__dirname, "migrations/*.js")],
});

export { AppDataSource };
