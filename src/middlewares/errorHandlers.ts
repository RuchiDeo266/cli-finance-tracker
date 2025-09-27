import { Request, Response, NextFunction } from "express";
import { logger } from "../../src/logs/prod-app.ts";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error({ err }, "Unexpected Error Occured");

  // Generuic to user side
  res.status(500).send({ error: "Something went wrong." });
};

// Dummy error-handler

// factory: takes our *argument* => returns real middleware
// function validate(schema) {
//   return (req, res, next) => {          // ← real Express signature
//     const { error } = schema.validate(req.body);
//     if (error) return next(error);     // jump to error handler
//     next();                            // all good, continue
//   };
// }
