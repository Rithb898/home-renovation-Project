import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import * as fc from "fast-check";
import { useAuthForm } from "./use-auth-form";
import { loginSchema, signupSchema } from "@/lib/validation";

describe("useAuthForm", () => {
  describe("Property 8: Field validation triggers", () => {
    // Feature: frontend-auth-integration, Property 8: Field validation triggers
    // Validates: Requirements 4.1

    it("should trigger validation on blur for email field", () => {
      const onSubmit = vi.fn().mockResolvedValue(undefined);

      const { result } = renderHook(() =>
        useAuthForm({
          initialValues: { email: "", password: "" },
          validationSchema: loginSchema,
          onSubmit,
        }),
      );

      // Change to invalid email
      act(() => {
        result.current.handleChange("email", "invalid");
      });

      // Blur should trigger validation
      act(() => {
        result.current.handleBlur("email");
      });

      // Field should be marked as touched
      expect(result.current.touched.email).toBe(true);
      // Should have validation error
      expect(result.current.errors.email).toBeDefined();
    });

    it("should trigger validation on blur for password field", () => {
      const onSubmit = vi.fn().mockResolvedValue(undefined);

      const { result } = renderHook(() =>
        useAuthForm({
          initialValues: { email: "", password: "" },
          validationSchema: loginSchema,
          onSubmit,
        }),
      );

      // Change to invalid password (too short)
      act(() => {
        result.current.handleChange("password", "123");
      });

      // Blur should trigger validation
      act(() => {
        result.current.handleBlur("password");
      });

      // Field should be marked as touched
      expect(result.current.touched.password).toBe(true);
      // Should have validation error
      expect(result.current.errors.password).toBeDefined();
    });

    it("should clear errors when user starts typing", () => {
      const onSubmit = vi.fn().mockResolvedValue(undefined);

      const { result } = renderHook(() =>
        useAuthForm({
          initialValues: { email: "", password: "" },
          validationSchema: loginSchema,
          onSubmit,
        }),
      );

      // Set an error
      act(() => {
        result.current.setFieldError("email", "Some error");
      });

      expect(result.current.errors.email).toBeDefined();

      // Change field value - should clear error
      act(() => {
        result.current.handleChange("email", "test@example.com");
      });

      expect(result.current.errors.email).toBeUndefined();
    });
  });

  describe("Property 4: Loading state consistency", () => {
    // Feature: frontend-auth-integration, Property 4: Loading state consistency
    // Validates: Requirements 1.5, 3.4

    it("should set isSubmitting to true during form submission", async () => {
      let resolveSubmit: () => void;
      const submitPromise = new Promise<void>((resolve) => {
        resolveSubmit = resolve;
      });

      const onSubmit = vi.fn().mockReturnValue(submitPromise);

      const { result } = renderHook(() =>
        useAuthForm({
          initialValues: { email: "test@example.com", password: "password123" },
          validationSchema: loginSchema,
          onSubmit,
        }),
      );

      // Initially not submitting
      expect(result.current.isSubmitting).toBe(false);

      // Start submission (don't await yet)
      act(() => {
        result.current.handleSubmit({
          preventDefault: vi.fn(),
        } as any);
      });

      // Should be submitting
      await waitFor(() => {
        expect(result.current.isSubmitting).toBe(true);
      });

      // Resolve the submission
      act(() => {
        resolveSubmit!();
      });

      // Should no longer be submitting
      await waitFor(() => {
        expect(result.current.isSubmitting).toBe(false);
      });
    });

    it("should reset isSubmitting even if submission fails", async () => {
      const onSubmit = vi.fn().mockRejectedValue(new Error("Submit failed"));

      const { result } = renderHook(() =>
        useAuthForm({
          initialValues: { email: "test@example.com", password: "password123" },
          validationSchema: loginSchema,
          onSubmit,
        }),
      );

      await act(async () => {
        await result.current.handleSubmit({
          preventDefault: vi.fn(),
        } as any);
      });

      // Should not be submitting after error
      expect(result.current.isSubmitting).toBe(false);
    });
  });

  describe("Form State Management", () => {
    it("should update values when handleChange is called", () => {
      const onSubmit = vi.fn();

      const { result } = renderHook(() =>
        useAuthForm({
          initialValues: { email: "", password: "" },
          validationSchema: loginSchema,
          onSubmit,
        }),
      );

      act(() => {
        result.current.handleChange("email", "test@example.com");
      });

      expect(result.current.values.email).toBe("test@example.com");
    });

    it("should reset form to initial values", () => {
      const initialValues = { email: "", password: "" };
      const onSubmit = vi.fn();

      const { result } = renderHook(() =>
        useAuthForm({
          initialValues,
          validationSchema: loginSchema,
          onSubmit,
        }),
      );

      // Change values
      act(() => {
        result.current.handleChange("email", "test@example.com");
        result.current.setFieldError("email", "Some error");
      });

      // Reset
      act(() => {
        result.current.resetForm();
      });

      expect(result.current.values).toEqual(initialValues);
      expect(result.current.errors).toEqual({});
      expect(result.current.touched).toEqual({});
      expect(result.current.isSubmitting).toBe(false);
    });

    it("should validate entire form on submit", async () => {
      const onSubmit = vi.fn().mockResolvedValue(undefined);

      const { result } = renderHook(() =>
        useAuthForm({
          initialValues: { email: "invalid", password: "123" },
          validationSchema: loginSchema,
          onSubmit,
        }),
      );

      await act(async () => {
        await result.current.handleSubmit({
          preventDefault: vi.fn(),
        } as any);
      });

      // Should have validation errors
      expect(Object.keys(result.current.errors).length).toBeGreaterThan(0);

      // Should not have called onSubmit
      expect(onSubmit).not.toHaveBeenCalled();
    });

    it("should call onSubmit with valid data", async () => {
      const onSubmit = vi.fn().mockResolvedValue(undefined);
      const validData = { email: "test@example.com", password: "password123" };

      const { result } = renderHook(() =>
        useAuthForm({
          initialValues: validData,
          validationSchema: loginSchema,
          onSubmit,
        }),
      );

      await act(async () => {
        await result.current.handleSubmit({
          preventDefault: vi.fn(),
        } as any);
      });

      // Should have called onSubmit with the data
      expect(onSubmit).toHaveBeenCalledWith(validData);
    });
  });
});
