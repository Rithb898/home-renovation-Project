"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuthForm } from "@/hooks/use-auth-form";
import { signupSchema, type SignupFormData } from "@/lib/validation";
import { apiClient, type ApiError } from "@/lib/api-client";
import { emailSchema, validateField } from "@/lib/validation";

export default function Signup() {
  const router = useRouter();
  const [emailCheckStatus, setEmailCheckStatus] = useState<
    "idle" | "checking" | "available" | "unavailable"
  >("idle");
  const [emailCheckError, setEmailCheckError] = useState<string>("");
  const emailCheckTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const handleSignup = useCallback(
    async (values: SignupFormData) => {
      try {
        // Call the signup API
        await apiClient.post("/auth/signup", {
          name: values.name,
          email: values.email,
          password: values.password,
        });

        // Redirect to dashboard on success
        router.push("/dashboard");
      } catch (error) {
        const apiError = error as ApiError;

        // Handle specific error cases
        if (apiError.statusCode === 409) {
          // Email already registered
          setFieldError("email", "This email is already registered");
        } else if (apiError.statusCode === 400 && apiError.errors) {
          // Validation errors from backend
          apiError.errors.forEach((err) => {
            const field = err.path?.[0] as keyof SignupFormData;
            if (field) {
              setFieldError(field, err.message);
            }
          });
        } else {
          // Generic error
          setFieldError(
            "email",
            apiError.message || "An error occurred. Please try again.",
          );
        }
      }
    },
    [router],
  );

  const {
    values,
    errors,
    isSubmitting,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldError,
  } = useAuthForm<SignupFormData>({
    initialValues: {
      name: "",
      email: "",
      password: "",
      terms: false,
    },
    validationSchema: signupSchema,
    onSubmit: handleSignup,
  });

  // Email availability check with debounce
  const checkEmailAvailability = useCallback(async (email: string) => {
    // Validate email format first
    const validation = validateField(emailSchema, email);
    if (!validation.success) {
      setEmailCheckStatus("idle");
      return;
    }

    setEmailCheckStatus("checking");
    setEmailCheckError("");

    try {
      const response = await apiClient.post<{ available: boolean }>(
        "/auth/check-email",
        { email },
      );

      if (response.data.available) {
        setEmailCheckStatus("available");
      } else {
        setEmailCheckStatus("unavailable");
        setEmailCheckError("This email is already registered");
      }
    } catch (error) {
      setEmailCheckStatus("idle");
      setEmailCheckError("");
    }
  }, []);

  // Debounced email check on blur
  const handleEmailBlur = useCallback(() => {
    handleBlur("email");

    // Clear any existing timeout
    if (emailCheckTimeoutRef.current) {
      clearTimeout(emailCheckTimeoutRef.current);
    }

    // Only check if email has a value and no validation errors
    if (values.email && !errors.email) {
      emailCheckTimeoutRef.current = setTimeout(() => {
        checkEmailAvailability(values.email);
      }, 500);
    }
  }, [values.email, errors.email, handleBlur, checkEmailAvailability]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (emailCheckTimeoutRef.current) {
        clearTimeout(emailCheckTimeoutRef.current);
      }
    };
  }, []);

  // Reset email check status when email changes
  useEffect(() => {
    setEmailCheckStatus("idle");
    setEmailCheckError("");
  }, [values.email]);

  return (
    <div className="flex min-h-screen bg-white">
      {/* LEFT SIDE: Form */}
      <div className="order-2 flex w-full items-center justify-center p-8 sm:p-12 lg:order-1 lg:w-1/2 lg:p-24">
        <div className="w-full max-w-md">
          <Link
            href="/"
            className="mb-10 inline-block text-2xl font-extrabold tracking-tight text-slate-900 transition-opacity hover:opacity-80"
          >
            Huelip<span className="text-red-600">.</span>
          </Link>

          <h1 className="mb-2 text-3xl font-extrabold text-slate-900">
            Create Account
          </h1>
          <p className="mb-8 text-slate-500">
            Join Huelip to track your renovation progress and manage invoices.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Field */}
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Full Name
              </label>
              <input
                type="text"
                id="name"
                placeholder="John Doe"
                value={values.name}
                onChange={(e) => handleChange("name", e.target.value)}
                onBlur={() => handleBlur("name")}
                className={`w-full rounded-xl border px-5 py-4 text-slate-700 transition-all focus:bg-white focus:ring-2 focus:outline-none ${
                  errors.name && touched.name
                    ? "border-red-300 bg-red-50 focus:ring-red-500"
                    : "border-slate-200 bg-slate-50 focus:ring-red-500"
                }`}
                disabled={isSubmitting}
              />
              {errors.name && touched.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                placeholder="you@example.com"
                value={values.email}
                onChange={(e) => handleChange("email", e.target.value)}
                onBlur={handleEmailBlur}
                className={`w-full rounded-xl border px-5 py-4 text-slate-700 transition-all focus:bg-white focus:ring-2 focus:outline-none ${
                  (errors.email && touched.email) ||
                  emailCheckStatus === "unavailable"
                    ? "border-red-300 bg-red-50 focus:ring-red-500"
                    : emailCheckStatus === "available"
                      ? "border-green-300 bg-green-50 focus:ring-green-500"
                      : "border-slate-200 bg-slate-50 focus:ring-red-500"
                }`}
                disabled={isSubmitting}
              />
              {errors.email && touched.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
              {emailCheckStatus === "checking" && (
                <p className="mt-1 text-sm text-slate-500">
                  Checking availability...
                </p>
              )}
              {emailCheckStatus === "available" && !errors.email && (
                <p className="mt-1 text-sm text-green-600">
                  Email is available
                </p>
              )}
              {emailCheckStatus === "unavailable" && (
                <p className="mt-1 text-sm text-red-600">{emailCheckError}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Create Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="At least 6 characters"
                value={values.password}
                onChange={(e) => handleChange("password", e.target.value)}
                onBlur={() => handleBlur("password")}
                className={`w-full rounded-xl border px-5 py-4 text-slate-700 transition-all focus:bg-white focus:ring-2 focus:outline-none ${
                  errors.password && touched.password
                    ? "border-red-300 bg-red-50 focus:ring-red-500"
                    : "border-slate-200 bg-slate-50 focus:ring-red-500"
                }`}
                disabled={isSubmitting}
              />
              {errors.password && touched.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Terms Checkbox */}
            <div>
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="terms"
                  checked={values.terms}
                  onChange={(e) => handleChange("terms", e.target.checked)}
                  onBlur={() => handleBlur("terms")}
                  className={`mt-1 h-5 w-5 rounded text-red-600 focus:ring-red-500 ${
                    errors.terms && touched.terms
                      ? "border-red-300"
                      : "border-gray-300"
                  }`}
                  disabled={isSubmitting}
                />
                <label htmlFor="terms" className="text-sm text-slate-600">
                  I agree to Huelip's{" "}
                  <a href="#" className="text-red-600 hover:underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-red-600 hover:underline">
                    Privacy Policy
                  </a>
                  .
                </label>
              </div>
              {errors.terms && touched.terms && (
                <p className="mt-1 text-sm text-red-600">{errors.terms}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full transform rounded-full bg-red-600 py-4 font-bold text-white shadow-lg shadow-red-200 transition-all duration-200 hover:bg-red-500 hover:shadow-red-300 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-red-600"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="h-5 w-5 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating Account...
                </span>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <p className="mt-10 text-center text-slate-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-bold text-red-600 hover:text-red-700"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>

      {/* RIGHT SIDE: Image (Hidden on mobile) */}
      <div className="relative order-1 hidden w-1/2 bg-slate-50 lg:order-2 lg:block">
        <Image
          src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2906&auto=format&fit=crop"
          alt="Modern bright kitchen"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-r from-red-900/40 to-transparent" />
        <div className="absolute top-1/2 left-1/2 w-full -translate-x-1/2 -translate-y-1/2 transform px-12 text-center">
          <div className="rounded-2xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-md">
            <h3 className="mb-2 text-2xl font-bold text-white">
              Build Better.
            </h3>
            <p className="text-white/90">
              Join 2,000+ homeowners managing their renovations with Huelip.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
