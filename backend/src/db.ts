import path, { dirname } from "path";
import { DataSource } from "typeorm";
import { fileURLToPath } from "url";

// load config from .env in dev mode
import "./config";

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_DATABASE } = process.env;

export const AppDataSource = new DataSource({
  type: "mysql",
  host: DB_HOST,
  port: +DB_PORT,
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  poolSize: 4,
  timezone: "+08:00",
  connectTimeout: 1000,
  entities: [path.join(__dirname, "entities/*.js")],
  migrations: [path.join(__dirname, "migrations/*.js")],
});
