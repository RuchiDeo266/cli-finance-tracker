import { Request, Response } from "express";
import { monthlyDigest } from "../../jobs/monthly digest/monthly-digest.ts";

import { CustomRequest } from "./initial-deposit-controller.ts";
export const monthlyDigestProvider = async (
  req: CustomRequest,
  res: Response
) => {
  try {
    const response = await monthlyDigest(req.userId);
    if (response.ok) {
      res
        .status(200)
        .json({ code: 200, success: true, message: response.message });
    } else {
      res.status(400).json({
        code: 400,
        success: false,
        message: "Failed to generate the monthly digest",
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ code: 500, success: false, message: "Failed to load data" });
  }
};
