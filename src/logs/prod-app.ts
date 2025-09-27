import pino from "pino";
// import path from "path";
import pretty from "pino-pretty";

import { mkdirSync } from "node:fs";
import { dirname } from "node:path";

// location for logger data
// const locationFile = path.join("logs", "./app.log");
// const transport = pino.destination(locationFile);

// logger
// export const logger = pino(transport); // initialisation

// dev purpose
// export const logger = pino(pretty({ colorize: true }));

// logger.info("User is trying to add a new expense.");
// logger.error("Failed to connect to the database.");
// logger.info("Application is shutting down.");

const logPath = new URL("../logs/app.log", import.meta.url).pathname.slice(1); // strip leading "/C:/"
mkdirSync(dirname(logPath), { recursive: true }); // ← create logs/ if missing

export const logger = pino(
  pretty({ colorize: true })
  //   { level: process.env.LOG_LEVEL ?? 'info' },
  //   pino.destination({ dest: logPath, mkdir: true })  // mkdir:true is
  // redundant now, but harmless
);
