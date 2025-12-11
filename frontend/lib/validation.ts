/**
 * Frontend validation schemas
 * These mirror the backend validation schemas to provide client-side validation
 */

import { z } from "zod";

/**
 * Signup form validation schema
 * Matches backend validation requirements
 */
export const signupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format").min(1, "Email is required"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .min(1, "Password is required"),
  terms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and conditions",
  }),
});

/**
 * Login form validation schema
 * Matches backend validation requirements
 */
export const loginSchema = z.object({
  email: z.string().email("Invalid email format").min(1, "Email is required"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .min(1, "Password is required"),
});

/**
 * Email validation schema for availability checks
 */
export const emailSchema = z
  .string()
  .email("Invalid email format")
  .min(1, "Email is required");

// Export types inferred from schemas
export type SignupFormData = z.infer<typeof signupSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;

/**
 * Validate a single field against a schema
 */
export function validateField<T extends z.ZodTypeAny>(
  schema: T,
  value: unknown,
): { success: boolean; error?: string } {
  const result = schema.safeParse(value);

  if (result.success) {
    return { success: true };
  }

  // Safely access the first error message
  const firstError =
    result.error && result.error.issues && result.error.issues.length > 0
      ? result.error.issues[0].message
      : "Validation failed";

  return {
    success: false,
    error: firstError,
  };
}

/**
 * Validate entire form data against a schema
 */
export function validateForm<T extends z.ZodTypeAny>(
  schema: T,
  data: unknown,
): {
  success: boolean;
  errors?: Record<string, string>;
  data?: z.infer<T>;
} {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  // Transform zod errors into field-level error object
  const errors: Record<string, string> = {};
  result.error.issues.forEach((err) => {
    const field = err.path[0];
    if (field && typeof field === "string") {
      errors[field] = err.message;
    }
  });

  return { success: false, errors };
}
