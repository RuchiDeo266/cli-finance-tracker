import { Request, Response, NextFunction } from "express";
export const protect = (req: Request, res: Response, next: NextFunction) => {
  // check the beared token , verify the user and allow the access to update the user.
};
