import "./config";
import "reflect-metadata";
import express from "express";
import handlers from "./handlers.generated";
import { logger } from "./utils";
import { AppDataSource } from "./db";
import { generateServerHandler } from "ts-rpc";
import cors from "cors";

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: /^https?:\/\/localhost(:\d+)?$/,
  })
);

app.use("/", generateServerHandler(handlers));

async function main() {
  await AppDataSource.initialize();
  app.listen(process.env.PORT, () => {
    logger.info(`Server listening on ${process.env.PORT}...`);
    if (process.env.NODE_ENV === "production") {
      logger.info(`Syncing DB schema...`);
      AppDataSource.runMigrations({ transaction: "all" });
    }
  });
}

main();
