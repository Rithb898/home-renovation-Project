import z from "zod";
import type { Request, Response } from "express";
import { auth } from "../../lib/auth.js";
import { loginSchema, signupSchema } from "../../@types/auth.types.js";
import { ApiResponse } from "../../utils/api-response.js";
import { ApiError } from "../../utils/api-error.js";
import { APIError } from "better-auth";

export const signup = async (req: Request, res: Response) => {
  try {
    const result = signupSchema.safeParse(req.body);

    if (!result.success) {
      return res
        .status(400)
        .json(new ApiError(400, "Validation Error", result.error.issues));
    }

    const parsedData = result.data;

    const authResponse = await auth.api.signUpEmail({
      body: {
        name: parsedData.name,
        email: parsedData.email,
        password: parsedData.password,
      },
    });

    return res
      .status(201)
      .json(new ApiResponse(201, authResponse, "User registered successfully"));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json(new ApiError(400, "Validation Error", error.issues));
    }

    if (error instanceof APIError) {
      // Better Auth APIError has statusCode and body properties
      const statusCode = error.statusCode || 500;
      const message =
        error.body?.message || error.message || "Authentication error";
      const errors = error.body ? [error.body] : [];

      return res
        .status(statusCode)
        .json(new ApiError(statusCode, message, errors));
    }

    return res.status(500).json(new ApiError(500, "Internal Server Error"));
  }
};

export const signin = async (req: Request, res: Response) => {
  try {
    const result = loginSchema.safeParse(req.body);

    if (!result.success) {
      return res
        .status(400)
        .json(new ApiError(400, "Validation Error", result.error.issues));
    }

    const parsedData = result.data;

    const authResponse = await auth.api.signInEmail({
      body: {
        email: parsedData.email,
        password: parsedData.password,
      },
    });

    return res
      .status(200)
      .json(new ApiResponse(200, authResponse, "User logged in successfully"));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json(new ApiError(400, "Validation Error", error.issues));
    }

    if (error instanceof APIError) {
      // Better Auth APIError has statusCode and body properties
      const statusCode = error.statusCode || 500;
      const message =
        error.body?.message || error.message || "Authentication error";
      const errors = error.body ? [error.body] : [];

      return res
        .status(statusCode)
        .json(new ApiError(statusCode, message, errors));
    }

    return res.status(500).json(new ApiError(500, "Internal Server Error"));
  }
};
