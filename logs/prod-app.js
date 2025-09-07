import pino from "pino";
import path from "path";

// location for logger data
const locationFile = path.join(process.cwd(), "app.log");
const transport = pino.destination(locationFile);

// logger
const logger = pino(transport); // initialisation

logger.info("User is trying to add a new expense.");
logger.error("Failed to connect to the database.");
logger.info("Application is shutting down.");
