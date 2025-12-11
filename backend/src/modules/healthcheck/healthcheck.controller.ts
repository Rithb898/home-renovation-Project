import type { Request, Response } from "express";
import { ApiResponse } from "../../utils/api-response.js";

export const healthcheck = (req: Request, res: Response) => {
  try {
    return res
      .status(200)
      .json(new ApiResponse(200, { message: "Server is running" }));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal server error"));
  }
};
