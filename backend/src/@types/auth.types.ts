import { error } from "better-auth/api";
import z from "zod";

export const signupSchema = z.object({
  name: z.string({ error: "Name is required" }).min(1, "Name is required"),
  email: z.email({ error: "Email is required" }).min(1, "Email is required"),
  password: z
    .string({ error: "Password is required" })
    .min(6, "Password must be at least 6 characters long"),
});

export const loginSchema = z.object({
  email: z
    .email({ error: "Invalid email address" })
    .min(1, "Email is required"),
  password: z
    .string({ error: "Password is required" })
    .min(6, "Password must be at least 6 characters long"),
});

export const emailCheckSchema = z.object({
  email: z
    .string({ error: "Email is required" })
    .email("Invalid email format")
    .min(1, "Email is required"),
});
