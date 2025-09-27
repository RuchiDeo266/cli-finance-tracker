import { Request, Response, NextFunction } from "express";

export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = fn(req, res, next);
    Promise.resolve(result).catch(next);
  };
};
