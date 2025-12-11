/**
 * Reusable hook for authentication form state management
 * Handles form values, validation, errors, and submission
 */

import { useState, useCallback, FormEvent } from "react";
import { z } from "zod";
import { validateField, validateForm } from "@/lib/validation";

interface UseAuthFormOptions<T> {
  initialValues: T;
  validationSchema: z.ZodSchema<T>;
  onSubmit: (values: T) => Promise<void>;
}

interface UseAuthFormReturn<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  isSubmitting: boolean;
  touched: Partial<Record<keyof T, boolean>>;
  handleChange: (field: keyof T, value: unknown) => void;
  handleBlur: (field: keyof T) => void;
  handleSubmit: (e: FormEvent) => Promise<void>;
  setFieldError: (field: keyof T, error: string) => void;
  clearFieldError: (field: keyof T) => void;
  resetForm: () => void;
}

export function useAuthForm<T extends Record<string, unknown>>({
  initialValues,
  validationSchema,
  onSubmit,
}: UseAuthFormOptions<T>): UseAuthFormReturn<T> {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Handle field value changes
   */
  const handleChange = useCallback((field: keyof T, value: unknown) => {
    setValues((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  /**
   * Handle field blur - triggers validation
   */
  const handleBlur = useCallback(
    (field: keyof T) => {
      // Mark field as touched
      setTouched((prev) => ({
        ...prev,
        [field]: true,
      }));

      // Get the field schema from the validation schema
      // We need to validate just this field
      const fieldValue = values[field];

      // Create a schema for just this field
      const fieldSchema = (validationSchema as any).shape?.[field];

      if (fieldSchema) {
        const result = validateField(fieldSchema, fieldValue);

        if (!result.success && result.error) {
          setErrors((prev) => ({
            ...prev,
            [field]: result.error,
          }));
        }
      }
    },
    [values, validationSchema],
  );

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      // Mark all fields as touched
      const allTouched = Object.keys(values).reduce(
        (acc, key) => {
          acc[key as keyof T] = true;
          return acc;
        },
        {} as Partial<Record<keyof T, boolean>>,
      );
      setTouched(allTouched);

      // Validate entire form
      const validation = validateForm(validationSchema, values);

      if (!validation.success && validation.errors) {
        // Set all validation errors
        setErrors(validation.errors as Partial<Record<keyof T, string>>);
        return;
      }

      // Clear errors and submit
      setErrors({});
      setIsSubmitting(true);

      try {
        await onSubmit(values);
      } catch (error) {
        // Error handling is done in the onSubmit function
        // This just ensures isSubmitting is reset
      } finally {
        setIsSubmitting(false);
      }
    },
    [values, validationSchema, onSubmit],
  );

  /**
   * Manually set a field error (useful for API errors)
   */
  const setFieldError = useCallback((field: keyof T, error: string) => {
    setErrors((prev) => ({
      ...prev,
      [field]: error,
    }));
  }, []);

  /**
   * Clear a specific field error
   */
  const clearFieldError = useCallback((field: keyof T) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  /**
   * Reset form to initial state
   */
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  return {
    values,
    errors,
    isSubmitting,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldError,
    clearFieldError,
    resetForm,
  };
}
