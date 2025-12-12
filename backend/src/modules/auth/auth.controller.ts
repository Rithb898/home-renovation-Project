import z from "zod";
import type { Request, Response } from "express";
import { auth } from "../../lib/auth.js";
import {
  loginSchema,
  signupSchema,
  emailCheckSchema,
} from "../../@types/auth.types.js";
import { ApiResponse } from "../../utils/api-response.js";
import { ApiError } from "../../utils/api-error.js";
import { APIError } from "better-auth";
import { checkEmailAvailability } from "./auth.service.js";
import { fromNodeHeaders } from "better-auth/node";

export const signup = async (req: Request, res: Response) => {
  try {
    const result = signupSchema.safeParse(req.body);

    if (!result.success) {
      return res
        .status(400)
        .json(new ApiError(400, "Validation Error", result.error.issues));
    }

    const parsedData = result.data;

    // Check if email already exists
    const emailAvailability = await checkEmailAvailability(parsedData.email);

    if (!emailAvailability.available) {
      return res
        .status(409)
        .json(new ApiError(409, "Email already registered"));
    }

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

export const signout = async (req: Request, res: Response) => {
  try {
    const authResponse = await auth.api.signOut({
      headers: fromNodeHeaders(req.headers),
    });

    return res
      .status(200)
      .json(new ApiResponse(200, authResponse, "User logged out successfully"));
  } catch (error) {
    return res.status(500).json(new ApiError(500, "Internal Server Error"));
  }
};

export const checkEmail = async (req: Request, res: Response) => {
  try {
    const result = emailCheckSchema.safeParse(req.body);

    if (!result.success) {
      return res
        .status(400)
        .json(new ApiError(400, "Validation Error", result.error.issues));
    }

    const { email } = result.data;

    const availabilityResult = await checkEmailAvailability(email);

    return res
      .status(200)
      .json(
        new ApiResponse(200, availabilityResult, "Email availability checked")
      );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json(new ApiError(400, "Validation Error", error.issues));
    }

    // Handle database errors without exposing sensitive information
    return res.status(500).json(new ApiError(500, "Internal Server Error"));
  }
};

export const userSession = async (req: Request, res: Response) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    return res
      .status(200)
      .json(
        new ApiResponse(200, session, "User session retrieved successfully")
      );
  } catch (error) {
    return res.status(500).json(new ApiError(500, "Internal Server Error"));
  }
};
