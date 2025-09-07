import pino from "pino";

const logger = pino();

logger.info("Added: new expens from user124");
logger.warn("Warning: /..");
logger.error("Error: failed to connect with network");
logger.info("Application is shutting down");
